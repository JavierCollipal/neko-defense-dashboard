#!/usr/bin/env ts-node

import puppeteer, { Browser, Page } from 'puppeteer';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

interface ErrorLog {
  type: 'console' | 'pageerror' | 'request_failure';
  message: string;
  url?: string;
  status?: number;
  timestamp: Date;
  route: string;
}

class ValechErrorCollector {
  private client: MongoClient;
  private errors: ErrorLog[] = [];
  private sessionId: string;

  constructor(uri: string) {
    this.client = new MongoClient(uri);
    this.sessionId = `valech-investigation-${new Date().toISOString().split('T')[0]}`;
  }

  async connect() {
    await this.client.connect();
    console.log('✅ Connected to MongoDB Atlas');
  }

  async saveError(error: ErrorLog) {
    this.errors.push(error);
    const db = this.client.db('marionnette-theater');
    await db.collection('audience-reactions').insertOne({
      session_id: this.sessionId,
      reaction_type: error.type.toUpperCase(),
      message: error.message,
      url: error.url,
      status: error.status,
      route: error.route,
      timestamp: error.timestamp,
      created_at: new Date()
    });
  }

  async createSessionSummary(metrics: any) {
    const db = this.client.db('marionnette-theater');

    // Mario's theatrical database
    await db.collection('performances').insertOne({
      performance_id: this.sessionId,
      title: 'Valech Page Error Investigation',
      date: new Date(),
      director: 'mario-gallo-bestino',
      assistant_director: 'neko-arc',
      tactical_analyst: 'noel',

      act_structure: {
        act1: 'Browser Initialization',
        act2: 'Valech Page Navigation',
        act3: 'Error Collection',
        finale: 'Analysis and Reporting'
      },

      puppeteer_config: {
        headless: false,
        slowMo: 250,
        devtools: true
      },

      errors_captured: this.errors.length,
      console_errors: this.errors.filter(e => e.type === 'console').length,
      page_errors: this.errors.filter(e => e.type === 'pageerror').length,
      failed_requests: this.errors.filter(e => e.type === 'request_failure').length,

      mario_review: 'A THRILLING investigation! The errors revealed themselves like actors on stage!',
      noel_review: 'Adequate error collection. Now fix the damn issues.',

      status: 'PERFORMANCE_COMPLETE',
      created_at: new Date()
    });
  }

  async close() {
    await this.client.close();
    console.log('🔒 MongoDB connection closed');
  }

  getErrors() {
    return this.errors;
  }
}

async function investigateValechPage() {
  console.log('🎭 Mario: THE GRAND VALECH INVESTIGATION BEGINS!');
  console.log('🐾 Neko: Starting Puppeteer with visual mode, nyaa~!');
  console.log('🗡️ Noel: Let\'s see what\'s broken.');
  console.log('');

  const errorCollector = new ValechErrorCollector(MONGODB_URI!);
  await errorCollector.connect();

  console.log('👀 WATCH the browser window! DevTools Console will show errors!');
  console.log('');

  const browser: Browser = await puppeteer.launch({
    headless: false,      // Visual mode (Rule 3.1!)
    slowMo: 250,          // Slow down for visibility
    devtools: true,       // Auto-open DevTools Console
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  console.log('🎭 Mario: ACT I - THE MARIONETTE AWAKENS!');

  const page: Page = await browser.newPage();

  // Error monitoring
  page.on('console', async (msg) => {
    const type = msg.type();
    if (type === 'error') {
      const errorMsg = msg.text();
      console.log(`❌ [CONSOLE ERROR]: ${errorMsg}`);
      await errorCollector.saveError({
        type: 'console',
        message: errorMsg,
        route: '/valech',
        timestamp: new Date()
      });
    } else if (type === 'warn') {
      console.log(`⚠️ [CONSOLE WARNING]: ${msg.text()}`);
    }
  });

  page.on('pageerror', async (error) => {
    console.log('🚨 [PAGE ERROR]:', error.message);
    await errorCollector.saveError({
      type: 'pageerror',
      message: error.message,
      route: '/valech',
      timestamp: new Date()
    });
  });

  page.on('response', async (response) => {
    if (response.status() >= 400) {
      const url = response.url();
      const status = response.status();
      console.log(`⚠️ [${status}] ${url}`);
      await errorCollector.saveError({
        type: 'request_failure',
        message: `HTTP ${status}`,
        url: url,
        status: status,
        route: '/valech',
        timestamp: new Date()
      });
    }
  });

  try {
    console.log('🎭 Mario: ACT II - JOURNEY TO THE VALECH PAGE!');
    console.log('🐾 Neko: Navigating to Valech page, nyaa~!');

    await page.goto('https://neko-arc-defense-dashboard.vercel.app/valech', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('✅ Page loaded!');
    console.log('');

    // Wait to observe errors in DevTools
    console.log('⏳ Waiting 5 seconds to collect errors...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🎭 Mario: ACT III - ERROR COLLECTION COMPLETE!');
    console.log('🗡️ Noel: Analyzing captured errors...');
    console.log('');

    const errors = errorCollector.getErrors();

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 ERROR SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Errors: ${errors.length}`);
    console.log(`Console Errors: ${errors.filter(e => e.type === 'console').length}`);
    console.log(`Page Errors: ${errors.filter(e => e.type === 'pageerror').length}`);
    console.log(`Failed Requests: ${errors.filter(e => e.type === 'request_failure').length}`);
    console.log('');

    if (errors.length > 0) {
      console.log('🔍 DETAILED ERRORS:');
      errors.forEach((err, idx) => {
        console.log(`\n${idx + 1}. [${err.type.toUpperCase()}]`);
        console.log(`   Message: ${err.message}`);
        if (err.url) console.log(`   URL: ${err.url}`);
        if (err.status) console.log(`   Status: ${err.status}`);
      });
      console.log('');
    } else {
      console.log('✅ No errors detected!');
    }

    // Save session summary
    await errorCollector.createSessionSummary({
      page_loaded: true,
      errors_found: errors.length
    });

    console.log('💾 Errors saved to MongoDB marionnette-theater database!');
    console.log('');
    console.log('🎭 Mario: CURTAIN CALL! The investigation is complete!');
    console.log('🗡️ Noel: Now fix whatever\'s broken.');

    // Keep browser open for user to inspect
    console.log('');
    console.log('👁️ Browser will stay open for 10 seconds for inspection...');
    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error: any) {
    console.error('💥 Investigation failed:', error.message);
  } finally {
    await browser.close();
    await errorCollector.close();
  }
}

investigateValechPage();
