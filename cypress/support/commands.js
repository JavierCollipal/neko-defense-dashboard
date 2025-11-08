// 🐾⚡ NEKO DEFENSE - Custom Cypress Commands ⚡🐾
// ***********************************************
// LEGENDARY NEKO COMMANDS FOR E2E TESTING, NYAA~!
// ***********************************************

/**
 * 🐾 Custom command to visit the dashboard and wait for it to load
 * 🚀 OPTIMIZED: Uses cy.session() to cache dashboard state and avoid reloading
 * @example cy.visitDashboard()
 */
Cypress.Commands.add('visitDashboard', () => {
  console.log(
    '🐾 [visitDashboard] Loading Neko Defense Dashboard with session caching, nyaa~!'
  );

  // 🚀 OPTIMIZATION: Cache the dashboard session to avoid reloading on every test
  cy.session(
    'dashboard-session',
    () => {
      console.log('🔄 [SESSION] First dashboard load - caching session state');
      cy.visit('/');

      // Wait for app to be fully loaded
      cy.get('.app-header', { timeout: 15000 }).should('be.visible');
      cy.contains('NEKO DEFENSE SYSTEM', { timeout: 10000 }).should(
        'be.visible'
      );

      // Wait for main components to stabilize
      cy.get('.main-container', { timeout: 10000 }).should('be.visible');
    },
    {
      validate: () => {
        // Validate session is still good by checking if dashboard is loaded
        cy.get('.app-header').should('be.visible');
      },
      cacheAcrossSpecs: true,
    }
  );

  // After session restored, just visit to ensure we're on the right page
  cy.visit('/');

  // Quick verification that session is valid
  cy.get('.app-header', { timeout: 5000 }).should('be.visible');

  console.log(
    '✅ [visitDashboard] Dashboard loaded from cache - MAXIMUM SPEED, desu!'
  );
});

/**
 * 🎯 Custom command to select a threat category
 * @param {string} categoryId - Category ID (e.g., 'predators', 'pedophiles')
 * @example cy.selectCategory('predators')
 */
Cypress.Commands.add('selectCategory', (categoryId) => {
  console.log(`🎯 [selectCategory] Switching to category: ${categoryId}`);

  cy.get('.category-switcher')
    .should('be.visible')
    .find('.category-item')
    .contains(new RegExp(categoryId.replace('_', ' '), 'i'))
    .parent()
    .click({ force: true });

  // Verify category is active
  cy.get('.category-item.active').should('exist');

  console.log(`✅ [selectCategory] Category ${categoryId} selected, nyaa~!`);
});

/**
 * 📺 Custom command to navigate to Threat Actors view
 * @example cy.navigateToThreatActors()
 */
Cypress.Commands.add('navigateToThreatActors', () => {
  console.log('📺 [navigateToThreatActors] Opening Threat Actors registry');

  cy.contains('🎯 THREAT ACTORS').click();

  // Verify we're on the Threat Actors page
  cy.contains('THREAT ACTORS REGISTRY').should('be.visible');
  cy.contains('← Back to Dashboard').should('be.visible');

  console.log('✅ [navigateToThreatActors] Threat Actors view loaded, desu!');
});

/**
 * ⚖️ Custom command to navigate to DINA Documentation
 * @example cy.navigateToDinaDocs()
 */
Cypress.Commands.add('navigateToDinaDocs', () => {
  console.log('⚖️ [navigateToDinaDocs] Opening DINA Documentation');

  cy.contains('⚖️ DINA DOCS').click();

  // Verify we're on the DINA Docs page
  cy.contains('DINA INTERNATIONAL HUNT OPERATION').should('be.visible');
  cy.contains('← Back to Dashboard').should('be.visible');

  console.log('✅ [navigateToDinaDocs] DINA Documentation loaded, nyaa~!');
});

/**
 * 🔙 Custom command to navigate back to dashboard
 * @example cy.backToDashboard()
 */
Cypress.Commands.add('backToDashboard', () => {
  console.log('🔙 [backToDashboard] Returning to main dashboard');

  cy.contains('← Back to Dashboard').click();

  // Verify we're back on dashboard
  cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
  cy.get('.main-container').should('be.visible');

  console.log('✅ [backToDashboard] Back to dashboard, desu!');
});

/**
 * 🎨 Custom command to verify ASCII art is displayed
 * @example cy.verifyAsciiArt()
 */
