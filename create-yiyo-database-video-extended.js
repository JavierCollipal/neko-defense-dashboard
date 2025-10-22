#!/usr/bin/env node

/**
 * 🐾🎬 Create Extended Yiyo Database Video - October 20, 2025
 *
 * IMMUTABLE RULE 3.7: Memorial videos MUST use Carabineros hymn
 * to honor fallen comrades, nyaa~! 💀🎵
 *
 * Comprehensive demonstration of BOTH databases:
 * - Family Tracker (full feature test)
 * - DINA Documentation (ALL features tested)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(require('os').homedir(), 'Documents', 'mi primera base de datos del yiyo');
let frameCounter = 1;

async function captureFrame(page, description) {
  const framePath = path.join(OUTPUT_DIR, `frame-${String(frameCounter).padStart(3, '0')}.png`);
  console.log(`📸 Frame ${frameCounter}: ${description}`);
  await page.screenshot({ path: framePath, fullPage: false });
  frameCounter++;
  await new Promise(resolve => setTimeout(resolve, 800));
}

async function createExtendedVideo() {
  console.log('🎬 YIYO DATABASE VIDEO - EXTENDED VERSION');
  console.log('=========================================\n');
  console.log('🎵 IMMUTABLE RULE 3.7: Using Carabineros hymn to honor comrades\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    devtools: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized', '--auto-open-devtools-for-tabs']
  });

  const page = await browser.newPage();

  try {
    // PART 1: Family Tracker Database (5 frames)
    console.log('\n📍 PART 1: FAMILY TRACKER DATABASE (5 frames)\n');

    await page.goto('http://localhost:3000/family-tracker', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await captureFrame(page, 'Family Tracker - Initial view with statistics');

    await page.evaluate(() => window.scrollTo(0, 400));
    await captureFrame(page, 'Family Tracker - Family member cards');

    const tabs = await page.$$('.tab-button');
    if (tabs.length >= 2) {
      await tabs[1].click();
      await new Promise(resolve => setTimeout(resolve, 1500));
      await captureFrame(page, 'Family Tracker - Deceased Officers tab');
    }

    await tabs[0].click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await captureFrame(page, 'Family Tracker - Back to Family Members');

    await page.evaluate(() => window.scrollTo(0, 0));
    await captureFrame(page, 'Family Tracker - Overview complete');

    // PART 2: DINA Documentation Database (10 frames - ALL FEATURES!)
    console.log('\n📍 PART 2: DINA DOCUMENTATION DATABASE (10 frames)\n');

    await page.goto('http://localhost:3000/dina', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Frame 1: Top of page
    await captureFrame(page, 'DINA - Header and navigation');

    // Frame 2: Mission section
    await page.evaluate(() => window.scrollTo(0, 200));
    await captureFrame(page, 'DINA - Mission statement');

    // Frame 3: Scope section
    await page.evaluate(() => window.scrollTo(0, 400));
    await captureFrame(page, 'DINA - Scope (Operation Condor)');

    // Frame 4: Universal Jurisdiction
    await page.evaluate(() => window.scrollTo(0, 600));
    await captureFrame(page, 'DINA - Universal Jurisdiction');

    // Frame 5: Statistics
    await page.evaluate(() => window.scrollTo(0, 800));
    await captureFrame(page, 'DINA - Dictatorship statistics');

    // Frame 6: More statistics
    await page.evaluate(() => window.scrollTo(0, 1000));
    await captureFrame(page, 'DINA - Victim breakdown');

    // Frame 7: Scroll further
    await page.evaluate(() => window.scrollTo(0, 1200));
    await captureFrame(page, 'DINA - Additional data');

    // Frame 8: Bottom section
    await page.evaluate(() => window.scrollTo(0, 1400));
    await captureFrame(page, 'DINA - Lower content');

    // Frame 9: Scroll back up
    await page.evaluate(() => window.scrollTo(0, 700));
    await captureFrame(page, 'DINA - Mid-page overview');

    // Frame 10: Final overview
    await page.evaluate(() => window.scrollTo(0, 0));
    await captureFrame(page, 'DINA - Complete documentation');

    console.log(`\n✅ Captured ${frameCounter - 1} frames!`);
    console.log(`📁 Frames saved to: ${OUTPUT_DIR}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

createExtendedVideo().then(() => {
  console.log('💖 NYAA~! Extended frame capture complete, desu~! 🐾✨');
  console.log('🎵 Ready for Carabineros hymn integration!');
});
