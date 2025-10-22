#!/usr/bin/env ts-node

import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

async function queryAuditErrors(): Promise<void> {
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');

    console.log('\n🔍 QUERYING PUPPETEER AUDIT ERRORS...\n');

    // Get all errors
    const errors = await db.collection('puppeteer-error-collections')
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    console.log(`📊 TOTAL ERRORS FOUND: ${errors.length}\n`);

    if (errors.length > 0) {
      console.log('═══════════════════════════════════════════════════════');
      console.log('                    ERROR DETAILS                      ');
      console.log('═══════════════════════════════════════════════════════\n');

      // Group by route
      const errorsByRoute: { [key: string]: any[] } = {};
      errors.forEach(error => {
        const route = error.route || 'unknown';
        if (!errorsByRoute[route]) {
          errorsByRoute[route] = [];
        }
        errorsByRoute[route].push(error);
      });

      // Display by route
      Object.keys(errorsByRoute).forEach(route => {
        console.log(`\n📍 ROUTE: ${route}`);
        console.log('─'.repeat(60));

        errorsByRoute[route].forEach((error, index) => {
          console.log(`\n${index + 1}. [${error.severity}] ${error.type}`);
          console.log(`   Message: ${error.message}`);
        });
      });

      console.log('\n═══════════════════════════════════════════════════════');
      console.log('\n📋 SUMMARY BY ERROR TYPE:\n');

      const errorTypes: { [key: string]: number } = {};
      errors.forEach(error => {
        const type = error.type || 'unknown';
        errorTypes[type] = (errorTypes[type] || 0) + 1;
      });

      Object.keys(errorTypes).forEach(type => {
        console.log(`   ${type}: ${errorTypes[type]}`);
      });

      console.log('\n📊 SUMMARY BY SEVERITY:\n');
      const severities: { [key: string]: number } = {};
      errors.forEach(error => {
        const sev = error.severity || 'unknown';
        severities[sev] = (severities[sev] || 0) + 1;
      });

      Object.keys(severities).forEach(sev => {
        console.log(`   ${sev}: ${severities[sev]}`);
      });

    } else {
      console.log('✅ No errors found! Perfect audit!');
    }

    // Get API calls
    const apiCalls = await db.collection('puppeteer-api-logs')
      .find({})
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();

    if (apiCalls.length > 0) {
      console.log('\n\n═══════════════════════════════════════════════════════');
      console.log('                   API CALLS LOG                        ');
      console.log('═══════════════════════════════════════════════════════\n');

      apiCalls.forEach((call, index) => {
        const statusEmoji = call.status >= 400 ? '❌' : '✅';
        console.log(`${index + 1}. ${statusEmoji} [${call.status}] ${call.method} ${call.url}`);
      });
    }

  } finally {
    await client.close();
  }
}

queryAuditErrors();
