// 🐾⚡ NEKO DEFENSE - Custom Cypress Commands ⚡🐾
// ***********************************************
// LEGENDARY NEKO COMMANDS FOR E2E TESTING, NYAA~!
// ***********************************************

/**
 * 🐾 Custom command to visit the dashboard and wait for it to load
 * @example cy.visitDashboard()
 */
Cypress.Commands.add('visitDashboard', () => {
  console.log('🐾 [visitDashboard] Loading Neko Defense Dashboard, nyaa~!');

  cy.visit('/');

  // Wait for API calls to complete
  cy.wait('@getAsciiArt');
  cy.wait('@getStats');
  cy.wait('@getThreatsSummary');

  // Verify dashboard loaded
  cy.get('.App-header').should('be.visible');
  cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');

  console.log('✅ [visitDashboard] Dashboard loaded successfully, desu!');
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
  cy.get('.category-item.active')
    .should('exist');

  console.log(`✅ [selectCategory] Category ${categoryId} selected, nyaa~!`);
});

/**
 * 📺 Custom command to navigate to Threat Actors view
 * @example cy.navigateToThreatActors()
 */
Cypress.Commands.add('navigateToThreatActors', () => {
  console.log('📺 [navigateToThreatActors] Opening Threat Actors registry');

  cy.contains('🎯 THREAT ACTORS')
    .click();

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

  cy.contains('⚖️ DINA DOCS')
    .click();

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

  cy.contains('← Back to Dashboard')
    .click();

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

  cy.get('.ascii-tv-section')
    .should('be.visible');

  // Check for ASCII TV component and art content
  cy.get('.ascii-tv')
    .should('exist');

  cy.get('pre.ascii-art, .tv-frame')
    .should('exist');

  console.log('✅ [verifyAsciiArt] ASCII art verified, nyaa~!');
});

/**
 * 📊 Custom command to verify stats are displayed
 * @example cy.verifyStats()
 */
Cypress.Commands.add('verifyStats', () => {
  console.log('📊 [verifyStats] Checking defense stats display');

  cy.get('.stats-section')
    .should('be.visible');

  console.log('✅ [verifyStats] Stats verified, desu!');
});

/**
 * 🎯 Custom command to verify threat list is displayed
 * @example cy.verifyThreatList()
 */
Cypress.Commands.add('verifyThreatList', () => {
  console.log('🎯 [verifyThreatList] Checking threat intelligence display');

  cy.get('.threats-section')
    .should('be.visible');

  cy.contains('THREAT INTELLIGENCE').should('be.visible');

  console.log('✅ [verifyThreatList] Threat list verified, nyaa~!');
});

/**
 * 🔍 Custom command to verify all main dashboard components
 * @example cy.verifyDashboardComponents()
 */
Cypress.Commands.add('verifyDashboardComponents', () => {
  console.log('🔍 [verifyDashboardComponents] Verifying all dashboard components');

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
  console.log(`📺 [verifyTvWindowOpened] Verifying TV window with pattern: ${urlPattern}`);

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

console.log('🐾⚡ NEKO CUSTOM COMMANDS LOADED - LEGENDARY MODE ACTIVATED! ⚡🐾');
