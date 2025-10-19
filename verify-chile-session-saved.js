#!/usr/bin/env node

/**
 * 🔍 VERIFY CHILE DEPLOYMENT SESSION SAVED TO MONGODB
 *
 * Checks that all 3 collections were properly enriched:
 * - case-patterns
 * - hunt-conversations
 * - abilities
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set!');
  process.exit(1);
}

async function verifySession() {
  console.log('🔍 VERIFYING CHILE DEPLOYMENT SESSION IN MONGODB\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas\n');

    const db = client.db('neko-defense-system');

    // 1. Verify case-patterns collection
    const casePattern = await db.collection('case-patterns').findOne({
      pattern_id: 'chile-deployment-oct19'
    });

    if (casePattern) {
      console.log('✅ case-patterns collection enriched!');
      console.log(`   Pattern: ${casePattern.title}`);
      console.log(`   Category: ${casePattern.category}`);
      console.log(`   Bugs Fixed: ${casePattern.bugs_fixed.length}`);
      console.log(`   Tags: ${casePattern.tags.slice(0, 3).join(', ')}...\n`);
    } else {
      console.log('❌ case-patterns: Document NOT found!\n');
    }

    // 2. Verify hunt-conversations collection
    const conversation = await db.collection('hunt-conversations').findOne({
      session_id: 'chile-deployment-oct19-2025'
    });

    if (conversation) {
      console.log('✅ hunt-conversations collection enriched!');
      console.log(`   Title: ${conversation.title}`);
      console.log(`   Objective: ${conversation.objective}`);
      console.log(`   Outcome: ${conversation.outcome}`);
      console.log(`   Technical Details: ${conversation.technical_details.bugs_fixed} bugs fixed, ${conversation.technical_details.files_created} files created\n`);
    } else {
      console.log('❌ hunt-conversations: Document NOT found!\n');
    }

    // 3. Verify abilities collection
    const ability = await db.collection('abilities').findOne({
      ability_id: 'puppeteer-api-verification-oct19'
    });

    if (ability) {
      console.log('✅ abilities collection enriched!');
      console.log(`   Ability: ${ability.name}`);
      console.log(`   Category: ${ability.category} / ${ability.subcategory}`);
      console.log(`   Problem Solved: ${ability.problem_solved}`);
      console.log(`   Reusability: ${ability.reusability}`);
      console.log(`   Results: ${ability.results.actual_api_errors} API errors, ${ability.results.routes_working} routes working\n`);
    } else {
      console.log('❌ abilities: Document NOT found!\n');
    }

    // Summary
    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 VERIFICATION SUMMARY');
    console.log('════════════════════════════════════════════════════════════\n');

    const allFound = casePattern && conversation && ability;
    if (allFound) {
      console.log('✅ ALL 3 COLLECTIONS SUCCESSFULLY ENRICHED!');
      console.log('🇨🇱 Chilean deployment session fully documented in MongoDB!\n');
    } else {
      console.log('⚠️  Some collections missing documents!');
      console.log(`   case-patterns: ${casePattern ? '✅' : '❌'}`);
      console.log(`   hunt-conversations: ${conversation ? '✅' : '❌'}`);
      console.log(`   abilities: ${ability ? '✅' : '❌'}\n`);
    }

  } catch (error) {
    console.error('❌ Error verifying session:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🐾 MongoDB connection closed, nyaa~!');
  }
}

verifySession();
