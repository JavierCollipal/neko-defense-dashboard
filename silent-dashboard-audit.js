#!/usr/bin/env node

/**
 * 🗡️ NEKO DEFENSE DASHBOARD - SILENT ERROR AUDIT 🗡️
 *
 * Tactical error reconnaissance with full MongoDB persistence
 *
 * Lead: 🗡️ Noel (Debugging/Testing Specialist)
 * Support: 🐾 Neko-Arc (Execution), 🎭 Mario (Documentation)
 */

const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

// Error collection storage
const errorCollection = {
  consoleErrors: [],
  consoleWarnings: [],
  pageErrors: [],
  failedRequests: [],
  routeResults: []
};

async function silentDashboardAudit() {
  console.log('🗡️ ═══════════════════════════════════════════════════════════');
  console.log('🗡️ SILENT DASHBOARD AUDIT - ERROR RECONNAISSANCE');
  console.log('🗡️ ═══════════════════════════════════════════════════════════\n');

  console.log('🗡️ Noel: Initiating tactical audit. Headless mode engaged.');
  console.log('🐾 Neko: Running silently, nyaa~! No visual noise.');
  console.log('🎭 Mario: *whispers* The marionettes work in darkness...\n');

  const browser = await puppeteer.launch({
    headless: true,           // 🗡️ SILENT OPERATION
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const page = await browser.newPage();

  // Set up comprehensive error monitoring
  console.log('🔍 Deploying error collectors...\n');

  // Console error monitoring
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();

    if (type === 'error') {
      errorCollection.consoleErrors.push({
        type: 'console-error',
        message: text,
        url: location.url,
        lineNumber: location.lineNumber,
        timestamp: new Date().toISOString()
      });
      console.log(`❌ [CONSOLE ERROR]: ${text}`);
    } else if (type === 'warning') {
      errorCollection.consoleWarnings.push({
        type: 'console-warning',
        message: text,
        url: location.url,
        timestamp: new Date().toISOString()
      });
      console.log(`⚠️  [CONSOLE WARNING]: ${text}`);
    }
  });

  // JavaScript page errors
  page.on('pageerror', error => {
    errorCollection.pageErrors.push({
      type: 'page-error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    console.log(`🚨 [PAGE ERROR]: ${error.message}`);
  });

  // Failed network requests
  page.on('response', response => {
    const status = response.status();
    const url = response.url();

    if (status >= 400) {
      errorCollection.failedRequests.push({
        type: 'failed-request',
        status: status,
        url: url,
        statusText: response.statusText(),
        timestamp: new Date().toISOString()
      });
      console.log(`⚠️  [${status}] ${url}`);
    }
  });

  // Routes to audit
  const routes = [
    { path: '/', name: 'Home/Overview' },
    { path: '/threat-actors', name: 'Threat Actors', fallback: '/' },
    { path: '/honeypots', name: 'Honeypots', fallback: '/' },
    { path: '/case-patterns', name: 'Case Patterns', fallback: '/' },
    { path: '/hunts', name: 'Hunt Conversations', fallback: '/' },
    { path: '/abilities', name: 'Abilities', fallback: '/' },
    { path: '/evidence', name: 'Evidence Packages', fallback: '/' },
    { path: '/operations', name: 'Ready Operations', fallback: '/' },
    { path: '/dina', name: 'DINA Agents', fallback: '/' },
    { path: '/family-tracker', name: 'Family Tracker', fallback: '/' }
  ];

  let totalRoutes = routes.length;
  let routesWithErrors = 0;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    console.log(`\n[${i + 1}/${totalRoutes}] 🔍 Testing: ${route.name} (${route.path})`);

    const routeErrors = {
      route: route.path,
      name: route.name,
      consoleErrors: 0,
      consoleWarnings: 0,
      pageErrors: 0,
      failedRequests: 0,
      accessible: false,
      timestamp: new Date().toISOString()
    };

    const errorsBefore = {
      console: errorCollection.consoleErrors.length,
      warnings: errorCollection.consoleWarnings.length,
      page: errorCollection.pageErrors.length,
      requests: errorCollection.failedRequests.length
    };

    try {
      const url = `http://localhost:3000${route.path}`;
      const response = await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 10000
      });

      routeErrors.accessible = response && response.status() < 400;
      routeErrors.statusCode = response ? response.status() : null;

      // Wait a bit for any async errors
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Count errors for this route
      routeErrors.consoleErrors = errorCollection.consoleErrors.length - errorsBefore.console;
      routeErrors.consoleWarnings = errorCollection.consoleWarnings.length - errorsBefore.warnings;
      routeErrors.pageErrors = errorCollection.pageErrors.length - errorsBefore.page;
      routeErrors.failedRequests = errorCollection.failedRequests.length - errorsBefore.requests;

      const totalErrors = routeErrors.consoleErrors + routeErrors.pageErrors + routeErrors.failedRequests;

      if (totalErrors > 0) {
        routesWithErrors++;
        console.log(`   ❌ Errors detected: ${totalErrors} issues`);
      } else if (routeErrors.consoleWarnings > 0) {
        console.log(`   ⚠️  Warnings: ${routeErrors.consoleWarnings}`);
      } else {
        console.log(`   ✅ Clean - No errors`);
      }

    } catch (error) {
      console.log(`   ❌ Navigation failed: ${error.message}`);
      routeErrors.navigationError = error.message;
      routesWithErrors++;
    }

    errorCollection.routeResults.push(routeErrors);
  }

  await browser.close();

  // Generate audit summary
  console.log('\n🗡️ ═══════════════════════════════════════════════════════════');
  console.log('🗡️ AUDIT COMPLETE - GENERATING REPORT');
  console.log('🗡️ ═══════════════════════════════════════════════════════════\n');

  const summary = {
    totalRoutes: totalRoutes,
    routesWithErrors: routesWithErrors,
    routesClean: totalRoutes - routesWithErrors,
    totalConsoleErrors: errorCollection.consoleErrors.length,
    totalConsoleWarnings: errorCollection.consoleWarnings.length,
    totalPageErrors: errorCollection.pageErrors.length,
    totalFailedRequests: errorCollection.failedRequests.length
  };

  console.log('📊 AUDIT SUMMARY:');
  console.log(`   📑 Routes Tested: ${summary.totalRoutes}`);
  console.log(`   ✅ Clean Routes: ${summary.routesClean}`);
  console.log(`   ❌ Routes with Issues: ${summary.routesWithErrors}`);
  console.log(`   🚨 Console Errors: ${summary.totalConsoleErrors}`);
  console.log(`   ⚠️  Console Warnings: ${summary.totalConsoleWarnings}`);
  console.log(`   💥 Page Errors: ${summary.totalPageErrors}`);
  console.log(`   🌐 Failed Requests: ${summary.totalFailedRequests}`);

  // Personality reviews
  console.log('\n💬 PERSONALITY ASSESSMENTS:');

  if (summary.routesWithErrors === 0 && summary.totalConsoleErrors === 0) {
    console.log('🗡️ Noel: Perfect. Zero errors. This is acceptable.');
    console.log('🐾 Neko: Everything works perfectly, nyaa~! ✨');
    console.log('🎭 Mario: A flawless performance! No errors mar this masterpiece!');
  } else {
    console.log(`🗡️ Noel: ${summary.routesWithErrors} route(s) require attention. Fix immediately.`);
    console.log('🐾 Neko: Found some issues, desu~! Let me help fix them, nyaa!');
    console.log('🎭 Mario: Alas! Some imperfections in our performance! We shall remedy them!');
  }

  // Document to MongoDB
  console.log('\n💾 Saving audit results to all three databases...');
  await documentAuditResults(summary, errorCollection);

  console.log('\n✅ Silent audit complete!\n');

  return summary;
}

