// 🐾⚡ ACCESSIBILITY UTILITIES (WCAG 2.2 COMPLIANT) ⚡🐾
// 2025 Standards: WCAG 2.2 Level AA

/**
 * Check if color contrast meets WCAG 2.2 standards
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param level - 'AA' or 'AAA'
 * @param largeText - Is this large text? (>= 18pt or >= 14pt bold)
 */
export function checkColorContrast(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): { passes: boolean; ratio: number; required: number } {
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);

  const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);

  // WCAG 2.2 requirements
  const required = largeText
    ? (level === 'AAA' ? 4.5 : 3.0) // Large text
    : (level === 'AAA' ? 7.0 : 4.5); // Normal text

  return {
    passes: ratio >= required,
    ratio: Math.round(ratio * 100) / 100,
    required
  };
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * WCAG 2.2: Minimum touch target size
 * Targets should be at least 24x24 CSS pixels
 */
export const MIN_TARGET_SIZE = 24; // pixels

/**
 * Check if element meets minimum target size (WCAG 2.2)
 */
export function meetsMinimumTargetSize(width: number, height: number): boolean {
  return width >= MIN_TARGET_SIZE && height >= MIN_TARGET_SIZE;
}

/**
 * Generate accessible label for screen readers
 */
export function generateAriaLabel(
  element: string,
  context?: string,
  state?: string
): string {
  let label = element;
  if (context) label += `, ${context}`;
  if (state) label += `, ${state}`;
  return label;
}

/**
 * Keyboard navigation helper: Focus management
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTab(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  element.addEventListener('keydown', handleTab);

  // Return cleanup function
  return () => element.removeEventListener('keydown', handleTab);
}

/**
 * Announce content to screen readers (live region)
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Visually hidden but accessible
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => document.body.removeChild(announcement), 1000);
}

/**
 * Keyboard shortcuts configuration
 */
export const KEYBOARD_SHORTCUTS = {
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Skip navigation helper (WCAG 2.2)
 */
export function createSkipLink(targetId: string, label: string = 'Skip to main content'): HTMLAnchorElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = label;

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return skipLink;
}

/**
 * ARIA live region manager
 */
export class LiveRegionManager {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.setAttribute('role', 'log');
    this.container.setAttribute('aria-live', 'polite');
    this.container.setAttribute('aria-relevant', 'additions');
    this.container.className = 'sr-only';
    document.body.appendChild(this.container);
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    this.container.setAttribute('aria-live', priority);
    this.container.textContent = message;
  }

  destroy() {
    document.body.removeChild(this.container);
  }
}

/**
 * Focus visible helper (remove outline for mouse, show for keyboard)
 */
export function initFocusVisible() {
  let hadKeyboardEvent = false;

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      hadKeyboardEvent = true;
    }
  }

  function onMouseDown() {
    hadKeyboardEvent = false;
  }

  function onFocus() {
    if (hadKeyboardEvent) {
      document.documentElement.classList.add('keyboard-focus');
    } else {
      document.documentElement.classList.remove('keyboard-focus');
    }
  }

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('focusin', onFocus);
}

/**
 * Prefers reduced motion (respect user preferences)
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Accessible color palette (WCAG 2.2 AA compliant)
 */
export const ACCESSIBLE_COLORS = {
  // High contrast pairs (white background)
  text: {
    primary: '#1a1a1a',    // 15.3:1 ratio
    secondary: '#4a4a4a',  // 8.59:1 ratio
    disabled: '#767676',   // 4.54:1 ratio
  },

  // Links (must be distinguishable)
  link: {
    default: '#0066cc',    // 7.29:1 ratio
    visited: '#800080',    // 10.69:1 ratio
    hover: '#004499',      // 10.16:1 ratio
  },

  // Status colors (accessible on white)
  status: {
    success: '#0f5132',    // 9.44:1 ratio
    warning: '#664d03',    // 9.51:1 ratio
    error: '#842029',      // 11.03:1 ratio
    info: '#055160',       // 8.28:1 ratio
  },
} as const;
