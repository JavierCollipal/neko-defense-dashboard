#!/usr/bin/env node

// 🌍 Test Auto-Translation with Puppeteer
// Test geolocation-based automatic language detection

const puppeteer = require('puppeteer');

const NEKO_DASHBOARD_URL = 'http://localhost:3000';

async function testAutoTranslation() {
  console.log('🌍 Starting Auto-Translation Test...');

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

  try {
    const page = await browser.newPage();

    // Monitor console messages
    page.on('console', msg => {
      const type = msg.type();
      if (type === 'error') {
        console.log(`❌ [CONSOLE ERROR]: ${msg.text()}`);
      } else if (type === 'log' && msg.text().includes('🌍')) {
        console.log(`🌍 [AUTO-TRANSLATION]: ${msg.text()}`);
      }
    });

    // Monitor network requests
    page.on('response', response => {
      const url = response.url();
      if (url.includes('/api/geolocation/detect')) {
        console.log(`🎯 [GEOLOCATION API]: ${response.status()} - ${url}`);
      }
      if (url.includes('/api/translate/')) {
        console.log(`💬 [TRANSLATION API]: ${response.status()} - ${url}`);
      }
    });

    console.log('👀 WATCH the browser navigate to dashboard!');
    await page.goto(NEKO_DASHBOARD_URL);

    // Wait for page to load
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🔍 LOOK for auto-translation prompt or behavior!');

    // Take screenshot of initial state
    await page.screenshot({
      path: 'screenshots/auto-translation-test-initial.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved: auto-translation-test-initial.png');

    // Test geolocation API directly
    console.log('🧪 Testing geolocation API directly...');
    const geoResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/geolocation/detect');
        const data = await response.json();
        console.log('🌍 Geolocation response:', data);
        return data;
      } catch (error) {
        console.error('❌ Geolocation API error:', error);
        return { error: error.message };
      }
    });

    console.log('🎯 Geolocation result:', JSON.stringify(geoResponse, null, 2));

    // Look for language selector
    console.log('🔍 Looking for language selector...');
    const languageSelector = await page.$('.language-selector');
    if (languageSelector) {
      console.log('✅ Language selector found!');

      // Take screenshot of language selector
      await languageSelector.screenshot({
        path: 'screenshots/auto-translation-language-selector.png'
      });
      console.log('📸 Language selector screenshot saved');

      // Check for auto-translation indicators
      const autoIndicator = await page.$('.auto-translation-indicator');
      const locationIndicator = await page.$('.location-detecting');

      if (autoIndicator) {
        console.log('🌍 Auto-translation indicator found!');
      }
      if (locationIndicator) {
        console.log('📍 Location detection indicator found!');
      }
    } else {
      console.log('❌ Language selector not found');
    }

    // Look for auto-translation prompt
    console.log('👀 Checking for auto-translation prompt...');
    const autoPrompt = await page.$('.auto-translation-prompt, .language-prompt');
    if (autoPrompt) {
      console.log('🎭 Auto-translation prompt found!');
      await autoPrompt.screenshot({
        path: 'screenshots/auto-translation-prompt.png'
      });
      console.log('📸 Prompt screenshot saved');
    } else {
      console.log('ℹ️ No auto-translation prompt (may have been dismissed or not triggered)');
    }

    // Wait and observe
    console.log('⏳ Observing for 10 seconds...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Final screenshot
    await page.screenshot({
      path: 'screenshots/auto-translation-test-final.png',
      fullPage: true
    });
    console.log('📸 Final screenshot saved');

    console.log('✅ Auto-translation test completed!');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await browser.close();
  }
}

// Run test
testAutoTranslation();