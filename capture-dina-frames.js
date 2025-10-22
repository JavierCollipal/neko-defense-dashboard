#!/usr/bin/env node

/**
 * 🐾🎬 Capture DINA Page Frames - October 20, 2025
 *
 * IMMUTABLE RULE 3.7: Memorial videos MUST use Carabineros hymn
 *
 * Captures comprehensive DINA page frames (frame-010 onwards)
 * to complete the Yiyo database video.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(require('os').homedir(), 'Documents', 'mi primera base de datos del yiyo');
let frameCounter = 10; // Start after Family Tracker frames (001-009)

async function captureFrame(page, description) {
  const framePath = path.join(OUTPUT_DIR, `frame-${String(frameCounter).padStart(3, '0')}.png`);
  console.log(`📸 Frame ${frameCounter}: ${description}`);
  await page.screenshot({ path: framePath, fullPage: false });
  frameCounter++;
  await new Promise(resolve => setTimeout(resolve, 500)); // Shorter wait to avoid timeout
}

async function captureDINAFrames() {
  console.log('🎬 CAPTURING DINA PAGE FRAMES');
  console.log('============================\n');
  console.log('🎵 IMMUTABLE RULE 3.7: For Carabineros hymn memorial video\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
    devtools: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized', '--auto-open-devtools-for-tabs']
  });

  const page = await browser.newPage();

  try {
    console.log('📍 NAVIGATING TO DINA PAGE\n');

    await page.goto('http://localhost:3000/dina', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Frame 10: Top of DINA page (header)
    await captureFrame(page, 'DINA - Header and title');

    // Frame 11: Mission section
    await page.evaluate(() => window.scrollTo(0, 250));
    await new Promise(resolve => setTimeout(resolve, 800));
    await captureFrame(page, 'DINA - Mission section');

    // Frame 12: Scope section
    await page.evaluate(() => window.scrollTo(0, 500));
    await new Promise(resolve => setTimeout(resolve, 800));
    await captureFrame(page, 'DINA - Scope (Operation Condor)');

    // Frame 13: Universal Jurisdiction
    await page.evaluate(() => window.scrollTo(0, 750));
    await new Promise(resolve => setTimeout(resolve, 800));
    await captureFrame(page, 'DINA - Universal Jurisdiction');

    // Frame 14: Statistics section
    await page.evaluate(() => window.scrollTo(0, 1000));
    await new Promise(resolve => setTimeout(resolve, 800));
    await captureFrame(page, 'DINA - Dictatorship statistics');

    // Frame 15: More statistics
    await page.evaluate(() => window.scrollTo(0, 1250));
    await new Promise(resolve => setTimeout(resolve, 800));
    await captureFrame(page, 'DINA - Victim breakdown');

    // Frame 16: Final overview
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 800));
    await captureFrame(page, 'DINA - Complete overview');

    console.log(`\n✅ Captured ${frameCounter - 10} DINA frames!`);
    console.log(`📁 Total frames now: ${frameCounter - 1} (9 Family Tracker + 7 DINA)`);
    console.log(`📁 Location: ${OUTPUT_DIR}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureDINAFrames().then(() => {
  console.log('💖 NYAA~! DINA frame capture complete, desu~! 🐾✨');
  console.log('🎵 Ready to recreate video with Carabineros hymn!');
});
