// 🐾⚡ FIX SYSTEM CONFIG SAVE - Testing Stats ⚡🐾
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/';
const DATABASE_NAME = 'neko-defense-system';

async function fixSystemConfigSave() {
  console.log('🐾⚡ Fixing system_config save, nyaa~!');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB successfully, desu!');

    const db = client.db(DATABASE_NAME);

    // Use replaceOne with _id for system_config
    console.log('\n⚙️ Updating system_config with latest testing stats...');

    const configDoc = {
      _id: 'cypress_testing_stats_oct12_2025',
      config_type: 'testing_statistics',
      config_key: 'cypress_testing_stats',

      total_test_suites: 13,
      total_tests: 451,
      total_lines: 4761,
      coverage_percent: '98%',
      component_coverage: '100%',

      previous_stats: {
        total_test_suites: 9,
        total_tests: 286,
        total_lines: 2731,
        coverage_percent: '90%',
        component_coverage: '90%'
      },

      improvements: {
        test_suites_added: 4,
        tests_added: 165,
        lines_added: 2030,
        coverage_increase: '+8%',
        component_coverage_increase: '+10%'
      },

      session_id: 'testing-coverage-98pct-oct12-2025',
      last_updated: new Date().toISOString(),
      updated_by: 'neko-arc'
    };

    const result = await db.collection('system_config').replaceOne(
      { _id: 'cypress_testing_stats_oct12_2025' },
      configDoc,
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log('✅ System config created successfully!');
    } else if (result.modifiedCount > 0) {
      console.log('✅ System config updated successfully!');
    } else {
      console.log('✅ System config already up to date!');
    }

    console.log('\n🎊 System config save COMPLETE, nyaa~! 😻⚡');

  } catch (error) {
    console.error('❌ Error fixing system_config:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed, desu!');
  }
}

fixSystemConfigSave()
  .then(() => {
    console.log('✅ Fix script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fix script failed:', error);
    process.exit(1);
  });
