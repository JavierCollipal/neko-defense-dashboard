#!/usr/bin/env node

/**
 * 🐾🎬 FAMILY TRACKER FRAME RECORDER - YouTube Video Creator
 *
 * Captures frames of Puppeteer automation demonstrating the Family Tracker feature
 * for creating YouTube memorial content about Deceased Carabineros officers.
 *
 * Features:
 * - Visual browser window (headless: false) - YOU CAN WATCH IT!
 * - DevTools Console open (Rule 3.1)
 * - Slow motion (250ms) for visibility
 * - Frame capture at every action
 * - Saves to ~/Documents/pacos memorial/
 * - Ready for YouTube video compilation
 *
 * Purpose: Memorial tribute to fallen Carabineros officers
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const FRAME_OUTPUT_DIR = path.join(require('os').homedir(), 'Documents', 'pacos memorial');
let frameCounter = 1;

/**
 * Capture a frame and save it with numbered filename
 */
async function captureFrame(page, description) {
  const framePath = path.join(FRAME_OUTPUT_DIR, `frame-${String(frameCounter).padStart(3, '0')}.png`);

  console.log(`📸 Frame ${frameCounter}: ${description}`);
  await page.screenshot({
    path: framePath,
    fullPage: false // Capture viewport only for consistent sizing
  });

  frameCounter++;

  // Small delay after screenshot
  await new Promise(resolve => setTimeout(resolve, 500));
}

