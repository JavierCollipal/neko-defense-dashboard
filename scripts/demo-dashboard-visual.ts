#!/usr/bin/env ts-node

import puppeteer, { Browser, Page } from 'puppeteer';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

interface ErrorLog {
  type: 'console' | 'page' | 'request';
  level?: string;
  message: string;
  url?: string;
  status?: number;
  route: string;
  timestamp: Date;
  session_id: string;
}

class DashboardDemonstration {
  private client: MongoClient;
  private db: any;
  private browser: Browser | null = null;
  private page: Page | null = null;
  private errors: ErrorLog[] = [];
  private sessionId: string;
  private screenshotDir: string;

  constructor(uri: string) {
    this.client = new MongoClient(uri);
    this.sessionId = `dashboard-demo-${new Date().toISOString().split('T')[0]}`;
    this.screenshotDir = path.join(__dirname, 'screenshots', this.sessionId);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db('neko-defense-system');
    console.log('✅ Connected to MongoDB Atlas');

    // Create screenshots directory
    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
      console.log(`✅ Created screenshot directory: ${this.screenshotDir}`);
    }
  }

  async launchBrowser(): Promise<void> {
    console.log('\n🎭 LAUNCHING VISUAL BROWSER...');
    console.log('👀 WATCH the browser window appear!');
    console.log('🔍 DevTools Console will show errors in real-time!');

    this.browser = await puppeteer.launch({
      headless: false,       // 🎭 VISUAL MODE!
      slowMo: 250,          // ⚡ Slow down for human eyes
      devtools: true,       // 🔍 Open DevTools Console!
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized',
        '--auto-open-devtools-for-tabs'
      ]
    });

    this.page = await this.browser.newPage();

    // Setup error monitoring
    this.setupErrorMonitoring();

    await this.delay(2000);
    console.log('✅ Browser launched with DevTools open!');
  }

  private setupErrorMonitoring(): void {
    if (!this.page) {return;}

    // Monitor console messages
    this.page.on('console', async (msg) => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error') {
        console.log(`❌ [CONSOLE ERROR]: ${text}`);
        await this.logError('console', 'error', text);
      } else if (type === 'warn') {
        console.log(`⚠️  [CONSOLE WARNING]: ${text}`);
        await this.logError('console', 'warning', text);
      }
    });

    // Monitor JavaScript errors
    this.page.on('pageerror', async (error) => {
      console.log(`🚨 [PAGE ERROR]: ${error.message}`);
      await this.logError('page', 'error', error.message);
    });

    // Monitor failed requests
    this.page.on('response', async (response) => {
      if (response.status() >= 400) {
        const url = response.url();
        const status = response.status();
        console.log(`⚠️  [${status}] ${url}`);
        await this.logError('request', 'error', `${status} - ${url}`, url, status);
      }
    });
  }

  private async logError(
    type: 'console' | 'page' | 'request',
    level: string,
    message: string,
    url?: string,
    status?: number
  ): Promise<void> {
    const error: ErrorLog = {
      type,
      level,
      message,
      url,
      status,
      route: this.page?.url() || 'unknown',
      timestamp: new Date(),
      session_id: this.sessionId
    };

    this.errors.push(error);

    // Save to MongoDB immediately
    try {
      await this.db.collection('puppeteer-error-collections').insertOne(error);
    } catch (err) {
      console.error('Failed to save error to MongoDB:', err);
    }
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async captureScreenshot(routeName: string): Promise<void> {
    if (!this.page) {return;}

    const filename = `${routeName.replace(/\//g, '-')}.png`;
    const filepath = path.join(this.screenshotDir, filename);

    await this.page.screenshot({
      path: filepath as `${string}.png`,
      fullPage: true
    });
    console.log(`📸 Screenshot saved: ${filename}`);
  }

  async demonstrateRoute(route: string, routeName: string): Promise<void> {
    if (!this.page) {return;}

    console.log(`\n👁️  NAVIGATING TO: ${routeName} (${route})`);
    console.log('👀 WATCH the browser!');

    await this.page.goto(`http://localhost:3000${route}`, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await this.delay(3000); // Let user see the page

    console.log(`📸 Capturing screenshot of ${routeName}...`);
    await this.captureScreenshot(routeName);

    // Scroll to show content
    console.log('🖱️  WATCH the page scroll down!');
    await this.page.evaluate('window.scrollTo(0, 500)');
    await this.delay(2000);

    await this.page.evaluate('window.scrollTo(0, 1000)');
    await this.delay(2000);

    console.log(`✅ ${routeName} demonstrated!`);
  }

  async runFullDemonstration(): Promise<void> {
    const routes = [
      { path: '/', name: 'Home-Overview' },
      { path: '/threat-actors', name: 'Threat-Actors' },
      { path: '/honeypot-triggers', name: 'Honeypot-Triggers' },
      { path: '/case-patterns', name: 'Case-Patterns' },
      { path: '/hunt-operations', name: 'Hunt-Operations' },
      { path: '/evidence-packages', name: 'Evidence-Packages' },
      { path: '/dina-agents', name: 'DINA-Agents' },
      { path: '/abilities', name: 'Abilities' }
    ];

    console.log('\n🎬 STARTING FULL DASHBOARD DEMONSTRATION');
    console.log(`📊 Total routes to demonstrate: ${routes.length}`);
    console.log('=' .repeat(50));

    for (const route of routes) {
      await this.demonstrateRoute(route.path, route.name);
    }

    console.log('\n✅ FULL DEMONSTRATION COMPLETE!');
  }

  async createSessionSummary(): Promise<void> {
    const summary = {
      session_id: this.sessionId,
      date: new Date(),
      total_errors: this.errors.length,
      error_breakdown: {
        console: this.errors.filter((e) => e.type === 'console').length,
        page: this.errors.filter((e) => e.type === 'page').length,
        request: this.errors.filter((e) => e.type === 'request').length
      },
      routes_tested: 8,
      screenshots_captured: 8,
      screenshot_directory: this.screenshotDir
    };

    await this.db.collection('puppeteer-demo-sessions').insertOne(summary);

    console.log('\n📊 SESSION SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`Session ID: ${summary.session_id}`);
    console.log(`Total Errors: ${summary.total_errors}`);
    console.log(`  - Console Errors: ${summary.error_breakdown.console}`);
    console.log(`  - Page Errors: ${summary.error_breakdown.page}`);
    console.log(`  - Failed Requests: ${summary.error_breakdown.request}`);
    console.log(`Routes Tested: ${summary.routes_tested}`);
    console.log(`Screenshots: ${summary.screenshots_captured}`);
    console.log(`Screenshot Directory: ${summary.screenshot_directory}`);
    console.log('=' .repeat(50));
  }

  async close(): Promise<void> {
    if (this.browser) {
      console.log('\n👋 Closing browser...');
      await this.delay(3000); // Let user see final state
      await this.browser.close();
    }
    await this.client.close();
    console.log('✅ Demonstration complete!');
  }
}

async function main(): Promise<void> {
  console.log('🐾 NEKO DEFENSE DASHBOARD - VISUAL DEMONSTRATION');
  console.log('📺 Puppeteer Visual Mode with DevTools Console Monitoring');
  console.log('');

  const demo = new DashboardDemonstration(MONGODB_URI!);

  try {
    await demo.connect();
    await demo.launchBrowser();
    await demo.runFullDemonstration();
    await demo.createSessionSummary();
  } catch (error) {
    console.error('❌ Demonstration failed:', error);
  } finally {
    await demo.close();
  }
}

main();
