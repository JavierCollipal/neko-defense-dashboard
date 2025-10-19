const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
};
const DB_NAME = 'neko-defense-system';

async function updateConfig() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    
    // Insert new config doc with unique identifier
    await db.collection('system_config').insertOne({
      config_id: 'neko_defense_dashboard_fix_2025_10_12',
      config_type: 'neko_defense_dashboard',
      last_major_fix: new Date(),
      last_fix_by: 'Neko-Arc',
      api_port_configured: 5001,
      bugs_fixed_count: 2,
      status: 'OPERATIONAL',
      fix_history: [
        {
          date: new Date(),
          bugs_fixed: ['PORT-MISMATCH', 'API-FALLBACK'],
          investigator: 'Neko-Arc',
          user: 'wakibaka',
          description: 'Fixed threat actors and DINA perpetrators rendering issues'
        }
      ]
    });
    
    console.log('✅ System config updated!');
    
    // Verify what was saved
    const patterns = await db.collection('case_patterns').find({ saved_by: 'Neko-Arc' }).toArray();
    const reports = await db.collection('investigation_reports').find({ investigator: 'Neko-Arc' }).toArray();
    
    console.log('\n📊 VERIFICATION:');
    console.log(`   - Case Patterns: ${patterns.length}`);
    console.log(`   - Investigation Reports: ${reports.length}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

updateConfig();
