#!/usr/bin/env ts-node

/**
 * Vercel Production Dashboard Audit with Error Collection
 *
 * Four-Personality Collaboration:
 * 🐾 Neko-Arc: Executes Puppeteer automation
 * 🎭 Mario Gallo Bestino: Documents performance to marionnette-theater
 * 🗡️ Noel: Analyzes errors tactically to noel-precision-archives
 * 🎸 Glam Americano: Provides reality checks (Spanish only!)
 *
 * Rules Applied:
 * - Rule 3.1: Puppeteer Visual Demo (headless: false, devtools: true, slowMo: 250)
 * - Rule 3.7: TypeScript default language
 * - Rule 3.8: Syntax validation before execution
 * - Rule 3.11/3.12: Quad personality collaboration
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

// Vercel production URL
const VERCEL_URL = 'https://neko-defense-dashboard.vercel.app';

// PuppeteerErrorCollector class (inline for TypeScript)
class PuppeteerErrorCollector {
  private client: MongoClient;
  private db: any;
  private sessionId: string;
  private errors: any[] = [];

  constructor(mongoUri: string, sessionId: string) {
    this.client = new MongoClient(mongoUri);
    this.sessionId = sessionId;
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db('noel-precision-archives');
    console.log('🗡️ Noel: Connected to noel-precision-archives database.');
  }

  async saveConsoleError(type: string, message: string, context: any): Promise<void> {
    const error = {
      session_id: this.sessionId,
      error_type: 'CONSOLE_ERROR',
      console_type: type,
      message,
      context,
      timestamp: new Date(),
      severity: type === 'error' ? 'HIGH' : 'MEDIUM'
    };

    this.errors.push(error);
    await this.db.collection('evidence-captures').insertOne(error);

    console.log(`❌ [CONSOLE ${type.toUpperCase()}]: ${message}`);
  }

  async saveJavaScriptError(error: Error, context: any): Promise<void> {
    const errorDoc = {
      session_id: this.sessionId,
      error_type: 'JAVASCRIPT_ERROR',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date(),
      severity: 'CRITICAL'
    };

    this.errors.push(errorDoc);
    await this.db.collection('critical-failures').insertOne(errorDoc);

    console.log(`🚨 [JAVASCRIPT ERROR]: ${error.message}`);
  }

  async saveFailedRequest(status: number, url: string, context: any): Promise<void> {
    const errorDoc = {
      session_id: this.sessionId,
      error_type: 'FAILED_REQUEST',
      status_code: status,
      url,
      context,
      timestamp: new Date(),
      severity: status >= 500 ? 'CRITICAL' : 'HIGH'
    };

    this.errors.push(errorDoc);
    await this.db.collection('evidence-captures').insertOne(errorDoc);

    console.log(`⚠️ [${status}] ${url}`);
  }

  async createSessionSummary(metadata: any): Promise<void> {
    const summary = {
      session_id: this.sessionId,
      date: new Date(),
      commander: 'noel',
      support_units: ['neko-arc', 'mario-gallo-bestino', 'glam-americano'],
      total_errors: this.errors.length,
      error_breakdown: {
        console_errors: this.errors.filter(e => e.error_type === 'CONSOLE_ERROR').length,
        javascript_errors: this.errors.filter(e => e.error_type === 'JAVASCRIPT_ERROR').length,
        failed_requests: this.errors.filter(e => e.error_type === 'FAILED_REQUEST').length
      },
      metadata,
      noel_assessment: this.errors.length === 0
        ? "Clean audit. No critical failures detected. Acceptable performance."
        : `${this.errors.length} errors identified. Requires immediate attention.`,
      status: this.errors.length === 0 ? 'MISSION_SUCCESS' : 'ISSUES_DETECTED',
      created_at: new Date()
    };

    await this.db.collection('combat-sessions').insertOne(summary);

    console.log('\n🗡️ Noel: Session summary saved to combat-sessions collection.');
  }

  async close(): Promise<void> {
    await this.client.close();
    console.log('🗡️ Noel: Database connection closed.');
  }

  getErrorCount(): number {
    return this.errors.length;
  }
}

// Mario's performance documentation
async function documentPerformanceToMario(sessionId: string, routes: string[], errorCount: number): Promise<void> {
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db('marionnette-theater');

    const performance = {
      performance_id: sessionId,
      title: 'The Grand Vercel Production Audit',
      date: new Date(),
      director: 'mario-gallo-bestino',
      assistant_directors: ['neko-arc', 'noel', 'glam-americano'],

      act_structure: {
        act1: 'Browser Initialization with DevTools',
        act2: 'Navigation Through All Routes',
        act3: 'Error Collection and Analysis',
        finale: 'Session Summary and Documentation'
      },

      puppeteer_config: {
        headless: false,
        slowMo: 250,
        devtools: true,
        args: ['--start-maximized', '--auto-open-devtools-for-tabs']
      },

      routes_tested: routes,
      total_errors_discovered: errorCount,

      mario_review: errorCount === 0
        ? "PERFECTION! A FLAWLESS performance! The marionettes danced without ERROR! STANDING OVATION!"
        : `A dramatic performance with ${errorCount} PLOT TWISTS! The marionettes discovered hidden flaws! ENCORE!`,

      status: errorCount === 0 ? 'STANDING_OVATION' : 'DRAMATIC_DISCOVERY',
      created_at: new Date()
    };

    await db.collection('performances').insertOne(performance);
    console.log('🎭 Mario: Performance documented to marionnette-theater!');

  } finally {
    await client.close();
  }
}

// Main audit function
async function auditVercelProduction(): Promise<void> {
  const sessionId = `vercel-production-audit-${new Date().toISOString().split('T')[0]}`;

  console.log('\n════════════════════════════════════════════════════════════════════════════════');
  console.log('🎬 VERCEL PRODUCTION AUDIT - QUAD PERSONALITY COLLABORATION 🎬');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  console.log('🐾 Neko-Arc: *ears perk up excitedly*');
  console.log('   Starting Puppeteer audit of Vercel production, nyaa~! 🚀\n');

  console.log('🎭 Mario Gallo Bestino: *sweeps cape*');
  console.log('   ACT I BEGINS! The marionettes awaken to inspect the production stage! 🎭\n');

  console.log('🗡️ Noel: *adjusts glasses*');
  console.log('   Tch. Error collection protocol activated. Every failure will be documented.\n');

  console.log('🎸 Glam Americano: *enciende cigarrillo*');
  console.log('   Oye hermanos, vamos a auditar la producción en vivo, ctm.');
  console.log('   Puppeteer con DevTools visible, pura transparencia, weon. 🔥\n');

  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  // Initialize error collector (Noel's domain)
  const errorCollector = new PuppeteerErrorCollector(MONGODB_URI!, sessionId);
  await errorCollector.connect();

  // Launch browser (Mario's performance)
  console.log('👀 WATCH THE BROWSER WINDOW APPEAR!\n');
  console.log('🎭 Mario: The stage curtains OPEN! The Chrome marionette awakens!\n');

  const browser: Browser = await puppeteer.launch({
    headless: false,           // 🎭 Visual demo (Rule 3.1)
    slowMo: 250,              // ⚡ Slow enough to see
    devtools: true,           // 🔍 Auto-open DevTools Console (Rule 3.1)
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page: Page = await browser.newPage();
  let currentRoute = 'initialization';
  const routesTested: string[] = [];

  // Enhanced error monitoring (Noel's tactical analysis)
  page.on('console', async (msg) => {
    const type = msg.type();
    if (type === 'error') {
      await errorCollector.saveConsoleError(type, msg.text(), {
        route: currentRoute,
        url: page.url()
      });
    } else if (type === 'warn') {
      console.log(`⚠️ [CONSOLE WARNING]: ${msg.text()}`);
    }
  });

  page.on('pageerror', async (error) => {
    await errorCollector.saveJavaScriptError(error, {
      route: currentRoute,
      url: page.url()
    });
  });

  page.on('response', async (response) => {
    if (response.status() >= 400) {
      await errorCollector.saveFailedRequest(
        response.status(),
        response.url(),
        { route: currentRoute }
      );
    }
  });

  // Routes to test
  const routes = [
    { path: '/', name: 'Homepage' },
    { path: '/threat-actors', name: 'Threat Actors' },
    { path: '/honeypots', name: 'Honeypots' },
    { path: '/case-patterns', name: 'Case Patterns' },
    { path: '/hunts', name: 'Hunt Conversations' },
    { path: '/evidence', name: 'Evidence Packages' },
    { path: '/operations', name: 'Ready Operations' },
    { path: '/dina', name: 'DINA Agents' },
    { path: '/abilities', name: 'Abilities' },
    { path: '/family-tracker', name: 'Family Tracker' }
  ];

  console.log('🐾 Neko-Arc: Testing all major routes, nyaa~!\n');
  console.log('🗡️ Noel: Error monitoring ACTIVE on all routes.\n');

  for (const route of routes) {
    currentRoute = route.name;
    routesTested.push(route.name);

    console.log(`\n🎭 Mario: ACT II - Scene: "${route.name}"!`);
    console.log(`🐾 Neko: Navigating to ${VERCEL_URL}${route.path}, desu~!`);

    try {
      await page.goto(`${VERCEL_URL}${route.path}`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      console.log(`✅ ${route.name} loaded successfully!`);

      // Pause to let user see the page
      console.log('👁️ WATCH the page in the browser window...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Scroll to see more content
      // @ts-ignore - window exists in browser context
      await page.evaluate(() => window.scrollTo(0, 500));
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error: any) {
      console.log(`❌ ${route.name} FAILED to load!`);
      await errorCollector.saveJavaScriptError(error, {
        route: route.name,
        path: route.path
      });
    }
  }

  console.log('\n🎸 Glam Americano:');
  console.log('   Hermanos, terminamos el audit completo, ctm.');
  console.log('   Ahora vamos a ver cuántos errores encontramos, weon. 🔍\n');

  // Create session summary
  const errorCount = errorCollector.getErrorCount();

  console.log('\n════════════════════════════════════════════════════════════════════════════════');
  console.log('📊 AUDIT RESULTS 📊');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  console.log(`🎯 Routes Tested: ${routesTested.length}`);
  console.log(`❌ Total Errors: ${errorCount}\n`);

  if (errorCount === 0) {
    console.log('🐾 Neko-Arc: *bounces excitedly*');
    console.log('   ZERO ERRORS! The production dashboard is PERFECT, nyaa~! 🎉✨\n');

    console.log('🎭 Mario: *standing ovation*');
    console.log('   BRAVO! BRAVISSIMO! A FLAWLESS PERFORMANCE! 🎭👏\n');

    console.log('🗡️ Noel:');
    console.log('   Tch. Clean audit. No failures detected. Acceptable.\n');

    console.log('🎸 Glam: ');
    console.log('   ¡Perfecto, hermanos! Cero errores, pura calidad, ctm. 💪\n');
  } else {
    console.log('🐾 Neko-Arc: *ears droop*');
    console.log(`   Found ${errorCount} errors, desu... Let's fix them, nyaa! 🔧\n`);

    console.log('🎭 Mario:');
    console.log(`   ${errorCount} DRAMATIC PLOT TWISTS discovered! The marionettes found hidden flaws! 🎭\n`);

    console.log('🗡️ Noel: *adjusts glasses*');
    console.log(`   ${errorCount} failures documented. Review noel-precision-archives for tactical analysis.\n`);

    console.log('🎸 Glam:');
    console.log(`   Oye, ${errorCount} errores encontrados, weon.`);
    console.log('   Hay que arreglar esta wea, hermano. A trabajar, ctm. 🔧\n');
  }

  // Save session summary (Noel's tactical report)
  await errorCollector.createSessionSummary({
    routes_tested: routesTested.length,
    vercel_url: VERCEL_URL,
    audit_type: 'PRODUCTION_COMPREHENSIVE'
  });

  // Document to Mario's database
  await documentPerformanceToMario(sessionId, routesTested, errorCount);

  // Close connections
  await errorCollector.close();

  console.log('\n════════════════════════════════════════════════════════════════════════════════');
  console.log('💾 TRIPLE DATABASE DOCUMENTATION COMPLETE 💾');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  console.log('🗡️ Noel: Combat session saved to noel-precision-archives.combat-sessions');
  console.log('🗡️ Noel: Errors saved to noel-precision-archives.evidence-captures + critical-failures');
  console.log('🎭 Mario: Performance saved to marionnette-theater.performances\n');

  console.log('🎸 Glam:');
  console.log('   Todo documentado en MongoDB, hermanos.');
  console.log('   Triple base de datos con toda la información, ctm.');
  console.log('   Así se hace auditoría PROFESIONAL, weon. 💪📊\n');

  console.log('════════════════════════════════════════════════════════════════════════════════');
  console.log('🎬 AUDIT COMPLETE - Browser will remain open for review 🎬');
  console.log('════════════════════════════════════════════════════════════════════════════════\n');

  console.log('🐾 Neko: Browser staying open so you can review, nyaa~!');
  console.log('🎭 Mario: The stage remains illuminated for your inspection!');
  console.log('🗡️ Noel: Review DevTools Console for detailed error logs.');
  console.log('🎸 Glam: Revisa la consola del browser, hermano. Ahí está todo, ctm.\n');

  console.log('Press Ctrl+C to close the browser and exit.\n');

  // Keep browser open indefinitely
  await new Promise(() => {});
}

// Execute audit
auditVercelProduction().catch(console.error);
