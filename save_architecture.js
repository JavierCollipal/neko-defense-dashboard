// 🐾⚡ NEKO DEFENSE - Save Architecture to MongoDB ⚡🐾
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/";
const dbName = "neko-defense-system";

async function saveArchitecture() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("🐾 Connected to MongoDB Atlas, nyaa~!");

    const db = client.db(dbName);

    // 1. Save architecture snapshot to archive
    const archiveDoc = {
      snapshot_id: "neko-defense-architecture-v2-graphql",
      timestamp: new Date(),
      type: "ARCHITECTURE_DEPLOYMENT",
      title: "🐾⚡ Complete 3-Tier GraphQL Architecture ⚡🐾",
      status: "PRODUCTION_READY",
      created_by: "Neko-Arc",
      completion_date: "2025-10-12",
      architecture: {
        frontend: {
          name: "React + Apollo Client",
          port: 3000,
          url: "http://localhost:3000",
          framework: "React 18.2.0 + Apollo Client 3.14.0",
          status: "OPERATIONAL"
        },
        backend: {
          name: "NestJS + GraphQL API",
          port: 4000,
          url: "http://localhost:4000/graphql",
          framework: "NestJS 11.1.6 + Apollo Server 5.0.0",
          status: "OPERATIONAL"
        },
        database: {
          name: "MongoDB Atlas",
          database: "neko-defense-system",
          status: "CONNECTED"
        }
      },
      security: {
        jwt_authentication: true,
        rate_limiting: true,
        cors_protection: true,
        mongodb_hidden: true
      },
      notes: [
        "Complete 3-tier separation achieved",
        "JWT authentication required for all API queries",
        "GraphQL provides type safety and flexible queries",
        "MongoDB credentials never exposed to frontend",
        "Production deployment ready"
      ]
    };

    const archiveResult = await db.collection('archive').insertOne(archiveDoc);
    console.log(`✅ Architecture saved to archive collection, desu~!`);

    // 2. Update system_config with new architecture
    const configUpdate = {
      architecture_version: "v2-graphql",
      frontend_port: 3000,
      backend_port: 4000,
      frontend_url: "http://localhost:3000",
      backend_url: "http://localhost:4000/graphql",
      graphql_enabled: true,
      apollo_client_version: "3.14.0",
      nestjs_version: "11.1.6",
      deployment_status: "OPERATIONAL",
      last_architecture_update: new Date()
    };

    await db.collection('system_config').updateOne(
      {},
      { $set: configUpdate },
      { upsert: true }
    );
    console.log(`✅ System config updated with new ports and URLs, nyaa~!`);

    // 3. Save API endpoints catalog
    const apiCatalog = {
      catalog_id: "neko-defense-api-v2-graphql",
      type: "GraphQL_API",
      created_at: new Date(),
      base_url: "http://localhost:4000/graphql",
      authentication: "JWT Bearer Token",
      endpoints: {
        mutations: [
          { name: "login", auth_required: false, description: "Get JWT token" }
        ],
        queries: [
          { name: "threatCounts", auth_required: true },
          { name: "threatActors", auth_required: true },
          { name: "dinaStats", auth_required: true },
          { name: "dinaPerpetrators", auth_required: true }
        ]
      }
    };

    await db.collection('api_catalog').insertOne(apiCatalog);
    console.log(`✅ API catalog saved, desu~!`);

    console.log("\n🎉 ALL DATA SAVED TO MONGODB SUCCESSFULLY, NYA NYA NYA~! ✨🐾");

  } catch (error) {
    console.error("❌ Error saving to MongoDB:", error.message);
  } finally {
    await client.close();
    console.log("🐾 MongoDB connection closed, nyaa~!");
  }
}

saveArchitecture();
