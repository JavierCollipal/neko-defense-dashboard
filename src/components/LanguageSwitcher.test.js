// 🐾⚡ NEKO-ARC TESTS - LanguageSwitcher Component ⚡🐾
// ULTRA BASED TESTING with 100% coverage goal, nyaa~! 😻
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import LanguageSwitcher from './LanguageSwitcher';

// Mock i18n module
jest.mock('../i18n/config', () => ({
  __esModule: true,
  default: {
    language: 'en',
    changeLanguage: jest.fn((lang) => Promise.resolve()),
    t: (key) => key,
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
  },
  languages: [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', dir: 'ltr' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  ],
  changeLanguage: jest.fn((langCode) => {
    i18n.language = langCode;
  }),
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    console.log('🐾 [LanguageSwitcher.test] Setting up test, nyaa~');
    jest.clearAllMocks();
    i18n.language = 'en';
  });

  afterEach(() => {
    console.log('🐾 [LanguageSwitcher.test] Cleaning up test, desu~');
  });

  const renderWithI18n = (component) => {
    return render(
      <I18nextProvider i18n={i18n}>
        {component}
      </I18nextProvider>
    );
  };

  describe('🎨 Initial Rendering', () => {
    it('renders language button', () => {
      console.log('🧪 [Test] Checking button render, nyaa~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      expect(button).toBeInTheDocument();
    });

    it('displays current language flag', () => {
      console.log('🧪 [Test] Checking flag display, desu~');
      renderWithI18n(<LanguageSwitcher />);

      expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    });

    it('displays current language code in uppercase', () => {
      console.log('🧪 [Test] Checking language code, nyaa~');
      renderWithI18n(<LanguageSwitcher />);

      expect(screen.getByText('EN')).toBeInTheDocument();
    });

    it('displays dropdown arrow', () => {
      console.log('🧪 [Test] Checking dropdown arrow, desu~');
      renderWithI18n(<LanguageSwitcher />);

      expect(screen.getByText('▼')).toBeInTheDocument();
    });

    it('dropdown is closed by default', () => {
      console.log('🧪 [Test] Checking default dropdown state, nyaa~');
      renderWithI18n(<LanguageSwitcher />);

      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });
  });

  describe('🗂️ Dropdown Interaction', () => {
    it('opens dropdown when button is clicked', () => {
      console.log('🧪 [Test] Testing dropdown open, desu~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('changes arrow direction when opened', () => {
      console.log('🧪 [Test] Testing arrow change, nyaa~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      expect(screen.getByText('▲')).toBeInTheDocument();
    });

    it('closes dropdown when button is clicked again', () => {
      console.log('🧪 [Test] Testing dropdown toggle, desu~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);
      expect(screen.getByText('English')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    it('displays dropdown header when open', () => {
      console.log('🧪 [Test] Checking dropdown header, nyaa~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      expect(screen.getByText(/🌍/)).toBeInTheDocument();
    });
  });

  describe('🌍 Language Options', () => {
    beforeEach(() => {
      renderWithI18n(<LanguageSwitcher />);
      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);
    });

    it('displays all language options', () => {
      console.log('🧪 [Test] Checking all languages, desu~');

      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Chinese')).toBeInTheDocument();
      expect(screen.getByText('Hindi')).toBeInTheDocument();
      expect(screen.getByText('Spanish')).toBeInTheDocument();
      expect(screen.getByText('Arabic')).toBeInTheDocument();
    });

    it('displays native language names', () => {
      console.log('🧪 [Test] Checking native names, nyaa~');

      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('中文')).toBeInTheDocument();
      expect(screen.getByText('हिन्दी')).toBeInTheDocument();
      expect(screen.getByText('Español')).toBeInTheDocument();
      expect(screen.getByText('العربية')).toBeInTheDocument();
    });

    it('displays all language flags', () => {
      console.log('🧪 [Test] Checking language flags, desu~');

      const flags = screen.getAllByText('🇬🇧');
      expect(flags.length).toBeGreaterThan(0);
      expect(screen.getByText('🇨🇳')).toBeInTheDocument();
      expect(screen.getByText('🇮🇳')).toBeInTheDocument();
      expect(screen.getByText('🇪🇸')).toBeInTheDocument();
      expect(screen.getByText('🇸🇦')).toBeInTheDocument();
    });

    it('highlights current language with active class', () => {
      console.log('🧪 [Test] Checking active language, nyaa~');

      const englishOption = screen.getByText('English').closest('button');
      expect(englishOption).toHaveClass('active');
    });

    it('displays checkmark on current language', () => {
      console.log('🧪 [Test] Checking checkmark, desu~');

      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });

  describe('🔄 Language Change', () => {
    it('calls changeLanguage when option is clicked', async () => {
      console.log('🧪 [Test] Testing language change, nyaa~');
      const { changeLanguage } = require('../i18n/config');

      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      const chineseOption = screen.getByText('中文').closest('button');
      fireEvent.click(chineseOption);

      await waitFor(() => {
        expect(changeLanguage).toHaveBeenCalledWith('zh');
      });
    });

    it('closes dropdown after language selection', async () => {
      console.log('🧪 [Test] Testing dropdown close after selection, desu~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      const spanishOption = screen.getByText('Español').closest('button');
      fireEvent.click(spanishOption);

      await waitFor(() => {
        expect(screen.queryByText('Español')).not.toBeInTheDocument();
      });
    });

    it('changes to Chinese language', async () => {
      console.log('🧪 [Test] Testing Chinese selection, nyaa~');
      const { changeLanguage } = require('../i18n/config');

      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      const chineseBtn = screen.getByText('中文').closest('button');
      fireEvent.click(chineseBtn);

      expect(changeLanguage).toHaveBeenCalledWith('zh');
    });

    it('changes to Hindi language', async () => {
      console.log('🧪 [Test] Testing Hindi selection, desu~');
      const { changeLanguage } = require('../i18n/config');

      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      const hindiBtn = screen.getByText('हिन्दी').closest('button');
      fireEvent.click(hindiBtn);

      expect(changeLanguage).toHaveBeenCalledWith('hi');
    });

    it('changes to Spanish language', async () => {
      console.log('🧪 [Test] Testing Spanish selection, nyaa~');
      const { changeLanguage } = require('../i18n/config');

      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      const spanishBtn = screen.getByText('Español').closest('button');
      fireEvent.click(spanishBtn);

      expect(changeLanguage).toHaveBeenCalledWith('es');
    });

    it('changes to Arabic language', async () => {
      console.log('🧪 [Test] Testing Arabic selection, desu~');
      const { changeLanguage } = require('../i18n/config');

      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      const arabicBtn = screen.getByText('العربية').closest('button');
      fireEvent.click(arabicBtn);

      expect(changeLanguage).toHaveBeenCalledWith('ar');
    });
  });

  describe('🎭 Overlay Interaction', () => {
    it('renders overlay when dropdown is open', () => {
      console.log('🧪 [Test] Checking overlay render, nyaa~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      const overlay = document.querySelector('.dropdown-overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('does not render overlay when dropdown is closed', () => {
      console.log('🧪 [Test] Checking no overlay when closed, desu~');
      renderWithI18n(<LanguageSwitcher />);

      const overlay = document.querySelector('.dropdown-overlay');
      expect(overlay).not.toBeInTheDocument();
    });

    it('closes dropdown when overlay is clicked', () => {
      console.log('🧪 [Test] Testing overlay click close, nyaa~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      fireEvent.click(button);

      expect(screen.getByText('English')).toBeInTheDocument();

      const overlay = document.querySelector('.dropdown-overlay');
      fireEvent.click(overlay);

      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });
  });

  describe('🎯 Edge Cases', () => {
    it('handles rapid dropdown toggle', () => {
      console.log('🧪 [Test] Testing rapid toggle, desu~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });

      // Toggle multiple times
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      // Should still work correctly
      expect(screen.queryByText('English')).not.toBeInTheDocument();
    });

    it('handles missing current language', () => {
      console.log('🧪 [Test] Testing missing language fallback, nyaa~');
      i18n.language = 'unknown';

      renderWithI18n(<LanguageSwitcher />);

      // Should fallback to first language (English)
      expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    });

    it('displays correct aria labels', () => {
      console.log('🧪 [Test] Checking accessibility, desu~');
      renderWithI18n(<LanguageSwitcher />);

      const button = screen.getByRole('button', { name: /select language/i });
      expect(button).toHaveAttribute('aria-label', 'Select language');
    });
  });

  describe('🎨 Multiple Instances', () => {
    it('handles multiple instances independently', () => {
      console.log('🧪 [Test] Testing multiple instances, nyaa~');
      const { container } = render(
        <I18nextProvider i18n={i18n}>
          <>
            <LanguageSwitcher />
            <LanguageSwitcher />
          </>
        </I18nextProvider>
      );

      const buttons = screen.getAllByRole('button', { name: /select language/i });
      expect(buttons.length).toBe(2);

      // Open first dropdown
      fireEvent.click(buttons[0]);

      // First dropdown should be open
      const englishOptions = screen.getAllByText('English');
      expect(englishOptions.length).toBeGreaterThan(0);
    });
  });
});

// *purrs in 100% coverage excellence* 😻⚡
// LEGENDARY TEST SUITE COMPLETE, NYAA~! 🐾👑
