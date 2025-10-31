// 🐾 NEKO DEFENSE DASHBOARD - Translation Management Page
// Admin interface for managing translations and testing translation system

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function TranslationDashboard() {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translationTest, setTranslationTest] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language]);

  const testTranslation = async () => {
    if (!translationTest.trim()) {
      setTestResult({ success: false, error: 'Please enter text to translate' });
      return;
    }

    setIsLoading(true);
    setTestResult(null);
    setCopied(false);

    try {
      const response = await fetch('/api/translate/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: translationTest,
          targetLanguage: 'es',
          sourceLanguage: 'en'
        })
      });

      const result = await response.json();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="translation-dashboard min-h-screen p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header with Neko TV Style */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            🌍✨ {t('translation.dashboard.title', 'Translation Management Dashboard')} ✨🐾
          </h1>
          <p className="text-gray-400">Powered by AI • MongoDB Atlas • Neko Arc Technology</p>
        </div>

        <div className="grid gap-6">
          {/* Current Language Status - Enhanced */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="animate-pulse">📊</span> Current Language Status
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-gray-400 text-sm mb-1">Current Language</p>
                <p className="text-blue-400 font-bold text-xl">{currentLanguage.toUpperCase()}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-gray-400 text-sm mb-1">i18next Status</p>
                <p className="text-green-400 font-bold text-xl">✅ Active</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <p className="text-gray-400 text-sm mb-1">Translation System</p>
                <p className="text-purple-400 font-bold text-xl">⚡ Live</p>
              </div>
            </div>
          </div>

          {/* Translation Testing Lab - ENHANCED UX */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-pink-500/30 shadow-lg shadow-pink-500/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="animate-bounce">🧪</span> Translation Testing Lab
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center justify-between">
                  <span>Test Text (English)</span>
                  <span className="text-xs text-gray-500">{translationTest.length} characters</span>
                </label>
                <textarea
                  value={translationTest}
                  onChange={(e) => setTranslationTest(e.target.value)}
                  className="w-full p-4 bg-gray-700/50 text-white rounded-lg border-2 border-gray-600 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300"
                  rows="4"
                  placeholder="Enter text to translate to Spanish... 🔤"
                  disabled={isLoading}
                />
              </div>

              <button
                onClick={testTranslation}
                disabled={isLoading || !translationTest.trim()}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                  isLoading || !translationTest.trim()
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 hover:from-pink-500 hover:via-purple-500 hover:to-cyan-500 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Translating... ⚡
                  </span>
                ) : (
                  '🔤 Translate to Spanish'
                )}
              </button>

              {/* Enhanced Results Display */}
              {testResult && (
                <div className={`mt-4 p-6 rounded-lg border-2 animate-slideIn ${
                  testResult.success
                    ? 'bg-green-500/10 border-green-500/50'
                    : 'bg-red-500/10 border-red-500/50'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-semibold flex items-center ${
                      testResult.success ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {testResult.success ? '✅ Translation Success!' : '❌ Translation Failed'}
                    </h3>
                    {testResult.success && testResult.translatedText && (
                      <button
                        onClick={() => copyToClipboard(testResult.translatedText)}
                        className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-sm rounded-lg transition-all duration-300 flex items-center"
                      >
                        {copied ? '✅ Copied!' : '📋 Copy'}
                      </button>
                    )}
                  </div>

                  {testResult.success ? (
                    <div className="space-y-3">
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Spanish Translation:</p>
                        <p className="text-white text-lg">{testResult.translatedText}</p>
                      </div>

                      {testResult.detectedLanguage && (
                        <div className="flex items-center text-sm text-gray-400">
                          <span>🔍 Detected: {testResult.detectedLanguage}</span>
                          <span className="mx-2">•</span>
                          <span>⚡ Cached: {testResult.cached ? 'Yes' : 'No'}</span>
                          {testResult.translationTime && (
                            <>
                              <span className="mx-2">•</span>
                              <span>⏱️ {testResult.translationTime}ms</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-red-300">{testResult.error || 'Translation failed'}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Language Statistics - Enhanced */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 border border-yellow-500/30 shadow-lg shadow-yellow-500/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="animate-pulse">📈</span> Language Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                <p className="text-4xl font-bold text-blue-400 mb-2">15</p>
                <p className="text-gray-400 text-sm">Supported Languages</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400 mb-2">MongoDB Atlas</p>
                <p className="text-gray-400 text-sm">Translation Cache</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-3xl mb-2">🇪🇸</p>
                <p className="text-yellow-400 font-bold">Spanish</p>
                <p className="text-gray-400 text-sm">Primary Target</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Neko Branding */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>🐾 Powered by Neko-Arc AI Translation System • Made with 💖 in Chile 🇨🇱</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}