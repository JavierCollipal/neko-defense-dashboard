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

  useEffect(() => {
    setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language]);

  const testTranslation = async () => {
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
    }
  };

  return (
    <div className="translation-dashboard p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">
          🌍 {t('translation.dashboard.title', 'Translation Management Dashboard')}
        </h1>

        <div className="grid gap-6">
          {/* Current Language Status */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              📊 Current Language Status
            </h2>
            <div className="text-gray-300">
              <p>Current Language: <span className="text-blue-400">{currentLanguage}</span></p>
              <p>i18next Initialized: <span className="text-green-400">✅ Yes</span></p>
              <p>Translation System: <span className="text-green-400">✅ Active</span></p>
            </div>
          </div>

          {/* Translation Testing Lab */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              🧪 Translation Testing Lab
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Test Text (English)
                </label>
                <textarea
                  value={translationTest}
                  onChange={(e) => setTranslationTest(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600"
                  rows="3"
                  placeholder="Enter text to translate to Spanish..."
                />
              </div>
              <button
                onClick={testTranslation}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                🔤 Test Translation to Spanish
              </button>

              {testResult && (
                <div className="mt-4 p-4 bg-gray-700 rounded">
                  <h3 className="text-white font-semibold mb-2">Translation Result:</h3>
                  <pre className="text-gray-300 text-sm overflow-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Language Statistics */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              📈 Language Statistics
            </h2>
            <div className="text-gray-300">
              <p>Supported Languages: <span className="text-blue-400">15</span></p>
              <p>Translation Cache: <span className="text-green-400">MongoDB Atlas</span></p>
              <p>Primary Target: <span className="text-yellow-400">🇪🇸 Spanish</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}