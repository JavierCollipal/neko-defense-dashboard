#!/usr/bin/env ts-node

import puppeteer, { Browser, Page } from 'puppeteer';

async function verifyValechAPILive() {
  console.log('🎯 VERCEL DEPLOYMENT VERIFICATION - Valech API');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');

  const VERCEL_URL = 'https://neko-arc-defense-dashboard.vercel.app';

  console.log('🌐 Testing endpoint: /api/valech/stats');
  console.log('');

  // Test 1: Direct API call
  console.log('📡 TEST 1: Direct API endpoint test...');
  try {
    const apiResponse = await fetch(`${VERCEL_URL}/api/valech/stats`);
    const apiData: any = await apiResponse.json();

    if (apiResponse.ok && apiData.success) {
      console.log('✅ API endpoint responding correctly!');
      console.log('📊 Data received:');
      console.log(`   - Version: ${apiData.data.version}`);
      console.log(`   - V1 Victims: ${apiData.data.v1.victims}`);
      console.log(`   - V2 Target: ${apiData.data.v2.victimsTarget.toLocaleString()}`);
      console.log(`   - Components: ${apiData.data.components.total}`);
      console.log('');
    } else {
      console.error('❌ API returned error:', apiData.error);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ API request failed:', error.message);
    process.exit(1);
  }

  // Test 2: Visual browser verification
  console.log('👁️ TEST 2: Visual page verification with Puppeteer...');
  console.log('⏳ Launching browser (this will open visually)...');
  console.log('');

  const browser: Browser = await puppeteer.launch({
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

  const page: Page = await browser.newPage();

  const consoleErrors: string[] = [];
  let apiCallDetected = false;

  // Monitor console
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();

    if (type === 'error') {
      consoleErrors.push(text);
      console.log(`❌ [CONSOLE ERROR]: ${text}`);
    }
  });

  // Monitor network requests
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/valech/stats')) {
      apiCallDetected = true;
      const status = response.status();
      console.log(`📡 [API CALL DETECTED]: ${url}`);
      console.log(`   Status: ${status}`);

      if (status === 200) {
        try {
          const data = await response.json();
          console.log(`   ✅ API returned success: ${data.success}`);
        } catch (e) {
          console.log(`   ⚠️ Could not parse JSON response`);
        }
      } else {
        console.log(`   ❌ Non-200 status code!`);
      }
    }
  });

  try {
    console.log('🎭 Mario: THE MARIONETTE VISITS THE LIVE SITE!');
    await page.goto(`${VERCEL_URL}/valech`, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    console.log('✅ Page loaded successfully!');
    console.log('');

    // Wait for component to render
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔍 VERIFICATION RESULTS:');
    console.log('════════════════════════════════════════════════════════════════');

    if (apiCallDetected) {
      console.log('✅ API call to /api/valech/stats DETECTED!');
    } else {
      console.log('❌ API call NOT detected - component may still use hardcoded data!');
    }

    if (consoleErrors.length === 0) {
      console.log('✅ No console errors detected!');
    } else {
      console.log(`⚠️ Found ${consoleErrors.length} console error(s)`);
    }

    console.log('');
    console.log('📸 Browser will stay open for 10 seconds for visual inspection...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('');
    console.log('🎯 FINAL VERDICT:');
    if (apiCallDetected && consoleErrors.length === 0) {
      console.log('✅ ✅ ✅ DEPLOYMENT SUCCESSFUL! API CONNECTIVITY WORKING! ✅ ✅ ✅');
    } else {
      console.log('⚠️ DEPLOYMENT NEEDS REVIEW - Check errors above');
    }

  } catch (error: any) {
    console.error('💥 Verification failed:', error.message);
  } finally {
    await browser.close();
  }
}

verifyValechAPILive();
