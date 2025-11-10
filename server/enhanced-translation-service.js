// 🌍⚡ NEKO DEFENSE - Enhanced Translation Service v2.0 ⚡🌍
// Multi-provider translation with quality scoring, caching, and analytics, desu~!

const { translate } = require('@vitalets/google-translate-api');

class EnhancedTranslationService {
  constructor(database) {
    this.db = database;
    this.cacheCollection = 'enhanced_translation_cache';
    this.metricsCollection = 'translation_metrics';
    this.providersConfig = {
      google: { enabled: true, priority: 1 },
      fallback: { enabled: true, priority: 2 },
    };

    console.log('🌟 Enhanced Translation Service v2.0 initialized, nyaa~!');
  }

  async initialize() {
    try {
      // Ensure indexes for cache performance
      await this.db
        .collection(this.cacheCollection)
        .createIndex(
          { textHash: 1, targetLang: 1 },
          { name: 'cache_lookup_index' }
        );

      await this.db.collection(this.cacheCollection).createIndex(
        { createdAt: 1 },
        { expireAfterSeconds: 7 * 24 * 60 * 60 } // 7 days TTL
      );

      console.log('✅ Enhanced Translation Service indexes created, desu~!');
      return true;
    } catch (error) {
      console.error(
        '❌ Enhanced Translation Service initialization error:',
        error
      );
      return false;
    }
  }

  // Generate hash for caching
  generateTextHash(text, sourceLang, targetLang) {
    const crypto = require('crypto');
    return crypto
      .createHash('md5')
      .update(`${text}-${sourceLang}-${targetLang}`)
      .digest('hex');
  }

  // Enhanced translation with quality scoring
  async translateWithQuality(
    text,
    targetLang,
    sourceLang = 'auto',
    context = null,
    preferredProvider = 'google'
  ) {
    try {
      const textHash = this.generateTextHash(text, sourceLang, targetLang);

      // Check cache first
      const cached = await this.getCachedTranslation(textHash, targetLang);
      if (cached) {
        console.log('💾 [Enhanced Translation] Cache hit!');
        return { ...cached.result, cached: true };
      }

      // Translate using primary provider
      const result = await this.performTranslation(
        text,
        targetLang,
        sourceLang,
        preferredProvider,
        context
      );

      // Calculate quality score
      const qualityScore = await this.calculateQualityScore(
        text,
        result.translatedText,
        sourceLang,
        targetLang
      );
      result.quality = qualityScore;

      // Cache the result
      await this.cacheTranslation(textHash, targetLang, result);

      // Log metrics
      await this.logMetrics(text, result, preferredProvider);

      console.log(
        `✅ [Enhanced Translation] Completed with quality: ${qualityScore.overallScore}`
      );
      return result;
    } catch (error) {
      console.error('❌ [Enhanced Translation] Error:', error);
      throw error;
    }
  }

