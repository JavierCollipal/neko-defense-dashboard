// 🐾⚡ NEKO DEFENSE DASHBOARD API SERVER - DEMO MODE ⚡🐾
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

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
    name: 'DEMO MODE',
    category: 'interface',
    threat_level: 'INFO',
    description: 'Running in demo mode with sample data',
    art: ['NEKO DEFENSE SYSTEM', 'Demo Mode Active!']
  }];
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'LEGENDARY', message: 'Neko Defense API is purring perfectly! 🐾✨', mode: 'DEMO' });
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
    timestamp: new Date(),
    status: 'FORTRESS MODE ACTIVE (DEMO)',
    kawaii_level: 'MAXIMUM'
  };
  res.json({ success: true, data: stats });
});

// Get threat actors summary
app.get('/api/threats/summary', (req, res) => {
  const summary = {
    total_collections: 9,
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
      'Crypto Thieves'
    ],
    status: 'MAXIMUM PROTECTION ACTIVE',
    last_updated: new Date()
  };
  res.json({ success: true, data: summary });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║                                                        ║');
  console.log('║   🐾⚡ NEKO DEFENSE API - DEMO MODE ⚡🐾              ║');
  console.log('║                                                        ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`📡 API running on: http://localhost:${PORT}`);
  console.log(`💖 Status: LEGENDARY MODE ACTIVATED!`);
  console.log(`🎨 ASCII Art Loaded: ${asciiData.length} pieces`);
  console.log('');
  console.log('*purrs in server readiness* 😻✨');
  console.log('');
});
