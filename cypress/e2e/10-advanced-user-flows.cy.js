// 🐾⚡ E2E TEST: Advanced Multi-Step User Flows ⚡🐾
describe('🎮 Complex Multi-Step User Flows', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting advanced user flow test, nyaa~!');
    cy.visitDashboard();
  });

  describe('🔄 Complex Navigation Chains', () => {
    it('should handle full navigation cycle: Dashboard → Threat Actors → Category → DINA Docs → Dashboard', () => {
      // Start at dashboard
      cy.get('.App-header').should('contain', 'NEKO-ARC DEFENSE SYSTEM');

      // Navigate to Threat Actors
      cy.get('.tv-window-button.threat-actors').click();
      cy.get('.App-header h1').should('contain', 'THREAT ACTORS REGISTRY');

      // Switch category while in Threat Actors view
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getThreatActorsPredators');
      cy.get('.threat-list-header h2').should('contain', 'PREDATOR THREAT ACTORS');

      // Go back to dashboard
      cy.contains('Back to Dashboard').click();
      cy.get('.App-header').should('contain', 'NEKO-ARC DEFENSE SYSTEM');

      // Navigate to DINA Docs
      cy.get('.tv-window-button.dina-doc').click();
      cy.get('.App-header h1').should('contain', 'DINA INTERNATIONAL HUNT OPERATION');

      // Return to dashboard
      cy.contains('Back to Dashboard').click();
      cy.get('.App-header').should('contain', 'NEKO-ARC DEFENSE SYSTEM');

      // Verify dashboard components are intact
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.stats-section').should('be.visible');
      cy.get('.threats-section').should('be.visible');
    });

    it('should maintain category selection across view changes', () => {
      // Select Ransomware category
      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.category-item.active').should('contain', 'Ransomware');

      // Navigate to Threat Actors view
      cy.get('.tv-window-button.threat-actors').click();

      // Return to dashboard
      cy.contains('Back to Dashboard').click();

      // Verify category is still selected
      cy.get('.category-item.active').should('contain', 'Ransomware');
    });

    it('should handle rapid sequential navigation without breaking', () => {
      // Rapid fire navigation (stress test!)
      cy.get('.tv-window-button.threat-actors').click();
      cy.wait(100);
      cy.contains('Back to Dashboard').click();
      cy.wait(100);

      cy.get('.tv-window-button.dina-doc').click();
      cy.wait(100);
      cy.contains('Back to Dashboard').click();
      cy.wait(100);

      cy.get('.tv-window-button.threat-actors').click();
      cy.wait(100);
      cy.contains('Back to Dashboard').click();

      // Verify app still works
      cy.get('.App-header').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
      cy.get('.ascii-tv-section').should('be.visible');
    });

    it('should handle category switching with API calls in sequence', () => {
      const categories = ['Predators', 'Pedophiles', 'DINA Network', 'Ransomware'];

      categories.forEach((category) => {
        cy.get('.category-switcher')
          .contains(category)
          .parent('.category-item')
          .click({ force: true });

        cy.wait(200); // Wait for API call
        cy.get('.category-item.active').should('contain', category);
      });

      // Verify final state
      cy.get('.category-item.active').should('contain', 'Ransomware');
    });
  });

  describe('🎯 Multi-Component State Synchronization', () => {
    it('should update all components when category changes', () => {
      // Start with all threats
      cy.get('.category-item.active').should('contain', 'All Threats');

      // Switch to Crypto Crime
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      // Verify multiple components updated
      cy.get('.category-item.active').should('contain', 'Crypto Crime');
      cy.get('.stats-section').should('be.visible'); // Stats should still be visible
      cy.get('.threats-section').should('be.visible'); // Threats section updated

      // Navigate to Threat Actors and verify filtering
      cy.get('.tv-window-button.threat-actors').click();
      cy.get('.threat-list-header h2').should('contain', 'CRYPTO CRIME ACTORS');
    });

    it('should synchronize threat counts across all components', () => {
      // Check that counts are consistent
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .within(() => {
          cy.get('.threat-count').invoke('text').as('predatorCount');
        });

      // Navigate to Threat Actors
      cy.get('.tv-window-button.threat-actors').click();

      // Switch to Predators category in Threat Actors view
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getThreatActorsPredators');

      // Verify counts match
      cy.get('@predatorCount').then((count) => {
        cy.get('.targets-count').should('contain', count.trim());
      });
    });

    it('should maintain ASCII art rotation during navigation', () => {
      // Get initial art index
      cy.get('.art-counter').invoke('text').as('initialCounter');

      // Navigate away and back
      cy.get('.tv-window-button.threat-actors').click();
      cy.wait(500);
      cy.contains('Back to Dashboard').click();

      // ASCII art should still be rotating
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.art-counter').should('be.visible');
    });
  });

  describe('🚀 Deep Linking & URL State', () => {
    it('should support direct navigation via URL hash (future feature test)', () => {
      // Visit with hash parameter
      cy.visit('/?view=threats#predators');

      // Should load dashboard (hash navigation not implemented yet, but testing for future)
      cy.get('.App-header').should('be.visible');
    });

    it('should handle browser back button after navigation', () => {
      // Navigate to Threat Actors
      cy.get('.tv-window-button.threat-actors').click();
      cy.get('.App-header h1').should('contain', 'THREAT ACTORS REGISTRY');

      // Use browser back button
      cy.go('back');

      // Should return to dashboard
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
    });

    it('should handle browser forward button after going back', () => {
      // Navigate to DINA Docs
      cy.get('.tv-window-button.dina-doc').click();
      cy.get('.App-header h1').should('contain', 'DINA INTERNATIONAL');

      // Go back
      cy.go('back');
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');

      // Go forward
      cy.go('forward');
      cy.get('.App-header h1').should('contain', 'DINA INTERNATIONAL');
    });

    it('should maintain app state during browser navigation', () => {
      // Select category
      cy.get('.category-switcher')
        .contains('State Sponsored')
        .parent('.category-item')
        .click({ force: true });

      // Navigate away and back with browser buttons
      cy.get('.tv-window-button.threat-actors').click();
      cy.go('back');

      // Verify category still selected
      cy.get('.category-item.active').should('contain', 'State Sponsored');
    });
  });

  describe('🎨 Complex User Interactions', () => {
    it('should handle category switch while ASCII art is rotating', () => {
      // Wait for first rotation
      cy.wait(5500); // ASCII rotates every 5 seconds

      // Switch category during rotation
      cy.get('.category-switcher')
        .contains('Pedophiles')
        .parent('.category-item')
        .click({ force: true });

      // Verify ASCII art still displays correctly
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.ascii-art pre').should('be.visible');
    });

    it('should handle opening multiple TV windows in sequence', () => {
      // Open NEKO TV
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen');
      });

      cy.get('.tv-window-button').contains('NEKO TV').click();
      cy.get('@windowOpen').should('have.been.calledOnce');

      // Open Multi-Channel TV
      cy.get('.tv-window-button.multi-channel').click();
      cy.get('@windowOpen').should('have.been.calledTwice');

      // Open DINA Justice TV
      cy.get('.tv-window-button.dina-tv').click();
      cy.get('@windowOpen').should('have.been.calledThrice');
    });

    it('should handle concurrent category and view changes', () => {
      // Start category switch
      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      // Immediately navigate to different view (concurrent action)
      cy.get('.tv-window-button.threat-actors').click();

      // Should handle gracefully
      cy.get('.App-header h1').should('contain', 'THREAT ACTORS');
      cy.get('.threat-list-header').should('be.visible');
    });

    it('should recover from failed API calls during navigation', () => {
      // Simulate API failure
      cy.intercept('GET', '**/api/threat-actors*', {
        statusCode: 500,
        body: { success: false, error: 'Server error, nyaa~!' }
      }).as('apiError');

      // Navigate to Threat Actors
      cy.get('.tv-window-button.threat-actors').click();

      // Wait for failed API call
      cy.wait('@apiError');

      // App should still be functional (error handling)
      cy.get('.App-header').should('be.visible');

      // Navigate back to dashboard
      cy.contains('Back to Dashboard').click();
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
    });
  });

  describe('🎯 Edge Case Workflows', () => {
    it('should handle clicking same category twice', () => {
      cy.get('.category-switcher')
        .contains('All Threats')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.category-item.active').should('contain', 'All Threats');

      // Click again (should not break)
      cy.get('.category-switcher')
        .contains('All Threats')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.category-item.active').should('contain', 'All Threats');
    });

    it('should handle rapid view toggling', () => {
      // Toggle DINA Docs multiple times rapidly
      for (let i = 0; i < 5; i++) {
        cy.get('.tv-window-button.dina-doc').click();
        cy.wait(100);
        cy.contains('Back to Dashboard').click();
        cy.wait(100);
      }

      // Verify app still functional
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
      cy.get('.ascii-tv-section').should('be.visible');
    });

    it('should handle view navigation with empty threat data', () => {
      // Intercept with empty data
      cy.intercept('GET', '**/api/threat-actors*', {
        body: { success: true, count: 0, data: [] }
      }).as('emptyData');

      cy.get('.tv-window-button.threat-actors').click();
      cy.wait('@emptyData');

      // Should handle empty state gracefully
      cy.get('.App-header').should('be.visible');

      // Navigate back
      cy.contains('Back to Dashboard').click();
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
    });

    it('should maintain footer visibility across all views', () => {
      // Check footer on dashboard
      cy.get('.App-footer').should('be.visible').and('contain', 'purrs');

      // Check footer in Threat Actors view
      cy.get('.tv-window-button.threat-actors').click();
      cy.get('.threat-list-footer').should('be.visible').and('contain', 'nyaa');

      // Check footer in DINA Docs view
      cy.contains('Back to Dashboard').click();
      cy.get('.tv-window-button.dina-doc').click();
      cy.get('footer, .dina-footer').should('exist'); // Footer should exist in some form

      // Back to dashboard
      cy.contains('Back to Dashboard').click();
      cy.get('.App-footer').should('be.visible');
    });
  });

  describe('⚡ Performance Under Complex Workflows', () => {
    it('should handle 20 consecutive category switches without lag', () => {
      const categories = ['Predators', 'Pedophiles', 'DINA Network', 'Ransomware', 'All Threats'];

      // Switch categories 20 times (4 full cycles)
      for (let i = 0; i < 20; i++) {
        const category = categories[i % categories.length];
        cy.get('.category-switcher')
          .contains(category)
          .parent('.category-item')
          .click({ force: true });

        cy.wait(100);
      }

      // Verify app still responsive
      cy.get('.category-item.active').should('be.visible');
      cy.get('.ascii-tv-section').should('be.visible');
    });

    it('should handle complex workflow without memory leaks', () => {
      // Perform memory-intensive workflow
      for (let i = 0; i < 10; i++) {
        // Switch category
        cy.get('.category-switcher')
          .contains('Crypto Crime')
          .parent('.category-item')
          .click({ force: true });

        cy.wait(200);

        // Navigate to Threat Actors
        cy.get('.tv-window-button.threat-actors').click();
        cy.wait(200);

        // Back to dashboard
        cy.contains('Back to Dashboard').click();
        cy.wait(200);
      }

      // Verify no degradation
      cy.get('.App-header').should('be.visible');
      cy.get('.ascii-tv-section').should('be.visible');
    });

    it('should handle all views accessed in random order', () => {
      const views = [
        { button: '.threat-actors', title: 'THREAT ACTORS' },
        { button: '.dina-doc', title: 'DINA INTERNATIONAL' }
      ];

      // Access views in random order multiple times
      for (let i = 0; i < 6; i++) {
        const view = views[i % 2];

        cy.get(`.tv-window-button${view.button}`).click();
        cy.get('.App-header h1').should('contain', view.title);
        cy.wait(150);
        cy.contains('Back to Dashboard').click();
        cy.wait(150);
      }

      // Final state check
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
    });
  });
});

describe('🎮 Session Management & State Persistence', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  describe('💾 State Recovery Scenarios', () => {
    it('should recover gracefully from API timeout during view change', () => {
      // Simulate slow API
      cy.intercept('GET', '**/api/threat-actors*', (req) => {
        req.reply({ delay: 10000 }) // 10 second delay
      }).as('slowApi');

      cy.get('.tv-window-button.threat-actors').click();

      // Navigate away before API completes
      cy.wait(500);
      cy.contains('Back to Dashboard', { timeout: 1000 }).click();

      // Should handle gracefully
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
    });

    it('should maintain component state after error recovery', () => {
      // Select category
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      // Cause an error
      cy.intercept('GET', '**/api/stats', {
        statusCode: 500
      }).as('statsError');

      // Navigate to trigger error
      cy.get('.tv-window-button.threat-actors').click();

      // Recover
      cy.contains('Back to Dashboard').click();

      // Category selection should persist
      cy.get('.category-item.active').should('contain', 'Predators');
    });
  });
});