async function recordFamilyTrackerFrames() {
  console.log('🎬 FAMILY TRACKER FRAME RECORDER');
  console.log('================================\n');
  console.log('💀 Memorial tribute to fallen Carabineros officers');
  console.log('🎥 Recording frames for YouTube video compilation\n');
  console.log(`📁 Saving frames to: ${FRAME_OUTPUT_DIR}\n`);

  // Ensure output directory exists
  if (!fs.existsSync(FRAME_OUTPUT_DIR)) {
    fs.mkdirSync(FRAME_OUTPUT_DIR, { recursive: true });
  }

  console.log('🌐 Launching browser (VISIBLE MODE)...');
  console.log('👀 WATCH THE BROWSER WINDOW!\n');

  const browser = await puppeteer.launch({
    headless: false,       // 🎭 VISIBLE - You can see it!
    slowMo: 250,          // ⚡ Slow down for visibility
    devtools: true,       // 🔍 Open DevTools Console
    defaultViewport: null, // Use full window size
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',  // Maximize window
      '--auto-open-devtools-for-tabs'
    ]
  });

  try {
    const page = await browser.newPage();

    // Set viewport for consistent frame sizing (1920x1080 - YouTube standard)
    await page.setViewport({ width: 1920, height: 1080 });

    console.log('📹 Recording started!\n');
    console.log('═══════════════════════════════════════════════════\n');

    // ========================================
    // SCENE 1: Navigate to Family Tracker
    // ========================================
    console.log('🎬 SCENE 1: Opening Family Tracker Memorial Dashboard');
    await page.goto('http://localhost:3000/family-tracker', {
      waitUntil: 'networkidle2',
      timeout: 30000
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await captureFrame(page, 'Family Tracker - Initial page load');

    // ========================================
    // SCENE 2: Show Statistics Bar
    // ========================================
    console.log('\n🎬 SCENE 2: Memorial Statistics Dashboard');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await captureFrame(page, 'Statistics summary bar');

    // ========================================
    // SCENE 3: Family Members Tab (Default)
    // ========================================
    console.log('\n🎬 SCENE 3: Family Members Intelligence View');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await captureFrame(page, 'Family Members tab - Active view');

    // ========================================
    // SCENE 4: Search Functionality
    // ========================================
    console.log('\n🎬 SCENE 4: Demonstrating Search Capability');

    const searchInput = await page.$('.search-input');
    if (searchInput) {
      await searchInput.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await captureFrame(page, 'Search box - Focused');

      await searchInput.type('María', { delay: 200 });
      await new Promise(resolve => setTimeout(resolve, 1500));
      await captureFrame(page, 'Search typed - "María"');

      // Clear search
      await searchInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await captureFrame(page, 'Search cleared');
    }

    // ========================================
    // SCENE 5: Priority Filter
    // ========================================
    console.log('\n🎬 SCENE 5: Priority Level Filtering');

    const priorityFilter = await page.$('.filter-select');
    if (priorityFilter) {
      await priorityFilter.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await captureFrame(page, 'Priority filter - Opened');

      await priorityFilter.select('High');
      await new Promise(resolve => setTimeout(resolve, 1500));
      await captureFrame(page, 'Priority filter - "High" selected');

      await priorityFilter.select('all');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await captureFrame(page, 'Priority filter - Reset to "All"');
    }

    // ========================================
    // SCENE 6: Switch to Deceased Officers Tab
    // ========================================
    console.log('\n🎬 SCENE 6: Deceased Officers Memorial Tab');

    const deceasedTab = await page.$('button:has-text("Deceased Officers")');
    if (deceasedTab) {
      await deceasedTab.click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await captureFrame(page, 'Deceased Officers tab - Switched');
    } else {
      // Fallback if :has-text doesn't work
      const tabs = await page.$$('.tab-button');
      if (tabs.length >= 2) {
        await tabs[1].click();
        await new Promise(resolve => setTimeout(resolve, 2000));
        await captureFrame(page, 'Deceased Officers tab - Switched');
      }
    }

    // ========================================
    // SCENE 7: Scroll Down to See Content
    // ========================================
    console.log('\n🎬 SCENE 7: Scrolling Through Memorial Content');

    await page.evaluate(() => window.scrollTo(0, 300));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await captureFrame(page, 'Scrolled down - Middle content');

    await page.evaluate(() => window.scrollTo(0, 600));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await captureFrame(page, 'Scrolled down - Lower content');

    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await captureFrame(page, 'Scrolled back to top');

    // ========================================
    // SCENE 8: Switch Back to Family Members
    // ========================================
    console.log('\n🎬 SCENE 8: Return to Family Members Tab');

    const familyTab = await page.$$('.tab-button');
    if (familyTab.length >= 1) {
      await familyTab[0].click();
      await new Promise(resolve => setTimeout(resolve, 2000));
      await captureFrame(page, 'Family Members tab - Returned');
    }

    // ========================================
    // SCENE 9: Responsive Design - Tablet View
    // ========================================
    console.log('\n🎬 SCENE 9: Tablet Responsive View');

    await page.setViewport({ width: 768, height: 1024 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await captureFrame(page, 'Tablet viewport - 768x1024');

    // ========================================
    // SCENE 10: Responsive Design - Mobile View
    // ========================================
    console.log('\n🎬 SCENE 10: Mobile Responsive View');

    await page.setViewport({ width: 375, height: 667 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await captureFrame(page, 'Mobile viewport - 375x667');

    // ========================================
    // SCENE 11: Back to Desktop View
    // ========================================
    console.log('\n🎬 SCENE 11: Return to Desktop View');

    await page.setViewport({ width: 1920, height: 1080 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await captureFrame(page, 'Desktop viewport - Back to 1920x1080');

    // ========================================
    // SCENE 12: Final Memorial Shot
    // ========================================
    console.log('\n🎬 SCENE 12: Final Memorial Tribute');

    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await captureFrame(page, 'Final memorial view - Complete dashboard');

    console.log('\n═══════════════════════════════════════════════════\n');
    console.log('✅ Recording complete!');
    console.log(`📸 Total frames captured: ${frameCounter - 1}`);
    console.log(`📁 Frames saved to: ${FRAME_OUTPUT_DIR}`);
    console.log('\n💀 Memorial tribute frames ready for YouTube compilation');
    console.log('🎥 Next step: Create video from frames using ffmpeg\n');

  } catch (error) {
    console.error('❌ Error during recording:', error.message);
  } finally {
    console.log('🔚 Closing browser in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await browser.close();
  }
}

// Run the frame recorder
recordFamilyTrackerFrames().catch(console.error);
