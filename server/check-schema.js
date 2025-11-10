// 🐾 Quick script to check MongoDB schema for translation needs, nyaa~!
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DATABASE || 'neko-defense-system';

async function checkSchema() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas, desu~!\n');

    const db = client.db(DB_NAME);

    // Check threat_actors collection
    console.log('🎯 THREAT ACTORS COLLECTION:');
    const threatActor = await db.collection('threat_actors').findOne({});
    if (threatActor) {
      console.log('Sample document fields:', Object.keys(threatActor));
      console.log(
        '\nSample document:',
        JSON.stringify(threatActor, null, 2).substring(0, 500)
      );
    }

    console.log('\n\n📚 DINA PERPETRATORS COLLECTION:');
    const perpetrator = await db
      .collection('dina_perpetrators')
      .findOne({ id: { $exists: true } });
    if (perpetrator) {
      console.log('Sample document fields:', Object.keys(perpetrator));
      console.log(
        '\nSample document:',
        JSON.stringify(perpetrator, null, 2).substring(0, 500)
      );
    }

    console.log('\n\n✅ Schema check complete, nyaa~!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkSchema();
