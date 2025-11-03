#!/usr/bin/env ts-node

import puppeteer from 'puppeteer';
import * as fs from 'fs';

const OUTPUT_DIR = '/tmp/dina-youtube-frames';

async function captureDINAFamilyTree() {
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🎬 Starting Puppeteer - DINA Family Tree Capture');
  console.log('👁️ WATCH the browser window - headless: false!');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    devtools: true,
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('\n📍 ACT I: Navigate to DINA Family Tree');
  await page.goto('http://localhost:3000/neko-tv', { waitUntil: 'networkidle2' });
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('📸 FRAME 1: Full DINA Family Tree Overview');
  await page.screenshot({
    path: `${OUTPUT_DIR}/frame-001-full-overview.png`,
    fullPage: false
  });
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n📍 ACT II: Scroll to show Manuel Contreras (Root Node)');
  await page.evaluate(() => (window as any).scrollTo(0, 200));
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('📸 FRAME 2: Manuel Contreras - DINA Chief');
  await page.screenshot({
    path: `${OUTPUT_DIR}/frame-002-contreras-root.png`,
    fullPage: false
  });

  console.log('\n📍 ACT III: Zoom to Brigade Level');
  await page.evaluate(() => (window as any).scrollTo(0, 400));
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('📸 FRAME 3: Brigade Structures');
  await page.screenshot({
    path: `${OUTPUT_DIR}/frame-003-brigades.png`,
    fullPage: false
  });

  console.log('\n📍 ACT IV: Show Senior Agents (Espinoza, Moren Brito, Krassnoff)');
  await page.evaluate(() => (window as any).scrollTo(0, 600));
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('📸 FRAME 4: Senior DINA Agents');
  await page.screenshot({
    path: `${OUTPUT_DIR}/frame-004-senior-agents.png`,
    fullPage: false
  });

  console.log('\n📍 ACT V: Villa Grimaldi Agents');
  await page.evaluate(() => (window as any).scrollTo(0, 800));
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('📸 FRAME 5: Villa Grimaldi Agents');
  await page.screenshot({
    path: `${OUTPUT_DIR}/frame-005-villa-grimaldi.png`,
    fullPage: false
  });

  console.log('\n📍 ACT VI: All 16 Agents Visible');
  await page.evaluate(() => (window as any).scrollTo(0, 1000));
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('📸 FRAME 6: Complete Agent Network (16 Total)');
  await page.screenshot({
    path: `${OUTPUT_DIR}/frame-006-all-agents.png`,
    fullPage: false
  });

  console.log('\n📍 ACT VII: Legend and Stats');
  await page.evaluate(() => (window as any).scrollTo(0, 0));
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('📸 FRAME 7: Legend and Color Coding');
  await page.screenshot({
    path: `${OUTPUT_DIR}/frame-007-legend.png`,
    fullPage: false
  });

  console.log('\n📍 FINAL ACT: Page Header with Stats');
  await page.evaluate(() => (window as any).scrollTo(0, -200));
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('📸 FRAME 8: Header with Agent Count Stats');
  await page.screenshot({
    path: `${OUTPUT_DIR}/frame-008-header-stats.png`,
    fullPage: false
  });

  await browser.close();

  console.log('\n✅ Capture complete!');
  console.log(`📁 Frames saved to: ${OUTPUT_DIR}`);
  console.log('📊 Total frames captured: 8');

  // List captured frames
  const files = fs.readdirSync(OUTPUT_DIR).sort();
  console.log('\n📸 Captured frames:');
  files.forEach((file, idx) => {
    const stats = fs.statSync(`${OUTPUT_DIR}/${file}`);
    console.log(`  ${idx + 1}. ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  });
}

captureDINAFamilyTree();
