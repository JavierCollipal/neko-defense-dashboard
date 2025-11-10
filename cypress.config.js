const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // ☁️ CYPRESS CLOUD PROJECT ID (Rule 1.0)
  projectId: '9xzw4h',

  e2e: {
    // Base URL for tests
    baseUrl: 'http://localhost:3000',

    // Test file location
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    // Support file
    supportFile: 'cypress/support/e2e.js',

    // Screenshot/video settings
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,

    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,

    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,

    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Browser settings
    chromeWebSecurity: false,

    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
  },

  // Component testing (if needed)
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js',
  },
});
