// 🎬✨ YOUTUBE VIDEO GENERATOR - Image + Audio → YouTube Ready! ✨🎬
import React, { useState } from 'react';
import '../styles/YouTubeVideoGenerator.css';

function YouTubeVideoGenerator() {
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [outputName, setOutputName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const audioFormats = ['M4A/AAC', 'FLAC', 'MP3', 'WAV', 'OGG'];
  const imageFormats = ['JPG', 'PNG', 'JPEG', 'WebP'];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setError(null);
    }
  };

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !audioFile) {
      setError('❌ Please select both image and audio files!');
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
    formData.append('image', imageFile);
    formData.append('audio', audioFile);
    formData.append('outputName', outputName);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_URL}/youtube-generator`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setImageFile(null);
        setAudioFile(null);
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
    setImageFile(null);
    setAudioFile(null);
    setOutputName('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="youtube-generator-container">
      <div className="youtube-generator-header">
        <h2>🎬 YOUTUBE VIDEO GENERATOR 🎬</h2>
        <p className="subtitle">Convert Image + Audio into YouTube-ready MP4 video! ✨</p>
        <div className="specs-banner">
          <span>📺 1080p HD</span>
          <span>🎵 AAC Audio</span>
          <span>⚡ H.264</span>
          <span>✅ 100% YouTube Compatible</span>
        </div>
      </div>

      {result && (
        <div className="success-banner">
          <h3>✅ SUCCESS! YouTube Video Created! ✅</h3>
          <div className="result-info">
            <p>📁 <strong>File:</strong> {result.outputFile}</p>
            <p>📦 <strong>Size:</strong> {result.fileSize}</p>
            <p>⏱️ <strong>Duration:</strong> {result.duration}</p>
            <p>📺 <strong>Resolution:</strong> {result.resolution || '1920x1080 (1080p)'}</p>
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

      <form onSubmit={handleSubmit} className="youtube-generator-form">
        <div className="form-section">
          <h3>🖼️ Step 1: Select Your Image File</h3>
          <p className="section-hint">This will be the static background/thumbnail for your video</p>
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
          <div className="format-support">
            <strong>Supported:</strong> {imageFormats.join(', ')}
          </div>
        </div>

        <div className="form-section">
          <h3>🎵 Step 2: Select Your Audio File</h3>
          <p className="section-hint">Any format works! (M4A/AAC is fastest)</p>
          <div className="file-input-container">
            <input
              type="file"
              id="audio-file"
              accept="audio/*"
              onChange={handleAudioChange}
              disabled={processing}
            />
            <label htmlFor="audio-file" className="file-label">
              {audioFile ? `✅ ${audioFile.name}` : '🎵 Choose Audio File...'}
            </label>
            {audioFile && (
              <div className="file-info">
                <span>Size: {(audioFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            )}
          </div>
          <div className="format-support">
            <strong>Supported:</strong> {audioFormats.join(', ')}
          </div>
        </div>

        <div className="form-section">
          <h3>💾 Step 3: Name Your Output File</h3>
          <input
            type="text"
            className="output-name-input"
            placeholder="e.g., confession-video or my-youtube-upload"
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
            disabled={processing || !imageFile || !audioFile || !outputName.trim()}
          >
            {processing ? '⏳ Creating YouTube Video...' : '✨ Create YouTube Video! ✨'}
          </button>
          {!processing && (imageFile || audioFile || outputName) && (
            <button type="button" className="reset-button" onClick={resetForm}>
              🔄 Reset Form
            </button>
          )}
        </div>
      </form>

      <div className="youtube-generator-info">
        <h3>💡 Perfect For:</h3>
        <ul>
          <li>🎯 Threat actor exposure videos (mugshot + confession audio)</li>
          <li>🛡️ Evidence documentation with narration</li>
          <li>📺 Podcast episodes with cover art</li>
          <li>🎬 Lyric videos with static background</li>
          <li>📖 Audiobook chapters with book cover</li>
          <li>🎓 Educational content with slides</li>
        </ul>

        <div className="technical-specs">
          <h3>📊 Technical Specifications:</h3>
          <div className="specs-grid">
            <div className="spec">
              <strong>Video Codec:</strong> H.264 (libx264)
            </div>
            <div className="spec">
              <strong>Audio Codec:</strong> AAC-LC
            </div>
            <div className="spec">
              <strong>Resolution:</strong> 1920x1080 (1080p)
            </div>
            <div className="spec">
              <strong>Frame Rate:</strong> 30 fps
            </div>
            <div className="spec">
              <strong>Pixel Format:</strong> yuv420p
            </div>
            <div className="spec">
              <strong>Aspect Ratio:</strong> 16:9 (YouTube standard)
            </div>
          </div>
        </div>

        <div className="pro-tips">
          <h3>💡 Pro Tips:</h3>
          <ul>
            <li>✅ M4A/AAC audio is fastest (no re-encoding needed)</li>
            <li>✅ Image will be centered with black bars if not 16:9</li>
            <li>✅ Video duration matches audio duration exactly</li>
            <li>✅ Output is 100% YouTube-compatible (no issues!)</li>
          </ul>
        </div>
      </div>

      {processing && (
        <div className="processing-overlay">
          <div className="processing-content">
            <div className="neko-spinner">🐾</div>
            <h3>⏳ Creating Your YouTube Video...</h3>
            <p>Converting your image + audio into YouTube format!</p>
            <p className="neko-message">*purrs while processing* NYA NYA NYA~! ✨</p>
            <div className="progress-steps">
              <div className="step">📸 Loading image...</div>
              <div className="step">🎵 Processing audio...</div>
              <div className="step">🎬 Encoding video...</div>
              <div className="step">✅ Finalizing...</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YouTubeVideoGenerator;
