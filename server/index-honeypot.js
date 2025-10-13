#!/usr/bin/env node
// 🐾🍯🪤 NEKO HONEYPOT TRAP SERVER - INTERNET EXPOSURE MODE 🪤🍯🐾
// LEGENDARY trap system to catch BAD ACTORS from the internet!

const express = require('express');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB for threat intelligence
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pinochito1747:pinochito1747@free-cluster.svjei3w.mongodb.net/';
const DATABASE = 'neko-defense-system';

let mongoClient;
let db;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🎭 LOG ALL REQUESTS - COMPREHENSIVE THREAT INTELLIGENCE
app.use(async (req, res, next) => {
  const attackData = {
    timestamp: new Date(),
    ip: req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        'unknown',
    method: req.method,
    path: req.path,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    user_agent: req.headers['user-agent'],
    referer: req.headers['referer'],
    origin: req.headers['origin'],
    cookies: req.headers['cookie'],

    // Threat indicators
    is_suspicious: false,
    threat_score: 0,
    threat_indicators: [],
    honeypot_triggered: req.path.includes('admin') || req.path.includes('wp-') || req.path.includes('.php') || req.path.includes('login')
  };

  // Calculate threat score
  if (req.path.includes('admin')) attackData.threat_score += 20;
  if (req.path.includes('wp-')) attackData.threat_score += 15;
  if (req.path.includes('.php')) attackData.threat_score += 15;
  if (req.path.includes('login')) attackData.threat_score += 10;
  if (req.path.includes('..')) { attackData.threat_score += 50; attackData.threat_indicators.push('PATH_TRAVERSAL'); }
  if (req.body && JSON.stringify(req.body).includes('<script')) { attackData.threat_score += 40; attackData.threat_indicators.push('XSS_ATTEMPT'); }
  if (req.query && JSON.stringify(req.query).includes('union')) { attackData.threat_score += 45; attackData.threat_indicators.push('SQL_INJECTION'); }
  if (!req.headers['user-agent'] || req.headers['user-agent'].includes('bot')) attackData.threat_score += 5;

  attackData.is_suspicious = attackData.threat_score >= 10;

  // Log to MongoDB
  if (db) {
    try {
      await db.collection('internet_attacks').insertOne(attackData);

      // Log high-threat attacks separately
      if (attackData.threat_score >= 30) {
        await db.collection('high_threat_attacks').insertOne({
          ...attackData,
          alert_level: 'CRITICAL',
          auto_reported: true
        });
        console.log(`🚨 HIGH THREAT DETECTED: ${attackData.ip} - Score: ${attackData.threat_score} - ${req.path}`);
      }
    } catch (error) {
      console.error('❌ MongoDB logging error:', error.message);
    }
  }

  console.log(`🎯 [${attackData.ip}] ${req.method} ${req.path} - Threat: ${attackData.threat_score}`);
  next();
});

// 🍯 HONEYPOT TRAP ENDPOINTS - Attract attackers!

// Admin panel traps
app.all('/admin', honeypot('admin_panel'));
app.all('/admin/*', honeypot('admin_panel_deep'));
app.all('/administrator', honeypot('joomla_admin'));
app.all('/wp-admin', honeypot('wordpress_admin'));
app.all('/wp-admin/*', honeypot('wordpress_admin_deep'));
app.all('/wp-login.php', honeypot('wordpress_login'));
app.all('/phpmyadmin', honeypot('phpmyadmin'));
app.all('/pma', honeypot('phpmyadmin_short'));
app.all('/mysql', honeypot('mysql_admin'));

// Database traps
app.all('/database', honeypot('database_access'));
app.all('/db', honeypot('database_short'));
app.all('/backup.sql', honeypot('sql_backup'));
app.all('/dump.sql', honeypot('sql_dump'));
app.all('/users.sql', honeypot('users_sql'));

// Config file traps
app.all('/.env', honeypot('env_file'));
app.all('/config.php', honeypot('php_config'));
app.all('/wp-config.php', honeypot('wordpress_config'));
app.all('/configuration.php', honeypot('joomla_config'));
app.all('/.git/config', honeypot('git_config'));
app.all('/.aws/credentials', honeypot('aws_credentials'));

// Sensitive data traps
app.all('/passwords.txt', honeypot('password_file'));
app.all('/users.txt', honeypot('users_file'));
app.all('/credentials.json', honeypot('credentials_json'));
app.all('/secrets', honeypot('secrets_endpoint'));
app.all('/api/keys', honeypot('api_keys'));
app.all('/private', honeypot('private_area'));

// Remote code execution traps
app.all('/shell.php', honeypot('php_shell'));
app.all('/cmd.php', honeypot('php_cmd'));
app.all('/execute', honeypot('execute_endpoint'));
app.all('/eval', honeypot('eval_endpoint'));
app.all('/upload.php', honeypot('file_upload'));

// API exploitation traps
app.all('/api/admin', honeypot('api_admin'));
app.all('/api/user/delete', honeypot('api_user_delete'));
app.all('/api/exec', honeypot('api_exec'));

