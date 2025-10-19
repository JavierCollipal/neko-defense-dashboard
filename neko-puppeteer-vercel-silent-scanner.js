#!/usr/bin/env node

/**
 * 🔇 NEKO PUPPETEER VERCEL SILENT SCANNER 🔍
 *
 * SILENT MODE (headless: true) - No visible browser
 * Scans PRODUCTION Vercel deployment for errors
 * Saves ALL errors to MongoDB for analysis
 *
 * Purpose:
 * - Detect frontend-API integration issues
 * - Collect console errors, JavaScript exceptions, failed requests
 * - Generate comprehensive error report
 * - Identify problems on LIVE deployment
 *
 * Mode: PRODUCTION DIAGNOSTICS (SILENT)
 * Target: https://neko-defense-dashboard-f55qcnvve.vercel.app
 *
 * NYA NYA NYA~! Silent but POWERFUL scanning! ⚡🔇
 */

require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const PuppeteerErrorCollector = require('./puppeteer-error-collector');

// PRODUCTION VERCEL URL - LIVE INSTANCE!
const BASE_URL = process.env.VERCEL_URL || 'https://neko-defense-dashboard-f55qcnvve.vercel.app';

const SCREENSHOTS_DIR = path.join(__dirname, 'puppeteer-screenshots', 'vercel-scan');
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI environment variable is not set!');
  console.error('Please create a .env file with your MongoDB connection string.');
  process.exit(1);
}

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Routes to test on Vercel
const ROUTES = [
  { path: '/', name: 'home', description: 'Homepage' },
  { path: '/threats', name: 'threats', description: 'Threat Actors Dashboard' },
  { path: '/dina', name: 'dina', description: 'DINA Agents Intelligence' },
  { path: '/valech', name: 'analytics', description: 'Analytics Dashboard' },
  { path: '/abilities', name: 'abilities', description: 'Neko Abilities' },
  { path: '/confessions', name: 'blog', description: 'Confessions Blog' },
  { path: '/youtube', name: 'videos', description: 'YouTube Videos' },
  { path: '/rag', name: 'rag', description: 'RAG System' }
];

class NekoVercelSilentScanner {
  constructor() {
    this.browser = null;
    this.page = null;
    this.errorCollector = new PuppeteerErrorCollector(
      MONGODB_URI,
      `vercel-scan-${Date.now()}`
    );
    this.currentContext = { route: 'startup', action: 'initialization' };
    this.stats = {
      routesTested: 0,
      screenshotsCaptured: 0,
      consoleErrors: 0,
      consoleWarnings: 0,
      jsExceptions: 0,
      failedRequests: 0,
      totalErrors: 0
    };
  }

  async launch() {
    console.log('\n🔇 LAUNCHING NEKO PUPPETEER (SILENT MODE), NYAA~!\n');
    console.log('🎯 Target: VERCEL PRODUCTION INSTANCE');
    console.log(`📡 URL: ${BASE_URL}`);
    console.log('🔕 Browser is INVISIBLE (headless: true)');
    console.log('💾 Errors will be saved to MongoDB in real-time!\n');
    console.log('════════════════════════════════════════════════════════════\n');

    // Connect to MongoDB for error collection
    const connected = await this.errorCollector.connect();
    if (!connected) {
      console.error('❌ Failed to connect to MongoDB. Aborting scan.');
      process.exit(1);
    }

    this.browser = await puppeteer.launch({
      headless: true,  // 🔇 SILENT MODE: No visible browser!
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-web-security',  // Allow cross-origin if needed
        '--disable-features=IsolateOrigins,site-per-process'
      ]
    });

    this.page = await this.browser.newPage();

