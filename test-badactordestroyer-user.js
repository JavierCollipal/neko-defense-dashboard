const { MongoClient } = require('mongodb');

// This is the URI you added to Vercel
const VERCEL_MONGODB_URI = 'mongodb+srv://badactordestroyer:vlB3Ga8tf0ah9jeA@free-cluster.svjei3w.mongodb.net/';

async function testVercelUser() {
  const client = new MongoClient(VERCEL_MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected with badactordestroyer user (Vercel credentials)');
    
    const db = client.db('neko-defense-system');
    
    // Test dina-agents collection
    const dinaCount = await db.collection('dina-agents').countDocuments();
    console.log(`\n📊 dina-agents count: ${dinaCount}`);
    
    if (dinaCount > 0) {
      const agents = await db.collection('dina-agents').find({}).limit(2).toArray();
      console.log('\n✅ Sample agents found:');
      agents.forEach(agent => {
        console.log(`  - ${agent.fullName} (${agent.codename})`);
      });
    } else {
      console.log('\n⚠️ dina-agents collection is EMPTY for badactordestroyer user!');
    }
    
  } catch (error) {
    console.error('❌ Error with badactordestroyer user:', error.message);
  } finally {
    await client.close();
  }
}

testVercelUser();
