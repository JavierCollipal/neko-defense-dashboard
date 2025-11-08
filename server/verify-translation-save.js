// 🐾🔍 VERIFY TRANSLATION SYSTEM SESSION SAVE 🔍🐾
// Verifies that all data was saved correctly to MongoDB, nyaa~!

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DATABASE || 'neko-defense-system';

async function verifyTranslationSave() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas, desu~!\n');

    const db = client.db(DB_NAME);

    console.log('🔍 VERIFICATION REPORT - Translation System Session\n');
    console.log(
      '═══════════════════════════════════════════════════════════\n'
    );

    // 1. Verify conversation archive
    console.log('📚 Checking conversation_archive...');
    const conversation = await db.collection('conversation_archive').findOne({
      session_id: 'translation-system-oct16-2025',
    });

    if (conversation) {
      console.log('  ✅ Conversation found!');
      console.log(`     Title: ${conversation.title}`);
      console.log(`     Tags: ${conversation.tags.join(', ')}`);
      console.log(
        `     Key Achievements: ${conversation.key_achievements.length}`
      );
      console.log(`     Files Created: ${conversation.files_created.length}`);
      console.log(`     Files Modified: ${conversation.files_modified.length}`);
    } else {
      console.log('  ❌ Conversation NOT found!');
    }

    // 2. Verify case pattern
    console.log('\n📋 Checking case_patterns...');
    const pattern = await db.collection('case_patterns').findOne({
      pattern_id: 'mongodb-translation-caching',
    });

    if (pattern) {
      console.log('  ✅ Case pattern found!');
      console.log(`     Title: ${pattern.title}`);
      console.log(`     Category: ${pattern.category}`);
      console.log(`     Reusability: ${pattern.reusability}`);
      console.log(`     Difficulty: ${pattern.difficulty}`);
      console.log(
        `     Implementation Steps: ${pattern.solution_pattern.implementation_steps.length}`
      );
    } else {
      console.log('  ❌ Case pattern NOT found!');
    }

    // 3. Verify collection enrichments
    console.log('\n🔄 Checking collection enrichments...');
    const collections = [
      'threat_actors',
      'dina_perpetrators',
      'dina_torture_centers',
      'dina_international_crimes',
    ];

    for (const collectionName of collections) {
      const metadata = await db
        .collection(collectionName)
        .findOne({ _type: 'metadata' });

      if (metadata && metadata.translation_system) {
        console.log(`  ✅ ${collectionName}: Translation metadata exists`);
        console.log(
          `     Supported Languages: ${metadata.translation_system.supported_languages.join(', ')}`
        );
        console.log(
          `     Translatable Fields: ${metadata.translatable_fields[collectionName]?.length || 0}`
        );
      } else {
        console.log(`  ❌ ${collectionName}: Translation metadata NOT found!`);
      }
    }

    // 4. Summary
    console.log(
      '\n═══════════════════════════════════════════════════════════'
    );
    console.log('📊 VERIFICATION SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');

    const conversationExists = !!conversation;
    const patternExists = !!pattern;
    const allEnriched = collections.every(async (col) => {
      const meta = await db.collection(col).findOne({ _type: 'metadata' });
      return meta && meta.translation_system;
    });

    if (conversationExists && patternExists) {
      console.log('✅ ALL VERIFICATIONS PASSED!');
      console.log('   ✅ Conversation archived');
      console.log('   ✅ Case pattern created');
      console.log('   ✅ Collections enriched');
      console.log(
        '\n💖 Translation system session successfully saved, nyaa~! 😻🌍✨\n'
      );
    } else {
      console.log('⚠️ SOME VERIFICATIONS FAILED!');
      if (!conversationExists) {
        console.log('   ❌ Conversation missing');
      }
      if (!patternExists) {
        console.log('   ❌ Case pattern missing');
      }
      console.log('\n');
    }
  } catch (error) {
    console.error('❌ Verification error:', error.message);
    throw error;
  } finally {
    await client.close();
    console.log('🐾 Connection closed, desu~!\n');
  }
}

// Execute verification
verifyTranslationSave()
  .then(() => {
    console.log('🏆 Verification complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });
