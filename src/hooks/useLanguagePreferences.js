// 🌍🎣 NEKO DEFENSE - Language Preferences Hook 🎣🌍
// Custom hook for managing user language preferences with persistent storage, desu~!

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const useLanguagePreferences = (userId = 'default-user') => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDefault, setIsDefault] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // 📥 Load user's language preference from API
  const loadLanguagePreference = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🌍 [Language Hook] Loading preference for user:', userId);

      const response = await fetch(`/api/user/language-preference/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        const { language: userLang, isDefault: isDefaultPref, lastUpdated: lastUpdate } = result.data;

        setLanguage(userLang);
        setIsDefault(isDefaultPref);
        setLastUpdated(lastUpdate);

        // Update i18n if different from current
        if (i18n.language !== userLang) {
          await i18n.changeLanguage(userLang);
          console.log('🔄 [Language Hook] i18n updated to:', userLang);
        }

        console.log('✅ [Language Hook] Preference loaded:', {
          language: userLang,
          isDefault: isDefaultPref,
          lastUpdated: lastUpdate
        });

        return { language: userLang, isDefault: isDefaultPref, lastUpdated: lastUpdate };
      } else {
        throw new Error(result.error || 'Failed to load language preference');
      }
    } catch (err) {
      console.error('❌ [Language Hook] Error loading preference:', err);
      setError(err.message);

      // Fallback to default
      setLanguage('en');
      setIsDefault(true);
      setLastUpdated(null);

      return { language: 'en', isDefault: true, lastUpdated: null };
    } finally {
      setIsLoading(false);
    }
  }, [userId, i18n]);

  // 💾 Save language preference to API
  const saveLanguagePreference = useCallback(async (newLanguage) => {
    try {
      setError(null);
      console.log('💾 [Language Hook] Saving preference:', newLanguage);

      const response = await fetch('/api/user/language-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          language: newLanguage,
          userAgent: navigator.userAgent,
          ipAddress: null // Server will handle if needed
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        const now = new Date();
        setLanguage(newLanguage);
        setIsDefault(false);
        setLastUpdated(now);

        // Update i18n
        await i18n.changeLanguage(newLanguage);

        console.log('✅ [Language Hook] Preference saved successfully');
        return { success: true, language: newLanguage, lastUpdated: now };
      } else {
        throw new Error(result.error || 'Failed to save language preference');
      }
    } catch (err) {
      console.error('❌ [Language Hook] Error saving preference:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [userId, i18n]);

  // 🔄 Change language (combines setting + saving)
  const changeLanguage = useCallback(async (newLanguage) => {
    if (newLanguage === language) {
      console.log('🔄 [Language Hook] Language already set to:', newLanguage);
      return { success: true, language: newLanguage, changed: false };
    }

    try {
      // Immediately update local state for responsiveness
      setLanguage(newLanguage);

      // Update i18n immediately
      await i18n.changeLanguage(newLanguage);

      // Save to database
      const result = await saveLanguagePreference(newLanguage);

      if (result.success) {
        console.log('🔄 [Language Hook] Language changed successfully to:', newLanguage);
        return { success: true, language: newLanguage, changed: true };
      } else {
        // Revert local state if save failed
        const previousLang = language;
        setLanguage(previousLang);
        await i18n.changeLanguage(previousLang);

        return { success: false, error: result.error, language: previousLang };
      }
    } catch (err) {
      console.error('❌ [Language Hook] Error changing language:', err);
      return { success: false, error: err.message };
    }
  }, [language, i18n, saveLanguagePreference]);

  // 📊 Get language statistics
  const getLanguageStats = useCallback(async () => {
    try {
      console.log('📊 [Language Hook] Fetching language statistics');

      const response = await fetch('/api/user/language-stats');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log('✅ [Language Hook] Statistics loaded');
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to load language statistics');
      }
    } catch (err) {
      console.error('❌ [Language Hook] Error loading statistics:', err);
      return { error: err.message };
    }
  }, []);

  // 🗑️ Clear language preference (GDPR compliance)
  const clearLanguagePreference = useCallback(async () => {
    try {
      setError(null);
      console.log('🗑️ [Language Hook] Clearing preference for user:', userId);

      const response = await fetch(`/api/user/language-preference/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Reset to defaults
        setLanguage('en');
        setIsDefault(true);
        setLastUpdated(null);

        // Update i18n to default
        await i18n.changeLanguage('en');

        console.log('✅ [Language Hook] Preference cleared successfully');
        return { success: true };
      } else {
        throw new Error(result.error || 'Failed to clear language preference');
      }
    } catch (err) {
      console.error('❌ [Language Hook] Error clearing preference:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [userId, i18n]);

  // 🔄 Load preferences on hook initialization
  useEffect(() => {
    if (userId) {
      loadLanguagePreference();
    }
  }, [userId, loadLanguagePreference]);

  // 🎯 Return hook interface
  return {
    // Current state
    language,
    isLoading,
    error,
    isDefault,
    lastUpdated,

    // Actions
    changeLanguage,
    saveLanguagePreference,
    loadLanguagePreference,
    clearLanguagePreference,

    // Utilities
    getLanguageStats,

    // Computed values
    isReady: !isLoading && !error,
    hasCustomPreference: !isDefault,
    currentLanguage: language
  };
};

export default useLanguagePreferences;