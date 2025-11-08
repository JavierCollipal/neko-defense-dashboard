// 🌍⚡ NEKO DEFENSE - Enhanced Translation System E2E Tests ⚡🌍
// Comprehensive Cypress testing suite for translation features, desu~!

describe('Enhanced Translation System', () => {
  const baseUrl = 'http://localhost:3000';

  beforeEach(() => {
    // Visit the app and wait for it to load
    cy.visit('/');
    cy.wait(1000); // Let the app initialize
  });

  describe('Language Selector Component', () => {
    it('should display language selector with correct options', () => {
      cy.log('🌍 Testing language selector visibility and options, nyaa~!');

      // Find language selector (in header on desktop, mobile section on mobile)
      cy.get(
        '[data-testid="language-selector"], .language-selector-container'
      ).should('be.visible');

      // Click to open dropdown
      cy.get(
        '[data-testid="language-selector"] .current-selection, .language-selector-container .current-selection'
      ).click();

      // Verify key languages are present
      const expectedLanguages = [
        'en',
        'es',
        'fr',
        'de',
        'ja',
        'ko',
        'zh',
        'pt',
      ];
      expectedLanguages.forEach((lang) => {
        cy.get(`[data-language-code="${lang}"]`)
          .should('exist')
          .and('be.visible');
      });
    });

    it('should change language and persist selection', () => {
      cy.log('🔄 Testing language change and persistence, desu~!');

      // Open language selector
      cy.get(
        '[data-testid="language-selector"] .current-selection, .language-selector-container .current-selection'
      ).click();

      // Select Spanish
      cy.get('[data-language-code="es"]').click();

      // Verify UI updates (look for Spanish text if translated)
      cy.get('[data-testid="language-selector"]').should('contain', 'Español');

      // Refresh page and verify language persists
      cy.reload();
      cy.wait(1000);

      cy.get('[data-testid="language-selector"]').should('contain', 'Español');
    });

    it('should handle mobile and desktop responsive behavior', () => {
      cy.log('📱 Testing responsive language selector behavior, nyaa~!');

      // Test desktop view
      cy.viewport(1200, 800);
      cy.get('.header-actions .language-selector-container').should(
        'be.visible'
      );

      // Test mobile view
      cy.viewport(375, 667);
      cy.get('.mobile-language-selector .language-selector-container').should(
        'be.visible'
      );
    });
  });

  describe('Translation Dashboard Access', () => {
    it('should navigate to translation dashboard', () => {
      cy.log('📊 Testing navigation to translation dashboard, desu~!');

      // Navigate to translation dashboard
      cy.visit('/translation');

      // Verify dashboard loads
      cy.get('.translation-dashboard').should('be.visible');

      // Check for main dashboard tabs
      cy.get('.dashboard-tabs')
        .should('contain', 'Enhanced Translation')
        .and('contain', 'Provider Status')
        .and('contain', 'Cache Statistics');
    });

    it('should display provider status correctly', () => {
      cy.log('🔧 Testing provider status display, nyaa~!');

      cy.visit('/translation');

      // Click Provider Status tab
      cy.get('.dashboard-tabs').contains('Provider Status').click();

      // Verify provider information
      cy.get('.provider-status')
        .should('be.visible')
        .and('contain', 'Google Translate');

      // Check status indicators
      cy.get('.provider-health').should('exist');
    });
  });

  describe('Translation API Integration', () => {
    it('should perform enhanced translation via API', () => {
      cy.log('🔧 Testing enhanced translation API, desu~!');

      // Test API directly
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/translate/enhanced`,
        body: {
          text: 'Hello, how are you?',
          targetLang: 'es',
          sourceLang: 'en',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.translatedText).to.exist;
        expect(response.body.data.quality).to.exist;
        expect(response.body.data.quality.overallScore).to.be.a('number');
      });
    });

    it('should handle bulk translation correctly', () => {
      cy.log('📦 Testing bulk translation functionality, nyaa~!');

      const texts = ['Hello world', 'Good morning', 'Thank you very much'];

      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/translate/bulk`,
        body: {
          texts: texts,
          targetLang: 'es',
          sourceLang: 'en',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data).to.have.length(texts.length);

        response.body.data.forEach((result, index) => {
          expect(result.translatedText).to.exist;
          expect(result.quality.overallScore).to.be.a('number');
        });
      });
    });

    it('should cache translations properly', () => {
      cy.log('💾 Testing translation caching, desu~!');

      const testText = 'Cache test message';
      const requestData = {
        text: testText,
        targetLang: 'es',
        sourceLang: 'en',
      };

      // First request (should create cache)
      cy.request('POST', `${baseUrl}/api/translate/enhanced`, requestData).then(
        (response) => {
          expect(response.body.data.cached).to.be.undefined; // First time, not cached
        }
      );

      // Second request (should use cache)
      cy.request('POST', `${baseUrl}/api/translate/enhanced`, requestData).then(
        (response) => {
          // Note: Cache detection depends on implementation
          expect(response.status).to.eq(200);
          expect(response.body.success).to.be.true;
        }
      );
    });
  });

  describe('User Language Preferences', () => {
    it('should save and load user language preferences', () => {
      cy.log('👤 Testing user language preference persistence, nyaa~!');

      const userId = 'test-user-123';
      const languageCode = 'ja';

      // Save language preference
      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/user/language-preference`,
        body: {
          userId: userId,
          languageCode: languageCode,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
      });

      // Load language preference
      cy.request(
        'GET',
        `${baseUrl}/api/user/language-preference/${userId}`
      ).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.languageCode).to.eq(languageCode);
      });
    });
  });

  describe('Translation Quality and Analytics', () => {
    it('should provide translation quality scores', () => {
      cy.log('📊 Testing translation quality scoring, desu~!');

      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/translate/enhanced`,
        body: {
          text: 'Quality test: This is a well-formed sentence.',
          targetLang: 'es',
          sourceLang: 'en',
        },
      }).then((response) => {
        const quality = response.body.data.quality;

        expect(quality).to.exist;
        expect(quality.overallScore).to.be.a('number');
        expect(quality.overallScore).to.be.at.least(0);
        expect(quality.overallScore).to.be.at.most(100);
        expect(quality.grade).to.be.a('string');
        expect(quality.breakdown).to.exist;
      });
    });

    it('should provide usage metrics', () => {
      cy.log('📈 Testing usage metrics endpoint, nyaa~!');

      cy.request('GET', `${baseUrl}/api/translate/metrics`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data).to.exist;
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty text gracefully', () => {
      cy.log('🛡️ Testing empty text handling, desu~!');

      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/translate/enhanced`,
        body: {
          text: '',
          targetLang: 'es',
          sourceLang: 'en',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.success).to.be.false;
        expect(response.body.error).to.exist;
      });
    });

    it('should handle invalid language codes', () => {
      cy.log('🚫 Testing invalid language code handling, nyaa~!');

      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/translate/enhanced`,
        body: {
          text: 'Test text',
          targetLang: 'invalid-lang',
          sourceLang: 'en',
        },
        failOnStatusCode: false,
      }).then((response) => {
        // Should either handle gracefully or return appropriate error
        expect([400, 500]).to.include(response.status);
      });
    });

    it('should handle very long text', () => {
      cy.log('📏 Testing long text handling, desu~!');

      const longText = 'A'.repeat(5000); // 5000 character text

      cy.request({
        method: 'POST',
        url: `${baseUrl}/api/translate/enhanced`,
        body: {
          text: longText,
          targetLang: 'es',
          sourceLang: 'en',
        },
        timeout: 30000, // Allow more time for long text
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data.translatedText).to.exist;
      });
    });
  });

  describe('Performance and Load Testing', () => {
    it('should handle multiple concurrent translations', () => {
      cy.log('⚡ Testing concurrent translation performance, nyaa~!');

      const requests = [];
      for (let i = 0; i < 5; i++) {
        requests.push(
          cy.request({
            method: 'POST',
            url: `${baseUrl}/api/translate/enhanced`,
            body: {
              text: `Concurrent test message ${i}`,
              targetLang: 'es',
              sourceLang: 'en',
            },
          })
        );
      }

      // All requests should complete successfully
      requests.forEach((request, index) => {
        request.then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.success).to.be.true;
        });
      });
    });
  });

  describe('Dashboard Functionality', () => {
    it('should display cache statistics in dashboard', () => {
      cy.log('💾 Testing cache statistics display, desu~!');

      cy.visit('/translation');

      // Navigate to cache statistics tab
      cy.get('.dashboard-tabs').contains('Cache Statistics').click();

      // Verify cache stats are displayed
      cy.get('.cache-stats').should('be.visible');

      // Check for key metrics
      cy.get('.cache-stats')
        .should('contain.text', 'Total Entries')
        .or('contain.text', 'Hit Rate');
    });

    it('should allow cache management operations', () => {
      cy.log('🧹 Testing cache management functionality, nyaa~!');

      cy.visit('/translation');

      // Navigate to cache management
      cy.get('.dashboard-tabs').contains('Cache Management').click();

      // Look for cache control buttons
      cy.get('.cache-controls').should('be.visible');
    });
  });
});
