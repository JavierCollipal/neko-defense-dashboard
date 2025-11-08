// 🐾⚡ NEKO DEFENSE DASHBOARD API SERVER ⚡🐾
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// 🌍 Translation Service with MongoDB Caching, nyaa~!
const {
  translateDocuments,
  getUserLanguage,
} = require('./translation-service');

// 🌟 Enhanced Translation Service v2.0 - Multi-provider with quality scoring, nyaa~!
const {
  EnhancedTranslationService,
} = require('./enhanced-translation-service');

const app = express();
const server = http.createServer(app);
const PORT = process.env.API_PORT || 5001;

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Same CORS logic as Express
      if (!origin) return callback(null, true);
      if (origin.includes('trycloudflare.com') || origin.includes('vercel.app') || origin.includes('railway.app')) {
        return callback(null, true);
      }
      const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(',');
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
});

// Trust proxy (required for Cloudflare, Vercel, Railway, etc.)
app.set('trust proxy', 1);

// 🔒 MongoDB Configuration (from environment variables only!)
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DATABASE || 'neko-defense-system';

// Security validation: Ensure credentials are set
if (!MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI environment variable not set!');
  console.error('💡 Set it in .env file, nyaa~!');
  process.exit(1);
}

let db;
let client;
let enhancedTranslationService;

// 🛡️ SECURITY MIDDLEWARE 🛡️

// Helmet: Security headers protection
app.use(
  helmet({
    contentSecurityPolicy: false, // Allow inline scripts for React
    crossOriginEmbedderPolicy: false,
  })
);

// CORS: Environment-aware origin whitelist, nyaa~! 🌍🔒
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  'http://localhost:3000,http://localhost:3001,http://localhost:5001'
).split(',');

// Smart CORS handler for development AND production
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman, etc)
      if (!origin) {
        return callback(null, true);
      }

      // Allow all trycloudflare.com tunnels (temporary testing)
      if (origin.includes('trycloudflare.com')) {
        console.log(`✅ [CORS] Allowed Cloudflare tunnel: ${origin}`);
        return callback(null, true);
      }

      // Allow all vercel.app deployments (production)
      if (origin.includes('vercel.app')) {
        console.log(`✅ [CORS] Allowed Vercel deployment: ${origin}`);
        return callback(null, true);
      }

      // Allow all railway.app deployments (production)
      if (origin.includes('railway.app')) {
        console.log(`✅ [CORS] Allowed Railway deployment: ${origin}`);
        return callback(null, true);
      }

      // Check explicit whitelist
      if (allowedOrigins.indexOf(origin) !== -1) {
        console.log(`✅ [CORS] Allowed whitelisted origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`🚫 [SECURITY] Blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Rate limiting: Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later, nyaa~! 🐾',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parser with size limits (prevent DoS)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Connect to MongoDB
async function connectDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ Connected to MongoDB Atlas, nyaa~!');

    // 🌟 Initialize Enhanced Translation Service v2.0, desu~!
    enhancedTranslationService = new EnhancedTranslationService(db);
    await enhancedTranslationService.initialize();
    console.log(
      '🌍✨ Enhanced Translation Service v2.0 initialized with multi-provider support, nyaa~!'
    );
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'LEGENDARY',
    message: 'Neko Defense API is purring perfectly! 🐾✨',
  });
});

// ============================================================================
// 🌍✨ ENHANCED TRANSLATION API v2.0 - Multi-Provider Excellence, nyaa~! ✨🌍
// ============================================================================

