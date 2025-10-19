const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
};
const DB_NAME = 'neko-defense-system';

async function checkReport() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    const report = await db.collection('investigation_reports').findOne({ 
      investigation_id: 'NEKO-INV-2025-10-12-001'
    });
    
    if (report) {
      console.log('✅ Investigation Report FOUND!');
      console.log('   ID: ' + report.investigation_id);
      console.log('   Title: ' + report.title);
      console.log('   Date: ' + report.date);
      console.log('   Bugs Fixed: ' + report.bugs_fixed.length);
      console.log('   Success Metrics: ' + JSON.stringify(report.success_metrics));
    } else {
      console.log('⚠️ Investigation Report NOT FOUND');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

checkReport();