Cypress.Commands.add('verifyAsciiArt', () => {
  console.log('🎨 [verifyAsciiArt] Checking ASCII art display');

  cy.get('.ascii-tv-section').should('be.visible');

  // Check for ASCII TV component and art content
  cy.get('.ascii-tv').should('exist');

  cy.get('pre.ascii-art, .tv-frame').should('exist');

  console.log('✅ [verifyAsciiArt] ASCII art verified, nyaa~!');
});

/**
 * 📊 Custom command to verify stats are displayed
 * @example cy.verifyStats()
 */
Cypress.Commands.add('verifyStats', () => {
  console.log('📊 [verifyStats] Checking defense stats display');

  cy.get('.stats-section').should('be.visible');

  console.log('✅ [verifyStats] Stats verified, desu!');
});

/**
 * 🎯 Custom command to verify threat list is displayed
 * @example cy.verifyThreatList()
 */
Cypress.Commands.add('verifyThreatList', () => {
  console.log('🎯 [verifyThreatList] Checking threat intelligence display');

  cy.get('.threats-section').should('be.visible');

  cy.contains('THREAT INTELLIGENCE').should('be.visible');

  console.log('✅ [verifyThreatList] Threat list verified, nyaa~!');
});

/**
 * 🔍 Custom command to verify all main dashboard components
 * @example cy.verifyDashboardComponents()
 */
Cypress.Commands.add('verifyDashboardComponents', () => {
  console.log(
    '🔍 [verifyDashboardComponents] Verifying all dashboard components'
  );

  // Header
  cy.get('.App-header').should('be.visible');
  cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');

  // Status indicators
  cy.contains('🔴 LIVE').should('be.visible');
  cy.contains('FORTRESS MODE: ACTIVE').should('be.visible');
  cy.contains('KAWAII LEVEL: MAXIMUM').should('be.visible');

  // Main sections
  cy.get('.main-container').should('be.visible');
  cy.get('.sidebar-left').should('be.visible');
  cy.get('.dashboard-grid').should('be.visible');

  // Category switcher
  cy.get('.category-switcher').should('be.visible');

  // Footer
  cy.get('.App-footer').should('be.visible');
  cy.contains('*purrs in defensive excellence*').should('be.visible');

  console.log('✅ [verifyDashboardComponents] All components verified, desu!');
});

/**
 * 🎬 Custom command to stub window.open for TV window tests
 * @example cy.stubWindowOpen()
 */
Cypress.Commands.add('stubWindowOpen', () => {
  console.log('🎬 [stubWindowOpen] Stubbing window.open for pop-up tests');

  cy.window().then((win) => {
    cy.stub(win, 'open').as('windowOpen');
  });

  console.log('✅ [stubWindowOpen] Window.open stubbed, nyaa~!');
});

/**
 * 📺 Custom command to verify TV window was opened
 * @param {string} urlPattern - Pattern to match in the URL
 * @example cy.verifyTvWindowOpened('/tv-window.html')
 */
Cypress.Commands.add('verifyTvWindowOpened', (urlPattern) => {
  console.log(
    `📺 [verifyTvWindowOpened] Verifying TV window with pattern: ${urlPattern}`
  );

  cy.get('@windowOpen').should('be.calledWith', urlPattern);

  console.log('✅ [verifyTvWindowOpened] TV window verified, desu!');
});

/**
 * 🎯 Custom command to select elements by data-cy attribute (BEST PRACTICE!)
 * @param {string} selector - The data-cy attribute value
 * @example cy.getByDataCy('language-button')
 */
Cypress.Commands.add('getByDataCy', (selector) => {
  return cy.get(`[data-cy="${selector}"]`);
});

/**
 * 📝 Custom command to fill form fields
 * @param {Object} formData - Key-value pairs of field names and values
 * @example cy.fillForm({ email: 'test@example.com', password: '123456' })
 */
Cypress.Commands.add('fillForm', (formData) => {
  Object.entries(formData).forEach(([field, value]) => {
    cy.getByDataCy(`${field}-input`).clear().type(value);
  });
});

/**
 * ⏱️ Custom command to wait for API with response verification
 * @param {string} alias - The intercept alias (without @)
 * @example cy.waitForAPI('getThreatActors')
 */
Cypress.Commands.add('waitForAPI', (alias) => {
  cy.wait(`@${alias}`).its('response.statusCode').should('eq', 200);
});

