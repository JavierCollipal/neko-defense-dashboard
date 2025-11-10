#!/usr/bin/env ts-node

/**
 * 🎬 SIMPLE VALECH VERIFICATION - Quick visual test
 * Just verify the page loads without null pointer errors, nyaa~!
 */

import puppeteer from 'puppeteer';

async function quickVerify() {
  console.log('🎬 Quick Valech verification starting...\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    devtools: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--start-maximized', '--auto-open-devtools-for-tabs']
  });

  const page = await browser.newPage();
  let errorCount = 0;

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ ERROR: ${msg.text()}`);
      errorCount++;
    }
  });

  page.on('pageerror', (error: any) => {
    console.log(`🚨 PAGE ERROR: ${error.message}`);
    errorCount++;
  });

  try {
    console.log('📄 Loading Valech page...');
    await page.goto('http://localhost:3000/valech', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));

    await page.screenshot({ path: '/tmp/valech-verification.png', fullPage: true });
    console.log('📸 Screenshot saved: /tmp/valech-verification.png\n');

    // Check if search input exists
    const searchExists = await page.$('input[placeholder*="Search"]') !== null;
    console.log(`✅ Search input exists: ${searchExists}`);

    console.log(`\n📊 RESULT:`);
    console.log(`   Errors detected: ${errorCount}`);
    console.log(`   Status: ${errorCount === 0 ? '✅ SUCCESS' : '⚠️ HAS ERRORS'}\n`);

    console.log('💬 Browser will remain open for 8 seconds for inspection...\n');
    await new Promise(resolve => setTimeout(resolve, 8000));

  } finally {
    await browser.close();
  }
}

quickVerify();
