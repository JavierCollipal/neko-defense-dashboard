#!/usr/bin/env node

/**
 * 📺🐾 NEKO TV - MONGODB ATLAS STRUCTURE DISPLAY 🐾📺
 *
 * Beautiful terminal visualization of MongoDB instance structure
 * Shows databases, collections, document counts, and principles
 *
 * User request: "show me in the neko tv our mongo db instance order of database and principles"
 * Purpose: Understand current structure before implementing "one database per microservice"
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

async function displayMongoDBStructure() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    📺🐾 NEKO TV - MONGODB ATLAS 🐾📺                      ║');
  console.log('║                         Database Structure Report                          ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`🌐 Cluster: free-cluster.svjei3w.mongodb.net\n`);

    // Get admin database to list all databases
    const adminDb = client.db().admin();
    const { databases } = await adminDb.listDatabases();

    console.log('════════════════════════════════════════════════════════════════════════════');
    console.log('📊 DATABASES IN MONGODB ATLAS INSTANCE');
    console.log('════════════════════════════════════════════════════════════════════════════\n');

    // Sort databases by name for consistent ordering
    databases.sort((a, b) => a.name.localeCompare(b.name));

    let databaseNumber = 0;
    const databaseDetails = [];

    for (const database of databases) {
      // Skip system databases
      if (['admin', 'local', 'config'].includes(database.name)) {
        continue;
      }

      databaseNumber++;
      const db = client.db(database.name);
      const collections = await db.listCollections().toArray();

      console.log(`┌─────────────────────────────────────────────────────────────────────────┐`);
      console.log(`│ DATABASE #${databaseNumber}: ${database.name.padEnd(62)}│`);
      console.log(`│ Size: ${(database.sizeOnDisk / 1024 / 1024).toFixed(2)} MB`.padEnd(74) + '│');
      console.log(`└─────────────────────────────────────────────────────────────────────────┘`);

      if (collections.length === 0) {
        console.log('   📂 No collections (empty database)\n');
      } else {
        console.log(`   📂 Collections (${collections.length} total):\n`);

        // Sort collections alphabetically
        collections.sort((a, b) => a.name.localeCompare(b.name));

        const collectionData = [];

        for (const collection of collections) {
          const count = await db.collection(collection.name).countDocuments();
          collectionData.push({
            name: collection.name,
            count: count
          });

          console.log(`      ${count > 0 ? '✅' : '⚠️ '} ${collection.name.padEnd(35)} ${count.toString().padStart(6)} documents`);
        }

        databaseDetails.push({
          name: database.name,
          size: database.sizeOnDisk,
          collections: collectionData
        });

        console.log('');
      }
    }

    console.log('════════════════════════════════════════════════════════════════════════════');
    console.log('📋 CURRENT DATABASE ORGANIZATION PRINCIPLES');
    console.log('════════════════════════════════════════════════════════════════════════════\n');

    console.log('🎯 PRINCIPLE #1: SINGLE MONOLITHIC DATABASE');
    console.log('   Current State: One database (neko-defense-system) for entire application');
    console.log('   Collections: All features in same database\n');

    console.log('🎯 PRINCIPLE #2: FUNCTIONAL COLLECTION GROUPING');
    console.log('   threat-actors      → Threat intelligence data');
    console.log('   honeypot-triggers  → Security trap activations');
    console.log('   case-patterns      → Learned solution patterns');
    console.log('   hunt-conversations → Task/session documentation');
    console.log('   abilities          → Neko-Arc learned capabilities');
    console.log('   ready-operations   → Queued automation tasks');
    console.log('   evidence-packages  → Captured evidence data');
    console.log('   dina-agents        → DINA intelligence profiles\n');

    console.log('🎯 PRINCIPLE #3: MONGODB ATLAS CLOUD-ONLY');
    console.log('   ✅ NEVER use localhost:27017 (deprecated)');
    console.log('   ✅ ALWAYS use Atlas connection (mongodb+srv://)');
    console.log('   ✅ Rule 3.5 enforcement\n');

    console.log('🎯 PRINCIPLE #4: SHARED CONNECTION STRING');
    console.log('   All applications use same MONGODB_URI');
    console.log('   All connect to same database (neko-defense-system)\n');

    console.log('════════════════════════════════════════════════════════════════════════════');
    console.log('🔮 PROPOSED: MICROSERVICES DATABASE ARCHITECTURE');
    console.log('════════════════════════════════════════════════════════════════════════════\n');

    console.log('💡 NEW PRINCIPLE: ONE DATABASE PER MICROSERVICE\n');

    console.log('📦 Proposed Database Structure:\n');

    const microservices = [
      {
        name: 'threat-intelligence-service',
        database: 'threat-intelligence-db',
        collections: ['threat-actors', 'honeypot-triggers', 'evidence-packages'],
        purpose: 'Threat tracking and intelligence gathering'
      },
      {
        name: 'knowledge-management-service',
        database: 'knowledge-management-db',
        collections: ['case-patterns', 'hunt-conversations', 'abilities'],
        purpose: 'Documentation and learning repository'
      },
      {
        name: 'operations-service',
        database: 'operations-db',
        collections: ['ready-operations', 'dina-agents'],
        purpose: 'Operational tasks and agent management'
      }
    ];

    microservices.forEach((service, index) => {
      console.log(`   ${index + 1}. 🎯 ${service.name.toUpperCase()}`);
      console.log(`      Database: ${service.database}`);
      console.log(`      Purpose: ${service.purpose}`);
      console.log(`      Collections:`);
      service.collections.forEach(col => {
        console.log(`         - ${col}`);
      });
      console.log('');
    });

    console.log('════════════════════════════════════════════════════════════════════════════');
    console.log('🔧 BENEFITS OF MICROSERVICES DATABASE ARCHITECTURE');
    console.log('════════════════════════════════════════════════════════════════════════════\n');

    console.log('   ✅ ISOLATION: Each service has dedicated database');
    console.log('   ✅ SCALING: Scale databases independently based on load');
    console.log('   ✅ SECURITY: Fine-grained access control per service');
    console.log('   ✅ DEPLOYMENT: Deploy services independently');
    console.log('   ✅ RESILIENCE: Failure in one DB doesn\'t affect others');
    console.log('   ✅ OPTIMIZATION: Tune each database for specific workload\n');

    console.log('════════════════════════════════════════════════════════════════════════════');
    console.log('📺 NEKO TV BROADCAST COMPLETE, NYAA~! 🐾');
    console.log('════════════════════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('\n❌ Error displaying MongoDB structure:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🐾 MongoDB connection closed, desu~!\n');
  }
}

displayMongoDBStructure();
