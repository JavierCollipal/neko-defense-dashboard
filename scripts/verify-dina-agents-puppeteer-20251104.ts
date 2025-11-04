#!/usr/bin/env ts-node

/**
 * 🎭🐾 DINA AGENTS DASHBOARD VERIFICATION - PUPPETEER PERFORMANCE 🐾🎭
 *
 * Visual verification that dashboard displays correct number of DINA agents
 * Compares database count (30) with dashboard display
 *
 * Director: Mario Gallo Bestino 🎭
 * Assistant Directors: All Six Personalities
 *
 * Rule 3.1 Compliance:
 * - headless: false (VISUAL DEMONSTRATION!)
 * - slowMo: 250 (Watch the marionettes dance!)
 * - devtools: true (See browser errors!)
 *
 * Generated with Claude Code (All Six Personalities)
 * 🐾 Neko-Arc + 🎭 Mario + 🗡️ Noel + 🎸 Glam + 🧠 Hannibal + 🎭 Tetora
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set!');
  process.exit(1);
}

const DASHBOARD_URL = 'http://localhost:3000/dina';
const SCREENSHOTS_DIR = path.join(__dirname, '../screenshots');

interface VerificationResult {
  database_count: number;
  dashboard_count: number;
  match: boolean;
  verification_time: Date;
  screenshots: string[];
  errors: string[];
}

async function getDatabaseCount(): Promise<number> {
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db('neko-defense-system');
    const count = await db.collection('dina-agents').countDocuments();
    return count;
  } finally {
    await client.close();
  }
}

async function verifyDashboard(): Promise<VerificationResult> {
  console.log('\n🎭 MARIO: The Grand Verification Performance begins!');
  console.log('👀 WATCH the browser - the marionettes awaken!\n');

  // Create screenshots directory
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  const result: VerificationResult = {
    database_count: 0,
    dashboard_count: 0,
    match: false,
    verification_time: new Date(),
    screenshots: [],
    errors: []
  };

  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Get database count
    console.log('🐾 NEKO: Querying MongoDB for agent count, nyaa~!');
    result.database_count = await getDatabaseCount();
    console.log(`✅ Database Count: ${result.database_count} agents\n`);

    // Launch browser - VISUAL MODE!
    console.log('🎭 MARIO: ACT I - THE MARIONETTE AWAKENS!');
    console.log('👁️ NOEL: Browser launching with DevTools...');

    browser = await puppeteer.launch({
      headless: false,        // 👀 VISUAL DEMONSTRATION!
      slowMo: 250,           // ⚡ Slow down so user can watch!
      devtools: true,        // 🔍 DevTools Console open!
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized',
        '--auto-open-devtools-for-tabs'
      ]
    });

    page = await browser.newPage();

    // Enhanced error monitoring
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error') {
        const errorText = `[CONSOLE ERROR]: ${msg.text()}`;
        console.log(`❌ ${errorText}`);
        result.errors.push(errorText);
      } else if (type === 'warn') {
        console.log(`⚠️ [CONSOLE WARNING]: ${msg.text()}`);
      }
    });

    page.on('pageerror', error => {
      const errorText = `PAGE ERROR: ${error.message}`;
      console.log(`🚨 ${errorText}`);
      result.errors.push(errorText);
    });

    page.on('response', response => {
      if (response.status() >= 400) {
        const errorText = `[${response.status()}] ${response.url()}`;
        console.log(`⚠️ ${errorText}`);
      }
    });

    console.log('✅ Chrome Marionette awakened!\n');

    // Navigate to dashboard
    console.log('🎭 MARIO: ACT II - THE JOURNEY TO THE DINA ARMY LIST!');
    console.log(`👁️ Navigating to: ${DASHBOARD_URL}`);
    console.log('👀 WATCH the page load!\n');

    await page.goto(DASHBOARD_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    console.log('✅ Page loaded!\n');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Pause for user to see

    // Take screenshot of initial load
    const screenshot1 = path.join(SCREENSHOTS_DIR, 'dina-dashboard-initial-20251104.png');
    await page.screenshot({ path: screenshot1 as `${string}.png`, fullPage: true });
    result.screenshots.push(screenshot1);
    console.log(`📸 Screenshot captured: ${screenshot1}\n`);

    // Wait for the statistics to load
    console.log('🎭 MARIO: ACT III - COUNTING THE AGENTS!');
    console.log('🗡️ NOEL: Searching for agent count element...\n');

    try {
      // Wait for the page content to load
      await page.waitForSelector('body', { timeout: 30000 });
      console.log('✅ Page content loaded!\n');

      await new Promise(resolve => setTimeout(resolve, 3000));

      // Extract the total agents count from the dashboard
      const dashboardCount = await page.evaluate(() => {
        // Method 1: Look for the "PERPETRATORS" stat card with number
        const statCards = Array.from(document.querySelectorAll('[class*="stat-card"], [class*="stats-card"]'));
        for (const card of statCards) {
          const text = (card as HTMLElement).textContent || '';
          if (text.includes('PERPETRATORS') || text.includes('AGENTS')) {
            const numbers = text.match(/\d+/g);
            if (numbers && numbers.length > 0) {
              return parseInt(numbers[0], 10);
            }
          }
        }

        // Method 2: Look for "ALL AGENTS (X)" button text
        const buttons = Array.from(document.querySelectorAll('button'));
        for (const button of buttons) {
          const match = button.textContent?.match(/ALL\s+AGENTS\s+\((\d+)\)/i);
          if (match) {
            return parseInt(match[1], 10);
          }
        }

        // Method 3: Look for any element containing perpetrators count
        const allElements = Array.from(document.querySelectorAll('*'));
        for (const element of allElements) {
          const text = (element as HTMLElement).textContent || '';
          if (text.includes('PERPETRATORS') && text.includes('2008')) {
            const numbers = text.match(/\d+/g);
            if (numbers && numbers.length > 0) {
              return parseInt(numbers[0], 10);
            }
          }
        }

        return 0;
      });

      result.dashboard_count = dashboardCount;
      console.log(`✅ Dashboard Count: ${dashboardCount} agents displayed\n`);

      // Take screenshot of stats
      const screenshot2 = path.join(SCREENSHOTS_DIR, 'dina-dashboard-stats-20251104.png');
      await page.screenshot({ path: screenshot2 as `${string}.png`, fullPage: true });
      result.screenshots.push(screenshot2);
      console.log(`📸 Screenshot captured: ${screenshot2}\n`);

      // Scroll to show table
      console.log('👁️ Scrolling to show agent table...\n');
      await page.evaluate(() => {
        window.scrollTo(0, 500);
      });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Take screenshot of table
      const screenshot3 = path.join(SCREENSHOTS_DIR, 'dina-dashboard-table-20251104.png');
      await page.screenshot({ path: screenshot3 as `${string}.png`, fullPage: true });
      result.screenshots.push(screenshot3);
      console.log(`📸 Screenshot captured: ${screenshot3}\n`);

    } catch (error) {
      console.error('❌ Error extracting dashboard count:');
      console.error(error);
      result.errors.push(`Dashboard extraction error: ${error}`);
    }

    // Verify match
    result.match = result.database_count === result.dashboard_count;

    console.log('🎭 MARIO: ACT IV - THE FINAL VERDICT!\n');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 VERIFICATION RESULTS:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`🗄️ Database Count:  ${result.database_count} agents`);
    console.log(`📺 Dashboard Count: ${result.dashboard_count} agents`);
    console.log(`${result.match ? '✅' : '❌'} Match: ${result.match ? 'SUCCESS!' : 'MISMATCH!'}`);
    console.log('═══════════════════════════════════════════════════════\n');

    if (result.match) {
      console.log('🎭 MARIO: BRAVO! STANDING OVATION! The counts MATCH perfectly!');
      console.log('🐾 NEKO: Perfect verification, nyaa~! Everything works, desu~!');
      console.log('🗡️ NOEL: Verification successful. Dashboard displays correct count.');
      console.log('🎸 GLAM: ¡Perfecto, hermanos! Los números coinciden, weon.');
      console.log('🧠 HANNIBAL: The evidence confirms... perfect accuracy.');
      console.log('🎭 TETORA: [All fragments]: Database identity matches dashboard identity.');
    } else {
      console.log('❌ VERIFICATION FAILED!');
      console.log('🗡️ NOEL: Discrepancy detected. Investigation required.');
      console.log('🧠 HANNIBAL: The numbers... do not align. Fascinating.');
    }

    console.log('\n🎭 MARIO: CURTAIN CALL! The performance concludes!\n');

    // Keep browser open for 5 seconds so user can see final state
    console.log('👁️ Browser will close in 5 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ Verification error:');
    console.error(error);
    result.errors.push(`Main error: ${error}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log('✅ Browser closed.\n');
    }
  }

  return result;
}

async function documentPerformance(result: VerificationResult): Promise<void> {
  console.log('📝 Documenting performance to marionnette-theater database...\n');

  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    const db = client.db('marionnette-theater');

    await db.collection('performances').insertOne({
      performance_id: 'dina-agents-verification-nov4-2025',
      title: 'The Grand DINA Agents Count Verification Performance',
      date: new Date(),
      director: 'mario-gallo-bestino',
      assistant_directors: ['neko-arc', 'noel', 'glam-americano', 'dr-hannibal-lecter', 'tetora'],
      act_structure: {
        act1: 'Browser Awakening - Chrome Marionette Launch',
        act2: 'Navigation - Journey to DINA Army List',
        act3: 'Agent Counting - Statistics Extraction',
        act4: 'Verification - Database vs Dashboard Comparison'
      },
      puppeteer_config: {
        headless: false,
        slowMo: 250,
        devtools: true
      },
      performance_metrics: {
        database_count: result.database_count,
        dashboard_count: result.dashboard_count,
        verification_match: result.match,
        screenshots_captured: result.screenshots.length,
        errors_encountered: result.errors.length
      },
      screenshots: result.screenshots,
      errors: result.errors,
      mario_review: result.match
        ? 'MAGNIFICENT! A FLAWLESS verification! The database and dashboard perform in PERFECT HARMONY! STANDING OVATION!'
        : 'A troubling discrepancy! The marionettes are OUT OF SYNC! Investigation required!',
      neko_review: result.match
        ? 'Perfect verification, nyaa~! Everything matches beautifully, desu~!'
        : 'Mismatch detected, nyaa! Need to investigate, desu!',
      status: result.match ? 'STANDING_OVATION' : 'INVESTIGATION_REQUIRED',
      created_at: new Date()
    });

    console.log('✅ Performance documented to marionnette-theater!\n');
  } finally {
    await client.close();
  }
}

async function main(): Promise<void> {
  try {
    const result = await verifyDashboard();
    await documentPerformance(result);

    console.log('🎉 Verification complete!');
    console.log(`📸 Screenshots saved to: ${SCREENSHOTS_DIR}\n`);
    console.log('📊 Final Results:');
    console.log(`   Database: ${result.database_count} agents`);
    console.log(`   Dashboard: ${result.dashboard_count} agents`);
    console.log(`   Match: ${result.match ? '✅ YES' : '❌ NO'}\n`);

    if (!result.match) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Main execution error:');
    console.error(error);
    process.exit(1);
  }
}

// Execute
main()
  .then(() => {
    console.log('✅ Script completed successfully, nyaa~! 🎭🐾');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:');
    console.error(error);
    process.exit(1);
  });