/**
 * ♿ Custom command to check accessibility with custom options
 * @param {string|object} context - Context selector or axe options
 * @param {object} options - Axe options (rules, etc.)
 * @example cy.checkA11y()
 * @example cy.checkA11y('[data-cy="modal"]')
 * @example cy.checkA11y(null, { rules: { 'color-contrast': { enabled: true } } })
 */
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// 🐾 NEKO POWER - Add chainable logging
Cypress.Commands.overwrite('log', (originalFn, message) => {
  console.log(`🐾 [NEKO LOG] ${message}`);
  return originalFn(message);
});

// 🌍⚡ ENHANCED TRANSLATION SYSTEM COMMANDS ⚡🌍
// Custom commands for translation testing, desu~!

/**
 * 🌍 Custom command to wait for translation API responses
 * @example cy.waitForTranslationAPI()
 */
Cypress.Commands.add('waitForTranslationAPI', () => {
  cy.intercept('POST', '/api/translate/**').as('translationAPI');
  cy.wait('@translationAPI');
});

/**
 * 📊 Custom command to verify translation quality
 * @param {number} expectedMinScore - Minimum expected quality score
 * @example cy.verifyTranslationQuality(80)
 */
Cypress.Commands.add('verifyTranslationQuality', (expectedMinScore = 60) => {
  cy.get('.quality-score')
    .should('be.visible')
    .then(($el) => {
      const scoreText = $el.text();
      const score = parseInt(scoreText.match(/\d+/)[0]);
      expect(score).to.be.at.least(expectedMinScore);
    });
});

/**
 * 🌐 Custom command to select language safely
 * @param {string} languageCode - Language code (e.g., 'es', 'fr', 'ja')
 * @example cy.selectLanguage('es')
 */
Cypress.Commands.add('selectLanguage', (languageCode) => {
  console.log(`🌐 [selectLanguage] Switching to language: ${languageCode}`);

  // Open language selector (handle both desktop and mobile)
  cy.get(
    '.language-selector-container .current-selection, [data-testid="language-selector"] .current-selection'
  ).click();

  // Select specific language
  cy.get(`[data-language-code="${languageCode}"]`).click();

  // Verify selection (check for language name in current selection)
  cy.get(
    '.language-selector-container, [data-testid="language-selector"]'
  ).should('be.visible');

  console.log(`✅ [selectLanguage] Language ${languageCode} selected, nyaa~!`);
});

/**
 * 🧹 Custom command to clear all translation form fields
 * @example cy.clearTranslationForm()
 */
Cypress.Commands.add('clearTranslationForm', () => {
  console.log('🧹 [clearTranslationForm] Clearing translation form');

  cy.get('#translate-text').clear();
  cy.get('#source-language').select('auto');
  cy.get('#target-language').select('en');

  console.log('✅ [clearTranslationForm] Form cleared, desu!');
});

/**
 * 🔄 Custom command to perform standard translation test
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code
 * @example cy.performStandardTranslation('Hello world', 'es', 'en')
 */
Cypress.Commands.add(
  'performStandardTranslation',
  (text, targetLang = 'es', sourceLang = 'en') => {
    console.log(
      `🔄 [performStandardTranslation] Translating "${text}" from ${sourceLang} to ${targetLang}`
    );

    cy.clearTranslationForm();
    cy.get('#translate-text').type(text);
    cy.get('#source-language').select(sourceLang);
    cy.get('#target-language').select(targetLang);
    cy.get('#translate-button').click();
    cy.waitForTranslationAPI();

    console.log(
      '✅ [performStandardTranslation] Translation completed, nyaa~!'
    );
  }
);

/**
 * 🔧 Custom command to verify provider health
 * @param {string} providerName - Provider name to check
 * @example cy.verifyProviderHealth('Google Translate')
 */
Cypress.Commands.add(
  'verifyProviderHealth',
  (providerName = 'Google Translate') => {
    console.log(`🔧 [verifyProviderHealth] Checking ${providerName} status`);

    cy.get('.provider-card')
      .contains(providerName)
      .within(() => {
        cy.get('.provider-health').should('exist');
        cy.get('.provider-status')
          .should('contain.text', 'healthy')
          .or('contain.text', 'online');
      });

    console.log(`✅ [verifyProviderHealth] ${providerName} is healthy, desu!`);
  }
);

/**
 * 📋 Custom command to switch dashboard tabs
 * @param {string} tabName - Name of the tab to switch to
 * @example cy.switchToDashboardTab('Provider Status')
 */
