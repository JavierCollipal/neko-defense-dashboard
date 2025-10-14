// 🐾🌍 NEKO DEFENSE SYSTEM - i18n Configuration 🌍🐾
// Complete internationalization setup for worldwide threat defense!

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en.json';
import zhTranslation from './locales/zh.json';
import hiTranslation from './locales/hi.json';
import esTranslation from './locales/es.json';
import arTranslation from './locales/ar.json';

// Language resources configuration
const resources = {
  en: {
    translation: enTranslation
  },
  zh: {
    translation: zhTranslation
  },
  hi: {
    translation: hiTranslation
  },
  es: {
    translation: esTranslation
  },
  ar: {
    translation: arTranslation
  }
};

// Initialize i18next with all configurations
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize with configuration
  .init({
    resources,
    fallbackLng: 'en', // Default language if detection fails
    debug: process.env.NODE_ENV === 'development',

    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'neko-defense-language',
    },

    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    // Namespace configuration
    ns: ['translation'],
    defaultNS: 'translation',

    // React specific options
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'span'],
    }
  });

// Language metadata for UI display
export const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr'
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl' // Right-to-left for Arabic
  }
];

// Helper function to get current language metadata
export const getCurrentLanguage = () => {
  const currentLangCode = i18n.language || 'en';
  return languages.find(lang => lang.code === currentLangCode) || languages[0];
};

// Helper function to change language and update document direction
export const changeLanguage = (langCode) => {
  i18n.changeLanguage(langCode);
  const lang = languages.find(l => l.code === langCode);
  if (lang) {
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = langCode;
  }
};

export default i18n;
