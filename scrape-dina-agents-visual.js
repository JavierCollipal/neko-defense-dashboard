#!/usr/bin/env node

/**
 * 🐾🔍 Visual DINA Agents Data Scraper - October 20, 2025
 *
 * Rule 3.1: Visual demonstration with data extraction
 * - Shows browser window
 * - Opens DevTools
 * - Captures screenshots
 * - Extracts visible agent data
 * - Reports exactly what's on the page
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeAndShowDinaAgents() {
  console.log('🎭 VISUAL DINA AGENTS DATA EXTRACTION');
  console.log('=====================================\n');
  console.log('👀 WATCH the browser window!');
  console.log('📸 Taking screenshots...');
  console.log('🔍 Extracting agent data...\n');

  const browser = await puppeteer.launch({
    headless: false,       // 🎭 VISIBLE - Rule 3.1!
    slowMo: 250,          // ⚡ Slow motion
    devtools: true,       // 🔍 DevTools open!
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page = await browser.newPage();

  // Console monitoring
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error') {
      console.log(`❌ [CONSOLE ERROR]: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    console.log('🚨 PAGE ERROR:', error.message);
  });

  const outputDir = path.join(__dirname, 'puppeteer-screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    // Navigate to DINA agents
    console.log('📍 Scene 1: Navigating to DINA Agents page...');
    console.log('👀 WATCH the browser!\n');

    await page.goto('http://localhost:3000/dina-agents', {
      waitUntil: 'networkidle2',
      timeout: 15000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Screenshot 1: Initial page load
    console.log('📸 Scene 2: Capturing initial page...');
    const screenshot1 = path.join(outputDir, 'dina-agents-full-page.png');
    await page.screenshot({
      path: screenshot1,
      fullPage: true
    });
    console.log(`✅ Saved: ${screenshot1}\n`);

    // Extract page data
    console.log('📊 Scene 3: Extracting agent data...');
    console.log('👁️ WATCH me analyze the page!\n');

    const agentData = await page.evaluate(() => {
      // Try to find agent cards
      const agentCards = document.querySelectorAll('.agent-card, [class*="agent"], [class*="card"]');

      // Try to find agent list items
      const listItems = document.querySelectorAll('li, .list-item');

      // Try to find any data displayed
      const allText = document.body.innerText;

      // Count different elements
      const counts = {
        agentCards: agentCards.length,
        listItems: listItems.length,
        hasData: allText.length > 100
      };

      // Extract agent information if visible
      const agents = [];
      agentCards.forEach((card, index) => {
        const name = card.querySelector('[class*="name"]')?.innerText ||
                     card.querySelector('h2, h3, h4')?.innerText ||
                     `Agent ${index + 1}`;
        const text = card.innerText.substring(0, 200);
        agents.push({ name, preview: text });
      });

      return {
        counts,
        agents,
        pageTitle: document.title,
        bodyText: allText.substring(0, 500)
      };
    });

    console.log('═══════════════════════════════════════');
    console.log('📊 EXTRACTED DATA:');
    console.log('═══════════════════════════════════════');
    console.log(`📄 Page Title: ${agentData.pageTitle}`);
    console.log(`🃏 Agent Cards Found: ${agentData.counts.agentCards}`);
    console.log(`📋 List Items Found: ${agentData.counts.listItems}`);
    console.log(`📝 Has Data: ${agentData.counts.hasData ? 'YES' : 'NO'}\n`);

    if (agentData.agents.length > 0) {
      console.log('👥 AGENTS VISIBLE ON PAGE:');
      console.log('───────────────────────────────────────');
      agentData.agents.forEach((agent, i) => {
        console.log(`\n${i + 1}. ${agent.name}`);
        console.log(`   Preview: ${agent.preview.substring(0, 100)}...`);
      });
    } else {
      console.log('⚠️  NO AGENT CARDS DETECTED\n');
      console.log('📝 Page Content Preview:');
      console.log('───────────────────────────────────────');
      console.log(agentData.bodyText);
    }

    console.log('\n═══════════════════════════════════════\n');

    // Scroll and capture more screenshots
    console.log('📍 Scene 4: Scrolling through page...');
    await page.evaluate(() => window.scrollTo(0, 300));
    await new Promise(resolve => setTimeout(resolve, 2000));

    const screenshot2 = path.join(outputDir, 'dina-agents-scrolled.png');
    await page.screenshot({
      path: screenshot2,
      fullPage: false
    });
    console.log(`📸 Saved: ${screenshot2}\n`);

    // Try to click on an agent if visible
    console.log('📍 Scene 5: Looking for interactive elements...');
    const hasClickable = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, [role="button"], a');
      return buttons.length;
    });
    console.log(`🖱️  Found ${hasClickable} clickable elements\n`);

    // Final overview
    console.log('📍 Scene 6: Final overview...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 2000));

    const screenshot3 = path.join(outputDir, 'dina-agents-final.png');
    await page.screenshot({
      path: screenshot3,
      fullPage: false
    });
    console.log(`📸 Saved: ${screenshot3}\n`);

    console.log('✅ DATA EXTRACTION COMPLETE!\n');
    console.log('📁 Screenshots saved to:');
    console.log(`   ${outputDir}\n`);
    console.log('⏳ Browser will stay open for 10 seconds...');

    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error) {
    console.error('❌ Error:', error.message);
    await new Promise(resolve => setTimeout(resolve, 5000));
  } finally {
    await browser.close();
    console.log('\n💖 NYAA~! Visual scraping complete, desu~! 🐾✨');
  }
}

console.log('🚀 Starting in 2 seconds...\n');
setTimeout(() => {
  scrapeAndShowDinaAgents();
}, 2000);
