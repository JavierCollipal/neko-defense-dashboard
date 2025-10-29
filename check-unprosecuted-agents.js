#!/usr/bin/env node

// 🐾 Neko-Arc Database Verification: Unprosecuted Agents Check

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkUnprosecutedAgents() {
  console.log('🔍 CHECKING UNPROSECUTED AGENTS IN DATABASE...');
  console.log('═══════════════════════════════════════════════════');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('dina_agents_comprehensive_backup');

    console.log('\n📊 TOTAL AGENT COUNT:');
    const totalCount = await collection.countDocuments();
    console.log(`   Total agents: ${totalCount}`);

    console.log('\n🔍 SEARCHING FOR UNPROSECUTED AGENTS...');

    // Search with different field variations
    const searchCriteria = [
      { justiceStatus: 'JUSTICE NEVER SERVED' },
      { justiceStatus: 'ESCAPED JUSTICE' },
      { justiceStatus: { $regex: /NEVER.*PROSECUTED/i } },
      { status: { $regex: /NEVER.*PROSECUTED/i } },
      { fullName: 'Eugenio Berríos Sagredo' },
      { fullName: 'Walter Rauff' }
    ];

    for (const criteria of searchCriteria) {
      const found = await collection.find(criteria).toArray();
      console.log(`\n🎯 Search: ${JSON.stringify(criteria)}`);
      console.log(`   Found: ${found.length} agents`);

      if (found.length > 0) {
        found.forEach(agent => {
          console.log(`   • ${agent.fullName} - Status: ${agent.status || 'N/A'} - Justice: ${agent.justiceStatus || 'N/A'}`);
        });
      }
    }

    console.log('\n📋 RECENT ADDITIONS (Last 5 by creation date):');
    const recentAgents = await collection.find({})
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    recentAgents.forEach((agent, index) => {
      console.log(`   ${index + 1}. ${agent.fullName}`);
      console.log(`      Status: ${agent.status || 'N/A'}`);
      console.log(`      Justice Status: ${agent.justiceStatus || 'N/A'}`);
      console.log(`      Role: ${agent.role || 'N/A'}`);
      console.log('');
    });

    console.log('🔍 CHECKING FOR SPECIFIC UNPROSECUTED NAMES:');
    const targetNames = [
      'Eugenio Berríos Sagredo',
      'Walter Rauff',
      'Christoph Willeke',
      'Fernando Laureani Maturana',
      'Gerhard Georg Mertins'
    ];

    for (const name of targetNames) {
      const found = await collection.findOne({ fullName: name });
      if (found) {
        console.log(`✅ Found: ${name}`);
        console.log(`   Status: ${found.status}`);
        console.log(`   Justice: ${found.justiceStatus || 'N/A'}`);
      } else {
        console.log(`❌ Missing: ${name}`);
      }
    }

  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await client.close();
  }

  console.log('\n💖 Database verification complete, nyaa~!');
}

checkUnprosecutedAgents().catch(console.error);