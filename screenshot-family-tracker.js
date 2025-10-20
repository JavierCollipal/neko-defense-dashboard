#!/usr/bin/env node

/**
 * 🐾📸 QUICK SCREENSHOT - Family Tracker Page
 * Takes a screenshot of the Family Tracker currently running on localhost:3000
 */

const puppeteer = require('puppeteer');

async function takeScreenshot() {
  console.log('📸 Taking screenshot of Family Tracker, nyaa~!\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('🌐 Navigating to Family Tracker...');
    await page.goto('http://localhost:3000/family-tracker', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('📸 Capturing screenshot...');
    await page.screenshot({
      path: 'family-tracker-current.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: family-tracker-current.png\n');

  } finally {
    await browser.close();
  }
}

takeScreenshot().catch(console.error);
