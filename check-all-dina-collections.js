const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
};

async function checkAll() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('neko_defense_system');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    const dinaCollections = collections.filter(c => c.name.toLowerCase().includes('dina'));
    
    console.log('🔍 DINA-related collections:');
    for (const coll of dinaCollections) {
      const count = await db.collection(coll.name).countDocuments();
      console.log(`  📁 ${coll.name}: ${count} documents`);
      
      if (count > 0 && count < 30) {
        const sample = await db.collection(coll.name).findOne({});
        console.log(`     Sample:`, JSON.stringify(sample, null, 2).substring(0, 300));
      }
    }
    
  } finally {
    await client.close();
  }
}

checkAll().catch(console.error);
