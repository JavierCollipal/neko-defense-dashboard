// 🐾⚡ NEKO DEFENSE DASHBOARD API SERVER ⚡🐾
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.API_PORT || 5001;

// 🔒 MongoDB Configuration (from environment variables only!)
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DATABASE || "neko-defense-system";

// Security validation: Ensure credentials are set
if (!MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI environment variable not set!');
  console.error('💡 Set it in .env file, nyaa~!');
  process.exit(1);
}

let db;
let client;

// 🛡️ SECURITY MIDDLEWARE 🛡️

// Helmet: Security headers protection
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for React
  crossOriginEmbedderPolicy: false
}));

// CORS: Only allow specific origins
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5001').split(',');
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`🚫 [SECURITY] Blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting: Prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later, nyaa~! 🐾'
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
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'LEGENDARY', message: 'Neko Defense API is purring perfectly! 🐾✨' });
});

// Get all ASCII art
app.get('/api/ascii-art', async (req, res) => {
  try {
    const art = await db.collection('neko_ascii_art_gallery').find({}).toArray();
    res.json({ success: true, count: art.length, data: art });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get ASCII art by category
app.get('/api/ascii-art/:category', async (req, res) => {
  try {
    const art = await db.collection('neko_ascii_art_gallery')
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
      collections: collections.map(c => c.name),
      timestamp: new Date(),
      status: 'FORTRESS MODE ACTIVE',
      kawaii_level: 'MAXIMUM'
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get honeypot data
app.get('/api/honeypot/traps', async (req, res) => {
  try {
    const traps = await db.collection('suspicious_content_trap').find({}).limit(100).toArray();
    res.json({ success: true, count: traps.length, data: traps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get predator detection data
app.get('/api/predators', async (req, res) => {
  try {
    const predators = await db.collection('predator_detection_zone').find({}).limit(100).toArray();
    res.json({ success: true, count: predators.length, data: predators });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get conversation archive
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await db.collection('conversation_archive')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    res.json({ success: true, count: conversations.length, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get threat actors summary
app.get('/api/threats/summary', async (req, res) => {
  try {
    const summary = {
      total_collections: 9,
      honeypot_traps: ['suspicious_content_trap', 'illegal_materials_monitor', 'restricted_access_bait', 'admin_secrets_decoy', 'predator_detection_zone'],
      threat_actors_tracked: ['APT28/Frost Spider', 'Ransomware Gangs', 'Black Hat Hackers', 'Phishing Scammers', 'Crypto Thieves'],
      status: 'MAXIMUM PROTECTION ACTIVE',
      last_updated: new Date()
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
      crypto_crime: 0
    };

    allActors.forEach(actor => {
      // Predators
      if (actor.type === 'predator' ||
          actor.actor_classification === 'INDIVIDUAL_PREDATOR' ||
          actor.category === 'predator') {
        counts.predators++;
      }

      // Pedophiles
      if (actor.type === 'pedophile' ||
          actor.actor_classification === 'PEDOPHILE' ||
          actor.category === 'pedophile' ||
          actor.target_type === 'children' ||
          (actor.description && /pedophil|child abuse|csam/i.test(actor.description))) {
        counts.pedophiles++;
      }

      // DINA Network
      if (actor.network === 'DINA' ||
          actor.actor_classification === 'DINA_NETWORK' ||
          actor.category === 'dina_network') {
        counts.dina_network++;
      }

      // Ransomware
      if (actor.type === 'cybercrime_group' ||
          actor.actor_classification === 'CYBERCRIME_RANSOMWARE' ||
          actor.category === 'ransomware') {
        counts.ransomware++;
      }

      // State Sponsored
      if (actor.state_actor === true ||
          actor.state_sponsored === true ||
          (actor.actor_classification && /STATE_SPONSORED/i.test(actor.actor_classification))) {
        counts.state_sponsored++;
      }

      // Crypto Crime
      if (actor.category === 'crypto_crime' ||
          actor.actor_classification === 'CRYPTO_CRIME' ||
          actor.type === 'crypto_thief') {
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

// Get all threat actors from MongoDB with category filtering, nyaa~! 🐾🎯
app.get('/api/threat-actors', async (req, res) => {
  try {
    const category = req.query.category || 'all';
    console.log('🎯 [API] Fetching threat actors, category:', category);

    // Build filter based on category
    let filter = {};

    if (category !== 'all') {
      switch (category) {
        case 'predators':
          filter = {
            $or: [
              { type: 'predator' },
              { actor_classification: 'INDIVIDUAL_PREDATOR' },
              { category: 'predator' }
            ]
          };
          break;

        case 'pedophiles':
          filter = {
            $or: [
              { type: 'pedophile' },
              { actor_classification: 'PEDOPHILE' },
              { category: 'pedophile' },
              { target_type: 'children' },
              { description: { $regex: /pedophil|child abuse|csam/i } }
            ]
          };
          break;

        case 'dina_network':
          filter = {
            $or: [
              { network: 'DINA' },
              { actor_classification: 'DINA_NETWORK' },
              { category: 'dina_network' }
            ]
          };
          break;

        case 'ransomware':
          filter = {
            $or: [
              { type: 'cybercrime_group' },
              { actor_classification: 'CYBERCRIME_RANSOMWARE' },
              { category: 'ransomware' }
            ]
          };
          break;

        case 'state_sponsored':
          filter = {
            $or: [
              { state_actor: true },
              { state_sponsored: true },
              { actor_classification: { $regex: /STATE_SPONSORED/i } }
            ]
          };
          break;

        case 'crypto_crime':
          filter = {
            $or: [
              { category: 'crypto_crime' },
              { actor_classification: 'CRYPTO_CRIME' },
              { type: 'crypto_thief' }
            ]
          };
          break;

        default:
          filter = {};
      }
    }

    const threatActors = await db.collection('threat_actors')
      .find(filter)
      .sort({ threat_level: -1, rank: 1 })
      .toArray();

    console.log(`✅ [API] Retrieved ${threatActors.length} threat actors for category: ${category}`);
    res.json({
      success: true,
      category: category,
      count: threatActors.length,
      data: threatActors
    });
  } catch (error) {
    console.error('❌ [API] Failed to fetch threat actors:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get threat actor by ID
app.get('/api/threat-actors/:actorId', async (req, res) => {
  try {
    console.log('🔍 [API] Fetching threat actor:', req.params.actorId);
    const threatActor = await db.collection('threat_actors')
      .findOne({ actor_id: req.params.actorId });

    if (!threatActor) {
      console.log('⚠️ [API] Threat actor not found:', req.params.actorId);
      return res.status(404).json({ success: false, error: 'Threat actor not found' });
    }

    console.log('✅ [API] Found threat actor:', threatActor.name);
    res.json({ success: true, data: threatActor });
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
    const perpetrators = await perpetratorsCollection.find({ id: { $exists: true } }).toArray();
    const metadata = await perpetratorsCollection.findOne({ _type: 'metadata' });

    // Get torture centers collection
    const centersCollection = db.collection('dina_torture_centers');
    const centers = await centersCollection.find({ id: { $exists: true } }).toArray();

    // Get international crimes collection
    const crimesCollection = db.collection('dina_international_crimes');
    const crimes = await crimesCollection.find({ id: { $exists: true } }).toArray();

    // Calculate stats
    const convicted = perpetrators.filter(p =>
      p.prosecution_status && (
        p.prosecution_status.includes('convicted') ||
        p.legalStatus?.convicted === true
      )
    ).length;

    const unprosecuted = perpetrators.filter(p =>
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
        total_known_agents: metadata?.total_known_agents || 1097
      },
      torture_centers: centers.length,
      international_crimes: crimes.length,
      victims_estimated: 30000,
      disappeared: 957,
      executed: 2279,
      last_updated: new Date()
    };

    console.log(`✅ [DINA API] Stats compiled: ${perpetrators.length} perpetrators documented`);
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('❌ [DINA API] Failed to fetch stats:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get DINA perpetrators list
app.get('/api/dina/perpetrators', async (req, res) => {
  try {
    console.log('🎯 [DINA API] Fetching DINA perpetrators, nyaa~');

    const perpetrators = await db.collection('dina_perpetrators')
      .find({ id: { $exists: true } })
      .toArray();

    // Transform data for frontend compatibility
    const transformedPerpetrators = perpetrators.map(p => ({
      ...p,
      fullName: p.fullName || p.name,
      role: p.position || p.role || 'DINA Agent',
      organization: p.organization || ['DINA'],
      legalStatus: {
        convicted: p.prosecution_status?.includes('convicted') ||
                   p.legal_status === 'convicted' ||
                   p.convictions !== undefined,
        status: p.prosecution_status || p.legal_status
      },
      crimesAccused: p.major_crimes || p.crimesAccused || []
    }));

    console.log(`✅ [DINA API] Retrieved ${transformedPerpetrators.length} DINA perpetrators`);
    res.json({
      success: true,
      count: transformedPerpetrators.length,
      data: transformedPerpetrators
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

    const centers = await db.collection('dina_torture_centers')
      .find({ id: { $exists: true } })
      .toArray();

    console.log(`✅ [DINA API] Retrieved ${centers.length} torture centers`);
    res.json({ success: true, count: centers.length, data: centers });
  } catch (error) {
    console.error('❌ [DINA API] Failed to fetch torture centers:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get DINA international crimes
app.get('/api/dina/international-crimes', async (req, res) => {
  try {
    console.log('🌍 [DINA API] Fetching DINA international crimes');

    const crimes = await db.collection('dina_international_crimes')
      .find({ id: { $exists: true } })
      .toArray();

    console.log(`✅ [DINA API] Retrieved ${crimes.length} international crimes`);
    res.json({ success: true, count: crimes.length, data: crimes });
  } catch (error) {
    console.error('❌ [DINA API] Failed to fetch international crimes:', error.message);
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
    fileSize: 500 * 1024 * 1024 // 500MB limit
  }
});

// Video maker endpoint
app.post('/api/video-maker', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  const startTime = Date.now();
  console.log('🎬 [VideoMaker API] Processing video request, nyaa~!');

  try {
    if (!req.files || !req.files.video || !req.files.image) {
      return res.status(400).json({ success: false, error: 'Both video and image files are required!' });
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
      'center': '(main_w-overlay_w)/2:(main_h-overlay_h)/2',
      'full': '0:0'
    };

    const overlayPosition = positionMap[position] || positionMap['bottom-right'];

    // Ensure output name has .mp4 extension
    const outputFileName = outputName.endsWith('.mp4') ? outputName : `${outputName}.mp4`;
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
        return res.status(500).json({ success: false, error: `Video processing failed: ${error.message}` });
      }

      // Check if output file was created
      if (!fs.existsSync(outputPath)) {
        console.error('❌ [VideoMaker API] Output file not created');
        return res.status(500).json({ success: false, error: 'Video processing failed - output file not created' });
      }

      // Get file size
      const stats = fs.statSync(outputPath);
      const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);

      console.log(`✅ [VideoMaker API] Video created successfully! Size: ${fileSizeMB}MB, Time: ${processingTime}s`);

      // Return success with file info
      res.json({
        success: true,
        message: 'Video created with MAXIMUM NEKO POWER! 🎬✨',
        outputFile: outputFileName,
        fileSize: `${fileSizeMB}MB`,
        processingTime: `${processingTime}s`,
        downloadPath: `/api/video-maker/download/${outputFileName}`
      });

      // Clean up output file after 5 minutes
      setTimeout(() => {
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
          console.log('🧹 [VideoMaker API] Cleaned up output file:', outputFileName);
        }
      }, 5 * 60 * 1000);
    });
  } catch (error) {
    console.error('❌ [VideoMaker API] Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Download processed video endpoint
app.get('/api/video-maker/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = `/tmp/neko-video-uploads/${filename}`;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, error: 'File not found or expired' });
  }

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('❌ [VideoMaker API] Download error:', err.message);
    }
  });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🐾⚡ NEKO DEFENSE API running on port ${PORT}, nyaa~!`);
    console.log(`📡 API endpoint: http://localhost:${PORT}`);
    console.log(`💖 Status: LEGENDARY MODE ACTIVATED!`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🐾 Closing MongoDB connection, nyaa~!');
  await client.close();
  process.exit(0);
});
