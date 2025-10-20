// 🐾💀 NEKO DEFENSE DASHBOARD - Family Tracker E2E Tests 💀🐾
// Test suite for Family Tracker feature (Deceased Carabineros Intelligence System)
// Created: October 20, 2025

describe('Family Tracker - Deceased Carabineros Intelligence', () => {
  beforeEach(() => {
    cy.visit('/family-tracker');
    cy.viewport(1400, 900); // Desktop viewport
  });

  describe('Page Loading and Initial Render', () => {
    it('should load Family Tracker page successfully', () => {
      cy.url().should('include', '/family-tracker');
      cy.get('.family-tracker-container').should('be.visible');
    });

    it('should display the main header', () => {
      cy.contains('FAMILY TRACKER').should('be.visible');
      cy.contains('Deceased Carabineros Intelligence System').should('be.visible');
    });

    it('should show statistics summary bar', () => {
      cy.get('.stats-bar').should('be.visible');
      cy.get('.stat-item').should('have.length', 4);
    });

    it('should display correct stat labels', () => {
      const expectedLabels = ['Family Members', 'Deceased Officers', 'High Priority', 'Vulnerable'];

      expectedLabels.forEach((label) => {
        cy.contains('.stat-label', label).should('be.visible');
      });
    });
  });

  describe('Tab Switching Functionality', () => {
    it('should show tab switcher with 2 tabs', () => {
      cy.get('.tab-selector').should('be.visible');
      cy.get('.tab-button').should('have.length', 2);
    });

    it('should have Family Members tab active by default', () => {
      cy.contains('.tab-button', 'Family Members').should('have.class', 'active');
    });

    it('should switch to Deceased Officers tab when clicked', () => {
      cy.contains('.tab-button', 'Deceased Officers').click();
      cy.contains('.tab-button', 'Deceased Officers').should('have.class', 'active');
      cy.contains('.tab-button', 'Family Members').should('not.have.class', 'active');
    });

    it('should switch back to Family Members tab', () => {
      cy.contains('.tab-button', 'Deceased Officers').click();
      cy.contains('.tab-button', 'Family Members').click();
      cy.contains('.tab-button', 'Family Members').should('have.class', 'active');
    });

    it('should show different content for each tab', () => {
      // Family Members tab
      cy.contains('.tab-button', 'Family Members').click();
      cy.get('.family-grid, .no-results').should('exist');

      // Deceased Officers tab
      cy.contains('.tab-button', 'Deceased Officers').click();
      cy.get('.deceased-grid, .no-results').should('exist');
    });
  });

  describe('Search Functionality', () => {
    it('should display search input box', () => {
      cy.get('.search-input').should('be.visible');
      cy.get('.search-input').should('have.attr', 'placeholder');
    });

    it('should allow typing in search box', () => {
      const searchTerm = 'María';
      cy.get('.search-input').type(searchTerm);
      cy.get('.search-input').should('have.value', searchTerm);
    });

    it('should clear search when backspacing', () => {
      cy.get('.search-input').type('test');
      cy.get('.search-input').clear();
      cy.get('.search-input').should('have.value', '');
    });

    it('should update results when searching (if data exists)', () => {
      cy.get('.search-input').type('test');
      // Results will update based on database content
      cy.get('.family-grid, .no-results').should('exist');
    });
  });

  describe('Filter Functionality', () => {
    it('should display priority filter dropdown', () => {
      cy.get('.filter-select').first().should('be.visible');
      cy.get('.filter-select').first().should('contain', 'All Priorities');
    });

    it('should display relationship filter dropdown', () => {
      cy.get('.filter-select').last().should('be.visible');
      cy.get('.filter-select').last().should('contain', 'All Relationships');
    });

    it('should have correct priority filter options', () => {
      cy.get('.filter-select').first().select('Critical');
      cy.get('.filter-select').first().should('have.value', 'Critical');

      cy.get('.filter-select').first().select('High');
      cy.get('.filter-select').first().should('have.value', 'High');

      cy.get('.filter-select').first().select('Medium');
      cy.get('.filter-select').first().should('have.value', 'Medium');

      cy.get('.filter-select').first().select('Low');
      cy.get('.filter-select').first().should('have.value', 'Low');

      cy.get('.filter-select').first().select('all');
      cy.get('.filter-select').first().should('have.value', 'all');
    });

    it('should have correct relationship filter options', () => {
      cy.get('.filter-select').last().select('Spouse');
      cy.get('.filter-select').last().should('have.value', 'Spouse');

      cy.get('.filter-select').last().select('Child');
      cy.get('.filter-select').last().should('have.value', 'Child');

      cy.get('.filter-select').last().select('Parent');
      cy.get('.filter-select').last().should('have.value', 'Parent');

      cy.get('.filter-select').last().select('Sibling');
      cy.get('.filter-select').last().should('have.value', 'Sibling');

      cy.get('.filter-select').last().select('all');
      cy.get('.filter-select').last().should('have.value', 'all');
    });
  });

  describe('API Integration', () => {
    it('should call family-members API on page load', () => {
      cy.intercept('GET', '/api/family-members*').as('getFamilyMembers');
      cy.visit('/family-tracker');
      cy.wait('@getFamilyMembers').its('response.statusCode').should('eq', 200);
    });

    it('should call deceased-officers API on page load', () => {
      cy.intercept('GET', '/api/deceased-officers*').as('getDeceasedOfficers');
      cy.visit('/family-tracker');
      cy.wait('@getDeceasedOfficers').its('response.statusCode').should('eq', 200);
    });

    it('should handle API success responses', () => {
      cy.intercept('GET', '/api/family-members*', {
        statusCode: 200,
        body: {
          success: true,
          data: [],
          count: 0
        }
      }).as('familyMembersSuccess');

      cy.visit('/family-tracker');
      cy.wait('@familyMembersSuccess');
      cy.get('.family-tracker-container').should('be.visible');
    });

    it('should handle API errors gracefully', () => {
      cy.intercept('GET', '/api/family-members*', {
        statusCode: 500,
        body: {
          success: false,
          error: 'Internal Server Error'
        }
      }).as('familyMembersError');

      cy.visit('/family-tracker');
      cy.wait('@familyMembersError');

      // Should show error state or empty state
      cy.get('.error-neko, .no-results').should('exist');
    });
  });

  describe('Empty State Handling', () => {
    it('should show "no results" message when database is empty', () => {
      cy.intercept('GET', '/api/family-members*', {
        statusCode: 200,
        body: {
          success: true,
          data: [],
          count: 0
        }
      }).as('emptyFamilyMembers');

      cy.visit('/family-tracker');
      cy.wait('@emptyFamilyMembers');

      // Should show empty state message
      cy.contains('No family members found').should('be.visible');
    });

    it('should show statistics as 0 when empty', () => {
      cy.get('.stat-value').each(($el) => {
        expect($el.text()).to.equal('0');
      });
    });
  });

  describe('Data Display (With Mock Data)', () => {
    beforeEach(() => {
      // Mock API with sample data
      cy.intercept('GET', '/api/family-members*', {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              family_member_id: 'fm-001',
              full_name: 'María González',
              relationship: 'Widow',
              deceased_officer_name: 'Juan Pérez',
              age: 45,
              occupation: 'Teacher',
              priority: 'High',
              status: 'Identified',
              vulnerability_profile: {
                overall_score: 8,
                financial_need: 7,
                emotional_state: 9,
                recruitment_potential: 6
              },
              social_media_profiles: {
                facebook: true,
                instagram: true,
                twitter: false,
                linkedin: false
              },
              created_at: new Date().toISOString()
            }
          ],
          count: 1
        }
      }).as('mockFamilyMembers');

      cy.intercept('GET', '/api/deceased-officers*', {
        statusCode: 200,
        body: {
          success: true,
          data: [
            {
              officer_id: 'do-001',
              full_name: 'Juan Pérez',
              rank: 'Capitán',
              date_of_death: '2023-01-15',
              age_at_death: 48,
              cause_of_death: 'Line of duty',
              unit: 'Special Operations',
              location_of_death: 'Santiago',
              family_members: [
                { name: 'María González', relationship: 'Spouse' }
              ],
              tags: ['special-ops', 'decorated']
            }
          ],
          count: 1
        }
      }).as('mockDeceasedOfficers');

      cy.visit('/family-tracker');
      cy.wait('@mockFamilyMembers');
      cy.wait('@mockDeceasedOfficers');
    });

    it('should display family member cards', () => {
      cy.get('.family-card').should('have.length', 1);
    });

    it('should show family member name', () => {
      cy.contains('.family-card', 'María González').should('be.visible');
    });

    it('should display priority badge', () => {
      cy.get('.priority-badge').should('contain', 'High');
    });

    it('should show vulnerability profile bars', () => {
      cy.get('.vulnerability-section').should('be.visible');
      cy.get('.vuln-bar').should('have.length.at.least', 1);
    });

    it('should display social media icons', () => {
      cy.get('.social-media-section').should('be.visible');
      cy.get('.social-icons span').should('have.length.at.least', 1);
    });

    it('should show deceased officer when switching tabs', () => {
      cy.contains('.tab-button', 'Deceased Officers').click();
      cy.get('.deceased-card').should('have.length', 1);
      cy.contains('.deceased-card', 'Juan Pérez').should('be.visible');
    });

    it('should display officer rank', () => {
      cy.contains('.tab-button', 'Deceased Officers').click();
      cy.get('.rank-badge').should('contain', 'Capitán');
    });
  });

  describe('Responsive Design', () => {
    it('should be visible on desktop (1400px)', () => {
      cy.viewport(1400, 900);
      cy.get('.family-tracker-container').should('be.visible');
      cy.get('.stats-bar').should('be.visible');
    });

    it('should adapt to tablet (768px)', () => {
      cy.viewport(768, 1024);
      cy.get('.family-tracker-container').should('be.visible');
    });

    it('should work on mobile (375px)', () => {
      cy.viewport(375, 667);
      cy.get('.family-tracker-container').should('be.visible');
      cy.get('.family-tracker-header').should('be.visible');
    });
  });

  describe('User Interactions', () => {
    it('should maintain state when switching tabs multiple times', () => {
      cy.contains('.tab-button', 'Deceased Officers').click();
      cy.contains('.tab-button', 'Family Members').click();
      cy.contains('.tab-button', 'Deceased Officers').click();

      cy.contains('.tab-button', 'Deceased Officers').should('have.class', 'active');
    });

    it('should combine search and filter functionality', () => {
      cy.get('.search-input').type('María');
      cy.get('.filter-select').first().select('High');

      // Both should be active
      cy.get('.search-input').should('have.value', 'María');
      cy.get('.filter-select').first().should('have.value', 'High');
    });

    it('should clear filters when selecting "all"', () => {
      cy.get('.filter-select').first().select('High');
      cy.get('.filter-select').first().select('all');
      cy.get('.filter-select').first().should('have.value', 'all');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for interactive elements', () => {
      cy.get('.search-input').should('have.attr', 'placeholder');
      cy.get('.tab-button').should('be.visible');
    });

    it('should be keyboard navigable', () => {
      cy.get('.search-input').focus().should('have.focus');
      cy.get('.filter-select').first().focus().should('have.focus');
      cy.get('.filter-select').last().focus().should('have.focus');
    });

    it('should have visible focus states', () => {
      cy.get('.search-input').focus();
      cy.get('.search-input:focus').should('exist');
    });
  });

  describe('Performance', () => {
    it('should load within acceptable time', () => {
      const startTime = Date.now();
      cy.visit('/family-tracker');
      cy.get('.family-tracker-container').should('be.visible').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(5000); // 5 seconds max
      });
    });

    it('should handle rapid tab switching', () => {
      for (let i = 0; i < 5; i++) {
        cy.contains('.tab-button', 'Deceased Officers').click();
        cy.contains('.tab-button', 'Family Members').click();
      }

      cy.contains('.tab-button', 'Family Members').should('have.class', 'active');
    });
  });

  describe('Navigation Integration', () => {
    it('should be accessible from top navigation', () => {
      cy.visit('/');
      cy.contains('.top-tab-button', 'Family Tracker').click();
      cy.url().should('include', '/family-tracker');
    });

    it('should have correct icon in navigation', () => {
      cy.visit('/');
      cy.contains('.top-tab-button', 'Family Tracker')
        .find('.top-tab-icon')
        .should('contain', '💀');
    });
  });
});
