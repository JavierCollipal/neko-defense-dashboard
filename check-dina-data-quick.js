require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const count = await db.collection('dina-agents').countDocuments();
    console.log(`Total dina-agents: ${count}`);
    
    if (count > 0) {
      const sample = await db.collection('dina-agents').findOne();
      console.log('\nSample fields:', Object.keys(sample).join(', '));
    } else {
      console.log('⚠️ Collection is EMPTY!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

check();
