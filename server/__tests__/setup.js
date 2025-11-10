// 🐾⚡ NEKO DEFENSE DASHBOARD - JEST SETUP ⚡🐾
// MongoDB Memory Server setup for isolated testing, nyaa~!

const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

let mongoServer;
let mongoClient;
let db;

// Start MongoDB Memory Server before all tests
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Connect to in-memory MongoDB
  mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();

  // Get database instance
  db = mongoClient.db('neko-defense-system-test');

  // Store in global for tests to access
  global.__MONGO_URI__ = mongoUri;
  global.__MONGO_DB__ = db;
  global.__MONGO_CLIENT__ = mongoClient;

  console.log('🐾 MongoDB Memory Server started, nyaa~!');
});

// Clean up after all tests
afterAll(async () => {
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log('🐾 MongoDB Memory Server stopped, desu~!');
});

// Clear all collections before each test for isolation
beforeEach(async () => {
  if (db) {
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  }
});
