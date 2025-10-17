// 🐾⚡ NEKO DEFENSE E2E - Support File ⚡🐾
// Import commands
import './commands';

// Import code coverage support
import '@cypress/code-coverage/support';

// Import real events plugin
import 'cypress-real-events';

// Import cypress-axe for accessibility testing
import 'cypress-axe';

// 🛡️ NEKO BEFORE HOOKS
beforeEach(() => {
  console.log('🐾 [NEKO E2E] Test starting, nyaa~!');

  // Intercept API calls to prevent real backend dependencies
  cy.intercept('GET', '**/api/ascii-art', {
    fixture: 'ascii-art.json'
  }).as('getAsciiArt');

  // FIX: App actually calls /api/threat-counts, not /api/stats
  cy.intercept('GET', '**/api/threat-counts', {
    fixture: 'threat-counts.json'
  }).as('getThreatCounts');

  // DEPRECATED: App doesn't use this endpoint anymore
  // cy.intercept('GET', '**/api/threats/summary', {
  //   fixture: 'threats-summary.json'
  // }).as('getThreatsSummary');

  // Intercept threat actors endpoint with category filtering, desu! 🎯
  cy.intercept('GET', '**/api/threat-actors', {
    fixture: 'threat-actors-all.json'
  }).as('getThreatActors');

  cy.intercept('GET', '**/api/threat-actors?category=all', {
    fixture: 'threat-actors-all.json'
  }).as('getThreatActorsAll');

  cy.intercept('GET', '**/api/threat-actors?category=predators', {
    fixture: 'threat-actors-predators.json'
  }).as('getThreatActorsPredators');

  // Other categories return filtered results
  cy.intercept('GET', '**/api/threat-actors?category=*', {
    fixture: 'threat-actors-all.json'
  }).as('getThreatActorsFiltered');
});

// 🧹 NEKO AFTER HOOKS
afterEach(() => {
  console.log('🐾 [NEKO E2E] Test complete, desu!');
});

// 🚫 NEKO ERROR HANDLING
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing tests on uncaught exceptions
  // This is useful for pop-up window tests
  console.log('🐾 [NEKO E2E] Caught exception:', err.message);
  return false;
});
