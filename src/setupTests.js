// 🐾⚡ NEKO-ARC TEST SETUP - Global Test Configuration ⚡🐾
// This file runs before all tests, nyaa~!

import '@testing-library/jest-dom';
import 'jest-canvas-mock';

// 🎨 Mock HTMLCanvasElement for GlobalThreatMap tests, desu!
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
  globalAlpha: 1,
  font: '',
  textAlign: '',
  textBaseline: '',
  shadowColor: '',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  lineCap: 'butt',
  lineJoin: 'miter',
  miterLimit: 10,
  lineDashOffset: 0,
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  beginPath: jest.fn(),
  closePath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  arc: jest.fn(),
  arcTo: jest.fn(),
  quadraticCurveTo: jest.fn(),
  bezierCurveTo: jest.fn(),
  rect: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  clip: jest.fn(),
  isPointInPath: jest.fn(),
  isPointInStroke: jest.fn(),
  fillText: jest.fn(),
  strokeText: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 })),
  setLineDash: jest.fn(),
  getLineDash: jest.fn(() => []),
  save: jest.fn(),
  restore: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  translate: jest.fn(),
  transform: jest.fn(),
  setTransform: jest.fn(),
  resetTransform: jest.fn(),
  createLinearGradient: jest.fn(),
  createRadialGradient: jest.fn(),
  createPattern: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  drawImage: jest.fn(),
  canvas: document.createElement('canvas'),
}));

// 🌐 Mock fetch for API tests, nyaa~!
global.fetch = jest.fn();

// 🪟 Mock window.open for TV window tests, desu!
global.window.open = jest.fn();

// 🗑️ Mock console methods to reduce test noise (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  // Keep log for debugging, but you can mock it too if needed
  // log: jest.fn(),
};

// 📅 Mock Date for deterministic tests
const RealDate = Date;
global.Date = class extends RealDate {
  constructor(...args) {
    if (args.length) {
      super(...args);
    } else {
      // Default to a fixed date for tests, nyaa~!
      super('2025-10-11T12:00:00.000Z');
    }
  }

  static now() {
    return new RealDate('2025-10-11T12:00:00.000Z').getTime();
  }
};

// 🔄 Reset all mocks before each test, desu!
beforeEach(() => {
  jest.clearAllMocks();

  // Reset fetch mock
  global.fetch.mockClear();

  // Reset window.open mock
  global.window.open.mockClear();
});

// 🧹 Cleanup after each test, nyaa~!
afterEach(() => {
  jest.restoreAllMocks();
});

// *purrs in test setup excellence* 😻
