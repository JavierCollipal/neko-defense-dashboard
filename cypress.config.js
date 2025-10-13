// 🐾⚡ NEKO DEFENSE DASHBOARD - Cypress E2E Configuration ⚡🐾
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

    // 🛡️ NEKO VIEWPORT SETTINGS
    viewportWidth: 1400,
    viewportHeight: 900,

    // ⚡ PERFORMANCE SETTINGS
    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',

    // 🐾 TIMEOUT CONFIGURATIONS
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 10000,

    // 📊 TEST RETRY STRATEGY
    retries: {
      runMode: 2,
      openMode: 0
    },

    // 🔒 SECURITY SETTINGS
    chromeWebSecurity: false,

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
