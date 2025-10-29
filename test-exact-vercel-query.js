#!/usr/bin/env node

// 🐾 Test: Execute EXACT same query that Vercel API uses

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function testExactVercelQuery() {
  console.log('🎯 TESTING EXACT VERCEL API QUERY');
  console.log('═══════════════════════════════════════════════');
  console.log(`🔗 MongoDB URI: ${MONGODB_URI ? 'SET ✅' : 'MISSING ❌'}`);

  if (!MONGODB_URI) {
    console.log('❌ MONGODB_URI not set - would return empty array!');
    return;
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('neko-defense-system');
    console.log('✅ Using database: neko-defense-system');

    const collection = db.collection('dina_agents_comprehensive_backup');
    console.log('✅ Using collection: dina_agents_comprehensive_backup');

    // Execute EXACT same query as Vercel API
    console.log('\n🔍 Executing: collection.find({}).toArray()');
    const dinaAgents = await collection.find({}).toArray();

    console.log(`📊 Query result: ${dinaAgents.length} agents found`);

    if (dinaAgents.length === 4) {
      console.log('❌ PROBLEM: Getting only 4 agents like Vercel!');
      console.log('This means there\'s an issue with the database state');
    } else if (dinaAgents.length === 38) {
      console.log('✅ CORRECT: Getting 38 agents as expected');
      console.log('This means Vercel should also get 38 agents');
    }

    console.log('\n📋 First 5 agents:');
    dinaAgents.slice(0, 5).forEach((agent, i) => {
      console.log(`   ${i + 1}. ${agent.fullName} (${agent.status})`);
    });

    console.log('\n🔍 Looking for unprosecuted agents:');
    const unprosecuted = dinaAgents.filter(agent =>
      agent.fullName === 'Eugenio Berríos Sagredo' ||
      agent.fullName === 'Walter Rauff'
    );

    console.log(`Found ${unprosecuted.length} unprosecuted agents:`);
    unprosecuted.forEach(agent => {
      console.log(`   • ${agent.fullName} - ${agent.status}`);
    });

    // Simulate exact API response
    const apiResponse = {
      success: true,
      data: dinaAgents,
      count: dinaAgents.length
    };

    console.log('\n🎯 SIMULATED API RESPONSE:');
    console.log(`   success: ${apiResponse.success}`);
    console.log(`   count: ${apiResponse.count}`);
    console.log(`   data length: ${apiResponse.data.length}`);

    if (apiResponse.count !== 38) {
      console.log('\n❌ ISSUE IDENTIFIED:');
      console.log('   The database query is not returning 38 agents!');
      console.log('   This explains why Vercel only shows 4 agents.');
    } else {
      console.log('\n✅ QUERY WORKS CORRECTLY:');
      console.log('   Database returns 38 agents as expected');
      console.log('   Vercel issue might be caching or environment variables');
    }

  } catch (error) {
    console.error('❌ Query failed:', error.message);
    console.log('This could explain why Vercel is not working properly');
  } finally {
    await client.close();
  }
}

testExactVercelQuery().catch(console.error);