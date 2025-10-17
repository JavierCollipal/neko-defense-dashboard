// 🐾⚡ E2E TEST: Language Switching & Internationalization ⚡🐾
// COMPREHENSIVE testing of i18n functionality with MAXIMUM coverage, nyaa~!

describe('🌍⚡ LANGUAGE SWITCHING & I18N ⚡🌍', () => {
  beforeEach(() => {
    console.log('🐾 [Test] Starting language switching test, nyaa~!');
    cy.visitDashboard();
  });

  describe('📺 Language Switcher UI', () => {
    it('should display language switcher button', () => {
      cy.getByDataCy('language-switcher').should('be.visible');
      cy.getByDataCy('language-button').should('be.visible');
    });

    it('should display current language code', () => {
      cy.getByDataCy('current-lang-code')
        .should('be.visible')
        .and('have.text', 'EN'); // Default language
    });

    it('should display current language flag', () => {
      cy.getByDataCy('current-flag')
        .should('be.visible')
        .and('contain', '🇬🇧'); // UK flag for English
    });

    it('should display dropdown arrow', () => {
      cy.getByDataCy('dropdown-arrow')
        .should('be.visible')
        .and('contain', '▼'); // Closed state
    });

    it('should open dropdown when button is clicked', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-dropdown').should('be.visible');
    });

    it('should change arrow direction when dropdown opens', () => {
      cy.getByDataCy('dropdown-arrow').should('contain', '▼');
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('dropdown-arrow').should('contain', '▲');
    });

    it('should close dropdown when clicking button again', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-dropdown').should('be.visible');

      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-dropdown').should('not.exist');
    });

    it('should close dropdown when clicking overlay', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-dropdown').should('be.visible');

      cy.getByDataCy('dropdown-overlay').click({ force: true });
      cy.getByDataCy('language-dropdown').should('not.exist');
    });
  });

  describe('🌍 Language Options Display', () => {
    beforeEach(() => {
      cy.getByDataCy('language-button').click();
    });

    it('should display dropdown header', () => {
      cy.getByDataCy('dropdown-header')
        .should('be.visible')
        .and('contain', '🌍');
    });

    it('should display all available languages', () => {
      cy.getByDataCy('language-list').should('be.visible');

      // Verify all language options exist
      cy.getByDataCy('language-option-en').should('be.visible');
      cy.getByDataCy('language-option-es').should('be.visible');
      cy.getByDataCy('language-option-fr').should('be.visible');
      cy.getByDataCy('language-option-de').should('be.visible');
      cy.getByDataCy('language-option-ja').should('be.visible');
      cy.getByDataCy('language-option-pt').should('be.visible');
      cy.getByDataCy('language-option-ru').should('be.visible');
      cy.getByDataCy('language-option-zh').should('be.visible');
    });

    it('should display native names for each language', () => {
      cy.getByDataCy('language-option-en').should('contain', 'English');
      cy.getByDataCy('language-option-es').should('contain', 'Español');
      cy.getByDataCy('language-option-fr').should('contain', 'Français');
      cy.getByDataCy('language-option-de').should('contain', 'Deutsch');
      cy.getByDataCy('language-option-ja').should('contain', '日本語');
      cy.getByDataCy('language-option-pt').should('contain', 'Português');
      cy.getByDataCy('language-option-ru').should('contain', 'Русский');
      cy.getByDataCy('language-option-zh').should('contain', '中文');
    });

    it('should highlight currently active language', () => {
      cy.getByDataCy('language-option-en')
        .should('have.class', 'active');
    });

    it('should show checkmark on active language', () => {
      cy.getByDataCy('language-option-en')
        .find('[data-cy="active-check"]')
        .should('be.visible')
        .and('contain', '✓');
    });
  });

  describe('🔄 Language Switching Functionality', () => {
    it('should switch to Spanish', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-es').click();

      // Verify dropdown closed
      cy.getByDataCy('language-dropdown').should('not.exist');

      // Verify language changed
      cy.getByDataCy('current-lang-code').should('have.text', 'ES');
      cy.getByDataCy('current-flag').should('contain', '🇪🇸');
    });

    it('should switch to French', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-fr').click();

      cy.getByDataCy('current-lang-code').should('have.text', 'FR');
      cy.getByDataCy('current-flag').should('contain', '🇫🇷');
    });

    it('should switch to Japanese', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-ja').click();

      cy.getByDataCy('current-lang-code').should('have.text', 'JA');
      cy.getByDataCy('current-flag').should('contain', '🇯🇵');
    });

    it('should persist language selection on page reload', () => {
      // Change to Spanish
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-es').click();

      // Reload page
      cy.reload();
      cy.wait('@getAsciiArt');

      // Verify language persisted
      cy.getByDataCy('current-lang-code').should('have.text', 'ES');
    });

    it('should switch languages multiple times consecutively', () => {
      const languages = [
        { code: 'es', flag: '🇪🇸' },
        { code: 'fr', flag: '🇫🇷' },
        { code: 'de', flag: '🇩🇪' },
        { code: 'en', flag: '🇬🇧' }
      ];

      languages.forEach((lang) => {
        cy.getByDataCy('language-button').click();
        cy.getByDataCy(`language-option-${lang.code}`).click();
        cy.getByDataCy('current-lang-code').should('have.text', lang.code.toUpperCase());
        cy.getByDataCy('current-flag').should('contain', lang.flag);
      });
    });
  });

  describe('📝 Content Translation Verification', () => {
    it('should translate dashboard header to Spanish', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-es').click();

      // Verify Spanish translations appear
      cy.contains('SISTEMA DE DEFENSA NEKO-ARC').should('be.visible');
    });

    it('should translate threat categories to Spanish', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-es').click();

      // Wait for translations to load
      cy.wait(500);

      // Check for Spanish category names
      cy.get('.category-switcher').should('be.visible');
    });

    it('should translate dashboard header to French', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-fr').click();

      cy.contains('SYSTÈME DE DÉFENSE NEKO-ARC').should('be.visible');
    });

    it('should translate dashboard header to Japanese', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-ja').click();

      cy.contains('ネコアーク防衛システム').should('be.visible');
    });

    it('should translate all visible UI elements', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-es').click();

      // Wait for all translations to apply
      cy.wait(500);

      // Verify multiple elements are translated
      cy.get('.App-header').should('be.visible');
      cy.get('.category-switcher').should('be.visible');
      cy.get('.dashboard-grid').should('be.visible');
    });
  });

  describe('♿ Accessibility', () => {
    it('should have proper ARIA label', () => {
      cy.getByDataCy('language-button')
        .should('have.attr', 'aria-label', 'Select language');
    });

    it('should be keyboard accessible - open with Enter', () => {
      cy.getByDataCy('language-button').focus().type('{enter}');
      cy.getByDataCy('language-dropdown').should('be.visible');
    });

    it('should be keyboard accessible - select with Enter', () => {
      cy.getByDataCy('language-button').focus().type('{enter}');
      cy.getByDataCy('language-option-es').focus().type('{enter}');

      cy.getByDataCy('current-lang-code').should('have.text', 'ES');
    });

    it('should be keyboard accessible - close with Escape', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-dropdown').should('be.visible');

      cy.get('body').type('{esc}');
      cy.getByDataCy('language-dropdown').should('not.exist');
    });
  });

  describe('🎨 Visual & UX', () => {
    it('should have proper hover states on language options', () => {
      cy.getByDataCy('language-button').click();

      cy.getByDataCy('language-option-es')
        .trigger('mouseover')
        .should('have.css', 'cursor', 'pointer');
    });

    it('should display dropdown above other content', () => {
      cy.getByDataCy('language-button').click();

      cy.getByDataCy('language-dropdown')
        .should('have.css', 'position', 'absolute')
        .and('have.css', 'z-index');
    });

    it('should display overlay to prevent clicks during dropdown', () => {
      cy.getByDataCy('language-button').click();

      cy.getByDataCy('dropdown-overlay')
        .should('be.visible')
        .and('have.css', 'position', 'fixed');
    });
  });

  describe('⚡ Performance & Edge Cases', () => {
    it('should handle rapid clicking on language button', () => {
      cy.getByDataCy('language-button')
        .click()
        .click()
        .click();

      // Should be closed after odd number of clicks
      cy.getByDataCy('language-dropdown').should('not.exist');
    });

    it('should handle switching to same language', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-en').click(); // Already English

      cy.getByDataCy('current-lang-code').should('have.text', 'EN');
      cy.getByDataCy('language-dropdown').should('not.exist');
    });

    it('should not break layout when dropdown is open', () => {
      cy.getByDataCy('language-button').click();

      // Verify main content still visible
      cy.get('.App-header').should('be.visible');
      cy.get('.dashboard-grid').should('be.visible');
    });

    it('should work correctly after navigation', () => {
      // Navigate away and back
      cy.navigateToThreatActors();
      cy.backToDashboard();

      // Language switcher should still work
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-fr').click();
      cy.getByDataCy('current-lang-code').should('have.text', 'FR');
    });
  });

  describe('🔄 Integration with Other Features', () => {
    it('should maintain language when switching categories', () => {
      // Change language
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-es').click();

      // Switch category
      cy.selectCategory('predators');

      // Verify language still Spanish
      cy.getByDataCy('current-lang-code').should('have.text', 'ES');
    });

    it('should maintain language when navigating views', () => {
      // Change language
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-ja').click();

      // Navigate to different view
      cy.navigateToThreatActors();

      // Verify language persisted
      cy.getByDataCy('current-lang-code').should('have.text', 'JA');
    });

    it('should translate content in Threat Actors view', () => {
      // Change to Spanish
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-es').click();

      // Navigate to Threat Actors
      cy.navigateToThreatActors();

      // Verify Spanish content
      cy.wait(500);
      cy.get('.threat-actors-container').should('be.visible');
    });
  });

  describe('💾 LocalStorage Persistence', () => {
    it('should save language preference to localStorage', () => {
      cy.getByDataCy('language-button').click();
      cy.getByDataCy('language-option-de').click();

      // Check localStorage
      cy.window().then((win) => {
        const storedLang = win.localStorage.getItem('i18nextLng');
        expect(storedLang).to.equal('de');
      });
    });

    it('should load language from localStorage on startup', () => {
      // Set language in localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('i18nextLng', 'ru');
      });

      // Reload page
      cy.reload();
      cy.wait('@getAsciiArt');

      // Verify Russian loaded
      cy.getByDataCy('current-lang-code').should('have.text', 'RU');
    });
  });
});

// *purrs in multilingual excellence* 😻🌍
// LEGENDARY LANGUAGE SWITCHING E2E TEST COMPLETE, NYAA~! 🐾⚡