// Enhanced translation endpoint with quality scoring and multi-provider fallback
app.post('/api/translate/enhanced', async (req, res) => {
  try {
    console.log(
      '🌟 [Enhanced Translation API] Processing enhanced translation request, desu~!'
    );

    const { text, targetLang, sourceLang, context, preferredProvider } =
      req.body;

    if (!text || !targetLang) {
      return res.status(400).json({
        success: false,
        error: 'Text and target language are required!',
      });
    }

    const startTime = Date.now();
    const result = await enhancedTranslationService.translateWithQuality(
      text,
      targetLang,
      sourceLang || 'auto',
      context,
      preferredProvider
    );
    const processingTime = Date.now() - startTime;

    console.log(
      `✅ [Enhanced Translation] Translation completed in ${processingTime}ms with quality score: ${result.quality.overallScore}`
    );

    res.json({
      success: true,
      data: {
        translatedText: result.translatedText,
        sourceLang: result.sourceLang,
        targetLang: result.targetLang,
        provider: result.provider,
        quality: result.quality,
        cached: result.cached || false,
        processingTime: `${processingTime}ms`,
      },
    });
  } catch (error) {
    console.error('❌ [Enhanced Translation API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk translation endpoint for multiple texts
app.post('/api/translate/bulk', async (req, res) => {
  try {
    console.log(
      '📦 [Bulk Translation API] Processing bulk translation request, nyaa~!'
    );

    const { texts, targetLang, sourceLang, context } = req.body;

    if (!texts || !Array.isArray(texts) || !targetLang) {
      return res.status(400).json({
        success: false,
        error: 'Texts array and target language are required!',
      });
    }

    if (texts.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 100 texts per bulk request!',
      });
    }

    const startTime = Date.now();
    const results = await enhancedTranslationService.translateBulk(
      texts,
      targetLang,
      sourceLang || 'auto',
      context
    );
    const processingTime = Date.now() - startTime;

    console.log(
      `✅ [Bulk Translation] Translated ${texts.length} items in ${processingTime}ms`
    );

    res.json({
      success: true,
      data: {
        results,
        totalTexts: texts.length,
        averageQuality:
          results.reduce((sum, r) => sum + r.quality.overallScore, 0) /
          results.length,
        processingTime: `${processingTime}ms`,
      },
    });
  } catch (error) {
    console.error('❌ [Bulk Translation API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Translation quality analysis endpoint
app.post('/api/translate/analyze-quality', async (req, res) => {
  try {
    console.log(
      '🔍 [Quality Analysis API] Analyzing translation quality, desu~!'
    );

    const { originalText, translatedText, targetLang, sourceLang } = req.body;

    if (!originalText || !translatedText || !targetLang) {
      return res.status(400).json({
        success: false,
        error:
          'Original text, translated text, and target language are required!',
      });
    }

    const qualityMetrics = await enhancedTranslationService.analyzeQuality(
      originalText,
      translatedText,
      sourceLang || 'auto',
      targetLang
    );

    console.log(
      '✅ [Quality Analysis] Analysis completed with overall score:',
      qualityMetrics.overallScore
    );

    res.json({
      success: true,
      data: qualityMetrics,
    });
  } catch (error) {
    console.error('❌ [Quality Analysis API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Translation cache statistics
app.get('/api/translate/cache/stats', async (req, res) => {
  try {
    console.log('📊 [Translation Cache API] Fetching cache statistics, nyaa~!');

    const stats = await enhancedTranslationService.getCacheStats();

    console.log('✅ [Translation Cache] Statistics retrieved');
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('❌ [Translation Cache API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Clear translation cache
app.delete('/api/translate/cache/clear', async (req, res) => {
  try {
    console.log(
      '🧹 [Translation Cache API] Clearing translation cache, desu~!'
    );

    const { language, olderThan } = req.query;
    const deletedCount = await enhancedTranslationService.clearCache(
      language,
      olderThan
    );

    console.log(`✅ [Translation Cache] Cleared ${deletedCount} cache entries`);
    res.json({
      success: true,
      message: `Cleared ${deletedCount} translation cache entries, nyaa~!`,
      deletedCount,
    });
  } catch (error) {
    console.error('❌ [Translation Cache API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Translation provider status and configuration
app.get('/api/translate/providers/status', async (req, res) => {
  try {
    console.log(
      '⚙️ [Translation Providers API] Fetching provider status, nyaa~!'
    );

    const providerStatus = await enhancedTranslationService.getProviderStatus();

    console.log(
      '✅ [Translation Providers] Status retrieved for all providers'
    );
    res.json({
      success: true,
      data: providerStatus,
    });
  } catch (error) {
    console.error('❌ [Translation Providers API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Translation metrics and usage statistics
app.get('/api/translate/metrics', async (req, res) => {
  try {
    console.log('📈 [Translation Metrics API] Fetching usage metrics, desu~!');

    const { startDate, endDate } = req.query;
    const metrics = await enhancedTranslationService.getUsageMetrics(
      startDate,
      endDate
    );

    console.log('✅ [Translation Metrics] Usage metrics retrieved');
    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('❌ [Translation Metrics API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Supported languages with enhanced metadata
app.get('/api/translate/languages', async (req, res) => {
  try {
    console.log(
      '🌍 [Translation Languages API] Fetching supported languages, nyaa~!'
    );

    const languages = await enhancedTranslationService.getSupportedLanguages();

    console.log(
      `✅ [Translation Languages] Retrieved ${languages.length} supported languages`
    );
    res.json({
      success: true,
      count: languages.length,
      data: languages,
    });
  } catch (error) {
    console.error('❌ [Translation Languages API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Language detection
app.post('/api/translate/detect-language', async (req, res) => {
  try {
    console.log('🔍 [Language Detection API] Detecting language, desu~!');

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for language detection!',
      });
    }

    const detection = await enhancedTranslationService.detectLanguage(text);

    console.log(
      `✅ [Language Detection] Detected language: ${detection.language} (confidence: ${detection.confidence})`
    );
    res.json({
      success: true,
      data: detection,
    });
  } catch (error) {
    console.error('❌ [Language Detection API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Context-aware translation for specific domains
app.post('/api/translate/domain-specific', async (req, res) => {
  try {
    console.log(
      '🎯 [Domain Translation API] Processing domain-specific translation, nyaa~!'
    );

    const { text, targetLang, domain, sourceLang } = req.body;

    if (!text || !targetLang || !domain) {
      return res.status(400).json({
        success: false,
        error: 'Text, target language, and domain are required!',
      });
    }

    const result = await enhancedTranslationService.translateWithDomain(
      text,
      targetLang,
      domain,
      sourceLang || 'auto'
    );

    console.log(
      `✅ [Domain Translation] Domain-specific translation completed for domain: ${domain}`
    );
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('❌ [Domain Translation API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Translation A/B testing endpoint
app.post('/api/translate/ab-test', async (req, res) => {
  try {
    console.log('🧪 [A/B Testing API] Running translation A/B test, desu~!');

    const { text, targetLang, sourceLang, providers } = req.body;

    if (!text || !targetLang || !providers || !Array.isArray(providers)) {
      return res.status(400).json({
        success: false,
        error: 'Text, target language, and providers array are required!',
      });
    }

    const results = await enhancedTranslationService.compareProviders(
      text,
      targetLang,
      providers,
      sourceLang || 'auto'
    );

    console.log(`✅ [A/B Testing] Compared ${providers.length} providers`);
    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('❌ [A/B Testing API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// 👤🌍 USER LANGUAGE PREFERENCES API - Persistent Language Settings, nyaa~! 🌍👤
// ============================================================================

// Get user language preference
app.get('/api/user/language-preference/:userId', async (req, res) => {
  try {
    console.log(
      '👤 [User Preferences API] Fetching language preference for user:',
      req.params.userId
    );

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required!',
      });
    }

    const userPreference = await db
      .collection('user_language_preferences')
      .findOne({ userId: userId });

    if (!userPreference) {
      // Return default preference if none exists
      console.log(
        '👤 [User Preferences] No preference found, returning default (en)'
      );
      return res.json({
        success: true,
        data: {
          userId: userId,
          language: 'en',
          isDefault: true,
          lastUpdated: new Date(),
        },
      });
    }

    console.log(
      `✅ [User Preferences] Found preference: ${userPreference.language} for user ${userId}`
    );
    res.json({
      success: true,
      data: {
        userId: userPreference.userId,
        language: userPreference.language,
        isDefault: false,
        lastUpdated: userPreference.lastUpdated,
        createdAt: userPreference.createdAt,
      },
    });
  } catch (error) {
    console.error(
      '❌ [User Preferences API] Error fetching preference:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Set/Update user language preference
app.post('/api/user/language-preference', async (req, res) => {
  try {
    console.log(
      '👤 [User Preferences API] Setting language preference, nyaa~!'
    );

    const { userId, language, userAgent, ipAddress } = req.body;

    if (!userId || !language) {
      return res.status(400).json({
        success: false,
        error: 'User ID and language are required!',
      });
    }

    // Validate language code
    const supportedLanguages = [
      'en',
      'es',
      'fr',
      'de',
      'it',
      'pt',
      'ru',
      'ja',
      'ko',
      'zh',
      'ar',
      'hi',
      'nl',
      'tr',
      'pl',
    ];
    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}. Supported: ${supportedLanguages.join(', ')}`,
      });
    }

    const now = new Date();
    const preferenceData = {
      userId: userId,
      language: language,
      lastUpdated: now,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
    };

    // Upsert (update if exists, insert if doesn't)
    const result = await db.collection('user_language_preferences').updateOne(
      { userId: userId },
      {
        $set: preferenceData,
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    console.log(
      `✅ [User Preferences] Language preference set to ${language} for user ${userId}`
    );
    res.json({
      success: true,
      message: `Language preference updated to ${language}, nyaa~!`,
      data: {
        userId: userId,
        language: language,
        isNew: result.upsertedCount > 0,
        lastUpdated: now,
      },
    });
  } catch (error) {
    console.error(
      '❌ [User Preferences API] Error setting preference:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get language preference statistics
app.get('/api/user/language-stats', async (req, res) => {
  try {
    console.log(
      '📊 [User Preferences API] Fetching language usage statistics, desu~!'
    );

    const pipeline = [
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
          lastUsed: { $max: '$lastUpdated' },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    const languageStats = await db
      .collection('user_language_preferences')
      .aggregate(pipeline)
      .toArray();

    const totalUsers = await db
      .collection('user_language_preferences')
      .countDocuments();

    const statsWithPercentages = languageStats.map((stat) => ({
      language: stat._id,
      count: stat.count,
      percentage: Math.round((stat.count / totalUsers) * 100),
      lastUsed: stat.lastUsed,
    }));

    console.log(
      `✅ [User Preferences] Statistics calculated for ${totalUsers} users`
    );
    res.json({
      success: true,
      data: {
        totalUsers: totalUsers,
        languageBreakdown: statsWithPercentages,
        generatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error(
      '❌ [User Preferences API] Error fetching stats:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bulk get language preferences for multiple users
app.post('/api/user/language-preferences/bulk', async (req, res) => {
  try {
    console.log(
      '👥 [User Preferences API] Fetching bulk language preferences, nyaa~!'
    );

    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        error: 'UserIds array is required!',
      });
    }

    if (userIds.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 100 user IDs per bulk request!',
      });
    }

    const preferences = await db
      .collection('user_language_preferences')
      .find({ userId: { $in: userIds } })
      .toArray();

    // Create a map for fast lookup
    const preferenceMap = {};
    preferences.forEach((pref) => {
      preferenceMap[pref.userId] = {
        language: pref.language,
        lastUpdated: pref.lastUpdated,
        createdAt: pref.createdAt,
      };
    });

    // Fill in defaults for users without preferences
    const results = userIds.map((userId) => ({
      userId: userId,
      language: preferenceMap[userId]?.language || 'en',
      isDefault: !preferenceMap[userId],
      lastUpdated: preferenceMap[userId]?.lastUpdated || null,
      createdAt: preferenceMap[userId]?.createdAt || null,
    }));

    console.log(
      `✅ [User Preferences] Bulk fetch completed for ${userIds.length} users`
    );
    res.json({
      success: true,
      data: results,
      totalRequested: userIds.length,
      foundPreferences: preferences.length,
      defaultsProvided: userIds.length - preferences.length,
    });
  } catch (error) {
    console.error(
      '❌ [User Preferences API] Error in bulk fetch:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete user language preference (GDPR compliance)
app.delete('/api/user/language-preference/:userId', async (req, res) => {
  try {
    console.log(
      '🗑️ [User Preferences API] Deleting language preference for user:',
      req.params.userId
    );

    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required!',
      });
    }

    const result = await db
      .collection('user_language_preferences')
      .deleteOne({ userId: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'No language preference found for this user',
      });
    }

    console.log(
      `✅ [User Preferences] Language preference deleted for user ${userId}`
    );
    res.json({
      success: true,
      message: 'Language preference deleted successfully, nyaa~!',
      deletedUserId: userId,
    });
  } catch (error) {
    console.error(
      '❌ [User Preferences API] Error deleting preference:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

console.log(
  '🌍✨ Enhanced Translation API v2.0 endpoints loaded successfully, nyaa~!'
);
console.log(
  '👤💾 User Language Preferences API loaded with persistent storage, desu~!'
);

// Get all ASCII art
app.get('/api/ascii-art', async (req, res) => {
  try {
    const art = await db
      .collection('neko_ascii_art_gallery')
      .find({})
      .toArray();
    res.json({ success: true, count: art.length, data: art });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get ASCII art by category
app.get('/api/ascii-art/:category', async (req, res) => {
  try {
    const art = await db
      .collection('neko_ascii_art_gallery')
      .find({ category: req.params.category })
      .toArray();
    res.json({ success: true, count: art.length, data: art });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get defense system stats
app.get('/api/stats', async (req, res) => {
  try {
    const collections = await db.listCollections().toArray();
    const stats = {
      total_collections: collections.length,
      collections: collections.map((c) => c.name),
      timestamp: new Date(),
      status: 'FORTRESS MODE ACTIVE',
      kawaii_level: 'MAXIMUM',
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get honeypot data
app.get('/api/honeypot/traps', async (req, res) => {
  try {
    const traps = await db
      .collection('suspicious_content_trap')
      .find({})
      .limit(100)
      .toArray();
    res.json({ success: true, count: traps.length, data: traps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get predator detection data
app.get('/api/predators', async (req, res) => {
  try {
    const predators = await db
      .collection('predator_detection_zone')
      .find({})
      .limit(100)
      .toArray();
    res.json({ success: true, count: predators.length, data: predators });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get conversation archive
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await db
      .collection('conversation_archive')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    res.json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get threat actors summary
app.get('/api/threats/summary', async (req, res) => {
  try {
    const summary = {
      total_collections: 9,
      honeypot_traps: [
        'suspicious_content_trap',
        'illegal_materials_monitor',
        'restricted_access_bait',
        'admin_secrets_decoy',
        'predator_detection_zone',
      ],
      threat_actors_tracked: [
        'APT28/Frost Spider',
        'Ransomware Gangs',
        'Black Hat Hackers',
        'Phishing Scammers',
        'Crypto Thieves',
      ],
      status: 'MAXIMUM PROTECTION ACTIVE',
      last_updated: new Date(),
    };
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get threat counts by category, nyaa~! 🐾📊
app.get('/api/threat-counts', async (req, res) => {
  try {
    console.log('📊 [API] Calculating threat counts by category, desu~');

    const allActors = await db.collection('threat_actors').find({}).toArray();

    const counts = {
      all: allActors.length,
      predators: 0,
      pedophiles: 0,
      dina_network: 0,
      ransomware: 0,
      state_sponsored: 0,
      crypto_crime: 0,
    };

    allActors.forEach((actor) => {
      // Predators
      if (
        actor.type === 'predator' ||
        actor.actor_classification === 'INDIVIDUAL_PREDATOR' ||
        actor.category === 'predator'
      ) {
        counts.predators++;
      }

      // Pedophiles
      if (
        actor.type === 'pedophile' ||
        actor.actor_classification === 'PEDOPHILE' ||
        actor.category === 'pedophile' ||
        actor.target_type === 'children' ||
        (actor.description &&
          /pedophil|child abuse|csam/i.test(actor.description))
      ) {
        counts.pedophiles++;
      }

      // DINA Network
      if (
        actor.network === 'DINA' ||
        actor.actor_classification === 'DINA_NETWORK' ||
        actor.category === 'dina_network'
      ) {
        counts.dina_network++;
      }

      // Ransomware
      if (
        actor.type === 'cybercrime_group' ||
        actor.actor_classification === 'CYBERCRIME_RANSOMWARE' ||
        actor.category === 'ransomware'
      ) {
        counts.ransomware++;
      }

      // State Sponsored
      if (
        actor.state_actor === true ||
        actor.state_sponsored === true ||
        (actor.actor_classification &&
          /STATE_SPONSORED/i.test(actor.actor_classification))
      ) {
        counts.state_sponsored++;
      }

      // Crypto Crime
      if (
        actor.category === 'crypto_crime' ||
        actor.actor_classification === 'CRYPTO_CRIME' ||
        actor.type === 'crypto_thief'
      ) {
        counts.crypto_crime++;
      }
    });

    console.log('✅ [API] Threat counts calculated:', counts);
    res.json({ success: true, data: counts });
  } catch (error) {
    console.error('❌ [API] Failed to calculate threat counts:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all threat actors from MongoDB with category filtering + TRANSLATION, nyaa~! 🐾🎯🌍
app.get('/api/threat-actors', async (req, res) => {
  try {
    const category = req.query.category || 'all';
    const userLang = getUserLanguage(req);
    console.log(
      '🎯 [API] Fetching threat actors, category:',
      category,
      '| Language:',
      userLang
    );

    // Build filter based on category
    let filter = {};

    if (category !== 'all') {
      switch (category) {
        case 'predators':
          filter = {
            $or: [
              { type: 'predator' },
              { actor_classification: 'INDIVIDUAL_PREDATOR' },
              { category: 'predator' },
            ],
          };
          break;

        case 'pedophiles':
          filter = {
            $or: [
              { type: 'pedophile' },
              { actor_classification: 'PEDOPHILE' },
              { category: 'pedophile' },
              { target_type: 'children' },
              { description: { $regex: /pedophil|child abuse|csam/i } },
            ],
          };
          break;

        case 'dina_network':
          filter = {
            $or: [
              { network: 'DINA' },
              { actor_classification: 'DINA_NETWORK' },
              { category: 'dina_network' },
            ],
          };
          break;

        case 'ransomware':
          filter = {
            $or: [
              { type: 'cybercrime_group' },
              { actor_classification: 'CYBERCRIME_RANSOMWARE' },
              { category: 'ransomware' },
            ],
          };
          break;

        case 'state_sponsored':
          filter = {
            $or: [
              { state_actor: true },
              { state_sponsored: true },
              { actor_classification: { $regex: /STATE_SPONSORED/i } },
            ],
          };
          break;

        case 'crypto_crime':
          filter = {
            $or: [
              { category: 'crypto_crime' },
              { actor_classification: 'CRYPTO_CRIME' },
              { type: 'crypto_thief' },
            ],
          };
          break;

        default:
          filter = {};
      }
    }

    let threatActors = await db
      .collection('threat_actors')
      .find(filter)
      .sort({ threat_level: -1, rank: 1 })
      .toArray();

    // 🌍 Translate data if user language is not English, nyaa~!
    if (userLang !== 'en') {
      console.log(
        `🌐 [Translation] Translating ${threatActors.length} threat actors to ${userLang}`
      );
      threatActors = await translateDocuments(
        threatActors,
        userLang,
        db,
        'threat_actors'
      );
    }

    console.log(
      `✅ [API] Retrieved ${threatActors.length} threat actors for category: ${category}`
    );
    res.json({
      success: true,
      category: category,
      count: threatActors.length,
      data: threatActors,
      language: userLang,
    });
  } catch (error) {
    console.error('❌ [API] Failed to fetch threat actors:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get threat actor by ID + TRANSLATION, nyaa~! 🔍🌍
app.get('/api/threat-actors/:actorId', async (req, res) => {
  try {
    const userLang = getUserLanguage(req);
    console.log(
      '🔍 [API] Fetching threat actor:',
      req.params.actorId,
      '| Language:',
      userLang
    );

    let threatActor = await db
      .collection('threat_actors')
      .findOne({ actor_id: req.params.actorId });

    if (!threatActor) {
      console.log('⚠️ [API] Threat actor not found:', req.params.actorId);
      return res
        .status(404)
        .json({ success: false, error: 'Threat actor not found' });
    }

    // 🌍 Translate data if user language is not English, nyaa~!
    if (userLang !== 'en') {
      console.log(`🌐 [Translation] Translating threat actor to ${userLang}`);
      const translated = await translateDocuments(
        [threatActor],
        userLang,
        db,
        'threat_actors'
      );
      threatActor = translated[0];
    }

    console.log('✅ [API] Found threat actor:', threatActor.name);
    res.json({ success: true, data: threatActor, language: userLang });
  } catch (error) {
    console.error('❌ [API] Error fetching threat actor:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🐾⚖️ DINA DOCUMENTATION API ENDPOINTS ⚖️🐾

// Get DINA statistics
app.get('/api/dina/stats', async (req, res) => {
  try {
    console.log('📊 [DINA API] Fetching DINA statistics, nyaa~');

    // Get perpetrators collection
    const perpetratorsCollection = db.collection('dina_perpetrators');
    const perpetrators = await perpetratorsCollection
      .find({ id: { $exists: true } })
      .toArray();
    const metadata = await perpetratorsCollection.findOne({
      _type: 'metadata',
    });

    // Get torture centers collection
    const centersCollection = db.collection('dina_torture_centers');
    const centers = await centersCollection
      .find({ id: { $exists: true } })
      .toArray();

    // Get international crimes collection
    const crimesCollection = db.collection('dina_international_crimes');
    const crimes = await crimesCollection
      .find({ id: { $exists: true } })
      .toArray();

    // Calculate stats
    const convicted = perpetrators.filter(
      (p) =>
        p.prosecution_status &&
        (p.prosecution_status.includes('convicted') ||
          p.legalStatus?.convicted === true)
    ).length;

    const unprosecuted = perpetrators.filter(
      (p) =>
        !p.prosecution_status ||
        p.prosecution_status.includes('unprosecuted') ||
        p.legalStatus?.convicted === false
    ).length;

    const stats = {
      total_documents: perpetrators.length + centers.length + crimes.length,
      perpetrators: {
        total: perpetrators.length,
        convicted: convicted,
        unprosecuted: unprosecuted,
        total_known_agents: metadata?.total_known_agents || 1097,
      },
      torture_centers: centers.length,
      international_crimes: crimes.length,
      victims_estimated: 30000,
      disappeared: 957,
      executed: 2279,
      last_updated: new Date(),
    };

    console.log(
      `✅ [DINA API] Stats compiled: ${perpetrators.length} perpetrators documented`
    );
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('❌ [DINA API] Failed to fetch stats:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get DINA perpetrators list + TRANSLATION, nyaa~! 🎯🌍
app.get('/api/dina/perpetrators', async (req, res) => {
  try {
    const userLang = getUserLanguage(req);
    console.log(
      '🎯 [DINA API] Fetching DINA perpetrators, nyaa~ | Language:',
      userLang
    );

    const perpetrators = await db
      .collection('dina_perpetrators')
      .find({ id: { $exists: true } })
      .toArray();

    // Transform data for frontend compatibility
    let transformedPerpetrators = perpetrators.map((p) => ({
      ...p,
      fullName: p.fullName || p.name,
      role: p.position || p.role || 'DINA Agent',
      organization: p.organization || ['DINA'],
      legalStatus: {
        convicted:
          p.prosecution_status?.includes('convicted') ||
          p.legal_status === 'convicted' ||
          p.convictions !== undefined,
        status: p.prosecution_status || p.legal_status,
      },
      crimesAccused: p.major_crimes || p.crimesAccused || [],
    }));

    // 🌍 Translate data if user language is not English, nyaa~!
    if (userLang !== 'en') {
      console.log(
        `🌐 [Translation] Translating ${transformedPerpetrators.length} DINA perpetrators to ${userLang}`
      );
      transformedPerpetrators = await translateDocuments(
        transformedPerpetrators,
        userLang,
        db,
        'dina_perpetrators'
      );
    }

    console.log(
      `✅ [DINA API] Retrieved ${transformedPerpetrators.length} DINA perpetrators`
    );
    res.json({
      success: true,
      count: transformedPerpetrators.length,
      data: transformedPerpetrators,
      language: userLang,
    });
  } catch (error) {
    console.error('❌ [DINA API] Failed to fetch perpetrators:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get DINA torture centers
app.get('/api/dina/torture-centers', async (req, res) => {
  try {
    console.log('🏢 [DINA API] Fetching DINA torture centers');

    const centers = await db
      .collection('dina_torture_centers')
      .find({ id: { $exists: true } })
      .toArray();

    console.log(`✅ [DINA API] Retrieved ${centers.length} torture centers`);
    res.json({ success: true, count: centers.length, data: centers });
  } catch (error) {
    console.error(
      '❌ [DINA API] Failed to fetch torture centers:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get DINA international crimes
app.get('/api/dina/international-crimes', async (req, res) => {
  try {
    console.log('🌍 [DINA API] Fetching DINA international crimes');

    const crimes = await db
      .collection('dina_international_crimes')
      .find({ id: { $exists: true } })
      .toArray();

    console.log(
      `✅ [DINA API] Retrieved ${crimes.length} international crimes`
    );
    res.json({ success: true, count: crimes.length, data: crimes });
  } catch (error) {
    console.error(
      '❌ [DINA API] Failed to fetch international crimes:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🎬✨ VIDEO MAKER API ENDPOINT ✨🎬
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configure multer for file uploads
const upload = multer({
  dest: '/tmp/neko-video-uploads/',
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
});

// Video maker endpoint
app.post(
  '/api/video-maker',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]),
  async (req, res) => {
    const startTime = Date.now();
    console.log('🎬 [VideoMaker API] Processing video request, nyaa~!');

    try {
      if (!req.files || !req.files.video || !req.files.image) {
        return res.status(400).json({
          success: false,
          error: 'Both video and image files are required!',
        });
      }

      const videoFile = req.files.video[0];
      const imageFile = req.files.image[0];
      const position = req.body.position || 'bottom-right';
      const outputName = req.body.outputName || 'video-output';

      // Map position to overlay coordinates
      const positionMap = {
        'top-left': '10:10',
        'top-right': 'main_w-overlay_w-10:10',
        'bottom-left': '10:main_h-overlay_h-10',
        'bottom-right': 'main_w-overlay_w-10:main_h-overlay_h-10',
        center: '(main_w-overlay_w)/2:(main_h-overlay_h)/2',
        full: '0:0',
      };

      const overlayPosition =
        positionMap[position] || positionMap['bottom-right'];

      // Ensure output name has .mp4 extension
      const outputFileName = outputName.endsWith('.mp4')
        ? outputName
        : `${outputName}.mp4`;
      const outputPath = `/tmp/neko-video-uploads/${outputFileName}`;

      // Build ffmpeg command
      const ffmpegCommand = `ffmpeg -i "${videoFile.path}" -i "${imageFile.path}" -filter_complex "[0:v][1:v] overlay=${overlayPosition}" -c:a copy "${outputPath}" -y`;

      console.log('⏳ [VideoMaker API] Running ffmpeg...');

      exec(ffmpegCommand, (error, stdout, stderr) => {
        // Clean up input files
        fs.unlinkSync(videoFile.path);
        fs.unlinkSync(imageFile.path);

        if (error) {
          console.error('❌ [VideoMaker API] ffmpeg error:', error.message);
          return res.status(500).json({
            success: false,
            error: `Video processing failed: ${error.message}`,
          });
        }

        // Check if output file was created
        if (!fs.existsSync(outputPath)) {
          console.error('❌ [VideoMaker API] Output file not created');
          return res.status(500).json({
            success: false,
            error: 'Video processing failed - output file not created',
          });
        }

        // Get file size
        const stats = fs.statSync(outputPath);
        const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
        const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log(
          `✅ [VideoMaker API] Video created successfully! Size: ${fileSizeMB}MB, Time: ${processingTime}s`
        );

        // Return success with file info
        res.json({
          success: true,
          message: 'Video created with MAXIMUM NEKO POWER! 🎬✨',
          outputFile: outputFileName,
          fileSize: `${fileSizeMB}MB`,
          processingTime: `${processingTime}s`,
          downloadPath: `/api/video-maker/download/${outputFileName}`,
        });

        // Clean up output file after 5 minutes
        setTimeout(
          () => {
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
              console.log(
                '🧹 [VideoMaker API] Cleaned up output file:',
                outputFileName
              );
            }
          },
          5 * 60 * 1000
        );
      });
    } catch (error) {
      console.error('❌ [VideoMaker API] Error:', error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  }
);

// Download processed video endpoint
app.get('/api/video-maker/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `/tmp/neko-video-uploads/${filename}`;

  if (!fs.existsSync(filePath)) {
    return res
      .status(404)
      .json({ success: false, error: 'File not found or expired' });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('❌ [VideoMaker API] Download error:', err.message);
    }
  });
});

// 📝⚖️ CONFESSIONS BLOG API ENDPOINTS - COMMUNITY REPORTING SYSTEM ⚖️📝

// Submit a new confession/report
app.post('/api/confessions/submit', async (req, res) => {
  try {
    console.log(
      '📝 [Confessions API] New confession submission received, nyaa~!'
    );

    const {
      category,
      title,
      description,
      evidence_links,
      threat_actor_name,
      threat_actor_location,
      submitted_by,
      contact_info,
      priority,
    } = req.body;

    // Validation
    if (!category || !title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Category, title, and description are required!',
      });
    }

    // Generate unique confession ID
    const confession_id = `confession_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create confession document
    const confession = {
      confession_id,
      category, // predators, pedophiles, evidence, general
      title,
      description,
      evidence_links: evidence_links || [],
      threat_actor_name: threat_actor_name || 'Anonymous Report',
      threat_actor_location: threat_actor_location || 'Unknown',
      submitted_by: submitted_by || 'Anonymous',
      contact_info: contact_info || 'Not provided',
      priority: priority || 'medium', // low, medium, high, critical
      status: 'pending', // pending, approved, rejected
      submitted_at: new Date(),
      moderated_at: null,
      moderation_notes: '',
      views: 0,
      upvotes: 0,
    };

    // Insert into MongoDB
    await db.collection('confessions').insertOne(confession);

    console.log(`✅ [Confessions API] Confession submitted: ${confession_id}`);
    res.json({
      success: true,
      message:
        'Confession submitted for moderation! Thank you for reporting, nyaa~! 🐾',
      confession_id,
      status: 'pending',
    });
  } catch (error) {
    console.error('❌ [Confessions API] Submission failed:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all approved confessions (public access)
app.get('/api/confessions', async (req, res) => {
  try {
    const category = req.query.category;
    const limit = parseInt(req.query.limit) || 50;
    console.log('📖 [Confessions API] Fetching approved confessions, desu~');

    const filter = { status: 'approved' };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const confessions = await db
      .collection('confessions')
      .find(filter)
      .sort({ submitted_at: -1 })
      .limit(limit)
      .toArray();

    console.log(
      `✅ [Confessions API] Retrieved ${confessions.length} approved confessions`
    );
    res.json({
      success: true,
      count: confessions.length,
      data: confessions,
    });
  } catch (error) {
    console.error(
      '❌ [Confessions API] Failed to fetch confessions:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get confession by ID
app.get('/api/confessions/:id', async (req, res) => {
  try {
    console.log('🔍 [Confessions API] Fetching confession:', req.params.id);

    const confession = await db
      .collection('confessions')
      .findOne({ confession_id: req.params.id });

    if (!confession) {
      return res.status(404).json({
        success: false,
        error: 'Confession not found',
      });
    }

    // Increment view count
    await db
      .collection('confessions')
      .updateOne({ confession_id: req.params.id }, { $inc: { views: 1 } });

    console.log('✅ [Confessions API] Confession found:', confession.title);
    res.json({ success: true, data: confession });
  } catch (error) {
    console.error(
      '❌ [Confessions API] Error fetching confession:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get pending confessions (moderation queue - ADMIN ONLY)
app.get('/api/confessions/pending', async (req, res) => {
  try {
    console.log(
      '⚖️ [Confessions API] Fetching pending confessions for moderation'
    );

    const pending = await db
      .collection('confessions')
      .find({ status: 'pending' })
      .sort({ submitted_at: 1 }) // Oldest first
      .toArray();

    console.log(
      `✅ [Confessions API] Found ${pending.length} pending confessions`
    );
    res.json({
      success: true,
      count: pending.length,
      data: pending,
    });
  } catch (error) {
    console.error(
      '❌ [Confessions API] Failed to fetch pending confessions:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Moderate confession (approve/reject - ADMIN ONLY)
app.put('/api/confessions/:id/moderate', async (req, res) => {
  try {
    const { action, notes } = req.body; // action: 'approve' or 'reject'
    console.log(
      `⚖️ [Confessions API] Moderating confession: ${req.params.id} - ${action}`
    );

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be "approve" or "reject"',
      });
    }

    const update = {
      status: action === 'approve' ? 'approved' : 'rejected',
      moderated_at: new Date(),
      moderation_notes: notes || '',
    };

    const result = await db
      .collection('confessions')
      .updateOne({ confession_id: req.params.id }, { $set: update });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Confession not found',
      });
    }

    console.log(
      `✅ [Confessions API] Confession ${action}ed: ${req.params.id}`
    );
    res.json({
      success: true,
      message: `Confession ${action}ed successfully, nyaa~!`,
      status: update.status,
    });
  } catch (error) {
    console.error('❌ [Confessions API] Moderation failed:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get confession statistics
app.get('/api/confessions/stats', async (req, res) => {
  try {
    console.log('📊 [Confessions API] Calculating confession statistics');

    const total = await db.collection('confessions').countDocuments();
    const approved = await db
      .collection('confessions')
      .countDocuments({ status: 'approved' });
    const pending = await db
      .collection('confessions')
      .countDocuments({ status: 'pending' });
    const rejected = await db
      .collection('confessions')
      .countDocuments({ status: 'rejected' });

    // Count by category
    const categories = await db
      .collection('confessions')
      .aggregate([
        { $match: { status: 'approved' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ])
      .toArray();

    const stats = {
      total,
      approved,
      pending,
      rejected,
      by_category: categories.reduce((acc, cat) => {
        acc[cat._id] = cat.count;
        return acc;
      }, {}),
      last_updated: new Date(),
    };

    console.log('✅ [Confessions API] Statistics calculated');
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error(
      '❌ [Confessions API] Failed to calculate stats:',
      error.message
    );
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
connectDB().then(async () => {
  // ============================================================================
  // 🎨✨ USER-GENERATED CONTENT (UGC) PLATFORM ROUTES - Phases 1 & 2, nyaa~! ✨🎨
  // ============================================================================

  // Import UGC route modules
  const authRoutes = require('./routes/auth');
  const contentRoutes = require('./routes/content');
  const commentsRoutes = require('./routes/comments');
  const discoveryRoutes = require('./routes/discovery');
  const ideasRoutes = require('./routes/ideas');
  const gamificationRoutes = require('./routes/gamification'); // Phase 3: Gamification
  const challengesRoutes = require('./routes/challenges'); // Phase 3: Challenges

  // Make database available to routes via app.locals
  app.locals.db = db;

  // Mount UGC routes
  app.use('/api/auth', authRoutes);
  app.use('/api/content', contentRoutes);
  app.use('/api/comments', commentsRoutes);
  app.use('/api', discoveryRoutes); // Phase 2: Discovery & search routes
  app.use('/api/ideas', ideasRoutes); // Phase 2: Community ideas board
  app.use('/api/gamification', gamificationRoutes); // Phase 3: Gamification & achievements
  app.use('/api/challenges', challengesRoutes); // Phase 3: Challenges & contests

  console.log('🎨✨ UGC Platform routes mounted successfully, nyaa~!');
  console.log('  - /api/auth/* (Registration, Login, JWT)');
  console.log('  - /api/content/* (User Content CRUD)');
  console.log('  - /api/comments/* (Comments & Reactions)');
  console.log('  - /api/search, /api/content/trending, /api/content/recommended (Discovery)');
  console.log('  - /api/ideas/* (Community Ideas Board with Voting)');
  console.log('  - /api/gamification/* (Achievements, Daily Quests, Leaderboard) 🏆');
  console.log('  - /api/challenges/* (Challenges & Contests with Judging) 🏅');

  // Initialize search indexes for Phase 2 discovery features
  const { initializeSearchIndexes } = require('./routes/discovery');
  await initializeSearchIndexes(db);

  // ============================================================================
  // ⚡🔌 SOCKET.IO REAL-TIME FEATURES - Phase 2 Sprint 2.3, nyaa~! 🔌⚡
  // ============================================================================

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('⚡ User connected via Socket.io:', socket.id);

    // Join content-specific room for real-time comments
    socket.on('join-content', (contentId) => {
      socket.join(`content:${contentId}`);
      console.log(`📝 User ${socket.id} joined content room: ${contentId}`);
    });

    // Leave content room
    socket.on('leave-content', (contentId) => {
      socket.leave(`content:${contentId}`);
      console.log(`👋 User ${socket.id} left content room: ${contentId}`);
    });

    // Join user notification room
    socket.on('join-notifications', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`🔔 User ${socket.id} joined notification room: ${userId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('👋 User disconnected:', socket.id);
    });
  });

  // Make Socket.io available to routes
  app.locals.io = io;

  console.log('⚡🔌 Socket.io real-time features initialized, nyaa~!');

  // ============================================================================

  server.listen(PORT, () => {
    console.log(`🐾⚡ NEKO DEFENSE API running on port ${PORT}, nyaa~!`);
    console.log(`📡 API endpoint: http://localhost:${PORT}`);
    console.log(`⚡ Socket.io: REAL-TIME MODE ACTIVE!`);
    console.log(`💖 Status: LEGENDARY MODE ACTIVATED!`);
    console.log(`🎨 UGC Platform Phase 1 & 2: DISCOVERY MODE ENABLED!`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🐾 Closing MongoDB connection, nyaa~!');
  await client.close();
  process.exit(0);
});
