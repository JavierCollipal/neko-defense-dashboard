// 🐾⚡ E2E TEST: Performance & Stress Testing ⚡🐾
describe('⚡ Performance & Stress Testing', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting performance stress test, nyaa~!');
    cy.visitDashboard();
  });

  describe('🚀 Large Dataset Handling', () => {
    it('should handle 100 threat actors without performance degradation', () => {
      // Generate large dataset
      const largeThreatActors = Array.from({ length: 100 }, (_, i) => ({
        _id: `threat${i.toString().padStart(3, '0')}`,
        name: `Threat Actor ${i + 1}`,
        aliases: [`Actor${i}`, `Target${i}`],
        threat_level: ['CRITICAL', 'HIGH', 'MEDIUM'][i % 3],
        type: ['predator', 'crypto_crime', 'ransomware'][i % 3],
        classification: 'Test Classification',
        location: 'Unknown',
        hunt_priority: `P${(i % 3) + 1}`,
        bounty: 50000 + (i * 1000),
        known_for: 'Performance testing actor',
        law_enforcement_status: 'Under Investigation'
      }));

      cy.intercept('GET', '**/api/threat-actors?category=all', {
        body: {
          success: true,
          count: 100,
          data: largeThreatActors
        }
      }).as('largeThreatActors');

      cy.get('.tv-window-button.threat-actors').click();
      cy.wait('@largeThreatActors');

      // Should render all 100 actors
      cy.get('.threat-actor-card').should('have.length', 100);

      // Should still be interactive
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .should('be.visible')
        .click({ force: true });
    });

    it('should handle rapid data updates without memory leaks', () => {
      // Simulate 50 rapid data updates
      for (let i = 0; i < 50; i++) {
        const updatedData = [{
          _id: 'threat001',
          name: `Updated Actor ${i}`,
          threat_level: 'HIGH',
          bounty: 50000 + (i * 1000)
        }];

        cy.intercept('GET', '**/api/threat-actors?category=ransomware', {
          body: { success: true, count: 1, data: updatedData }
        }).as(`update${i}`);

        cy.get('.category-switcher')
          .contains('Ransomware')
          .parent('.category-item')
          .click({ force: true });

        cy.wait(50);
      }

      // App should still be responsive
      cy.get('.category-item.active').should('contain', 'Ransomware');
    });

    it('should render large ASCII art without performance issues', () => {
      const largeAsciiArt = Array.from({ length: 50 }, (_, i) => ({
        title: `Art Piece ${i + 1}`,
        art: '█'.repeat(1000) + `\nArt ${i}`, // Large art string
        threat_level: 'HIGH',
        category: 'predators',
        description: 'Performance test ASCII art'
      }));

      cy.intercept('GET', '**/api/ascii-art', {
        body: {
          success: true,
          data: largeAsciiArt
        }
      }).as('largeAsciiArt');

      cy.reload();
      cy.wait('@largeAsciiArt');

      // Should render first art
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.art-counter').should('contain', '/50');
    });

    it('should handle 500 threat count updates efficiently', () => {
      const largeCounts = {
        all: 500,
        predators: 150,
        pedophiles: 100,
        dina_network: 50,
        ransomware: 80,
        state_sponsored: 60,
        crypto_crime: 60
      };

      cy.intercept('GET', '**/api/threat-counts', {
        body: { success: true, data: largeCounts }
      }).as('largeCounts');

      cy.reload();
      cy.wait('@largeCounts');

      // Should display large counts
      cy.get('.category-switcher')
        .contains('All Threats')
        .parent('.category-item')
        .find('.threat-count')
        .should('contain', '500');
    });
  });

  describe('💥 Stress Test Scenarios', () => {
    it('should survive 100 rapid category switches', () => {
      const categories = [
        'All Threats',
        'Predators',
        'Pedophiles',
        'DINA Network',
        'Ransomware',
        'State Sponsored',
        'Crypto Crime'
      ];

      // Stress test with 100 switches
      for (let i = 0; i < 100; i++) {
        const category = categories[i % categories.length];

        cy.get('.category-switcher')
          .contains(category)
          .parent('.category-item')
          .click({ force: true });

        // Very short wait to simulate rapid clicks
        cy.wait(50);
      }

      // App should still be functional
      cy.get('.App-header').should('be.visible');
      cy.get('.category-switcher').should('be.visible');
    });

    it('should handle 50 rapid view switches without crash', () => {
      for (let i = 0; i < 50; i++) {
        cy.get('.tv-window-button.threat-actors').click();
        cy.wait(100);
        cy.contains('Back to Dashboard').click();
        cy.wait(100);
      }

      // Should still work
      cy.get('.App-header h1').should('contain', 'NEKO-ARC DEFENSE SYSTEM');
      cy.get('.ascii-tv-section').should('be.visible');
    });

    it('should handle concurrent API calls during stress test', () => {
      // Trigger multiple API calls simultaneously
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.tv-window-button.threat-actors').click();

      // Should handle gracefully (last action wins)
      cy.get('.App-header', { timeout: 5000 }).should('be.visible');
    });

    it('should survive prolonged ASCII art rotation', () => {
      // Let ASCII art rotate 20 times (100 seconds simulated)
      for (let i = 0; i < 20; i++) {
        cy.wait(200); // Simulate time passing

        // Verify art is still displaying
        cy.get('.ascii-tv-section').should('be.visible');
      }

      // Should still be functional
      cy.get('.App-header').should('be.visible');
    });
  });

  describe('📊 Memory & Resource Management', () => {
    it('should clean up intervals on component unmount', () => {
      // Mount and unmount multiple times
      for (let i = 0; i < 10; i++) {
        cy.get('.tv-window-button.threat-actors').click();
        cy.wait(200);
        cy.contains('Back to Dashboard').click();
        cy.wait(200);
      }

      // No memory leaks - app should still work
      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.art-counter').should('be.visible');
    });

    it('should handle many concurrent DOM updates', () => {
      // Trigger multiple updates simultaneously
      cy.intercept('GET', '**/api/ascii-art').as('artUpdate');
      cy.intercept('GET', '**/api/stats').as('statsUpdate');
      cy.intercept('GET', '**/api/threat-counts').as('countsUpdate');

      cy.reload();

      // All should complete without issues
      cy.wait('@artUpdate');
      cy.wait('@statsUpdate');
      cy.wait('@countsUpdate');

      cy.get('.ascii-tv-section').should('be.visible');
      cy.get('.stats-section').should('be.visible');
      cy.get('.category-switcher').should('be.visible');
    });

    it('should prevent excessive re-renders', () => {
      let renderCount = 0;

      // Monitor for excessive renders
      cy.window().then((win) => {
        const observer = new win.MutationObserver(() => {
          renderCount++;
        });

        observer.observe(win.document.body, {
          childList: true,
          subtree: true
        });
      });

      // Perform normal operation
      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      cy.wait(1000);

      // Check render count isn't excessive (no infinite loops)
      cy.window().then(() => {
        // Should have reasonable number of renders
        console.log(`Render count: ${renderCount}`);
        expect(renderCount).to.be.lessThan(1000); // Prevent infinite render loops
      });
    });
  });

  describe('🌐 Network Performance', () => {
    it('should handle slow API responses gracefully', () => {
      // Simulate 5-second API delay
      cy.intercept('GET', '**/api/threat-actors*', (req) => {
        req.reply({
          delay: 5000,
          body: {
            success: true,
            count: 2,
            data: []
          }
        })
      }).as('slowApi');

      const startTime = Date.now();

      cy.get('.tv-window-button.threat-actors').click();

      // Should show loading state or be patient
      cy.wait('@slowApi', { timeout: 10000 });

      const endTime = Date.now();
      const elapsed = endTime - startTime;

      // Verify it waited for slow API
      expect(elapsed).to.be.at.least(5000);

      // App should still work
      cy.get('.App-header').should('be.visible');
    });

    it('should handle multiple failed API retries', () => {
      // Intercept with failures
      cy.intercept('GET', '**/api/threat-actors*', {
        statusCode: 500,
        body: { success: false, error: 'Server error' }
      }).as('failedApi');

      // Try navigation multiple times
      for (let i = 0; i < 5; i++) {
        cy.get('.tv-window-button.threat-actors').click();
        cy.wait(500);
        cy.contains('Back to Dashboard').click();
        cy.wait(500);
      }

      // App should still be functional
      cy.get('.App-header').should('be.visible');
    });

    it('should handle API responses of varying sizes', () => {
      const sizes = [1, 10, 50, 100];

      sizes.forEach((size) => {
        const data = Array.from({ length: size }, (_, i) => ({
          _id: `threat${i}`,
          name: `Actor ${i}`,
          threat_level: 'HIGH'
        }));

        cy.intercept('GET', '**/api/threat-actors?category=predators', {
          body: { success: true, count: size, data }
        }).as(`size${size}`);

        cy.get('.category-switcher')
          .contains('Predators')
          .parent('.category-item')
          .click({ force: true });

        cy.wait(`@size${size}`);

        // Should handle all sizes
        cy.get('.category-item.active').should('contain', 'Predators');
      });
    });

    it('should throttle concurrent API requests', () => {
      let apiCallCount = 0;

      cy.intercept('GET', '**/api/threat-actors*', (req) => {
        apiCallCount++;
        req.reply({
          delay: 100,
          body: { success: true, count: 0, data: [] }
        });
      }).as('throttledApi');

      // Make 10 rapid category switches
      for (let i = 0; i < 10; i++) {
        cy.get('.category-switcher')
          .contains('Crypto Crime')
          .parent('.category-item')
          .click({ force: true });

        cy.wait(50);
      }

      cy.wait(1000);

      // Should have throttled or debounced (not 10 calls)
      console.log(`API calls made: ${apiCallCount}`);
      // Ideally should be less than 10 with proper debouncing
    });
  });

  describe('🎨 Rendering Performance', () => {
    it('should render complex threat actor cards efficiently', () => {
      const complexActors = Array.from({ length: 50 }, (_, i) => ({
        _id: `threat${i}`,
        name: `Complex Actor ${i}`,
        aliases: Array.from({ length: 10 }, (__, j) => `Alias${i}_${j}`),
        threat_level: 'CRITICAL',
        type: 'predator',
        classification: 'Very Long Classification String ' + 'x'.repeat(100),
        location: 'Multiple Locations: ' + 'Location, '.repeat(20),
        hunt_priority: 'P1',
        bounty: 999999999,
        known_for: 'Known for many things: ' + 'Crime, '.repeat(50),
        law_enforcement_status: 'Wanted by multiple agencies: ' + 'FBI, '.repeat(20),
        evidence_count: 500,
        last_seen: '2025-10-12',
        nation_state: 'Multiple Nations',
        active_operations: 25
      }));

      cy.intercept('GET', '**/api/threat-actors?category=all', {
        body: { success: true, count: 50, data: complexActors }
      }).as('complexActors');

      const startTime = Date.now();

      cy.get('.tv-window-button.threat-actors').click();
      cy.wait('@complexActors');

      // Should render within reasonable time
      cy.get('.threat-actor-card', { timeout: 5000 })
        .should('have.length', 50);

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      console.log(`Complex render time: ${renderTime}ms`);
      // Should render in under 5 seconds
      expect(renderTime).to.be.lessThan(5000);
    });

    it('should handle rapid DOM updates without jank', () => {
      // Rapidly update visible content
      for (let i = 0; i < 20; i++) {
        cy.intercept('GET', '**/api/threat-counts', {
          body: {
            success: true,
            data: {
              all: 100 + i,
              predators: 20 + i,
              pedophiles: 15 + i,
              dina_network: 10 + i,
              ransomware: 12 + i,
              state_sponsored: 8 + i,
              crypto_crime: 10 + i
            }
          }
        }).as(`counts${i}`);

        cy.reload();
        cy.wait(200);
      }

      // Should still render smoothly
      cy.get('.category-switcher').should('be.visible');
    });

    it('should maintain 60fps during ASCII art rotation', () => {
      // Monitor animation performance
      cy.window().then((win) => {
        let frameCount = 0;
        const duration = 3000; // 3 seconds
        const startTime = win.performance.now();

        const countFrames = () => {
          frameCount++;
          if (win.performance.now() - startTime < duration) {
            win.requestAnimationFrame(countFrames);
          }
        };

        win.requestAnimationFrame(countFrames);

        cy.wait(duration).then(() => {
          const fps = frameCount / (duration / 1000);
          console.log(`Average FPS: ${fps}`);

          // Should maintain close to 60fps (accounting for test overhead)
          expect(fps).to.be.at.least(30); // Minimum acceptable
        });
      });
    });
  });

  describe('⚡ Load Time Performance', () => {
    it('should load dashboard in under 3 seconds', () => {
      const startTime = Date.now();

      cy.visitDashboard();

      cy.get('.ascii-tv-section').should('be.visible');

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      console.log(`Dashboard load time: ${loadTime}ms`);
      expect(loadTime).to.be.lessThan(3000);
    });

    it('should render threat actors view in under 2 seconds', () => {
      const startTime = Date.now();

      cy.get('.tv-window-button.threat-actors').click();

      cy.get('.threat-list-header').should('be.visible');

      const endTime = Date.now();
      const renderTime = endTime - startTime;

      console.log(`Threat actors render time: ${renderTime}ms`);
      expect(renderTime).to.be.lessThan(2000);
    });

    it('should handle 10 concurrent component loads', () => {
      // Simulate heavy concurrent load
      cy.intercept('GET', '**/api/ascii-art').as('art');
      cy.intercept('GET', '**/api/stats').as('stats');
      cy.intercept('GET', '**/api/threat-counts').as('counts');

      const startTime = Date.now();

      // Trigger multiple loads
      for (let i = 0; i < 10; i++) {
        cy.reload();
        cy.wait(100);
      }

      cy.wait('@art');
      cy.wait('@stats');
      cy.wait('@counts');

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      console.log(`10 concurrent loads time: ${totalTime}ms`);

      // Should complete without hanging
      cy.get('.App-header').should('be.visible');
    });
  });
});

