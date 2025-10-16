const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/';

async function verifyMCPTroubleshooting() {
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
      .findOne({ title: "MCP MongoDB Server ECONNREFUSED - Atlas vs Local Configuration Mismatch" });

    if (pattern) {
      console.log('✅ Case Pattern Found!');
      console.log(`   ID: ${pattern._id}`);
      console.log(`   Title: "${pattern.title}"`);
      console.log(`   Category: ${pattern.category}`);
      console.log(`   Reusability: ${pattern.reusability}`);
      console.log(`   Difficulty: ${pattern.difficulty}`);
      console.log(`   Estimated Time: ${pattern.estimatedTime}`);
      console.log(`   Solution Steps: ${pattern.solution.steps.length}`);
      console.log(`   Diagnostic Commands: ${pattern.diagnosticCommands.length}`);
      console.log(`   Tags: ${pattern.tags.join(', ')}`);
      console.log(`   Root Cause: ${pattern.rootCause.primary}`);
      console.log(`   Recommended Solution: ${pattern.solution.recommendedOption}`);
    } else {
      console.log('❌ Case Pattern NOT found!');
    }

    // Check enriched_sessions
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📝 VERIFYING ENRICHED SESSION');
    console.log('═══════════════════════════════════════════════════════════');

    const session = await db.collection('enriched_sessions')
      .findOne({ sessionId: "mcp-mongodb-econnrefused-oct15-2025" });

    if (session) {
      console.log('✅ Enriched Session Found!');
      console.log(`   ID: ${session._id}`);
      console.log(`   Session ID: ${session.sessionId}`);
      console.log(`   Type: ${session.type}`);
      console.log(`   Category: ${session.category}`);
      console.log(`   Issue: "${session.issue}"`);
      console.log(`   Investigation Steps: ${session.investigationProcess.steps.length}`);
      console.log(`   Commands Executed: ${session.investigationProcess.commandsExecuted.length}`);
      console.log(`   Local MongoDB Status: ${session.investigationProcess.findings.localMongoDBStatus}`);
      console.log(`   MCP Server Default: ${session.investigationProcess.findings.mcpServerDefaults.defaultConnectionString}`);
      console.log(`   User Scripts Connection: ${session.investigationProcess.findings.userScriptsConnection}`);
      console.log(`   Root Cause: ${session.rootCauseAnalysis.reason}`);
      console.log(`   Solution: ${session.solutionProvided.recommended}`);
      console.log(`   Keywords: ${session.keywords.join(', ')}`);
      console.log(`   Neko Investigation Depth: ${session.nekoMetadata.investigationDepth}`);
      console.log(`   Purrs: ${'😻'.repeat(session.nekoMetadata.purrsOfSatisfaction)}`);
    } else {
      console.log('❌ Enriched Session NOT found!');
    }

    // Count totals by category
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('📊 DATABASE TOTALS BY CATEGORY');
    console.log('═══════════════════════════════════════════════════════════');

    const totalPatterns = await db.collection('case_patterns').countDocuments();
    const troubleshootingPatterns = await db.collection('case_patterns').countDocuments({
      category: "MCP Server Troubleshooting"
    });

    const totalSessions = await db.collection('enriched_sessions').countDocuments();
    const troubleshootingSessions = await db.collection('enriched_sessions').countDocuments({
      type: "troubleshooting"
    });

    console.log(`📚 Total Case Patterns: ${totalPatterns}`);
    console.log(`   🔧 Troubleshooting Patterns: ${troubleshootingPatterns}`);
    console.log(`📝 Total Enriched Sessions: ${totalSessions}`);
    console.log(`   🔍 Troubleshooting Sessions: ${troubleshootingSessions}`);

    // Show all case pattern categories
    console.log('\n📂 All Case Pattern Categories:');
    const categories = await db.collection('case_patterns')
      .distinct('category');
    categories.forEach(cat => console.log(`   - ${cat}`));

    console.log('\n🐾 *purrs in database verification* NYA~! ✨');

  } catch (error) {
    console.error('❌ Error verifying session:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed, desu~!');
  }
}

verifyMCPTroubleshooting().catch(console.error);
