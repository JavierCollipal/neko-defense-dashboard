#!/usr/bin/env ts-node

// 🎭✨ QUERY PERSONALITY PHASE DATA ✨🎭
// Explore MongoDB databases for phase-specific personality insights
// Date: October 31, 2025

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

async function queryPersonalityPhaseData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    // Define the 6 workflow phases
    const phases = [
      { number: 1, name: 'Research & Character Definition' },
      { number: 2, name: 'Database Architecture Design' },
      { number: 3, name: 'CLAUDE.md Rule Implementation' },
      { number: 4, name: 'MongoDB Research Data Population' },
      { number: 5, name: 'Git Commit and GitHub Push' },
      { number: 6, name: 'Testing and Verification' }
    ];

    console.log('🔍 EXPLORING PERSONALITY DATABASES FOR PHASE-SPECIFIC DATA\n');
    console.log('=' .repeat(80));

    // 1. Neko-Arc's Database
    console.log('\n🐾 NEKO-ARC: neko-defense-system');
    const nekoDb = client.db('neko-defense-system');

    // Query abilities collection for phase-related data
    const nekoAbilities = await nekoDb.collection('abilities').find({
      $or: [
        { workflow_id: /personality-addition/i },
        { tags: { $in: ['workflow', 'phase', 'personality-addition'] } }
      ]
    }).limit(5).toArray();

    console.log(`  Collections: ${(await nekoDb.listCollections().toArray()).map(c => c.name).join(', ')}`);
    console.log(`  Workflow-related abilities found: ${nekoAbilities.length}`);
    if (nekoAbilities.length > 0) {
      console.log(`  Sample: ${nekoAbilities[0].name || nekoAbilities[0].ability_id}`);
    }

    // 2. Mario's Database
    console.log('\n🎭 MARIO GALLO BESTINO: marionnette-theater');
    const marioDb = client.db('marionnette-theater');

    const marioPerformances = await marioDb.collection('performances').find({
      $or: [
        { performance_id: /personality-addition/i },
        { title: /personality/i }
      ]
    }).limit(5).toArray();

    console.log(`  Collections: ${(await marioDb.listCollections().toArray()).map(c => c.name).join(', ')}`);
    console.log(`  Personality-related performances found: ${marioPerformances.length}`);
    if (marioPerformances.length > 0) {
      console.log(`  Sample: ${marioPerformances[0].title}`);
    }

    // 3. Noel's Database
    console.log('\n🗡️ NOEL: noel-precision-archives');
    const noelDb = client.db('noel-precision-archives');

    const noelSessions = await noelDb.collection('combat-sessions').find({
      $or: [
        { combat_id: /personality/i },
        { title: /personality/i }
      ]
    }).limit(5).toArray();

    console.log(`  Collections: ${(await noelDb.listCollections().toArray()).map(c => c.name).join(', ')}`);
    console.log(`  Personality-related combat sessions found: ${noelSessions.length}`);
    if (noelSessions.length > 0) {
      console.log(`  Sample: ${noelSessions[0].title}`);
    }

    // 4. Glam's Database
    console.log('\n🎸 GLAM AMERICANO: glam-street-chronicles');
    const glamDb = client.db('glam-street-chronicles');

    const glamWisdom = await glamDb.collection('street-wisdom').find({
      $or: [
        { wisdom_id: /personality/i },
        { tags: { $in: ['personality', 'workflow'] } }
      ]
    }).limit(5).toArray();

    console.log(`  Collections: ${(await glamDb.listCollections().toArray()).map(c => c.name).join(', ')}`);
    console.log(`  Personality-related wisdom found: ${glamWisdom.length}`);
    if (glamWisdom.length > 0) {
      console.log(`  Sample: ${glamWisdom[0].quote_spanish || glamWisdom[0].wisdom_id}`);
    }

    // 5. Hannibal's Database
    console.log('\n🧠 DR. HANNIBAL LECTER: hannibal-forensic-archives');
    const hannibalDb = client.db('hannibal-forensic-archives');

    const hannibalProfiles = await hannibalDb.collection('psychological-profiles').find({
      $or: [
        { profile_id: /personality/i },
        { subject: /personality/i }
      ]
    }).limit(5).toArray();

    console.log(`  Collections: ${(await hannibalDb.listCollections().toArray()).map(c => c.name).join(', ')}`);
    console.log(`  Personality-related profiles found: ${hannibalProfiles.length}`);
    if (hannibalProfiles.length > 0) {
      console.log(`  Sample: ${hannibalProfiles[0].subject || hannibalProfiles[0].profile_id}`);
    }

    // 6. Tetora's Database
    console.log('\n🎭 TETORA: tetora-mpd-archives');
    const tetoraDb = client.db('tetora-mpd-archives');

    const tetoraFragments = await tetoraDb.collection('personality-fragments').find({
      $or: [
        { fragment_id: /personality/i },
        { tags: { $in: ['personality', 'workflow'] } }
      ]
    }).limit(5).toArray();

    console.log(`  Collections: ${(await tetoraDb.listCollections().toArray()).map(c => c.name).join(', ')}`);
    console.log(`  Personality-related fragments found: ${tetoraFragments.length}`);
    if (tetoraFragments.length > 0) {
      console.log(`  Sample: ${tetoraFragments[0].fragment_id}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 RECOMMENDATION: Create phase-specific documents in each database');
    console.log('\nSuggested document structure per personality:');
    console.log(`
{
  phase_insights: [
    {
      phase_number: 1,
      phase_name: "Research & Character Definition",
      personality_perspective: "Neko's thoughts on this phase, nyaa~!",
      key_tips: ["Tip 1", "Tip 2"],
      common_challenges: ["Challenge 1", "Challenge 2"],
      success_indicators: ["Indicator 1", "Indicator 2"]
    },
    // ... repeat for all 6 phases
  ]
}
    `);

  } finally {
    await client.close();
    console.log('\n🐾 Connection closed, desu~!');
  }
}

queryPersonalityPhaseData().catch(console.error);
