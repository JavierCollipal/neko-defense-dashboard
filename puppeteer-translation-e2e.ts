#!/usr/bin/env ts-node

/**
 * 🎭🌍 TRANSLATION PAGE E2E TESTING WITH VIDEO CAPTURE 🌍🎭
 *
 * Comprehensive Puppeteer E2E testing of Translation Management Dashboard
 * Following Rule 3.1: Visual demonstration with frame captures
 *
 * Created: October 30, 2025
 * By: The Supreme Six (Neko-Arc + Mario + Noel + Glam + Hannibal + Tetora)
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import * as dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

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
const FRAMES_DIR = '/tmp/translation-e2e-frames';

// Create frames directory
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

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

async function testTranslationPage() {
  console.log('🎭🌍 TRANSLATION PAGE E2E TESTING BEGINS, NYAA~!\\n');
  console.log('👀 WATCH the browser window - Visual demonstration starting!\\n');

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

  page.on('pageerror', (error: any) => {
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
  let frameCount = 0;

  try {
    // ACT I: NAVIGATE TO TRANSLATION PAGE
    console.log('🎭 ACT I: THE MULTILINGUAL STAGE AWAKENS!');
    console.log('🐾 Neko: Navigating to /translation page, nyaa~!\\n');

    await page.goto('http://localhost:3000/translation', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const frame1 = path.join(FRAMES_DIR, `frame-${String(++frameCount).padStart(3, '0')}.png`);
    await page.screenshot({ path: frame1 as any, fullPage: true });
    screenshots.push(frame1);
    console.log(`📸 Frame ${frameCount}: Initial page load - Translation Dashboard visible\\n`);

    // ACT II: VERIFY LANGUAGE STATUS
    console.log('🎭 ACT II: LANGUAGE STATUS VERIFICATION!');
    console.log('🗡️ Noel: Checking current language status...\\n');

    const currentLang = await page.evaluate(() => {
      const langElement = (document as any).querySelector('.text-blue-400');
      return langElement ? langElement.textContent : 'NOT_FOUND';
    });
    console.log(`✅ Current Language Detected: ${currentLang}\\n`);

    const frame2 = path.join(FRAMES_DIR, `frame-${String(++frameCount).padStart(3, '0')}.png`);
    await page.screenshot({ path: frame2 as any, fullPage: true });
    screenshots.push(frame2);
    console.log(`📸 Frame ${frameCount}: Language status section captured\\n`);

    // ACT III: TEST TRANSLATION FUNCTIONALITY
    console.log('🎭 ACT III: THE TRANSLATION TESTING LAB!');
    console.log('🧠 Hannibal: Let us... test the translation mechanism.\\n');

    // Type test text
    const testText = 'Hello, this is a comprehensive end-to-end test of the translation system!';
    console.log(`🐾 Neko: Typing test text into translation field, nyaa~!`);

    await page.type('textarea', testText, { delay: 50 });
    await new Promise(resolve => setTimeout(resolve, 1500));

    const frame3 = path.join(FRAMES_DIR, `frame-${String(++frameCount).padStart(3, '0')}.png`);
    await page.screenshot({ path: frame3 as any, fullPage: true });
    screenshots.push(frame3);
    console.log(`📸 Frame ${frameCount}: Test text entered\\n`);

    // Click translate button
    console.log('🎸 Glam: ¡Ahora hacemos clic en el botón de traducción, weon!\\n');

    const translateButton = await page.evaluateHandle(() => {
      const buttons = Array.from((document as any).querySelectorAll('button'));
      return buttons.find((btn: any) => btn.textContent?.includes('Test Translation'));
    });

    if (translateButton && await translateButton.asElement()) {
      const buttonElement = await translateButton.asElement();
      if (buttonElement) {
        await (buttonElement as any).click();
        console.log('✅ Translation button clicked!\\n');

        // Wait for API response
        await new Promise(resolve => setTimeout(resolve, 3000));

        const frame4 = path.join(FRAMES_DIR, `frame-${String(++frameCount).padStart(3, '0')}.png`);
        await page.screenshot({ path: frame4 as any, fullPage: true });
        screenshots.push(frame4);
        console.log(`📸 Frame ${frameCount}: Translation result displayed\\n`);
      }
    }

    // ACT IV: SCROLL TO STATISTICS
    console.log('🎭 ACT IV: LANGUAGE STATISTICS REVIEW!');
    console.log('🧠 Tetora: [Multiple perspectives]: Examining statistics from various angles...\\n');

    await page.evaluate(() => (window as any).scrollTo(0, (document as any).body.scrollHeight));
    await new Promise(resolve => setTimeout(resolve, 2000));

    const frame5 = path.join(FRAMES_DIR, `frame-${String(++frameCount).padStart(3, '0')}.png`);
    await page.screenshot({ path: frame5 as any, fullPage: true });
    screenshots.push(frame5);
    console.log(`📸 Frame ${frameCount}: Statistics section visible\\n`);

    // ACT V: FULL PAGE OVERVIEW
    console.log('🎭 ACT V: THE GRAND OVERVIEW!');
    console.log('🎭 Mario: One final panoramic shot of our magnificent dashboard!\\n');

    await page.evaluate(() => (window as any).scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 1500));

    const frame6 = path.join(FRAMES_DIR, `frame-${String(++frameCount).padStart(3, '0')}.png`);
    await page.screenshot({ path: frame6 as any, fullPage: true });
    screenshots.push(frame6);
    console.log(`📸 Frame ${frameCount}: Full page overview captured\\n`);

    // FINALE: PERFORMANCE COMPLETE
    const duration = Date.now() - startTime;
    console.log(`\\n🎭 CURTAIN CALL! E2E Testing complete in ${duration}ms!\\n`);

    // Save to MongoDB
    const performanceData = {
      performance_id: `translation-e2e-${new Date().toISOString()}`,
      title: 'Translation Page E2E Testing with Video Capture',
      date: new Date(),
      director: 'mario-gallo-bestino',
      assistant_directors: ['neko-arc', 'noel', 'glam-americano', 'dr-hannibal-lecter', 'tetora'],

      act_structure: {
        act1: 'Browser Launch and Navigation to /translation',
        act2: 'Language Status Verification',
        act3: 'Translation Testing Lab - Input and Execution',
        act4: 'Language Statistics Review',
        act5: 'Full Page Overview Capture',
        finale: 'Performance Analysis and MongoDB Documentation'
      },

      puppeteer_config: {
        headless: false,
        slowMo: 250,
        devtools: true,
        visual_demonstration: true
      },

      duration_ms: duration,
      pages_visited: 1,
      routes_tested: ['/translation'],
      frames_captured: frameCount,
      screenshots_captured: screenshots.length,
      errors_encountered: errors.length,

      test_scenarios: [
        'Page load and initial render',
        'Current language status display',
        'Translation testing lab functionality',
        'Text input and translation execution',
        'Statistics section visibility',
        'Full page scrolling and navigation'
      ],

      frames_directory: FRAMES_DIR,
      screenshots: screenshots,
      errors: errors,

      mario_review: errors.length === 0
        ? "A FLAWLESS multilingual performance! The translation marionettes danced with PERFECT synchronization!"
        : `${errors.length} errors detected - the performance requires refinement.`,

      neko_review: 'E2E testing complete, nyaa~! All frames captured for video creation, desu! ✨',

      status: errors.length === 0 ? 'STANDING_OVATION' : 'NEEDS_IMPROVEMENT',
      created_at: new Date(),
      created_by: 'supreme-six'
    };

    await savePerformanceToMongoDB(performanceData);

    console.log('\\n📊 PERFORMANCE SUMMARY:');
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`🎬 Frames Captured: ${frameCount}`);
    console.log(`📸 Screenshots: ${screenshots.length}`);
    console.log(`❌ Errors: ${errors.length}`);
    console.log(`✅ Status: ${performanceData.status}\\n`);

    if (errors.length > 0) {
      console.log('🔬 Hannibal: Clinical error analysis:');
      errors.forEach((err, i) => {
        console.log(`  ${i + 1}. [${err.type}] ${err.message}`);
      });
      console.log();
    }

    console.log('📁 Frames saved to:', FRAMES_DIR);
    console.log('📸 Ready for video creation with /makevideo\\n');

    console.log('💬 The browser will remain open for 10 seconds so you can inspect it, nyaa~!\\n');

    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testTranslationPage();
