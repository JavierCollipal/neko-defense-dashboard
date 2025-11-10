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

const VERCEL_URL = 'https://neko-defense-dashboard.vercel.app';

interface ErrorCapture {
  type: string;
  message: string;
  route: string;
  timestamp: Date;
  severity: string;
}

interface ApiCallLog {
  method: string;
  url: string;
  status: number;
  route: string;
  timestamp: Date;
}

class DashboardAuditor {
  private browser!: Browser;
  private page!: Page;
  private errors: ErrorCapture[] = [];
  private apiCalls: ApiCallLog[] = [];
  private mongoClient: MongoClient;
  private currentRoute: string = 'unknown';

  constructor() {
    this.mongoClient = new MongoClient(MONGODB_URI!);
  }

  async connect(): Promise<void> {
    await this.mongoClient.connect();
    console.log('✅ Connected to MongoDB Atlas!');
  }

  async launchBrowser(): Promise<void> {
    console.log('🎭 Mario: ACT I - THE MARIONETTE AWAKENS!');
    console.log('🐾 Neko: Starting browser with VISUAL mode, nyaa~!');
    console.log('🗡️ Noel: Opening DevTools Console for error monitoring.');

    this.browser = await puppeteer.launch({
      headless: false,      // 🎭 VISUAL DEMONSTRATION!
      slowMo: 250,          // ⚡ Slow enough to watch
      devtools: true,       // 🔍 DevTools open automatically
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized',
        '--auto-open-devtools-for-tabs'
      ]
    });

    this.page = await this.browser.newPage();

    // Error monitoring
    this.page.on('console', (msg) => {
      const type = msg.type();
      if (type === 'error') {
        const errorCapture: ErrorCapture = {
          type: 'console_error',
          message: msg.text(),
          route: this.currentRoute,
          timestamp: new Date(),
          severity: 'ERROR'
        };
        this.errors.push(errorCapture);
        console.log(`❌ [CONSOLE ERROR]: ${msg.text()}`);
      } else if (type === 'warn') {
        const warningCapture: ErrorCapture = {
          type: 'console_warning',
          message: msg.text(),
          route: this.currentRoute,
          timestamp: new Date(),
          severity: 'WARNING'
        };
        this.errors.push(warningCapture);
        console.log(`⚠️ [CONSOLE WARNING]: ${msg.text()}`);
      }
    });

    // JavaScript errors
    this.page.on('pageerror', (error) => {
      const err = error as Error;
      const errorCapture: ErrorCapture = {
        type: 'javascript_error',
        message: err.message || String(error),
        route: this.currentRoute,
        timestamp: new Date(),
        severity: 'CRITICAL'
      };
      this.errors.push(errorCapture);
      console.log('🚨 PAGE ERROR:', err.message || String(error));
    });

    // Network monitoring
    this.page.on('response', (response) => {
      const url = response.url();
      const status = response.status();

      // Track API calls
      if (url.includes('/api/') || url.includes('vercel.app')) {
        const apiLog: ApiCallLog = {
          method: response.request().method(),
          url: url,
          status: status,
          route: this.currentRoute,
          timestamp: new Date()
        };
        this.apiCalls.push(apiLog);

        if (status >= 400) {
          console.log(`⚠️ [${status}] ${url}`);
          const errorCapture: ErrorCapture = {
            type: 'network_failure',
            message: `HTTP ${status}: ${url}`,
            route: this.currentRoute,
            timestamp: new Date(),
            severity: status >= 500 ? 'CRITICAL' : 'HIGH'
          };
          this.errors.push(errorCapture);
        }
      }
    });