function honeypot(trapName) {
  return async (req, res) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
                req.connection.remoteAddress ||
                'unknown';

    console.log(`🍯💥 HONEYPOT TRIGGERED: ${trapName} by ${ip}`);

    // Log honeypot trigger
    if (db) {
      await db.collection('honeypot_triggers').insertOne({
        timestamp: new Date(),
        trap_name: trapName,
        ip: ip,
        method: req.method,
        path: req.path,
        headers: req.headers,
        query: req.query,
        body: req.body,
        user_agent: req.headers['user-agent'],
        threat_level: 'HONEYPOT_TRIGGERED'
      });
    }

    // Return convincing fake responses
    const fakeResponses = {
      admin_panel: { error: 'Unauthorized', message: 'Admin access denied' },
      wordpress_login: `<!DOCTYPE html><html><body><h1>WordPress Login</h1><form><input name="user" placeholder="Username"><input type="password" name="pass" placeholder="Password"><button>Login</button></form></body></html>`,
      phpmyadmin: { error: 'Access denied for user \'root\'@\'localhost\'' },
      env_file: 'DB_HOST=localhost\nDB_USER=admin\nDB_PASS=hunter2\nAPI_KEY=sk_test_fake123',
      password_file: 'admin:$2y$10$fakehashabcdef123456\nroot:$2y$10$fakehashabcdef789012',
      api_keys: { api_key: 'sk_live_fakekeyforthehoneypot1234567890', status: 'active' }
    };

    res.status(403).send(fakeResponses[trapName] || { error: 'Access Denied', trap: trapName });
  };
}

// 📊 Legitimate endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    message: 'Neko Defense Honeypot System Active! 🍯',
    mode: 'INTERNET_EXPOSURE',
    protection: 'HONEYPOT_ACTIVE',
    kawaii_level: 'TRAP_MODE'
  });
});

app.get('/api/stats', async (req, res) => {
  if (!db) return res.json({ error: 'Database not connected' });

  const totalAttacks = await db.collection('internet_attacks').countDocuments();
  const suspiciousAttacks = await db.collection('internet_attacks').countDocuments({ is_suspicious: true });
  const honeypotTriggers = await db.collection('honeypot_triggers').countDocuments();
  const highThreats = await db.collection('high_threat_attacks').countDocuments();

  res.json({
    success: true,
    data: {
      total_requests: totalAttacks,
      suspicious_requests: suspiciousAttacks,
      honeypot_triggers: honeypotTriggers,
      high_threat_attacks: highThreats,
      capture_rate: totalAttacks > 0 ? ((suspiciousAttacks / totalAttacks) * 100).toFixed(2) + '%' : '0%',
      status: 'LEGENDARY_TRAP_ACTIVE'
    }
  });
});

app.get('/api/threats/live', async (req, res) => {
  if (!db) return res.json({ error: 'Database not connected' });

  const recentAttacks = await db.collection('internet_attacks')
    .find({ is_suspicious: true })
    .sort({ timestamp: -1 })
    .limit(50)
    .toArray();

  res.json({
    success: true,
    count: recentAttacks.length,
    data: recentAttacks
  });
});

app.get('/api/threats/high', async (req, res) => {
  if (!db) return res.json({ error: 'Database not connected' });

  const highThreats = await db.collection('high_threat_attacks')
    .find()
    .sort({ timestamp: -1 })
    .limit(20)
    .toArray();

  res.json({
    success: true,
    count: highThreats.length,
    data: highThreats
  });
});

// 🌐 Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <html>
    <head><title>Neko Defense System</title></head>
    <body style="font-family: monospace; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px;">
      <h1>🐾 Neko Defense System</h1>
      <p>Protected web application running with fortress-grade security.</p>
      <h2>API Endpoints:</h2>
      <ul>
        <li><a href="/api/health" style="color: #FFD700;">/api/health</a> - Health check</li>
        <li><a href="/api/stats" style="color: #FFD700;">/api/stats</a> - Security statistics</li>
        <li><a href="/api/threats/live" style="color: #FFD700;">/api/threats/live</a> - Live threat feed</li>
      </ul>
      <p style="margin-top: 40px; opacity: 0.8;">*purrs in honeypot excellence* 😻🍯✨</p>
    </body>
    </html>
  `);
});

// 🚀 Start server
async function startServer() {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB for threat intelligence...');
    mongoClient = new MongoClient(MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db(DATABASE);
    console.log('✅ MongoDB connected, nyaa~!');

    // Create indexes for performance
    await db.collection('internet_attacks').createIndex({ timestamp: -1 });
    await db.collection('internet_attacks').createIndex({ ip: 1 });
    await db.collection('honeypot_triggers').createIndex({ timestamp: -1 });
    await db.collection('high_threat_attacks').createIndex({ timestamp: -1 });

    // Listen on ALL interfaces for Cloudflare Tunnel
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║                                                                ║');
      console.log('║   🐾🍯🪤 NEKO HONEYPOT TRAP SERVER 🪤🍯🐾                      ║');
      console.log('║                                                                ║');
      console.log('╚════════════════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`📡 Server running on: 0.0.0.0:${PORT}`);
      console.log(`🌍 Mode: INTERNET EXPOSURE`);
      console.log(`🍯 Honeypot Traps: 30+ active endpoints`);
      console.log(`💾 Threat Intelligence: MongoDB connected`);
      console.log(`🚨 Auto-reporting: ENABLED`);
      console.log('');
      console.log('🪤 HONEYPOT TRAPS ACTIVE:');
      console.log('   • Admin panel traps (9)');
      console.log('   • Database access traps (5)');
      console.log('   • Config file traps (6)');
      console.log('   • Sensitive data traps (6)');
      console.log('   • RCE traps (5)');
      console.log('   • API exploitation traps (3)');
      console.log('');
      console.log('*purrs in trap activation* 😻🍯✨');
      console.log('');
      console.log('🌐 Ready for Cloudflare Tunnel exposure, desu!');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Failed to start honeypot server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down honeypot server, nyaa~...');
  if (mongoClient) await mongoClient.close();
  process.exit(0);
});

startServer();
