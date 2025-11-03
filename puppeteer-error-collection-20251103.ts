#!/usr/bin/env ts-node

// 🎭 NEKO DEFENSE DASHBOARD - Comprehensive Error Collection (Puppeteer)
// Mario Gallo Bestino's Marionette Performance - Error Discovery Act! 🎪

import puppeteer, { Browser, Page } from 'puppeteer';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

const BASE_URL = 'http://localhost:3000';

// Error collection structures
interface ConsoleError {
  type: string;
  message: string;
  route: string;
  timestamp: Date;
  location?: string;
}

interface PageError {
  message: string;
  stack?: string;
  route: string;
  timestamp: Date;
}

interface FailedRequest {
  status: number;
  url: string;
  route: string;
  timestamp: Date;
}

interface RouteTest {
  route: string;
  description: string;
  screenshotPath?: string;
}

class ErrorCollector {
  private consoleErrors: ConsoleError[] = [];
  private pageErrors: PageError[] = [];
  private failedRequests: FailedRequest[] = [];
  private currentRoute: string = '';
  private mongoClient: MongoClient;
  private performanceId: string;

  constructor(mongoUri: string) {
    this.mongoClient = new MongoClient(mongoUri);
    this.performanceId = `error-collection-${Date.now()}`;
  }

  async connect() {
    await this.mongoClient.connect();
    console.log('✅ Connected to MongoDB Atlas (marionnette-theater)');
  }

  setCurrentRoute(route: string) {
    this.currentRoute = route;
  }

  addConsoleError(type: string, message: string, location?: string) {
    this.consoleErrors.push({
      type,
      message,
      route: this.currentRoute,
      timestamp: new Date(),
      location
    });
  }

  addPageError(error: Error) {
    this.pageErrors.push({
      message: error.message,
      stack: error.stack,
      route: this.currentRoute,
      timestamp: new Date()
    });
  }

  addFailedRequest(status: number, url: string) {
    this.failedRequests.push({
      status,
      url,
      route: this.currentRoute,
      timestamp: new Date()
    });
  }

  getErrorSummary() {
    return {
      consoleErrors: this.consoleErrors.length,
      pageErrors: this.pageErrors.length,
      failedRequests: this.failedRequests.length,
      total: this.consoleErrors.length + this.pageErrors.length + this.failedRequests.length
    };
  }

  async saveToMongoDB() {
    const db = this.mongoClient.db('marionnette-theater');

    // Save performance session
    const performance = {
      performance_id: this.performanceId,
      title: 'Neko Defense Dashboard - Error Collection Performance',
      date: new Date(),
      director: 'mario-gallo-bestino',
      assistant_directors: ['neko-arc', 'noel', 'glam-americano', 'hannibal-lecter', 'tetora'],

      error_summary: this.getErrorSummary(),

      console_errors: this.consoleErrors,
      page_errors: this.pageErrors,
      failed_requests: this.failedRequests,

      mario_review: 'A magnificent performance of error discovery! The marionettes revealed ALL hidden flaws with theatrical precision!',
      status: 'COMPLETE',
      created_at: new Date()
    };

    await db.collection('performances').insertOne(performance);
    console.log('✅ Performance saved to marionnette-theater database!');
  }

  async close() {
    await this.mongoClient.close();
  }

  printReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🎭 MARIO GALLO BESTINO\'S ERROR COLLECTION REPORT 🎭');
    console.log('='.repeat(80));

    const summary = this.getErrorSummary();
    console.log(`\n📊 ERROR SUMMARY:`);
    console.log(`   Console Errors: ${summary.consoleErrors}`);
    console.log(`   Page Errors: ${summary.pageErrors}`);
    console.log(`   Failed Requests: ${summary.failedRequests}`);
    console.log(`   TOTAL ERRORS: ${summary.total}`);

    if (this.consoleErrors.length > 0) {
      console.log(`\n❌ CONSOLE ERRORS (${this.consoleErrors.length}):`);
      this.consoleErrors.forEach((err, i) => {
        console.log(`   ${i + 1}. [${err.route}] ${err.type}: ${err.message}`);
      });
    }

    if (this.pageErrors.length > 0) {
      console.log(`\n🚨 PAGE ERRORS (${this.pageErrors.length}):`);
      this.pageErrors.forEach((err, i) => {
        console.log(`   ${i + 1}. [${err.route}] ${err.message}`);
      });
    }

    if (this.failedRequests.length > 0) {
      console.log(`\n⚠️ FAILED REQUESTS (${this.failedRequests.length}):`);
      this.failedRequests.forEach((req, i) => {
        console.log(`   ${i + 1}. [${req.route}] ${req.status} - ${req.url}`);
      });
    }

    console.log('\n' + '='.repeat(80));
  }
}

