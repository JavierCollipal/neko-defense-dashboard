#!/usr/bin/env ts-node

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI!;

async function checkStructure() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    const agent = await db.collection('dina-agents').findOne({});

    console.log('\n📋 First agent structure:');
    console.log(JSON.stringify(agent, null, 2));

  } finally {
    await client.close();
  }
}

checkStructure();
