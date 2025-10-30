#!/usr/bin/env node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

async function queryDINAAgents() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    const db = client.db('neko-defense-system');
    
    // Check available collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Query dina-agents collection
    console.log('\n🔍 Querying dina-agents collection...');
    const dinaCollection = db.collection('dina-agents');
    const dinaCount = await dinaCollection.countDocuments();
    console.log(`📊 Total DINA agents: ${dinaCount}`);

    if (dinaCount > 0) {
      const agents = await dinaCollection.find({}).limit(5).toArray();
      console.log('\n👥 Sample DINA agents:');
      console.log(JSON.stringify(agents, null, 2));
    } else {
      console.log('⚠️ No DINA agents found in collection');
    }

    // Also check threat-actors for any DINA-related entries
    console.log('\n🔍 Checking threat-actors for DINA references...');
    const threatActors = db.collection('threat-actors');
    const dinaRelated = await threatActors.find({
      $or: [
        { organization: /DINA/i },
        { tags: /DINA/i },
        { description: /DINA/i }
      ]
    }).toArray();
    
    console.log(`📊 DINA-related threat actors: ${dinaRelated.length}`);
    if (dinaRelated.length > 0) {
      console.log(JSON.stringify(dinaRelated, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

queryDINAAgents();
