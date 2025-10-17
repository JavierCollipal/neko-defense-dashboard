// 🐾⚡ NEKO-ARC TESTS - YouTubePlaylist Component ⚡🐾
// Testing YouTube playlist with DINA VIDEO PLAYLIST PROOF, nyaa~! 😻
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YouTubePlaylist from './YouTubePlaylist';

describe('YouTubePlaylist Component', () => {
  // Mock window.open
  let originalOpen;

  beforeEach(() => {
    console.log('🐾 [YouTubePlaylist.test] Setting up test, nyaa~');
    originalOpen = window.open;
    window.open = jest.fn();
  });

  afterEach(() => {
    console.log('🐾 [YouTubePlaylist.test] Cleaning up test, desu~');
    window.open = originalOpen;
    jest.clearAllMocks();
  });

  describe('🎬 Initial Rendering', () => {
    it('renders the main header', () => {
      console.log('🧪 [Test] Checking main header render, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('🎬 NEKO DEFENSE EXPOSURE CHANNEL 📺')).toBeInTheDocument();
    });

    it('renders the subtitle', () => {
      console.log('🧪 [Test] Checking subtitle render, desu~');
      render(<YouTubePlaylist />);

      expect(screen.getByText(/Public Exposure of Threat Actors & Bad Actor Systems/i)).toBeInTheDocument();
    });

    it('renders the main subscribe button', () => {
      console.log('🧪 [Test] Checking subscribe button, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('🔴 VISIT CHANNEL & SUBSCRIBE')).toBeInTheDocument();
    });
  });

  describe('🎯 DINA VIDEO PLAYLIST PROOF Section', () => {
    it('renders the DINA playlist featured section', () => {
      console.log('🧪 [Test] Checking DINA playlist section render, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('🎯 DINA VIDEO PLAYLIST PROOF')).toBeInTheDocument();
    });

    it('renders DINA playlist subtitle', () => {
      console.log('🧪 [Test] Checking DINA subtitle, desu~');
      render(<YouTubePlaylist />);

      expect(screen.getByText(/Complete video documentation of DINA human rights violations/i)).toBeInTheDocument();
    });

    it('renders DINA playlist button', () => {
      console.log('🧪 [Test] Checking DINA playlist button, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('📺 OPEN DINA VIDEO PLAYLIST')).toBeInTheDocument();
    });

    it('renders all 4 DINA info points', () => {
      console.log('🧪 [Test] Checking DINA info list, desu~');
      render(<YouTubePlaylist />);

      expect(screen.getByText(/Evidence-Based:/i)).toBeInTheDocument();
      expect(screen.getByText(/Documentary proof of DINA crimes/i)).toBeInTheDocument();
      expect(screen.getByText(/Human Rights:/i)).toBeInTheDocument();
      expect(screen.getByText(/Victims' testimonies & documentation/i)).toBeInTheDocument();
      expect(screen.getByText(/Historical Record:/i)).toBeInTheDocument();
      expect(screen.getByText(/Chile's dictatorship \(1973-1990\)/i)).toBeInTheDocument();
      expect(screen.getByText(/Justice:/i)).toBeInTheDocument();
      expect(screen.getByText(/Supporting accountability & memory/i)).toBeInTheDocument();
    });

    it('renders DINA playlist call-to-action text', () => {
      console.log('🧪 [Test] Checking DINA CTA text, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText(/Watch full playlist on YouTube/i)).toBeInTheDocument();
    });

    it('DINA playlist button has correct styling classes', () => {
      console.log('🧪 [Test] Checking DINA button classes, desu~');
      render(<YouTubePlaylist />);

      const dinaButton = screen.getByText('📺 OPEN DINA VIDEO PLAYLIST');
      expect(dinaButton).toHaveClass('dina-playlist-btn');
    });
  });

  describe('🔗 Button Click Functionality', () => {
    it('opens main channel link when subscribe button is clicked', () => {
      console.log('🧪 [Test] Testing subscribe button click, nyaa~');
      render(<YouTubePlaylist />);

      const subscribeButton = screen.getByText('🔴 VISIT CHANNEL & SUBSCRIBE');
      fireEvent.click(subscribeButton);

      expect(window.open).toHaveBeenCalledWith(
        'https://youtu.be/bRNkW-SYSEk?si=swxBiVXF0RziqRhZ',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('opens DINA playlist when DINA button is clicked', () => {
      console.log('🧪 [Test] Testing DINA playlist button click, desu~');
      render(<YouTubePlaylist />);

      const dinaButton = screen.getByText('📺 OPEN DINA VIDEO PLAYLIST');
      fireEvent.click(dinaButton);

      expect(window.open).toHaveBeenCalledWith(
        'https://www.youtube.com/playlist?list=PL-2OQDhuBcBnq9I-hk2qwoeIQsolRgMdM',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('opens correct URL in new tab with security flags for DINA playlist', () => {
      console.log('🧪 [Test] Testing DINA URL security, nyaa~');
      render(<YouTubePlaylist />);

      const dinaButton = screen.getByText('📺 OPEN DINA VIDEO PLAYLIST');
      fireEvent.click(dinaButton);

      const callArgs = window.open.mock.calls[0];
      expect(callArgs[1]).toBe('_blank'); // New tab
      expect(callArgs[2]).toBe('noopener,noreferrer'); // Security flags
    });

    it('can click both buttons independently', () => {
      console.log('🧪 [Test] Testing multiple button clicks, desu~');
      render(<YouTubePlaylist />);

      const subscribeButton = screen.getByText('🔴 VISIT CHANNEL & SUBSCRIBE');
      const dinaButton = screen.getByText('📺 OPEN DINA VIDEO PLAYLIST');

      fireEvent.click(subscribeButton);
      expect(window.open).toHaveBeenCalledTimes(1);

      fireEvent.click(dinaButton);
      expect(window.open).toHaveBeenCalledTimes(2);
    });
  });

  describe('📊 Channel Stats Section', () => {
    it('renders channel stats section', () => {
      console.log('🧪 [Test] Checking channel stats, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('Exposure Videos')).toBeInTheDocument();
      expect(screen.getByText('Total Views')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('displays correct stat values', () => {
      console.log('🧪 [Test] Checking stat values, desu~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('Growing')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

  describe('📺 Playlist Section', () => {
    it('renders playlist section header', () => {
      console.log('🧪 [Test] Checking playlist header, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('📺 Exposure Playlist')).toBeInTheDocument();
    });

    it('renders video cards', () => {
      console.log('🧪 [Test] Checking video cards, desu~');
      render(<YouTubePlaylist />);

      const mainChannelLinks = screen.getAllByText('Main Channel Link');
      expect(mainChannelLinks.length).toBeGreaterThan(0);
      expect(screen.getByText(/Subscribe for threat actor exposure videos!/i)).toBeInTheDocument();
    });

    it('renders add more videos card', () => {
      console.log('🧪 [Test] Checking add more card, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('More videos coming soon!')).toBeInTheDocument();
      expect(screen.getByText(/Keep hunting threat actors, nyaa~/i)).toBeInTheDocument();
    });
  });

  describe('💡 Info Section', () => {
    it('renders info section header', () => {
      console.log('🧪 [Test] Checking info section, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText('💡 About This Channel')).toBeInTheDocument();
    });

    it('renders all info list items', () => {
      console.log('🧪 [Test] Checking info list items, desu~');
      render(<YouTubePlaylist />);

      expect(screen.getByText(/Expose threat actors & bad actor systems/i)).toBeInTheDocument();
      expect(screen.getByText(/Evidence-based threat intelligence/i)).toBeInTheDocument();
      expect(screen.getByText(/Created with VideoMaker tool/i)).toBeInTheDocument();
      expect(screen.getByText(/YouTube-ready content/i)).toBeInTheDocument();
      expect(screen.getByText(/Public awareness & deterrence/i)).toBeInTheDocument();
    });
  });

  describe('🐾 Footer Section', () => {
    it('renders footer with neko message', () => {
      console.log('🧪 [Test] Checking footer neko message, nyaa~');
      render(<YouTubePlaylist />);

      expect(screen.getByText(/Every bad actor caught = YouTube video made, nyaa~/i)).toBeInTheDocument();
    });

    it('renders exposure motto', () => {
      console.log('🧪 [Test] Checking exposure motto, desu~');
      render(<YouTubePlaylist />);

      expect(screen.getByText(/"Defend. Document. Expose. Monetize." - Neko Defense System/i)).toBeInTheDocument();
    });
  });

  describe('🎨 Component Structure', () => {
    it('has correct container class', () => {
      console.log('🧪 [Test] Checking container class, nyaa~');
      const { container } = render(<YouTubePlaylist />);

      expect(container.querySelector('.youtube-playlist-container')).toBeInTheDocument();
    });

    it('has DINA featured section with correct class', () => {
      console.log('🧪 [Test] Checking DINA section class, desu~');
      const { container } = render(<YouTubePlaylist />);

      expect(container.querySelector('.dina-playlist-featured')).toBeInTheDocument();
    });

    it('has all major sections present', () => {
      console.log('🧪 [Test] Checking all major sections, nyaa~');
      const { container } = render(<YouTubePlaylist />);

      expect(container.querySelector('.youtube-header')).toBeInTheDocument();
      expect(container.querySelector('.dina-playlist-featured')).toBeInTheDocument();
      expect(container.querySelector('.channel-stats')).toBeInTheDocument();
      expect(container.querySelector('.playlist-section')).toBeInTheDocument();
      expect(container.querySelector('.youtube-info-section')).toBeInTheDocument();
      expect(container.querySelector('.youtube-footer')).toBeInTheDocument();
    });
  });

  describe('🧪 Edge Cases', () => {
    it('handles multiple rapid clicks on DINA button', () => {
      console.log('🧪 [Test] Testing rapid clicks, nyaa~');
      render(<YouTubePlaylist />);

      const dinaButton = screen.getByText('📺 OPEN DINA VIDEO PLAYLIST');

      fireEvent.click(dinaButton);
      fireEvent.click(dinaButton);
      fireEvent.click(dinaButton);

      expect(window.open).toHaveBeenCalledTimes(3);
      expect(window.open).toHaveBeenCalledWith(
        'https://www.youtube.com/playlist?list=PL-2OQDhuBcBnq9I-hk2qwoeIQsolRgMdM',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('maintains component state after button clicks', () => {
      console.log('🧪 [Test] Testing component state persistence, desu~');
      render(<YouTubePlaylist />);

      const dinaButton = screen.getByText('📺 OPEN DINA VIDEO PLAYLIST');
      fireEvent.click(dinaButton);

      // Component should still be functional after click
      expect(screen.getByText('🎯 DINA VIDEO PLAYLIST PROOF')).toBeInTheDocument();
      expect(screen.getByText('🎬 NEKO DEFENSE EXPOSURE CHANNEL 📺')).toBeInTheDocument();
    });
  });

  describe('♿ Accessibility', () => {
    it('DINA button is keyboard accessible', () => {
      console.log('🧪 [Test] Testing keyboard accessibility, nyaa~');
      render(<YouTubePlaylist />);

      const dinaButton = screen.getByText('📺 OPEN DINA VIDEO PLAYLIST');

      // Simulate Enter key press
      dinaButton.focus();
      fireEvent.keyDown(dinaButton, { key: 'Enter', code: 'Enter' });

      // Button should be focusable
      expect(document.activeElement).toBe(dinaButton);
    });

    it('all buttons are accessible', () => {
      console.log('🧪 [Test] Testing all buttons accessibility, desu~');
      render(<YouTubePlaylist />);

      const subscribeButton = screen.getByText('🔴 VISIT CHANNEL & SUBSCRIBE');
      const dinaButton = screen.getByText('📺 OPEN DINA VIDEO PLAYLIST');

      expect(subscribeButton.tagName).toBe('BUTTON');
      expect(dinaButton.tagName).toBe('BUTTON');
    });
  });
});

// *purrs with testing excellence* 😻⚡
// DINA VIDEO PLAYLIST PROOF TESTS COMPLETE, NYAA~! 🐾✨