    // Set viewport to desktop resolution
    await this.page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1
    });

    // Set user agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Neko-Scanner/1.0'
    );

    console.log('✅ Silent browser launched successfully!\n');

    this.setupErrorMonitoring();
  }

  setupErrorMonitoring() {
    // Monitor console messages
    this.page.on('console', async (msg) => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error') {
        console.log(`   ❌ [CONSOLE ERROR]: ${text.substring(0, 100)}...`);
        this.stats.consoleErrors++;
        this.stats.totalErrors++;
        await this.errorCollector.saveConsoleError(type, text, {
          ...this.currentContext,
          url: this.page.url()
        });
      } else if (type === 'warning') {
        console.log(`   ⚠️  [CONSOLE WARNING]: ${text.substring(0, 100)}...`);
        this.stats.consoleWarnings++;
        await this.errorCollector.saveConsoleError(type, text, {
          ...this.currentContext,
          url: this.page.url()
        });
      }
    });

    // Monitor JavaScript exceptions
    this.page.on('pageerror', async (error) => {
      console.log(`   🚨 [PAGE ERROR]: ${error.message.substring(0, 100)}...`);
      this.stats.jsExceptions++;
      this.stats.totalErrors++;
      await this.errorCollector.saveJavaScriptError(error, {
        ...this.currentContext,
        url: this.page.url()
      });
    });

    // Monitor failed HTTP requests
    this.page.on('response', async (response) => {
      const status = response.status();
      const url = response.url();

      if (status >= 400) {
        console.log(`   ⚠️  [${status}] ${url.substring(0, 80)}...`);
        this.stats.failedRequests++;
        this.stats.totalErrors++;
        await this.errorCollector.saveFailedRequest(status, url, {
          ...this.currentContext,
          initiator: 'network'
        });
      }
    });

    console.log('✅ Error monitoring activated!\n');
  }

  async scanRoute(route) {
    const url = `${BASE_URL}${route.path}`;
    this.currentContext = {
      route: route.name,
      action: 'page_load',
      url: url
    };

    console.log(`\n🔍 Scanning: ${route.description} (${route.name})`);
    console.log(`   📡 ${url}`);

    try {
      // Navigate to route
      await this.page.goto(url, {
        waitUntil: 'networkidle0',  // Wait for network to be idle
        timeout: 30000
      });

      // Wait a bit for dynamic content
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Take screenshot for visual evidence
      const screenshotPath = path.join(
        SCREENSHOTS_DIR,
        `${route.name}-${Date.now()}.png`
      );
      await this.page.screenshot({ path: screenshotPath, fullPage: true });
      this.stats.screenshotsCaptured++;
      console.log(`   📸 Screenshot: ${path.basename(screenshotPath)}`);

      // Check for React errors in the page
      const reactError = await this.page.evaluate(() => {
        const errorElement = document.querySelector('[data-test-id="error-boundary"]');
        if (errorElement) {
          return errorElement.textContent;
        }
        return null;
      });

      if (reactError) {
        console.log(`   🚨 React Error Boundary triggered!`);
        await this.errorCollector.saveJavaScriptError(
          new Error(`React Error Boundary: ${reactError}`),
          { ...this.currentContext, severity: 'critical' }
        );
      }

      this.stats.routesTested++;
      console.log(`   ✅ Scan complete\n`);

    } catch (error) {
      console.log(`   ❌ FAILED to scan route: ${error.message}\n`);
      await this.errorCollector.saveJavaScriptError(error, {
        ...this.currentContext,
        severity: 'critical'
      });
    }
  }

  async scanAllRoutes() {
    console.log('🎯 STARTING COMPREHENSIVE VERCEL SCAN\n');
    console.log('════════════════════════════════════════════════════════════\n');

    for (const route of ROUTES) {
      await this.scanRoute(route);
    }

    console.log('\n════════════════════════════════════════════════════════════');
    console.log('✅ ALL ROUTES SCANNED!\n');
  }

  async generateReport() {
    console.log('\n📊 GENERATING ERROR REPORT...\n');

    // Create session summary in MongoDB
    await this.errorCollector.createSessionSummary({
      scan_type: 'vercel_production',
      target_url: BASE_URL,
      routes_tested: this.stats.routesTested,
      screenshots_captured: this.stats.screenshotsCaptured,
      console_errors: this.stats.consoleErrors,
      console_warnings: this.stats.consoleWarnings,
      javascript_exceptions: this.stats.jsExceptions,
      failed_requests: this.stats.failedRequests,
      total_errors: this.stats.totalErrors,
      scan_duration: 'auto-calculated',
      status: this.stats.totalErrors === 0 ? 'clean' : 'errors_found'
    });

    // Print terminal summary
    console.log('════════════════════════════════════════════════════════════');
    console.log('📊 SCAN SUMMARY');
    console.log('════════════════════════════════════════════════════════════');
    console.log(`\n🎯 Target: ${BASE_URL}`);
    console.log(`📋 Routes Tested: ${this.stats.routesTested}/${ROUTES.length}`);
    console.log(`📸 Screenshots: ${this.stats.screenshotsCaptured}`);
    console.log(`\n❌ Console Errors: ${this.stats.consoleErrors}`);
    console.log(`⚠️  Console Warnings: ${this.stats.consoleWarnings}`);
    console.log(`🚨 JavaScript Exceptions: ${this.stats.jsExceptions}`);
    console.log(`⚠️  Failed HTTP Requests: ${this.stats.failedRequests}`);
    console.log(`\n🔢 TOTAL ERRORS: ${this.stats.totalErrors}`);

    if (this.stats.totalErrors === 0) {
      console.log(`\n✅ STATUS: CLEAN! No errors detected, nyaa~! 🐾✨`);
    } else {
      console.log(`\n⚠️  STATUS: ERRORS FOUND! Check MongoDB for details!`);
      console.log(`\n💾 Collection: puppeteer-error-collections`);
      console.log(`🔍 Session ID: ${this.errorCollector.sessionId}`);
    }

    console.log('\n════════════════════════════════════════════════════════════\n');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }

    await this.errorCollector.close();
    console.log('🐾 Scanner shutdown complete, desu~!\n');
  }
}

// Main execution
async function main() {
  const scanner = new NekoVercelSilentScanner();

  try {
    await scanner.launch();
    await scanner.scanAllRoutes();
    await scanner.generateReport();
  } catch (error) {
    console.error('\n💥 SCANNER FATAL ERROR:', error);
  } finally {
    await scanner.close();
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = NekoVercelSilentScanner;
