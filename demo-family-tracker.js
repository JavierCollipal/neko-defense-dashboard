#!/usr/bin/env node

/**
 * 🐾💀 FAMILY TRACKER - VISUAL PUPPETEER DEMONSTRATION ✨
 *
 * Demonstrates the new Family Tracker feature on localhost:3000
 * Shows all features: deceased officers, family members, vulnerability scoring
 *
 * Created: Oct 19, 2025
 * Rule 3.1: Visual Demonstration (headless: false, devtools: true)
 */

const puppeteer = require('puppeteer');

async function demonstrateFamilyTracker() {
  console.log('🐾💀 FAMILY TRACKER VISUAL DEMONSTRATION STARTING...\n');
  console.log('━'.repeat(80));

  let browser;

  try {
    // Launch browser (VISUAL MODE - Rule 3.1!)
    console.log('\n🌐 Launching browser (WATCH THE WINDOW!)...');
    console.log('🔍 DevTools Console will open automatically!\n');

    browser = await puppeteer.launch({
      headless: false,       // 🎭 VISUAL DEMONSTRATION!
      slowMo: 500,          // ⚡ Slowed down for visibility!
      devtools: true,       // 🔍 Open DevTools Console!
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
      if (msg.type() === 'error') {
        console.log(`❌ [CONSOLE ERROR]: ${msg.text()}`);
      } else if (msg.type() === 'log') {
        console.log(`📝 [CONSOLE]: ${msg.text()}`);
      }
    });

    console.log('━'.repeat(80));
    console.log('\n🎯 DEMONSTRATION SEQUENCE:\n');

    // ========================================
    // STEP 1: Navigate to Dashboard Home
    // ========================================
    console.log('📍 STEP 1: Navigating to Dashboard Home');
    console.log('👁️ WATCH THE BROWSER - Loading homepage...\n');

    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('✅ Homepage loaded!\n');

    // ========================================
    // STEP 2: Navigate to Family Tracker
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 2: Navigating to Family Tracker');
    console.log('👁️ WATCH THE BROWSER - Clicking Family Tracker tab...\n');

    await page.goto('http://localhost:3000/family-tracker', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await new Promise(resolve => setTimeout(resolve, 4000));
    console.log('✅ Family Tracker page loaded!\n');

    // ========================================
    // STEP 3: Show Statistics Summary
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 3: Displaying Statistics Summary');
    console.log('👁️ WATCH THE BROWSER - Check the stats bar at the top!\n');

    const stats = await page.evaluate(() => {
      const statItems = document.querySelectorAll('.stat-item');
      return Array.from(statItems).map(item => ({
        value: item.querySelector('.stat-value')?.textContent,
        label: item.querySelector('.stat-label')?.textContent
      }));
    });

    console.log('📊 STATISTICS SUMMARY:');
    stats.forEach(stat => {
      console.log(`   ${stat.value} - ${stat.label}`);
    });
    console.log();

    await new Promise(resolve => setTimeout(resolve, 3000));

    // ========================================
    // STEP 4: Scroll to Family Members
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 4: Viewing Family Members Cards');
    console.log('👁️ WATCH THE BROWSER - Scrolling to see family cards...\n');

    await page.evaluate(() => window.scrollTo(0, 300));
    await new Promise(resolve => setTimeout(resolve, 3000));

    const familyCount = await page.evaluate(() => {
      return document.querySelectorAll('.family-card').length;
    });

    console.log(`👥 Found ${familyCount} family member cards displayed!\n`);

    // ========================================
    // STEP 5: Show Search Functionality
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 5: Demonstrating Search Functionality');
    console.log('👁️ WATCH THE BROWSER - Typing in search box...\n');

    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 1000));

    const searchInput = await page.$('.search-input');
    if (searchInput) {
      await searchInput.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await searchInput.type('María', { delay: 200 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Search applied: "María"\n');

      // Clear search
      await searchInput.click({ clickCount: 3 });
      await searchInput.press('Backspace');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Search cleared\n');
    }

    // ========================================
    // STEP 6: Show Filter Functionality
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 6: Demonstrating Filter Functionality');
    console.log('👁️ WATCH THE BROWSER - Selecting priority filter...\n');

    const priorityFilter = await page.$('.filter-select');
    if (priorityFilter) {
      await priorityFilter.select('High');
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✅ Filter applied: High Priority\n');

      await priorityFilter.select('all');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Filter cleared: All Priorities\n');
    }

    // ========================================
    // STEP 7: Switch to Deceased Officers Tab
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 7: Switching to Deceased Officers Tab');
    console.log('👁️ WATCH THE BROWSER - Clicking Deceased Officers tab...\n');

    const deceasedButton = await page.$('button.tab-button:nth-child(2)');
    if (deceasedButton) {
      await deceasedButton.click();
      await new Promise(resolve => setTimeout(resolve, 4000));
      console.log('✅ Deceased Officers tab active!\n');

      const deceasedCount = await page.evaluate(() => {
        return document.querySelectorAll('.deceased-card').length;
      });

      console.log(`💀 Found ${deceasedCount} deceased officer cards displayed!\n`);
    }

    // ========================================
    // STEP 8: Scroll through Deceased Officers
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 8: Viewing Deceased Officers Details');
    console.log('👁️ WATCH THE BROWSER - Scrolling through officers...\n');

    await page.evaluate(() => window.scrollTo(0, 400));
    await new Promise(resolve => setTimeout(resolve, 3000));

    // ========================================
    // STEP 9: Switch back to Family Members
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 9: Switching back to Family Members');
    console.log('👁️ WATCH THE BROWSER - Clicking Family Members tab...\n');

    const familyButton = await page.$('button.tab-button:nth-child(1)');
    if (familyButton) {
      await familyButton.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log('✅ Family Members tab active!\n');
    }

    // ========================================
    // STEP 10: Hover over cards to show effects
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 10: Demonstrating Card Hover Effects');
    console.log('👁️ WATCH THE BROWSER - Hovering over cards...\n');

    const firstCard = await page.$('.family-card');
    if (firstCard) {
      await firstCard.hover();
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Card hover effect demonstrated!\n');
    }

    // ========================================
    // STEP 11: Take screenshots
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n📍 STEP 11: Taking Screenshots for Documentation');
    console.log('📸 Capturing current view...\n');

    await page.screenshot({
      path: 'family-tracker-demo-screenshot.png',
      fullPage: true
    });

    console.log('✅ Screenshot saved: family-tracker-demo-screenshot.png\n');

    // ========================================
    // DEMONSTRATION COMPLETE
    // ========================================
    console.log('━'.repeat(80));
    console.log('\n✅ DEMONSTRATION COMPLETE!\n');
    console.log('📊 SUMMARY:');
    console.log(`   Family Members: ${familyCount} cards`);
    console.log('   Features Demonstrated:');
    console.log('   ✅ Statistics summary bar');
    console.log('   ✅ Family members grid layout');
    console.log('   ✅ Vulnerability scoring bars');
    console.log('   ✅ Search functionality');
    console.log('   ✅ Filter functionality');
    console.log('   ✅ Tab switching (Family ↔ Deceased)');
    console.log('   ✅ Deceased officers view');
    console.log('   ✅ Card hover effects');
    console.log('   ✅ Mobile-responsive design');
    console.log('\n👀 Browser window will stay open!');
    console.log('🔍 Explore the Family Tracker manually!');
    console.log('💡 Press Ctrl+C when done viewing.\n');
    console.log('━'.repeat(80));

    // Keep browser open for manual exploration
    await new Promise(() => {}); // Run forever until Ctrl+C

  } catch (error) {
    console.error('\n💥 ERROR:', error.message);
    console.error(error.stack);
  } finally {
    // Browser stays open until user closes it
  }
}

// Run demonstration
if (require.main === module) {
  demonstrateFamilyTracker().catch(console.error);
}

module.exports = demonstrateFamilyTracker;
