#!/usr/bin/env ts-node

import puppeteer from 'puppeteer';

async function openDashboard() {
  console.log('\n🎭🎭🎭 OPENING VISUAL BROWSER - WATCH YOUR SCREEN! 🎭🎭🎭');
  console.log('👀 Browser will open MAXIMIZED');
  console.log('👀 It will STAY OPEN until you manually close it');
  console.log('👀 CHECK ALL YOUR WORKSPACES AND WINDOWS!');
  console.log('');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 500,
    devtools: true,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--start-fullscreen',
      '--auto-open-devtools-for-tabs',
      '--new-window'
    ]
  });

  const page = await browser.newPage();

  console.log('✅ Browser launched!');
  console.log('🌐 Navigating to http://localhost:3000...');

  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  console.log('✅ Dashboard loaded!');
  console.log('');
  console.log('👁️👁️👁️  BROWSER IS NOW OPEN - LOOK AT YOUR SCREEN! 👁️👁️👁️');
  console.log('');
  console.log('🖱️  The browser will STAY OPEN');
  console.log('🖱️  Close this terminal to close the browser');
  console.log('🖱️  Or close the browser window manually');
  console.log('');

  // Wait forever - browser stays open until manually closed
  await new Promise(() => {});
}

openDashboard().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
