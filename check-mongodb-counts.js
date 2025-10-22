#!/usr/bin/env node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkCounts() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    const collections = [
      'dina-agents',
      'family-members',
      'deceased-officers',
      'fallen-carabineros-officers'
    ];

    console.log('📊 MongoDB Collection Counts:\n');

    for (const collName of collections) {
      const count = await db.collection(collName).countDocuments();
      console.log(`${collName}: ${count}`);
    }

  } finally {
    await client.close();
  }
}

checkCounts();
