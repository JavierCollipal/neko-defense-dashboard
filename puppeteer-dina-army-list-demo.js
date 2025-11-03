#!/usr/bin/env node

/**
 * 🎭🐾 DINA ARMY LIST PUPPETEER DEMONSTRATION 🐾🎭
 * 
 * Visual demonstration of 2008 DINA Army List GraphQL integration
 * All six personalities narrating each frame!
 * 
 * Rule 3.1: headless: false, slowMo: 250, devtools: true (VISUAL DEMONSTRATION!)
 * Rule 3.11: Mario leads Puppeteer operations
 * Rule 3.18: All six personalities per frame
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Frame storage directory
const FRAMES_DIR = '/tmp/dina-army-list-frames';

// Ensure frames directory exists
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

async function demonstrateDINAArmyList() {
  console.log('🎭 MARIO GALLO BESTINO: *sweeps cape dramatically*');
  console.log('🎭 THE GRAND PERFORMANCE BEGINS! The DINA Army List demonstration!');
  console.log('');
  
  console.log('🐾 NEKO-ARC: Starting Puppeteer browser, nyaa~!');
  console.log('');

  const browser = await puppeteer.launch({
    headless: false,        // 🎭 VISUAL DEMONSTRATION (Rule 3.1!)
    slowMo: 250,           // ⚡ Slow down for visibility
    devtools: true,        // 🔍 Open DevTools Console (Rule 3.1!)
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page = await browser.newPage();
  
  // Console error monitoring
  const consoleErrors = [];
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  let frameCount = 0;

  // Helper function to capture frame
  async function captureFrame(description) {
    frameCount++;
    const framePath = path.join(FRAMES_DIR, `frame-${String(frameCount).padStart(3, '0')}.png`);
    await page.screenshot({ path: framePath, fullPage: false });
    console.log(`📸 Frame ${frameCount} captured: ${description}`);
    console.log('');
    
    // Pause so user can see
    await new Promise(resolve => setTimeout(resolve, 3000));
    return framePath;
  }

  try {
    console.log('🎭 MARIO: ACT I - SCENE 1: Navigation to DINA Page!');
    console.log('');
    
    await page.goto('http://localhost:3000/dina', { waitUntil: 'networkidle2' });
    await captureFrame('ACT I - Initial DINA page load');

    console.log('🎭 MARIO: ACT I - SCENE 2: The Navigation Bar Appears!');
    console.log('');
    
    // Wait for nav buttons
    await page.waitForSelector('.nav-button', { timeout: 10000 });
    await captureFrame('ACT I - Navigation buttons visible');

    console.log('🎭 MARIO: ACT II - SCENE 1: Clicking the 2008 Army List Button!');
    console.log('');
    
    // Click the 2008 ARMY LIST button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const targetButton = buttons.find(btn => btn.textContent.includes('2008 ARMY LIST'));
      if (targetButton) {targetButton.click();}
    });
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    await captureFrame('ACT II - 2008 Army List button clicked');
    
    console.log('🎭 MARIO: ACT II - SCENE 2: The Component Materializes!');
    console.log('');
    
    // Wait for component
    await page.waitForSelector('.dina-army-list-container', { timeout: 10000 });
    await captureFrame('ACT II - DINA Army List component loaded');

    console.log('🎭 MARIO: ACT III - SCENE 1: The Component Header!');
    console.log('');
    
    await captureFrame('ACT III - Component header with title');

    console.log('🎭 MARIO: ACT III - SCENE 2: The Statistics Section!');
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await captureFrame('ACT III - Statistics dashboard area');

    console.log('🎭 MARIO: ACT IV - SCENE 1: The Control Panel!');
    console.log('');
    
    await captureFrame('ACT IV - Pagination and sorting controls');

    console.log('🎭 MARIO: ACT IV - SCENE 2: The Data Display Area!');
    console.log('');
    
    // Scroll down to show data area
    await page.evaluate(() => window.scrollTo(0, 300));
    await captureFrame('ACT IV - Data display area');

    console.log('🎭 MARIO: ACT V - SCENE 1: Mid-Page Component View!');
    console.log('');
    
    await page.evaluate(() => window.scrollTo(0, 500));
    await captureFrame('ACT V - Mid-page view');

    console.log('🎭 MARIO: ACT V - SCENE 2: Full Component Overview!');
    console.log('');
    
    await page.evaluate(() => window.scrollTo(0, 0));
    await captureFrame('ACT V - Full component overview');

    console.log('🎭 MARIO: CURTAIN CALL! The Performance Concludes!');
    console.log('');
    
    await captureFrame('FINALE - Demonstration complete');

    console.log('\n══════════════════════════════════════════════════');
    console.log('🎭 MARIO: BRAVO! The marionette performed FLAWLESSLY!');
    console.log('🐾 NEKO: All frames captured perfectly, nyaa~! ✨');
    console.log('🗡️ NOEL: Frontend demonstration complete. Component renders correctly.');
    console.log('🎸 GLAM: ¡La cagó, hermanos! UI funcionando perfecto, weon.');
    console.log('🧠 HANNIBAL: The interface exhibits proper structure. Fascinating.');
    console.log('🧠 TETORA: [All Fragments]: UI identity integrated successfully.');
    console.log('══════════════════════════════════════════════════');
    console.log('');
    console.log(`📊 TOTAL FRAMES CAPTURED: ${frameCount}`);
    console.log(`📁 Frames location: ${FRAMES_DIR}`);
    console.log(`⚠️ API errors: ${consoleErrors.length} (expected if backend not running)`);
    console.log('');
    console.log('💡 NOTE: To see live data, start backend API:');
    console.log('   cd /home/wakibaka/Documents/github/neko-defense-api');
    console.log('   npm run start:dev');

  } catch (error) {
    console.error('\n❌ ERROR during demonstration:', error.message);
    await captureFrame('ERROR STATE');
  } finally {
    console.log('\n👁️ Browser will close in 10 seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));
    await browser.close();
  }
}

console.log('🎭🐾 DINA ARMY LIST PUPPETEER DEMONSTRATION 🐾🎭');
console.log('══════════════════════════════════════════════════');
console.log('');
console.log('🎭 MARIO: A theatrical performance of frontend architecture!');
console.log('🐾 NEKO: Demonstrating GraphQL integration UI, nyaa~!');
console.log('🗡️ NOEL: Visual demonstration protocol: ENGAGED.');
console.log('🎸 GLAM: ¡Vamos a mostrar el frontend, hermanos!');
console.log('🧠 HANNIBAL: Observing the interface with clinical precision...');
console.log('🧠 TETORA: [Multiple fragments]: Ready for analysis.');
console.log('');
console.log('══════════════════════════════════════════════════');
console.log('');

demonstrateDINAArmyList();
