// 🐾⚡ NEKO-ARC TEST UTILITIES - Helper Functions for Testing ⚡🐾

import { render } from '@testing-library/react';

// 🎨 Mock API responses, nyaa~!
export const mockApiResponses = {
  // ASCII Art API response
  asciiArt: {
    success: true,
    data: [
      {
        name: 'Neko Guardian',
        art: [
          ' /\\_/\\  ',
          '( o.o ) ',
          ' > ^ <  '
        ],
        threat_level: 'HIGH',
        category: 'predators',
        description: 'Test ASCII art, nyaa~!'
      }
    ]
  },

  // Stats API response
  stats: {
    success: true,
    data: {
      total_collections: 8,
      kawaii_level: 'MAXIMUM',
      collections: [
        'threat_actors',
        'suspicious_content_trap',
        'predator_detection_zone'
      ],
      status: 'FORTRESS MODE ACTIVE',
      timestamp: '2025-10-11T12:00:00.000Z'
    }
  },

  // Threats summary API response
  threatsSummary: {
    success: true,
    data: {
      total_collections: 8,
      status: 'ACTIVE MONITORING',
      honeypot_traps: [
        'suspicious_content_trap',
        'illegal_materials_monitor',
        'admin_secrets_decoy'
      ],
      threat_actors_tracked: [
        'Geppetto Master',
        'Crypto Thief Alpha',
        'Predator Syndicate'
      ],
      last_updated: '2025-10-11T12:00:00.000Z'
    }
  },

  // DINA stats API response
  dinaStats: {
    success: true,
    data: {
      total_documents: 150,
      perpetrators: {
        total: 45,
        convicted: 12,
        unprosecuted: 33
      }
    }
  },

  // DINA perpetrators API response
  dinaPerpetrators: {
    success: true,
    data: [
      {
        fullName: 'Test Perpetrator',
        role: 'DINA Agent',
        legalStatus: {
          convicted: true,
          currentStatus: 'Imprisoned'
        },
        verificationStatus: 'VERIFIED',
        organization: ['DINA', 'Military Intelligence'],
        crimesAccused: ['Torture', 'Murder', 'Disappearances'],
        tags: ['Operation Condor', 'State Terrorism']
      },
      {
        fullName: 'Test Perpetrator 2',
        role: 'Military Officer',
        legalStatus: {
          convicted: false,
          currentStatus: 'Free'
        },
        verificationStatus: 'VERIFIED',
        organization: ['Chilean Army'],
        crimesAccused: ['Human Rights Violations'],
        tags: ['Pinochet Regime']
      }
    ]
  },

  // Threat counts API response
  threatCounts: {
    success: true,
    data: {
      all: 8,
      predators: 3,
      pedophiles: 5,
      dina_network: 0,
      ransomware: 0,
      state_sponsored: 0,
      crypto_crime: 0
    }
  }
};

// 🌐 Setup fetch mocks, desu!
export const setupFetchMocks = () => {
  global.fetch = jest.fn((url) => {
    // Check DINA endpoints FIRST (more specific patterns)
    if (url.includes('/dina/stats')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockApiResponses.dinaStats)
      });
    }
    if (url.includes('/dina/perpetrators')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockApiResponses.dinaPerpetrators)
      });
    }
    // Then check general endpoints
    if (url.includes('/ascii-art')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockApiResponses.asciiArt)
      });
    }
    if (url.includes('/stats')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockApiResponses.stats)
      });
    }
    if (url.includes('/threat-counts')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockApiResponses.threatCounts)
      });
    }
    if (url.includes('/threats/summary')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockApiResponses.threatsSummary)
      });
    }
    // Default fallback
    return Promise.reject(new Error('Unknown URL'));
  });
};

// 🚨 Mock failed API responses for error testing, nyaa~!
export const setupFailedFetchMocks = () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network error'))
  );
};

// 📦 Mock API response with missing success field
export const setupInvalidFetchMocks = () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: {} }) // Missing 'success' field
    })
  );
};

// 🎨 Create a canvas mock with event tracking, desu!
export const createMockCanvas = () => {
  const canvas = document.createElement('canvas');
  const context = {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    fillText: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    setLineDash: jest.fn(),
    canvas
  };

  canvas.getContext = jest.fn(() => context);
  canvas.addEventListener = jest.fn();

  return { canvas, context };
};

// 🪟 Create window.open mock with return value, nyaa~!
export const setupWindowOpenMock = () => {
  const mockWindow = {
    focus: jest.fn()
  };
  global.window.open = jest.fn(() => mockWindow);
  return mockWindow;
};

// 🔄 Wait for async updates (for useEffect testing)
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// 🎯 Custom render with common providers (if needed in future)
export const customRender = (ui, options = {}) => {
  return render(ui, { ...options });
};

// *purrs in test utility excellence* 😻
