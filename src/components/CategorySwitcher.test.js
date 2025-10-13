// 🐾⚡ NEKO-ARC TESTS - CategorySwitcher Component ⚡🐾
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategorySwitcher from './CategorySwitcher';

describe('CategorySwitcher Component', () => {
  const mockOnCategoryChange = jest.fn();
  const mockThreatCounts = {
    all: 10,
    predators: 3,
    pedophiles: 5,
    dina_network: 2,
    ransomware: 1,
    state_sponsored: 1,
    crypto_crime: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('🎯 Rendering Tests', () => {
    it('renders all 7 categories', () => {
      render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      expect(screen.getByText('All Threats')).toBeInTheDocument();
      expect(screen.getByText('Predators')).toBeInTheDocument();
      expect(screen.getByText('Pedophiles')).toBeInTheDocument();
      expect(screen.getByText('DINA Network')).toBeInTheDocument();
      expect(screen.getByText('Ransomware')).toBeInTheDocument();
      expect(screen.getByText('State Sponsored')).toBeInTheDocument();
      expect(screen.getByText('Crypto Crime')).toBeInTheDocument();
    });

    it('displays threat counts for all categories', () => {
      render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      // Component shows "X detected" format, not just the number
      expect(screen.getByText(/10.*detected/i)).toBeInTheDocument(); // all
      expect(screen.getByText(/3.*detected/i)).toBeInTheDocument(); // predators
      expect(screen.getByText(/5.*detected/i)).toBeInTheDocument(); // pedophiles
      expect(screen.getByText(/2.*detected/i)).toBeInTheDocument(); // dina_network
      // Check for "1 detected" appearing multiple times
      const oneDetectedElements = screen.getAllByText(/1.*detected/i);
      expect(oneDetectedElements.length).toBeGreaterThanOrEqual(3);
    });

    it('handles missing threat counts by defaulting to 0', () => {
      render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={{}}
        />
      );

      // Should display "0 detected" for all categories when counts are missing
      const zeroDetected = screen.getAllByText(/0.*detected/i);
      expect(zeroDetected.length).toBe(7); // All 7 categories show "0 detected"
    });

    it('highlights active category with "active" class', () => {
      const { container } = render(
        <CategorySwitcher
          activeCategory="predators"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      // 🐾 Component uses <div> not <button>, so we need to find the div.category-item
      const predatorsItem = screen.getByText('Predators').closest('.category-item');
      expect(predatorsItem).toHaveClass('active');
    });
  });

  describe('🎮 Event Handler Tests', () => {
    it('calls onCategoryChange with correct ID when category is clicked', () => {
      render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      fireEvent.click(screen.getByText('Predators'));

      expect(mockOnCategoryChange).toHaveBeenCalledTimes(1);
      expect(mockOnCategoryChange).toHaveBeenCalledWith('predators');
    });

    it('calls onCategoryChange for all categories', () => {
      render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      const categories = [
        { name: 'All Threats', id: 'all' },
        { name: 'Predators', id: 'predators' },
        { name: 'Pedophiles', id: 'pedophiles' },
        { name: 'DINA Network', id: 'dina_network' },
        { name: 'Ransomware', id: 'ransomware' },
        { name: 'State Sponsored', id: 'state_sponsored' },
        { name: 'Crypto Crime', id: 'crypto_crime' }
      ];

      categories.forEach((category, index) => {
        fireEvent.click(screen.getByText(category.name));
        expect(mockOnCategoryChange).toHaveBeenCalledWith(category.id);
        expect(mockOnCategoryChange).toHaveBeenCalledTimes(index + 1);
      });
    });
  });

  describe('🚨 Priority Categories', () => {
    it('shows priority badge for priority categories', () => {
      render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      expect(screen.getByText('CRITICAL')).toBeInTheDocument(); // predators
      expect(screen.getByText('MAXIMUM ALERT')).toBeInTheDocument(); // pedophiles
      expect(screen.getByText('HIGH')).toBeInTheDocument(); // dina_network
    });

    it('applies "priority" class to priority categories', () => {
      const { container } = render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      // 🐾 Component uses <div> not <button>, so we need to find div.category-item
      const predatorsItem = screen.getByText('Predators').closest('.category-item');
      expect(predatorsItem).toHaveClass('priority');

      const pedophilesItem = screen.getByText('Pedophiles').closest('.category-item');
      expect(pedophilesItem).toHaveClass('priority');

      const dinaItem = screen.getByText('DINA Network').closest('.category-item');
      expect(dinaItem).toHaveClass('priority');
    });

    it('shows alert pulse for priority categories', () => {
      const { container } = render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      // All priority categories should have alert-pulse divs
      const alertPulses = container.querySelectorAll('.alert-pulse');
      expect(alertPulses.length).toBe(3); // predators, pedophiles, dina_network
    });

    it('does not show priority badge for non-priority categories', () => {
      render(
        <CategorySwitcher
          activeCategory="ransomware"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      // 🐾 Component uses <div> not <button>, and priority shows as .category-priority not .priority-badge
      const ransomwareItem = screen.getByText('Ransomware').closest('.category-item');
      const priorityText = ransomwareItem.querySelector('.category-priority');
      expect(priorityText).toBeNull();
    });
  });

  describe('🎨 Visual Styling', () => {
    it('applies correct border color from category config', () => {
      const { container } = render(
        <CategorySwitcher
          activeCategory="all"
          onCategoryChange={mockOnCategoryChange}
          threatCounts={mockThreatCounts}
        />
      );

      // 🐾 Component uses <div> not <button>, and color is on borderLeftColor not borderColor
      const allItem = screen.getByText('All Threats').closest('.category-item');
      expect(allItem).toHaveStyle({ borderLeftColor: '#00ffff' });

      const predatorsItem = screen.getByText('Predators').closest('.category-item');
      expect(predatorsItem).toHaveStyle({ borderLeftColor: '#ff0033' });
    });
  });
});

// *purrs in category testing excellence* 😻
