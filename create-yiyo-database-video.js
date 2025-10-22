#!/usr/bin/env node

/**
 * 🐾🎬 Create Yiyo Database Video - October 20, 2025
 *
 * Captures frames from Family Tracker and DINA pages
 * and creates a video for Yiyo's first database project
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
  await new Promise(resolve => setTimeout(resolve, 1000));
}

async function createYiyoDatabaseVideo() {
  console.log('🎬 YIYO DATABASE VIDEO CREATOR');
  console.log('==============================\n');
  console.log('📁 Output: ~/Documents/mi primera base de datos del yiyo/\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    devtools: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized', '--auto-open-devtools-for-tabs']
  });

  const page = await browser.newPage();

  try {
    // Scene 1-3: Family Tracker
    console.log('\n📍 PART 1: FAMILY TRACKER DATABASE\n');

    await page.goto('http://localhost:3000/family-tracker', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await captureFrame(page, 'Family Tracker - Initial view with memorial data');
    await page.evaluate(() => window.scrollTo(0, 300));
    await captureFrame(page, 'Family Tracker - Family member cards');

    // Click Deceased Officers tab
    const tabs = await page.$$('.tab-button');
    if (tabs.length >= 2) {
      await tabs[1].click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await captureFrame(page, 'Family Tracker - Deceased Officers view');
    }

    // Scene 4-6: DINA Documentation
    console.log('\n📍 PART 2: DINA DOCUMENTATION DATABASE\n');

    await page.goto('http://localhost:3000/dina', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await captureFrame(page, 'DINA - Mission and scope overview');
    await page.evaluate(() => window.scrollTo(0, 400));
    await captureFrame(page, 'DINA - Statistics and victims data');
    await page.evaluate(() => window.scrollTo(0, 0));
    await captureFrame(page, 'DINA - Complete documentation view');

    console.log(`\n✅ Captured ${frameCounter - 1} frames!`);
    console.log(`📁 Frames saved to: ${OUTPUT_DIR}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

createYiyoDatabaseVideo().then(() => {
  console.log('💖 NYAA~! Frame capture complete, desu~! 🐾✨');
});
