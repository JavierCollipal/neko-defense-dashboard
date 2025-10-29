#!/usr/bin/env ts-node

/**
 * VALECH 2.0 DATABASE INITIALIZATION SCRIPT
 *
 * Creates MongoDB collections with proper schemas and indexes
 * for the Valech 2.0 human rights documentation system
 *
 * Usage:
 *   ts-node scripts/init-valech-collections.ts
 *
 * Created: October 29, 2025
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
 */

import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable not set!');
  process.exit(1);
}

const DATABASE_NAME = 'neko-defense-system';

interface CollectionConfig {
  name: string;
  validator?: object;
  indexes?: Array<{
    keys: any;
    options?: any;
  }>;
}

async function initializeValechCollections() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!');

    const db = client.db(DATABASE_NAME);

    // ============================================================
    // COLLECTION CONFIGURATIONS
    // ============================================================

    const collections: CollectionConfig[] = [
      // 1. Valech Victims
      {
        name: 'valech_victims',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['victimId', 'fullName', 'outcome', 'createdAt'],
            properties: {
              victimId: { bsonType: 'string', description: 'Unique victim identifier (required)' },
              fullName: { bsonType: 'string', description: 'Full name of victim (required)' },
              dateOfBirth: { bsonType: 'date', description: 'Date of birth' },
              gender: { enum: ['MALE', 'FEMALE', 'OTHER', 'UNKNOWN'], description: 'Gender' },
              detentionHistory: { bsonType: 'array', description: 'Array of detention records' },
              outcome: {
                enum: ['SURVIVED', 'KILLED', 'DISAPPEARED', 'UNKNOWN'],
                description: 'Final outcome (required)'
              },
              documentationStatus: {
                enum: ['COMPLETE', 'PARTIAL', 'MINIMAL', 'NEEDS_VERIFICATION'],
                description: 'Documentation completeness'
              },
              confidenceLevel: {
                enum: ['CONFIRMED', 'PROBABLE', 'ALLEGED', 'DISPUTED'],
                description: 'Confidence in data accuracy'
              },
              publicVisibility: {
                enum: ['PUBLIC', 'RESEARCHERS_ONLY', 'FAMILY_ONLY', 'ADMIN_ONLY'],
                description: 'Access control level'
              },
              createdAt: { bsonType: 'date', description: 'Creation timestamp (required)' },
              lastUpdated: { bsonType: 'date', description: 'Last modification timestamp' }
            }
          }
        },
        indexes: [
          { keys: { victimId: 1 }, options: { unique: true } },
          { keys: { fullName: 'text' } },
          { keys: { outcome: 1 } },
          { keys: { 'detentionHistory.detentionCenterId': 1 } },
          { keys: { 'detentionHistory.dateArrested': 1 } },
          { keys: { documentationStatus: 1 } },
          { keys: { confidenceLevel: 1 } },
          { keys: { createdAt: -1 } }
        ]
      },

      // 2. Detention Centers
      {
        name: 'valech_detention_centers',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['centerId', 'officialName', 'location', 'createdAt'],
            properties: {
              centerId: { bsonType: 'string', description: 'Unique center identifier (required)' },
              officialName: { bsonType: 'string', description: 'Official center name (required)' },
              aliases: { bsonType: 'array', description: 'Alternative names' },
              centerType: {
                enum: ['SECRET_DETENTION', 'CONCENTRATION_CAMP', 'PRISON', 'MILITARY_BASE', 'OTHER'],
                description: 'Type of detention facility'
              },
              location: { bsonType: 'object', description: 'Geographic location (required)' },
              currentStatus: {
                enum: ['DEMOLISHED', 'PRESERVED', 'MEMORIAL', 'REPURPOSED', 'UNKNOWN'],
                description: 'Current physical status'
              },
              createdAt: { bsonType: 'date', description: 'Creation timestamp (required)' }
            }
          }
        },
        indexes: [
          { keys: { centerId: 1 }, options: { unique: true } },
          { keys: { officialName: 'text', aliases: 'text' } },
          { keys: { 'location.city': 1 } },
          { keys: { 'location.region': 1 } },
          { keys: { centerType: 1 } },
          { keys: { currentStatus: 1 } }
        ]
      },

      // 3. Victim-Perpetrator Cross-References
      {
        name: 'valech_cross_references',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['crossRefId', 'victimId', 'perpetratorId', 'relationshipType', 'createdAt'],
            properties: {
              crossRefId: { bsonType: 'string', description: 'Unique cross-reference ID (required)' },
              victimId: { bsonType: 'string', description: 'Victim identifier (required)' },
              perpetratorId: { bsonType: 'string', description: 'Perpetrator identifier (required)' },
              relationshipType: {
                enum: [
                  'TORTURED_BY',
                  'INTERROGATED_BY',
                  'ARRESTED_BY',
                  'GUARDED_BY',
                  'WITNESSED_BY',
                  'EXECUTED_BY',
                  'COMMANDED_BY'
                ],
                description: 'Type of relationship (required)'
              },
              confidenceLevel: {
                enum: ['CONFIRMED', 'PROBABLE', 'ALLEGED', 'DISPUTED'],
                description: 'Confidence in relationship'
              },
              createdAt: { bsonType: 'date', description: 'Creation timestamp (required)' }
            }
          }
        },
        indexes: [
          { keys: { crossRefId: 1 }, options: { unique: true } },
          { keys: { victimId: 1 } },
          { keys: { perpetratorId: 1 } },
          { keys: { relationshipType: 1 } },
          { keys: { detentionCenterId: 1 } },
          { keys: { confidenceLevel: 1 } },
          { keys: { victimId: 1, perpetratorId: 1 }, options: { name: 'victim_perpetrator_compound' } }
        ]
      },

      // 4. Testimony Archives
      {
        name: 'valech_testimony_archives',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['testimonialId', 'victimId', 'content', 'date', 'createdAt'],
            properties: {
              testimonialId: { bsonType: 'string', description: 'Unique testimony ID (required)' },
              victimId: { bsonType: 'string', description: 'Associated victim ID (required)' },
              content: { bsonType: 'string', description: 'Testimony content (required)' },
              date: { bsonType: 'date', description: 'Testimony date (required)' },
              language: { enum: ['es', 'en', 'pt', 'de', 'fr'], description: 'Language' },
              verified: { bsonType: 'bool', description: 'Verification status' },
              publicVisibility: {
                enum: ['PUBLIC', 'RESEARCHERS_ONLY', 'PRIVATE'],
                description: 'Access control'
              },
              anonymized: { bsonType: 'bool', description: 'Whether testimony is anonymized' },
              createdAt: { bsonType: 'date', description: 'Creation timestamp (required)' }
            }
          }
        },
        indexes: [
          { keys: { testimonialId: 1 }, options: { unique: true } },
          { keys: { victimId: 1 } },
          { keys: { date: -1 } },
          { keys: { verified: 1 } },
          { keys: { language: 1 } },
          { keys: { content: 'text' } }
        ]
      },

      // 5. Ingestion Jobs (pipeline tracking)
      {
        name: 'valech_ingestion_jobs',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['jobId', 'jobType', 'status', 'createdAt'],
            properties: {
              jobId: { bsonType: 'string', description: 'Unique job ID (required)' },
              jobType: {
                enum: ['PDF_PARSE', 'INDH_FETCH', 'NLP_EXTRACT', 'CROSS_REFERENCE', 'MANUAL_ENTRY'],
                description: 'Type of ingestion job (required)'
              },
              status: {
                enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'PAUSED'],
                description: 'Current job status (required)'
              },
              progress: { bsonType: 'number', minimum: 0, maximum: 100, description: 'Progress percentage' },
              createdAt: { bsonType: 'date', description: 'Creation timestamp (required)' }
            }
          }
        },
        indexes: [
          { keys: { jobId: 1 }, options: { unique: true } },
          { keys: { status: 1 } },
          { keys: { jobType: 1 } },
          { keys: { createdAt: -1 } }
        ]
      },

      // 6. Data Quality Metrics
      {
        name: 'valech_data_quality',
        indexes: [
          { keys: { victimId: 1 }, options: { unique: true } },
          { keys: { completenessScore: -1 } },
          { keys: { requiredFieldsPresent: 1 } },
          { keys: { lastAssessed: -1 } }
        ]
      },

      // 7. Statistics Cache
      {
        name: 'valech_statistics_cache',
        indexes: [
          { keys: { lastCalculated: -1 } }
        ]
      }
    ];

    // ============================================================
    // CREATE COLLECTIONS
    // ============================================================

    console.log('\n📦 Creating Valech 2.0 collections...\n');

    for (const config of collections) {
      try {
        // Check if collection exists
        const existingCollections = await db.listCollections({ name: config.name }).toArray();

        if (existingCollections.length > 0) {
          console.log(`⚠️  Collection "${config.name}" already exists - skipping creation`);
        } else {
          // Create collection with validator
          if (config.validator) {
            await db.createCollection(config.name, { validator: config.validator });
            console.log(`✅ Created collection "${config.name}" with schema validation`);
          } else {
            await db.createCollection(config.name);
            console.log(`✅ Created collection "${config.name}"`);
          }
        }

        // Create indexes
        if (config.indexes && config.indexes.length > 0) {
          const collection = db.collection(config.name);

          for (const indexConfig of config.indexes) {
            try {
              await collection.createIndex(indexConfig.keys as any, indexConfig.options as any);
              const indexName = (indexConfig.options as any)?.name || JSON.stringify(indexConfig.keys);
              console.log(`   📊 Created index: ${indexName}`);
            } catch (indexError: any) {
              if (indexError.code === 85) {
                console.log(`   ⚠️  Index already exists - skipping`);
              } else {
                console.error(`   ❌ Error creating index:`, indexError.message);
              }
            }
          }
        }

        console.log('');
      } catch (error: any) {
        console.error(`❌ Error creating collection "${config.name}":`, error.message);
      }
    }

    // ============================================================
    // SUMMARY
    // ============================================================

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ VALECH 2.0 DATABASE INITIALIZATION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Collections created:');
    console.log('   1. valech_victims (27,255 target)');
    console.log('   2. valech_detention_centers (~1,200 target)');
    console.log('   3. valech_cross_references (~50,000 target)');
    console.log('   4. valech_testimony_archives (27,255+ target)');
    console.log('   5. valech_ingestion_jobs (pipeline tracking)');
    console.log('   6. valech_data_quality (quality metrics)');
    console.log('   7. valech_statistics_cache (analytics cache)');
    console.log('');
    console.log('🎯 Ready for data ingestion!');
    console.log('');
    console.log('Next steps:');
    console.log('   1. Run PDF parser for Valech Reports');
    console.log('   2. Integrate INDH DSpace API');
    console.log('   3. Build victim search API endpoints');
    console.log('   4. Create frontend components');
    console.log('');
    console.log('🐾 Built with MAXIMUM NEKO POWER by The Supreme Six! 🎭🗡️🎸🧠🧠');
    console.log('═══════════════════════════════════════════════════════════');

  } catch (error: any) {
    console.error('❌ FATAL ERROR:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed.');
  }
}

// Run initialization
initializeValechCollections();
