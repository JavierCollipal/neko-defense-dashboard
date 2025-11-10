// 🐾 NEKO DEFENSE DASHBOARD - Auto Translation Consent Prompt
// GDPR-compliant user consent dialog for automatic translation

import React from 'react';
import { useTranslation } from 'react-i18next';

const AutoTranslationPrompt = ({
  isVisible,
  detectedLocation,
  suggestedLanguage,
  onAccept,
  onDecline,
  onEnableWithoutLocation,
}) => {
  const { t } = useTranslation();

  if (!isVisible) {
    return null;
  }

  const getLanguageName = (code) => {
    // Fix: Add null check before calling .toUpperCase()
    if (!code) {
      return 'Unknown';
    }

    const languages = {
      es: 'Español',
      en: 'English',
      fr: 'Français',
      de: 'Deutsch',
      it: 'Italiano',
      pt: 'Português',
      ru: 'Русский',
      zh: '中文',
      ja: '日本語',
      ko: '한국어',
      ar: 'العربية',
      hi: 'हिन्दी',
    };
    return languages[code] || code.toUpperCase();
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      CL: '🇨🇱',
      ES: '🇪🇸',
      MX: '🇲🇽',
      AR: '🇦🇷',
      CO: '🇨🇴',
      PE: '🇵🇪',
      VE: '🇻🇪',
      EC: '🇪🇨',
      US: '🇺🇸',
      GB: '🇬🇧',
      FR: '🇫🇷',
      DE: '🇩🇪',
      IT: '🇮🇹',
      PT: '🇵🇹',
      BR: '🇧🇷',
      CN: '🇨🇳',
      JP: '🇯🇵',
      KR: '🇰🇷',
      RU: '🇷🇺',
      IN: '🇮🇳',
    };
    return flags[countryCode] || '🌍';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-700">
        {/* Header */}
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🌍</span>
          <h3 className="text-xl font-semibold text-white">
            {t('autoTranslation.prompt.title', 'Auto Translation')}
          </h3>
        </div>

        {/* Location Detection */}
        {detectedLocation && (
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <div className="flex items-center text-gray-300">
              <span className="text-lg mr-2">
                {getCountryFlag(detectedLocation.countryCode)}
              </span>
              <div>
                <p className="font-medium">
                  {t(
                    'autoTranslation.prompt.detectedLocation',
                    'Detected Location'
                  )}
                  :
                </p>
                <p className="text-sm">
                  {detectedLocation.city}, {detectedLocation.country}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Language */}
        {suggestedLanguage && (
          <div className="mb-4">
            <p className="text-gray-300 mb-3">
              {t(
                'autoTranslation.prompt.suggestion',
                'Based on your location, we recommend'
              )}
              :
            </p>
            <div className="bg-blue-600 bg-opacity-20 border border-blue-500 rounded-lg p-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💬</span>
                <div>
                  <p className="text-blue-400 font-medium">
                    {getLanguageName(suggestedLanguage)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t(
                      'autoTranslation.prompt.automaticTranslation',
                      'Automatic translation'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="bg-yellow-600 bg-opacity-20 border border-yellow-500 rounded-lg p-3 mb-4">
          <div className="flex items-start">
            <span className="text-yellow-400 mr-2 mt-0.5">🔒</span>
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">
                {t('autoTranslation.prompt.privacyTitle', 'Privacy Notice')}
              </p>
              <p>
                {t(
                  'autoTranslation.prompt.privacyText',
                  'We use your IP address to detect location for language suggestions. No personal data is stored permanently.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Accept with location */}
          <button
            onClick={() => onAccept(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">✅</span>
            {t(
              'autoTranslation.prompt.acceptWithLocation',
              'Enable Auto Translation'
            )}
          </button>

          {/* Enable without location */}
          <button
            onClick={() => onEnableWithoutLocation()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">🌐</span>
            {t(
              'autoTranslation.prompt.enableWithoutLocation',
              'Enable Without Location'
            )}
          </button>

          {/* Decline */}
          <button
            onClick={() => onDecline()}
            className="w-full bg-transparent border border-gray-600 hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {t(
              'autoTranslation.prompt.decline',
              'No Thanks, Keep Current Language'
            )}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          {t(
            'autoTranslation.prompt.footer',
            'You can change this preference anytime in settings'
          )}
        </p>
      </div>
    </div>
  );
};

export default AutoTranslationPrompt;
