#!/usr/bin/env node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

async function queryDINAStructure() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    const db = client.db('neko-defense-system');
    
    // Query dina_brigades_structure
    console.log('🔍 Querying dina_brigades_structure...');
    const brigadesCollection = db.collection('dina_brigades_structure');
    const brigadesCount = await brigadesCollection.countDocuments();
    console.log(`📊 Total brigade records: ${brigadesCount}`);

    if (brigadesCount > 0) {
      const brigades = await brigadesCollection.find({}).toArray();
      console.log('\n🏢 DINA Brigade Structure:');
      console.log(JSON.stringify(brigades, null, 2));
    }

    // Query dina_knowledge_base for relationships
    console.log('\n🔍 Querying dina_knowledge_base...');
    const knowledgeCollection = db.collection('dina_knowledge_base');
    const knowledgeCount = await knowledgeCollection.countDocuments();
    console.log(`📊 Total knowledge base records: ${knowledgeCount}`);

    if (knowledgeCount > 0) {
      const knowledge = await knowledgeCollection.find({}).limit(3).toArray();
      console.log('\n📚 Sample knowledge base:');
      console.log(JSON.stringify(knowledge, null, 2));
    }

    // Query dina_consolidated for comprehensive data
    console.log('\n🔍 Querying dina_consolidated...');
    const consolidatedCollection = db.collection('dina_consolidated');
    const consolidatedCount = await consolidatedCollection.countDocuments();
    console.log(`📊 Total consolidated records: ${consolidatedCount}`);

    if (consolidatedCount > 0) {
      const consolidated = await consolidatedCollection.find({}).limit(2).toArray();
      console.log('\n📦 Sample consolidated data:');
      console.log(JSON.stringify(consolidated, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

queryDINAStructure();