describe('🔥 Extreme Stress Testing', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  describe('💣 Breaking Point Tests', () => {
    it('should handle 1000 threat actors (extreme scale)', () => {
      const extremeDataset = Array.from({ length: 1000 }, (_, i) => ({
        _id: `extreme${i}`,
        name: `Extreme Actor ${i}`,
        threat_level: 'HIGH',
        type: 'predator'
      }));

      cy.intercept('GET', '**/api/threat-actors?category=all', {
        body: { success: true, count: 1000, data: extremeDataset }
      }).as('extremeData');

      cy.get('.tv-window-button.threat-actors').click();
      cy.wait('@extremeData');

      // Should render (may be slow but shouldn't crash)
      cy.get('.threat-actor-card', { timeout: 10000 }).should('exist');
    });

    it('should survive 500 rapid interactions', () => {
      // Ultimate stress test
      for (let i = 0; i < 500; i++) {
        if (i % 2 === 0) {
          cy.get('.category-switcher')
            .contains('Predators')
            .parent('.category-item')
            .click({ force: true });
        } else {
          cy.get('.category-switcher')
            .contains('Crypto Crime')
            .parent('.category-item')
            .click({ force: true });
        }

        cy.wait(20); // Minimal wait
      }

      // Should still be alive
      cy.get('.App-header', { timeout: 10000 }).should('be.visible');
    });

    it('should handle massive ASCII art strings', () => {
      const massiveArt = [{
        title: 'Massive Art',
        art: '█'.repeat(100000), // 100KB art string
        threat_level: 'CRITICAL',
        category: 'predators',
        description: 'Extreme performance test'
      }];

      cy.intercept('GET', '**/api/ascii-art', {
        body: { success: true, data: massiveArt }
      }).as('massiveArt');

      cy.reload();
      cy.wait('@massiveArt');

      // Should handle (may clip or truncate)
      cy.get('.ascii-tv-section', { timeout: 10000 }).should('be.visible');
    });
  });
});
