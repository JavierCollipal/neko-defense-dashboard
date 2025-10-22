#!/usr/bin/env ts-node

import puppeteer from 'puppeteer';
import * as path from 'path';

async function captureFixedFamilyTracker() {
  console.log('📸 Capturing Family Tracker with all 1,245 officer names...');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500,
    devtools: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const page = await browser.newPage();

  console.log('🌐 Navigating to Family Tracker...');
  await page.goto('http://localhost:3000/family-tracker', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('🖱️ Clicking on Deceased Officers tab...');
  const buttons = await page.$$('button');
  for (const button of buttons) {
    const text = await button.evaluate(el => el.textContent);
    if (text && text.includes('Deceased Officers')) {
      await button.click();
      break;
    }
  }
  await new Promise(resolve => setTimeout(resolve, 3000));

  const screenshotPath = path.join(process.cwd(), 'screenshots', 'family-tracker-FIXED.png') as `${string}.png`;

  console.log('📸 Taking screenshot...');
  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  console.log(`✅ Screenshot saved: ${screenshotPath}`);
  console.log('👁️ Browser staying open - check your screen!');

  // Stay open
  await new Promise(() => {});
}

captureFixedFamilyTracker();
