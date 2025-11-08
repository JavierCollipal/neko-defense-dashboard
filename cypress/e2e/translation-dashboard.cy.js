// 📊⚡ NEKO DEFENSE - Translation Dashboard Tests ⚡📊
// Comprehensive testing for Translation Dashboard functionality, desu~!

describe('Translation Dashboard', () => {
  beforeEach(() => {
    cy.visit('/translation');
    cy.wait(1000);
  });

  describe('Dashboard Layout and Navigation', () => {
    it('should display translation dashboard with all tabs', () => {
      cy.log('📊 Testing dashboard layout and tabs, nyaa~!');

      // Verify main dashboard container
      cy.get('.translation-dashboard').should('be.visible');

      // Verify dashboard header
      cy.get('.dashboard-header')
        .should('contain', 'Enhanced Translation System')
        .and('contain', 'Professional-grade translation with quality scoring');

      // Verify all tabs are present
      const expectedTabs = [
        'Enhanced Translation',
        'Provider Status',
        'Cache Statistics',
        'Cache Management',
        'Usage Metrics',
      ];

      cy.get('.dashboard-tabs').within(() => {
        expectedTabs.forEach((tabName) => {
          cy.contains('.tab-button', tabName).should('be.visible');
        });
      });
    });

    it('should switch between tabs correctly', () => {
      cy.log('🔄 Testing tab switching functionality, desu~!');

      // Start with Enhanced Translation tab (default)
      cy.get('.tab-button.active').should('contain', 'Enhanced Translation');

      cy.get('.enhanced-translation-tab').should('be.visible');

      // Switch to Provider Status tab
      cy.get('.dashboard-tabs').contains('Provider Status').click();

      cy.get('.tab-button.active').should('contain', 'Provider Status');

      cy.get('.provider-status-tab').should('be.visible');

      // Switch to Cache Statistics tab
      cy.get('.dashboard-tabs').contains('Cache Statistics').click();

      cy.get('.tab-button.active').should('contain', 'Cache Statistics');

      cy.get('.cache-statistics-tab').should('be.visible');
    });
  });

  describe('Enhanced Translation Tab', () => {
    beforeEach(() => {
      cy.get('.dashboard-tabs').contains('Enhanced Translation').click();
    });

    it('should perform single translation', () => {
      cy.log('🌍 Testing single translation functionality, nyaa~!');

      // Fill in translation form
      cy.get('#translate-text').type(
        'Hello, this is a test message for translation.'
      );

      cy.get('#source-language').select('en');

      cy.get('#target-language').select('es');

      // Submit translation
      cy.get('#translate-button').click();

      // Verify translation result
      cy.get('#translation-result', { timeout: 10000 })
        .should('be.visible')
        .and('not.be.empty');

      // Verify quality score displayed
      cy.get('.quality-score')
        .should('be.visible')
        .and('contain', 'Quality Score:');

      cy.get('.quality-grade').should('be.visible');
    });

    it('should perform bulk translation', () => {
      cy.log('📦 Testing bulk translation functionality, desu~!');

      // Switch to bulk translation mode
      cy.get('#translation-mode-bulk').click();

      // Add multiple texts
      const testTexts = [
        'Good morning',
        'How are you today?',
        'Thank you very much',
      ];

      testTexts.forEach((text, index) => {
        if (index > 0) {
          cy.get('#add-text-button').click();
        }
        cy.get(`#bulk-text-${index}`).type(text);
      });

      cy.get('#bulk-target-language').select('fr');

      // Submit bulk translation
      cy.get('#bulk-translate-button').click();

      // Verify results
      cy.get('.bulk-results', { timeout: 15000 }).should('be.visible');

      testTexts.forEach((text, index) => {
        cy.get(`#bulk-result-${index}`)
          .should('be.visible')
          .and('not.be.empty');
      });
    });

    it('should display translation quality metrics', () => {
      cy.log('📊 Testing quality metrics display, nyaa~!');

      // Perform a translation
      cy.get('#translate-text').type(
        'This is a high-quality sentence for testing translation quality scoring.'
      );

      cy.get('#target-language').select('ja');

      cy.get('#translate-button').click();

      // Verify quality metrics
      cy.get('.quality-score', { timeout: 10000 }).should('be.visible');

      cy.get('.quality-breakdown')
        .should('be.visible')
        .within(() => {
          cy.contains('Length Score').should('exist');
          cy.contains('Content Score').should('exist');
          cy.contains('Uniqueness Score').should('exist');
          cy.contains('Error Score').should('exist');
        });

      // Verify grade display
      cy.get('.quality-grade')
        .should('be.visible')
        .and('match', /[A-F][+-]?/);
    });
  });

  describe('Provider Status Tab', () => {
    beforeEach(() => {
      cy.get('.dashboard-tabs').contains('Provider Status').click();
    });

    it('should display provider health status', () => {
      cy.log('🔧 Testing provider status display, desu~!');

      // Verify provider status section
      cy.get('.provider-status-tab').should('be.visible');

      // Check for Google Translate provider
      cy.get('.provider-card')
        .should('contain', 'Google Translate')
        .within(() => {
          cy.get('.provider-health').should('exist');

          cy.get('.provider-priority').should('exist');

          cy.get('.last-checked').should('exist');
        });

      // Check for status refresh button
      cy.get('#refresh-provider-status')
        .should('be.visible')
        .and('not.be.disabled');
    });

    it('should refresh provider status', () => {
      cy.log('🔄 Testing provider status refresh, nyaa~!');

      // Click refresh button
      cy.get('#refresh-provider-status').click();

      // Verify loading state
      cy.get('.provider-status-loading').should('be.visible');

      // Wait for refresh to complete
      cy.get('.provider-status-loading', { timeout: 10000 }).should(
        'not.exist'
      );

      // Verify updated timestamp
      cy.get('.last-checked').should('contain', 'just now');
    });

    it('should display test translation results', () => {
      cy.log('🧪 Testing provider test translation, desu~!');

      // Look for test translation section
      cy.get('.test-translation')
        .should('be.visible')
        .within(() => {
          cy.get('.test-input').should('contain', 'Hello');

          cy.get('.test-output').should('not.be.empty');
        });
    });
  });

  describe('Cache Statistics Tab', () => {
    beforeEach(() => {
      cy.get('.dashboard-tabs').contains('Cache Statistics').click();
    });

    it('should display cache metrics', () => {
      cy.log('💾 Testing cache statistics display, nyaa~!');

      // Verify cache stats section
      cy.get('.cache-statistics-tab').should('be.visible');

      // Check for key cache metrics
      cy.get('.cache-metrics').within(() => {
        cy.contains('Total Entries').should('exist');
        cy.contains('Total Hits').should('exist');
        cy.contains('Hit Rate').should('exist');
      });

      // Check for language breakdown
      cy.get('.language-breakdown')
        .should('be.visible')
        .and('contain', 'Language Breakdown');
    });

    it('should display cache statistics charts', () => {
      cy.log('📈 Testing cache statistics visualization, desu~!');

      // Look for charts or graphs (if implemented)
      cy.get('.cache-charts').should('be.visible');

      // Verify refresh button
      cy.get('#refresh-cache-stats').should('be.visible');
    });

    it('should refresh cache statistics', () => {
      cy.log('🔄 Testing cache stats refresh, nyaa~!');

      // Click refresh
      cy.get('#refresh-cache-stats').click();

      // Verify loading state
      cy.get('.cache-stats-loading').should('be.visible');

      // Wait for completion
      cy.get('.cache-stats-loading', { timeout: 5000 }).should('not.exist');
    });
  });

  describe('Cache Management Tab', () => {
    beforeEach(() => {
      cy.get('.dashboard-tabs').contains('Cache Management').click();
    });

    it('should display cache management controls', () => {
      cy.log('🧹 Testing cache management interface, nyaa~!');

      // Verify cache management section
      cy.get('.cache-management-tab').should('be.visible');

      // Check for management controls
      cy.get('.cache-controls').within(() => {
        cy.get('#clear-cache-button')
          .should('be.visible')
          .and('contain', 'Clear Cache');

        cy.get('#clear-language-cache').should('be.visible');

        cy.get('#clear-old-cache').should('be.visible');
      });
    });

    it('should handle cache clearing operations', () => {
      cy.log('🗑️ Testing cache clearing functionality, desu~!');

      // Test clear all cache (with confirmation)
      cy.get('#clear-cache-button').click();

      // Should show confirmation dialog
      cy.get('.confirmation-dialog')
        .should('be.visible')
        .and('contain', 'Are you sure?');

      // Cancel first
      cy.get('#confirm-cancel').click();

      cy.get('.confirmation-dialog').should('not.exist');

      // Try again and confirm
      cy.get('#clear-cache-button').click();
      cy.get('#confirm-clear').click();

      // Verify success message
      cy.get('.success-message', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'Cache cleared successfully');
    });

    it('should handle selective cache clearing', () => {
      cy.log('🎯 Testing selective cache clearing, nyaa~!');

      // Clear cache for specific language
      cy.get('#language-select').select('es');

      cy.get('#clear-language-cache').click();

      // Verify language-specific clearing
      cy.get('.success-message', { timeout: 5000 }).should(
        'contain',
        'Spanish cache cleared'
      );

      // Clear old cache entries
      cy.get('#days-old-input').type('7');

      cy.get('#clear-old-cache').click();

      cy.get('.success-message', { timeout: 5000 }).should(
        'contain',
        'Old cache entries cleared'
      );
    });
  });

  describe('Usage Metrics Tab', () => {
    beforeEach(() => {
      cy.get('.dashboard-tabs').contains('Usage Metrics').click();
    });

    it('should display usage analytics', () => {
      cy.log('📊 Testing usage metrics display, nyaa~!');

      // Verify usage metrics section
      cy.get('.usage-metrics-tab').should('be.visible');

      // Check for key metrics
      cy.get('.usage-overview').within(() => {
        cy.contains('Total Translations').should('exist');
        cy.contains('Average Quality').should('exist');
        cy.contains('Language Pairs').should('exist');
        cy.contains('Active Providers').should('exist');
      });
    });

    it('should display metrics with date filtering', () => {
      cy.log('📅 Testing date filtering for metrics, nyaa~!');

      // Set date range
      cy.get('#start-date').type('2025-01-01');

      cy.get('#end-date').type('2025-12-31');

      cy.get('#apply-date-filter').click();

      // Verify metrics update
      cy.get('.metrics-loading', { timeout: 5000 }).should('not.exist');

      cy.get('.filtered-metrics').should('be.visible');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle API errors gracefully', () => {
      cy.log('🛡️ Testing API error handling, nyaa~!');

      // Mock API error for translation
      cy.intercept('POST', '/api/translate/enhanced', {
        statusCode: 500,
        body: { success: false, error: 'Internal server error' },
      }).as('translationError');

      // Try to translate
      cy.get('#translate-text').type('Test error handling');

      cy.get('#translate-button').click();

      cy.wait('@translationError');

      // Verify error message displayed
      cy.get('.error-message')
        .should('be.visible')
        .and('contain', 'Translation failed');
    });

    it('should handle loading states properly', () => {
      cy.log('⏳ Testing loading states, desu~!');

      // Mock slow API response
      cy.intercept('POST', '/api/translate/enhanced', (req) => {
        req.reply((res) => {
          res.delay(2000);
          res.send({
            statusCode: 200,
            body: {
              success: true,
              data: {
                translatedText: 'Texto traducido',
                quality: { overallScore: 95, grade: 'A+' },
              },
            },
          });
        });
      }).as('slowTranslation');

      // Start translation
      cy.get('#translate-text').type('Test loading state');

      cy.get('#translate-button').click();

      // Verify loading indicator
      cy.get('.translation-loading').should('be.visible');

      cy.get('#translate-button').should('be.disabled');

      // Wait for completion
      cy.wait('@slowTranslation');

      cy.get('.translation-loading').should('not.exist');

      cy.get('#translate-button').should('not.be.disabled');
    });
  });

  describe('Responsive Design', () => {
    it('should work properly on mobile devices', () => {
      cy.log('📱 Testing mobile responsive design, nyaa~!');

      // Set mobile viewport
      cy.viewport(375, 667);

      // Verify dashboard adapts to mobile
      cy.get('.translation-dashboard').should('be.visible');

      // Check tabs are usable on mobile
      cy.get('.dashboard-tabs').should('be.visible');

      // Test tab switching on mobile
      cy.get('.dashboard-tabs').contains('Provider Status').click();

      cy.get('.provider-status-tab').should('be.visible');
    });

    it('should work properly on tablet devices', () => {
      cy.log('📱 Testing tablet responsive design, desu~!');

      // Set tablet viewport
      cy.viewport(768, 1024);

      // Verify dashboard layout
      cy.get('.translation-dashboard').should('be.visible');

      // Test functionality
      cy.get('#translate-text').type('Tablet test message');

      cy.get('#translate-button').click();

      cy.get('#translation-result', { timeout: 10000 }).should('be.visible');
    });
  });
});
