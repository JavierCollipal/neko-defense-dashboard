#!/usr/bin/env node

// 🐾 Debug: Check if our agents are in the EXACT collection Vercel uses

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function debugVercelCollection() {
  console.log('🔍 DEBUGGING VERCEL COLLECTION MISMATCH');
  console.log('═══════════════════════════════════════════════');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    console.log('\n📊 CHECKING EXACT COLLECTION VERCEL USES:');
    console.log('Collection: dina_agents_comprehensive_backup');

    const vercelCollection = db.collection('dina_agents_comprehensive_backup');
    const vercelCount = await vercelCollection.countDocuments();
    console.log(`Agent count: ${vercelCount}`);

    if (vercelCount === 4) {
      console.log('❌ PROBLEM FOUND! Vercel collection only has 4 agents!');
      console.log('This means our expansion went to a DIFFERENT collection!');
    } else {
      console.log('✅ Vercel collection has the expected agent count!');
    }

    console.log('\n🔍 CHECKING ALL DINA COLLECTIONS:');
    const collections = await db.listCollections().toArray();

    for (const coll of collections) {
      if (coll.name.includes('dina')) {
        const count = await db.collection(coll.name).countDocuments();
        console.log(`📂 ${coll.name}: ${count} documents`);
      }
    }

    console.log('\n🎯 SEARCHING FOR OUR ADDED AGENTS:');
    const targetNames = [
      'Eugenio Berríos Sagredo',
      'Walter Rauff'
    ];

    const allCollections = collections.filter(c => c.name.includes('dina') || c.name.includes('agent'));

    for (const coll of allCollections) {
      console.log(`\n🔍 Searching in: ${coll.name}`);
      for (const name of targetNames) {
        const found = await db.collection(coll.name).findOne({ fullName: name });
        if (found) {
          console.log(`✅ Found ${name} in: ${coll.name}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await client.close();
  }
}

debugVercelCollection().catch(console.error);