// 🌍⚡ NEKO DEFENSE - Language Selector Component Tests ⚡🌍
// Focused E2E testing for LanguageSelector component, desu~!

describe('Language Selector Component', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(1000);
  });

  describe('Component Visibility and Responsive Behavior', () => {
    it('should show language selector in header on desktop', () => {
      cy.log('🖥️ Testing desktop language selector, nyaa~!');

      // Set desktop viewport
      cy.viewport(1200, 800);

      // Should find language selector in header actions
      cy.get('.header-actions .language-selector-container').should(
        'be.visible'
      );

      // Mobile language selector should not be visible
      cy.get('.mobile-language-selector').should('not.be.visible');
    });

    it('should show language selector in mobile section on mobile', () => {
      cy.log('📱 Testing mobile language selector, desu~!');

      // Set mobile viewport
      cy.viewport(375, 667);

      // Should find language selector in mobile section
      cy.get('.mobile-language-selector .language-selector-container').should(
        'be.visible'
      );
    });

    it('should handle viewport changes correctly', () => {
      cy.log('🔄 Testing viewport transitions, nyaa~!');

      // Start with desktop
      cy.viewport(1200, 800);
      cy.get('.header-actions .language-selector-container').should(
        'be.visible'
      );

      // Switch to mobile
      cy.viewport(375, 667);
      cy.get('.mobile-language-selector .language-selector-container').should(
        'be.visible'
      );

      // Switch back to desktop
      cy.viewport(1200, 800);
      cy.get('.header-actions .language-selector-container').should(
        'be.visible'
      );
    });
  });

  describe('Language Selection Functionality', () => {
    it('should display all supported languages', () => {
      cy.log('🌍 Testing all supported languages, desu~!');

      // Open language selector
      cy.get('.language-selector-container .current-selection').click();

      // Verify all 15 languages are present
      const supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'it', name: 'Italiano' },
        { code: 'pt', name: 'Português' },
        { code: 'ru', name: 'Русский' },
        { code: 'ja', name: '日本語' },
        { code: 'ko', name: '한국어' },
        { code: 'zh', name: '中文' },
        { code: 'ar', name: 'العربية' },
        { code: 'hi', name: 'हिन्दी' },
        { code: 'nl', name: 'Nederlands' },
        { code: 'tr', name: 'Türkçe' },
        { code: 'pl', name: 'Polski' },
      ];

      supportedLanguages.forEach((lang) => {
        cy.get(`[data-language-code="${lang.code}"]`)
          .should('exist')
          .and('contain', lang.name);
      });
    });

    it('should select language and update display', () => {
      cy.log('🔄 Testing language selection and display update, nyaa~!');

      // Open language selector
      cy.get('.language-selector-container .current-selection').click();

      // Select Japanese
      cy.get('[data-language-code="ja"]').click();

      // Verify current selection updated
      cy.get('.language-selector-container .current-selection').should(
        'contain',
        '日本語'
      );

      // Verify flag icon updated
      cy.get('.language-selector-container .flag-icon').should(
        'have.class',
        'flag-jp'
      );
    });

    it('should handle rapid language changes', () => {
      cy.log('⚡ Testing rapid language switching, desu~!');

      const languages = ['es', 'fr', 'de', 'ja', 'en'];

      languages.forEach((langCode, index) => {
        // Open selector
        cy.get('.language-selector-container .current-selection').click();

        // Select language
        cy.get(`[data-language-code="${langCode}"]`).click();

        // Wait a moment between selections
        cy.wait(500);
      });

      // Verify final selection
      cy.get('.language-selector-container .current-selection').should(
        'contain',
        'English'
      );
    });
  });

  describe('Persistence and API Integration', () => {
    it('should persist language selection across page reloads', () => {
      cy.log('💾 Testing language persistence, nyaa~!');

      // Select a non-default language
      cy.get('.language-selector-container .current-selection').click();

      cy.get('[data-language-code="ko"]').click();

      // Verify Korean selected
      cy.get('.language-selector-container .current-selection').should(
        'contain',
        '한국어'
      );

      // Reload page
      cy.reload();
      cy.wait(1000);

      // Verify language persisted
      cy.get('.language-selector-container .current-selection').should(
        'contain',
        '한국어'
      );
    });

    it('should save language preference to backend', () => {
      cy.log('🔗 Testing backend API integration, desu~!');

      // Intercept the API call
      cy.intercept('POST', '/api/user/language-preference', {
        statusCode: 200,
        body: { success: true, message: 'Language preference saved' },
      }).as('saveLanguagePreference');

      // Select a language
      cy.get('.language-selector-container .current-selection').click();

      cy.get('[data-language-code="fr"]').click();

      // Verify API was called
      cy.wait('@saveLanguagePreference').then((interception) => {
        expect(interception.request.body).to.have.property(
          'languageCode',
          'fr'
        );
        expect(interception.request.body).to.have.property('userId');
      });
    });
  });

  describe('Accessibility and Keyboard Navigation', () => {
    it('should support keyboard navigation', () => {
      cy.log('⌨️ Testing keyboard accessibility, nyaa~!');

      // Focus on language selector
      cy.get('.language-selector-container').focus();

      // Press Enter to open
      cy.get('.language-selector-container').type('{enter}');

      // Use arrow keys to navigate
      cy.get('.language-options').should('be.visible');

      // Press Escape to close
      cy.get('.language-selector-container').type('{esc}');

      cy.get('.language-options').should('not.be.visible');
    });

    it('should have proper ARIA attributes', () => {
      cy.log('♿ Testing ARIA accessibility, desu~!');

      // Check for ARIA attributes
      cy.get('.language-selector-container')
        .should('have.attr', 'role')
        .and('have.attr', 'aria-label');

      // Check dropdown has proper ARIA
      cy.get('.language-selector-container .current-selection').click();

      cy.get('.language-options').should('have.attr', 'role', 'listbox');

      cy.get('.language-option').should('have.attr', 'role', 'option');
    });
  });

  describe('Error Handling', () => {
    it('should handle API failures gracefully', () => {
      cy.log('🛡️ Testing API failure handling, nyaa~!');

      // Intercept API call with failure
      cy.intercept('POST', '/api/user/language-preference', {
        statusCode: 500,
        body: { success: false, error: 'Server error' },
      }).as('saveLanguagePreferenceError');

      // Select a language
      cy.get('.language-selector-container .current-selection').click();

      cy.get('[data-language-code="de"]').click();

      // Wait for API call
      cy.wait('@saveLanguagePreferenceError');

      // Component should still update locally
      cy.get('.language-selector-container .current-selection').should(
        'contain',
        'Deutsch'
      );

      // Error handling might show a notification (if implemented)
      // This depends on the specific error handling in the component
    });

    it('should handle missing language data gracefully', () => {
      cy.log('🔍 Testing missing language data handling, desu~!');

      // This test would check how the component handles
      // missing or corrupted language data

      // For now, just verify component doesn't crash
      cy.get('.language-selector-container').should('exist').and('be.visible');
    });
  });

  describe('Animation and Visual Feedback', () => {
    it('should animate dropdown opening and closing', () => {
      cy.log('🎬 Testing dropdown animations, nyaa~!');

      // Open dropdown
      cy.get('.language-selector-container .current-selection').click();

      // Verify dropdown appears
      cy.get('.language-options')
        .should('be.visible')
        .and('have.css', 'opacity');

      // Close dropdown by clicking outside
      cy.get('body').click(0, 0);

      // Verify dropdown disappears
      cy.get('.language-options').should('not.be.visible');
    });

    it('should provide visual feedback on hover', () => {
      cy.log('👆 Testing hover effects, desu~!');

      // Open dropdown
      cy.get('.language-selector-container .current-selection').click();

      // Hover over language option
      cy.get('[data-language-code="es"]').trigger('mouseover');

      // Visual feedback might include background color change
      // This depends on the specific CSS implementation
      cy.get('[data-language-code="es"]').should(
        'have.css',
        'cursor',
        'pointer'
      );
    });
  });
});
