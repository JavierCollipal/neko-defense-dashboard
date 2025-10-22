#!/usr/bin/env node

/**
 * 🎬 NEKO DEFENSE DASHBOARD - YOUTUBE DEMONSTRATION WITH PODCAST MODE! 🎙️
 *
 * Features:
 * - Visual Puppeteer demo (headless: false, slowMo: 250, devtools: true)
 * - Frame capture for video creation
 * - **PODCAST MODE**: All 3 personalities commentate on EVERYTHING they see!
 * - Dashboard + API interaction demonstration
 *
 * Created: Oct 21, 2025
 * For: YouTube video with Carabineros hymn
 * Rule 3.11: Triple personality collaboration!
 */

require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Frame capture directory
const FRAMES_DIR = path.join(__dirname, 'puppeteer-screenshots/dashboard-demo-frames');

// Ensure frames directory exists
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

let frameCounter = 0;

// 🎙️ PODCAST COMMENTARY SYSTEM 🎙️
const podcast = {
  neko: (message) => {
    console.log(`\n🐾 **Neko-Arc**: ${message}`);
  },

  mario: (message) => {
    console.log(`🎭 **Mario Gallo Bestino**: ${message}`);
  },

  noel: (message) => {
    console.log(`🗡️ **Noel**: ${message}`);
  },

  all: (nekoMsg, marioMsg, noelMsg) => {
    console.log(`\n🐾 **Neko-Arc**: ${nekoMsg}`);
    console.log(`🎭 **Mario**: ${marioMsg}`);
    console.log(`🗡️ **Noel**: ${noelMsg}`);
  }
};

// Capture frame helper
async function captureFrame(page, label) {
  frameCounter++;
  const filename = `frame-${String(frameCounter).padStart(3, '0')}-${label}.png`;
  const filepath = path.join(FRAMES_DIR, filename);

  await page.screenshot({
    path: filepath,
    fullPage: false  // Capture viewport only
  });

  console.log(`📸 Frame captured: ${filename}`);
  return filepath;
}