Cypress.Commands.add('switchToDashboardTab', (tabName) => {
  console.log(`📋 [switchToDashboardTab] Switching to tab: ${tabName}`);

  cy.get('.dashboard-tabs').contains(tabName).click();
  cy.get('.tab-button.active').should('contain', tabName);
  cy.wait(500); // Allow tab content to load

  console.log(`✅ [switchToDashboardTab] Tab ${tabName} active, nyaa~!`);
});

/**
 * 💾 Custom command to verify cache statistics
 * @example cy.verifyCacheStats()
 */
Cypress.Commands.add('verifyCacheStats', () => {
  console.log('💾 [verifyCacheStats] Verifying cache statistics');

  cy.get('.cache-metrics').within(() => {
    cy.contains('Total Entries').should('exist');
    cy.contains('Hit Rate').should('exist');
    cy.get('.cache-stat-value').should('exist');
  });

  console.log('✅ [verifyCacheStats] Cache stats verified, desu!');
});

/**
 * ⚠️ Custom command to handle confirmation dialogs
 * @param {string} action - 'confirm' or 'cancel'
 * @example cy.confirmDialog('confirm')
 */
Cypress.Commands.add('confirmDialog', (action = 'confirm') => {
  console.log(`⚠️ [confirmDialog] Handling dialog with action: ${action}`);

  cy.get('.confirmation-dialog').should('be.visible');
  if (action === 'confirm') {
    cy.get('#confirm-clear, .confirm-button').click();
  } else {
    cy.get('#confirm-cancel, .cancel-button').click();
  }

  console.log(`✅ [confirmDialog] Dialog ${action}ed, nyaa~!`);
});

/**
 * 📱 Custom command to set responsive viewport
 * @param {string} device - Device type: 'mobile', 'tablet', 'desktop', 'large'
 * @example cy.setResponsiveViewport('mobile')
 */
Cypress.Commands.add('setResponsiveViewport', (device) => {
  console.log(`📱 [setResponsiveViewport] Setting viewport to: ${device}`);

  const viewports = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1200, 800],
    large: [1920, 1080],
  };

  const [width, height] = viewports[device] || viewports.desktop;
  cy.viewport(width, height);

  console.log(
    `✅ [setResponsiveViewport] Viewport set to ${width}x${height}, desu!`
  );
});

/**
 * ⏳ Custom command to verify loading states
 * @param {string} selector - Loading element selector
 * @param {boolean} shouldBeLoading - Whether element should be loading
 * @example cy.verifyLoadingState('.translation-loading', true)
 */
Cypress.Commands.add(
  'verifyLoadingState',
  (selector, shouldBeLoading = true) => {
    console.log(
      `⏳ [verifyLoadingState] Checking loading state for ${selector}`
    );

    if (shouldBeLoading) {
      cy.get(selector).should('be.visible');
    } else {
      cy.get(selector).should('not.exist');
    }

    console.log(`✅ [verifyLoadingState] Loading state verified, nyaa~!`);
  }
);

/**
 * 📦 Custom command to perform bulk translation
 * @param {Array} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @example cy.performBulkTranslation(['Hello', 'World'], 'es')
 */
Cypress.Commands.add('performBulkTranslation', (texts, targetLang = 'es') => {
  console.log(
    `📦 [performBulkTranslation] Bulk translating ${texts.length} texts to ${targetLang}`
  );

  cy.get('#translation-mode-bulk').click();

  texts.forEach((text, index) => {
    if (index > 0) {
      cy.get('#add-text-button').click();
    }
    cy.get(`#bulk-text-${index}`).type(text);
  });

  cy.get('#bulk-target-language').select(targetLang);
  cy.get('#bulk-translate-button').click();

  console.log('✅ [performBulkTranslation] Bulk translation completed, desu!');
});

/**
 * ❌ Custom command to verify error messages
 * @param {string} expectedMessage - Expected error message
 * @example cy.verifyErrorMessage('Translation failed')
 */
Cypress.Commands.add('verifyErrorMessage', (expectedMessage) => {
  console.log(`❌ [verifyErrorMessage] Checking for error: ${expectedMessage}`);

  cy.get('.error-message, .alert-error').should('be.visible');
  if (expectedMessage) {
    cy.get('.error-message, .alert-error').should('contain', expectedMessage);
  }

  console.log('✅ [verifyErrorMessage] Error message verified, nyaa~!');
});

/**
 * ✅ Custom command to verify success messages
 * @param {string} expectedMessage - Expected success message
 * @example cy.verifySuccessMessage('Translation completed')
 */
