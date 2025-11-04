#!/usr/bin/env ts-node

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function checkAgents() {
  console.log('🔍 Checking agent count with gatomaestroactual credentials...\n');

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const count = await db.collection('dina-agents').countDocuments();

    console.log(`✅ Agent count: ${count}\n`);

    // Sample agents
    const agents = await db.collection('dina-agents').find({}).limit(5).toArray();
    console.log('📋 Sample agents:');
    agents.forEach((agent: any, i: number) => {
      console.log(`  ${i + 1}. ${agent.full_name} (${agent.agent_id})`);
    });

  } finally {
    await client.close();
  }
}

checkAgents();
