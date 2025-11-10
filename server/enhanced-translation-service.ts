// 🐾🌍 NEKO DEFENSE SYSTEM - Enhanced Translation Service v2.0 🌍🐾
// Multi-provider translation with quality scoring, advanced caching, and context awareness!

const translate = require('@vitalets/google-translate-api');
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// ============================================================================
// 🎯 ENHANCED CONFIGURATION
// ============================================================================

interface TranslationProvider {
  name: string;
  apiFunction: (...args: any[]) => any;
  priority: number;
  quality: number;
  costPerChar: number;
  rateLimitPerMinute: number;
}

interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  priority: number;
  complexityLevel: 'simple' | 'medium' | 'complex';
  providers: string[];
}

interface TranslationCache {
  _id?: ObjectId;
  originalText: string;
  translatedText: string;
  targetLang: string;
  sourceLang: string;
  provider: string;
  quality: number;
  createdAt: Date;
  expiresAt: Date;
  contextHash?: string;
  usage: number;
}

interface TranslationQualityMetrics {
  confidence: number;
  fluency: number;
  contextRelevance: number;
  overallScore: number;
}

// Enhanced language support (12+ languages)
const ENHANCED_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    dir: 'ltr',
    priority: 1,
    complexityLevel: 'simple',
    providers: ['google', 'deepl'],
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    dir: 'ltr',
    priority: 2,
    complexityLevel: 'simple',
    providers: ['google', 'deepl'],
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    dir: 'ltr',
    priority: 3,
    complexityLevel: 'complex',
    providers: ['google', 'deepl'],
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    dir: 'ltr',
    priority: 4,
    complexityLevel: 'complex',
    providers: ['google'],
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    priority: 5,
    complexityLevel: 'complex',
    providers: ['google'],
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    dir: 'ltr',
    priority: 6,
    complexityLevel: 'medium',
    providers: ['google', 'deepl'],
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    priority: 7,
    complexityLevel: 'medium',
    providers: ['google', 'deepl'],
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    dir: 'ltr',
    priority: 8,
    complexityLevel: 'complex',
    providers: ['google', 'deepl'],
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    dir: 'ltr',
    priority: 9,
    complexityLevel: 'medium',
    providers: ['google', 'deepl'],
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    dir: 'ltr',
    priority: 10,
    complexityLevel: 'medium',
    providers: ['google', 'deepl'],
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    dir: 'ltr',
    priority: 11,
    complexityLevel: 'complex',
    providers: ['google'],
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    dir: 'ltr',
    priority: 12,
    complexityLevel: 'medium',
    providers: ['google', 'deepl'],
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    dir: 'ltr',
    priority: 13,
    complexityLevel: 'medium',
    providers: ['google', 'deepl'],
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    dir: 'ltr',
    priority: 14,
    complexityLevel: 'medium',
    providers: ['google'],
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    dir: 'ltr',
    priority: 15,
    complexityLevel: 'medium',
    providers: ['google', 'deepl'],
  },
];

// Translation providers configuration
const TRANSLATION_PROVIDERS: TranslationProvider[] = [
  {
    name: 'google',
    apiFunction: translate,
    priority: 1,
    quality: 85,
    costPerChar: 0.00002,
    rateLimitPerMinute: 1000,
  },
  {
    name: 'deepl',
    apiFunction: null, // Will be implemented
    priority: 2,
    quality: 95,
    costPerChar: 0.00005,
    rateLimitPerMinute: 500,
  },
];

