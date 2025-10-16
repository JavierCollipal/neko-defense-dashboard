// 🐾🌍 NEKO DEFENSE SYSTEM - Translation Service with MongoDB Caching 🌍🐾
// Auto-translates MongoDB data and caches translations in the database, nyaa~!

const translate = require('@vitalets/google-translate-api');

/**
 * 🌐 Translation Service Configuration
 *
 * Supported Languages:
 * - en: English (default)
 * - es: Spanish (Español)
 * - zh: Chinese (中文)
 * - hi: Hindi (हिन्दी)
 * - ar: Arabic (العربية)
 */

const SUPPORTED_LANGUAGES = ['en', 'es', 'zh', 'hi', 'ar'];
const DEFAULT_LANGUAGE = 'en';

/**
 * 🎯 Translate a single text string
 *
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g., 'es', 'zh')
 * @param {string} sourceLang - Source language code (default: 'en')
 * @returns {Promise<string>} - Translated text
 */
async function translateText(text, targetLang, sourceLang = 'en') {
  try {
    // If target language is English or same as source, no translation needed
    if (targetLang === sourceLang || targetLang === 'en') {
      return text;
    }

    // Validate language support
    if (!SUPPORTED_LANGUAGES.includes(targetLang)) {
      console.warn(`⚠️ [Translation] Unsupported language: ${targetLang}, falling back to English`);
      return text;
    }

    // Skip null/undefined/empty text
    if (!text || typeof text !== 'string') {
      return text;
    }

    // Perform translation
    const result = await translate(text, { from: sourceLang, to: targetLang });
    return result.text;

  } catch (error) {
    console.error(`❌ [Translation] Failed to translate text: ${error.message}`);
    return text; // Return original text on error
  }
}

/**
 * 🔄 Translate an array of strings
 *
 * @param {string[]} textArray - Array of strings to translate
 * @param {string} targetLang - Target language code
 * @param {string} sourceLang - Source language code (default: 'en')
 * @returns {Promise<string[]>} - Array of translated strings
 */
async function translateArray(textArray, targetLang, sourceLang = 'en') {
  if (!Array.isArray(textArray)) {
    return textArray;
  }

  const translations = await Promise.all(
    textArray.map(text => translateText(text, targetLang, sourceLang))
  );

  return translations;
}

/**
 * 📦 Translate specific fields in a MongoDB document
 *
 * This function identifies translatable fields and translates them,
 * then saves the translations to a `translations` object in the document.
 *
 * @param {Object} document - MongoDB document
 * @param {string} targetLang - Target language code
 * @param {Object} db - MongoDB database instance
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Object>} - Document with translated fields
 */
async function translateDocument(document, targetLang, db, collectionName) {
  try {
    // If target language is English, return original document
    if (targetLang === 'en') {
      return document;
    }

    // Check if translations already exist for this language
    if (document.translations && document.translations[targetLang]) {
      console.log(`✅ [Translation] Using cached translation for ${targetLang}`);
      return applyTranslations(document, document.translations[targetLang]);
    }

    console.log(`🌐 [Translation] Translating document to ${targetLang}, nyaa~!`);

    // Define fields to translate based on collection type
    const translatableFields = getTranslatableFields(collectionName);

    // Create translations object
    const translations = {};

    // Translate each field
    for (const field of translatableFields) {
      const value = document[field];

      if (!value) continue;

      if (Array.isArray(value)) {
        // Translate arrays
        translations[field] = await translateArray(value, targetLang);
      } else if (typeof value === 'string') {
        // Translate strings
        translations[field] = await translateText(value, targetLang);
      } else if (typeof value === 'object') {
        // Translate nested objects (e.g., origin.country)
        translations[field] = await translateObject(value, targetLang);
      }
    }

    // Save translations to MongoDB
    await saveTranslations(db, collectionName, document._id, targetLang, translations);

    // Apply translations to document
    return applyTranslations(document, translations);

  } catch (error) {
    console.error(`❌ [Translation] Failed to translate document: ${error.message}`);
    return document; // Return original document on error
  }
}

