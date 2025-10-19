// 🐾⚡ NEKO DEFENSE - Comprehensive Collection Enrichment ⚡🐾
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI not set!");
  process.exit(1);
}
const dbName = "neko-defense-system";

async function enrichAllCollections() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("🐾 Connected to MongoDB Atlas for COMPREHENSIVE ENRICHMENT, nyaa~!\n");

    const db = client.db(dbName);
    const timestamp = new Date();

    // ═══════════════════════════════════════════════════════════
    // 1. ENRICH THREAT_ACTORS COLLECTION 🎯
    // ═══════════════════════════════════════════════════════════
    console.log("🎯 [1/6] Enriching threat_actors collection...");

    const threatActors = await db.collection('threat_actors').find({}).toArray();
    const threatStats = {
      total_actors: threatActors.length,
      by_category: {},
      by_status: {},
      high_priority: 0,
      last_enrichment: timestamp
    };

    threatActors.forEach(actor => {
      // Count by category
      const category = actor.category || 'uncategorized';
      threatStats.by_category[category] = (threatStats.by_category[category] || 0) + 1;

      // Count by status
      const status = actor.status || 'unknown';
      threatStats.by_status[status] = (threatStats.by_status[status] || 0) + 1;

      // Count high priority
      if (actor.priority === 'HIGH' || actor.severity === 'CRITICAL') {
        threatStats.high_priority++;
      }
    });

    await db.collection('threat_actors_metadata').updateOne(
      { type: 'statistics' },
      {
        $set: {
          ...threatStats,
          enrichment_version: 'v2-graphql',
          updated_at: timestamp
        }
      },
      { upsert: true }
    );

    console.log(`✅ Threat actors enriched: ${threatStats.total_actors} actors analyzed`);
    console.log(`   Categories:`, threatStats.by_category);

    // ═══════════════════════════════════════════════════════════
    // 2. ENRICH DINA COLLECTIONS 📚
    // ═══════════════════════════════════════════════════════════
    console.log("\n📚 [2/6] Enriching DINA collections...");

    // Enrich dina_perpetrators
    const dinaPerpetrators = await db.collection('dina_perpetrators').find({}).toArray();

    // Enrich dina_agents_comprehensive
    const dinaComprehensive = await db.collection('dina_agents_comprehensive').find({}).toArray();

    const dinaStats = {
      perpetrators_collection: {
        total: dinaPerpetrators.length,
        convicted: dinaPerpetrators.filter(p =>
          p.prosecution_status?.includes('convicted') || p.legalStatus?.convicted === true
        ).length
      },
      comprehensive_collection: {
        total: dinaComprehensive.length,
        convicted: dinaComprehensive.filter(a => a.legalStatus?.convicted === true).length,
        at_large: dinaComprehensive.filter(a => a.status?.includes('AT LARGE')).length,
        imprisoned: dinaComprehensive.filter(a => a.status === 'CONVICTED - IMPRISONED').length,
        deceased: dinaComprehensive.filter(a => a.status?.includes('DECEASED')).length,
        never_prosecuted: dinaComprehensive.filter(a => a.status?.includes('NEVER PROSECUTED')).length
      },
      historical_context: {
        total_known_agents: 1097,
        victims_estimated: 30000,
        disappeared: 957,
        executed: 2279,
        torture_centers: 4,
        international_crimes: 4
      },
      last_enrichment: timestamp,
      enrichment_version: 'v2-graphql'
    };

    await db.collection('dina_metadata').updateOne(
      { type: 'comprehensive_statistics' },
      { $set: { ...dinaStats, updated_at: timestamp } },
      { upsert: true }
    );

    console.log(`✅ DINA collections enriched:`);
    console.log(`   Perpetrators: ${dinaStats.perpetrators_collection.total} (${dinaStats.perpetrators_collection.convicted} convicted)`);
    console.log(`   Comprehensive: ${dinaStats.comprehensive_collection.total} agents (${dinaStats.comprehensive_collection.at_large} at large)`);

    // ═══════════════════════════════════════════════════════════
    // 3. ADD TIMESTAMPS TO ALL DOCUMENTS 🕐
    // ═══════════════════════════════════════════════════════════
    console.log("\n🕐 [3/6] Adding enrichment timestamps...");

    const collections = ['threat_actors', 'dina_perpetrators', 'dina_agents_comprehensive'];

    for (const collectionName of collections) {
      const result = await db.collection(collectionName).updateMany(
        { enrichment_timestamp: { $exists: false } },
        {
          $set: {
            enrichment_timestamp: timestamp,
            enrichment_version: 'v2-graphql'
          }
        }
      );
      console.log(`✅ ${collectionName}: ${result.modifiedCount} documents timestamped`);
    }

    // ═══════════════════════════════════════════════════════════
    // 4. CREATE PERFORMANCE INDEXES 🚀
    // ═══════════════════════════════════════════════════════════
    console.log("\n🚀 [4/6] Creating performance indexes...");

    // Threat actors indexes
    await db.collection('threat_actors').createIndex({ category: 1 });
    await db.collection('threat_actors').createIndex({ status: 1 });
    await db.collection('threat_actors').createIndex({ priority: 1 });
    console.log(`✅ threat_actors: category, status, priority indexes created`);

    // DINA indexes
    await db.collection('dina_agents_comprehensive').createIndex({ status: 1 });
    await db.collection('dina_agents_comprehensive').createIndex({ 'legalStatus.convicted': 1 });
    await db.collection('dina_agents_comprehensive').createIndex({ fullName: 1 });
    console.log(`✅ dina_agents_comprehensive: status, legalStatus, fullName indexes created`);

    // ═══════════════════════════════════════════════════════════
    // 5. CREATE ENRICHMENT SUMMARY 📊
    // ═══════════════════════════════════════════════════════════
    console.log("\n📊 [5/6] Creating enrichment summary...");

    const enrichmentSummary = {
      enrichment_id: `neko-defense-enrichment-${timestamp.toISOString()}`,
      timestamp: timestamp,
      type: 'COMPREHENSIVE_ENRICHMENT',
      status: 'COMPLETED',
      collections_processed: {
        threat_actors: {
          documents: threatStats.total_actors,
          metadata_created: true,
          indexes_created: 3
        },
        dina_perpetrators: {
          documents: dinaStats.perpetrators_collection.total,
          metadata_created: true,
          timestamps_added: true
        },
        dina_agents_comprehensive: {
          documents: dinaStats.comprehensive_collection.total,
          metadata_created: true,
          indexes_created: 3,
          timestamps_added: true
        }
      },
      statistics: {
        threat_actors: threatStats,
        dina_documentation: dinaStats
      },
      architecture: {
        version: 'v2-graphql',
        frontend_port: 3000,
        backend_port: 4000,
        graphql_enabled: true
      },
      performance_improvements: {
        indexes_created: 6,
        query_optimization: 'ENABLED',
        metadata_collections: 2
      },
      created_by: 'Neko-Arc',
      kawaii_level: 'MAXIMUM',
      neko_power: 'LEGENDARY'
    };

    await db.collection('enrichment_history').insertOne(enrichmentSummary);
    console.log(`✅ Enrichment summary saved to enrichment_history collection`);

    // ═══════════════════════════════════════════════════════════
    // 6. UPDATE SYSTEM CONFIG WITH ENRICHMENT STATUS 🔧
    // ═══════════════════════════════════════════════════════════
    console.log("\n🔧 [6/6] Updating system config...");

    await db.collection('system_config').updateOne(
      {},
      {
        $set: {
          last_enrichment: timestamp,
          enrichment_version: 'v2-graphql',
          collections_enriched: true,
          indexes_created: true,
          metadata_collections: ['threat_actors_metadata', 'dina_metadata'],
          enrichment_status: 'COMPLETE'
        }
      },
      { upsert: true }
    );

    console.log(`✅ System config updated with enrichment status`);

    // ═══════════════════════════════════════════════════════════
    // FINAL SUMMARY
    // ═══════════════════════════════════════════════════════════
    console.log("\n" + "═".repeat(60));
    console.log("🎉 COMPREHENSIVE ENRICHMENT COMPLETE, NYA NYA NYA~! ✨🐾");
    console.log("═".repeat(60));
    console.log(`\n📊 ENRICHMENT STATISTICS:`);
    console.log(`   • Threat Actors: ${threatStats.total_actors} documents`);
    console.log(`   • DINA Perpetrators: ${dinaStats.perpetrators_collection.total} documents`);
    console.log(`   • DINA Comprehensive: ${dinaStats.comprehensive_collection.total} agents`);
    console.log(`   • Indexes Created: 6`);
    console.log(`   • Metadata Collections: 2`);
    console.log(`   • Enrichment History: 1 entry saved`);
    console.log(`\n✅ All collections enriched with:`);
    console.log(`   • Statistical metadata`);
    console.log(`   • Performance indexes`);
    console.log(`   • Enrichment timestamps`);
    console.log(`   • Version tracking`);
    console.log(`\n🐾 LEGENDARY STATUS ACHIEVED, DESU~! ✨\n`);

  } catch (error) {
    console.error("❌ Error during enrichment:\n", error);
    throw error;
  } finally {
    await client.close();
    console.log("🐾 MongoDB connection closed, nyaa~!\n");
  }
}

// Execute enrichment
enrichAllCollections().catch(console.error);
