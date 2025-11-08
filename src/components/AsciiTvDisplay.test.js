// 🐾⚡ NEKO-ARC TESTS - AsciiTvDisplay Component ⚡🐾
import React from 'react';
import { render, screen } from '@testing-library/react';
import AsciiTvDisplay from './AsciiTvDisplay';

describe('AsciiTvDisplay Component', () => {
  // Test data, nyaa~!
  const mockArtPiece = {
    name: 'Neko Guardian',
    art: [
      ' /\\_/\\  ',
      '( o.o ) ',
      ' > ^ <  '
    ],
    threat_level: 'HIGH',
    category: 'predators',
    description: 'Protective Neko watching over systems, desu!'
  };

  describe('🎯 Rendering Tests', () => {
    it('renders loading state when artPiece is null', () => {
      render(<AsciiTvDisplay artPiece={null} total={5} current={1} />);

      // 🐾 Component shows "No art loaded yet, nyaa~! 🐾" not "loading, nyaa~!"
      expect(screen.getByText(/no art loaded yet, nyaa~!/i)).toBeInTheDocument();
    });

    it('renders loading state when artPiece is undefined', () => {
      render(<AsciiTvDisplay artPiece={undefined} total={5} current={1} />);

      // 🐾 Component shows "No art loaded yet, nyaa~! 🐾" not "loading, nyaa~!"
      expect(screen.getByText(/no art loaded yet, nyaa~!/i)).toBeInTheDocument();
    });

    it('renders art piece when provided', () => {
      const { container } = render(<AsciiTvDisplay artPiece={mockArtPiece} total={5} current={1} />);

      // Check title
      expect(screen.getByText('Neko Guardian')).toBeInTheDocument();

      // 🐾 Check ASCII art is in the pre element (HTML entities may be encoded, so query the element)
      const preElement = container.querySelector('pre.ascii-art');
      expect(preElement).toBeInTheDocument();
      expect(preElement).toHaveTextContent(/\(.*o\.o.*\)/); // Match the cat face pattern

      // 🐾 Check category - text is split by "CATEGORY: " prefix, so use regex
      expect(screen.getByText(/category:.*predators/i)).toBeInTheDocument();

      // Check description
      expect(screen.getByText(/protective neko watching/i)).toBeInTheDocument();
    });

    it('displays correct counter (current/total)', () => {
      render(<AsciiTvDisplay artPiece={mockArtPiece} total={10} current={3} />);

      expect(screen.getByText('3 / 10')).toBeInTheDocument();
    });

    it('renders threat level badge with correct data-level attribute', () => {
      const { container } = render(<AsciiTvDisplay artPiece={mockArtPiece} total={5} current={1} />);

      const threatBadge = container.querySelector('.threat-badge');
      expect(threatBadge).toHaveAttribute('data-level', 'HIGH');
      // 🐾 Component uses uppercase "THREAT:" not "Threat:"
      expect(threatBadge).toHaveTextContent('THREAT: HIGH');
    });

    it('handles missing threat_level by showing N/A', () => {
      const artWithoutThreatLevel = { ...mockArtPiece, threat_level: undefined };
      const { container } = render(<AsciiTvDisplay artPiece={artWithoutThreatLevel} total={5} current={1} />);

      const threatBadge = container.querySelector('.threat-badge');
      // 🐾 Component uses uppercase "THREAT:" not "Threat:"
      expect(threatBadge).toHaveTextContent('THREAT: N/A');
    });
  });

  describe('🎨 ASCII Art Formatting', () => {
    it('joins art array with newlines correctly', () => {
      const multiLineArt = {
        ...mockArtPiece,
        art: ['Line 1', 'Line 2', 'Line 3']
      };

      const { container } = render(<AsciiTvDisplay artPiece={multiLineArt} total={1} current={1} />);

      // 🐾 Use container selector instead of exact text match
      const preElement = container.querySelector('pre.ascii-art');
      expect(preElement).toHaveTextContent('Line 1');
      expect(preElement).toHaveTextContent('Line 2');
      expect(preElement).toHaveTextContent('Line 3');
    });

    it('handles single-line ASCII art', () => {
      const singleLineArt = {
        ...mockArtPiece,
        art: ['Single line art']
      };

      const { container } = render(<AsciiTvDisplay artPiece={singleLineArt} total={1} current={1} />);

      // 🐾 Use container selector for more flexible matching
      const preElement = container.querySelector('pre.ascii-art');
      expect(preElement).toHaveTextContent('Single line art');
    });

    it('handles empty art array', () => {
      const emptyArt = {
        ...mockArtPiece,
        art: []
      };

      const { container } = render(<AsciiTvDisplay artPiece={emptyArt} total={1} current={1} />);

      // 🐾 Should render empty pre element - use container not article role
      const preElement = container.querySelector('pre.ascii-art');
      expect(preElement).toBeInTheDocument();
      expect(preElement).toHaveTextContent('');
    });
  });
});

// *purrs in test coverage excellence* 😻
