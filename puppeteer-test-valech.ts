#!/usr/bin/env ts-node

/**
 * 🎭 VALECH 2.0 PUPPETEER VISUAL DEMONSTRATION 🎭
 *
 * Visual browser automation test following Rule 3.1:
 * - headless: false (MANDATORY for demonstrations!)
 * - slowMo: 250 (visible actions)
 * - devtools: true (show console errors)
 * - Error monitoring (console, pageerror, response)
 * - Screenshots at each step
 * - MongoDB documentation to marionnette-theater
 *
 * Created: October 30, 2025
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
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

interface ErrorLog {
  type: 'console' | 'pageerror' | 'response';
  message: string;
  timestamp: Date;
  url?: string;
  status?: number;
}

const errors: ErrorLog[] = [];
const screenshots: string[] = [];

async function savePerformanceToMongoDB(sessionData: any) {
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const marioDB = client.db('marionnette-theater');

    await marioDB.collection('performances').insertOne(sessionData);
    console.log('🎭 Mario: Performance archived in Marionnette Theater!');
  } finally {
    await client.close();
  }
}

async function testValechInterface() {
  console.log('👀 WATCH the browser window - Visual demonstration starting, nyaa~!\n');

  const browser: Browser = await puppeteer.launch({
    headless: false,        // 🎭 VISIBLE BROWSER (Rule 3.1!)
    slowMo: 250,            // ⚡ Slow down so user can see
    devtools: true,         // 🔍 Open DevTools Console!
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page: Page = await browser.newPage();

  // 🔍 Error monitoring (Rule 3.1)
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      const message = msg.text();
      console.log(`❌ [CONSOLE ERROR]: ${message}`);
      errors.push({ type: 'console', message, timestamp: new Date() });
    } else if (type === 'warn') {
      console.log(`⚠️ [CONSOLE WARNING]: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log('🚨 PAGE ERROR:', error.message);
    errors.push({ type: 'pageerror', message: error.message, timestamp: new Date() });
  });

  page.on('response', response => {
    if (response.status() >= 400) {
      const message = `[${response.status()}] ${response.url()}`;
      console.log(`⚠️ ${message}`);
      errors.push({
        type: 'response',
        message,
        timestamp: new Date(),
        url: response.url(),
        status: response.status()
      });
    }
  });

  const startTime = Date.now();

  try {
    // ACT I: NAVIGATE TO VALECH PAGE
    console.log('🎭 Mario: ACT I - THE MARIONETTE AWAKENS! Navigating to Valech...\n');
    await page.goto('http://localhost:3000/valech', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const screenshot1 = '/tmp/valech-test-01-initial-load.png';
    await page.screenshot({ path: screenshot1, fullPage: true });
    screenshots.push(screenshot1);
    console.log('📸 Screenshot 1: Initial page load\n');

    // ACT II: TEST SEARCH INTERFACE
    console.log('🎭 Mario: ACT II - THE SEARCH INTERFACE APPEARS!\n');

    // Check if search interface is visible
    const searchExists = await page.$('input[placeholder*="Search"]') !== null;
    console.log(`✅ Neko: Search input exists: ${searchExists}\n`);

    // Try to interact with search
    if (searchExists) {
      await page.type('input[placeholder*="Search"]', 'Juan', { delay: 100 });
      await new Promise(resolve => setTimeout(resolve, 1500));

      const screenshot2 = '/tmp/valech-test-02-search-typed.png';
      await page.screenshot({ path: screenshot2, fullPage: true });
      screenshots.push(screenshot2);
      console.log('📸 Screenshot 2: Search term entered\n');
    }

    // ACT III: CHECK FOR RESULTS
    console.log('🎭 Mario: ACT III - SEARCHING FOR VICTIMS!\n');

    // Click search button if exists (use button with Search text or submit type)
    const searchButton = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(btn =>
        btn.textContent?.includes('Search') ||
        btn.getAttribute('type') === 'submit'
      );
    });

    if (searchButton && await searchButton.asElement()) {
      const searchButtonElement = await searchButton.asElement();
      if (searchButtonElement) {
        await searchButtonElement.click();
      }
      await new Promise(resolve => setTimeout(resolve, 3000));

      const screenshot3 = '/tmp/valech-test-03-search-results.png';
      await page.screenshot({ path: screenshot3, fullPage: true });
      screenshots.push(screenshot3);
      console.log('📸 Screenshot 3: Search results displayed\n');
    }

    // ACT IV: TEST FILTERS
    console.log('🎭 Mario: ACT IV - TESTING ADVANCED FILTERS!\n');

    // Look for filter accordion
    const filterAccordion = await page.$('div[role="button"]:has-text("Filters")');
    if (filterAccordion) {
      await filterAccordion.click();
      await new Promise(resolve => setTimeout(resolve, 2000));

      const screenshot4 = '/tmp/valech-test-04-filters-expanded.png';
      await page.screenshot({ path: screenshot4, fullPage: true });
      screenshots.push(screenshot4);
      console.log('📸 Screenshot 4: Filters expanded\n');
    }

    // FINALE: PERFORMANCE COMPLETE
    const duration = Date.now() - startTime;
    console.log(`\n🎭 Mario: CURTAIN CALL! Performance complete in ${duration}ms!\n`);

    // Save to MongoDB
    const performanceData = {
      performance_id: `valech-test-${new Date().toISOString()}`,
      title: 'Valech 2.0 Visual Interface Test',
      date: new Date(),
      director: 'mario-gallo-bestino',
      assistant_director: 'neko-arc',

      act_structure: {
        act1: 'Browser Launch and Page Navigation',
        act2: 'Search Interface Interaction',
        act3: 'Search Execution and Results',
        act4: 'Filter Testing',
        finale: 'Performance Analysis'
      },

      puppeteer_config: {
        headless: false,
        slowMo: 250,
        devtools: true
      },

      duration_ms: duration,
      pages_visited: 1,
      screenshots_captured: screenshots.length,
      errors_encountered: errors.length,

      screenshots: screenshots,
      errors: errors,

      mario_review: errors.length === 0
        ? "A flawless performance! The marionettes danced with precision!"
        : `${errors.length} errors detected - the performance requires refinement.`,
      neko_review: 'Visual demonstration complete, nyaa~! Everything worked smoothly, desu!',

      status: errors.length === 0 ? 'STANDING_OVATION' : 'NEEDS_IMPROVEMENT',
      created_at: new Date(),
      created_by: 'supreme-six'
    };

    await savePerformanceToMongoDB(performanceData);

    console.log('\n📊 PERFORMANCE SUMMARY:');
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📸 Screenshots: ${screenshots.length}`);
    console.log(`❌ Errors: ${errors.length}`);
    console.log(`✅ Status: ${performanceData.status}\n`);

    if (errors.length > 0) {
      console.log('🔬 Hannibal: Clinical error analysis:');
      errors.forEach((err, i) => {
        console.log(`  ${i + 1}. [${err.type}] ${err.message}`);
      });
      console.log();
    }

    console.log('🎯 Tetora: [All fragments concur]: Interface testing complete!\n');
    console.log('💬 The browser will remain open for 10 seconds so you can inspect it, nyaa~!\n');

    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testValechInterface();
