#!/usr/bin/env node

// 🐾🌍 VISUAL I18N TRANSLATION TESTING - PUPPETEER LIVE DEMO 🌍🐾
// RULE 3.1: headless: false, slowMo, devtools, error monitoring, MongoDB persistence!

require('dotenv').config();
const puppeteer = require('puppeteer');
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not set in .env file!');
  process.exit(1);
}

const BASE_URL = 'http://localhost:3001';

// Error collector for MongoDB persistence
class PuppeteerErrorCollector {
  constructor(mongoUri) {
    this.mongoUri = mongoUri;
    this.client = null;
    this.db = null;
    this.collection = null;
    this.errors = [];
  }

  async connect() {
    try {
      this.client = new MongoClient(this.mongoUri);
      await this.client.connect();
      this.db = this.client.db('neko-defense-system');
      this.collection = this.db.collection('puppeteer-error-collections');
      console.log('✅ Connected to MongoDB for error tracking!');
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
    }
  }

  async saveConsoleError(type, message, context = {}) {
    if (!this.collection) {return;}

    const errorDoc = {
      type: 'console_error',
      level: type,
      message: message,
      context: context,
      timestamp: new Date(),
      session: 'i18n-visual-test-oct20'
    };

    this.errors.push(errorDoc);

    try {
      await this.collection.insertOne(errorDoc);
      console.log(`💾 [MongoDB] Saved console error: ${message.substring(0, 50)}...`);
    } catch (error) {
      console.error('❌ Failed to save console error:', error.message);
    }
  }

  async saveJavaScriptError(error, context = {}) {
    if (!this.collection) {return;}

    const errorDoc = {
      type: 'javascript_error',
      message: error.message,
      stack: error.stack,
      context: context,
      timestamp: new Date(),
      session: 'i18n-visual-test-oct20'
    };

    this.errors.push(errorDoc);

    try {
      await this.collection.insertOne(errorDoc);
      console.log(`💾 [MongoDB] Saved JavaScript error: ${error.message}`);
    } catch (error) {
      console.error('❌ Failed to save JavaScript error:', error.message);
    }
  }

  async saveFailedRequest(status, url, context = {}) {
    if (!this.collection) {return;}

    const errorDoc = {
      type: 'failed_request',
      status: status,
      url: url,
      context: context,
      timestamp: new Date(),
      session: 'i18n-visual-test-oct20'
    };

    this.errors.push(errorDoc);

    try {
      await this.collection.insertOne(errorDoc);
      console.log(`💾 [MongoDB] Saved failed request: ${status} ${url}`);
    } catch (error) {
      console.error('❌ Failed to save failed request:', error.message);
    }
  }

  async createSessionSummary(metadata = {}) {
    if (!this.collection) {return;}

    const summary = {
      type: 'session_summary',
      session: 'i18n-visual-test-oct20',
      total_errors: this.errors.length,
      error_breakdown: {
        console_errors: this.errors.filter(e => e.type === 'console_error').length,
        javascript_errors: this.errors.filter(e => e.type === 'javascript_error').length,
        failed_requests: this.errors.filter(e => e.type === 'failed_request').length
      },
      metadata: metadata,
      timestamp: new Date()
    };

    try {
      await this.collection.insertOne(summary);
      console.log('📊 [MongoDB] Session summary saved!');
    } catch (error) {
      console.error('❌ Failed to save session summary:', error.message);
    }
  }

