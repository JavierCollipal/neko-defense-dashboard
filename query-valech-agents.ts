#!/usr/bin/env ts-node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

async function queryValechAgents() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');

    const db = client.db('neko-defense-system');
    
    // Check Valech collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Available collections:');
    collections.forEach((col: any) => console.log(`  - ${col.name}`));

    // Query valech-testimonies for agent mentions
    const valechTestimonies = db.collection('valech-testimonies');
    const count = await valechTestimonies.countDocuments();
    console.log(`\n📊 Total Valech testimonies: ${count}`);

    // Sample testimonies to find agent patterns
    const samples = await valechTestimonies.find({}).limit(10).toArray();
    console.log('\n🔍 Sample testimonies:');
    samples.forEach((testimony: any, idx: number) => {
      console.log(`\n--- Testimony ${idx + 1} ---`);
      console.log('ID:', testimony._id);
      if (testimony.agents_mentioned) {
        console.log('Agents:', testimony.agents_mentioned);
      }
      if (testimony.testimony_text) {
        console.log('Text preview:', testimony.testimony_text.substring(0, 200) + '...');
      }
    });

    // Get existing DINA agents
    const dinaAgents = db.collection('dina-agents');
    const existingAgents = await dinaAgents.find({}).toArray();
    console.log(`\n👥 Existing DINA agents in database: ${existingAgents.length}`);
    existingAgents.forEach((agent: any) => {
      console.log(`  - ${agent.name} (${agent.role || 'Unknown role'})`);
    });

  } finally {
    await client.close();
  }
}

queryValechAgents();

// Make this a module to avoid global scope conflicts
export {};