Cypress.Commands.add('verifySuccessMessage', (expectedMessage) => {
  console.log(
    `✅ [verifySuccessMessage] Checking for success: ${expectedMessage}`
  );

  cy.get('.success-message, .alert-success').should('be.visible');
  if (expectedMessage) {
    cy.get('.success-message, .alert-success').should(
      'contain',
      expectedMessage
    );
  }

  console.log('✅ [verifySuccessMessage] Success message verified, desu!');
});

/**
 * 🌱 Custom command to seed translation test data
 * @example cy.seedTranslationData()
 */
Cypress.Commands.add('seedTranslationData', () => {
  console.log('🌱 [seedTranslationData] Seeding test translation data');

  // Perform some translations to seed cache and metrics
  const testTranslations = [
    { text: 'Hello world', target: 'es' },
    { text: 'Good morning', target: 'fr' },
    { text: 'Thank you', target: 'de' },
  ];

  testTranslations.forEach(({ text, target }) => {
    cy.request('POST', '/api/translate/enhanced', {
      text,
      targetLang: target,
      sourceLang: 'en',
    });
  });

  console.log('✅ [seedTranslationData] Test data seeded, nyaa~!');
});

/**
 * 🧹 Custom command to clean test data
 * @example cy.cleanTestData()
 */
Cypress.Commands.add('cleanTestData', () => {
  console.log('🧹 [cleanTestData] Cleaning test data');

  // Clear cache and test data
  cy.request({
    method: 'DELETE',
    url: '/api/translate/cache/clear',
    failOnStatusCode: false,
  }).then(() => {
    console.log('✅ [cleanTestData] Test data cleaned, desu!');
  });
});

/**
 * 🔗 Custom command to verify database connection
 * @example cy.verifyDatabaseConnection()
 */
Cypress.Commands.add('verifyDatabaseConnection', () => {
  console.log('🔗 [verifyDatabaseConnection] Checking database connection');

  cy.request({
    url: '/api/health/database',
    failOnStatusCode: false,
  }).then((response) => {
    expect(response.status).to.eq(200);
    console.log('✅ [verifyDatabaseConnection] Database connected, nyaa~!');
  });
});

/**
 * 🔍 Custom command to debug current state
 * @param {string} label - Debug label
 * @example cy.debugState('After translation')
 */
Cypress.Commands.add('debugState', (label = 'Debug') => {
  console.log(`🔍 [debugState] ${label} - Capturing current state`);

  cy.url().then((url) => console.log(`URL: ${url}`));
  cy.get('body').then(($body) => {
    console.log(`Body classes: ${$body.attr('class')}`);
  });

  console.log(`✅ [debugState] State captured for: ${label}`);
});

/**
 * ⏱️ Custom command to handle async operations
 * @param {number} timeout - Wait timeout in ms
 * @example cy.waitForAsync(3000)
 */
Cypress.Commands.add('waitForAsync', (timeout = 5000) => {
  console.log(`⏱️ [waitForAsync] Waiting for async operations (${timeout}ms)`);

  cy.get('body').should('not.have.class', 'loading');
  cy.wait(timeout);

  console.log('✅ [waitForAsync] Async operations completed, desu!');
});

/**
 * 🌍 Custom command to navigate to translation dashboard
 * @example cy.navigateToTranslationDashboard()
 */
Cypress.Commands.add('navigateToTranslationDashboard', () => {
  console.log(
    '🌍 [navigateToTranslationDashboard] Navigating to translation dashboard'
  );

  cy.visit('/translation');
  cy.wait(1000);

  // Verify dashboard loads
  cy.get('.translation-dashboard').should('be.visible');
  cy.get('.dashboard-header').should('contain', 'Enhanced Translation System');

  console.log('✅ [navigateToTranslationDashboard] Dashboard loaded, nyaa~!');
});

// Enhanced assertion for translation results
chai.Assertion.addMethod('validTranslation', function () {
  const obj = this._obj;

  new chai.Assertion(obj).to.be.a('string');
  new chai.Assertion(obj.length).to.be.greaterThan(0);
  new chai.Assertion(obj).to.not.equal('[object Object]');
  new chai.Assertion(obj).to.not.contain('undefined');
});

console.log(
  '🐾⚡ NEKO CUSTOM COMMANDS LOADED - LEGENDARY MODE ACTIVATED! ⚡🐾'
);
console.log('🌍✨ ENHANCED TRANSLATION COMMANDS LOADED - MAXIMUM POWER! ✨🌍');
