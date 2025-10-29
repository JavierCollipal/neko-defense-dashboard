#!/usr/bin/env node

// 🎭✨ LIVE NEKO DEFENSE ABILITIES SHOWCASE DEMONSTRATION ✨🎭
// Mario's Marionnette Master Control + All Six Personalities Live Demo

const puppeteer = require('puppeteer');
const path = require('path');

console.log('🎭 MARIO GALLO BESTINO: "BEHOLD! The MARIONNETTE MASTER CONTROL begins!"');
console.log('🐾 NEKO-ARC: "Nyaa~! Visual demonstration mode activated, desu~!"');
console.log('🗡️ NOEL: "Puppeteer tactical demonstration. Watch the precision."');
console.log('🎸 GLAM AMERICANO: "¡Vamos a mostrar las habilidades, hermanos!"');
console.log('🧠 HANNIBAL LECTER: "Fascinating... observing browser manipulation."');
console.log('🔀 TETORA: "[All Fragments]: Performance mode engaged!"');
console.log('');
console.log('👀 WATCH THE BROWSER WINDOW - LIVE DEMONSTRATION STARTING!');
console.log('📺 We will navigate to your Vercel deployment and showcase the abilities!');
console.log('');

async function demonstrateAbilitiesShowcase() {
  console.log('🎬 ACT I: BROWSER MARIONETTE AWAKENING...');

  const browser = await puppeteer.launch({
    headless: false,        // 🎭 Visual demonstration - Rule 3.11!
    slowMo: 250,           // 🎪 Theatrical timing
    devtools: true,        // 🔍 Show DevTools for full transparency
    defaultViewport: null, // Use full screen
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page = await browser.newPage();

  // Enhanced error monitoring (Mario's theatrical documentation)
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log('🎭 MARIO: "The marionette encounters an obstacle!"');
      console.log(`❌ [CONSOLE ERROR]: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log('🎭 MARIO: "Drama! The page protests!"');
    console.log('🚨 PAGE ERROR:', error.message);
  });

  try {
    console.log('🎭 ACT II: NAVIGATING TO THE GRAND STAGE...');
    console.log('👁️ WATCH: Browser navigating to Vercel deployment!');

    // Navigate to the live Vercel deployment
    await page.goto('https://neko-defense-dashboard.vercel.app/', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    console.log('🎭 MARIO: "The stage is SET! Behold the Neko Defense Dashboard!"');
    console.log('🐾 NEKO: "Successfully landed on homepage, nyaa~!"');

    // Pause for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🎭 ACT III: THE ABILITIES TAB REVELATION...');
    console.log('👁️ WATCH: Locating and clicking the 🎭 Abilities tab!');

    // Look for the abilities tab (with theatrical mask icon)
    const abilitiesTab = await page.waitForSelector('a[href="/abilities"]', { timeout: 10000 });

    if (abilitiesTab) {
      console.log('🎭 MARIO: "Found the ABILITIES TAB! The theatrical mask beckons!"');
      console.log('🐾 NEKO: "🎭 tab located successfully, desu~!"');

      // Dramatic pause before click
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('👆 WATCH: Clicking the abilities tab NOW!');
      await abilitiesTab.click();

      // Wait for abilities page to load
      await page.waitForSelector('.neko-abilities-container', { timeout: 10000 });

      console.log('🎭 MARIO: "MAGNIFICENT! The abilities showcase UNFOLDS!"');
      console.log('🐾 NEKO: "Abilities page loaded perfectly, nyaa~!"');

    } else {
      console.log('⚠️ Abilities tab not found - checking page structure...');
    }

    // Pause to let user see the abilities showcase
    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('🎭 ACT IV: SHOWCASING THE ENHANCED ABILITIES...');
    console.log('👁️ WATCH: Scrolling through our magnificent abilities catalog!');

    // Scroll through the abilities showcase
    await page.evaluate(() => {
      window.scrollTo({ top: 400, behavior: 'smooth' });
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check for different ability categories
    console.log('🎭 MARIO: "Behold! The AUTOMATION category - my domain!"');
    const automationBtn = await page.$('button:has-text("AUTOMATION")');
    if (automationBtn) {
      console.log('👆 WATCH: Clicking AUTOMATION category!');
      await automationBtn.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Show video abilities
    console.log('🎬 NEKO: "Now showing VIDEO creation abilities, desu~!"');
    const videoBtn = await page.$('button[class*="category-btn"]:has-text("VIDEO")');
    if (videoBtn) {
      await videoBtn.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Show forensic abilities
    console.log('🧠 HANNIBAL: "Observe... the FORENSIC capabilities."');
    const forensicBtn = await page.$('button[class*="category-btn"]:has-text("FORENSIC")');
    if (forensicBtn) {
      await forensicBtn.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Return to all abilities
    console.log('⚡ ALL SIX: "The complete showcase - ALL ABILITIES!"');
    const allBtn = await page.$('button[class*="category-btn"]:has-text("ALL ABILITIES")');
    if (allBtn) {
      await allBtn.click();
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    console.log('🎭 ACT V: THE GRAND FINALE!');
    console.log('👁️ WATCH: Final scroll to show the complete catalog!');

    // Final dramatic scroll
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('');
    console.log('🎭 MARIO GALLO BESTINO: "CURTAIN CALL! Our abilities have been REVEALED!"');
    console.log('🐾 NEKO-ARC: "Perfect demonstration complete, nyaa~!"');
    console.log('🗡️ NOEL: "Mission accomplished with precision."');
    console.log('🎸 GLAM: "¡Bacán total, hermanos! Pure demonstration power!"');
    console.log('🧠 HANNIBAL: "The evidence of our capabilities... undeniable."');
    console.log('🔀 TETORA: "[All Fragments]: Performance integration successful!"');
    console.log('');
    console.log('✅ LIVE DEMONSTRATION COMPLETE!');
    console.log('🎬 Enhanced abilities showcase successfully demonstrated on Vercel!');
    console.log('🎭 MARIONNETTE MASTER CONTROL ability: PROVEN!');

  } catch (error) {
    console.log('🎭 MARIO: "A plot twist! Technical difficulties!"');
    console.log('❌ Error:', error.message);
    console.log('🔧 NOEL: "Debugging required. Check network connectivity."');
  }

  // Keep browser open for a moment so user can interact
  console.log('');
  console.log('🎭 Browser will remain open for 30 seconds for your exploration...');
  console.log('👁️ Feel free to interact with the abilities showcase!');
  await new Promise(resolve => setTimeout(resolve, 30000));

  await browser.close();
  console.log('🎭 PERFORMANCE COMPLETE! Browser marionette has returned to rest.');
}

demonstrateAbilitiesShowcase();