// 🐾⚡ NEKO-ARC TESTS - DefenseStats Component ⚡🐾
import React from 'react';
import { render, screen } from '@testing-library/react';
import DefenseStats from './DefenseStats';

describe('DefenseStats Component', () => {
  const mockStats = {
    total_collections: 8,
    kawaii_level: 'MAXIMUM',
    collections: [
      'threat_actors',
      'suspicious_content_trap',
      'predator_detection_zone',
      'illegal_materials_monitor',
      'admin_secrets_decoy'
    ],
    status: 'FORTRESS MODE ACTIVE',
    timestamp: '2025-10-11T12:00:00.000Z'
  };

  describe('🎯 Rendering Tests', () => {
    it('renders loading state when stats is null', () => {
      render(<DefenseStats stats={null} />);

      expect(screen.getByText(/loading stats, nyaa~/i)).toBeInTheDocument();
    });

    it('renders loading state when stats is undefined', () => {
      render(<DefenseStats stats={undefined} />);

      expect(screen.getByText(/loading stats, nyaa~/i)).toBeInTheDocument();
    });

    it('renders stats when provided', () => {
      const { container } = render(<DefenseStats stats={mockStats} />);

      // 🐾 Check total collections - use container to be more specific
      const statValue = container.querySelector('.stat-card .stat-value');
      expect(statValue).toHaveTextContent('8');
      // 🐾 "Active Collections" appears twice, so use getAllByText
      const activeCollectionsElements = screen.getAllByText(/active collections/i);
      expect(activeCollectionsElements.length).toBeGreaterThanOrEqual(1);

      // 🐾 Check kawaii power (component says "Kawaii Power" not "Kawaii Level")
      expect(screen.getByText('MAXIMUM')).toBeInTheDocument();
      expect(screen.getByText(/kawaii power/i)).toBeInTheDocument();

      // Check status
      expect(screen.getByText(/fortress mode active/i)).toBeInTheDocument();
    });

    it('displays hardcoded honeypot traps value', () => {
      render(<DefenseStats stats={mockStats} />);

      // Hardcoded value in component is 5
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText(/honeypot traps/i)).toBeInTheDocument();
    });

    it('displays hardcoded threat detection status', () => {
      render(<DefenseStats stats={mockStats} />);

      // Hardcoded value in component is "ACTIVE"
      expect(screen.getByText('ACTIVE')).toBeInTheDocument();
      expect(screen.getByText(/threat detection/i)).toBeInTheDocument();
    });
  });

  describe('📚 Collections List', () => {
    it('maps collections array to list items', () => {
      render(<DefenseStats stats={mockStats} />);

      mockStats.collections.forEach(collection => {
        expect(screen.getByText(collection)).toBeInTheDocument();
      });
    });

    it('renders empty list when collections array is empty', () => {
      const emptyCollectionsStats = {
        ...mockStats,
        collections: []
      };

      const { container } = render(<DefenseStats stats={emptyCollectionsStats} />);

      // 🐾 When collections is empty, the collections-list div is not rendered at all
      const collectionsList = container.querySelector('.collections-list');
      expect(collectionsList).toBeNull();
    });

    it('handles collections with single item', () => {
      const singleCollectionStats = {
        ...mockStats,
        collections: ['single_collection']
      };

      render(<DefenseStats stats={singleCollectionStats} />);

      expect(screen.getByText('single_collection')).toBeInTheDocument();
    });
  });

  describe('📅 Timestamp Formatting', () => {
    it('formats timestamp with toLocaleString()', () => {
      render(<DefenseStats stats={mockStats} />);

      // Mock Date in setupTests.js creates consistent date
      const expectedDate = new Date('2025-10-11T12:00:00.000Z').toLocaleString();
      expect(screen.getByText(new RegExp(expectedDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
    });

    it('handles different timestamp formats', () => {
      const differentTimestampStats = {
        ...mockStats,
        timestamp: '2025-01-01T00:00:00.000Z'
      };

      render(<DefenseStats stats={differentTimestampStats} />);

      const expectedDate = new Date('2025-01-01T00:00:00.000Z').toLocaleString();
      expect(screen.getByText(new RegExp(expectedDate.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument();
    });
  });

  describe('🎨 Different Stats Values', () => {
    it('handles zero collections', () => {
      const zeroCollectionsStats = {
        ...mockStats,
        total_collections: 0
      };

      render(<DefenseStats stats={zeroCollectionsStats} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles large collection counts', () => {
      const largeCollectionsStats = {
        ...mockStats,
        total_collections: 9999
      };

      render(<DefenseStats stats={largeCollectionsStats} />);

      expect(screen.getByText('9999')).toBeInTheDocument();
    });

    it('handles different kawaii levels', () => {
      const differentKawaiiStats = {
        ...mockStats,
        kawaii_level: 'ULTRA MEGA MAXIMUM'
      };

      render(<DefenseStats stats={differentKawaiiStats} />);

      expect(screen.getByText('ULTRA MEGA MAXIMUM')).toBeInTheDocument();
    });

    it('handles different status messages', () => {
      const differentStatusStats = {
        ...mockStats,
        status: 'DEFENSE PROTOCOLS ENGAGED'
      };

      render(<DefenseStats stats={differentStatusStats} />);

      expect(screen.getByText(/defense protocols engaged/i)).toBeInTheDocument();
    });
  });
});

// *purrs in stats testing excellence* 😻
