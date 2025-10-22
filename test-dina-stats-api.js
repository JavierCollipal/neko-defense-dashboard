require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function testDinaStats() {
  if (!MONGODB_URI) {
    console.error('❌ MongoDB URI not configured');
    return;
  }

  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('neko-defense-system');
    const perpetratorsCollection = db.collection('dina-agents');
    
    const totalPerpetrators = await perpetratorsCollection.countDocuments();
    console.log(`📊 Total perpetrators: ${totalPerpetrators}`);

    const convicted = await perpetratorsCollection.countDocuments({
      'legalStatus.convicted': true
    });
    console.log(`⚖️ Convicted: ${convicted}`);

    const atLarge = await perpetratorsCollection.countDocuments({
      status: { $regex: /AT LARGE/i }
    });
    console.log(`🏃 At large: ${atLarge}`);

    const neverProsecuted = await perpetratorsCollection.countDocuments({
      status: { $regex: /NEVER PROSECUTED/i }
    });
    console.log(`🚫 Never prosecuted: ${neverProsecuted}`);

    const stats = {
      perpetrators: {
        total_known_agents: 1097,
        documented: totalPerpetrators,
        convicted: convicted,
        atLarge: atLarge,
        neverProsecuted: neverProsecuted
      }
    };

    console.log('\n✅ API Response would be:');
    console.log(JSON.stringify({ success: true, data: stats }, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testDinaStats();