  // Perform actual translation
  async performTranslation(text, targetLang, sourceLang, provider, context) {
    try {
      let translatedText;
      let detectedSourceLang = sourceLang;

      if (provider === 'google' || provider === 'fallback') {
        const result = await translate(text, {
          to: targetLang,
          from: sourceLang === 'auto' ? undefined : sourceLang,
        });

        translatedText = result.text;
        detectedSourceLang = result.from?.language?.iso || sourceLang;
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }

      return {
        translatedText,
        sourceLang: detectedSourceLang,
        targetLang,
        provider,
        context,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(
        `❌ [Enhanced Translation] Provider ${provider} failed:`,
        error
      );
      throw error;
    }
  }

  // Calculate quality score
  async calculateQualityScore(
    originalText,
    translatedText,
    sourceLang,
    targetLang
  ) {
    try {
      const metrics = {
        lengthRatio: translatedText.length / originalText.length,
        hasContent: translatedText.length > 0,
        notIdentical: originalText !== translatedText,
        noErrorMarkers:
          !translatedText.includes('[ERROR]') &&
          !translatedText.includes('Error:'),
        complexity: this.calculateTextComplexity(originalText),
      };

      // Calculate scores
      const scores = {
        lengthScore: this.scoreLengthRatio(metrics.lengthRatio),
        contentScore: metrics.hasContent ? 100 : 0,
        uniquenessScore: metrics.notIdentical ? 100 : 0,
        errorScore: metrics.noErrorMarkers ? 100 : 0,
        complexityScore: metrics.complexity,
      };

      const overallScore = Math.round(
        scores.lengthScore * 0.2 +
          scores.contentScore * 0.3 +
          scores.uniquenessScore * 0.2 +
          scores.errorScore * 0.2 +
          scores.complexityScore * 0.1
      );

      return {
        overallScore,
        breakdown: scores,
        metrics,
        grade: this.getQualityGrade(overallScore),
      };
    } catch (error) {
      console.error(
        '❌ [Enhanced Translation] Quality calculation error:',
        error
      );
      return {
        overallScore: 50,
        breakdown: {},
        metrics: {},
        grade: 'C',
        error: error.message,
      };
    }
  }

  // Score length ratio (ideal is 0.8-1.2)
  scoreLengthRatio(ratio) {
    if (ratio >= 0.8 && ratio <= 1.2) {
      return 100;
    }
    if (ratio >= 0.6 && ratio <= 1.4) {
      return 80;
    }
    if (ratio >= 0.4 && ratio <= 1.6) {
      return 60;
    }
    return 40;
  }

  // Calculate text complexity
  calculateTextComplexity(text) {
    const words = text.split(/\s+/).length;
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
    const avgWordLength = text.replace(/\s+/g, '').length / words;

    const complexity = (uniqueWords / words) * 50 + (avgWordLength / 10) * 50;
    return Math.min(100, Math.max(0, complexity));
  }

  // Get quality grade
  getQualityGrade(score) {
    if (score >= 90) {
      return 'A+';
    }
    if (score >= 85) {
      return 'A';
    }
    if (score >= 80) {
      return 'B+';
    }
    if (score >= 75) {
      return 'B';
    }
    if (score >= 70) {
      return 'C+';
    }
    if (score >= 65) {
      return 'C';
    }
    if (score >= 60) {
      return 'D+';
    }
    if (score >= 55) {
      return 'D';
    }
    return 'F';
  }

  // Cache translation
  async cacheTranslation(textHash, targetLang, result) {
    try {
      await this.db.collection(this.cacheCollection).insertOne({
        textHash,
        targetLang,
        result,
        createdAt: new Date(),
        hits: 0,
      });
    } catch (error) {
      console.error('❌ [Enhanced Translation] Cache save error:', error);
    }
  }

  // Get cached translation
  async getCachedTranslation(textHash, targetLang) {
    try {
      const cached = await this.db.collection(this.cacheCollection).findOne({
        textHash,
        targetLang,
      });

      if (cached) {
        // Increment hit counter
        await this.db
          .collection(this.cacheCollection)
          .updateOne(
            { _id: cached._id },
            { $inc: { hits: 1 }, $set: { lastAccessed: new Date() } }
          );
      }

      return cached;
    } catch (error) {
      console.error('❌ [Enhanced Translation] Cache get error:', error);
      return null;
    }
  }

  // Log metrics
  async logMetrics(originalText, result, provider) {
    try {
      await this.db.collection(this.metricsCollection).insertOne({
        textLength: originalText.length,
        sourceLang: result.sourceLang,
        targetLang: result.targetLang,
        provider,
        qualityScore: result.quality?.overallScore || 0,
        cached: result.cached || false,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('❌ [Enhanced Translation] Metrics logging error:', error);
    }
  }

  // Bulk translation
  async translateBulk(texts, targetLang, sourceLang = 'auto', context = null) {
    try {
      console.log(
        `📦 [Enhanced Translation] Bulk translating ${texts.length} texts`
      );

      const results = [];
      for (let i = 0; i < texts.length; i++) {
        try {
          const result = await this.translateWithQuality(
            texts[i],
            targetLang,
            sourceLang,
            context
          );
          results.push(result);
        } catch (error) {
          results.push({
            error: error.message,
            originalText: texts[i],
            translatedText: texts[i], // Fallback to original
            quality: { overallScore: 0 },
          });
        }
      }

      return results;
    } catch (error) {
      console.error('❌ [Enhanced Translation] Bulk translation error:', error);
      throw error;
    }
  }

  // Analyze quality of existing translation
  async analyzeQuality(originalText, translatedText, sourceLang, targetLang) {
    return await this.calculateQualityScore(
      originalText,
      translatedText,
      sourceLang,
      targetLang
    );
  }

  // Get cache statistics
  async getCacheStats() {
    try {
      const totalEntries = await this.db
        .collection(this.cacheCollection)
        .countDocuments();
      const totalHits = await this.db
        .collection(this.cacheCollection)
        .aggregate([{ $group: { _id: null, totalHits: { $sum: '$hits' } } }])
        .toArray();

      const languageStats = await this.db
        .collection(this.cacheCollection)
        .aggregate([
          {
            $group: {
              _id: '$targetLang',
              count: { $sum: 1 },
              hits: { $sum: '$hits' },
            },
          },
          { $sort: { count: -1 } },
        ])
        .toArray();

      return {
        totalEntries,
        totalHits: totalHits[0]?.totalHits || 0,
        hitRate:
          totalEntries > 0
            ? (((totalHits[0]?.totalHits || 0) / totalEntries) * 100).toFixed(2)
            : 0,
        languageBreakdown: languageStats,
        generatedAt: new Date(),
      };
    } catch (error) {
      console.error('❌ [Enhanced Translation] Cache stats error:', error);
      return { error: error.message };
    }
  }

  // Clear cache
  async clearCache(language = null, olderThan = null) {
    try {
      const filter = {};

      if (language) {
        filter.targetLang = language;
      }

      if (olderThan) {
        filter.createdAt = { $lt: new Date(Date.now() - olderThan) };
      }

      const result = await this.db
        .collection(this.cacheCollection)
        .deleteMany(filter);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ [Enhanced Translation] Cache clear error:', error);
      return 0;
    }
  }

  // Get provider status
  async getProviderStatus() {
    try {
      // Test each provider
      const providerStatus = {};

      for (const [provider, config] of Object.entries(this.providersConfig)) {
        try {
          const testResult = await this.performTranslation(
            'Hello',
            'es',
            'en',
            provider === 'fallback' ? 'google' : provider
          );

          providerStatus[provider] = {
            enabled: config.enabled,
            status: 'healthy',
            priority: config.priority,
            lastChecked: new Date(),
            testTranslation: testResult.translatedText,
          };
        } catch (error) {
          providerStatus[provider] = {
            enabled: config.enabled,
            status: 'error',
            priority: config.priority,
            lastChecked: new Date(),
            error: error.message,
          };
        }
      }

      return providerStatus;
    } catch (error) {
      console.error('❌ [Enhanced Translation] Provider status error:', error);
      return { error: error.message };
    }
  }

  // Get usage metrics
  async getUsageMetrics(startDate = null, endDate = null) {
    try {
      const dateFilter = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }

      const filter =
        Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {};

      const metrics = await this.db
        .collection(this.metricsCollection)
        .aggregate([
          { $match: filter },
          {
            $group: {
              _id: null,
              totalTranslations: { $sum: 1 },
              avgQuality: { $avg: '$qualityScore' },
              languagePairs: {
                $addToSet: { source: '$sourceLang', target: '$targetLang' },
              },
              providers: { $addToSet: '$provider' },
            },
          },
        ])
        .toArray();

      return (
        metrics[0] || {
          totalTranslations: 0,
          avgQuality: 0,
          languagePairs: [],
          providers: [],
        }
      );
    } catch (error) {
      console.error('❌ [Enhanced Translation] Usage metrics error:', error);
      return { error: error.message };
    }
  }

  // Get supported languages
  async getSupportedLanguages() {
    const languages = [
      { code: 'en', name: 'English', nativeName: 'English', region: 'Global' },
      {
        code: 'es',
        name: 'Spanish',
        nativeName: 'Español',
        region: 'Spain/Latin America',
      },
      { code: 'fr', name: 'French', nativeName: 'Français', region: 'France' },
      { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Germany' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Italy' },
      {
        code: 'pt',
        name: 'Portuguese',
        nativeName: 'Português',
        region: 'Portugal/Brazil',
      },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Russia' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Japan' },
      {
        code: 'ko',
        name: 'Korean',
        nativeName: '한국어',
        region: 'South Korea',
      },
      { code: 'zh', name: 'Chinese', nativeName: '中文', region: 'China' },
      {
        code: 'ar',
        name: 'Arabic',
        nativeName: 'العربية',
        region: 'Middle East',
      },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India' },
      {
        code: 'nl',
        name: 'Dutch',
        nativeName: 'Nederlands',
        region: 'Netherlands',
      },
      { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Turkey' },
      { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Poland' },
    ];

    return languages;
  }

  // Detect language
  async detectLanguage(text) {
    try {
      const result = await translate(text, { to: 'en' });
      return {
        language: result.from?.language?.iso || 'unknown',
        confidence: result.from?.text?.autoCorrected ? 0.8 : 0.9,
        detectedText: result.from?.text?.value || text,
      };
    } catch (error) {
      console.error(
        '❌ [Enhanced Translation] Language detection error:',
        error
      );
      return {
        language: 'unknown',
        confidence: 0,
        error: error.message,
      };
    }
  }

  // Domain-specific translation
  async translateWithDomain(text, targetLang, domain, sourceLang = 'auto') {
    const contextMap = {
      technical: 'This is technical documentation.',
      medical: 'This is medical terminology.',
      legal: 'This is legal document text.',
      business: 'This is business communication.',
      casual: 'This is casual conversation.',
      academic: 'This is academic writing.',
    };

    const context = contextMap[domain] || null;
    return await this.translateWithQuality(
      text,
      targetLang,
      sourceLang,
      context
    );
  }

  // Compare providers A/B testing
  async compareProviders(text, targetLang, providers, sourceLang = 'auto') {
    try {
      const results = [];

      for (const provider of providers) {
        try {
          const result = await this.translateWithQuality(
            text,
            targetLang,
            sourceLang,
            null,
            provider
          );
          results.push({
            provider,
            success: true,
            ...result,
          });
        } catch (error) {
          results.push({
            provider,
            success: false,
            error: error.message,
            translatedText: '',
            quality: { overallScore: 0 },
          });
        }
      }

      // Sort by quality score
      results.sort(
        (a, b) =>
          (b.quality?.overallScore || 0) - (a.quality?.overallScore || 0)
      );

      return {
        bestProvider: results[0]?.provider,
        results,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(
        '❌ [Enhanced Translation] Provider comparison error:',
        error
      );
      throw error;
    }
  }
}

module.exports = { EnhancedTranslationService };