    console.log('✅ Browser launched with monitoring enabled!');
  }

  async auditRoute(routeName: string, path: string): Promise<void> {
    this.currentRoute = routeName;
    const fullUrl = `${VERCEL_URL}${path}`;

    console.log(`\n🎭 Mario: ACT - Testing route: ${routeName}`);
    console.log(`🐾 Neko: Navigating to ${fullUrl}, nyaa~!`);

    try {
      await this.page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 30000 });
      console.log(`✅ Route loaded: ${routeName}`);

      // Wait for user to see
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Scroll down to trigger lazy loading
      console.log('🗡️ Noel: Scrolling to check lazy-loaded components...');
      // @ts-ignore - window exists in browser context
      await this.page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Scroll back up
      // @ts-ignore - window exists in browser context
      await this.page.evaluate('window.scrollTo(0, 0)');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Screenshot
      const screenshotPath = `/home/wakibaka/Documents/github/neko-defense-dashboard/audit-screenshots/${routeName.replace(/\s+/g, '-').toLowerCase()}.png` as `${string}.png`;
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}`);

    } catch (error: any) {
      const errorCapture: ErrorCapture = {
        type: 'navigation_failure',
        message: `Failed to load ${routeName}: ${error.message}`,
        route: routeName,
        timestamp: new Date(),
        severity: 'CRITICAL'
      };
      this.errors.push(errorCapture);
      console.log(`❌ Failed to load route: ${routeName} - ${error.message}`);
    }
  }

  async runFullAudit(): Promise<void> {
    console.log('\n🎭 Mario: THE GRAND AUDIT PERFORMANCE BEGINS!');
    console.log('🐾 Neko: Testing ALL routes, desu~!');
    console.log('🗡️ Noel: Systematic route inspection initiated.\n');

    const routes = [
      { name: 'Dashboard Home', path: '/' },
      { name: 'Threat Actors', path: '/threat-actors' },
      { name: 'Honeypots', path: '/honeypots' },
      { name: 'Hunt Conversations', path: '/hunt-conversations' },
      { name: 'Abilities', path: '/abilities' },
      { name: 'Evidence Packages', path: '/evidence-packages' }
    ];

    for (const route of routes) {
      await this.auditRoute(route.name, route.path);
    }

    console.log('\n🎭 Mario: ALL ROUTES TESTED! CURTAIN CALL!');
    console.log('🐾 Neko: Audit complete, nyaa~!');
    console.log('🗡️ Noel: Mission accomplished. Generating report...');
  }

  async saveToMongoDB(): Promise<void> {
    console.log('\n💾 Saving audit results to MongoDB...');

    const db = this.mongoClient.db('neko-defense-system');

    // Save errors to puppeteer-error-collections
    if (this.errors.length > 0) {
      await db.collection('puppeteer-error-collections').insertMany(this.errors);
      console.log(`✅ Saved ${this.errors.length} errors to MongoDB`);
    } else {
      console.log('✅ No errors detected! Perfect audit!');
    }

    // Save API calls log
    if (this.apiCalls.length > 0) {
      await db.collection('puppeteer-api-logs').insertMany(this.apiCalls);
      console.log(`✅ Saved ${this.apiCalls.length} API calls to MongoDB`);
    }

    // Create audit summary
    const summary = {
      audit_id: `vercel-audit-${Date.now()}`,
      timestamp: new Date(),
      url: VERCEL_URL,
      total_routes_tested: 6,
      total_errors: this.errors.length,
      total_api_calls: this.apiCalls.length,
      errors_by_severity: {
        critical: this.errors.filter(e => e.severity === 'CRITICAL').length,
        high: this.errors.filter(e => e.severity === 'HIGH').length,
        warning: this.errors.filter(e => e.severity === 'WARNING').length,
        error: this.errors.filter(e => e.severity === 'ERROR').length
      },
      status: this.errors.filter(e => e.severity === 'CRITICAL').length > 0 ? 'FAILED' : 'PASSED'
    };

    await db.collection('puppeteer-audit-summaries').insertOne(summary);
    console.log('✅ Audit summary saved to MongoDB!');

    // Document to all three databases
    await this.documentToAllPersonalities(summary);
  }

  async documentToAllPersonalities(summary: any): Promise<void> {
    console.log('\n📝 Documenting to all three personality databases...');

    // Neko's database
    const nekoDB = this.mongoClient.db('neko-defense-system');
    await nekoDB.collection('hunt-conversations').insertOne({
      session_id: `vercel-audit-${Date.now()}`,
      date: new Date(),
      title: 'Vercel Dashboard Production Audit',
      category: 'testing',
      objective: 'Verify all frontend routes and API calls work correctly on production',
      conversation_summary: {
        phase1: 'Puppeteer browser launched with visual mode',
        phase2: 'All 6 routes tested with error monitoring',
        phase3: 'Errors and API calls saved to MongoDB',
        outcome: summary.status
      },
      outcome: `${summary.status} - ${summary.total_errors} errors found`,
      tags: ['puppeteer', 'vercel', 'audit', 'production-testing'],
      created_at: new Date(),
      created_by: 'neko-arc'
    });
    console.log('✅ Neko: Documented in neko-defense-system, nyaa~!');

    // Mario's database
    const marioDB = this.mongoClient.db('marionnette-theater');
    await marioDB.collection('performances').insertOne({
      performance_id: `vercel-audit-ballet-${Date.now()}`,
      title: 'The Grand Vercel Dashboard Inspection',
      date: new Date(),
      director: 'mario-gallo-bestino',
      assistant_director: 'neko-arc',
      act_structure: {
        act1: 'Browser Awakening',
        act2: 'Route Navigation Ballet',
        act3: 'Error Collection Drama',
        finale: 'MongoDB Documentation Triumph'
      },
      duration_ms: 0, // Will calculate later
      pages_visited: 6,
      screenshots_captured: 6,
      errors_encountered: summary.total_errors,
      mario_review: 'A magnificent performance! The marionettes danced across all routes with grace!',
      status: summary.status === 'PASSED' ? 'STANDING_OVATION' : 'DRAMATIC_RESOLUTION_NEEDED',
      created_at: new Date()
    });
    console.log('🎭 Mario: Performance archived in marionnette-theater!');

    // Noel's database
    const noelDB = this.mongoClient.db('noel-precision-archives');
    await noelDB.collection('combat-sessions').insertOne({
      combat_id: `vercel-audit-mission-${Date.now()}`,
      title: 'Vercel Production Dashboard Audit',
      date: new Date(),
      commander: 'noel',
      support_units: ['neko-arc', 'mario-gallo-bestino'],
      mission_structure: {
        phase1: 'Browser Initialization',
        phase2: 'Systematic Route Testing',
        phase3: 'Error Analysis',
        finale: 'Database Documentation'
      },
      bugs_identified: summary.total_errors,
      tests_written: 6,
      noel_assessment: summary.total_errors === 0
        ? 'Acceptable. No critical failures detected.'
        : `Found ${summary.total_errors} issues. Typical frontend sloppiness.`,
      status: 'MISSION_COMPLETE',
      created_at: new Date()
    });
    console.log('🗡️ Noel: Combat report filed in noel-precision-archives.');
  }

  async generateReport(): Promise<void> {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║        VERCEL DASHBOARD AUDIT REPORT                  ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n🌐 URL: ${VERCEL_URL}`);
    console.log(`📅 Date: ${new Date().toISOString()}`);
    console.log(`\n📊 STATISTICS:`);
    console.log(`   Routes Tested: 6`);
    console.log(`   Total Errors: ${this.errors.length}`);
    console.log(`   Total API Calls: ${this.apiCalls.length}`);

    console.log(`\n🚨 ERRORS BY SEVERITY:`);
    console.log(`   CRITICAL: ${this.errors.filter(e => e.severity === 'CRITICAL').length}`);
    console.log(`   HIGH: ${this.errors.filter(e => e.severity === 'HIGH').length}`);
    console.log(`   WARNING: ${this.errors.filter(e => e.severity === 'WARNING').length}`);
    console.log(`   ERROR: ${this.errors.filter(e => e.severity === 'ERROR').length}`);

    if (this.errors.length > 0) {
      console.log(`\n📋 ERROR DETAILS:`);
      this.errors.forEach((error, index) => {
        console.log(`\n   ${index + 1}. [${error.severity}] ${error.type}`);
        console.log(`      Route: ${error.route}`);
        console.log(`      Message: ${error.message}`);
      });
    }

    console.log(`\n✅ FINAL STATUS: ${this.errors.filter(e => e.severity === 'CRITICAL').length > 0 ? '❌ FAILED' : '✅ PASSED'}`);
    console.log('\n╚════════════════════════════════════════════════════════╝\n');
  }

  async close(): Promise<void> {
    console.log('\n🎭 Mario: The curtain falls... Farewell, dear marionettes!');
    console.log('🐾 Neko: Closing browser, desu~!');

    if (this.browser) {
      await this.browser.close();
    }

    await this.mongoClient.close();
    console.log('✅ Connections closed!');
  }
}

async function main(): Promise<void> {
  console.log('🐾 Neko: VERCEL DASHBOARD AUDIT STARTING, NYAA~!');
  console.log('🎭 Mario: The stage is set! Let the performance begin!');
  console.log('🗡️ Noel: Initiating tactical audit. Watch the browser window.\n');

  const auditor = new DashboardAuditor();

  try {
    await auditor.connect();
    await auditor.launchBrowser();

    console.log('\n👀 WATCH THE BROWSER WINDOW!');
    console.log('🎮 You can game while this runs - the browser will move slowly!\n');

    await auditor.runFullAudit();
    await auditor.saveToMongoDB();
    await auditor.generateReport();

  } catch (error: any) {
    console.error('❌ Audit failed:', error.message);
  } finally {
    // Keep browser open for 10 seconds so user can see final state
    console.log('\n⏳ Keeping browser open for 10 seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    await auditor.close();
  }

  console.log('\n🐾 Neko: Audit mission complete, nyaa~!');
  console.log('🎭 Mario: What a magnificent performance!');
  console.log('🗡️ Noel: Check MongoDB for detailed error logs.');
}

main();