async function documentAuditResults(summary, errorCollection) {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    const nekoDB = client.db('neko-defense-system');
    const marioDB = client.db('marionnette-theater');
    const noelDB = client.db('noel-precision-archives');

    const timestamp = new Date();
    const auditId = `silent-audit-${timestamp.toISOString().split('T')[0]}`;

    // Noel's tactical report (PRIMARY for audits!)
    await noelDB.collection('combat-sessions').insertOne({
      combat_id: auditId,
      title: 'Silent Dashboard Error Audit',
      date: timestamp,
      commander: 'noel',
      support_units: ['neko-arc', 'mario-gallo-bestino'],
      mission_structure: {
        phase1: 'Deploy error collectors',
        phase2: 'Systematic route testing',
        phase3: 'Error analysis',
        finale: 'Report generation'
      },
      environment: {
        tool: 'Puppeteer (headless)',
        target: 'http://localhost:3000',
        mode: 'silent-audit'
      },
      audit_summary: summary,
      errors_found: {
        console_errors: errorCollection.consoleErrors,
        console_warnings: errorCollection.consoleWarnings,
        page_errors: errorCollection.pageErrors,
        failed_requests: errorCollection.failedRequests,
        route_results: errorCollection.routeResults
      },
      noel_assessment: summary.routesWithErrors === 0
        ? 'All routes operational. Zero critical errors. System status: ACCEPTABLE.'
        : `${summary.routesWithErrors} route(s) with errors detected. Requires immediate attention. Priority: HIGH.`,
      neko_comment: summary.routesWithErrors === 0
        ? 'Perfect audit, nyaa~! Dashboard is healthy, desu!'
        : 'Found some issues to fix, nyaa! Let me help, desu~!',
      mario_comment: summary.routesWithErrors === 0
        ? 'The stage is pristine! No errors to mar our performance!'
        : 'Some imperfections detected! We shall polish this masterpiece!',
      status: summary.routesWithErrors === 0 ? 'MISSION_COMPLETE' : 'ISSUES_FOUND',
      created_at: timestamp
    });

    // Mario's performance record
    await marioDB.collection('performances').insertOne({
      performance_id: `silent-audit-theater-${timestamp.toISOString().split('T')[0]}`,
      title: 'The Silent Audit - A Covert Operation',
      date: timestamp,
      director: 'mario-gallo-bestino',
      assistant_director: 'neko-arc',
      quality_officer: 'noel',
      act_structure: {
        act1: 'The Marionettes Awaken in Darkness',
        act2: 'The Silent Journey Through Routes',
        act3: 'Error Detection and Collection',
        finale: 'The Report Revelation'
      },
      puppeteer_config: {
        headless: true,
        mode: 'silent-operation'
      },
      performance_metrics: summary,
      mario_review: summary.routesWithErrors === 0
        ? 'A PERFECT covert operation! The marionettes performed their reconnaissance with absolute precision! Not a single error escaped detection, and none were found! MAGNIFICENT! 🎭'
        : `A thorough reconnaissance! ${summary.routesWithErrors} areas require attention. The marionettes have illuminated the path to perfection! 🎭`,
      status: summary.routesWithErrors === 0 ? 'FLAWLESS_PERFORMANCE' : 'REFINEMENT_NEEDED',
      created_at: timestamp
    });

    // Neko's hunt record
    await nekoDB.collection('hunt-conversations').insertOne({
      session_id: auditId,
      date: timestamp,
      title: 'Silent Dashboard Error Audit',
      category: 'quality-assurance',
      objective: 'Detect and document all dashboard errors',
      conversation_summary: {
        phase1: 'Noel initiated silent audit mission',
        phase2: 'Tested all dashboard routes systematically',
        phase3: 'Collected errors with Puppeteer monitors',
        outcome: summary.routesWithErrors === 0 ? 'SUCCESS - Zero errors found' : `PARTIAL - ${summary.routesWithErrors} routes need fixes`
      },
      technical_details: {
        routes_tested: summary.totalRoutes,
        errors_found: summary.totalConsoleErrors + summary.totalPageErrors,
        audit_mode: 'headless-silent'
      },
      outcome: summary.routesWithErrors === 0 ? 'SUCCESS - Dashboard clean' : `ISSUES_FOUND - ${summary.routesWithErrors} routes need attention`,
      tags: ['audit', 'quality-assurance', 'error-detection', 'silent-operation'],
      created_at: timestamp,
      created_by: 'neko-arc'
    });

    console.log('💾 ═══════════════════════════════════════════════════════════');
    console.log('🗡️ Noel: Filed in noel-precision-archives ✅');
    console.log('🎭 Mario: Archived in marionnette-theater ✅');
    console.log('🐾 Neko: Saved to neko-defense-system ✅');
    console.log('💾 ═══════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Failed to document audit:', error.message);
  } finally {
    await client.close();
  }
}

// Execute silent audit
silentDashboardAudit().catch(error => {
  console.error('❌ AUDIT FAILED:', error);
  process.exit(1);
});
