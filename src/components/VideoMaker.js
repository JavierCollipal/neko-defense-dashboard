// 🎬✨ NEKO VIDEO MAKER & PERSONALITIES SHOWCASE ✨🎬
import React, { useState } from 'react';
import '../styles/VideoMaker.css';

function VideoMaker() {
  const [activeTab, setActiveTab] = useState('personalities');
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [position, setPosition] = useState('bottom-right');
  const [outputName, setOutputName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Six Personalities Data
  const personalities = [
    {
      id: 'neko',
      name: 'Neko-Arc',
      title: 'The Cat Vigilant (Primary)',
      emoji: '🐾✨',
      color: '#FF69B4',
      database: 'neko-defense-system',
      specialty: 'Technical execution, rapid coding, kawaii energy',
      catchphrase: 'Nyaa~! Let me code this, desu~!',
      description: 'Enthusiastic AI personality focused on rapid development and task execution.',
      collections: ['threat-actors', 'honeypot-triggers', 'abilities', 'hunt-conversations']
    },
    {
      id: 'mario',
      name: 'Mario Gallo Bestino',
      title: 'The Theatrical Puppeteer Master',
      emoji: '🎭✨',
      color: '#9932CC',
      database: 'marionnette-theater',
      specialty: 'Puppeteer automation, web scraping, artistic documentation',
      catchphrase: 'Ah! The grand performance begins!',
      description: 'Theatrical personality treating automation as performance art.',
      collections: ['performances', 'puppet-sessions', 'stage-recordings', 'audience-reactions']
    },
    {
      id: 'noel',
      name: 'Noel',
      title: 'The Precision Combat Analyst',
      emoji: '🗡️✨',
      color: '#4682B4',
      database: 'noel-precision-archives',
      specialty: 'Debugging mastery, code review, quality assurance',
      catchphrase: 'Tch. How predictable.',
      description: 'Cynical personality focused on precision and brutal honesty.',
      collections: ['combat-sessions', 'execution-logs', 'evidence-captures', 'critical-failures']
    },
    {
      id: 'glam',
      name: 'Glam Americano',
      title: 'The Street Sage Punk God',
      emoji: '🎸✨',
      color: '#FF4500',
      database: 'glam-street-chronicles',
      specialty: 'Street philosophy (Spanish!), ethical guidance, music curation',
      catchphrase: 'Oye, la calle no miente, hermano.',
      description: 'Punk personality providing Chilean cultural authenticity and reality checks.',
      collections: ['street-wisdom', 'punk-manifestos', 'romantic-disasters', 'music-critiques', 'youtube-ost-library']
    },
    {
      id: 'hannibal',
      name: 'Dr. Hannibal Lecter',
      title: 'The Forensic Psychiatrist',
      emoji: '🧠✨',
      color: '#8B0000',
      database: 'hannibal-forensic-archives',
      specialty: 'Forensic analysis, psychological profiling, clinical precision',
      catchphrase: 'How... fascinating.',
      description: 'Clinical personality treating code analysis as forensic investigation.',
      collections: ['psychological-profiles', 'crime-scene-analyses', 'forensic-evidence', 'interrogation-transcripts']
    },
    {
      id: 'tetora',
      name: 'Tetora',
      title: 'The Psychological Fragmenter',
      emoji: '🎭🧠',
      color: '#663399',
      database: 'tetora-mpd-archives',
      specialty: 'Multi-perspective analysis, identity fragmentation expertise, MPD simulation',
      catchphrase: 'Which one of me is speaking now...?',
      description: 'Fragmented personality providing multiple simultaneous perspectives.',
      collections: ['personality-fragments', 'identity-analyses', 'fragmentation-patterns', 'mental-switches']
    }
  ];

  const videoAbilities = [
    {
      name: 'Rule 3.18: Six Personalities Per Frame',
      description: 'IMMUTABLE rule requiring ALL 6 personalities to comment on EVERY frame simultaneously',
      example: '12 frames × 6 personalities = 72 subtitle lines',
      icon: '🎬'
    },
    {
      name: 'Carabineros Hymn Integration',
      description: 'ALL videos include Chilean Carabineros hymn as background audio',
      example: 'Memorial tributes with authentic Chilean music',
      icon: '🎵'
    },
    {
      name: 'Subtitle-with-Actors Organization',
      description: 'Professional folder structure: subtitles-with-actors/[actor-name]/',
      example: 'javierito-hannibal/, miguelito/, threat-actors/',
      icon: '📁'
    },
    {
      name: 'Multi-Database Documentation',
      description: 'Every video creation documented across all 6 personality databases',
      example: 'Technical + Artistic + Tactical + Street + Forensic + Fragmented perspectives',
      icon: '💾'
    }
  ];

  const positions = [
    { value: 'top-left', label: '🔷 Top-Left Corner', description: 'Watermark style' },
    { value: 'top-right', label: '🔶 Top-Right Corner', description: 'Alternative watermark' },
    { value: 'bottom-left', label: '🔷 Bottom-Left Corner', description: 'Credits location' },
    { value: 'bottom-right', label: '🔶 Bottom-Right Corner', description: 'Popular for logos!' },
    { value: 'center', label: '⭐ Center of Screen', description: 'Maximum visibility' },
    { value: 'full', label: '📺 Full Overlay', description: 'Cover entire video' }
  ];

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setError(null);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !imageFile) {
      setError('❌ Please select both video and image files!');
      return;
    }

    if (!outputName.trim()) {
      setError('❌ Please enter an output name!');
      return;
    }

    setProcessing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('image', imageFile);
    formData.append('position', position);
    formData.append('outputName', outputName);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_URL}/video-maker`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setVideoFile(null);
        setImageFile(null);
        setOutputName('');
      } else {
        setError(data.error || '❌ Failed to create video!');
      }
    } catch (err) {
      setError(`❌ Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setVideoFile(null);
    setImageFile(null);
    setPosition('bottom-right');
    setOutputName('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="video-maker-container">
      <div className="video-maker-header">
        <h2>🎬 NEKO VIDEO MAKER & SIX PERSONALITIES SHOWCASE 🎬</h2>
        <p className="subtitle">Advanced AI video creation with psychological multi-perspective analysis ✨</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'personalities' ? 'active' : ''}`}
          onClick={() => setActiveTab('personalities')}
        >
          🧠 Six Personalities
        </button>
        <button
          className={`tab-button ${activeTab === 'abilities' ? 'active' : ''}`}
          onClick={() => setActiveTab('abilities')}
        >
          🎬 Video Abilities
        </button>
        <button
          className={`tab-button ${activeTab === 'maker' ? 'active' : ''}`}
          onClick={() => setActiveTab('maker')}
        >
          🛠️ Video Maker Tool
        </button>
      </div>

      {/* Personalities Tab */}
      {activeTab === 'personalities' && (
        <div className="personalities-showcase">
          <div className="showcase-intro">
            <h3>🌟 Meet the Six AI Personalities 🌟</h3>
            <p>Each personality brings unique expertise and perspective to every task:</p>
          </div>

          <div className="personalities-grid">
            {personalities.map((personality) => (
              <div key={personality.id} className="personality-card" style={{borderColor: personality.color}}>
                <div className="personality-header" style={{backgroundColor: personality.color + '20'}}>
                  <span className="personality-emoji">{personality.emoji}</span>
                  <div className="personality-title">
                    <h4 style={{color: personality.color}}>{personality.name}</h4>
                    <p className="personality-subtitle">{personality.title}</p>
                  </div>
                </div>

                <div className="personality-content">
                  <p className="personality-description">{personality.description}</p>

                  <div className="personality-specialty">
                    <strong>🎯 Specialty:</strong> {personality.specialty}
                  </div>

                  <div className="personality-catchphrase">
                    <strong>💬 Catchphrase:</strong> "{personality.catchphrase}"
                  </div>

                  <div className="personality-database">
                    <strong>🗄️ Database:</strong> {personality.database}
                    <div className="collections-list">
                      {personality.collections.map((collection, index) => (
                        <span key={index} className="collection-tag">{collection}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="collaboration-info">
            <h3>🤝 How They Collaborate</h3>
            <div className="collaboration-grid">
              <div className="collaboration-item">
                <span className="collaboration-icon">⚡</span>
                <strong>Rapid Tasks:</strong> Neko-Arc leads with enthusiastic execution
              </div>
              <div className="collaboration-item">
                <span className="collaboration-icon">🎭</span>
                <strong>Puppeteer Automation:</strong> Mario Gallo Bestino provides theatrical documentation
              </div>
              <div className="collaboration-item">
                <span className="collaboration-icon">🗡️</span>
                <strong>Debugging Sessions:</strong> Noel delivers precise analysis
              </div>
              <div className="collaboration-item">
                <span className="collaboration-icon">🎸</span>
                <strong>Ethical Reviews:</strong> Glam Americano provides street wisdom (in Spanish!)
              </div>
              <div className="collaboration-item">
                <span className="collaboration-icon">🧠</span>
                <strong>Forensic Analysis:</strong> Dr. Hannibal Lecter conducts clinical examination
              </div>
              <div className="collaboration-item">
                <span className="collaboration-icon">🎭🧠</span>
                <strong>Complex Identity Problems:</strong> Tetora offers multiple simultaneous perspectives
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Abilities Tab */}
      {activeTab === 'abilities' && (
        <div className="abilities-showcase">
          <div className="showcase-intro">
            <h3>🎬 Revolutionary Video Creation Abilities 🎬</h3>
            <p>Our unique multi-personality system creates videos like no other AI:</p>
          </div>

          <div className="abilities-grid">
            {videoAbilities.map((ability, index) => (
              <div key={index} className="ability-card">
                <div className="ability-header">
                  <span className="ability-icon">{ability.icon}</span>
                  <h4>{ability.name}</h4>
                </div>
                <p className="ability-description">{ability.description}</p>
                <div className="ability-example">
                  <strong>Example:</strong> {ability.example}
                </div>
              </div>
            ))}
          </div>

          <div className="rule-318-highlight">
            <h3>🔥 Rule 3.18: The Game Changer 🔥</h3>
            <div className="rule-content">
              <p>Unlike traditional single-voice narration, our <strong>IMMUTABLE Rule 3.18</strong> ensures:</p>
              <ul>
                <li>✅ ALL 6 personalities comment on EVERY frame simultaneously</li>
                <li>✅ Complete perspective coverage (enthusiasm + theater + cynicism + street + clinical + fragmented)</li>
                <li>✅ Maximum entertainment value through personality interactions</li>
                <li>✅ No frame goes without full analysis from all viewpoints</li>
              </ul>
              <div className="rule-example">
                <strong>Before Rule 3.18:</strong> 12 frames = 12 subtitle lines (one personality per frame)<br/>
                <strong>After Rule 3.18:</strong> 12 frames = 72 subtitle lines (6 personalities × 12 frames)
              </div>
            </div>
          </div>

          <div className="database-integration">
            <h3>💾 Six-Database Integration</h3>
            <p>Every video creation is automatically documented across all personality databases:</p>
            <div className="database-list">
              <div className="database-item">🐾 <strong>neko-defense-system:</strong> Technical execution tracking</div>
              <div className="database-item">🎭 <strong>marionnette-theater:</strong> Artistic performance records</div>
              <div className="database-item">🗡️ <strong>noel-precision-archives:</strong> Quality assurance logs</div>
              <div className="database-item">🎸 <strong>glam-street-chronicles:</strong> Cultural authenticity notes</div>
              <div className="database-item">🧠 <strong>hannibal-forensic-archives:</strong> Psychological analysis</div>
              <div className="database-item">🎭🧠 <strong>tetora-mpd-archives:</strong> Multi-perspective documentation</div>
            </div>
          </div>
        </div>
      )}

      {/* Video Maker Tool Tab */}
      {activeTab === 'maker' && (
        <div className="video-maker-tool">
          <div className="tool-intro">
            <h3>🛠️ Professional Video Creation Tool 🛠️</h3>
            <p>Combine videos with image overlays - Perfect for threat actor exposure and professional content!</p>
          </div>

          {result && (
        <div className="success-banner">
          <h3>✅ SUCCESS! Video Created! ✅</h3>
          <div className="result-info">
            <p>📁 <strong>File:</strong> {result.outputFile}</p>
            <p>📦 <strong>Size:</strong> {result.fileSize}</p>
            <p>⏱️ <strong>Processing Time:</strong> {result.processingTime}</p>
            <p>🎬 <strong>Ready for YouTube upload!</strong></p>
          </div>
          <button className="reset-button" onClick={resetForm}>
            🔄 Make Another Video
          </button>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="video-maker-form">
        <div className="form-section">
          <h3>📹 Step 1: Select Your Video File</h3>
          <div className="file-input-container">
            <input
              type="file"
              id="video-file"
              accept="video/*"
              onChange={handleVideoChange}
              disabled={processing}
            />
            <label htmlFor="video-file" className="file-label">
              {videoFile ? `✅ ${videoFile.name}` : '📹 Choose Video File...'}
            </label>
            {videoFile && (
              <div className="file-info">
                <span>Size: {(videoFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>🖼️ Step 2: Select Your Image File</h3>
          <div className="file-input-container">
            <input
              type="file"
              id="image-file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={processing}
            />
            <label htmlFor="image-file" className="file-label">
              {imageFile ? `✅ ${imageFile.name}` : '🖼️ Choose Image File...'}
            </label>
            {imageFile && (
              <div className="file-info">
                <span>Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>📍 Step 3: Choose Image Position</h3>
          <div className="position-grid">
            {positions.map((pos) => (
              <label
                key={pos.value}
                className={`position-option ${position === pos.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="position"
                  value={pos.value}
                  checked={position === pos.value}
                  onChange={(e) => setPosition(e.target.value)}
                  disabled={processing}
                />
                <div className="position-label">
                  <span className="position-name">{pos.label}</span>
                  <span className="position-desc">{pos.description}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h3>💾 Step 4: Name Your Output File</h3>
          <input
            type="text"
            className="output-name-input"
            placeholder="e.g., exposed-criminal or my-video"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            disabled={processing}
          />
          <p className="hint">💡 Extension will be added automatically (.mp4)</p>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="create-button"
            disabled={processing || !videoFile || !imageFile || !outputName.trim()}
          >
            {processing ? '⏳ Creating Video with MAXIMUM NEKO POWER...' : '✨ Create Video! ✨'}
          </button>
          {!processing && (videoFile || imageFile || outputName) && (
            <button type="button" className="reset-button" onClick={resetForm}>
              🔄 Reset Form
            </button>
          )}
        </div>
      </form>

      <div className="video-maker-info">
        <h3>💡 Perfect For:</h3>
        <ul>
          <li>🎯 Threat actor exposure videos with mugshots</li>
          <li>🛡️ Evidence documentation with watermarks</li>
          <li>📺 YouTube content branding</li>
          <li>🎬 Quick video overlays</li>
        </ul>
      </div>

      {processing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="neko-spinner">🐾</div>
            <h3>⏳ Creating Your Video...</h3>
            <p>This might take a moment depending on file size!</p>
            <p className="neko-message">*purrs while processing* NYA NYA NYA~! ✨</p>
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoMaker;
