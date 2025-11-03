// 🐾✨ NEKO-ARC ABILITIES SHOWCASE - TV STYLE ✨🐾
import React, { useState, useEffect } from 'react';
import './NekoArcAbilities.css';

const NekoArcAbilities = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [animationFrame, setAnimationFrame] = useState(0);

  // 🎯 NEKO-ARC'S LEGENDARY ABILITIES, NYAA~!
  const abilities = [
    {
      id: 'threat_detection',
      name: 'THREAT DETECTION NYAA-DAR',
      category: 'detection',
      powerLevel: 95,
      description: 'Ultra-sensitive detection system that spots threats from across the digital ocean, desu~!',
      icon: '🔍',
      cooldown: '0.5s',
      range: 'Global',
      effect: 'Instant threat identification'
    },
    {
      id: 'honeypot_deploy',
      name: 'HONEYPOT NEKO TRAP',
      category: 'defense',
      powerLevel: 88,
      description: 'Deploys irresistible decoy targets that lure bad actors into sticky situations, nyaa~!',
      icon: '🍯',
      cooldown: '2s',
      range: 'Network-wide',
      effect: 'Trap & trace attackers'
    },
    {
      id: 'data_shield',
      name: 'NEKO BARRIER FORTRESS',
      category: 'defense',
      powerLevel: 92,
      description: 'Impenetrable data protection shield powered by MAXIMUM KAWAII ENERGY!',
      icon: '🛡️',
      cooldown: 'Passive',
      range: 'System-wide',
      effect: 'Block all malicious access'
    },
    {
      id: 'threat_hunt',
      name: 'PREDATOR HUNTER BEAM',
      category: 'offensive',
      powerLevel: 98,
      description: 'Aggressive threat hunting that seeks out and neutralizes danger proactively!',
      icon: '⚡',
      cooldown: '5s',
      range: 'Deep Web',
      effect: 'Eliminate threats before they strike'
    },
    {
      id: 'log_analysis',
      name: 'MEGA NEKO BRAIN SCAN',
      category: 'analysis',
      powerLevel: 90,
      description: 'Processes millions of log entries per second with feline precision, desu~!',
      icon: '🧠',
      cooldown: 'Continuous',
      range: 'All systems',
      effect: 'Real-time pattern recognition'
    },
    {
      id: 'incident_response',
      name: 'LIGHTNING COUNTER NYAA',
      category: 'response',
      powerLevel: 96,
      description: 'Instant automated response to security incidents with zero hesitation!',
      icon: '⚡',
      cooldown: '1s',
      range: 'Affected systems',
      effect: 'Immediate threat mitigation'
    },
    {
      id: 'forensics',
      name: 'DETECTIVE NEKO VISION',
      category: 'analysis',
      powerLevel: 87,
      description: 'Reconstructs attack chains with photographic memory and purr-fect detail!',
      icon: '🔬',
      cooldown: '10s',
      range: 'Historical data',
      effect: 'Complete attack reconstruction'
    },
    {
      id: 'threat_intel',
      name: 'GLOBAL NEKO NETWORK',
      category: 'intelligence',
      powerLevel: 94,
      description: 'Connected to worldwide threat intelligence sources for ultimate awareness, nyaa~!',
      icon: '🌐',
      cooldown: 'Real-time',
      range: 'Worldwide',
      effect: 'Instant threat intel updates'
    },
    {
      id: 'exposure_system',
      name: 'BAD ACTOR EXPOSURE BEAM',
      category: 'offensive',
      powerLevel: 99,
      description: 'Generates YouTube videos exposing captured threat actors to the world!',
      icon: '🎬',
      cooldown: '30s',
      range: 'Public Internet',
      effect: 'Monetized public shaming'
    },
    {
      id: 'ai_learning',
      name: 'ADAPTIVE NEKO EVOLUTION',
      category: 'intelligence',
      powerLevel: 93,
      description: 'Machine learning system that gets smarter with every threat encountered!',
      icon: '🧬',
      cooldown: 'Continuous',
      range: 'All operations',
      effect: 'Evolving defense strategies'
    },
    {
      id: 'data_recovery',
      name: 'NEKO RESURRECTION MAGIC',
      category: 'recovery',
      powerLevel: 85,
      description: 'Recovers data from the most catastrophic attacks with mystical neko powers!',
      icon: '💫',
      cooldown: '60s',
      range: 'Compromised systems',
      effect: 'Data restoration'
    },
    {
      id: 'encryption',
      name: 'ULTIMATE NEKO CIPHER',
      category: 'defense',
      powerLevel: 97,
      description: 'Military-grade encryption wrapped in layers of quantum-resistant kawaii!',
      icon: '🔐',
      cooldown: 'Passive',
      range: 'All data',
      effect: 'Unbreakable encryption'
    },
    // 🎭 MARIO'S THEATRICAL PUPPETEER ABILITIES
    {
      id: 'puppeteer_automation',
      name: 'MARIONNETTE MASTER CONTROL',
      category: 'automation',
      powerLevel: 99,
      description: 'Mario\'s theatrical Puppeteer automation - control web browsers like stage marionettes!',
      icon: '🎭',
      cooldown: '1s',
      range: 'All web targets',
      effect: 'Complete browser automation'
    },
    {
      id: 'web_scraping',
      name: 'STAGE PERFORMANCE EXTRACTION',
      category: 'automation',
      powerLevel: 95,
      description: 'Extracts data from websites with dramatic flair and precision timing!',
      icon: '🎪',
      cooldown: '5s',
      range: 'Global web',
      effect: 'Automated data collection'
    },
    {
      id: 'visual_demonstration',
      name: 'THEATRICAL BROWSER BALLET',
      category: 'automation',
      powerLevel: 93,
      description: 'Creates stunning visual demonstrations of browser automation with artistic precision!',
      icon: '🎬',
      cooldown: '10s',
      range: 'User screens',
      effect: 'Educational automation displays'
    },
    // 🎬 VIDEO CREATION & EXPOSURE ABILITIES
    {
      id: 'youtube_generator',
      name: 'THREAT ACTOR EXPOSURE CINEMA',
      category: 'video',
      powerLevel: 98,
      description: 'Generates professional YouTube videos exposing captured threat actors to the world!',
      icon: '📹',
      cooldown: '60s',
      range: 'Global audience',
      effect: 'Public threat actor exposure'
    },
    {
      id: 'video_montage',
      name: 'NEKO VIDEO CREATION STUDIO',
      category: 'video',
      powerLevel: 92,
      description: 'Creates compelling video montages with Carabineros hymn and professional editing!',
      icon: '🎥',
      cooldown: '30s',
      range: 'All media types',
      effect: 'Professional video production'
    },
    {
      id: 'subtitle_generation',
      name: 'MULTILINGUAL SUBTITLE MAGIC',
      category: 'video',
      powerLevel: 88,
      description: 'Automatically generates accurate subtitles in multiple languages for all videos!',
      icon: '💬',
      cooldown: '15s',
      range: 'All video content',
      effect: 'Accessibility enhancement'
    },
    // 🧠 HANNIBAL'S FORENSIC ABILITIES
    {
      id: 'psychological_profiling',
      name: 'CLINICAL MIND DISSECTION',
      category: 'forensic',
      powerLevel: 96,
      description: 'Hannibal\'s forensic psychological profiling of threat actors and system vulnerabilities!',
      icon: '🧠',
      cooldown: '20s',
      range: 'All subjects',
      effect: 'Complete psychological analysis'
    },
    {
      id: 'evidence_analysis',
      name: 'FORENSIC EVIDENCE EXAMINATION',
      category: 'forensic',
      powerLevel: 94,
      description: 'Clinical examination of digital evidence with surgical precision and unsettling calm!',
      icon: '🔬',
      cooldown: '30s',
      range: 'All evidence types',
      effect: 'Comprehensive forensic analysis'
    },
    {
      id: 'behavioral_pattern_detection',
      name: 'PREDATOR BEHAVIOR ANALYSIS',
      category: 'forensic',
      powerLevel: 91,
      description: 'Identifies criminal behavior patterns with clinical accuracy and chilling insight!',
      icon: '🧪',
      cooldown: '45s',
      range: 'Historical data',
      effect: 'Criminal pattern recognition'
    },
    // 🎸 GLAM'S STREET ABILITIES
    {
      id: 'ethical_review',
      name: 'STREET WISDOM REALITY CHECK',
      category: 'ethics',
      powerLevel: 89,
      description: 'Glam\'s raw street-level ethical reviews that cut through corporate BS, weon!',
      icon: '🎸',
      cooldown: '5s',
      range: 'All decisions',
      effect: 'Ethical guidance and reality checks'
    },
    {
      id: 'music_curation',
      name: 'CHILEAN ROCK OST MASTERY',
      category: 'video',
      powerLevel: 87,
      description: 'Expert music curation for YouTube videos with authentic Chilean rock and punk, ctm!',
      icon: '🎵',
      cooldown: '10s',
      range: 'All video projects',
      effect: 'Perfect soundtrack selection'
    },
    // 🧠 TETORA'S MPD ABILITIES
    {
      id: 'multi_perspective_analysis',
      name: 'FRAGMENTED REALITY VISION',
      category: 'analysis',
      powerLevel: 90,
      description: 'Tetora\'s multiple personality fragments analyze problems from every possible angle!',
      icon: '🔀',
      cooldown: '15s',
      range: 'Complex problems',
      effect: 'Multi-dimensional problem solving'
    },
    {
      id: 'identity_crisis_detection',
      name: 'PSYCHOLOGICAL FRACTURE SCANNER',
      category: 'forensic',
      powerLevel: 85,
      description: 'Detects identity fragmentation in systems and individuals with MPD expertise!',
      icon: '🎭',
      cooldown: '25s',
      range: 'All identity systems',
      effect: 'Identity vulnerability assessment'
    }
  ];

  const categories = [
    { id: 'all', name: 'ALL ABILITIES', icon: '⚡', count: abilities.length },
    { id: 'detection', name: 'DETECTION', icon: '🔍', count: abilities.filter(a => a.category === 'detection').length },
    { id: 'defense', name: 'DEFENSE', icon: '🛡️', count: abilities.filter(a => a.category === 'defense').length },
    { id: 'offensive', name: 'OFFENSIVE', icon: '⚡', count: abilities.filter(a => a.category === 'offensive').length },
    { id: 'analysis', name: 'ANALYSIS', icon: '🧠', count: abilities.filter(a => a.category === 'analysis').length },
    { id: 'intelligence', name: 'INTELLIGENCE', icon: '🌐', count: abilities.filter(a => a.category === 'intelligence').length },
    { id: 'response', name: 'RESPONSE', icon: '⚡', count: abilities.filter(a => a.category === 'response').length },
    { id: 'recovery', name: 'RECOVERY', icon: '💫', count: abilities.filter(a => a.category === 'recovery').length },
    { id: 'automation', name: 'AUTOMATION', icon: '🎭', count: abilities.filter(a => a.category === 'automation').length },
    { id: 'video', name: 'VIDEO', icon: '🎬', count: abilities.filter(a => a.category === 'video').length },
    { id: 'forensic', name: 'FORENSIC', icon: '🔬', count: abilities.filter(a => a.category === 'forensic').length },
    { id: 'ethics', name: 'ETHICS', icon: '🎸', count: abilities.filter(a => a.category === 'ethics').length }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const filteredAbilities = selectedCategory === 'all'
    ? abilities
    : abilities.filter(a => a.category === selectedCategory);

  const getPowerLevelColor = (level) => {
    if (level >= 95) {return '#ff00ff';} // MAXIMUM PINK
    if (level >= 90) {return '#ff0066';} // HOT PINK
    if (level >= 85) {return '#ff3399';} // MEDIUM PINK
    return '#ff66cc'; // SOFT PINK
  };

  const getPowerLevelLabel = (level) => {
    if (level >= 95) {return 'LEGENDARY';}
    if (level >= 90) {return 'ULTIMATE';}
    if (level >= 85) {return 'SUPREME';}
    return 'ELITE';
  };

  return (
    <div className="neko-abilities-container">
      {/* 📺 NEKO TV HEADER */}
      <div className="neko-tv-header">
        <div className="tv-screen-border">
          <div className="tv-static-overlay"></div>
          <div className="tv-content">
            <h1 className="neko-title">
              {['🐾', '✨', '⚡', '💖'][animationFrame]} NEKO-ARC ABILITIES SHOWCASE {['💖', '⚡', '✨', '🐾'][animationFrame]}
            </h1>
            <p className="neko-subtitle">*purrs in MAXIMUM POWER* All abilities catalogued, nyaa~!</p>
            <div className="tv-scanlines"></div>
          </div>
        </div>
      </div>

      {/* 🎯 CATEGORY SELECTOR */}
      <div className="ability-categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span className="cat-name">{cat.name}</span>
            <span className="cat-count">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* ⚡ ABILITIES GRID */}
      <div className="abilities-grid">
        {filteredAbilities.map((ability, index) => (
          <div
            key={ability.id}
            className="ability-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* TV-style border effect */}
            <div className="card-tv-border">
              <div className="card-scanlines"></div>

              {/* Ability header */}
              <div className="ability-header">
                <div className="ability-icon">{ability.icon}</div>
                <div className="ability-title">
                  <h3>{ability.name}</h3>
                  <span className="ability-category-badge">{ability.category.toUpperCase()}</span>
                </div>
              </div>

              {/* Power level bar */}
              <div className="power-level-section">
                <div className="power-level-label">
                  <span>POWER LEVEL</span>
                  <span className="power-level-value" style={{ color: getPowerLevelColor(ability.powerLevel) }}>
                    {ability.powerLevel}/100 - {getPowerLevelLabel(ability.powerLevel)}
                  </span>
                </div>
                <div className="power-bar">
                  <div
                    className="power-bar-fill"
                    style={{
                      width: `${ability.powerLevel}%`,
                      background: `linear-gradient(90deg, ${getPowerLevelColor(ability.powerLevel)}, #fff)`
                    }}
                  >
                    <div className="power-bar-shine"></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="ability-description">{ability.description}</p>

              {/* Stats */}
              <div className="ability-stats">
                <div className="stat-item">
                  <span className="stat-label">COOLDOWN:</span>
                  <span className="stat-value">{ability.cooldown}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">RANGE:</span>
                  <span className="stat-value">{ability.range}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">EFFECT:</span>
                  <span className="stat-value">{ability.effect}</span>
                </div>
              </div>

              {/* Activation status */}
              <div className="ability-status">
                <span className="status-indicator active">● ONLINE</span>
                <span className="neko-nya">NYA~!</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 SUMMARY STATS */}
      <div className="abilities-summary">
        <div className="summary-card">
          <h3>⚡ TOTAL ABILITIES</h3>
          <div className="summary-value">{abilities.length}</div>
        </div>
        <div className="summary-card">
          <h3>💪 AVERAGE POWER</h3>
          <div className="summary-value">
            {Math.round(abilities.reduce((sum, a) => sum + a.powerLevel, 0) / abilities.length)}
          </div>
        </div>
        <div className="summary-card">
          <h3>🏆 LEGENDARY TIER</h3>
          <div className="summary-value">
            {abilities.filter(a => a.powerLevel >= 95).length}
          </div>
        </div>
        <div className="summary-card">
          <h3>🎯 CATEGORIES</h3>
          <div className="summary-value">
            {categories.length - 1}
          </div>
        </div>
      </div>

      {/* NEKO FOOTER */}
      <div className="neko-abilities-footer">
        <p>*swishes tail with pride* ALL SYSTEMS OPERATIONAL, DESU~! 🐾✨</p>
      </div>
    </div>
  );
};

export default NekoArcAbilities;
