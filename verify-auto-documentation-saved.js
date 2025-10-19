#!/usr/bin/env node

require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;

async function verify() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    const conversation = await db.collection('hunt-conversations').findOne({
      session_id: 'auto-documentation-ability-oct19-2025'
    });

    const ability = await db.collection('abilities').findOne({
      ability_id: 'auto-documentation-completed-tasks-oct19'
    });

    console.log('🔍 AUTO-DOCUMENTATION ABILITY VERIFICATION\n');

    if (conversation) {
      console.log('✅ hunt-conversations: Auto-documentation session saved');
      console.log(`   Title: ${conversation.title}\n`);
    } else {
      console.log('❌ hunt-conversations: NOT found\n');
    }

    if (ability) {
      console.log('✅ abilities: Auto-documentation ability saved');
      console.log(`   Name: ${ability.name}`);
      console.log(`   Category: ${ability.category}/${ability.subcategory}\n`);
    } else {
      console.log('❌ abilities: NOT found\n');
    }

    const ruleExists = require('fs').readFileSync('/home/wakibaka/CLAUDE.md', 'utf8')
      .includes('### 3.6. Task Completion Auto-Documentation Protocol');

    console.log(`✅ CLAUDE.md: Rule 3.6 ${ruleExists ? 'ADDED' : 'NOT FOUND'}\n`);

    if (conversation && ability && ruleExists) {
      console.log('🎉 ALL VERIFICATIONS PASSED!');
      console.log('💾 Auto-documentation ability is now ACTIVE and IMMUTABLE!\n');
    }

  } finally {
    await client.close();
  }
}

verify();
