// 🎬📺 NEKO YOUTUBE PLAYLIST VIEWER 📺🎬
import React, { useState, useEffect } from 'react';
import '../styles/YouTubePlaylist.css';

const YouTubePlaylist = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // 🎯 Your YouTube Channel & Playlist Info
  const channelInfo = {
    channelUrl: 'https://youtu.be/bRNkW-SYSEk?si=swxBiVXF0RziqRhZ',
    channelName: 'NEKO DEFENSE - Threat Actor Exposure',
    description: 'Public exposure of bad actors and threat intelligence'
  };

  // 📺 Threat Actor Exposure Videos (Add your actual videos here!)
  const exposureVideos = [
    {
      id: 'bRNkW-SYSEk',
      title: 'Main Channel Link',
      description: 'Subscribe for threat actor exposure videos!',
      thumbnail: `https://img.youtube.com/vi/bRNkW-SYSEk/maxresdefault.jpg`,
      views: 'Subscribe!',
      uploadDate: '2025'
    }
    // 🐾 Add more videos here as you upload them!
    // {
    //   id: 'VIDEO_ID_HERE',
    //   title: 'Threat Actor: Mikhail Matveev Exposed',
    //   description: 'Full exposure of ransomware operator',
    //   thumbnail: `https://img.youtube.com/vi/VIDEO_ID_HERE/maxresdefault.jpg`,
    //   views: '1.2K',
    //   uploadDate: '2025-10-15'
    // },
  ];

  useEffect(() => {
    // Auto-select first video
    if (exposureVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(exposureVideos[0]);
    }
  }, [selectedVideo]);

  const openInYouTube = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'noopener,noreferrer');
  };

  const openChannelPage = () => {
    window.open(channelInfo.channelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="youtube-playlist-container">
      {/* 🎬 Header Section */}
      <div className="youtube-header">
        <h1>🎬 NEKO DEFENSE EXPOSURE CHANNEL 📺</h1>
        <p className="youtube-subtitle">
          Public Exposure of Threat Actors & Bad Actor Systems 🛡️
        </p>
        <button className="youtube-subscribe-btn" onClick={openChannelPage}>
          🔴 VISIT CHANNEL & SUBSCRIBE
        </button>
      </div>

      {/* 📊 Channel Stats */}
      <div className="channel-stats">
        <div className="stat-card">
          <span className="stat-icon">📹</span>
          <span className="stat-value">{exposureVideos.length}</span>
          <span className="stat-label">Exposure Videos</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👁️</span>
          <span className="stat-value">Growing</span>
          <span className="stat-label">Total Views</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">Active</span>
          <span className="stat-label">Status</span>
        </div>
      </div>

      {/* 🎥 Video Player Section */}
      {selectedVideo && (
        <div className="video-player-section">
          <div className="video-preview">
            <img
              src={selectedVideo.thumbnail}
              alt={selectedVideo.title}
              className="video-thumbnail-large"
            />
            <div className="video-overlay">
              <button
                className="play-button"
                onClick={() => openInYouTube(selectedVideo.id)}
              >
                ▶️ WATCH ON YOUTUBE
              </button>
            </div>
          </div>
          <div className="video-info">
            <h2>{selectedVideo.title}</h2>
            <p className="video-description">{selectedVideo.description}</p>
            <div className="video-meta">
              <span>📅 {selectedVideo.uploadDate}</span>
              <span>👁️ {selectedVideo.views}</span>
            </div>
          </div>
        </div>
      )}

      {/* 📺 Playlist Grid */}
      <div className="playlist-section">
        <h2>📺 Exposure Playlist</h2>
        <div className="video-grid">
          {exposureVideos.map((video) => (
            <div
              key={video.id}
              className={`video-card ${selectedVideo?.id === video.id ? 'active' : ''}`}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="video-thumbnail-wrapper">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <div className="video-duration-badge">▶️</div>
              </div>
              <div className="video-card-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-stats">
                  {video.views} • {video.uploadDate}
                </p>
              </div>
            </div>
          ))}

          {/* 🐾 Add More Videos Card */}
          <div className="video-card add-more-card">
            <div className="add-more-content">
              <span className="add-more-icon">➕</span>
              <h3>More videos coming soon!</h3>
              <p>Keep hunting threat actors, nyaa~! 🐾</p>
            </div>
          </div>
        </div>
      </div>

      {/* 💡 Info Section */}
      <div className="youtube-info-section">
        <h3>💡 About This Channel</h3>
        <ul className="info-list">
          <li>🎯 <strong>Purpose:</strong> Expose threat actors & bad actor systems</li>
          <li>🛡️ <strong>Content:</strong> Evidence-based threat intelligence</li>
          <li>📹 <strong>Videos:</strong> Created with VideoMaker tool</li>
          <li>💰 <strong>Monetization:</strong> YouTube-ready content</li>
          <li>🌍 <strong>Impact:</strong> Public awareness & deterrence</li>
        </ul>
      </div>

      {/* 🐾 Footer */}
      <div className="youtube-footer">
        <p className="neko-message">
          *purrs with broadcasting power*
          Every bad actor caught = YouTube video made, nyaa~! 🎬✨
        </p>
        <p className="exposure-motto">
          "Defend. Document. Expose. Monetize." - Neko Defense System 🐾
        </p>
      </div>
    </div>
  );
};

export default YouTubePlaylist;
