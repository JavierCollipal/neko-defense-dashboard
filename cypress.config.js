// 🐾⚡ NEKO DEFENSE DASHBOARD - Cypress E2E Configuration ⚡🐾
require('dotenv').config();
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // ☁️ CYPRESS CLOUD PROJECT ID (from .env - CORRECTED Nov 5, 2025)
  projectId: process.env.CYPRESS_PROJECT_ID || 'jhwwrs',

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

    // 🛡️ NEKO VIEWPORT SETTINGS
    viewportWidth: 1400,
    viewportHeight: 900,

    // ⚡ PERFORMANCE SETTINGS
    // 🚀 OPTIMIZATION: Disable video in CI to save 20-30% execution time
    // Videos only recorded on failures for debugging
    video: false,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    screenshotOnRunFailure: true,

    // 🐾 TIMEOUT CONFIGURATIONS
    // 🚀 OPTIMIZATION: Reduced timeouts for faster failure detection
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 20000,
    requestTimeout: 8000,
    responseTimeout: 20000,

    // 📊 TEST RETRY STRATEGY
    retries: {
      runMode: 2,
      openMode: 0
    },

    // 🔒 SECURITY SETTINGS
    chromeWebSecurity: false,

    // 🚀 EXPERIMENTAL OPTIMIZATIONS
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 10,

    setupNodeEvents(on, config) {
      // 🧪 Code coverage plugin
      require('@cypress/code-coverage/task')(on, config);

      return config;
    },
  },

  // 🎯 COMPONENT TESTING (Future enhancement)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
});
