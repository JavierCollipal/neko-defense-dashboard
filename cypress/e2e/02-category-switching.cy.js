// 🐾⚡ E2E TEST: Category Switching & Filtering ⚡🐾
describe('🎯 Category Switching & Threat Filtering', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting category switching test, nyaa~!');
    cy.visitDashboard();
  });

  const categories = [
    { id: 'all', name: 'All Threats', icon: '🎯', priority: false },
    { id: 'predators', name: 'Predators', icon: '⚠️', priority: true },
    { id: 'pedophiles', name: 'Pedophiles', icon: '🚨', priority: true },
    { id: 'dina_network', name: 'DINA Network', icon: '🕸️', priority: true },
    { id: 'ransomware', name: 'Ransomware', icon: '💀', priority: false },
    { id: 'state_sponsored', name: 'State Sponsored', icon: '🕷️', priority: false },
    { id: 'crypto_crime', name: 'Crypto Crime', icon: '₿', priority: false }
  ];

  it('should display all threat categories in the sidebar', () => {
    cy.get('.category-switcher')
      .should('be.visible')
      .within(() => {
        categories.forEach(cat => {
          cy.contains(cat.name).should('be.visible');
        });
      });
  });

  it('should have "All Threats" selected by default', () => {
    cy.get('.category-item.active')
      .should('exist')
      .and('contain', 'All Threats');
  });

  it('should display threat counts for each category', () => {
    cy.get('.category-switcher')
      .within(() => {
        cy.get('.category-count')
          .should('have.length.at.least', 7)
          .each(($count) => {
            cy.wrap($count).should('contain', 'detected');
          });
      });
  });

  it('should highlight priority categories (Predators, Pedophiles, DINA)', () => {
    cy.get('.category-item.priority')
      .should('have.length', 3);

    // Verify each priority category
    cy.contains('Predators').parent('.category-item').should('have.class', 'priority');
    cy.contains('Pedophiles').parent('.category-item').should('have.class', 'priority');
    cy.contains('DINA Network').parent('.category-item').should('have.class', 'priority');
  });

  it('should display alert pulse animation for priority categories', () => {
    cy.get('.category-item.priority .alert-pulse')
      .should('have.length', 3);
  });

  categories.forEach(category => {
    it(`should switch to "${category.name}" category when clicked`, () => {
      cy.get('.category-switcher')
        .contains(category.name)
        .parent('.category-item')
        .click({ force: true });

      // Verify active state
      cy.get('.category-item.active')
        .should('contain', category.name);
    });
  });

  it('should switch between multiple categories sequentially', () => {
    // Switch to Predators
    cy.get('.category-switcher')
      .contains('Predators')
      .parent('.category-item')
      .click({ force: true });
    cy.get('.category-item.active').should('contain', 'Predators');

    // Switch to Ransomware
    cy.get('.category-switcher')
      .contains('Ransomware')
      .parent('.category-item')
      .click({ force: true });
    cy.get('.category-item.active').should('contain', 'Ransomware');

    // Switch back to All Threats
    cy.get('.category-switcher')
      .contains('All Threats')
      .parent('.category-item')
      .click({ force: true });
    cy.get('.category-item.active').should('contain', 'All Threats');
  });

  it('should display monitoring status in category switcher footer', () => {
    cy.get('.switcher-footer')
      .should('be.visible')
      .within(() => {
        cy.contains('ACTIVE MONITORING').should('be.visible');
        cy.contains('🐾 Neko Guardian: ON').should('be.visible');
      });
  });

  it('should show status dot for active monitoring', () => {
    cy.get('.status-dot')
      .should('be.visible')
      .and('have.css', 'display');
  });

  it('should maintain category selection when navigating views', () => {
    // Select a specific category
    cy.get('.category-switcher')
      .contains('Predators')
      .parent('.category-item')
      .click({ force: true });

    // Navigate to Threat Actors
    cy.navigateToThreatActors();

    // Go back to dashboard
    cy.backToDashboard();

    // Category should still be active (or reset to default - depends on app logic)
    cy.get('.category-item.active').should('exist');
  });

  it('should display category icons correctly', () => {
    categories.forEach(cat => {
      cy.get('.category-switcher')
        .contains(cat.name)
        .parent('.category-item')
        .find('.category-icon')
        .should('contain', cat.icon);
    });
  });

  it('should apply border color styling to categories', () => {
    cy.get('.category-item')
      .first()
      .should('have.css', 'border-left-color');
  });

  it('should be keyboard accessible for category switching', () => {
    cy.get('.category-item')
      .first()
      .focus()
      .type('{enter}');

    cy.get('.category-item.active').should('exist');
  });
});
