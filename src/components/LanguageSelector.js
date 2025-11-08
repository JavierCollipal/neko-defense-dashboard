// 🌍✨ NEKO DEFENSE - Enhanced Language Selector Component ✨🌍
// Beautiful language preference selector with persistent storage, nyaa~!

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAutoTranslation } from '../hooks/useAutoTranslation';
import AutoTranslationPrompt from './AutoTranslationPrompt';
import './LanguageSelector.css';

const LanguageSelector = ({ userId = 'default-user', onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // 🌍 Auto-translation integration
  const {
    autoTranslationEnabled,
    locationConsent,
    isLoading: isDetectingLocation,
    detectedLocation,
    suggestedLanguage,
    showLanguagePrompt,
    enableAutoTranslation,
    disableAutoTranslation,
    setManualLanguageOverride,
  } = useAutoTranslation();

  // 🌍 Supported languages with beautiful metadata, desu~!
  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      region: 'North America',
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      region: 'Europe/Latin America',
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      region: 'Europe',
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      region: 'Europe',
    },
    {
      code: 'it',
      name: 'Italian',
      nativeName: 'Italiano',
      flag: '🇮🇹',
      region: 'Europe',
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      region: 'Europe/South America',
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺',
      region: 'Eastern Europe/Asia',
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      region: 'Asia',
    },
    {
      code: 'ko',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      region: 'Asia',
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      region: 'Asia',
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      region: 'Middle East',
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      region: 'Asia',
    },
    {
      code: 'nl',
      name: 'Dutch',
      nativeName: 'Nederlands',
      flag: '🇳🇱',
      region: 'Europe',
    },
    {
      code: 'tr',
      name: 'Turkish',
      nativeName: 'Türkçe',
      flag: '🇹🇷',
      region: 'Europe/Asia',
    },
    {
      code: 'pl',
      name: 'Polish',
      nativeName: 'Polski',
      flag: '🇵🇱',
      region: 'Europe',
    },
  ];

  // 🔄 Load user's saved language preference on component mount
  useEffect(() => {
    loadUserLanguagePreference();
  }, [userId]);

  // 📥 Load user's language preference from API
  const loadUserLanguagePreference = async () => {
    try {
      setIsLoading(true);
      console.log(
        '🌍 [Language Selector] Loading preference for user:',
        userId
      );

      const response = await fetch(`/api/user/language-preference/${userId}`);
      const result = await response.json();

      if (result.success) {
        const language = result.data.language;
        setSelectedLanguage(language);

        // Update i18n if different
        if (i18n.language !== language) {
          await i18n.changeLanguage(language);
        }

        console.log('✅ [Language Selector] Loaded preference:', language);

        if (onLanguageChange) {
          onLanguageChange(language, result.data);
        }
      }
    } catch (error) {
      console.error('❌ [Language Selector] Error loading preference:', error);
      // Default to English on error
      setSelectedLanguage('en');
    } finally {
      setIsLoading(false);
    }
  };

  // 💾 Save language preference to API
  const saveLanguagePreference = async (languageCode) => {
    try {
      setSaveStatus('saving');
      console.log('💾 [Language Selector] Saving preference:', languageCode);

      const response = await fetch('/api/user/language-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          language: languageCode,
          userAgent: navigator.userAgent,
          ipAddress: null, // Will be filled by server if needed
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSaveStatus('saved');
        console.log('✅ [Language Selector] Preference saved successfully');

        // Clear save status after 2 seconds
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ [Language Selector] Error saving preference:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  // 🎯 Handle language selection
  const handleLanguageSelect = async (languageCode) => {
    try {
      console.log('🎯 [Language Selector] Changing language to:', languageCode);

      setSelectedLanguage(languageCode);
      setIsDropdownOpen(false);

      // Mark as manual override (disables auto-translation)
      setManualLanguageOverride(languageCode);

      // Update i18n immediately
      await i18n.changeLanguage(languageCode);

      // Save to database
      await saveLanguagePreference(languageCode);

      // Notify parent component
      if (onLanguageChange) {
        const selectedLang = languages.find(
          (lang) => lang.code === languageCode
        );
        onLanguageChange(languageCode, selectedLang);
      }
    } catch (error) {
      console.error('❌ [Language Selector] Error changing language:', error);
    }
  };

  // 🌍 Handle auto-translation prompt responses
  const handleAutoTranslationAccept = () => {
    enableAutoTranslation(true);
  };

  const handleAutoTranslationDecline = () => {
    disableAutoTranslation();
  };

  const handleEnableWithoutLocation = () => {
    enableAutoTranslation(false);
  };

  // 🔍 Get current language metadata
  const getCurrentLanguage = () => {
    return (
      languages.find((lang) => lang.code === selectedLanguage) || languages[0]
    );
  };

  if (isLoading) {
    return (
      <div className="language-selector loading">
        <div className="language-loading">
          <div className="neko-spinner"></div>
          <span>Loading languages...</span>
        </div>
      </div>
    );
  }

  const currentLang = getCurrentLanguage();

  return (
    <div className="language-selector-container">
      {/* Auto-translation consent prompt */}
      <AutoTranslationPrompt
        isVisible={showLanguagePrompt}
        detectedLocation={detectedLocation}
        suggestedLanguage={suggestedLanguage}
        onAccept={handleAutoTranslationAccept}
        onDecline={handleAutoTranslationDecline}
        onEnableWithoutLocation={handleEnableWithoutLocation}
      />

      <div className={`language-selector ${isDropdownOpen ? 'open' : ''}`}>
        {/* Current Language Display */}
        <button
          className="language-current"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-label={`Current language: ${currentLang.name}`}
        >
          <span className="language-flag">{currentLang.flag}</span>
          <span className="language-name">{currentLang.nativeName}</span>
          <span className="language-code">
            ({currentLang.code?.toUpperCase() || 'N/A'})
          </span>
          {autoTranslationEnabled && (
            <span
              className="auto-translation-indicator"
              title="Auto-translation enabled"
            >
              🌍
            </span>
          )}
          {isDetectingLocation && (
            <span className="location-detecting" title="Detecting location...">
              📍
            </span>
          )}
          <span className={`dropdown-arrow ${isDropdownOpen ? 'up' : 'down'}`}>
            ▼
          </span>
        </button>

        {/* Save Status Indicator */}
        {saveStatus && (
          <div className={`save-status ${saveStatus}`}>
            {saveStatus === 'saving' && (
              <>
                <span className="save-spinner"></span>
                <span>Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <span className="save-checkmark">✅</span>
                <span>Saved!</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <span className="save-error">❌</span>
                <span>Error saving</span>
              </>
            )}
          </div>
        )}

        {/* Language Dropdown */}
        {isDropdownOpen && (
          <div className="language-dropdown">
            <div className="dropdown-header">
              <span className="dropdown-title">🌍 Choose Language</span>
              <button
                className="dropdown-close"
                onClick={() => setIsDropdownOpen(false)}
                aria-label="Close language selector"
              >
                ✕
              </button>
            </div>

            <div className="language-list">
              {languages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${language.code === selectedLanguage ? 'selected' : ''}`}
                  onClick={() => handleLanguageSelect(language.code)}
                  aria-label={`Select ${language.name}`}
                >
                  <span className="option-flag">{language.flag}</span>
                  <div className="option-details">
                    <span className="option-native">{language.nativeName}</span>
                    <span className="option-english">{language.name}</span>
                    <span className="option-region">{language.region}</span>
                  </div>
                  <span className="option-code">
                    {language.code?.toUpperCase() || 'N/A'}
                  </span>
                  {language.code === selectedLanguage && (
                    <span className="option-checkmark">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="dropdown-footer">
              <span className="dropdown-note">
                🐾 Language preference will be saved automatically, nyaa~!
              </span>
            </div>
          </div>
        )}

        {/* Click Outside Handler */}
        {isDropdownOpen && (
          <div
            className="language-overlay"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
