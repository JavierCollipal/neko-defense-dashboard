#!/usr/bin/env node
// 🐾⚡🛡️ NEKO DEFENSE DASHBOARD API SERVER - PROTECTED MODE ⚡🛡️🐾
// With LEGENDARY Network Protection Ability!

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const NekoNetworkProtector = require('../../neko-network-protector');

const app = express();
const PORT = process.env.PORT || 5000;
const BIND_IP = process.env.BIND_IP || '192.168.1.134'; // Your local IP

// 🛡️ Initialize Neko Network Protector with FORTRESS MODE
const protector = new NekoNetworkProtector({
  // Network configuration
  bindIP: BIND_IP,
  privateMode: true, // Private mode ENABLED, nyaa~!
  allowedIPs: [
    '192.168.1.134', // Your machine
    '127.0.0.1', // Localhost
    '::1', // IPv6 localhost
    // Add more trusted IPs here, desu!
  ],
  blockedIPs: [], // Will be populated from MongoDB

  // Rate limiting - Prevent DoS
  rateLimit: {
    enabled: true,
    windowMs: 60000, // 1 minute window
    maxRequests: 100 // 100 requests per minute max
  },

  // Authentication
  requireAuth: false, // Set to true to require Bearer tokens
  authTokens: [], // Add tokens with protector.addToken()

  // Threat detection
  threatDetection: {
    enabled: true,
    blockOnThreat: true, // Auto-block threatening IPs
    suspiciousPatterns: [
      /\.\.\//g, // Path traversal attempts
      /<script/gi, // XSS attempts
      /union.*select/gi, // SQL injection attempts
      /admin|password|secret|token/gi, // Sensitive data probing
      /eval\(/gi, // Code injection
      /base64/gi, // Encoded payloads
    ]
  },

  // MongoDB integration for upgradability
  mongodb: {
    enabled: true,
    uri: process.env.MONGODB_URI || (() => { console.error("❌ MONGODB_URI not set!"); process.exit(1); })(),
    database: 'neko-defense-system'
  }
});

// Load ASCII art from file
const asciiArtPath = path.join(require('os').homedir(), 'neko-ascii-art-gallery.json');
let asciiData = [];

try {
  const rawData = fs.readFileSync(asciiArtPath, 'utf8');
  const jsonData = JSON.parse(rawData);
  asciiData = jsonData.art_pieces || [];
  console.log(`✅ Loaded ${asciiData.length} ASCII art pieces, nyaa~!`);
} catch (error) {
  console.log('⚠️  Using fallback demo data, desu!');
  asciiData = [{
    id: 'demo',
    name: 'PROTECTED MODE',
    category: 'interface',
    threat_level: 'INFO',
    description: 'Running in protected mode with fortress-grade security',
    art: ['NEKO DEFENSE SYSTEM', 'Protected Mode Active!', 'Fortress Shields UP! 🛡️']
  }];
}

// 🔧 Middleware - Order matters!
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests from localhost and your local IP
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5000',
      `http://${BIND_IP}:3000`,
      `http://${BIND_IP}:5000`,
      undefined // Allow requests with no origin (mobile apps, curl, etc.)
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`🚫 CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' })); // Limit payload size for DoS protection

// 🛡️ APPLY NEKO NETWORK PROTECTOR - All requests go through this!
app.use(protector.middleware());

// 🌐 Serve React build for production (AFTER security middleware!)
const buildPath = path.join(__dirname, '..', 'build');
console.log(`🎨 Serving React build from: ${buildPath}`);
app.use(express.static(buildPath));

// 📊 Add protection stats endpoint
app.get('/api/protection/stats', (req, res) => {
  const stats = protector.getStats();
  res.json({
    success: true,
    message: 'Protection statistics, nyaa~! 🛡️',
    data: stats
  });
});

// 🔑 Add token management endpoints (for admin use)
app.post('/api/protection/token/generate', async (req, res) => {
  const token = await protector.addToken();
  res.json({
    success: true,
    message: 'New authentication token generated, desu! 🔑',
    token: token
  });
});

// 🚫 Block IP endpoint
app.post('/api/protection/block/:ip', async (req, res) => {
  const ip = req.params.ip;
  const reason = req.body.reason || 'Manual block via API';

  await protector.blockIP(ip, reason);

  res.json({
    success: true,
    message: `IP ${ip} has been BLOCKED, nyaa~! 🚫`,
    reason: reason
  });
});

// ✅ Unblock IP endpoint
app.post('/api/protection/unblock/:ip', async (req, res) => {
  const ip = req.params.ip;

  await protector.unblockIP(ip);

  res.json({
    success: true,
    message: `IP ${ip} has been unblocked, desu! ✅`
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'LEGENDARY',
    message: 'Neko Defense API is purring perfectly! 🐾✨',
    mode: 'PROTECTED',
    protection: 'FORTRESS GRADE',
    kawaii_level: 'MAXIMUM'
  });
});

// Get all ASCII art
app.get('/api/ascii-art', (req, res) => {
  res.json({ success: true, count: asciiData.length, data: asciiData });
});

// Get ASCII art by category
app.get('/api/ascii-art/:category', (req, res) => {
  const filtered = asciiData.filter(art => art.category === req.params.category);
  res.json({ success: true, count: filtered.length, data: filtered });
});

// Get defense system stats
app.get('/api/stats', (req, res) => {
  const stats = {
    total_collections: 9,
    collections: [
      'neko_ascii_art_gallery',
      'suspicious_content_trap',
      'illegal_materials_monitor',
      'restricted_access_bait',
      'admin_secrets_decoy',
      'predator_detection_zone',
      'conversation_archive',
      'archive',
      'lvim_config'
    ],
    network_protection: {
      enabled: true,
      mode: 'FORTRESS',
      protector_stats: protector.getStats()
    },
    timestamp: new Date(),
    status: 'FORTRESS MODE ACTIVE (PROTECTED)',
    kawaii_level: 'MAXIMUM'
  };
  res.json({ success: true, data: stats });
});

// Get threat actors summary
app.get('/api/threats/summary', (req, res) => {
  const summary = {
    total_collections: 10,
    honeypot_traps: [
      'suspicious_content_trap',
      'illegal_materials_monitor',
      'restricted_access_bait',
      'admin_secrets_decoy',
      'predator_detection_zone'
    ],
    threat_actors_tracked: [
      'APT28/Frost Spider',
      'Ransomware Gangs',
      'Black Hat Hackers',
      'Phishing Scammers',
      'Crypto Thieves',
      'DINA Agents (Chilean Dictatorship)'
    ],
    network_protection: protector.getStats(),
    status: 'MAXIMUM PROTECTION ACTIVE',
    last_updated: new Date()
  };
  res.json({ success: true, data: summary });
});

// 🔍 DINA DOCUMENTATION ENDPOINTS - Expose Chilean Dictatorship Crimes, nyaa~!
// Get all DINA documentation
app.get('/api/dina/all', async (req, res) => {
  try {
    if (!protector.db) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected, desu!'
      });
    }

    const collection = protector.db.collection('dina_pinochet_documentation');
    const docs = await collection.find({}).limit(100).toArray();

    res.json({
      success: true,
      message: 'DINA documentation retrieved, nyaa~! Justice incoming! ⚖️',
      count: docs.length,
      data: docs
    });
  } catch (error) {
    console.error('Error fetching DINA docs:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving DINA documentation',
      error: error.message
    });
  }
});

// Get DINA documentation by type (perpetrator, victim, operation, evidence, connection)
app.get('/api/dina/type/:docType', async (req, res) => {
  try {
    if (!protector.db) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected, desu!'
      });
    }

    const docType = req.params.docType;
    const collection = protector.db.collection('dina_pinochet_documentation');
    const docs = await collection.find({ documentType: docType }).limit(100).toArray();

    res.json({
      success: true,
      message: `DINA ${docType} documents retrieved, nyaa~! 🎯`,
      type: docType,
      count: docs.length,
      data: docs
    });
  } catch (error) {
    console.error('Error fetching DINA docs by type:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving DINA documentation',
      error: error.message
    });
  }
});

// Get DINA perpetrators (agents, commanders)
app.get('/api/dina/perpetrators', async (req, res) => {
  try {
    if (!protector.db) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected, desu!'
      });
    }

    const collection = protector.db.collection('dina_pinochet_documentation');
    const perpetrators = await collection.find({ documentType: 'perpetrator' }).limit(100).toArray();

    res.json({
      success: true,
      message: 'DINA perpetrators exposed, nyaa~! No escape from justice! ⚖️🔍',
      count: perpetrators.length,
      data: perpetrators.map(p => ({
        _id: p._id,
        fullName: p.perpetrator?.fullName || p.perpetrator?.name || 'Unknown',
        role: p.perpetrator?.role || 'Unknown',
        organization: p.perpetrator?.organization || [],
        legalStatus: p.perpetrator?.legalStatus || { convicted: false, currentStatus: 'Unknown' },
        crimesAccused: p.perpetrator?.crimesAccused || [],
        tags: p.tags || [],
        verificationStatus: p.verificationStatus || 'unverified'
      }))
    });
  } catch (error) {
    console.error('Error fetching DINA perpetrators:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving DINA perpetrators',
      error: error.message
    });
  }
});

// Get DINA statistics
app.get('/api/dina/stats', async (req, res) => {
  try {
    if (!protector.db) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected, desu!'
      });
    }

    const collection = protector.db.collection('dina_pinochet_documentation');

    const totalDocs = await collection.countDocuments();
    const byType = await collection.aggregate([
      { $group: { _id: '$documentType', count: { $sum: 1 } } }
    ]).toArray();

    const perpetrators = await collection.countDocuments({ documentType: 'perpetrator' });
    const convicted = await collection.countDocuments({
      documentType: 'perpetrator',
      'perpetrator.legalStatus.convicted': true
    });

    res.json({
      success: true,
      message: 'DINA documentation statistics, nyaa~! 📊',
      data: {
        total_documents: totalDocs,
        by_type: byType,
        perpetrators: {
          total: perpetrators,
          convicted: convicted,
          unprosecuted: perpetrators - convicted
        },
        methodology: 'Simon Wiesenthal Nazi-hunting precedent',
        legal_basis: 'Crimes against humanity - no statute of limitations',
        last_updated: new Date()
      }
    });
  } catch (error) {
    console.error('Error fetching DINA stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving DINA statistics',
      error: error.message
    });
  }
});

// Search DINA documentation
app.get('/api/dina/search', async (req, res) => {
  try {
    if (!protector.db) {
      return res.status(503).json({
        success: false,
        message: 'Database not connected, desu!'
      });
    }

    const query = req.query.q;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query required, nyaa~!'
      });
    }

    const collection = protector.db.collection('dina_pinochet_documentation');

    // Text search using MongoDB text index
    const results = await collection.find({
      $text: { $search: query }
    }).limit(50).toArray();

    res.json({
      success: true,
      message: `DINA search results for: "${query}", desu! 🔍`,
      query: query,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error searching DINA docs:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching DINA documentation',
      error: error.message
    });
  }
});

// 🌐 Catch-all handler for React routing (MUST be last!)
// This ensures that React Router handles client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// 🚀 Start server with MongoDB connection
async function startServer() {
  try {
    // Connect protector to MongoDB
    console.log('🔌 Connecting Network Protector to MongoDB...');
    await protector.connectMongoDB();

    // Start listening on SPECIFIC IP (not 0.0.0.0!)
    app.listen(PORT, BIND_IP, () => {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║                                                                ║');
      console.log('║   🐾⚡🛡️ NEKO DEFENSE API - PROTECTED MODE 🛡️⚡🐾           ║');
      console.log('║                                                                ║');
      console.log('╚════════════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`📡 API running on: http://${BIND_IP}:${PORT}`);
      console.log(`🛡️  Protection: FORTRESS GRADE ENABLED!`);
      console.log(`🔒 Private Mode: ${protector.config.privateMode ? 'ACTIVE' : 'INACTIVE'}`);
      console.log(`✅ Whitelisted IPs: ${protector.config.allowedIPs.length}`);
      console.log(`🚫 Blocked IPs: ${protector.config.blockedIPs.length}`);
      console.log(`⚡ Rate Limiting: ${protector.config.rateLimit.enabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`🚨 Threat Detection: ${protector.config.threatDetection.enabled ? 'ENABLED' : 'DISABLED'}`);
      console.log(`💾 MongoDB: ${protector.db ? 'CONNECTED' : 'STANDALONE'}`);
      console.log(`💖 Status: LEGENDARY MODE ACTIVATED!`);
      console.log(`🎨 ASCII Art Loaded: ${asciiData.length} pieces`);
      console.log('');
      console.log('🛡️  PROTECTION FEATURES:');
      console.log('   • IP Whitelisting/Blacklisting ✅');
      console.log('   • Rate Limiting (DoS Protection) ⚡');
      console.log('   • Threat Pattern Detection 🚨');
      console.log('   • Request Logging & Monitoring 👁️');
      console.log('   • MongoDB Upgradability 💾');
      console.log('   • Auto-blocking of Threats 🚫');
      console.log('');
      console.log('*purrs in fortress-grade security* 😻🛡️✨');
      console.log('');

      // Display initial stats
      setTimeout(() => {
        protector.displayStats();
      }, 1000);
    });

    // Display stats every 5 minutes
    setInterval(() => {
      protector.displayStats();
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error('❌ Failed to start protected server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully, nyaa~...');
  protector.displayStats();
  await protector.disconnect();
  process.exit(0);
});

// Start the protected server!
startServer();
