#!/usr/bin/env node

/**
 * 🐾 NEKO PUPPETEER FULL CONTROL DEMONSTRATION 🎭
 *
 * Demonstrates MAXIMUM web control capabilities:
 * - Navigation across all routes
 * - Screenshot capture
 * - Element interaction (clicks, typing, scrolling)
 * - JavaScript execution
 * - Network monitoring
 * - Performance metrics
 * - Mobile/Desktop viewport switching
 *
 * NYA NYA NYA~! Full browser automation power! ⚡
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const PuppeteerErrorCollector = require('./puppeteer-error-collector');

const BASE_URL = 'http://localhost:3000';
const SCREENSHOTS_DIR = path.join(__dirname, 'puppeteer-screenshots');
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
};

// Ensure screenshots directory exists
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Routes to test
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/threats', name: 'threats' },
  { path: '/dina', name: 'dina' },
  { path: '/valech', name: 'analytics' },
  { path: '/abilities', name: 'abilities' },
  { path: '/confessions', name: 'blog' },
  { path: '/youtube', name: 'videos' },
  { path: '/rag', name: 'rag' }
];

class NekoWebController {
  constructor() {
    this.browser = null;
    this.page = null;
    this.errorCollector = new PuppeteerErrorCollector(MONGODB_URI);
    this.currentContext = { route: 'startup', action: 'initialization' };
    this.results = {
      screenshots: [],
      interactions: [],
      performance: [],
      networkRequests: [],
      jsExecutions: [],
      errors: []
    };
  }

  async launch() {
    console.log('\n🐾 LAUNCHING NEKO PUPPETEER BROWSER (VISUAL MODE), NYAA~!\n');
    console.log('👀 Browser window will appear and you can WATCH the automation!\n');
    console.log('🔍 DevTools Console will open automatically to show browser errors!\n');
    console.log('💾 Errors will be saved to MongoDB in real-time!\n');

    // Connect to MongoDB for error collection
    await this.errorCollector.connect();

    this.browser = await puppeteer.launch({
      headless: false,  // 🎭 VISUAL MODE: Show browser window!
      slowMo: 250,      // ⚡ Slow down by 250ms to make actions visible
      defaultViewport: null,  // Use full browser viewport
      devtools: true,   // 🔍 OPEN DEVTOOLS AUTOMATICALLY!
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--start-maximized',  // Start with maximized window
        '--auto-open-devtools-for-tabs'  // Open DevTools for every new tab
      ]
    });

    this.page = await this.browser.newPage();

    // Note: Using defaultViewport: null means browser controls viewport
    console.log('📺 Browser window is now visible and maximized!');
    console.log('🔍 DevTools Console is open - watch for errors in the browser window!');

    // Monitor console messages with color coding + MongoDB persistence
    this.page.on('console', async (msg) => {
      const type = msg.type();
      const text = msg.text();

      // Highlight errors and warnings in terminal
      if (type === 'error') {
        console.log(`   ❌ [CONSOLE ERROR]: ${text}`);
        // Save to MongoDB
        await this.errorCollector.saveConsoleError(type, text, {
          ...this.currentContext,
          url: this.page.url()
        });
      } else if (type === 'warning') {
        console.log(`   ⚠️ [CONSOLE WARNING]: ${text}`);
        // Save to MongoDB
        await this.errorCollector.saveConsoleError(type, text, {
          ...this.currentContext,
          url: this.page.url()
        });
      } else if (type === 'log' && text.includes('❌')) {
        console.log(`   🔴 ${text}`);
      } else {
        console.log(`   📝 Browser Console [${type}]: ${text}`);
      }
    });

    // Monitor network requests
    this.page.on('request', request => {
      this.results.networkRequests.push({
        url: request.url(),
        method: request.method(),
        resourceType: request.resourceType()
      });
    });

    // Monitor page errors (JavaScript exceptions) + save to MongoDB
    this.page.on('pageerror', async (error) => {
      console.log(`\n   🚨 ═══════════════════════════════════════`);
      console.log(`   🚨 PAGE JAVASCRIPT ERROR DETECTED!`);
      console.log(`   🚨 ═══════════════════════════════════════`);
      console.log(`   💥 Error: ${error.message}`);
      console.log(`   🔍 Stack: ${error.stack}`);
      console.log(`   🚨 ═══════════════════════════════════════\n`);

      this.results.errors.push({
        type: 'javascript_error',
        message: error.message,
        stack: error.stack
      });

      // Save to MongoDB
      await this.errorCollector.saveJavaScriptError(error, {
        ...this.currentContext,
        url: this.page.url()
      });
    });

    // Monitor failed requests (404, 500, etc.) + save to MongoDB
    this.page.on('response', async (response) => {
      const status = response.status();
      const url = response.url();

      if (status >= 400) {
        console.log(`   ⚠️ [${status}] Failed request: ${url}`);

        this.results.errors.push({
          type: 'failed_request',
          status,
          url
        });

        // Save to MongoDB
        await this.errorCollector.saveFailedRequest(status, url, {
          ...this.currentContext,
          initiator: 'page_load'
        });
      }
    });

    console.log('✅ Browser launched successfully!\n');
  }

  async testNavigation() {
    console.log('🎯 TESTING NAVIGATION ACROSS ALL ROUTES\n');
    console.log('👀 WATCH the browser navigate through each page!\n');

    for (const route of ROUTES) {
      // Update context for error collection
      this.currentContext = {
        route: route.name,
        action: 'navigation',
        url: `${BASE_URL}${route.path}`
      };

      const url = `${BASE_URL}${route.path}`;
      console.log(`   🌐 Navigating to: ${url}`);
      console.log(`   👁️ LOOK at the browser window now!`);

      const startTime = Date.now();
      await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const loadTime = Date.now() - startTime;

      console.log(`   ⚡ Page loaded in ${loadTime}ms`);

      // Pause so user can see the page
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Capture screenshot
      const screenshotPath = path.join(SCREENSHOTS_DIR, `${route.name}-desktop.png`);
      await this.page.screenshot({ path: screenshotPath, fullPage: true });

      this.results.screenshots.push({
        route: route.name,
        path: screenshotPath,
        viewport: 'desktop'
      });

      this.results.performance.push({
        route: route.name,
        loadTime,
        url
      });

      console.log(`   📸 Screenshot saved: ${screenshotPath}\n`);
    }
  }

  async testMobileViewport() {
    console.log('📱 TESTING MOBILE VIEWPORT (RESPONSIVE DESIGN)\n');
    console.log('👀 WATCH the browser window resize to mobile!\n');

    // Switch to mobile viewport
    await this.page.setViewport({
      width: 375,
      height: 812,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true
    });

    console.log('   📱 Browser resized to iPhone X size (375x812)');

    // Test home page in mobile
    await this.page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });

    // Pause so user can see mobile view
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mobileScreenshot = path.join(SCREENSHOTS_DIR, 'home-mobile.png');
    await this.page.screenshot({ path: mobileScreenshot, fullPage: true });

    this.results.screenshots.push({
      route: 'home',
      path: mobileScreenshot,
      viewport: 'mobile'
    });

    console.log(`   📸 Mobile screenshot saved: ${mobileScreenshot}\n`);

    console.log('   💻 Resizing back to desktop view...\n');
    // Note: With defaultViewport: null, we don't need to reset
  }

  async testElementInteractions() {
    console.log('🖱️ TESTING ELEMENT INTERACTIONS (CLICKS, SCROLLING)\n');
    console.log('👀 WATCH the browser scroll and interact with elements!\n');

    await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // Test 1: Click on navigation tabs
    console.log('   🎯 Testing top navigation tabs...');

    const navButtons = await this.page.$$('.top-tab-button');
    console.log(`   ✅ Found ${navButtons.length} navigation buttons`);

    if (navButtons.length > 0) {
      // Click on first nav button (should already be active)
      const firstNavText = await this.page.evaluate(el => el.textContent, navButtons[0]);
      console.log(`   🔘 First nav button: "${firstNavText}"`);
    }

    // Test 2: Scroll page
    console.log('   📜 Testing page scrolling...');
    console.log('   👁️ WATCH the page scroll down!');

    await this.page.evaluate(() => {
      window.scrollTo(0, 500);
    });
    await new Promise(resolve => setTimeout(resolve, 2000));  // Longer pause to see scroll

    const scrollY = await this.page.evaluate(() => window.scrollY);
    console.log(`   ✅ Scrolled to position: ${scrollY}px`);

    this.results.interactions.push({
      type: 'scroll',
      position: scrollY,
      success: true
    });

    // Test 3: Get category switcher items
    console.log('   🛡️ Testing category switcher...');
    const categoryItems = await this.page.$$('.category-item');
    console.log(`   ✅ Found ${categoryItems.length} category items`);

    if (categoryItems.length > 0) {
      const firstCategory = await this.page.evaluate(el => {
        const name = el.querySelector('.category-name')?.textContent;
        const count = el.querySelector('.category-count')?.textContent;
        return { name, count };
      }, categoryItems[0]);

      console.log(`   📊 First category: ${firstCategory.name} (${firstCategory.count})`);

      this.results.interactions.push({
        type: 'category_detection',
        data: firstCategory,
        success: true
      });
    }

    console.log('');
  }

  async testJavaScriptExecution() {
    console.log('⚡ TESTING JAVASCRIPT EXECUTION CONTROL\n');

    await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // Test 1: Get page title
    const title = await this.page.evaluate(() => document.title);
    console.log(`   📰 Page Title: "${title}"`);

    // Test 2: Get all threat actors (if any)
    const threatCount = await this.page.evaluate(() => {
      return document.querySelectorAll('.threat-card, .actor-card').length;
    });
    console.log(`   🎯 Threat actors detected: ${threatCount}`);

    // Test 3: Inject custom JavaScript
    const customResult = await this.page.evaluate(() => {
      // Custom neko function
      const nekoGreeting = () => '🐾 NYA NYA NYA~! Puppeteer is in control, desu~! ⚡';
      return nekoGreeting();
    });
    console.log(`   💖 Custom JS Result: "${customResult}"`);

    // Test 4: Get page metadata
    const metadata = await this.page.evaluate(() => {
      return {
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screenResolution: {
          width: window.screen.width,
          height: window.screen.height
        }
      };
    });

    console.log('   📊 Page Metadata:');
    console.log(`      URL: ${metadata.url}`);
    console.log(`      Viewport: ${metadata.viewport.width}x${metadata.viewport.height}`);
    console.log(`      Screen: ${metadata.screenResolution.width}x${metadata.screenResolution.height}`);

    this.results.jsExecutions.push({
      customGreeting: customResult,
      metadata
    });

    console.log('');
  }

  async testFormInteraction() {
    console.log('📝 TESTING FORM INTERACTIONS (TYPING, INPUT)\n');

    await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    // Try to find search inputs or text fields
    const inputs = await this.page.$$('input[type="text"], input[type="search"], textarea');

    if (inputs.length > 0) {
      console.log(`   ✅ Found ${inputs.length} text input(s)`);

      // Type into first input
      await inputs[0].type('Neko Puppeteer Test 🐾', { delay: 50 });
      console.log('   ⌨️ Typed test text into first input');

      const inputValue = await this.page.evaluate(el => el.value, inputs[0]);
      console.log(`   ✅ Input value: "${inputValue}"`);

      this.results.interactions.push({
        type: 'text_input',
        value: inputValue,
        success: true
      });
    } else {
      console.log('   ℹ️ No text inputs found on home page');
    }

    console.log('');
  }

  async testNetworkMonitoring() {
    console.log('🌐 TESTING NETWORK MONITORING\n');

    // Clear previous network requests
    this.results.networkRequests = [];

    await this.page.goto(`${BASE_URL}/threats`, { waitUntil: 'networkidle2' });

    console.log(`   📊 Captured ${this.results.networkRequests.length} network requests`);

    // Group by resource type
    const byType = {};
    this.results.networkRequests.forEach(req => {
      byType[req.resourceType] = (byType[req.resourceType] || 0) + 1;
    });

    console.log('   📈 Requests by type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`      ${type}: ${count}`);
    });

    console.log('');
  }

  async testPerformanceMetrics() {
    console.log('⚡ TESTING PERFORMANCE METRICS\n');

    await this.page.goto(BASE_URL, { waitUntil: 'networkidle2' });

    const metrics = await this.page.metrics();

    console.log('   📊 Browser Metrics:');
    console.log(`      JS Heap Used: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`      JS Heap Total: ${(metrics.JSHeapTotalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`      DOM Nodes: ${metrics.Nodes}`);
    console.log(`      JS Event Listeners: ${metrics.JSEventListeners}`);
    console.log(`      Layout Count: ${metrics.LayoutCount}`);
    console.log(`      Recalc Style Count: ${metrics.RecalcStyleCount}`);

    this.results.performance.push({
      route: 'home',
      metrics
    });

    console.log('');
  }

  async generateReport() {
    console.log('📋 GENERATING CONTROL DEMONSTRATION REPORT\n');

    // Categorize errors
    const jsErrors = this.results.errors.filter(e => e.type === 'javascript_error');
    const failedRequests = this.results.errors.filter(e => e.type === 'failed_request');
    const uniqueFailedUrls = [...new Set(failedRequests.map(e => e.url))];

    const report = {
      timestamp: new Date().toISOString(),
      browser: 'Chromium (Puppeteer)',
      baseUrl: BASE_URL,
      summary: {
        screenshotsCaptured: this.results.screenshots.length,
        routesTested: ROUTES.length,
        interactionTests: this.results.interactions.length,
        networkRequests: this.results.networkRequests.length,
        totalErrors: this.results.errors.length,
        javascriptErrors: jsErrors.length,
        failedRequests: failedRequests.length
      },
      details: this.results,
      errorAnalysis: {
        javascriptErrors: jsErrors,
        failedRequests: uniqueFailedUrls.map(url => ({
          url,
          count: failedRequests.filter(e => e.url === url).length,
          statuses: [...new Set(failedRequests.filter(e => e.url === url).map(e => e.status))]
        }))
      }
    };

    const reportPath = path.join(SCREENSHOTS_DIR, 'control-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('✅ DEMONSTRATION COMPLETE!\n');
    console.log('📊 Summary:');
    console.log(`   🖼️ Screenshots captured: ${report.summary.screenshotsCaptured}`);
    console.log(`   🎯 Routes tested: ${report.summary.routesTested}`);
    console.log(`   🖱️ Interactions performed: ${report.summary.interactionTests}`);
    console.log(`   🌐 Network requests monitored: ${report.summary.networkRequests}`);
    console.log(`   🚨 Total errors detected: ${report.summary.totalErrors}`);
    console.log(`      💥 JavaScript errors: ${report.summary.javascriptErrors}`);
    console.log(`      ⚠️ Failed requests: ${report.summary.failedRequests}`);

    // Show error details if any
    if (jsErrors.length > 0) {
      console.log(`\n   🚨 JavaScript Errors Found:`);
      jsErrors.forEach((err, i) => {
        console.log(`      ${i + 1}. ${err.message}`);
      });
    }

    if (uniqueFailedUrls.length > 0) {
      console.log(`\n   ⚠️ Failed Requests:`);
      report.errorAnalysis.failedRequests.forEach((req, i) => {
        console.log(`      ${i + 1}. [${req.statuses.join(', ')}] ${req.url} (${req.count}x)`);
      });
    }

    console.log(`\n   📁 Screenshots directory: ${SCREENSHOTS_DIR}`);
    console.log(`   📄 Full report: ${reportPath}\n`);

    return report;
  }

  async close() {
    // Create session summary in MongoDB
    if (this.errorCollector.isConnected) {
      const stats = await this.errorCollector.getSessionStats();

      console.log('\n📊 SESSION ERROR SUMMARY:');
      if (stats && stats.length > 0) {
        stats.forEach(stat => {
          console.log(`   ${stat._id}: ${stat.count} errors`);
        });
      } else {
        console.log('   ✅ No errors detected!');
      }

      await this.errorCollector.createSessionSummary({
        routes_tested: ROUTES.length,
        screenshots_captured: this.results.screenshots.length,
        interactions_performed: this.results.interactions.length,
        base_url: BASE_URL
      });
    }

    // Close error collector (flushes buffer and closes connection)
    await this.errorCollector.close();

    if (this.browser) {
      await this.browser.close();
      console.log('🐾 Browser closed. Puppeteer demonstration complete, nyaa~! ✨\n');
    }
  }
}

// Main execution
(async () => {
  const controller = new NekoWebController();

  try {
    await controller.launch();
    await controller.testNavigation();
    await controller.testMobileViewport();
    await controller.testElementInteractions();
    await controller.testJavaScriptExecution();
    await controller.testFormInteraction();
    await controller.testNetworkMonitoring();
    await controller.testPerformanceMetrics();
    await controller.generateReport();
  } catch (error) {
    console.error('❌ Error during demonstration:', error);
    process.exit(1);
  } finally {
    await controller.close();
  }
})();