// Context-aware translations for technical terms
const TECHNICAL_TERM_DICTIONARY: Record<string, Record<string, string>> = {
  es: {
    Ransomware: 'Ransomware',
    Malware: 'Software Malicioso',
    Phishing: 'Suplantación de Identidad',
    'Zero-day': 'Vulnerabilidad de Día Cero',
    APT: 'Amenaza Persistente Avanzada',
    DDoS: 'Ataque de Denegación de Servicio',
    DINA: 'DINA',
    'Threat Actor': 'Actor de Amenaza',
    'Cyber Attack': 'Ciberataque',
    'Data Breach': 'Violación de Datos',
  },
  zh: {
    Ransomware: '勒索软件',
    Malware: '恶意软件',
    Phishing: '网络钓鱼',
    'Zero-day': '零日漏洞',
    APT: '高级持续威胁',
    DDoS: '分布式拒绝服务攻击',
    DINA: 'DINA',
    'Threat Actor': '威胁行为者',
    'Cyber Attack': '网络攻击',
    'Data Breach': '数据泄露',
  },
  fr: {
    Ransomware: 'Rançongiciel',
    Malware: 'Logiciel Malveillant',
    Phishing: 'Hameçonnage',
    'Zero-day': 'Vulnérabilité Zero-day',
    APT: 'Menace Persistante Avancée',
    DDoS: 'Attaque par Déni de Service',
    DINA: 'DINA',
    'Threat Actor': 'Acteur de Menace',
    'Cyber Attack': 'Cyberattaque',
    'Data Breach': 'Violation de Données',
  },
};

// ============================================================================
// 🔧 ENHANCED TRANSLATION CLASS
// ============================================================================

export class EnhancedTranslationService {
  private db: Db;
  private cacheCollection: Collection<TranslationCache>;
  private metricsCollection: Collection;
  private providers: Map<string, TranslationProvider>;
  private rateLimitTracking: Map<string, { count: number; resetTime: number }>;

  constructor(db: Db) {
    this.db = db;
    this.cacheCollection = db.collection('translation_cache');
    this.metricsCollection = db.collection('translation_metrics');
    this.providers = new Map(TRANSLATION_PROVIDERS.map((p) => [p.name, p]));
    this.rateLimitTracking = new Map();
    this.initializeIndexes();
  }

  // ============================================================================
  // 🏗️ INITIALIZATION
  // ============================================================================

  private async initializeIndexes(): Promise<void> {
    try {
      // Create indexes for optimal cache performance
      await this.cacheCollection.createIndex(
        { originalText: 1, targetLang: 1, contextHash: 1 },
        { unique: true }
      );
      await this.cacheCollection.createIndex(
        { expiresAt: 1 },
        { expireAfterSeconds: 0 }
      );
      await this.cacheCollection.createIndex({ usage: -1 });
      await this.cacheCollection.createIndex({ quality: -1 });

      console.log('✅ [Translation] Cache indexes initialized');
    } catch (error) {
      console.error('❌ [Translation] Failed to initialize indexes:', error);
    }
  }

  // ============================================================================
  // 🎯 MAIN TRANSLATION METHODS
  // ============================================================================

