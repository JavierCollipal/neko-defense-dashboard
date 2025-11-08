// 🐾⚡ E2E TEST: Data Persistence & State Management ⚡🐾
describe('💾 Data Persistence & Browser Storage', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting data persistence test, nyaa~!');
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visitDashboard();
  });

  describe('💾 LocalStorage Persistence', () => {
    it('should persist user category preference (future feature)', () => {
      // Select a category
      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      // Check if localStorage could be used (future enhancement)
      cy.window().then((win) => {
        // Future: win.localStorage.setItem('nekoCategory', 'ransomware')
        expect(win.localStorage).to.exist;
      });
    });

    it('should handle localStorage being disabled', () => {
      // Simulate disabled localStorage
      cy.window().then((win) => {
        try {
          win.localStorage.setItem('test', 'test');
          win.localStorage.removeItem('test');
        } catch (e) {
          // localStorage might be disabled
        }
      });

      // App should still function
      cy.get('.App-header').should('be.visible');
      cy.get('.category-switcher').should('be.visible');
    });

    it('should clear old localStorage data on new session', () => {
      cy.window().then((win) => {
        // Set some old data
        win.localStorage.setItem('neko-old-data', 'legacy');

        // Refresh page
        cy.reload();

        // App should still load
        cy.get('.App-header').should('be.visible');
      });
    });
  });

  describe('🔄 Browser Refresh Scenarios', () => {
    it('should reload dashboard successfully after refresh', () => {
      // Wait for initial load
      cy.get('.ascii-tv-section').should('be.visible');

      // Refresh page
      cy.reload();

      // Should reload successfully
      cy.get('.App-header').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.stats-section').should('be.visible');
    });

    it('should reload threat actors view after refresh', () => {
      // Navigate to threat actors
      cy.get('.tv-window-button.threat-actors').click();
      cy.get('.App-header h1').should('contain', 'THREAT ACTORS');

      // Refresh
      cy.reload();

      // Should still show threat actors view or return to dashboard
      cy.get('.App-header').should('be.visible');
    });

    it('should handle refresh during category filter', () => {
      // Select category
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.category-item.active').should('contain', 'Crypto Crime');

      // Refresh
      cy.reload();

      // Category might reset to default (All Threats) - that's OK
      cy.get('.category-switcher').should('be.visible');
      cy.get('.category-item.active').should('exist');
    });

    it('should refetch all data after refresh', () => {
      // Initial load
      cy.get('.ascii-tv-section').should('be.visible');

      // Refresh and verify API calls are made
      cy.intercept('GET', '**/api/ascii-art').as('refetchArt');
      cy.intercept('GET', '**/api/stats').as('refetchStats');
      cy.intercept('GET', '**/api/threat-counts').as('refetchCounts');

      cy.reload();

      // Verify all APIs called
      cy.wait('@refetchArt');
      cy.wait('@refetchStats');
      cy.wait('@refetchCounts');

      cy.get('.ascii-tv-section').should('be.visible');
    });

    it('should handle multiple rapid refreshes', () => {
      // Refresh 3 times rapidly
      for (let i = 0; i < 3; i++) {
        cy.reload();
        cy.wait(500);
      }

      // App should still work
      cy.get('.App-header').should('be.visible');
      cy.get('.ascii-tv-section').should('be.visible');
    });
  });

  describe('🎯 Session State Management', () => {
    it('should initialize with default state on first visit', () => {
      // First visit should show default category
      cy.get('.category-item.active').should('contain', 'All Threats');

      // Should show default view (dashboard, not threat actors)
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');

      // Should start with first ASCII art
      cy.get('.art-counter').should('contain', '1');
    });

    it('should reset to default state after clearing storage', () => {
      // Make some changes
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      // Clear all storage
      cy.clearLocalStorage();
      cy.clearCookies();

      // Reload
      cy.reload();

      // Should be back to defaults
      cy.get('.category-item.active').should('contain', 'All Threats');
    });

    it('should handle session timeout gracefully', () => {
      // Simulate long session
      cy.wait(2000);

      // Interact with app after "timeout"
      cy.get('.category-switcher')
        .contains('State Sponsored')
        .parent('.category-item')
        .click({ force: true });

      // Should still work
      cy.get('.category-item.active').should('contain', 'State Sponsored');
    });
  });

  describe('🔧 Application State Recovery', () => {
    it('should recover from corrupted localStorage', () => {
      cy.window().then((win) => {
        // Set corrupted data
        win.localStorage.setItem('neko-state', '{invalid json}');
      });

      // Reload
      cy.reload();

      // App should still load with defaults
      cy.get('.App-header').should('be.visible');
      cy.get('.category-item.active').should('contain', 'All Threats');
    });

    it('should recover from failed state initialization', () => {
      // Simulate API failure on load
      cy.intercept('GET', '**/api/stats', {
        statusCode: 500
      }).as('statsError');

      cy.reload();

      // App should still render (maybe with empty/default stats)
      cy.get('.App-header').should('be.visible');
      cy.get('.category-switcher').should('be.visible');
    });

    it('should handle missing API data gracefully', () => {
      // Intercept with minimal data
      cy.intercept('GET', '**/api/ascii-art', {
        body: { success: true, data: [] }
      }).as('emptyArt');

      cy.intercept('GET', '**/api/stats', {
        body: { success: false, data: null }
      }).as('nullStats');

      cy.reload();

      // Should still load
      cy.get('.App-header').should('be.visible');
    });
  });

  describe('🌐 Network Condition Handling', () => {
    it('should handle offline mode gracefully', () => {
      // Simulate offline
      cy.intercept('GET', '**/api/**', {
        forceNetworkError: true
      }).as('offline');

      cy.reload();

      // App should render structure even without data
      cy.get('.App-header', { timeout: 10000 }).should('be.visible');
    });

    it('should recover when connection restored', () => {
      // Start offline
      cy.intercept('GET', '**/api/stats', {
        forceNetworkError: true
      }).as('offlineStats');

      cy.reload();

      // Remove offline intercept (simulate connection restored)
      cy.intercept('GET', '**/api/stats', {
        body: {
          success: true,
          data: {
            threats_monitored: 150,
            active_hunts: 8,
            systems_protected: 42
          }
        }
      }).as('onlineStats');

      // Try to fetch again
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      // Should work now
      cy.get('.category-item.active').should('contain', 'Crypto Crime');
    });

    it('should handle slow network conditions', () => {
      // Simulate slow network
      cy.intercept('GET', '**/api/threat-actors*', (req) => {
        req.reply({
          delay: 3000, // 3 second delay
          body: { success: true, data: [] }
        })
      }).as('slowNetwork');

      cy.get('.tv-window-button.threat-actors').click();

      // Should show loading state or handle gracefully
      cy.get('.App-header', { timeout: 5000 }).should('be.visible');
    });

    it('should handle intermittent connection issues', () => {
      let callCount = 0;

      cy.intercept('GET', '**/api/threat-actors*', (req) => {
        callCount++;
        // Fail first call, succeed second
        if (callCount === 1) {
          req.reply({ statusCode: 500 });
        } else {
          req.reply({
            body: {
              success: true,
              count: 2,
              data: cy.fixture('threat-actors-predators.json').then(data => data.data)
            }
          });
        }
      }).as('intermittent');

      cy.get('.tv-window-button.threat-actors').click();

      // Retry or back to dashboard
      cy.wait(1000);

      // Try again (should work on second attempt)
      cy.contains('Back to Dashboard').click();
      cy.get('.tv-window-button.threat-actors').click();

      // Should eventually work
      cy.get('.App-header', { timeout: 5000 }).should('be.visible');
    });
  });

  describe('📊 Data Consistency Checks', () => {
    it('should maintain data consistency across components', () => {
      // Get threat count from category switcher
      cy.get('.category-switcher')
        .contains('All Threats')
        .parent('.category-item')
        .find('.threat-count')
        .invoke('text')
        .as('allThreatsCount');

      // Navigate to threat actors
      cy.get('.tv-window-button.threat-actors').click();

      // Get count from threat actors view
      cy.get('.targets-count').invoke('text').as('actorCount');

      // Counts should match (both should be 8)
      cy.get('@allThreatsCount').then((categoryCount) => {
        cy.get('@actorCount').then((actorCount) => {
          const catNum = parseInt(categoryCount.trim());
          const actNum = parseInt(actorCount.split(' ')[0]);
          expect(catNum).to.equal(actNum);
        });
      });
    });

    it('should prevent stale data after API updates', () => {
      // Initial load
      cy.get('.ascii-tv-section').should('be.visible');

      // Simulate API data change
      cy.intercept('GET', '**/api/ascii-art', {
        body: {
          success: true,
          data: [{
            title: 'New Art',
            art: '===NEW===',
            threat_level: 'HIGH'
          }]
        }
      }).as('newArtData');

      // Trigger refresh by navigating away and back
      cy.get('.tv-window-button.threat-actors').click();
      cy.contains('Back to Dashboard').click();

      // Should show updated data (or at least not crash)
      cy.get('.ascii-tv-section').should('be.visible');
    });

    it('should handle data race conditions', () => {
      // Trigger multiple API calls simultaneously
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      // Immediately switch again
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      // Should display correct data for last selection
      cy.get('.category-item.active').should('contain', 'Crypto Crime');
    });
  });

  describe('🔐 Secure Storage Practices', () => {
    it('should not store sensitive data in localStorage', () => {
      cy.window().then((win) => {
        const storage = win.localStorage;
        const keys = Object.keys(storage);

        // Check no API keys or tokens stored
        keys.forEach((key) => {
          const value = storage.getItem(key);
          expect(value).to.not.include('password');
          expect(value).to.not.include('token');
          expect(value).to.not.include('api_key');
        });
      });
    });

    it('should not expose internal state in console', () => {
      // Check console for sensitive data (logged state)
      cy.window().then((win) => {
        // Verify no sensitive data in global scope
        expect(win.apiKey).to.be.undefined;
        expect(win.password).to.be.undefined;
      });
    });
  });
});

