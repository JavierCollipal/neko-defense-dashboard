#!/usr/bin/env ts-node

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function checkFields() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    
    // Get one agent with snake_case
    const snakeAgent = await db.collection('dina-agents').findOne({ agent_id: { $exists: true } });
    
    if (snakeAgent) {
      console.log('\n📋 Snake_case agent fields:');
      console.log(Object.keys(snakeAgent).filter(k => k.includes('_')));
    }
    
    // Get one agent with camelCase
    const camelAgent = await db.collection('dina-agents').findOne({ agentId: { $exists: true } });
    
    if (camelAgent) {
      console.log('\n📋 CamelCase agent sample fields:');
      console.log(Object.keys(camelAgent).slice(0, 15));
    }

  } finally {
    await client.close();
  }
}

checkFields();
