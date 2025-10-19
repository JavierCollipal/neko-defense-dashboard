#!/usr/bin/env node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkThreatActors() {
  console.log('🔍 Checking threat-actors collection...\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    const db = client.db('neko-defense-system');
    const collection = db.collection('threat-actors');

    const count = await collection.countDocuments({});
    console.log(`📊 Total threat-actors: ${count}\n`);

    if (count > 0) {
      const sample = await collection.find({}).limit(3).toArray();
      console.log('📋 Sample documents:');
      sample.forEach((doc, i) => {
        console.log(`${i + 1}. ${doc.name || doc._id} (${doc.threat_level || 'unknown'})`);
      });
    } else {
      console.log('⚠️  Collection is EMPTY!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkThreatActors();
