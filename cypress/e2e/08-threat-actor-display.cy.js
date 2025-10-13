// 🐾⚡ E2E TEST: Threat Actor Display & Hunt Operations ⚡🐾
describe('🎯 Threat Actor Display & Card Details', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting threat actor display test, nyaa~!');
    cy.visitDashboard();
  });

  describe('🎯 Threat Actor Cards Structure', () => {
    it('should display threat actor cards in grid layout', () => {
      cy.get('.threat-actors-grid')
        .should('be.visible');

      cy.get('.threat-actor-card')
        .should('have.length', 8);
    });

    it('should display actor rank numbers', () => {
      cy.get('.actor-rank')
        .first()
        .should('contain', '#1');

      cy.get('.actor-rank')
        .eq(1)
        .should('contain', '#2');
    });

    it('should display threat level badges with colors', () => {
      cy.get('.threat-level-badge')
        .should('have.length', 8)
        .each(($badge) => {
          cy.wrap($badge).should('have.css', 'background-color');
        });
    });

    it('should show CRITICAL threat level in red', () => {
      cy.get('.threat-level-badge')
        .contains('CRITICAL')
        .should('have.css', 'background-color', 'rgb(255, 0, 51)');
    });

    it('should show HIGH threat level in orange', () => {
      cy.get('.threat-level-badge')
        .contains('HIGH')
        .should('have.css', 'background-color', 'rgb(255, 102, 0)');
    });

    it('should display actor names prominently', () => {
      cy.get('.actor-name h3')
        .should('have.length', 8)
        .first()
        .should('contain', 'Shadow Predator Alpha');
    });

    it('should display actor aliases', () => {
      cy.get('.actor-aliases')
        .first()
        .should('be.visible')
        .and('contain', 'aka:');
    });
  });

  describe('📋 Actor Detail Fields', () => {
    it('should display actor type information', () => {
      cy.get('.detail-item')
        .contains('Type:')
        .parent()
        .find('.detail-value')
        .should('not.be.empty');
    });

    it('should display actor classification', () => {
      cy.get('.detail-item')
        .contains('Classification:')
        .parent()
        .find('.detail-value')
        .should('not.be.empty');
    });

    it('should display actor location', () => {
      cy.get('.detail-item')
        .contains('Location:')
        .should('exist');
    });

    it('should display hunt priority', () => {
      cy.get('.detail-item.priority')
        .should('exist')
        .and('contain', 'Hunt Priority:');
    });

    it('should format hunt priority correctly', () => {
      cy.get('.detail-item.priority .detail-value')
        .first()
        .invoke('text')
        .should('match', /P\d+/);
    });

    it('should display bounty amounts', () => {
      cy.get('.detail-item.bounty')
        .should('exist')
        .and('contain', 'Bounty:');
    });

    it('should format bounty with dollar sign and commas', () => {
      cy.get('.detail-item.bounty .detail-value')
        .first()
        .invoke('text')
        .should('match', /\$[\d,]+/);
    });

    it('should display "Known For" section', () => {
      cy.get('.actor-known-for')
        .first()
        .should('be.visible')
        .and('contain', 'Known For:');
    });

    it('should display law enforcement status', () => {
      cy.get('.law-enforcement-status')
        .first()
        .should('be.visible')
        .and('contain', '🚨');
    });

    it('should display nation state for APTs', () => {
      cy.get('.threat-actor-card')
        .contains('APT-Dragon')
        .parents('.threat-actor-card')
        .within(() => {
          cy.contains('Nation:').should('exist');
        });
    });
  });

  describe('🔍 Category-Specific Displays', () => {
    it('should show correct title for all threats category', () => {
      cy.get('.threat-list-header h2')
        .should('contain', '🎯 ALL THREAT ACTORS');
    });

    it('should show correct title for predators category', () => {
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getThreatActorsPredators');

      cy.get('.threat-list-header h2')
        .should('contain', '⚠️ PREDATOR THREAT ACTORS');
    });

    it('should show correct title for pedophiles category', () => {
      cy.get('.category-switcher')
        .contains('Pedophiles')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.threat-list-header h2')
        .should('contain', '🚨 PEDOPHILE THREAT ACTORS');
    });

    it('should show correct title for DINA network category', () => {
      cy.get('.category-switcher')
        .contains('DINA Network')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.threat-list-header h2')
        .should('contain', '🕸️ DINA NETWORK ACTORS');
    });

    it('should show correct title for ransomware category', () => {
      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.threat-list-header h2')
        .should('contain', '💀 RANSOMWARE GROUPS');
    });

    it('should show correct title for state sponsored category', () => {
      cy.get('.category-switcher')
        .contains('State Sponsored')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.threat-list-header h2')
        .should('contain', '🕷️ STATE-SPONSORED APTs');
    });

    it('should show correct title for crypto crime category', () => {
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      cy.get('.threat-list-header h2')
        .should('contain', '₿ CRYPTO CRIME ACTORS');
    });
  });

  describe('🎯 Hunt Statistics Display', () => {
    it('should display target count', () => {
      cy.get('.targets-count')
        .should('be.visible')
        .and('contain', '8 TARGETS');
    });

    it('should use singular form for single target', () => {
      cy.intercept('GET', '**/api/threat-actors?category=ransomware', {
        body: {
          success: true,
          count: 1,
          data: [{
            _id: 'threat004',
            name: 'RansomLock Crew',
            threat_level: 'HIGH',
            type: 'ransomware'
          }]
        }
      }).as('getSingleThreatActor');

      cy.get('.category-switcher')
        .contains('Ransomware')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getSingleThreatActor');

      cy.get('.targets-count')
        .should('contain', '1 TARGET')
        .and('not.contain', 'TARGETS');
    });

    it('should show hunt active status badge', () => {
      cy.get('.hunt-status')
        .should('be.visible')
        .and('have.css', 'display')
        .and('not.equal', 'none');
    });

    it('should display hunt stats container', () => {
      cy.get('.hunt-stats')
        .should('be.visible')
        .within(() => {
          cy.get('.targets-count').should('exist');
          cy.get('.hunt-status').should('exist');
        });
    });
  });

  describe('🎨 Visual Presentation', () => {
    it('should display cards in grid layout', () => {
      cy.get('.threat-actors-grid')
        .should('have.css', 'display');

      cy.get('.threat-actor-card')
        .should('be.visible');
    });

    it('should show actor header with rank and threat level', () => {
      cy.get('.threat-actor-card')
        .first()
        .within(() => {
          cy.get('.actor-header').should('be.visible');
          cy.get('.actor-rank').should('be.visible');
          cy.get('.threat-level-badge').should('be.visible');
        });
    });

    it('should properly structure actor details section', () => {
      cy.get('.actor-details')
        .first()
        .should('be.visible')
        .find('.detail-item')
        .should('have.length.at.least', 1);
    });

    it('should highlight priority actors', () => {
      cy.get('.detail-item.priority')
        .should('exist')
        .and('have.class', 'priority');
    });

    it('should highlight bounty information', () => {
      cy.get('.detail-item.bounty')
        .should('exist')
        .and('have.class', 'bounty');
    });

    it('should display footer with update time and neko status', () => {
      cy.get('.threat-list-footer')
        .should('be.visible')
        .within(() => {
          cy.get('.update-time').should('exist');
          cy.get('.neko-status').should('exist');
        });
    });
  });

  describe('🔄 Filtering and Updates', () => {
    it('should update threat actors when switching from all to predators', () => {
      // Start with all threats (8 actors)
      cy.get('.threat-actor-card').should('have.length', 8);

      // Switch to predators
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getThreatActorsPredators');

      // Should now have 2 actors
      cy.get('.threat-actor-card').should('have.length', 2);
    });

    it('should maintain card structure after category switch', () => {
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getThreatActorsPredators');

      // Verify structure is maintained
      cy.get('.threat-actor-card')
        .first()
        .within(() => {
          cy.get('.actor-header').should('exist');
          cy.get('.actor-name').should('exist');
          cy.get('.actor-details').should('exist');
        });
    });

    it('should update target count when filtering', () => {
      // All threats
      cy.get('.targets-count').should('contain', '8 TARGETS');

      // Switch to predators (2 targets)
      cy.get('.category-switcher')
        .contains('Predators')
        .parent('.category-item')
        .click({ force: true });

      cy.wait('@getThreatActorsPredators');

      cy.get('.targets-count').should('contain', '2 TARGETS');
    });

    it('should preserve actor data fields across filters', () => {
      // Check first actor in all category
      cy.get('.threat-actor-card')
        .first()
        .find('.actor-name h3')
        .invoke('text')
        .as('firstName');

      // Switch category and back
      cy.get('.category-switcher')
        .contains('Crypto Crime')
        .parent('.category-item')
        .click({ force: true });

      cy.wait(100);

      cy.get('.category-switcher')
        .contains('All Threats')
        .parent('.category-item')
        .click({ force: true });

      // First actor should be the same
      cy.get('@firstName').then((name) => {
        cy.get('.threat-actor-card')
          .first()
          .find('.actor-name h3')
          .should('contain', name);
      });
    });
  });

  describe('📊 Data Completeness', () => {
    it('should display all 8 threat actors in fixture', () => {
      const expectedActors = [
        'Shadow Predator Alpha',
        'Crypto Phantom',
        'DINA Network Node 7',
        'RansomLock Crew',
        'APT-Dragon',
        'Underground Merchant',
        'Silent Stalker',
        'Poison Spider Group'
      ];

      expectedActors.forEach(actorName => {
        cy.contains(actorName).should('exist');
      });
    });

    it('should display complete information for high-priority actors', () => {
      cy.get('.threat-actor-card')
        .first()
        .within(() => {
          cy.get('.actor-name h3').should('not.be.empty');
          cy.get('.threat-level-badge').should('not.be.empty');
          cy.get('.actor-aliases').should('exist');
          cy.get('.actor-details').should('exist');
          cy.get('.actor-known-for').should('exist');
          cy.get('.law-enforcement-status').should('exist');
        });
    });

    it('should handle actors with missing optional fields', () => {
      // Actors without nation_state should still display
      cy.get('.threat-actor-card')
        .contains('Shadow Predator Alpha')
        .should('exist');

      // Should not break the card layout
      cy.get('.threat-actor-card')
        .first()
        .should('be.visible')
        .and('have.css', 'display');
    });
  });

  describe('🚨 Special Actor Categories', () => {
    it('should properly display predator actors', () => {
      cy.get('.threat-actor-card')
        .contains('Shadow Predator Alpha')
        .parents('.threat-actor-card')
        .within(() => {
          cy.get('.threat-level-badge').should('contain', 'CRITICAL');
          cy.get('.detail-item').contains('Classification:')
            .parent()
            .should('contain', 'Child Predator');
        });
    });

    it('should properly display crypto crime actors', () => {
      cy.get('.threat-actor-card')
        .contains('Crypto Phantom')
        .parents('.threat-actor-card')
        .within(() => {
          cy.get('.detail-item').contains('Classification:')
            .parent()
            .should('contain', 'Cryptocurrency');
        });
    });

    it('should properly display state-sponsored actors', () => {
      cy.get('.threat-actor-card')
        .contains('APT-Dragon')
        .parents('.threat-actor-card')
        .within(() => {
          cy.get('.detail-item').contains('Nation:').should('exist');
          cy.get('.threat-level-badge').should('contain', 'CRITICAL');
        });
    });

    it('should properly display ransomware actors', () => {
      cy.get('.threat-actor-card')
        .contains('RansomLock Crew')
        .parents('.threat-actor-card')
        .within(() => {
          cy.get('.detail-item').contains('Classification:')
            .parent()
            .should('contain', 'Ransomware');
        });
    });
  });
});
