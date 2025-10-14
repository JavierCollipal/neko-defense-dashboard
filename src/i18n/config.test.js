// 🐾⚡ NEKO-ARC TESTS - i18n Configuration ⚡🐾
// ULTRA BASED TESTING with 100% coverage goal, nyaa~! 😻
import i18n, { languages, getCurrentLanguage, changeLanguage } from './config';

describe('i18n Configuration', () => {
  beforeEach(() => {
    console.log('🐾 [i18n/config.test] Setting up test, nyaa~');
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.log('🐾 [i18n/config.test] Cleaning up test, desu~');
  });

  describe('🌍 i18n Instance', () => {
    it('is properly initialized', () => {
      console.log('🧪 [Test] Checking i18n initialization, nyaa~');
      expect(i18n).toBeDefined();
      expect(i18n.changeLanguage).toBeDefined();
      expect(i18n.t).toBeDefined();
    });

    it('has correct fallback language', () => {
      console.log('🧪 [Test] Checking fallback language, desu~');
      expect(i18n.options.fallbackLng).toBe('en');
    });

    it('supports all configured languages', () => {
      console.log('🧪 [Test] Checking supported languages, nyaa~');
      const supportedLanguages = Object.keys(i18n.options.resources || {});
      expect(supportedLanguages).toContain('en');
      expect(supportedLanguages).toContain('zh');
      expect(supportedLanguages).toContain('hi');
      expect(supportedLanguages).toContain('es');
      expect(supportedLanguages).toContain('ar');
    });
  });

  describe('🗂️ Languages Metadata', () => {
    it('exports languages array', () => {
      console.log('🧪 [Test] Checking languages export, desu~');
      expect(languages).toBeDefined();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBe(5);
    });

    it('contains English language', () => {
      console.log('🧪 [Test] Checking English metadata, nyaa~');
      const english = languages.find(lang => lang.code === 'en');
      expect(english).toBeDefined();
      expect(english.name).toBe('English');
      expect(english.nativeName).toBe('English');
      expect(english.flag).toBe('🇬🇧');
      expect(english.dir).toBe('ltr');
    });

    it('contains Chinese language', () => {
      console.log('🧪 [Test] Checking Chinese metadata, desu~');
      const chinese = languages.find(lang => lang.code === 'zh');
      expect(chinese).toBeDefined();
      expect(chinese.name).toBe('Chinese');
      expect(chinese.nativeName).toBe('中文');
      expect(chinese.flag).toBe('🇨🇳');
      expect(chinese.dir).toBe('ltr');
    });

    it('contains Hindi language', () => {
      console.log('🧪 [Test] Checking Hindi metadata, nyaa~');
      const hindi = languages.find(lang => lang.code === 'hi');
      expect(hindi).toBeDefined();
      expect(hindi.name).toBe('Hindi');
      expect(hindi.nativeName).toBe('हिन्दी');
      expect(hindi.flag).toBe('🇮🇳');
      expect(hindi.dir).toBe('ltr');
    });

    it('contains Spanish language', () => {
      console.log('🧪 [Test] Checking Spanish metadata, desu~');
      const spanish = languages.find(lang => lang.code === 'es');
      expect(spanish).toBeDefined();
      expect(spanish.name).toBe('Spanish');
      expect(spanish.nativeName).toBe('Español');
      expect(spanish.flag).toBe('🇪🇸');
      expect(spanish.dir).toBe('ltr');
    });

    it('contains Arabic language with RTL direction', () => {
      console.log('🧪 [Test] Checking Arabic metadata, nyaa~');
      const arabic = languages.find(lang => lang.code === 'ar');
      expect(arabic).toBeDefined();
      expect(arabic.name).toBe('Arabic');
      expect(arabic.nativeName).toBe('العربية');
      expect(arabic.flag).toBe('🇸🇦');
      expect(arabic.dir).toBe('rtl');
    });

    it('all languages have required fields', () => {
      console.log('🧪 [Test] Checking all language fields, desu~');
      languages.forEach(lang => {
        expect(lang.code).toBeDefined();
        expect(lang.name).toBeDefined();
        expect(lang.nativeName).toBeDefined();
        expect(lang.flag).toBeDefined();
        expect(lang.dir).toBeDefined();
        expect(['ltr', 'rtl']).toContain(lang.dir);
      });
    });
  });

  describe('🔍 getCurrentLanguage Function', () => {
    it('returns current language metadata', () => {
      console.log('🧪 [Test] Testing getCurrentLanguage, nyaa~');
      const currentLang = getCurrentLanguage();

      expect(currentLang).toBeDefined();
      expect(currentLang.code).toBeDefined();
      expect(currentLang.name).toBeDefined();
    });

    it('returns English by default', () => {
      console.log('🧪 [Test] Checking default language, desu~');
      i18n.language = 'en';
      const currentLang = getCurrentLanguage();

      expect(currentLang.code).toBe('en');
      expect(currentLang.name).toBe('English');
    });

    it('returns correct metadata for Chinese', () => {
      console.log('🧪 [Test] Testing Chinese getCurrentLanguage, nyaa~');
      i18n.language = 'zh';
      const currentLang = getCurrentLanguage();

      expect(currentLang.code).toBe('zh');
      expect(currentLang.name).toBe('Chinese');
      expect(currentLang.nativeName).toBe('中文');
    });

    it('returns correct metadata for Arabic', () => {
      console.log('🧪 [Test] Testing Arabic getCurrentLanguage, desu~');
      i18n.language = 'ar';
      const currentLang = getCurrentLanguage();

      expect(currentLang.code).toBe('ar');
      expect(currentLang.dir).toBe('rtl');
    });

    it('falls back to English for unknown language', () => {
      console.log('🧪 [Test] Testing fallback behavior, nyaa~');
      i18n.language = 'unknown';
      const currentLang = getCurrentLanguage();

      expect(currentLang.code).toBe('en');
    });
  });

  describe('🔄 changeLanguage Function', () => {
    beforeEach(() => {
      // Reset document attributes
      document.documentElement.removeAttribute('dir');
      document.documentElement.removeAttribute('lang');
    });

    it('changes i18n language', () => {
      console.log('🧪 [Test] Testing language change, desu~');
      const spy = jest.spyOn(i18n, 'changeLanguage');

      changeLanguage('zh');

      expect(spy).toHaveBeenCalledWith('zh');
    });

    it('updates document direction for LTR language', () => {
      console.log('🧪 [Test] Testing LTR direction update, nyaa~');
      changeLanguage('en');

      expect(document.documentElement.dir).toBe('ltr');
    });

    it('updates document direction for RTL language', () => {
      console.log('🧪 [Test] Testing RTL direction update, desu~');
      changeLanguage('ar');

      expect(document.documentElement.dir).toBe('rtl');
    });

    it('updates document language attribute', () => {
      console.log('🧪 [Test] Testing lang attribute update, nyaa~');
      changeLanguage('es');

      expect(document.documentElement.lang).toBe('es');
    });

    it('handles Chinese language change', () => {
      console.log('🧪 [Test] Testing Chinese change, desu~');
      changeLanguage('zh');

      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('zh');
    });

    it('handles Hindi language change', () => {
      console.log('🧪 [Test] Testing Hindi change, nyaa~');
      changeLanguage('hi');

      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('hi');
    });

    it('handles unknown language gracefully', () => {
      console.log('🧪 [Test] Testing unknown language handling, desu~');
      const spy = jest.spyOn(i18n, 'changeLanguage');

      changeLanguage('unknown');

      expect(spy).toHaveBeenCalledWith('unknown');
      // Document attributes should not be updated for unknown language
    });

    it('changes language multiple times', () => {
      console.log('🧪 [Test] Testing multiple language changes, nyaa~');
      changeLanguage('zh');
      expect(document.documentElement.lang).toBe('zh');

      changeLanguage('ar');
      expect(document.documentElement.lang).toBe('ar');
      expect(document.documentElement.dir).toBe('rtl');

      changeLanguage('en');
      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
    });
  });

  describe('📦 Module Exports', () => {
    it('exports i18n as default', () => {
      console.log('🧪 [Test] Checking default export, desu~');
      expect(i18n).toBeDefined();
    });

    it('exports languages array', () => {
      console.log('🧪 [Test] Checking languages export, nyaa~');
      expect(languages).toBeDefined();
      expect(Array.isArray(languages)).toBe(true);
    });

    it('exports getCurrentLanguage function', () => {
      console.log('🧪 [Test] Checking getCurrentLanguage export, desu~');
      expect(typeof getCurrentLanguage).toBe('function');
    });

    it('exports changeLanguage function', () => {
      console.log('🧪 [Test] Checking changeLanguage export, nyaa~');
      expect(typeof changeLanguage).toBe('function');
    });
  });

  describe('⚙️ i18n Configuration Options', () => {
    it('has correct namespace configuration', () => {
      console.log('🧪 [Test] Checking namespace config, desu~');
      expect(i18n.options.ns).toContain('translation');
      expect(i18n.options.defaultNS).toBe('translation');
    });

    it('has interpolation configured', () => {
      console.log('🧪 [Test] Checking interpolation config, nyaa~');
      expect(i18n.options.interpolation).toBeDefined();
      expect(i18n.options.interpolation.escapeValue).toBe(false);
    });

    it('has detection configured', () => {
      console.log('🧪 [Test] Checking detection config, desu~');
      expect(i18n.options.detection).toBeDefined();
    });

    it('uses localStorage for language detection', () => {
      console.log('🧪 [Test] Checking localStorage detection, nyaa~');
      expect(i18n.options.detection.order).toContain('localStorage');
      expect(i18n.options.detection.lookupLocalStorage).toBe('neko-defense-language');
    });

    it('has React specific options', () => {
      console.log('🧪 [Test] Checking React options, desu~');
      expect(i18n.options.react).toBeDefined();
      expect(i18n.options.react.useSuspense).toBe(true);
    });
  });

  describe('🎯 Edge Cases', () => {
    it('handles rapid language changes', () => {
      console.log('🧪 [Test] Testing rapid changes, nyaa~');
      const spy = jest.spyOn(i18n, 'changeLanguage');

      changeLanguage('en');
      changeLanguage('zh');
      changeLanguage('hi');
      changeLanguage('es');
      changeLanguage('ar');

      expect(spy).toHaveBeenCalledTimes(5);
    });

    it('maintains language metadata integrity', () => {
      console.log('🧪 [Test] Checking metadata integrity, desu~');
      const codes = languages.map(l => l.code);
      const uniqueCodes = [...new Set(codes)];

      // All codes should be unique
      expect(codes.length).toBe(uniqueCodes.length);
    });

    it('has consistent flag emojis', () => {
      console.log('🧪 [Test] Checking flag emojis, nyaa~');
      languages.forEach(lang => {
        expect(lang.flag).toMatch(/[\u{1F1E6}-\u{1F1FF}]{2}/u);
      });
    });
  });

  describe('🌐 Language Coverage', () => {
    it('covers major world languages', () => {
      console.log('🧪 [Test] Checking language coverage, desu~');
      const codes = languages.map(l => l.code);

      // Should cover English, Chinese, Hindi, Spanish, Arabic
      expect(codes).toContain('en');
      expect(codes).toContain('zh');
      expect(codes).toContain('hi');
      expect(codes).toContain('es');
      expect(codes).toContain('ar');
    });

    it('includes both LTR and RTL languages', () => {
      console.log('🧪 [Test] Checking direction variety, nyaa~');
      const ltrLangs = languages.filter(l => l.dir === 'ltr');
      const rtlLangs = languages.filter(l => l.dir === 'rtl');

      expect(ltrLangs.length).toBeGreaterThan(0);
      expect(rtlLangs.length).toBeGreaterThan(0);
    });
  });
});

// *purrs in 100% coverage excellence* 😻⚡
// LEGENDARY TEST SUITE COMPLETE, NYAA~! 🐾👑