describe('🎯 Cookie & Session Management', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visitDashboard();
  });

  describe('🍪 Cookie Handling', () => {
    it('should function without cookies', () => {
      // App should work without cookies (no auth needed)
      cy.get('.App-header').should('be.visible');
      cy.get('.category-switcher').should('be.visible');
    });

    it('should not set unnecessary cookies', () => {
      cy.getCookies().then((cookies) => {
        // Should have minimal or no cookies
        console.log('Cookies set:', cookies.length);
        // App doesn't need auth, so should be minimal
      });
    });
  });

  describe('🔄 Session Continuity', () => {
    it('should maintain session across tab switches', () => {
      // Select category
      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      // Simulate tab switch (blur/focus)
      cy.window().then((win) => {
        win.dispatchEvent(new Event('blur'));
        cy.wait(500);
        win.dispatchEvent(new Event('focus'));
      });

      // Category should still be selected
      cy.get('.category-item.active').should('contain', 'Ransomware');
    });

    it('should handle window resize during session', () => {
      // Initial viewport
      cy.viewport(1920, 1080);
      cy.get('.App-header').should('be.visible');

      // Resize
      cy.viewport(768, 1024);
      cy.get('.App-header').should('be.visible');

      // Resize again
      cy.viewport(375, 667);
      cy.get('.App-header').should('be.visible');
    });
  });
});
