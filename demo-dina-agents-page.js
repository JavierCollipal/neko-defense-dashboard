#!/usr/bin/env node

/**
 * 🐾🔍 Navigate to DINA Agents Page - October 20, 2025
 *
 * Visual navigation to DINA agents page to inspect current state
 */

const puppeteer = require('puppeteer');

async function navigateToDinaAgents() {
  console.log('🎭 NAVIGATING TO DINA AGENTS PAGE');
  console.log('==================================\n');
  console.log('👀 WATCH the browser window!');
  console.log('📊 We will inspect the DINA agents data together\n');

  const browser = await puppeteer.launch({
    headless: false,       // 🎭 VISIBLE!
    slowMo: 250,          // ⚡ Slow motion
    devtools: true,       // 🔍 DevTools open
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page = await browser.newPage();

  // Error monitoring
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log(`❌ [CONSOLE ERROR]: ${msg.text()}`);
    } else if (type === 'warning') {
      console.log(`⚠️ [CONSOLE WARNING]: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log('🚨 PAGE ERROR:', error.message);
  });

  try {
    // Navigate to home first
    console.log('📍 Step 1: Loading home page...');
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Navigate to DINA agents
    console.log('\n📍 Step 2: Navigating to DINA Agents page...');
    console.log('👀 WATCH me navigate to DINA agents!');
    await page.goto('http://localhost:3000/dina-agents', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n✅ Now on DINA Agents page!');
    console.log('👁️ LOOK at the agents displayed!');
    console.log('🔍 Check the DevTools Console for any errors!');

    // Scroll to see all content
    console.log('\n📍 Step 3: Scrolling to view all agents...');
    await page.evaluate(() => window.scrollTo(0, 300));
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.evaluate(() => window.scrollTo(0, 600));
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.evaluate(() => window.scrollTo(0, 900));
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n📊 DINA Agents page is now visible!');
    console.log('👀 Take your time to inspect the data, bro!');
    console.log('🔧 We can fix any issues together!\n');
    console.log('⏳ Browser will stay open for 30 seconds for inspection...');

    await new Promise(resolve => setTimeout(resolve, 30000));

    console.log('\n🎬 Closing browser...');

  } catch (error) {
    console.error('❌ Navigation error:', error.message);
    console.log('\n⏳ Browser will stay open for 15 seconds to see the error...');
    await new Promise(resolve => setTimeout(resolve, 15000));
  } finally {
    await browser.close();
    console.log('\n💖 Navigation complete, desu~! 🐾✨');
  }
}

console.log('Starting in 2 seconds...\n');
setTimeout(() => {
  navigateToDinaAgents();
}, 2000);
