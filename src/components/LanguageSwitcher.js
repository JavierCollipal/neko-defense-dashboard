// 🐾🌍 NEKO DEFENSE - Language Switcher Component 🌍🐾
// Global language support for worldwide threat defense!

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { languages, changeLanguage } from '../i18n/config';
import '../styles/LanguageSwitcher.css';

function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="language-switcher" data-cy="language-switcher">
      <button
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        data-cy="language-button"
      >
        <span className="flag" data-cy="current-flag">{currentLang.flag}</span>
        <span className="lang-code" data-cy="current-lang-code">{currentLang.code.toUpperCase()}</span>
        <span className="dropdown-arrow" data-cy="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="language-dropdown" data-cy="language-dropdown">
          <div className="dropdown-header" data-cy="dropdown-header">
            🌍 {t('language.select')}
          </div>
          <div className="language-list" data-cy="language-list">
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`language-option ${i18n.language === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
                data-cy={`language-option-${lang.code}`}
              >
                <span className="flag">{lang.flag}</span>
                <div className="lang-info">
                  <div className="lang-native">{lang.nativeName}</div>
                  <div className="lang-english">{lang.name}</div>
                </div>
                {i18n.language === lang.code && (
                  <span className="check-mark" data-cy="active-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="dropdown-overlay"
          onClick={() => setIsOpen(false)}
          data-cy="dropdown-overlay"
        />
      )}
    </div>
  );
}

export default LanguageSwitcher;
