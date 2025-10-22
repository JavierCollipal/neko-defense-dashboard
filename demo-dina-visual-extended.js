#!/usr/bin/env node

/**
 * 🐾👀 Extended DINA Agents Visual Demonstration - October 20, 2025
 *
 * Rule 3.1: Visual mode with extended viewing time
 */

const puppeteer = require('puppeteer');

async function showDinaAgents() {
  console.log('🎭 DINA AGENTS EXTENDED VISUAL DEMONSTRATION');
  console.log('============================================\n');
  console.log('👀 WATCH the browser window - it will stay open!');
  console.log('🔍 DevTools Console is open - check for errors!');
  console.log('⏱️  Browser will stay open for 2 MINUTES so you can inspect!\n');

  const browser = await puppeteer.launch({
    headless: false,       // 🎭 VISIBLE!
    slowMo: 250,          // ⚡ Slow motion
    devtools: true,       // 🔍 DevTools open!
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',  // 📺 Full screen
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page = await browser.newPage();

  // Console monitoring
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`❌ [BROWSER ERROR]: ${text}`);
    } else if (type === 'warning') {
      console.log(`⚠️ [BROWSER WARNING]: ${text}`);
    } else if (type === 'log') {
      console.log(`💬 [BROWSER LOG]: ${text}`);
    }
  });

  page.on('pageerror', error => {
    console.log('🚨 PAGE ERROR:', error.message);
  });

  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status >= 400) {
      console.log(`⚠️ [${status}] ${url}`);
    } else if (url.includes('/api/')) {
      console.log(`✅ [${status}] ${url}`);
    }
  });

  try {
    console.log('📍 Step 1: Navigating to DINA Agents page...');
    console.log('👀 WATCH the browser open!\n');

    await page.goto('http://localhost:3000/dina-agents', {
      waitUntil: 'networkidle2',
      timeout: 15000
    });

    console.log('✅ Page loaded!\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('📍 Step 2: Scrolling through agents...');
    console.log('👁️ LOOK at all the DINA agents displayed!\n');

    // Slow scroll down
    await page.evaluate(() => window.scrollTo(0, 200));
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.evaluate(() => window.scrollTo(0, 400));
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.evaluate(() => window.scrollTo(0, 600));
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.evaluate(() => window.scrollTo(0, 800));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Scroll back up
    console.log('⬆️ Scrolling back to top...\n');
    await page.evaluate(() => window.scrollTo(0, 400));
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('📊 DINA AGENTS PAGE IS NOW VISIBLE!\n');
    console.log('═══════════════════════════════════════');
    console.log('👀 Take your time to inspect the page!');
    console.log('🔍 Check the DevTools Console on the right');
    console.log('📋 Count how many agents you see');
    console.log('🎨 Look at the agent cards and their data');
    console.log('═══════════════════════════════════════\n');
    console.log('⏳ Browser will stay open for 2 MINUTES...');
    console.log('💡 Press Ctrl+C in terminal to close early\n');

    // Stay open for 2 minutes (120 seconds)
    let countdown = 120;
    const interval = setInterval(() => {
      countdown -= 10;
      if (countdown > 0) {
        console.log(`⏱️  Time remaining: ${countdown} seconds...`);
      }
    }, 10000);

    await new Promise(resolve => setTimeout(resolve, 120000));
    clearInterval(interval);

    console.log('\n⏰ Time is up! Closing browser...');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⏳ Browser will stay open for 30 seconds to see the error...');
    await new Promise(resolve => setTimeout(resolve, 30000));
  } finally {
    await browser.close();
    console.log('\n💖 NYAA~! Demonstration complete, desu~! 🐾✨');
  }
}

console.log('🚀 Starting visual demonstration in 3 seconds...\n');
setTimeout(() => {
  showDinaAgents();
}, 3000);