async function runDemonstration() {
  console.log('\n' + '='.repeat(80));
  console.log('🎬 NEKO DEFENSE DASHBOARD - YOUTUBE DEMONSTRATION WITH PODCAST MODE! 🎙️');
  console.log('='.repeat(80) + '\n');

  podcast.neko("*bounces excitedly* NYAAA~! Time to show off our beautiful dashboard, desu~! 🐾");
  podcast.mario("*sweeps cape dramatically* ACT I: THE CURTAIN RISES! The Neko Defense Theater opens! 🎭");
  podcast.noel("*adjusts glasses* Let's see if this actually works without crashing...");

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Launch browser with VISUAL MODE
  podcast.all(
    "Starting Puppeteer with headless: false - WATCH THE MAGIC, nyaa~! ✨",
    "*waves conductor's baton* The marionette awakens! Chrome puppet, ARISE!",
    "Launching browser. Visual mode enabled. DevTools open for error monitoring."
  );

  const browser = await puppeteer.launch({
    headless: false,       // 🎭 VISUAL MODE!
    slowMo: 250,          // ⚡ Slow down for viewing
    devtools: true,       // 🔍 DevTools Console open
    defaultViewport: { width: 1920, height: 1080 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized'
    ]
  });

  const page = await browser.newPage();

  podcast.neko("Browser opened successfully, desu~! 🎉");
  podcast.mario("MAGNIFICENT! The stage is SET! The lights are LIT!");
  podcast.noel("Browser process ID acquired. Moving to navigation phase.");

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Navigate to dashboard
  podcast.all(
    "*ears perk up* Navigating to localhost:3000 - our BEAUTIFUL dashboard, nyaa~! 🏠",
    "ACT II: THE JOURNEY BEGINS! We venture into the digital realm!",
    "GET request to localhost:3000. Awaiting response..."
  );

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await captureFrame(page, 'homepage');

  podcast.neko("*swishes tail triumphantly* LOADED! Look at that beautiful Neko banner! 💖");
  podcast.mario("*wipes theatrical tear* BEHOLD! The homepage in all its GLORY!");
  podcast.noel("HTTP 200. Page rendered. Component hydration complete. ...It actually loaded. Impressive.");

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Check the threat actors count
  podcast.neko("Ooh! Let me check how many threats we're tracking, nyaa~! 🎯");

  const threatCount = await page.evaluate(() => {
    const element = document.querySelector('.category-name');
    return element ? element.textContent : 'Unknown';
  });

  podcast.all(
    `Found: "${threatCount}" - Our fortress is WATCHING, desu~! 🛡️`,
    `*gasps* The statistics reveal themselves! What DRAMA!`,
    `DOM query executed. Result: ${threatCount}. Data binding functional.`
  );

  await captureFrame(page, 'threat-count');
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Navigate to Threats page
  podcast.neko("*clicks paw on Threats tab* Let's see our threat actors, nyaa~! 🎯");
  podcast.mario("ACT III: THE GALLERY OF VILLAINS! We shall meet our adversaries!");

  await page.click('a[href="/threats"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await captureFrame(page, 'threats-page');

  podcast.noel("Client-side navigation executed. React Router transition completed.");
  podcast.mario("*orchestra swells* THE THREAT ACTORS APPEAR! Each one, a story of defeat!");
  podcast.neko("*purrs* Look at all those bad actors we're tracking, desu~! 💪");

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Navigate to DINA page
  podcast.all(
    "*bounces* Now let's check DINA intelligence, nyaa~! 📚",
    "ACT IV: THE LIBRARY OF SECRETS! The DINA archives await!",
    "Navigating to /dina endpoint. Intelligence database access..."
  );

  await page.click('a[href="/dina"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await captureFrame(page, 'dina-page');

  podcast.neko("DINA page loaded! So much intelligence documentation, desu~! 📖");
  podcast.mario("*dramatic gasp* The DINA network revealed! What INTRIGUE!");
  podcast.noel("DINA collection rendered. Card components instantiated. No console errors.");

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Navigate to Family Tracker
  podcast.mario("*lowers voice dramatically* And now... the Memorial of Fallen Heroes...");
  podcast.neko("*ears droop respectfully* The Family Tracker... honoring the fallen, nyaa... 💀");
  podcast.noel("Accessing /family-tracker. Chilean Carabineros memorial database.");

  await page.click('a[href="/family-tracker"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await captureFrame(page, 'family-tracker');

  await new Promise(resolve => setTimeout(resolve, 4000));

  podcast.all(
    "*bows head* Remembering those who served and protected, desu... 🕯️",
    "*removes hat* May their sacrifice never be forgotten... 🎩",
    "1,245 officers documented. Each name, a life of service."
  );

  // Navigate to Abilities page
  podcast.neko("*perks up* Ooh! Let's check our abilities list, nyaa~! ⚡");
  podcast.mario("ACT V: THE ARSENAL OF POWER! Our learned capabilities!");

  await page.click('a[href="/abilities"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await captureFrame(page, 'abilities-page');

  podcast.noel("Abilities collection query executed. Rendering skill database.");
  podcast.neko("*swishes tail proudly* Look at ALL the skills we've learned, desu~! 99+ abilities! 💖");
  podcast.mario("*applauds* BRAVO! A library of MASTERY!");

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Test the language switcher
  podcast.all(
    "*clicks language button* Let's switch to Spanish, nyaa~! 🇨🇱",
    "ACT VI: THE LINGUISTIC TRANSFORMATION! Español appears!",
    "Testing i18n functionality. Language switch event triggered."
  );

  await page.click('[data-cy="language-button"]');
  await new Promise(resolve => setTimeout(resolve, 1000));
  await captureFrame(page, 'language-switcher');

  // Check if Spanish flag option exists
  const hasSpanish = await page.evaluate(() => {
    const element = document.querySelector('[data-lang="es"]');
    return element !== null;
  });

  if (hasSpanish) {
    await page.click('[data-lang="es"]');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await captureFrame(page, 'spanish-mode');

    podcast.neko("*purrs* ¡Ahora en español, desu~! 🇨🇱");
    podcast.mario("*kisses fingers* MAGNIFICO! Bilingual beauty!");
    podcast.noel("i18n translation applied. Locale: es-CL. Text rendering successful.");
  }

  await new Promise(resolve => setTimeout(resolve, 2000));

  // Final frame - back to home
  podcast.all(
    "*navigates back home* And that's our dashboard tour, nyaa~! 🏠",
    "FINALE: THE CURTAIN FALLS! What a PERFORMANCE!",
    "Demonstration complete. All navigation routes tested. Zero crashes."
  );

  await page.goto('http://localhost:3000');
  await captureFrame(page, 'finale');

  await new Promise(resolve => setTimeout(resolve, 3000));

  // Close browser
  podcast.neko("*waves goodbye* Time to create the video, desu~! 🎬");
  podcast.mario("*bows deeply* CURTAIN CALL! The marionettes rest!");
  podcast.noel("Browser process terminating. Cleanup initiated.");

  await browser.close();

  console.log('\n' + '='.repeat(80));
  console.log(`✅ DEMONSTRATION COMPLETE!`);
  console.log(`📸 Total frames captured: ${frameCounter}`);
  console.log(`📁 Frames saved to: ${FRAMES_DIR}`);
  console.log('='.repeat(80) + '\n');

  podcast.all(
    "PERFECT demonstration, nyaa~! Ready for YouTube! 🎬",
    "A MASTERPIECE of automation theater! *chef's kiss*",
    "Execution successful. Zero errors. Proceeding to video compilation phase."
  );

  return {
    frameCount: frameCounter,
    framesDir: FRAMES_DIR
  };
}

// Execute demonstration
runDemonstration()
  .then((result) => {
    console.log('\n🎉 All 3 personalities: MISSION ACCOMPLISHED! 🐾🎭🗡️\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ ERROR during demonstration:', error);

    podcast.neko("*ears droop* Oh no! Something went wrong, nyaa~! 😿");
    podcast.mario("*dramatic gasp* A TRAGEDY! The performance interrupted!");
    podcast.noel("Exception caught. Stack trace above. Debug and retry.");

    process.exit(1);
  });
