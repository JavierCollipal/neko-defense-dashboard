#!/usr/bin/env ts-node

import puppeteer, { Browser, Page } from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';

class SimpleDashboardDemo {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private screenshotDir: string;

  constructor() {
    const sessionId = 'dashboard-demo-' + new Date().toISOString().split('T')[0];
    this.screenshotDir = path.join(process.cwd(), 'screenshots', sessionId);
  }

  async launchBrowser(): Promise<void> {
    console.log('\n🎭 LAUNCHING VISUAL BROWSER...');
    console.log('👀 WATCH the browser window appear!');
    console.log('🔍 DevTools Console will show any errors!');
    console.log('');

    this.browser = await puppeteer.launch({
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

    this.page = await this.browser.newPage();

    this.page.on('console', (msg) => {
      const type = msg.type();
      if (type === 'error') {
        console.log('❌ [BROWSER ERROR]: ' + msg.text());
      } else if (type === 'warn') {
        console.log('⚠️  [BROWSER WARNING]: ' + msg.text());
      }
    });

    if (!fs.existsSync(this.screenshotDir)) {
      fs.mkdirSync(this.screenshotDir, { recursive: true });
      console.log('✅ Screenshot directory: ' + this.screenshotDir);
    }

    await this.delay(2000);
    console.log('✅ Browser launched with DevTools open!');
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async captureScreenshot(routeName: string): Promise<void> {
    if (!this.page) return;

    const filename = routeName.replace(/\//g, '-') + '.png';
    const filepath = path.join(this.screenshotDir, filename);

    await this.page.screenshot({
      path: filepath as `${string}.png`,
      fullPage: true
    });
    console.log('📸 Screenshot: ' + filename);
  }

  async demonstrateRoute(route: string, routeName: string): Promise<void> {
    if (!this.page) return;

    const separator = '='.repeat(60);
    console.log('\n' + separator);
    console.log('👁️  DEMONSTRATING: ' + routeName);
    console.log('🔗 Route: ' + route);
    console.log('👀 WATCH the browser window!');
    console.log(separator);

    await this.page.goto('http://localhost:3000' + route, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await this.delay(3000);

    console.log('📸 Capturing screenshot...');
    await this.captureScreenshot(routeName);

    console.log('🖱️  Scrolling down... WATCH!');
    await this.page.evaluate('window.scrollTo(0, 500)');
    await this.delay(2000);

    await this.page.evaluate('window.scrollTo(0, 1000)');
    await this.delay(2000);

    await this.page.evaluate('window.scrollTo(0, 0)');
    await this.delay(1000);

    console.log('✅ ' + routeName + ' demonstrated!');
  }

  async runFullDemonstration(): Promise<void> {
    const routes = [
      { path: '/', name: 'Home-Overview' },
      { path: '/threats', name: 'Threat-Actors' },
      { path: '/confessions', name: 'Confessions' },
      { path: '/dina', name: 'DINA-Intelligence' },
      { path: '/family-tracker', name: 'Family-Tracker' },
      { path: '/valech', name: 'Valech-Commission' },
      { path: '/youtube-generator', name: 'YouTube-Generator' },
      { path: '/rag', name: 'RAG-System' }
    ];

    const separator = '='.repeat(60);
    console.log('\n🎬 NEKO DEFENSE DASHBOARD - FULL VISUAL TOUR');
    console.log('📊 Total routes: ' + routes.length);
    console.log(separator + '\n');

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const progress = '[' + (i + 1) + '/' + routes.length + ']';
      console.log('\n' + progress + ' Starting ' + route.name + '...');
      await this.demonstrateRoute(route.path, route.name);
    }

    console.log('\n' + separator);
    console.log('✅ FULL DEMONSTRATION COMPLETE!');
    console.log('📸 Screenshots saved to: ' + this.screenshotDir);
    console.log(separator);
  }

  async close(): Promise<void> {
    if (this.browser) {
      console.log('\n👋 Browser will stay open for 60 seconds...');
      console.log('🖱️  LOOK AT YOUR SCREEN NOW!');
      console.log('(You can close it manually anytime!)');
      await this.delay(60000);
      await this.browser.close();
    }
    console.log('✅ Demo complete, nyaa~! 🐾');
  }
}

async function main(): Promise<void> {
  console.log('🐾 NEKO-ARC VISUAL DASHBOARD DEMONSTRATION');
  console.log('📺 Rule 3.1: Puppeteer Visual Demonstration Protocol');
  console.log('');

  const demo = new SimpleDashboardDemo();

  try {
    await demo.launchBrowser();
    await demo.runFullDemonstration();
  } catch (error) {
    console.error('❌ Demonstration failed:', error);
  } finally {
    await demo.close();
  }
}

main();
