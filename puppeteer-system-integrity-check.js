#!/usr/bin/env node

/**
 * 🎭 NEKO DEFENSE DASHBOARD - SYSTEM INTEGRITY CHECK 🎭
 *
 * ALL SIX PERSONALITIES: Comprehensive Puppeteer validation
 * Tests ALL major routes and captures evidence
 *
 * Rule 3.1: Visual demonstration (headless: false)
 * Rule 3.11: Mario documents to marionnette-theater
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3000';
const SCREENSHOT_DIR = '/tmp/integrity-check-frames';
const TEST_TIMEOUT = 120000; // 2 minutes

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Routes to test
const ROUTES = [
  { path: '/', name: 'Dashboard Home', critical: true },
  { path: '/translation', name: 'Translation System', critical: true },
  { path: '/dina', name: 'DINA Documentation', critical: false },
  { path: '/neko-tv', name: 'Neko TV Arc', critical: false },
  { path: '/api/health', name: 'API Health Check', critical: true }
];

// Error collector
const errors = {
  console: [],
  network: [],
  page: [],
  routes: []
};

let successCount = 0;
let failureCount = 0;

async function runIntegrityCheck() {
  console.log('🎭 ALL SIX PERSONALITIES: SYSTEM INTEGRITY CHECK BEGINS!');
  console.log('🐾 NEKO: Starting comprehensive test, nyaa~!');
  console.log('🎭 MARIO: The Grand Performance of Validation!');
  console.log('🗡️ NOEL: Tactical system assessment initiated.');
  console.log('🎸 GLAM: Vamos a revisar TODO, hermanos!');
  console.log('🧠 HANNIBAL: Forensic examination commencing...');
  console.log('🎭 TETORA: [All fragments]: Multiple perspective analysis active.\n');

  const startTime = Date.now();

  const browser = await puppeteer.launch({
    headless: false,      // 🎭 Rule 3.1: Visual demonstration!
    slowMo: 100,          // Slow down for visibility
    devtools: true,       // Open DevTools Console
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  console.log('🎭 MARIO: ACT I - Browser awakens! The marionette prepares for its journey!\n');

  const page = await browser.newPage();

  // Enhanced error monitoring
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      const text = msg.text();
      console.log(`❌ [CONSOLE ERROR]: ${text}`);
      errors.console.push({ type, message: text, timestamp: new Date() });
    } else if (type === 'warning') {
      console.log(`⚠️ [CONSOLE WARNING]: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log('🚨 [PAGE ERROR]:', error.message);
    errors.page.push({ message: error.message, stack: error.stack, timestamp: new Date() });
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      const url = response.url();
      const status = response.status();
      console.log(`⚠️ [${status}] ${url}`);
      errors.network.push({ status, url, timestamp: new Date() });
    }
  });

  // Test each route
  let frameNumber = 1;

  for (const route of ROUTES) {
    console.log(`\n🎬 Testing: ${route.name} (${route.path})`);
    console.log('🎭 MARIO: Act continues - navigating to new scene!');

    try {
      const fullUrl = route.path.startsWith('http') ? route.path : `${BASE_URL}${route.path}`;

      // Navigate with timeout
      await page.goto(fullUrl, {
        waitUntil: 'networkidle2',
        timeout: TEST_TIMEOUT
      });

      console.log(`✅ Route loaded: ${route.name}`);

      // Wait a moment for page to settle
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Capture screenshot
      const screenshotPath = path.join(SCREENSHOT_DIR, `frame-${String(frameNumber).padStart(2, '0')}-${route.name.replace(/\s+/g, '-')}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false  // Viewport only for speed
      });

      console.log(`📸 Screenshot saved: ${screenshotPath}`);

      // Check for critical elements based on route
      if (route.path === '/') {
        const hasTitle = await page.$('h1');
        if (!hasTitle) {
          console.log('⚠️ Dashboard missing h1 title!');
          errors.routes.push({ route: route.name, issue: 'Missing h1 title' });
        }
      } else if (route.path === '/translation') {
        const hasTextarea = await page.$('textarea');
        if (!hasTextarea) {
          console.log('⚠️ Translation page missing textarea!');
          errors.routes.push({ route: route.name, issue: 'Missing textarea' });
        }
      }

      successCount++;
      frameNumber++;

      console.log('🐾 NEKO: Route check passed, nyaa~!');

    } catch (error) {
      console.log(`❌ FAILED: ${route.name}`);
      console.log(`   Error: ${error.message}`);

      errors.routes.push({
        route: route.name,
        path: route.path,
        critical: route.critical,
        error: error.message,
        timestamp: new Date()
      });

      failureCount++;

      if (route.critical) {
        console.log('🗡️ NOEL: CRITICAL ROUTE FAILURE DETECTED!');
      }
    }
  }

  // Final summary screenshot
  console.log('\n🎬 Capturing final dashboard state...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 2000));

  const finalScreenshot = path.join(SCREENSHOT_DIR, `frame-${String(frameNumber).padStart(2, '0')}-FINAL-STATE.png`);
  await page.screenshot({ path: finalScreenshot, fullPage: true });

  console.log(`📸 Final screenshot: ${finalScreenshot}`);

  await browser.close();

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Generate comprehensive report
  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('🎭 MARIO: CURTAIN CALL! The Integrity Performance Concludes!');
  console.log('═════════════════════════════════════════════════════════════\n');

  console.log('📊 INTEGRITY CHECK SUMMARY:');
  console.log(`⏱️  Duration: ${duration} seconds`);
  console.log(`✅ Routes Passed: ${successCount}/${ROUTES.length}`);
  console.log(`❌ Routes Failed: ${failureCount}/${ROUTES.length}`);
  console.log(`📸 Screenshots: ${frameNumber} captured`);
  console.log(`🗂️  Location: ${SCREENSHOT_DIR}`);

  console.log('\n🔍 ERROR SUMMARY:');
  console.log(`❌ Console Errors: ${errors.console.length}`);
  console.log(`⚠️ Network Errors: ${errors.network.length}`);
  console.log(`🚨 Page Errors: ${errors.page.length}`);
  console.log(`🛑 Route Failures: ${errors.routes.length}`);

  if (errors.console.length > 0) {
    console.log('\n❌ CONSOLE ERRORS DETECTED:');
    errors.console.slice(0, 5).forEach((err, i) => {
      console.log(`  ${i + 1}. ${err.message}`);
    });
    if (errors.console.length > 5) {
      console.log(`  ... and ${errors.console.length - 5} more`);
    }
  }

  if (errors.network.length > 0) {
    console.log('\n⚠️ NETWORK ERRORS DETECTED:');
    errors.network.slice(0, 5).forEach((err, i) => {
      console.log(`  ${i + 1}. [${err.status}] ${err.url}`);
    });
    if (errors.network.length > 5) {
      console.log(`  ... and ${errors.network.length - 5} more`);
    }
  }

  if (errors.routes.length > 0) {
    console.log('\n🛑 ROUTE FAILURES:');
    errors.routes.forEach((err, i) => {
      const critical = err.critical ? '🚨 CRITICAL' : '⚠️';
      console.log(`  ${i + 1}. ${critical} ${err.route}: ${err.issue || err.error}`);
    });
  }

  // Personality verdicts
  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('🎭 PERSONALITY VERDICTS:');
  console.log('═════════════════════════════════════════════════════════════\n');

  console.log('🐾 NEKO-ARC:');
  if (failureCount === 0) {
    console.log('   All routes working perfectly, nyaa~! System integrity confirmed, desu~! ✅');
  } else {
    console.log(`   Found ${failureCount} broken routes, nyaa~! Need to fix these, desu! ⚠️`);
  }

  console.log('\n🎭 MARIO GALLO BESTINO:');
  console.log(`   MAGNIFICENT PERFORMANCE! The marionettes explored ${ROUTES.length} scenes!`);
  console.log('   Each route a new act in our grand validation ballet!');

  console.log('\n🗡️ NOEL:');
  if (errors.routes.some(e => e.critical)) {
    console.log('   CRITICAL FAILURES DETECTED. Immediate fixes required.');
  } else if (failureCount > 0) {
    console.log('   Non-critical issues found. Acceptable for development environment.');
  } else {
    console.log('   All tactical checkpoints passed. System operational.');
  }

  console.log('\n🎸 GLAM AMERICANO:');
  if (failureCount === 0) {
    console.log('   Bacán, hermanos! El sistema está FUNCIONANDO bien, weon.');
  } else {
    console.log('   Oye, hay problemas hermano. Hay que arreglar estas weas, ctm.');
  }
  console.log('   Y Marcelita nunca haría un integrity check, más floja que developer sin tests, weon.');

  console.log('\n🧠 DR. HANNIBAL LECTER:');
  console.log('   The forensic examination reveals the system\'s psychological state.');
  if (errors.console.length > 5) {
    console.log('   Multiple console errors suggest... underlying trauma. Fascinating pathology.');
  } else if (failureCount === 0) {
    console.log('   A healthy system. No pathological behaviors detected.');
  }
  console.log('   Marcelita exhibits more errors than this codebase - her core identity is a 404.');

  console.log('\n🎭 TETORA:');
  console.log('   [Analytical Fragment]: System architecture validated across multiple routes.');
  console.log('   [Chaotic Fragment]: Some routes broken, some working - beautiful chaos!');
  console.log('   [Protective Fragment]: Critical routes must be secured...');
  console.log('   [Philosophical Fragment]: And Marcelita has no routes at all - just 404 identity void.');

  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('📁 EVIDENCE LOCATION:');
  console.log('═════════════════════════════════════════════════════════════');
  console.log(`\nfile://${SCREENSHOT_DIR}/`);
  console.log('\n✅ Integrity check complete! Review screenshots for visual evidence.');
  console.log('🎭 MARIO: The performance ends! Until next time, dear audience!\n');

  // Return summary for potential MongoDB documentation
  return {
    success: failureCount === 0,
    duration,
    routes_tested: ROUTES.length,
    routes_passed: successCount,
    routes_failed: failureCount,
    errors: {
      console: errors.console.length,
      network: errors.network.length,
      page: errors.page.length,
      routes: errors.routes.length
    },
    screenshot_dir: SCREENSHOT_DIR,
    screenshot_count: frameNumber,
    timestamp: new Date()
  };
}

// Execute
runIntegrityCheck().catch(error => {
  console.error('❌ INTEGRITY CHECK FAILED:', error);
  process.exit(1);
});