  /**
   * Enhanced text translation with quality scoring and fallback providers
   */
  async translateText(
    text: string,
    targetLang: string,
    sourceLang: string = 'en',
    context?: string
  ): Promise<{
    translatedText: string;
    quality: TranslationQualityMetrics;
    provider: string;
    cached: boolean;
  }> {
    try {
      // Input validation
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return {
          translatedText: text,
          quality: {
            confidence: 0,
            fluency: 0,
            contextRelevance: 0,
            overallScore: 0,
          },
          provider: 'none',
          cached: false,
        };
      }

      // Same language check
      if (targetLang === sourceLang) {
        return {
          translatedText: text,
          quality: {
            confidence: 100,
            fluency: 100,
            contextRelevance: 100,
            overallScore: 100,
          },
          provider: 'none',
          cached: false,
        };
      }

      // Language support validation
      const targetLanguage = ENHANCED_LANGUAGES.find(
        (l) => l.code === targetLang
      );
      if (!targetLanguage) {
        console.warn(`⚠️ [Translation] Unsupported language: ${targetLang}`);
        return {
          translatedText: text,
          quality: {
            confidence: 0,
            fluency: 0,
            contextRelevance: 0,
            overallScore: 0,
          },
          provider: 'none',
          cached: false,
        };
      }

      // Generate context hash for cache key
      const contextHash = context
        ? this.generateContextHash(text, context)
        : undefined;

      // Check cache first
      const cached = await this.getCachedTranslation(
        text,
        targetLang,
        sourceLang,
        contextHash
      );
      if (cached) {
        await this.updateCacheUsage(cached);
        return {
          translatedText: cached.translatedText,
          quality: this.calculateQualityMetrics(cached),
          provider: cached.provider,
          cached: true,
        };
      }

      // Apply technical term dictionary first
      const preprocessedText = this.applyTechnicalTerms(text, targetLang);

      // Try translation providers in order of preference
      const availableProviders = targetLanguage.providers
        .map((name) => this.providers.get(name))
        .filter((p) => p && this.checkRateLimit(p.name))
        .sort((a, b) => (b?.quality || 0) - (a?.quality || 0));

      if (availableProviders.length === 0) {
        throw new Error('No available translation providers');
      }

      let bestResult: any = null;
      const errors: string[] = [];

      for (const provider of availableProviders) {
        try {
          const result = await this.translateWithProvider(
            preprocessedText,
            targetLang,
            sourceLang,
            provider!
          );

          if (result) {
            const quality = await this.scoreTranslationQuality(
              preprocessedText,
              result.translatedText,
              targetLang,
              context
            );

            if (
              !bestResult ||
              quality.overallScore > bestResult.quality.overallScore
            ) {
              bestResult = {
                ...result,
                quality,
                provider: provider!.name,
              };
            }

            // If quality is high enough, stop trying other providers
            if (quality.overallScore >= 85) {
              break;
            }
          }
        } catch (error: any) {
          errors.push(`${provider!.name}: ${error.message}`);
          this.recordRateLimit(provider!.name);
        }
      }

      if (!bestResult) {
        throw new Error(`All providers failed: ${errors.join(', ')}`);
      }

      // Cache the result
      await this.cacheTranslation(
        text,
        bestResult.translatedText,
        targetLang,
        sourceLang,
        bestResult.provider,
        bestResult.quality.overallScore,
        contextHash
      );

      return {
        translatedText: bestResult.translatedText,
        quality: bestResult.quality,
        provider: bestResult.provider,
        cached: false,
      };
    } catch (error: any) {
      console.error(
        `❌ [Translation] Failed to translate text: ${error.message}`
      );
      return {
        translatedText: text,
        quality: {
          confidence: 0,
          fluency: 0,
          contextRelevance: 0,
          overallScore: 0,
        },
        provider: 'error',
        cached: false,
      };
    }
  }

  /**
   * Enhanced document translation with field-specific context
   */
  async translateDocument(
    document: any,
    targetLang: string,
    collectionName: string,
    sourceLang: string = 'en'
  ): Promise<any> {
    try {
      if (targetLang === sourceLang) {
        return document;
      }

      // Check for cached document translation
      const cacheKey = `doc_${document._id}_${targetLang}`;
      const cachedDoc = await this.getCachedDocumentTranslation(cacheKey);
      if (cachedDoc && this.isCacheValid(cachedDoc)) {
        console.log(
          `✅ [Translation] Using cached document translation for ${targetLang}`
        );
        return this.applyDocumentTranslations(document, cachedDoc);
      }

      console.log(
        `🌐 [Translation] Translating document to ${targetLang} with enhanced service`
      );

      const translatableFields = this.getTranslatableFields(collectionName);
      const translations: any = {};
      const translationPromises: Promise<any>[] = [];

      // Prepare all translation tasks
      for (const field of translatableFields) {
        const value = document[field];
        if (!value) {
          continue;
        }

        const context = `${collectionName}.${field}`;

        if (Array.isArray(value)) {
          translationPromises.push(
            this.translateArray(value, targetLang, sourceLang, context).then(
              (result) => ({ field, result })
            )
          );
        } else if (typeof value === 'string') {
          translationPromises.push(
            this.translateText(value, targetLang, sourceLang, context).then(
              (result) => ({ field, result: result.translatedText })
            )
          );
        } else if (typeof value === 'object') {
          translationPromises.push(
            this.translateObject(value, targetLang, sourceLang, context).then(
              (result) => ({ field, result })
            )
          );
        }
      }

      // Execute all translations in parallel
      const results = await Promise.all(translationPromises);

      // Collect results
      for (const { field, result } of results) {
        translations[field] = result;
      }

      // Cache document translation
      await this.cacheDocumentTranslation(cacheKey, translations);

      // Save translations to document
      await this.saveDocumentTranslations(
        this.db,
        collectionName,
        document._id,
        targetLang,
        translations
      );

      return this.applyDocumentTranslations(document, translations);
    } catch (error: any) {
      console.error(
        `❌ [Translation] Failed to translate document: ${error.message}`
      );
      return document;
    }
  }

  // ============================================================================
  // 🛠️ HELPER METHODS
  // ============================================================================

  private async translateWithProvider(
    text: string,
    targetLang: string,
    sourceLang: string,
    provider: TranslationProvider
  ): Promise<{ translatedText: string }> {
    switch (provider.name) {
      case 'google':
        const result = await translate(text, {
          from: sourceLang,
          to: targetLang,
        });
        return { translatedText: result.text };

      case 'deepl':
        // Note: DeepL integration would require API key
        // For now, fallback to Google
        const fallbackResult = await translate(text, {
          from: sourceLang,
          to: targetLang,
        });
        return { translatedText: fallbackResult.text };

      default:
        throw new Error(`Unknown provider: ${provider.name}`);
    }
  }

  private async scoreTranslationQuality(
    originalText: string,
    translatedText: string,
    targetLang: string,
    context?: string
  ): Promise<TranslationQualityMetrics> {
    // Basic quality scoring algorithm
    // In production, this could use ML models or external quality APIs

    let confidence = 85; // Base confidence
    let fluency = 80; // Base fluency
    let contextRelevance = 75; // Base context relevance

    // Length similarity check
    const lengthRatio = translatedText.length / originalText.length;
    if (lengthRatio < 0.5 || lengthRatio > 2.0) {
      confidence -= 20;
    }

    // Technical term preservation check
    const technicalTerms = TECHNICAL_TERM_DICTIONARY[targetLang] || {};
    for (const [english, translated] of Object.entries(technicalTerms)) {
      if (originalText.includes(english)) {
        if (
          translatedText.includes(translated) ||
          translatedText.includes(english)
        ) {
          contextRelevance += 5;
        } else {
          contextRelevance -= 10;
        }
      }
    }

    // Context awareness bonus
    if (context) {
      contextRelevance += 10;
    }

    // Language complexity adjustment
    const targetLanguage = ENHANCED_LANGUAGES.find(
      (l) => l.code === targetLang
    );
    if (targetLanguage?.complexityLevel === 'complex') {
      confidence -= 5;
      fluency -= 5;
    } else if (targetLanguage?.complexityLevel === 'simple') {
      confidence += 5;
      fluency += 5;
    }

    // Ensure values are within bounds
    confidence = Math.max(0, Math.min(100, confidence));
    fluency = Math.max(0, Math.min(100, fluency));
    contextRelevance = Math.max(0, Math.min(100, contextRelevance));

    const overallScore = (confidence + fluency + contextRelevance) / 3;

    return { confidence, fluency, contextRelevance, overallScore };
  }

  private applyTechnicalTerms(text: string, targetLang: string): string {
    const terms = TECHNICAL_TERM_DICTIONARY[targetLang];
    if (!terms) {
      return text;
    }

    let processedText = text;
    for (const [english, translated] of Object.entries(terms)) {
      // Create a regex that matches the term but preserves case
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      processedText = processedText.replace(regex, translated);
    }

    return processedText;
  }

  private generateContextHash(text: string, context: string): string {
    // Simple hash function for cache keys
    const combined = `${text}_${context}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }

  private async getCachedTranslation(
    text: string,
    targetLang: string,
    sourceLang: string,
    contextHash?: string
  ): Promise<TranslationCache | null> {
    try {
      const query: any = {
        originalText: text,
        targetLang,
        sourceLang,
        expiresAt: { $gt: new Date() },
      };

      if (contextHash) {
        query.contextHash = contextHash;
      }

      return await this.cacheCollection.findOne(query);
    } catch (error) {
      console.error('❌ [Translation] Cache lookup failed:', error);
      return null;
    }
  }

  private async cacheTranslation(
    originalText: string,
    translatedText: string,
    targetLang: string,
    sourceLang: string,
    provider: string,
    quality: number,
    contextHash?: string
  ): Promise<void> {
    try {
      const cacheEntry: TranslationCache = {
        originalText,
        translatedText,
        targetLang,
        sourceLang,
        provider,
        quality,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days TTL
        contextHash,
        usage: 1,
      };

      await this.cacheCollection.replaceOne(
        { originalText, targetLang, sourceLang, contextHash },
        cacheEntry,
        { upsert: true }
      );

      console.log(`✅ [Translation] Cached translation for ${targetLang}`);
    } catch (error) {
      console.error('❌ [Translation] Failed to cache translation:', error);
    }
  }

  private async updateCacheUsage(cache: TranslationCache): Promise<void> {
    try {
      await this.cacheCollection.updateOne(
        { _id: cache._id },
        { $inc: { usage: 1 } }
      );
    } catch (error) {
      console.error('❌ [Translation] Failed to update cache usage:', error);
    }
  }

  private checkRateLimit(providerName: string): boolean {
    const tracking = this.rateLimitTracking.get(providerName);
    const now = Date.now();

    if (!tracking || now > tracking.resetTime) {
      // Reset or initialize rate limit tracking
      const provider = this.providers.get(providerName);
      this.rateLimitTracking.set(providerName, {
        count: 0,
        resetTime: now + 60000, // 1 minute
      });
      return true;
    }

    const provider = this.providers.get(providerName);
    return tracking.count < (provider?.rateLimitPerMinute || 1000);
  }

  private recordRateLimit(providerName: string): void {
    const tracking = this.rateLimitTracking.get(providerName);
    if (tracking) {
      tracking.count++;
    }
  }

  private calculateQualityMetrics(
    cache: TranslationCache
  ): TranslationQualityMetrics {
    // Use cached quality or calculate basic metrics
    const baseScore = cache.quality || 75;
    return {
      confidence: baseScore,
      fluency: baseScore,
      contextRelevance: baseScore,
      overallScore: baseScore,
    };
  }

  private async translateArray(
    textArray: string[],
    targetLang: string,
    sourceLang: string = 'en',
    context?: string
  ): Promise<string[]> {
    if (!Array.isArray(textArray)) {
      return textArray;
    }

    const translations = await Promise.all(
      textArray.map(async (text) => {
        const result = await this.translateText(
          text,
          targetLang,
          sourceLang,
          context
        );
        return result.translatedText;
      })
    );

    return translations;
  }

  private async translateObject(
    obj: any,
    targetLang: string,
    sourceLang: string = 'en',
    context?: string
  ): Promise<any> {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    const translated: any = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        const result = await this.translateText(
          value,
          targetLang,
          sourceLang,
          `${context}.${key}`
        );
        translated[key] = result.translatedText;
      } else if (Array.isArray(value)) {
        translated[key] = await this.translateArray(
          value,
          targetLang,
          sourceLang,
          `${context}.${key}`
        );
      } else {
        translated[key] = value;
      }
    }

    return translated;
  }

  private getTranslatableFields(collectionName: string): string[] {
    const fieldMappings: Record<string, string[]> = {
      threat_actors: [
        'name',
        'categories',
        'targets',
        'attack_vectors',
        'major_crimes',
        'origin',
        'position',
        'classification',
      ],
      dina_perpetrators: [
        'fullName',
        'position',
        'major_crimes',
        'significance',
        'rank',
        'organization',
      ],
      dina_torture_centers: ['name', 'location', 'description', 'known_for'],
      dina_international_crimes: [
        'crime',
        'description',
        'location',
        'victims',
      ],
    };

    return fieldMappings[collectionName] || [];
  }

  private async getCachedDocumentTranslation(cacheKey: string): Promise<any> {
    // Implement document-level caching
    return null; // Placeholder
  }

  private isCacheValid(cachedDoc: any): boolean {
    // Implement cache validity check
    return false; // Placeholder
  }

  private applyDocumentTranslations(document: any, translations: any): any {
    const translated = { ...document };

    for (const [field, value] of Object.entries(translations)) {
      if (field.endsWith('_updated_at')) {
        continue;
      }
      translated[field] = value;
    }

    return translated;
  }

  private async cacheDocumentTranslation(
    cacheKey: string,
    translations: any
  ): Promise<void> {
    // Implement document-level caching
  }

  private async saveDocumentTranslations(
    db: Db,
    collectionName: string,
    documentId: any,
    targetLang: string,
    translations: any
  ): Promise<void> {
    try {
      await db.collection(collectionName).updateOne(
        { _id: documentId },
        {
          $set: {
            [`translations.${targetLang}`]: translations,
            [`translations.${targetLang}_updated_at`]: new Date(),
          },
        }
      );
      console.log(
        `✅ [Translation] Saved ${targetLang} translations to MongoDB`
      );
    } catch (error) {
      console.error(`❌ [Translation] Failed to save translations: ${error}`);
    }
  }

  // ============================================================================
  // 🚀 PUBLIC API METHODS
  // ============================================================================

  /**
   * Get user language from request with enhanced detection
   */
  getUserLanguage(req: any): string {
    // Priority order: query param > custom header > accept-language > user preferences
    const queryLang = req.query.lang || req.query.language;
    if (queryLang && this.isLanguageSupported(queryLang)) {
      return queryLang;
    }

    const headerLang = req.headers['x-user-language'];
    if (headerLang && this.isLanguageSupported(headerLang)) {
      return headerLang;
    }

    const acceptLang = req.headers['accept-language'];
    if (acceptLang) {
      const lang = acceptLang.split(',')[0].split('-')[0].toLowerCase();
      if (this.isLanguageSupported(lang)) {
        return lang;
      }
    }

    return 'en'; // Default to English
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(langCode: string): boolean {
    return ENHANCED_LANGUAGES.some((lang) => lang.code === langCode);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): LanguageConfig[] {
    return ENHANCED_LANGUAGES;
  }

  /**
   * Get translation statistics
   */
  async getTranslationStats(): Promise<any> {
    try {
      const [cacheStats, usageStats] = await Promise.all([
        this.cacheCollection
          .aggregate([
            {
              $group: {
                _id: '$targetLang',
                count: { $sum: 1 },
                avgQuality: { $avg: '$quality' },
                totalUsage: { $sum: '$usage' },
              },
            },
          ])
          .toArray(),
        this.metricsCollection
          .aggregate([
            {
              $group: {
                _id: {
                  provider: '$provider',
                  date: {
                    $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                  },
                },
                requests: { $sum: 1 },
                avgQuality: { $avg: '$quality' },
              },
            },
          ])
          .toArray(),
      ]);

      return { cacheStats, usageStats };
    } catch (error) {
      console.error('❌ [Translation] Failed to get stats:', error);
      return { cacheStats: [], usageStats: [] };
    }
  }
}

// ============================================================================
// 🔧 EXPORT FUNCTIONS FOR BACKWARD COMPATIBILITY
// ============================================================================

let enhancedService: EnhancedTranslationService | null = null;

export function initializeEnhancedTranslationService(db: Db): void {
  enhancedService = new EnhancedTranslationService(db);
}

export async function enhancedTranslateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'en',
  context?: string
): Promise<string> {
  if (!enhancedService) {
    throw new Error('Enhanced translation service not initialized');
  }

  const result = await enhancedService.translateText(
    text,
    targetLang,
    sourceLang,
    context
  );
  return result.translatedText;
}

export async function enhancedTranslateDocument(
  document: any,
  targetLang: string,
  collectionName: string,
  sourceLang: string = 'en'
): Promise<any> {
  if (!enhancedService) {
    throw new Error('Enhanced translation service not initialized');
  }

  return await enhancedService.translateDocument(
    document,
    targetLang,
    collectionName,
    sourceLang
  );
}

export function enhancedGetUserLanguage(req: any): string {
  if (!enhancedService) {
    // Fallback to basic detection
    const queryLang = req.query.lang || req.query.language;
    if (queryLang && ENHANCED_LANGUAGES.some((l) => l.code === queryLang)) {
      return queryLang;
    }
    return 'en';
  }

  return enhancedService.getUserLanguage(req);
}

export { ENHANCED_LANGUAGES };
