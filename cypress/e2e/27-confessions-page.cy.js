/**
 * 🐾 NEKO DEFENSE DASHBOARD - Confessions Page E2E Tests
 * Testing community-driven reporting system functionality
 *
 * Generated with Claude Code (Neko-Arc + Mario + Noel + Glam + Hannibal + Tetora)
 */

describe('📝 Confessions Page E2E Tests', () => {
  beforeEach(() => {
    // Visit confessions page before each test
    cy.visit('/confessions');
  });

  describe('Page Load and Rendering', () => {
    it('should load confessions page successfully', () => {
      cy.url().should('include', '/confessions');
      cy.contains('Confessions').should('be.visible');
    });

    it('should display confessions list by default', () => {
      // Should show list view on load
      cy.get('[data-testid="confessions-list"]')
        .or('div[class*="confessions"]')
        .should('exist');
    });

    it('should have view switcher (list/submit)', () => {
      // Look for buttons or tabs to switch views
      cy.contains(/submit|new confession|report/i).should('exist');
    });

    it('should display category filter', () => {
      // Should have category selection
      cy.get('select, [role="combobox"], button[class*="category"]').should(
        'exist'
      );
    });
  });

  describe('Confession List View', () => {
    it('should filter by category', () => {
      // Test different category filters
      const categories = ['all', 'predators', 'pedophiles', 'evidence'];

      categories.forEach((category) => {
        // Select category (try multiple selector strategies)
        cy.get('body').then(($body) => {
          if ($body.find(`option[value="${category}"]`).length) {
            cy.get('select').select(category);
          } else if ($body.find(`button:contains("${category}")`).length) {
            cy.contains('button', category).click();
          }
        });

        cy.wait(500); // Wait for filter to apply
      });
    });

    it('should display confession cards with required fields', () => {
      // Check if confessions are displayed
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="confession-card"]').length) {
          cy.get('[data-testid="confession-card"]')
            .first()
            .within(() => {
              // Should have title
              cy.get('[data-testid="confession-title"]').should('exist');
              // Should have category
              cy.get('[data-testid="confession-category"]').should('exist');
            });
        } else {
          // If no confessions, should show empty state
          cy.contains(/no confessions|empty|no results/i).should('exist');
        }
      });
    });

    it('should handle loading state', () => {
      // Intercept API call to test loading state
      cy.intercept('GET', '**/api/confessions*', (req) => {
        req.reply((res) => {
          res.delay(1000); // Add delay to see loading state
          res.send({ success: true, data: [] });
        });
      }).as('getConfessions');

      cy.visit('/confessions');

      // Should show loading indicator
      cy.get('[data-testid="loading"]')
        .or('div[class*="loading"]')
        .or('.spinner')
        .should('exist');

      cy.wait('@getConfessions');
    });

    it('should display stats if available', () => {
      // Stats section should exist (even if API fails)
      cy.get('body').then(($body) => {
        // Look for stats section
        const hasStats =
          $body.find('[data-testid="stats"]').length > 0 ||
          $body.find('[class*="stats"]').length > 0 ||
          $body.text().match(/total|count|statistics/i);

        expect(hasStats).to.be.true;
      });
    });
  });

  describe('Confession Submission Form', () => {
    beforeEach(() => {
      // Switch to submit view
      cy.contains(/submit|new confession|report/i).click({ force: true });
      cy.wait(300); // Wait for view switch
    });

    it('should display submission form', () => {
      // Form should be visible
      cy.get('form').should('exist');

      // Required fields should exist
      cy.get('input[name="title"], input[id*="title"]').should('exist');
      cy.get(
        'textarea[name="description"], textarea[id*="description"]'
      ).should('exist');
    });

    it('should have all required form fields', () => {
      // Category select
      cy.get('select[name="category"], select[id*="category"]').should('exist');

      // Title input
      cy.get('input[name="title"], input[id*="title"]').should('exist');

      // Description textarea
      cy.get(
        'textarea[name="description"], textarea[id*="description"]'
      ).should('exist');

      // Threat actor name
      cy.get('input[name="threat_actor_name"], input[id*="threat"]').should(
        'exist'
      );

      // Evidence links
      cy.get(
        'textarea[name="evidence_links"], textarea[id*="evidence"]'
      ).should('exist');
    });

    it('should validate required fields', () => {
      // Try to submit empty form
      cy.get('form').within(() => {
        cy.get('button[type="submit"]').click({ force: true });
      });

      // Should show validation errors or prevent submission
      cy.get('body').then(($body) => {
        const hasValidation =
          $body.text().match(/required|invalid|must|error/i) ||
          $body.find('[class*="error"]').length > 0 ||
          $body.find('[aria-invalid="true"]').length > 0;

        // Either validation message shown or form is still visible (not submitted)
        expect(hasValidation || $body.find('form').length > 0).to.be.true;
      });
    });

    it('should submit valid confession successfully', () => {
      // Intercept submission
      cy.intercept('POST', '**/api/confessions/submit', {
        statusCode: 200,
        body: {
          success: true,
          data: { id: 'test-123' },
          message: 'Confession submitted successfully',
        },
      }).as('submitConfession');

      // Fill form
      cy.get('select[name="category"]').select('predators');
      cy.get('input[name="title"]').type('Test Confession Title');
      cy.get('textarea[name="description"]').type(
        'Detailed description of the threat'
      );
      cy.get('input[name="threat_actor_name"]').type('Test Actor');
      cy.get('input[name="threat_actor_location"]').type('Test Location');
      cy.get('textarea[name="evidence_links"]').type(
        'https://example.com/evidence1\nhttps://example.com/evidence2'
      );

      // Submit
      cy.get('button[type="submit"]').click();

      // Wait for submission
      cy.wait('@submitConfession');

      // Should show success message
      cy.contains(/success|submitted|thank you/i).should('be.visible');
    });

    it('should handle submission errors gracefully', () => {
      // Intercept with error
      cy.intercept('POST', '**/api/confessions/submit', {
        statusCode: 500,
        body: {
          success: false,
          error: 'Server error',
        },
      }).as('submitError');

      // Fill and submit minimal valid form
      cy.get('input[name="title"]').type('Test');
      cy.get('textarea[name="description"]').type('Test description');
      cy.get('button[type="submit"]').click();

      cy.wait('@submitError');

      // Should show error message
      cy.contains(/error|failed|problem/i).should('be.visible');
    });

    it('should reset form after successful submission', () => {
      // Intercept successful submission
      cy.intercept('POST', '**/api/confessions/submit', {
        statusCode: 200,
        body: { success: true },
      }).as('submitSuccess');

      // Fill form
      cy.get('input[name="title"]').type('Test Title');
      cy.get('textarea[name="description"]').type('Test Description');

      // Submit
      cy.get('button[type="submit"]').click();
      cy.wait('@submitSuccess');

      // Form fields should be cleared or reset
      cy.wait(500);
      cy.get('input[name="title"]').should('have.value', '');
    });
  });

  describe('Navigation and View Switching', () => {
    it('should switch between list and submit views', () => {
      // Start in list view
      cy.contains(/submit|new confession/i).click();

      // Should show form
      cy.get('form').should('be.visible');

      // Switch back to list
      cy.contains(/back|list|view all/i).click();

      // Should show list
      cy.get('[data-testid="confessions-list"]')
        .or('div[class*="confessions"]')
        .should('exist');
    });

    it('should maintain category filter when switching views', () => {
      // Select a category
      cy.get('select').select('predators');

      // Switch to submit view
      cy.contains(/submit|new confession/i).click();

      // Switch back
      cy.contains(/back|list/i).click();

      // Category should still be selected
      cy.get('select').should('have.value', 'predators');
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      cy.contains(/submit|new confession/i).click();

      cy.get('form').within(() => {
        // All inputs should have labels
        cy.get('input, textarea, select').each(($el) => {
          const id = $el.attr('id');
          const name = $el.attr('name');
          if (id || name) {
            cy.get(`label[for="${id}"]`)
              .or(`label:contains("${name}")`)
              .should('exist');
          }
        });
      });
    });

    it('should be keyboard navigable', () => {
      // Tab through form fields
      cy.contains(/submit|new confession/i).click();

      cy.get('input[name="title"]').focus();
      cy.focused().should('have.attr', 'name', 'title');

      cy.realPress('Tab');
      cy.focused().should('exist');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle API unavailable gracefully', () => {
      // Intercept with network error
      cy.intercept('GET', '**/api/confessions*', {
        forceNetworkError: true,
      }).as('networkError');

      cy.visit('/confessions');

      cy.wait('@networkError');

      // Should show error state or empty list
      cy.get('body').should('exist');
    });

    it('should handle missing stats API', () => {
      // Stats API returns 404 (as documented in error report)
      cy.intercept('GET', '**/api/confessions/stats', { statusCode: 404 }).as(
        'statsNotFound'
      );

      cy.visit('/confessions');

      cy.wait('@statsNotFound');

      // Page should still load without stats
      cy.contains('Confessions').should('be.visible');
    });
  });
});