/**
 * 🗂️ Get translatable fields based on collection name
 *
 * @param {string} collectionName - Name of the MongoDB collection
 * @returns {string[]} - Array of field names to translate
 */
function getTranslatableFields(collectionName) {
  const fieldMappings = {
    'threat_actors': [
      'name',
      'categories',
      'targets',
      'attack_vectors',
      'major_crimes',
      'origin', // Will translate nested fields
      'position',
      'classification'
    ],
    'dina_perpetrators': [
      'fullName',
      'position',
      'major_crimes',
      'significance',
      'rank',
      'organization'
    ],
    'dina_torture_centers': [
      'name',
      'location',
      'description',
      'known_for'
    ],
    'dina_international_crimes': [
      'crime',
      'description',
      'location',
      'victims'
    ]
  };

  return fieldMappings[collectionName] || [];
}

/**
 * 🔄 Translate nested object fields
 *
 * @param {Object} obj - Object to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<Object>} - Translated object
 */
async function translateObject(obj, targetLang) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const translated = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLang);
    } else if (Array.isArray(value)) {
      translated[key] = await translateArray(value, targetLang);
    } else {
      translated[key] = value; // Keep non-string values as-is
    }
  }

  return translated;
}

/**
 * 💾 Save translations to MongoDB
 *
 * Saves the translations object to the document for future reuse.
 *
 * @param {Object} db - MongoDB database instance
 * @param {string} collectionName - Name of the collection
 * @param {ObjectId} documentId - Document _id
 * @param {string} targetLang - Target language code
 * @param {Object} translations - Translations object
 */
async function saveTranslations(db, collectionName, documentId, targetLang, translations) {
  try {
    await db.collection(collectionName).updateOne(
      { _id: documentId },
      {
        $set: {
          [`translations.${targetLang}`]: translations,
          [`translations.${targetLang}_updated_at`]: new Date()
        }
      }
    );
    console.log(`✅ [Translation] Saved ${targetLang} translations to MongoDB, desu~!`);
  } catch (error) {
    console.error(`❌ [Translation] Failed to save translations: ${error.message}`);
  }
}

/**
 * 🎨 Apply translations to document
 *
 * Replaces original field values with translated values.
 *
 * @param {Object} document - Original document
 * @param {Object} translations - Translations object
 * @returns {Object} - Document with translated fields
 */
function applyTranslations(document, translations) {
  const translated = { ...document };

  for (const [field, value] of Object.entries(translations)) {
    if (field.endsWith('_updated_at')) continue; // Skip metadata fields
    translated[field] = value;
  }

  return translated;
}

/**
 * 📚 Translate an array of documents
 *
 * @param {Object[]} documents - Array of MongoDB documents
 * @param {string} targetLang - Target language code
 * @param {Object} db - MongoDB database instance
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Object[]>} - Array of translated documents
 */
async function translateDocuments(documents, targetLang, db, collectionName) {
  if (!Array.isArray(documents) || documents.length === 0) {
    return documents;
  }

  // Translate documents in parallel for better performance
  const translatedDocs = await Promise.all(
    documents.map(doc => translateDocument(doc, targetLang, db, collectionName))
  );

  return translatedDocs;
}

/**
 * 🔍 Get user language from request headers
 *
 * @param {Object} req - Express request object
 * @returns {string} - Language code
 */
function getUserLanguage(req) {
  // Check query parameter first
  const queryLang = req.query.lang || req.query.language;
  if (queryLang && SUPPORTED_LANGUAGES.includes(queryLang)) {
    return queryLang;
  }

  // Check custom header
  const headerLang = req.headers['x-user-language'] || req.headers['accept-language'];
  if (headerLang) {
    const lang = headerLang.split(',')[0].split('-')[0].toLowerCase();
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang;
    }
  }

  // Default to English
  return DEFAULT_LANGUAGE;
}

module.exports = {
  translateText,
  translateArray,
  translateDocument,
  translateDocuments,
  getUserLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE
};
