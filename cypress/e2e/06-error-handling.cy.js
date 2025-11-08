// 🐾⚡ E2E TEST: Error Handling & Edge Cases ⚡🐾
describe('🛡️ Error Handling & Edge Cases', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting error handling test, nyaa~!');
  });

  describe('🚫 API Error Scenarios', () => {
    it('should handle ASCII art API failure gracefully', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        statusCode: 500,
        body: { success: false, error: 'Internal server error' }
      }).as('getAsciiArtError');

      cy.intercept('GET', '**/api/stats', {
        fixture: 'stats.json'
      }).as('getStats');

      cy.intercept('GET', '**/api/threats/summary', {
        fixture: 'threats-summary.json'
      }).as('getThreatsSummary');

      cy.visit('/');

      // Should still render the page
      cy.get('.App-header').should('be.visible');
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
    });

    it('should handle stats API failure gracefully', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        fixture: 'ascii-art.json'
      }).as('getAsciiArt');

      cy.intercept('GET', '**/api/stats', {
        statusCode: 500,
        body: { success: false, error: 'Stats unavailable' }
      }).as('getStatsError');

      cy.intercept('GET', '**/api/threats/summary', {
        fixture: 'threats-summary.json'
      }).as('getThreatsSummary');

      cy.visit('/');

      // Should still render the page
      cy.get('.App-header').should('be.visible');
      cy.get('.stats-section').should('exist');
    });

    it('should handle threats summary API failure gracefully', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        fixture: 'ascii-art.json'
      }).as('getAsciiArt');

      cy.intercept('GET', '**/api/stats', {
        fixture: 'stats.json'
      }).as('getStats');

      cy.intercept('GET', '**/api/threats/summary', {
        statusCode: 404,
        body: { success: false, error: 'Not found' }
      }).as('getThreatsSummaryError');

      cy.visit('/');

      // Should still render the page
      cy.get('.App-header').should('be.visible');
      cy.get('.threats-section').should('exist');
    });

    it('should handle all APIs failing simultaneously', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        statusCode: 500,
        body: { success: false }
      }).as('getAsciiArtError');

      cy.intercept('GET', '**/api/stats', {
        statusCode: 500,
        body: { success: false }
      }).as('getStatsError');

      cy.intercept('GET', '**/api/threats/summary', {
        statusCode: 500,
        body: { success: false }
      }).as('getThreatsSummaryError');

      cy.visit('/');

      // App should still render with error states
      cy.get('.App-header').should('be.visible');
      cy.contains('NEKO-ARC DEFENSE SYSTEM').should('be.visible');
    });

    it('should handle network timeout', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        delay: 30000,
        fixture: 'ascii-art.json'
      }).as('getAsciiArtDelay');

      cy.intercept('GET', '**/api/stats', {
        fixture: 'stats.json'
      }).as('getStats');

      cy.intercept('GET', '**/api/threats/summary', {
        fixture: 'threats-summary.json'
      }).as('getThreatsSummary');

      cy.visit('/');

      // Should show loading state
      cy.contains('Loading, nyaa~! 🐾', { timeout: 2000 }).should('exist');
    });
  });

  describe('📊 Empty Data Scenarios', () => {
    it('should handle empty ASCII art array', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        body: { success: true, data: [] }
      }).as('getAsciiArtEmpty');

      cy.intercept('GET', '**/api/stats', {
        fixture: 'stats.json'
      }).as('getStats');

      cy.intercept('GET', '**/api/threats/summary', {
        fixture: 'threats-summary.json'
      }).as('getThreatsSummary');

      cy.visit('/');
      cy.wait('@getAsciiArtEmpty');

      // Should still render
      cy.get('.ascii-tv-section').should('be.visible');
    });

    it('should handle null stats data', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        fixture: 'ascii-art.json'
      }).as('getAsciiArt');

      cy.intercept('GET', '**/api/stats', {
        body: { success: true, data: null }
      }).as('getStatsNull');

      cy.intercept('GET', '**/api/threats/summary', {
        fixture: 'threats-summary.json'
      }).as('getThreatsSummary');

      cy.visit('/');
      cy.wait('@getStatsNull');

      // Stats section should handle null gracefully
      cy.get('.stats-section').should('exist');
    });

    it('should handle empty threat summary', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        fixture: 'ascii-art.json'
      }).as('getAsciiArt');

      cy.intercept('GET', '**/api/stats', {
        fixture: 'stats.json'
      }).as('getStats');

      cy.intercept('GET', '**/api/threats/summary', {
        body: {
          success: true,
          data: {
            total_collections: 0,
            status: 'INACTIVE',
            honeypot_traps: [],
            threat_actors_tracked: [],
            last_updated: new Date().toISOString()
          }
        }
      }).as('getThreatsSummaryEmpty');

      cy.visit('/');
      cy.wait('@getThreatsSummaryEmpty');

      // Should render with empty state
      cy.get('.threat-list').should('be.visible');
    });
  });

  describe('🔒 Security & Input Validation', () => {
    it('should handle malformed ASCII art data', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        body: { success: true, data: [{ invalid: 'structure' }] }
      }).as('getAsciiArtMalformed');

      cy.intercept('GET', '**/api/stats', {
        fixture: 'stats.json'
      }).as('getStats');

      cy.intercept('GET', '**/api/threats/summary', {
        fixture: 'threats-summary.json'
      }).as('getThreatsSummary');

      cy.visit('/');

      // Should not crash the app
      cy.get('.App-header').should('be.visible');
    });

    it('should handle XSS attempts in API responses', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        fixture: 'ascii-art.json'
      }).as('getAsciiArt');

      cy.intercept('GET', '**/api/stats', {
        fixture: 'stats.json'
      }).as('getStats');

      cy.intercept('GET', '**/api/threats/summary', {
        body: {
          success: true,
          data: {
            total_collections: 1,
            status: '<script>alert("xss")</script>',
            honeypot_traps: ['<img src=x onerror=alert(1)>'],
            threat_actors_tracked: ['Normal Actor'],
            last_updated: new Date().toISOString()
          }
        }
      }).as('getThreatsSummaryXSS');

      cy.visit('/');
      cy.wait('@getThreatsSummaryXSS');

      // XSS should be escaped/sanitized
      cy.get('.threat-list').should('be.visible');

      // Should not execute scripts
      cy.on('window:alert', () => {
        throw new Error('XSS vulnerability detected!');
      });
    });
  });

  describe('⚡ Performance & Load Scenarios', () => {
    it('should handle slow API responses', () => {
      cy.intercept('GET', '**/api/ascii-art', {
        delay: 2000,
        fixture: 'ascii-art.json'
      }).as('getAsciiArtSlow');

      cy.intercept('GET', '**/api/stats', {
        delay: 2000,
        fixture: 'stats.json'
      }).as('getStatsSlow');

      cy.intercept('GET', '**/api/threats/summary', {
        delay: 2000,
        fixture: 'threats-summary.json'
      }).as('getThreatsSummarySlow');

      cy.visit('/');

      // Should show loading state
      cy.contains('Loading, nyaa~! 🐾').should('be.visible');

      // Eventually should load
      cy.wait('@getAsciiArtSlow', { timeout: 5000 });
      cy.wait('@getStatsSlow', { timeout: 5000 });
      cy.wait('@getThreatsSummarySlow', { timeout: 5000 });

      cy.get('.App-header').should('be.visible');
    });

    it('should handle large ASCII art dataset', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        title: `Art ${i}`,
        art: `ASCII ART ${i}`,
        category: 'test',
        timestamp: new Date().toISOString()
      }));

      cy.intercept('GET', '**/api/ascii-art', {
        body: { success: true, data: largeDataset }
      }).as('getAsciiArtLarge');

      cy.intercept('GET', '**/api/stats', {
        fixture: 'stats.json'
      }).as('getStats');

      cy.intercept('GET', '**/api/threats/summary', {
        fixture: 'threats-summary.json'
      }).as('getThreatsSummary');

      cy.visit('/');
      cy.wait('@getAsciiArtLarge');

      // Should render without performance issues
      cy.get('.ascii-tv-section').should('be.visible');
    });
  });

  describe('🌐 Browser Compatibility Edge Cases', () => {
    it('should handle disabled JavaScript (Cypress always has JS enabled, but test graceful degradation)', () => {
      cy.visitDashboard();

      // Verify app loads with React
      cy.get('#root').should('not.be.empty');
    });

    it('should handle missing local storage', () => {
      cy.clearLocalStorage();
      cy.visitDashboard();

      // Should still work
      cy.verifyDashboardComponents();
    });

    it('should handle missing session storage', () => {
      cy.clearAllSessionStorage();
      cy.visitDashboard();

      // Should still work
      cy.verifyDashboardComponents();
    });
  });

  describe('🔄 State Recovery Scenarios', () => {
    it('should recover from rapid navigation errors', () => {
      cy.visitDashboard();

      // Rapidly navigate
      for (let i = 0; i < 3; i++) {
        cy.navigateToThreatActors();
        cy.wait(50);
        cy.backToDashboard();
        cy.wait(50);
      }

      // Should be in valid state
      cy.verifyDashboardComponents();
    });

    it('should maintain consistency after API retry', () => {
      let callCount = 0;

      cy.intercept('GET', '**/api/stats', (req) => {
        callCount++;
        if (callCount === 1) {
          req.reply({ statusCode: 500 });
        } else {
          req.reply({ fixture: 'stats.json' });
        }
      }).as('getStatsRetry');

      cy.intercept('GET', '**/api/ascii-art', {
        fixture: 'ascii-art.json'
      }).as('getAsciiArt');

      cy.intercept('GET', '**/api/threats/summary', {
        fixture: 'threats-summary.json'
      }).as('getThreatsSummary');

      cy.visit('/');

      // Should eventually succeed
      cy.get('.App-header').should('be.visible');
    });
  });
});
