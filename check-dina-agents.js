const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/';

async function checkAgents() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db('neko_defense_system');
    
    // Check comprehensive collection
    const comprehensive = await db.collection('dina_agents_comprehensive')
      .find({}, { fullName: 1, rank: 1, alias: 1, organization: 1, status: 1 })
      .limit(10)
      .toArray();
    
    console.log('📊 Current DINA Agents (Comprehensive):');
    console.log(JSON.stringify(comprehensive, null, 2));
    
    const count = await db.collection('dina_agents_comprehensive').countDocuments();
    console.log(`\n✅ Total agents in comprehensive: ${count}`);
    
  } finally {
    await client.close();
  }
}

checkAgents().catch(console.error);
