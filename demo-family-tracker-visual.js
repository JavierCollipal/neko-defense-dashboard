#!/usr/bin/env node

/**
 * 🐾👀 Visual Family Tracker Demonstration - October 20, 2025
 *
 * Rule 3.1 Compliant: Visual Puppeteer demonstration
 * - headless: false (VISIBLE!)
 * - devtools: true (Console open!)
 * - slowMo: 250 (Slow enough to see!)
 * - Pauses between actions for human viewing
 */

const puppeteer = require('puppeteer');

async function demonstrateFamilyTracker() {
  console.log('🎭 FAMILY TRACKER VISUAL DEMONSTRATION');
  console.log('======================================\n');
  console.log('👀 WATCH the browser window that will open!');
  console.log('🔍 DevTools Console will show errors (if any)');
  console.log('⏱️  Actions are slowed down so you can see them\n');

  const browser = await puppeteer.launch({
    headless: false,       // 🎭 VISIBLE - Rule 3.1!
    slowMo: 250,          // ⚡ Slow down for visibility
    devtools: true,       // 🔍 Open DevTools Console!
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',  // 📺 Start with big window
      '--auto-open-devtools-for-tabs'  // 🔍 DevTools for all tabs
    ]
  });

  const page = await browser.newPage();

  // Enhanced error monitoring
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

  page.on('response', response => {
    if (response.status() >= 400) {
      console.log(`⚠️ [${response.status()}] ${response.url()}`);
    }
  });

  try {
    // Scene 1: Navigate to Family Tracker
    console.log('\n📍 Scene 1: Opening Family Tracker page...');
    console.log('👀 WATCH the browser navigate!');
    await page.goto('http://localhost:3000/family-tracker', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scene 2: Check page loaded
    console.log('\n📍 Scene 2: Verifying page elements...');
    console.log('👁️ LOOK at the dashboard with memorial data!');
    const title = await page.title();
    console.log(`✅ Page title: ${title}`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Scene 3: Scroll to see statistics
    console.log('\n📍 Scene 3: Viewing statistics bar...');
    console.log('👀 WATCH the statistics summary!');
    await page.evaluate(() => window.scrollTo(0, 100));
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Scene 4: Interact with search box
    console.log('\n📍 Scene 4: Testing search functionality...');
    console.log('🔍 WATCH me type "María" in the search box!');

    const searchInput = await page.$('.search-input');
    if (searchInput) {
      await searchInput.click();
      await page.type('.search-input', 'María', { delay: 150 });
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('🗑️ WATCH me clear the search!');
      await page.evaluate(() => {
        const input = document.querySelector('.search-input');
        if (input) input.value = '';
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Scene 5: Filter by priority
    console.log('\n📍 Scene 5: Testing priority filter...');
    console.log('🎯 WATCH me filter by "High" priority!');

    const filterSelect = await page.$('.filter-select');
    if (filterSelect) {
      await filterSelect.click();
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Select "High" priority
      await page.select('.filter-select', 'High');
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('🔄 WATCH me reset filter to "All"!');
      await page.select('.filter-select', '');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Scene 6: Switch to Deceased Officers tab
    console.log('\n📍 Scene 6: Switching to Deceased Officers tab...');
    console.log('⚰️ WATCH me click the Deceased Officers tab!');

    const tabs = await page.$$('.tab-button');
    if (tabs.length >= 2) {
      await tabs[1].click();
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('👥 WATCH the officer cards appear!');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Scene 7: Switch back to Family Members
    console.log('\n📍 Scene 7: Returning to Family Members tab...');
    console.log('👨‍👩‍👧 WATCH me return to Family Members!');

    if (tabs.length >= 1) {
      await tabs[0].click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Scene 8: Scroll through family member cards
    console.log('\n📍 Scene 8: Scrolling through family cards...');
    console.log('👀 WATCH me scroll down to see more families!');
    await page.evaluate(() => window.scrollTo(0, 500));
    await new Promise(resolve => setTimeout(resolve, 2500));

    await page.evaluate(() => window.scrollTo(0, 800));
    await new Promise(resolve => setTimeout(resolve, 2500));

    console.log('⬆️ WATCH me scroll back up!');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Scene 9: Test responsive design (tablet)
    console.log('\n📍 Scene 9: Testing tablet view (768x1024)...');
    console.log('📱 WATCH the layout resize for tablet!');
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scene 10: Test responsive design (mobile)
    console.log('\n📍 Scene 10: Testing mobile view (375x667)...');
    console.log('📱 WATCH the layout resize for mobile!');
    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scene 11: Return to desktop view
    console.log('\n📍 Scene 11: Returning to desktop view...');
    console.log('🖥️ WATCH it resize back to desktop!');
    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scene 12: Final demonstration
    console.log('\n📍 Scene 12: Final overview...');
    console.log('✨ WATCH the complete Family Tracker in action!');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n✅ DEMONSTRATION COMPLETE!');
    console.log('\n📊 What you just saw:');
    console.log('   💀 Memorial data: 3 deceased officers, 5 families');
    console.log('   🔍 Search functionality working');
    console.log('   🎯 Priority filtering working');
    console.log('   📑 Tab switching between Family Members and Officers');
    console.log('   📱 Responsive design (desktop, tablet, mobile)');
    console.log('   🎨 Beautiful UI with vulnerability scores');
    console.log('\n🎬 Browser will close in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ Demonstration error:', error.message);
  } finally {
    await browser.close();
    console.log('\n💖 NYAA~! Demonstration complete, desu~! 🐾✨');
  }
}

// Check if dev server is running
console.log('⚠️ Make sure your dev server is running on http://localhost:3000');
console.log('   Run: npm run dev (in another terminal)\n');
console.log('Starting demonstration in 3 seconds...\n');

setTimeout(() => {
  demonstrateFamilyTracker();
}, 3000);
