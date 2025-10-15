// 🎬✨ NEKO VIDEO MAKER COMPONENT ✨🎬
import React, { useState } from 'react';
import '../styles/VideoMaker.css';

function VideoMaker() {
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [position, setPosition] = useState('bottom-right');
  const [outputName, setOutputName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
        <h2>🎬 NEKO VIDEO MAKER 🎬</h2>
        <p className="subtitle">Combine videos with image overlays - So easy, even a kid can do it! ✨</p>
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
      )}
    </div>
  );
}

export default VideoMaker;
