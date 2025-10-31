#!/usr/bin/env ts-node
/**
 * Quick test of production URL accessibility
 */

import puppeteer from 'puppeteer';

async function testProductionURL() {
  console.log('🔍 Testing production URL accessibility...\n');

  const productionURL = 'https://neko-defense-dashboard.vercel.app/case-patterns';

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Monitor for errors
  const errors: string[] = [];

  page.on('response', response => {
    const status = response.status();
    const url = response.url();
    if (status === 401 || status === 403) {
      errors.push(`❌ [${status}] ${url}`);
      console.log(`❌ [${status}] ${url}`);
    } else if (status >= 200 && status < 300 && url.includes('case-patterns')) {
      console.log(`✅ [${status}] ${url}`);
    }
  });

  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      errors.push(`Console error: ${text}`);
      console.log(`❌ [CONSOLE ERROR]: ${text}`);
    }
  });

  try {
    console.log(`🌐 Navigating to: ${productionURL}\n`);
    await page.goto(productionURL, { waitUntil: 'networkidle2', timeout: 15000 });

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Check page title
    const title = await page.title();
    console.log(`\n📄 Page Title: ${title}`);

    // Check if we're on login page
    const isLoginPage = title.toLowerCase().includes('login') || title.toLowerCase().includes('vercel');

    if (isLoginPage) {
      console.log('⚠️ REDIRECTED TO LOGIN PAGE - Deployment is password protected!');
      console.log('\n🔓 SOLUTION: Disable password protection in Vercel dashboard');
    } else {
      console.log('✅ Page loaded successfully - No authentication required!');
    }

    console.log(`\n📊 Errors found: ${errors.length}`);

  } catch (error) {
    console.error('❌ Navigation error:', error);
  } finally {
    console.log('\n⏳ Closing browser in 3 seconds...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await browser.close();
  }
}

testProductionURL();
