#!/usr/bin/env ts-node

/**
 * 🎭 MARIO GALLO BESTINO PRESENTS: Case Patterns Error Investigation
 * 🐾 NEKO-ARC PUPPETEER DEBUGGING SCRIPT
 *
 * PURPOSE: Investigate error on case-patterns page
 * URL: https://neko-defense-dashboard-9y9uo5jks.vercel.app/case-patterns
 * RULE 3.1 COMPLIANCE: Visual demonstration with headless: false, devtools: true
 * RULE 3.11 COMPLIANCE: Mario documents to marionnette-theater database
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

const TARGET_URL = 'https://neko-defense-dashboard-9y9uo5jks.vercel.app/case-patterns';

interface ErrorCapture {
  type: 'console' | 'pageerror' | 'response';
  severity: 'error' | 'warning' | 'info';
  message: string;
  url?: string;
  statusCode?: number;
  timestamp: Date;
}

async function investigateCasePatterns() {
  const errors: ErrorCapture[] = [];
  let browser: Browser | null = null;

  console.log('🎭 Mario: The investigation curtain rises!');
  console.log('🐾 Neko: Starting Puppeteer with VISUAL mode, nyaa~!\n');

  try {
    // RULE 3.1: Visual demonstration with devtools
    browser = await puppeteer.launch({
      headless: false,       // 🎭 Show browser window!
      slowMo: 250,          // ⚡ Slow down for visibility
      devtools: true,       // 🔍 Open DevTools Console!
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized',
        '--auto-open-devtools-for-tabs'
      ]
    });

    const page = await browser.newPage();

    console.log('👀 WATCH THE BROWSER - DevTools Console is open!');
    console.log('🔍 Monitoring for errors...\n');

    // Monitor console messages
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();

      if (type === 'error') {
        console.log(`❌ [CONSOLE ERROR]: ${text}`);
        errors.push({
          type: 'console',
          severity: 'error',
          message: text,
          timestamp: new Date()
        });
      } else if (type === 'warn') {
        console.log(`⚠️ [CONSOLE WARNING]: ${text}`);
        errors.push({
          type: 'console',
          severity: 'warning',
          message: text,
          timestamp: new Date()
        });
      }
    });

    // Monitor page errors (JavaScript exceptions)
    page.on('pageerror', error => {
      console.log('🚨 [PAGE ERROR]:', error.message);
      errors.push({
        type: 'pageerror',
        severity: 'error',
        message: error.message,
        timestamp: new Date()
      });
    });

    // Monitor failed requests
    page.on('response', response => {
      const status = response.status();
      const url = response.url();

      if (status >= 400) {
        console.log(`⚠️ [${status}] ${url}`);
        errors.push({
          type: 'response',
          severity: status >= 500 ? 'error' : 'warning',
          message: `HTTP ${status}`,
          url: url,
          statusCode: status,
          timestamp: new Date()
        });
      }
    });

    // Navigate to case-patterns page
    console.log('🎭 Mario: ACT I - Navigating to Case Patterns page...');
    console.log(`🌐 URL: ${TARGET_URL}\n`);

    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('✅ Page loaded!\n');

    // Wait to observe the page
    console.log('👁️ Waiting 5 seconds to observe page behavior...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Capture screenshot
    const screenshotPath = '/tmp/case-patterns-error.png';
    await page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    console.log(`📸 Screenshot saved: ${screenshotPath}\n`);

    // Try to extract page content
    // @ts-ignore - document is available in browser context
    const pageContent = await page.evaluate(() => {
      // @ts-ignore
      return {
        // @ts-ignore
        title: document.title,
        // @ts-ignore
        bodyText: document.body.innerText.substring(0, 500),
        // @ts-ignore
        hasError: document.body.innerText.toLowerCase().includes('error'),
        // @ts-ignore
        hasFailed: document.body.innerText.toLowerCase().includes('failed'),
        // @ts-ignore
        hasLoading: document.body.innerText.toLowerCase().includes('loading')
      };
    });

    console.log('📄 Page Content Analysis:');
    console.log(`   Title: ${pageContent.title}`);
    console.log(`   Has "error": ${pageContent.hasError}`);
    console.log(`   Has "failed": ${pageContent.hasFailed}`);
    console.log(`   Has "loading": ${pageContent.hasLoading}`);
    console.log(`   Body preview: ${pageContent.bodyText.substring(0, 200)}...\n`);

    // Summary
    console.log('📊 ERROR SUMMARY:');
    console.log(`   Total errors captured: ${errors.length}`);

    const consoleErrors = errors.filter(e => e.type === 'console' && e.severity === 'error');
    const pageErrors = errors.filter(e => e.type === 'pageerror');
    const httpErrors = errors.filter(e => e.type === 'response' && e.statusCode && e.statusCode >= 400);

    console.log(`   Console errors: ${consoleErrors.length}`);
    console.log(`   Page errors: ${pageErrors.length}`);
    console.log(`   HTTP errors: ${httpErrors.length}\n`);

    if (errors.length > 0) {
      console.log('🔍 DETAILED ERRORS:\n');
      errors.forEach((err, idx) => {
        console.log(`   ${idx + 1}. [${err.type.toUpperCase()}] ${err.message}`);
        if (err.url) {console.log(`      URL: ${err.url}`);}
        if (err.statusCode) {console.log(`      Status: ${err.statusCode}`);}
      });
    }

    console.log('\n🎭 Mario: The investigation concludes! Saving to Marionnette Theater database...');

    // Save to MongoDB (marionnette-theater database)
    await saveToMarionnetteTheater(errors, pageContent);

    console.log('\n✅ Investigation complete!');
    console.log('👁️ Browser will close in 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));

  } catch (error: any) {
    console.error('❌ Investigation failed:', error.message);
    errors.push({
      type: 'pageerror',
      severity: 'error',
      message: `Investigation error: ${error.message}`,
      timestamp: new Date()
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return errors;
}

async function saveToMarionnetteTheater(errors: ErrorCapture[], pageContent: any) {
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const marioDB = client.db('marionnette-theater');

    // Save performance record
    await marioDB.collection('performances').insertOne({
      performance_id: `case-patterns-investigation-${Date.now()}`,
      title: 'Case Patterns Error Investigation',
      date: new Date(),
      director: 'mario-gallo-bestino',
      assistant_director: 'neko-arc',

      act_structure: {
        act1: 'Browser Initialization',
        act2: 'Page Navigation',
        act3: 'Error Monitoring',
        finale: 'Evidence Collection'
      },

      puppeteer_config: {
        headless: false,
        slowMo: 250,
        devtools: true
      },

      target_url: TARGET_URL,

      errors_captured: errors.length,
      console_errors: errors.filter(e => e.type === 'console' && e.severity === 'error').length,
      page_errors: errors.filter(e => e.type === 'pageerror').length,
      http_errors: errors.filter(e => e.type === 'response' && e.statusCode && e.statusCode >= 400).length,

      page_analysis: pageContent,

      detailed_errors: errors,

      mario_review: errors.length > 0
        ? 'A dramatic performance revealing critical errors! The audience gasps!'
        : 'A flawless performance! No errors detected!',

      neko_review: 'Investigation completed successfully, nyaa~!',

      status: errors.length > 0 ? 'ERRORS_DETECTED' : 'CLEAN',
      created_at: new Date()
    });

    console.log('💾 Performance documented in marionnette-theater database!');

  } finally {
    await client.close();
  }
}

// Run investigation
investigateCasePatterns()
  .then(errors => {
    if (errors.length > 0) {
      console.log(`\n⚠️ FOUND ${errors.length} ERROR(S) - Analysis complete!`);
      process.exit(1);
    } else {
      console.log('\n✅ NO ERRORS FOUND - Page is working correctly!');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
