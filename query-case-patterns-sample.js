require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function inspectCasePatterns() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('case-patterns');
    
    // Get first 3 patterns to inspect structure
    const samples = await collection.find({}).limit(3).toArray();
    
    console.log('📚 Sample Case Patterns Structure:');
    console.log(JSON.stringify(samples, null, 2));
    
  } finally {
    await client.close();
  }
}

inspectCasePatterns();
