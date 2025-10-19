#!/usr/bin/env node

/**
 * 🔍 VERIFY COMPLETE SESSION DOCUMENTATION - OCTOBER 19, 2025
 *
 * Verifies ALL documentation created during entire session:
 * 1. Chilean deployment
 * 2. Auto-documentation ability
 * 3. Rule 3.6 first application
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function verifyCompleteSession() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    console.log('🔍 VERIFYING COMPLETE SESSION DOCUMENTATION\n');
    console.log('════════════════════════════════════════════════════════════\n');

    // Check all documents created this session
    const documents = [
      {
        collection: 'case-patterns',
        id: 'chile-deployment-oct19',
        description: 'Chilean deployment bug fixes'
      },
      {
        collection: 'hunt-conversations',
        id: 'chile-deployment-oct19-2025',
        description: 'Chilean deployment session'
      },
      {
        collection: 'abilities',
        id: 'puppeteer-api-verification-oct19',
        description: 'Puppeteer API verification'
      },
      {
        collection: 'hunt-conversations',
        id: 'auto-documentation-ability-oct19-2025',
        description: 'Auto-documentation ability creation'
      },
      {
        collection: 'abilities',
        id: 'auto-documentation-completed-tasks-oct19',
        description: 'Auto-documentation ability'
      },
      {
        collection: 'hunt-conversations',
        id: 'rule36-first-application-oct19-2025',
        description: 'Rule 3.6 first application'
      },
      {
        collection: 'abilities',
        id: 'applying-rule36-pattern-oct19',
        description: 'Rule 3.6 application pattern'
      }
    ];

    let foundCount = 0;
    let missingCount = 0;

    for (const doc of documents) {
      const idField = doc.collection === 'case-patterns' ? 'pattern_id' :
                      doc.collection === 'abilities' ? 'ability_id' : 'session_id';

      const result = await db.collection(doc.collection).findOne({ [idField]: doc.id });

      if (result) {
        console.log(`✅ ${doc.collection}: ${doc.description}`);
        foundCount++;
      } else {
        console.log(`❌ ${doc.collection}: ${doc.description} - NOT FOUND!`);
        missingCount++;
      }
    }

    console.log('\n════════════════════════════════════════════════════════════');
    console.log('📊 VERIFICATION SUMMARY');
    console.log('════════════════════════════════════════════════════════════\n');
    console.log(`✅ Documents found: ${foundCount}/${documents.length}`);
    console.log(`❌ Documents missing: ${missingCount}/${documents.length}\n`);

    if (missingCount === 0) {
      console.log('🎉 ALL DOCUMENTATION VERIFIED SUCCESSFULLY!');
      console.log('💾 Complete session preserved in MongoDB Atlas!');
      console.log('🔄 Rule 3.6 working perfectly!\n');
    } else {
      console.log('⚠️  Some documents are missing! Check errors above.\n');
    }

    // Check Rule 3.6 in CLAUDE.md
    const fs = require('fs');
    const claudeFile = fs.readFileSync('/home/wakibaka/CLAUDE.md', 'utf8');
    const rule36Exists = claudeFile.includes('### 3.6. Task Completion Auto-Documentation Protocol');

    console.log(`✅ CLAUDE.md: Rule 3.6 ${rule36Exists ? 'PRESENT' : 'MISSING'}\n`);

    console.log('════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Verification error:', error.message);
  } finally {
    await client.close();
    console.log('🐾 Verification complete, nyaa~!');
  }
}

verifyCompleteSession();
