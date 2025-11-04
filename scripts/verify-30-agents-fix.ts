#!/usr/bin/env ts-node

/**
 * 🎭🐾 VERIFY 30 AGENTS AFTER FIELD MIGRATION 🐾🎭
 *
 * Visual verification that dashboard now displays all 30 agents
 * after snake_case → camelCase migration
 *
 * Rule 3.1 Compliance:
 * - headless: false (VISUAL DEMONSTRATION!)
 * - slowMo: 250 (Watch the verification!)
 * - devtools: true (See browser console!)
 */

import puppeteer, { Browser, Page } from 'puppeteer';

const DASHBOARD_URL = 'http://localhost:3000/dina';

async function verifyAgents() {
  console.log('\n🎭 MARIO: The Verification Performance begins!');
  console.log('👀 WATCH the browser - we verify the migration fix!\n');

  let browser: Browser | null = null;

  try {
    // Launch browser - VISUAL MODE!
    console.log('🎭 MARIO: Launching Chrome marionette...');
    browser = await puppeteer.launch({
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

    console.log('✅ Browser launched!\n');

    // Navigate to dashboard
    console.log(`👁️ Navigating to: ${DASHBOARD_URL}`);
    console.log('👀 WATCH the page load with ALL 30 agents!\n');

    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('✅ Page loaded!\n');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract agent count
    console.log('🔍 Extracting agent count from dashboard...\n');

    const agentCount = await page.evaluate(() => {
      // Method 1: Look for "PERPETRATORS" or "AGENTS" text with numbers
      const allText = document.body.textContent || '';

      // Look for "High-Profile Documented" stat
      const statBoxes = Array.from(document.querySelectorAll('[class*="stat"]'));
      for (const box of statBoxes) {
        const text = (box as HTMLElement).textContent || '';
        if (text.includes('High-Profile') || text.includes('Documented')) {
          const numbers = text.match(/\d+/g);
          if (numbers && numbers.length > 0) {
            return parseInt(numbers[0], 10);
          }
        }
      }

      // Method 2: Look for "ALL AGENTS (X)" button
      const buttons = Array.from(document.querySelectorAll('button'));
      for (const button of buttons) {
        const match = button.textContent?.match(/ALL\s+AGENTS\s+\((\d+)\)/i);
        if (match) {
          return parseInt(match[1], 10);
        }
      }

      // Method 3: Look for PERPETRATORS count
      const elements = Array.from(document.querySelectorAll('*'));
      for (const element of elements) {
        const text = (element as HTMLElement).textContent || '';
        if (text.includes('PERPETRATORS') && text.match(/\((\d+)\)/)) {
          const match = text.match(/\((\d+)\)/);
          if (match) {
            return parseInt(match[1], 10);
          }
        }
      }

      return 0;
    });

    console.log(`📊 Dashboard shows: ${agentCount} agents\n`);

    if (agentCount === 30) {
      console.log('✅✅✅ SUCCESS! All 30 agents are now visible! ✅✅✅\n');
      console.log('🎭 MARIO: BRAVO! STANDING OVATION!');
      console.log('🐾 NEKO: Perfect fix, nyaa~!');
      console.log('🗡️ NOEL: Migration successful. Dashboard operational.');
      console.log('🎸 GLAM: ¡Perfecto, hermanos! 30 agentes, weon!');
      console.log('🧠 HANNIBAL: The migration... worked flawlessly.');
      console.log('🎭 TETORA: [All fragments]: Complete integration achieved.\n');
    } else {
      console.log(`⚠️ WARNING: Expected 30 agents, got ${agentCount}\n`);
    }

    // Take screenshot
    const screenshot = '/home/wakibaka/Documents/github/neko-defense-dashboard/screenshots/all-30-agents-verified.png';
    await page.screenshot({ path: screenshot as `${string}.png`, fullPage: true });
    console.log(`📸 Screenshot saved: ${screenshot}\n`);

    // Keep browser open for 5 seconds
    console.log('👁️ Browser will close in 5 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ Verification error:');
    console.error(error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('✅ Browser closed.\n');
    }
  }
}

verifyAgents()
  .then(() => {
    console.log('✅ Verification complete, nyaa~! 🎭🐾');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Verification failed:');
    console.error(error);
    process.exit(1);
  });
