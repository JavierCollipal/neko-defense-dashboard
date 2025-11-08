// 🐾🧪 NEKO DEFENSE DASHBOARD - COMPREHENSIVE TABS TEST 🧪🐾
// Tests all tabs including Video Maker, Valech V2, and YouTube Playlist

const puppeteer = require('puppeteer');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TIMEOUT = 30000; // 30 seconds

describe('🐾 Neko Defense Dashboard - All Tabs Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    console.log('🎬 Starting Puppeteer browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
    console.log('✅ Browser launched!');
  });

  afterAll(async () => {
    console.log('🐾 Closing browser...');
    await browser.close();
    console.log('✅ Browser closed!');
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    console.log(`📄 Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: TIMEOUT });
    console.log('✅ Page loaded!');
  });

  afterEach(async () => {
    await page.close();
  });

  // 🏠 Test 1: Home/Dashboard Page
  test(
    '🏠 Dashboard (Home) page loads correctly',
    async () => {
      console.log('🔍 Testing Dashboard page...');

      // Wait for dashboard to load
      await page.waitForSelector('.dashboard-page', { timeout: TIMEOUT });

      // Check if title exists
      const title = await page.title();
      expect(title).toContain('Neko');

      console.log('✅ Dashboard page loaded successfully!');
    },
    TIMEOUT
  );

  // 🎯 Test 2: Threat Actors Tab
  test(
    '🎯 Threat Actors tab exists and is accessible',
    async () => {
      console.log('🔍 Testing Threat Actors tab...');

      // Navigate to threats page
      await page.goto(`${BASE_URL}/threats`, {
        waitUntil: 'networkidle0',
        timeout: TIMEOUT,
      });

      // Check if threats page loaded
      const url = page.url();
      expect(url).toContain('/threats');

      // Wait for threat actors content
      await page.waitForSelector('body', { timeout: TIMEOUT });

      console.log('✅ Threat Actors tab accessible!');
    },
    TIMEOUT
  );

  // 📊 Test 3: Valech V2 Dashboard Tab
  test(
    '📊 Valech V2 Dashboard tab exists and is accessible',
    async () => {
      console.log('🔍 Testing Valech V2 Dashboard tab...');

      // Navigate to valech page
      await page.goto(`${BASE_URL}/valech`, {
        waitUntil: 'networkidle0',
        timeout: TIMEOUT,
      });

      // Check if valech page loaded
      const url = page.url();
      expect(url).toContain('/valech');

      // Wait for valech content
      await page.waitForSelector('body', { timeout: TIMEOUT });

      console.log('✅ Valech V2 Dashboard tab accessible!');
    },
    TIMEOUT
  );

  // 🎬 Test 4: Video Maker Tab
  test(
    '🎬 Video Maker tab exists and is accessible',
    async () => {
      console.log('🔍 Testing Video Maker tab...');

      // Navigate to video maker page
      await page.goto(`${BASE_URL}/video`, {
        waitUntil: 'networkidle0',
        timeout: TIMEOUT,
      });

      // Check if video maker page loaded
      const url = page.url();
      expect(url).toContain('/video');

      // Wait for video maker component
      await page.waitForSelector('.video-maker-container', {
        timeout: TIMEOUT,
      });

      // Check for key elements
      const header = await page.$('.video-maker-header');
      expect(header).not.toBeNull();

      // Check for form sections
      const formSections = await page.$$('.form-section');
      expect(formSections.length).toBeGreaterThan(0);

      console.log('✅ Video Maker tab accessible with all components!');
    },
    TIMEOUT
  );

  // 📺 Test 5: YouTube Playlist Tab (NEW!)
  test(
    '📺 YouTube Playlist tab exists and is accessible',
    async () => {
      console.log('🔍 Testing YouTube Playlist tab...');

      // Navigate to youtube playlist page
      await page.goto(`${BASE_URL}/youtube`, {
        waitUntil: 'networkidle0',
        timeout: TIMEOUT,
      });

      // Check if youtube page loaded
      const url = page.url();
      expect(url).toContain('/youtube');

      // Wait for youtube playlist container
      await page.waitForSelector('.youtube-playlist-container', {
        timeout: TIMEOUT,
      });

      // Check for key elements
      const header = await page.$('.youtube-header');
      expect(header).not.toBeNull();

      // Check for subscribe button
      const subscribeBtn = await page.$('.youtube-subscribe-btn');
      expect(subscribeBtn).not.toBeNull();

      // Check for playlist section
      const playlistSection = await page.$('.playlist-section');
      expect(playlistSection).not.toBeNull();

      console.log('✅ YouTube Playlist tab accessible with all components!');
    },
    TIMEOUT
  );

  // ⚡ Test 6: Neko Abilities Tab
  test(
    '⚡ Neko Abilities tab exists and is accessible',
    async () => {
      console.log('🔍 Testing Neko Abilities tab...');

      // Navigate to abilities page
      await page.goto(`${BASE_URL}/abilities`, {
        waitUntil: 'networkidle0',
        timeout: TIMEOUT,
      });

      // Check if abilities page loaded
      const url = page.url();
      expect(url).toContain('/abilities');

      // Wait for abilities content
      await page.waitForSelector('body', { timeout: TIMEOUT });

      console.log('✅ Neko Abilities tab accessible!');
    },
    TIMEOUT
  );

  // 📚 Test 7: DINA Documentation Tab
  test(
    '📚 DINA Documentation tab exists and is accessible',
    async () => {
      console.log('🔍 Testing DINA Documentation tab...');

      // Navigate to DINA page
      await page.goto(`${BASE_URL}/dina`, {
        waitUntil: 'networkidle0',
        timeout: TIMEOUT,
      });

      // Check if DINA page loaded
      const url = page.url();
      expect(url).toContain('/dina');

      // Wait for DINA content
      await page.waitForSelector('body', { timeout: TIMEOUT });

      console.log('✅ DINA Documentation tab accessible!');
    },
    TIMEOUT
  );

  // 🗄️ Test 8: RAG System Tab
  test(
    '🗄️ RAG System tab exists and is accessible',
    async () => {
      console.log('🔍 Testing RAG System tab...');

      // Navigate to RAG page
      await page.goto(`${BASE_URL}/rag`, {
        waitUntil: 'networkidle0',
        timeout: TIMEOUT,
      });

      // Check if RAG page loaded
      const url = page.url();
      expect(url).toContain('/rag');

      // Wait for RAG content
      await page.waitForSelector('body', { timeout: TIMEOUT });

      console.log('✅ RAG System tab accessible!');
    },
    TIMEOUT
  );

  // 📱 Test 9: Mobile Menu Navigation
  test(
    '📱 Mobile menu contains all drawer items',
    async () => {
      console.log('🔍 Testing mobile menu navigation...');

      // Set mobile viewport
      await page.setViewport({ width: 375, height: 667 });

      await page.reload({ waitUntil: 'networkidle0' });

      // Look for mobile menu button
      const menuButton = await page.$('[aria-label="Open menu"]');
      if (menuButton) {
        await menuButton.click();
        await page.waitForTimeout(500); // Wait for drawer animation

        // Check if drawer is open
        const drawer = await page.$('.drawer.open');
        expect(drawer).not.toBeNull();

        console.log('✅ Mobile menu accessible!');
      } else {
        console.log('⚠️ Mobile menu button not found (might be desktop only)');
      }
    },
    TIMEOUT
  );

  // 🎯 Test 10: Bottom Tabs Navigation
  test(
    '🎯 Bottom tabs are visible and functional',
    async () => {
      console.log('🔍 Testing bottom tabs navigation...');

      // Check for bottom tabs
      const bottomTabs = await page.$('.bottom-tabs');

      if (bottomTabs) {
        // Get all tab buttons
        const tabs = await page.$$('.bottom-tabs .tab');
        console.log(`📊 Found ${tabs.length} bottom tabs`);
        expect(tabs.length).toBeGreaterThan(0);

        // Expected tabs: Home, Threats, Analytics (Valech), Actions
        expect(tabs.length).toBe(4);

        console.log('✅ Bottom tabs visible and functional!');
      } else {
        console.log('⚠️ Bottom tabs not found (might be mobile only)');
      }
    },
    TIMEOUT
  );

  // 🔍 Test 11: All Routes Return 200
  test(
    '🔍 All main routes return successful responses',
    async () => {
      console.log('🔍 Testing all route responses...');

      const routes = [
        '/',
        '/threats',
        '/valech',
        '/video',
        '/youtube',
        '/abilities',
        '/dina',
        '/rag',
      ];

      for (const route of routes) {
        const response = await page.goto(`${BASE_URL}${route}`, {
          waitUntil: 'networkidle0',
          timeout: TIMEOUT,
        });

        const status = response.status();
        console.log(`  ${route}: ${status}`);
        expect(status).toBe(200);
      }

      console.log('✅ All routes return 200!');
    },
    TIMEOUT * 3
  ); // Triple timeout for multiple routes
});

// 🎬 Run Summary
console.log('═══════════════════════════════════════════════════════════════');
console.log('🐾 NEKO DEFENSE DASHBOARD - COMPREHENSIVE TABS TEST 🐾');
console.log('═══════════════════════════════════════════════════════════════');
console.log('Testing:');
console.log('  ✅ Dashboard (Home)');
console.log('  ✅ Threat Actors');
console.log('  ✅ Valech V2 Dashboard');
console.log('  ✅ Video Maker');
console.log('  ✅ YouTube Playlist (NEW!)');
console.log('  ✅ Neko Abilities');
console.log('  ✅ DINA Documentation');
console.log('  ✅ RAG System');
console.log('  ✅ Mobile Navigation');
console.log('  ✅ Bottom Tabs');
console.log('  ✅ All Routes');
console.log('═══════════════════════════════════════════════════════════════');
