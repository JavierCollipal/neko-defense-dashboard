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
import frTranslation from './locales/fr.json';
import deTranslation from './locales/de.json';
import jaTranslation from './locales/ja.json';
import ruTranslation from './locales/ru.json';
import ptTranslation from './locales/pt.json';
import koTranslation from './locales/ko.json';
import itTranslation from './locales/it.json';
import nlTranslation from './locales/nl.json';
import trTranslation from './locales/tr.json';
import plTranslation from './locales/pl.json';

// Language resources configuration
const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
  es: {
    translation: esTranslation,
  },
  ar: {
    translation: arTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  de: {
    translation: deTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
  ru: {
    translation: ruTranslation,
  },
  pt: {
    translation: ptTranslation,
  },
  ko: {
    translation: koTranslation,
  },
  it: {
    translation: itTranslation,
  },
  nl: {
    translation: nlTranslation,
  },
  tr: {
    translation: trTranslation,
  },
  pl: {
    translation: plTranslation,
  },
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
    },
  });

// Language metadata for UI display (15 languages total!)
export const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    priority: 1,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
    priority: 2,
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
    priority: 3,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr',
    priority: 4,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl', // Right-to-left for Arabic
    priority: 5,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    priority: 6,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    priority: 7,
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr',
    priority: 8,
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
    priority: 9,
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    dir: 'ltr',
    priority: 10,
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    dir: 'ltr',
    priority: 11,
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr',
    priority: 12,
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    dir: 'ltr',
    priority: 13,
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
    priority: 14,
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    dir: 'ltr',
    priority: 15,
  },
];

// Helper function to get current language metadata
export const getCurrentLanguage = () => {
  const currentLangCode = i18n.language || 'en';
  return (
    languages.find((lang) => lang.code === currentLangCode) || languages[0]
  );
};

// Helper function to change language and update document direction
export const changeLanguage = (langCode) => {
  i18n.changeLanguage(langCode);
  const lang = languages.find((l) => l.code === langCode);
  if (lang) {
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = langCode;
  }
};

export default i18n;