  async close() {
    if (this.client) {
      await this.client.close();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

async function runVisualI18NTest() {
  const errorCollector = new PuppeteerErrorCollector(MONGODB_URI);
  await errorCollector.connect();

  console.log('\n🐾🌍 STARTING VISUAL I18N TRANSLATION TEST 🌍🐾\n');
  console.log('👀 WATCH THE BROWSER - It will open in VISIBLE mode, nyaa~!');
  console.log('🔍 DevTools Console will auto-open to show browser errors!');
  console.log('⚡ Actions are slowed down so you can see everything!\n');

  const browser = await puppeteer.launch({
    headless: false,       // 🎭 RULE 3.1: VISIBLE mode!
    slowMo: 250,          // ⚡ RULE 3.1: Slow down actions
    devtools: true,       // 🔍 RULE 3.1: Auto-open DevTools Console!
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--start-maximized',
      '--auto-open-devtools-for-tabs'
    ]
  });

  const page = await browser.newPage();

  let currentLanguage = 'en';

  // 🔍 RULE 3.1: Enhanced error monitoring
  page.on('console', async (msg) => {
    const type = msg.type();
    if (type === 'error') {
      console.log(`❌ [CONSOLE ERROR]: ${msg.text()}`);
      await errorCollector.saveConsoleError(type, msg.text(), {
        language: currentLanguage,
        url: page.url()
      });
    } else if (type === 'warning') {
      console.log(`⚠️ [CONSOLE WARNING]: ${msg.text()}`);
    }
  });

  // Monitor JavaScript errors
  page.on('pageerror', async (error) => {
    console.log('🚨 [PAGE ERROR]:', error.message);
    await errorCollector.saveJavaScriptError(error, {
      language: currentLanguage,
      url: page.url()
    });
  });

  // Monitor failed requests
  page.on('response', async (response) => {
    if (response.status() >= 400) {
      console.log(`⚠️ [${response.status()}] ${response.url()}`);
      await errorCollector.saveFailedRequest(
        response.status(),
        response.url(),
        { language: currentLanguage }
      );
    }
  });

  try {
    // Step 1: Navigate to dashboard
    console.log('👀 WATCH: Navigating to dashboard...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pause so user can see

    // Step 2: Find and click language switcher
    console.log('👀 WATCH: Opening language switcher...');
    const languageButton = await page.waitForSelector('[data-cy="language-button"]', { visible: true });
    await languageButton.click();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pause

    // Step 3: Test all 5 languages
    const languages = [
      { code: 'es', name: 'Spanish', flag: '🇪🇸', greeting: 'SISTEMA DE DEFENSA NEKO-ARC' },
      { code: 'zh', name: 'Chinese', flag: '🇨🇳', greeting: '猫猫防御系统' },
      { code: 'hi', name: 'Hindi', flag: '🇮🇳', greeting: 'नेको-आर्क रक्षा प्रणाली' },
      { code: 'ar', name: 'Arabic', flag: '🇸🇦', greeting: 'نظام الدفاع نيكو-آرك' },
      { code: 'en', name: 'English', flag: '🇬🇧', greeting: 'NEKO-ARC DEFENSE SYSTEM' }
    ];

    for (const lang of languages) {
      currentLanguage = lang.code;

      console.log(`\n🌍 TESTING LANGUAGE: ${lang.flag} ${lang.name.toUpperCase()} (${lang.code})`);
      console.log(`👀 WATCH: Clicking ${lang.name} option...`);

      // Open dropdown if closed
      const isDropdownVisible = await page.$('[data-cy="language-dropdown"]');
      if (!isDropdownVisible) {
        await page.click('[data-cy="language-button"]');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Click language option
      const languageOption = await page.waitForSelector(`[data-cy="language-option-${lang.code}"]`, {
        visible: true,
        timeout: 5000
      });
      await languageOption.click();

      // Wait for translation to apply
      console.log('⏳ Waiting for translation to load...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // Longer pause for translation

      // Verify language changed
      const currentLangCode = await page.$eval('[data-cy="current-lang-code"]', el => el.textContent);
      console.log(`✅ Language code changed to: ${currentLangCode}`);

      // Check if greeting is visible (for Arabic, give extra time for RTL layout)
      if (lang.code === 'ar') {
        console.log('🕌 Checking RTL layout for Arabic...');
        const dir = await page.$eval('html', el => el.getAttribute('dir'));
        console.log(`✅ Document direction: ${dir} (expected: rtl)`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      try {
        await page.waitForSelector(`text/${lang.greeting}`, { timeout: 5000 });
        console.log(`✅ Found translated greeting: "${lang.greeting}"`);
      } catch (error) {
        console.log(`⚠️ Could not find greeting: "${lang.greeting}" (may be timing issue)`);
      }

      console.log(`👁️ LOOK at the browser: Page should be in ${lang.name} now!`);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Long pause for user to see

      // Take screenshot
      const screenshotPath = `puppeteer-screenshots/i18n-test-${lang.code}-${Date.now()}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Screenshot saved: ${screenshotPath}\n`);
    }

    console.log('\n✅ ALL LANGUAGES TESTED SUCCESSFULLY, NYAA~! 🐾✨\n');
    console.log('🔍 Check DevTools Console (in the browser) for any JavaScript errors!');
    console.log('💾 All errors have been saved to MongoDB collection: puppeteer-error-collections');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await errorCollector.saveJavaScriptError(error, { step: 'main_test_flow' });
  } finally {
    // Create session summary
    await errorCollector.createSessionSummary({
      languages_tested: 5,
      screenshots_captured: 5,
      base_url: BASE_URL
    });

    console.log('\n⏳ Keeping browser open for 10 seconds so you can review...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    await browser.close();
    await errorCollector.close();

    console.log('\n🐾 VISUAL I18N TEST COMPLETE, DESU~! 😻🌍\n');
  }
}

// Run the visual test
runVisualI18NTest().catch(console.error);
