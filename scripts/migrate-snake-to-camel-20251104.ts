#!/usr/bin/env ts-node

/**
 * 🔧🐾 DINA AGENTS FIELD NAME MIGRATION 🐾🔧
 *
 * Migrates snake_case field names to camelCase to match frontend expectations
 *
 * Generated with Claude Code (All Six Personalities)
 * 🐾 Neko-Arc + 🎭 Mario + 🗡️ Noel + 🎸 Glam + 🧠 Hannibal + 🎭 Tetora
 */

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

interface SnakeCaseAgent {
  _id?: any;
  agent_id?: string;
  full_name?: string;
  rank?: string;
  // ... any snake_case fields
}

async function migrateFieldNames() {
  console.log('🔧 Starting field name migration from snake_case to camelCase...\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const collection = db.collection('dina-agents');

    // Find all agents with snake_case fields
    const agentsToMigrate = await collection.find({
      $or: [
        { agent_id: { $exists: true } },
        { full_name: { $exists: true } }
      ]
    }).toArray();

    console.log(`📊 Found ${agentsToMigrate.length} agents with snake_case fields\n`);

    if (agentsToMigrate.length === 0) {
      console.log('✅ No agents need migration!');
      return;
    }

    let migratedCount = 0;

    for (const agent of agentsToMigrate) {
      const updates: any = {};
      const unsets: any = {};

      // Map snake_case to camelCase (matching existing schema)
      if (agent.agent_id) {
        updates.agentId = agent.agent_id;
        unsets.agent_id = '';
      }
      if (agent.full_name) {
        updates.fullName = agent.full_name;
        unsets.full_name = '';
      }
      if (agent.legal_status) {
        updates.legalStatus = agent.legal_status;
        unsets.legal_status = '';
      }
      if (agent.alleged_crimes) {
        updates.crimesAccused = agent.alleged_crimes;  // Match existing schema
        unsets.alleged_crimes = '';
      }
      if (agent.known_operations) {
        updates.notableOperations = agent.known_operations;  // Match existing schema
        unsets.known_operations = '';
      }
      if (agent.biographical_notes) {
        updates.biographicalNotes = agent.biographical_notes;
        unsets.biographical_notes = '';
      }
      if (agent.data_sources) {
        updates.dataSources = agent.data_sources;
        unsets.data_sources = '';
      }
      if (agent.verification_status) {
        updates.verified = agent.verification_status === 'verified';  // Match existing schema
        unsets.verification_status = '';
      }
      if (agent.created_at) {
        updates.addedToSystem = agent.created_at;  // Match existing schema
        unsets.created_at = '';
      }
      if (agent.updated_at) {
        updates.updatedAt = agent.updated_at;
        unsets.updated_at = '';
      }
      if (agent.service_period_text) {
        updates.servicePeriod = agent.service_period_text;
        unsets.service_period_text = '';
      }

      if (Object.keys(updates).length > 0) {
        await collection.updateOne(
          { _id: agent._id },
          {
            $set: updates,
            $unset: unsets
          }
        );
        migratedCount++;
        console.log(`✅ Migrated: ${agent.full_name || agent.fullName}`);
      }
    }

    console.log(`\n🎉 Migration complete! Migrated ${migratedCount} agents\n`);

    // Verify final count
    const finalCount = await collection.countDocuments();
    console.log(`📊 Total agents in database: ${finalCount}\n`);

  } finally {
    await client.close();
  }
}

migrateFieldNames()
  .then(() => {
    console.log('✅ Migration script completed successfully, nyaa~!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration failed:');
    console.error(error);
    process.exit(1);
  });
