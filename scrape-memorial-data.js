#!/usr/bin/env node

/**
 * 🐾🔍 Visual DINA Page Data Scraper - October 20, 2025
 *
 * CORRECT ROUTE: /dina (not /dina-agents!)
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeDinaPage() {
  console.log('🎭 VISUAL DINA PAGE DATA EXTRACTION');
  console.log('===================================\n');
  console.log('✅ Using CORRECT route: /dina\n');

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    devtools: true,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized', '--auto-open-devtools-for-tabs']
  });

  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {console.log(`❌ [ERROR]: ${msg.text()}`);}
  });

  const outputDir = path.join(__dirname, 'puppeteer-screenshots');
  if (!fs.existsSync(outputDir)) {fs.mkdirSync(outputDir, { recursive: true });}

  try {
    console.log('📍 Navigating to /dina page...');
    console.log('👀 WATCH the browser!\n');

    await page.goto('http://localhost:3000/dina', {
      waitUntil: 'networkidle2',
      timeout: 15000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Screenshot
    const screenshot = path.join(outputDir, 'dina-page-full.png');
    await page.screenshot({ path: screenshot, fullPage: true });
    console.log(`📸 Saved: ${screenshot}\n`);

    // Extract data
    const pageData = await page.evaluate(() => {
      const agents = [];
      const agentElements = document.querySelectorAll('[class*="agent"], [class*="card"], .list-item, li');

      agentElements.forEach((el, i) => {
        const text = el.innerText;
        if (text && text.length > 10 && text.length < 500) {
          agents.push({
            index: i + 1,
            preview: text.substring(0, 150)
          });
        }
      });

      return {
        title: document.title,
        agentCount: agents.length,
        agents: agents.slice(0, 10), // First 10
        bodyText: document.body.innerText.substring(0, 1000)
      };
    });

    console.log('═══════════════════════════════════════');
    console.log('📊 EXTRACTED DATA:');
    console.log('═══════════════════════════════════════');
    console.log(`📄 Page Title: ${pageData.title}`);
    console.log(`🃏 Elements Found: ${pageData.agentCount}`);
    console.log('');

    if (pageData.agents.length > 0) {
      console.log('👥 AGENTS/ITEMS ON PAGE:');
      console.log('───────────────────────────────────────');
      pageData.agents.forEach(agent => {
        console.log(`\n${agent.index}. ${agent.preview}...`);
      });
    } else {
      console.log('📝 Page Content:');
      console.log('───────────────────────────────────────');
      console.log(pageData.bodyText);
    }

    console.log('\n═══════════════════════════════════════\n');
    console.log('⏳ Browser will stay open for 30 seconds for inspection...\n');

    await new Promise(resolve => setTimeout(resolve, 30000));

  } catch (error) {
    console.error('❌ Error:', error.message);
    await new Promise(resolve => setTimeout(resolve, 10000));
  } finally {
    await browser.close();
    console.log('\n💖 NYAA~! Visual scraping complete, desu~! 🐾✨');
  }
}

console.log('🚀 Starting in 2 seconds...\n');
setTimeout(() => scrapeDinaPage(), 2000);
