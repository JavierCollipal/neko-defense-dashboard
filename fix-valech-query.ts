#!/usr/bin/env ts-node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

async function fixValechQuery() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('neko-defense-system');
    
    // Check valech_consolidated
    const valechConsolidated = db.collection('valech_consolidated');
    const consolidatedCount = await valechConsolidated.countDocuments();
    console.log(`\n📊 valech_consolidated count: ${consolidatedCount}`);

    if (consolidatedCount > 0) {
      const sample = await valechConsolidated.findOne({});
      console.log('\n🔍 Sample valech_consolidated document:');
      console.log(JSON.stringify(sample, null, 2).substring(0, 1000) + '...');
    }

    // Check valech_victims
    const valechVictims = db.collection('valech_victims');
    const victimsCount = await valechVictims.countDocuments();
    console.log(`\n📊 valech_victims count: ${victimsCount}`);

    if (victimsCount > 0) {
      const sample = await valechVictims.findOne({});
      console.log('\n🔍 Sample valech_victims document:');
      console.log(JSON.stringify(sample, null, 2).substring(0, 1000) + '...');
    }

    // Fix dina-agents with proper names
    const dinaAgents = db.collection('dina-agents');
    const agents = await dinaAgents.find({}).toArray();
    console.log('\n👥 Current DINA agents:');
    agents.forEach((agent: any) => {
      console.log(`\nAgent ID: ${agent._id}`);
      console.log('Full document:', JSON.stringify(agent, null, 2));
    });

  } finally {
    await client.close();
  }
}

fixValechQuery();

// Make this a module to avoid global scope conflicts
export {};
