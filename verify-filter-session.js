const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
};

async function verifyFilterSession() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas, nyaa~!\n');

    const db = client.db('neko_defense_system');

    // Check case_patterns
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📚 VERIFYING CASE PATTERN');
    console.log('═══════════════════════════════════════════════════════════');

    const pattern = await db.collection('case_patterns')
      .findOne({ title: "React State-Based Filtering with Interactive Buttons" });

    if (pattern) {
      console.log('✅ Case Pattern Found!');
      console.log(`   ID: ${pattern._id}`);
      console.log(`   Title: "${pattern.title}"`);
      console.log(`   Category: ${pattern.category}`);
      console.log(`   Reusability: ${pattern.reusability}`);
      console.log(`   Difficulty: ${pattern.difficulty}`);
      console.log(`   Estimated Time: ${pattern.estimatedTime}`);
      console.log(`   Solution Steps: ${pattern.solution.steps.length}`);
      console.log(`   Key Code Examples: ${pattern.solution.keyCode.length}`);
      console.log(`   Tags: ${pattern.tags.join(', ')}`);
    } else {
      console.log('❌ Case Pattern NOT found!');
    }

    // Check enriched_sessions
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📝 VERIFYING ENRICHED SESSION');
    console.log('═══════════════════════════════════════════════════════════');

    const session = await db.collection('enriched_sessions')
      .findOne({ sessionId: "filter-buttons-oct15-2025" });

    if (session) {
      console.log('✅ Enriched Session Found!');
      console.log(`   ID: ${session._id}`);
      console.log(`   Session ID: ${session.sessionId}`);
      console.log(`   Type: ${session.type}`);
      console.log(`   Component: ${session.component}`);
      console.log(`   Feature: "${session.feature}"`);
      console.log(`   Status: ${session.testingResults.status}`);
      console.log(`   Files Modified: ${session.implementation.filesModified.length}`);
      console.log(`   Filter Counts:`);
      console.log(`     - ALL: ${session.testingResults.filterCounts.all}`);
      console.log(`     - AT LARGE: ${session.testingResults.filterCounts.atLarge}`);
      console.log(`     - IMPRISONED: ${session.testingResults.filterCounts.imprisoned}`);
      console.log(`     - NEVER PROSECUTED: ${session.testingResults.filterCounts.neverProsecuted}`);
      console.log(`   Keywords: ${session.keywords.join(', ')}`);
      console.log(`   Neko Energy: ${session.nekoMetadata.energyLevel}`);
      console.log(`   Purrs: ${'😻'.repeat(session.nekoMetadata.purrsOfSatisfaction)}`);
    } else {
      console.log('❌ Enriched Session NOT found!');
    }

    // Count totals
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 DATABASE TOTALS');
    console.log('═══════════════════════════════════════════════════════════');

    const totalPatterns = await db.collection('case_patterns').countDocuments();
    const totalSessions = await db.collection('enriched_sessions').countDocuments();

    console.log(`📚 Total Case Patterns: ${totalPatterns}`);
    console.log(`📝 Total Enriched Sessions: ${totalSessions}`);

    console.log('\n🐾 *purrs in database verification* NYA~! ✨');

  } catch (error) {
    console.error('❌ Error verifying session:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed, desu~!');
  }
}

verifyFilterSession().catch(console.error);