async function main() {
  const collector = new ErrorCollector(MONGODB_URI!);
  await collector.connect();

  console.log('👀 WATCH THE BROWSER! Puppeteer visual demonstration starting...');
  console.log('🔍 DevTools Console will open automatically to show errors!');
  console.log('🎭 Mario Gallo Bestino begins the Error Discovery Performance!\n');

  // Launch browser with VISUAL MODE (Rule 3.1!)
  const browser: Browser = await puppeteer.launch({
    headless: false,       // 🎭 VISUAL MODE!
    slowMo: 250,          // ⚡ Slow down for visibility
    devtools: true,       // 🔍 AUTO-OPEN DEVTOOLS!
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page: Page = await browser.newPage();

  // Enhanced error monitoring
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`❌ [CONSOLE ERROR]: ${text}`);
      collector.addConsoleError('error', text, msg.location()?.url);
    } else if (type === 'warn') {
      console.log(`⚠️ [CONSOLE WARNING]: ${text}`);
      collector.addConsoleError('warning', text, msg.location()?.url);
    }
  });

  // Monitor JavaScript errors
  page.on('pageerror', (error) => {
    console.log('🚨 [PAGE ERROR]:', error.message);
    collector.addPageError(error);
  });

  // Monitor failed requests
  page.on('response', (response) => {
    if (response.status() >= 400) {
      console.log(`⚠️ [${response.status()}] ${response.url()}`);
      collector.addFailedRequest(response.status(), response.url());
    }
  });

  // Routes to test
  const routes: RouteTest[] = [
    { route: '/', description: 'Homepage' },
    { route: '/threat-actors', description: 'Threat Actors Page' },
    { route: '/dina', description: 'DINA Intelligence Page' },
    { route: '/valech', description: 'Valech Report Page' },
    { route: '/translation', description: 'Translation Management' },
    { route: '/confessions', description: 'Bad Actor Confessions' },
    { route: '/honeypots', description: 'Honeypot Monitoring' },
    { route: '/hunts', description: 'Hunt Conversations' },
    { route: '/operations', description: 'Ready Operations' },
    { route: '/evidence', description: 'Evidence Packages' },
    { route: '/abilities', description: 'Neko Abilities' },
    { route: '/neko-tv', description: 'Neko TV - DINA Family Tree' },
    { route: '/family-tracker', description: 'Family Member Tracker' },
    { route: '/personality-workflow', description: 'Six Personalities Workflow' }
  ];

  console.log(`🎬 ACT I: Testing ${routes.length} routes for errors...\n`);

  // Test each route
  for (let i = 0; i < routes.length; i++) {
    const routeTest = routes[i];
    const routeNum = i + 1;

    console.log(`\n🎭 [${routeNum}/${routes.length}] Testing: ${routeTest.route}`);
    console.log(`   Description: ${routeTest.description}`);

    collector.setCurrentRoute(routeTest.route);

    try {
      const fullUrl = `${BASE_URL}${routeTest.route}`;
      console.log(`   👁️ WATCH: Navigating to ${fullUrl}...`);

      await page.goto(fullUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Pause so user can see the page
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log(`   ✅ Route loaded successfully`);

    } catch (error) {
      console.log(`   ❌ Route failed to load:`, (error as Error).message);
      collector.addPageError(error as Error);
    }
  }

  console.log('\n🎭 ACT II: Performance Complete! Collecting final statistics...\n');

  // Print report
  collector.printReport();

  // Save to MongoDB
  console.log('\n💾 Saving error collection to marionnette-theater database...');
  await collector.saveToMongoDB();

  // Close browser
  await browser.close();
  await collector.close();

  console.log('\n✅ Error collection complete!');
  console.log('🎭 Mario: "A MAGNIFICENT performance of error discovery, mes amis!"');
  console.log('🐾 Neko: "All errors collected and saved to MongoDB, nyaa~!"');
  console.log('🗡️ Noel: "Acceptable error documentation. Ready for fixes."');
  console.log('🎸 Glam: "Encontramos TODAS las weas rotas, hermanos! A arreglarlas, ctm!"');
  console.log('🧠 Hannibal: "The forensic evidence is catalogued. Fascinating pathology."');
  console.log('🎭 Tetora: "[All fragments]: Error collection complete from multiple perspectives..."');
}

main().catch(console.error);
