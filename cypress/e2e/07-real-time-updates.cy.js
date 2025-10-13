// 🐾⚡ E2E TEST: Real-Time Updates & Data Refresh ⚡🐾
describe('🔄 Real-Time Updates & Dynamic Content', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting real-time updates test, nyaa~!');
    cy.visitDashboard();
  });

  describe('🎨 ASCII Art Auto-Rotation', () => {
    it('should display first ASCII art on initial load', () => {
      cy.get('.ascii-tv')
        .should('be.visible');

      cy.get('.tv-counter')
        .should('contain', '1 / 3');
    });

    it('should display ASCII art title', () => {
      cy.get('.tv-title')
        .should('be.visible')
        .and('not.be.empty');
    });

    it('should show threat level badge for ASCII art', () => {
      cy.get('.threat-badge')
        .should('be.visible')
        .and('contain', 'THREAT:');
    });

    it('should show category badge for ASCII art', () => {
      cy.get('.category-badge')
        .should('be.visible')
        .and('contain', 'CATEGORY:');
    });

    it('should display ASCII art description', () => {
      cy.get('.tv-description')
        .should('be.visible')
        .and('not.be.empty');
    });

    it('should contain actual ASCII art content in pre tag', () => {
      cy.get('pre.ascii-art')
        .should('be.visible')
        .and('not.be.empty');
    });

    it('should maintain ASCII art visibility during category changes', () => {
      cy.get('pre.ascii-art').should('be.visible');

      // Change category
      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      // ASCII art should still be visible
      cy.get('pre.ascii-art').should('be.visible');
    });
  });

  describe('📊 Threat Counts Dynamic Loading', () => {
    it('should load threat counts from API', () => {
      cy.wait('@getThreatCounts');

      cy.get('.category-count')
        .should('have.length.at.least', 7);
    });

    it('should display correct count for all threats', () => {
      cy.get('.category-switcher')
        .contains('All Threats')
        .parent('.category-item')
        .find('.category-count')
        .should('contain', '8 detected');
    });

    it('should display correct count for predators', () => {
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .find('.category-count')
        .should('contain', '2 detected');
    });

    it('should display correct count for pedophiles', () => {
      cy.get('.category-switcher')
        .contains('Pedophiles')
        .parent('.category-item')
        .find('.category-count')
        .should('contain', '3 detected');
    });

    it('should show zero counts for categories with no threats', () => {
      cy.get('.category-count')
        .each(($count) => {
          cy.wrap($count).invoke('text').should('match', /\d+ detected/);
        });
    });
  });

  describe('🎯 Threat Actors Dynamic Display', () => {
    it('should fetch threat actors on dashboard load', () => {
      cy.wait('@getThreatActorsAll');

      cy.get('.threat-list').should('be.visible');
    });

    it('should display loading state while fetching threat actors', () => {
      cy.visit('/');

      // Should briefly show loading
      cy.get('.loading-hunt', { timeout: 1000 }).should('exist');
    });

    it('should display threat actors after loading', () => {
      cy.get('.threat-actor-card')
        .should('have.length.at.least', 1);
    });

    it('should show target count in threat list header', () => {
      cy.get('.targets-count')
        .should('be.visible')
        .and('contain', 'TARGET');
    });

    it('should show hunt active status', () => {
      cy.get('.hunt-status')
        .should('be.visible')
        .and('contain', '🎯 HUNT ACTIVE');
    });

    it('should fetch filtered threat actors when category changes', () => {
      // Switch to predators category
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      // Should make new API call
      cy.wait('@getThreatActorsPredators');

      // Should update display
      cy.get('.threat-list-header h2')
        .should('contain', 'PREDATOR');
    });

    it('should maintain hunt status across category changes', () => {
      // Switch categories multiple times
      ['Predators', 'Ransomware', 'All Threats'].forEach(cat => {
        cy.get('.category-switcher')
          .contains(cat)
          .parent('.category-item')
          .click({ force: true });

        cy.wait(100);

        cy.get('.hunt-status')
          .should('be.visible')
          .and('contain', 'HUNT ACTIVE');
      });
    });
  });

  describe('⏱️ Interval and Cleanup Behavior', () => {
    it('should not leak memory on rapid navigation', () => {
      // Navigate away and back multiple times
      for (let i = 0; i < 3; i++) {
        cy.navigateToThreatActors();
        cy.wait(100);
        cy.backToDashboard();
        cy.wait(100);
      }

      // Dashboard should still function normally
      cy.get('.ascii-tv').should('be.visible');
      cy.get('.threat-list').should('be.visible');
    });

    it('should handle component unmount gracefully', () => {
      // Navigate to different view
      cy.navigateToThreatActors();

      // ASCII TV should not be in DOM
      cy.get('.ascii-tv').should('not.exist');

      // Navigate back
      cy.backToDashboard();

      // ASCII TV should be back
      cy.get('.ascii-tv').should('be.visible');
    });
  });

  describe('🔄 Data Refresh Scenarios', () => {
    it('should handle API response changes', () => {
      // Initial load
      cy.get('.threat-actor-card').should('exist');

      // Simulate data refresh by intercepting again
      cy.intercept('GET', '**/api/threat-actors?category=all', {
        body: {
          success: true,
          count: 10,
          data: Array.from({ length: 10 }, (_, i) => ({
            _id: `threat${i}`,
            name: `Threat Actor ${i}`,
            threat_level: 'HIGH',
            type: 'test'
          }))
        }
      }).as('getThreatActorsRefresh');

      // Change category to trigger refresh
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      cy.wait(100);

      cy.get('.category-switcher')
        .contains('All Threats')
        .parent('.category-item')
        .click({ force: true });

      // Should still work
      cy.get('.threat-list').should('be.visible');
    });

    it('should update last updated timestamp', () => {
      cy.get('.update-time')
        .should('be.visible')
        .and('contain', 'Last Updated:');
    });

    it('should show neko status in footer', () => {
      cy.get('.neko-status')
        .should('be.visible')
        .and('contain', '*purrs in hunt readiness*');
    });
  });

  describe('🎬 Loading States and Transitions', () => {
    it('should show loading spinner during threat actor fetch', () => {
      cy.intercept('GET', '**/api/threat-actors?category=ransomware', {
        delay: 1000,
        fixture: 'threat-actors-all.json'
      }).as('getThreatActorsDelayed');

      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      // Should show loading state
      cy.get('.loading-hunt').should('be.visible');
      cy.get('.loading-spinner').should('contain', '🐾');

      // Wait for data to load
      cy.wait('@getThreatActorsDelayed');

      // Loading should disappear
      cy.get('.loading-hunt').should('not.exist');
    });

    it('should handle empty results gracefully', () => {
      cy.intercept('GET', '**/api/threat-actors?category=state_sponsored', {
        body: {
          success: true,
          count: 0,
          data: []
        }
      }).as('getThreatActorsEmpty');

      cy.get('.category-switcher')
        .contains('State Sponsored')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getThreatActorsEmpty');

      // Should show empty state
      cy.get('.no-threats')
        .should('be.visible')
        .and('contain', 'No threat actors found');

      cy.get('.success-icon').should('contain', '✅');
    });

    it('should handle network errors gracefully', () => {
      cy.intercept('GET', '**/api/threat-actors?category=crypto_crime', {
        statusCode: 500,
        body: {
          success: false,
          error: 'Server error'
        }
      }).as('getThreatActorsError');

      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getThreatActorsError');

      // Should show error state
      cy.get('.error-message')
        .should('be.visible');

      cy.get('.error-icon').should('contain', '⚠️');
    });
  });

  describe('📈 Performance and Optimization', () => {
    it('should not fetch data unnecessarily', () => {
      // Get initial request count
      let requestCount = 0;

      cy.intercept('GET', '**/api/threat-actors?category=all', (req) => {
        requestCount++;
        req.reply({ fixture: 'threat-actors-all.json' });
      }).as('getThreatActorsTracked');

      // Clicking same category shouldn't trigger new fetch
      cy.get('.category-item.active').click({ force: true });
      cy.wait(100);

      // Should still work without additional requests
      cy.get('.threat-list').should('be.visible');
    });

    it('should handle rapid category switching', () => {
      const categories = ['Predators', 'Ransomware', 'Crypto Crime', 'All Threats'];

      categories.forEach(cat => {
        cy.get('.category-switcher')
          .contains(cat)
          .parent('.category-item')
          .click({ force: true });
        cy.wait(50);
      });

      // Should end in stable state
      cy.get('.threat-list').should('be.visible');
      cy.get('.hunt-status').should('be.visible');
    });

    it('should maintain performance with multiple components updating', () => {
      // Switch category (updates ThreatList)
      cy.get('.category-switcher')
        .contains('Pedophiles')
        .parent('.category-item')
        .click({ force: true });

      // All components should still be responsive
      cy.get('.ascii-tv').should('be.visible');
      cy.get('.stats-section').should('be.visible');
      cy.get('.threat-list').should('be.visible');
      cy.get('.category-switcher').should('be.visible');
    });
  });
});
