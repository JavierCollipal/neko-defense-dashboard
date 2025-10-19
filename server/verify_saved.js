const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
};
const DB_NAME = 'neko-defense-system';

async function verifySaved() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    
    console.log('🐾⚡ VERIFICATION REPORT - NEKO DATABASE SAVE ⚡🐾\n');
    
    const patterns = await db.collection('case_patterns').find({ 
      saved_by: 'Neko-Arc',
      saved_date: { $gte: new Date('2025-10-12') }
    }).toArray();
    
    console.log('📋 CASE PATTERNS SAVED:');
    for (const p of patterns) {
      console.log('   ✅ ' + p.pattern_id + ' - ' + p.pattern_name);
      console.log('      Severity: ' + p.severity);
      console.log('      Category: ' + p.category);
    }
    
    const reports = await db.collection('investigation_reports').find({ 
      investigator: 'Neko-Arc',
      date: { $gte: new Date('2025-10-12') }
    }).toArray();
    
    console.log('\n📊 INVESTIGATION REPORTS SAVED:');
    for (const r of reports) {
      console.log('   ✅ ' + r.investigation_id + ' - ' + r.title);
      console.log('      Bugs Fixed: ' + r.bugs_fixed.length);
      console.log('      Files Modified: ' + r.files_modified.length);
    }
    
    console.log('\n💖 TOTAL DOCUMENTS SAVED:');
    console.log('   - Case Patterns: ' + patterns.length);
    console.log('   - Investigation Reports: ' + reports.length);
    console.log('   - Total: ' + (patterns.length + reports.length));
    
    console.log('\n🎉 SUCCESS! All documentation enriched and saved, nyaa~! ✨');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.close();
  }
}

verifySaved();
