// 🐾 NEKO DEFENSE DASHBOARD - Auto Translation Hook
// GDPR-compliant automatic language detection and translation

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Storage keys
const AUTO_TRANSLATION_PREFERENCE = 'neko_auto_translation_enabled';
const LOCATION_CONSENT_GIVEN = 'neko_location_consent';
const MANUAL_LANGUAGE_OVERRIDE = 'neko_manual_language_override';

export const useAutoTranslation = () => {
  const { i18n } = useTranslation();
  const [autoTranslationEnabled, setAutoTranslationEnabled] = useState(true);
  const [locationConsent, setLocationConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [suggestedLanguage, setSuggestedLanguage] = useState(null);
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);

  // Load user preferences from localStorage
  useEffect(() => {
    // Use a timeout to avoid state updates during render
    const initializeAutoTranslation = () => {
      const autoEnabled = localStorage.getItem(AUTO_TRANSLATION_PREFERENCE);
      const consentGiven = localStorage.getItem(LOCATION_CONSENT_GIVEN);
      const manualOverride = localStorage.getItem(MANUAL_LANGUAGE_OVERRIDE);

      setAutoTranslationEnabled(autoEnabled !== 'false');
      setLocationConsent(consentGiven === 'true');

      // If user manually set language, don't auto-translate
      if (manualOverride === 'true') {
        console.log('👤 Manual language override detected - skipping auto-translation');
        return;
      }

      // Only attempt auto-translation if enabled and consent given
      if (autoEnabled !== 'false' && consentGiven === 'true') {
        detectLocationAndSuggestLanguage();
      } else if (autoEnabled !== 'false' && consentGiven !== 'false') {
        // First visit - request consent
        setShowLanguagePrompt(true);
      }
    };

    // Defer initialization to avoid React state update warnings
    setTimeout(initializeAutoTranslation, 100);
  }, []);

  const detectLocationAndSuggestLanguage = async () => {
    if (isLoading) return;

    setIsLoading(true);
    console.log('🌍 Starting automatic location detection...');

    try {
      const response = await fetch('/api/geolocation/detect');
      const data = await response.json();

      if (data.success) {
        console.log('🎯 Location detected:', data.location);
        console.log('💬 Suggested language:', data.suggestedLanguage);

        setDetectedLocation(data.location);
        setSuggestedLanguage(data.suggestedLanguage);

        // Auto-switch language if different from current
        const currentLanguage = i18n.language;
        if (data.suggestedLanguage !== currentLanguage) {
          console.log(`🔄 Auto-switching: ${currentLanguage} → ${data.suggestedLanguage}`);
          await i18n.changeLanguage(data.suggestedLanguage);

          // Save language preference to backend
          try {
            await fetch('/api/user/language-preference', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: 'current-user', // Could be actual user ID if logged in
                language: data.suggestedLanguage,
                detectedFrom: 'geolocation',
                location: data.location
              })
            });
            console.log('💾 Language preference saved to MongoDB');
          } catch (error) {
            console.warn('⚠️ Failed to save language preference:', error);
          }
        } else {
          console.log('✅ Current language matches detected location');
        }
      } else {
        console.warn('⚠️ Location detection failed:', data.error);
        // Use fallback language
        if (data.fallback?.suggestedLanguage) {
          setSuggestedLanguage(data.fallback.suggestedLanguage);
        }
      }
    } catch (error) {
      console.error('❌ Auto-translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const enableAutoTranslation = async (withConsent = true) => {
    setAutoTranslationEnabled(true);
    setLocationConsent(withConsent);
    setShowLanguagePrompt(false);

    // Save preferences
    localStorage.setItem(AUTO_TRANSLATION_PREFERENCE, 'true');
    localStorage.setItem(LOCATION_CONSENT_GIVEN, withConsent.toString());

    // Clear manual override
    localStorage.removeItem(MANUAL_LANGUAGE_OVERRIDE);

    console.log('✅ Auto-translation enabled with consent:', withConsent);

    if (withConsent) {
      await detectLocationAndSuggestLanguage();
    }
  };

  const disableAutoTranslation = () => {
    setAutoTranslationEnabled(false);
    setShowLanguagePrompt(false);

    // Save preferences
    localStorage.setItem(AUTO_TRANSLATION_PREFERENCE, 'false');
    localStorage.setItem(LOCATION_CONSENT_GIVEN, 'false');

    console.log('❌ Auto-translation disabled');
  };

  const setManualLanguageOverride = (language) => {
    // User manually changed language - disable auto-translation for this session
    localStorage.setItem(MANUAL_LANGUAGE_OVERRIDE, 'true');
    setAutoTranslationEnabled(false);
    console.log('👤 Manual language override set:', language);
  };

  const resetAutoTranslation = () => {
    // Clear all preferences - will prompt again on next visit
    localStorage.removeItem(AUTO_TRANSLATION_PREFERENCE);
    localStorage.removeItem(LOCATION_CONSENT_GIVEN);
    localStorage.removeItem(MANUAL_LANGUAGE_OVERRIDE);

    setAutoTranslationEnabled(true);
    setLocationConsent(false);
    setShowLanguagePrompt(true);

    console.log('🔄 Auto-translation preferences reset');
  };

  return {
    // State
    autoTranslationEnabled,
    locationConsent,
    isLoading,
    detectedLocation,
    suggestedLanguage,
    showLanguagePrompt,

    // Actions
    enableAutoTranslation,
    disableAutoTranslation,
    setManualLanguageOverride,
    resetAutoTranslation,
    detectLocationAndSuggestLanguage
  };
};