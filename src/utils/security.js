/**
 * 🛡️ Security Utilities
 * Part of Neko Dashboard Security Audit Implementation
 *
 * Provides DOMPurify sanitization and security helpers
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content using DOMPurify
 * @param {string} dirty - Unsanitized HTML
 * @param {Object} config - DOMPurify configuration
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(dirty, config = {}) {
  const defaultConfig = {
    ALLOWED_TAGS: [
      'b',
      'i',
      'em',
      'strong',
      'a',
      'p',
      'br',
      'ul',
      'ol',
      'li',
      'code',
      'pre',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
    ],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    RETURN_TRUSTED_TYPE: false,
  };

  return DOMPurify.sanitize(dirty, { ...defaultConfig, ...config });
}

/**
 * Sanitize user input (remove all HTML)
 * @param {string} input - User input
 * @returns {string} - Plain text only
 */
export function sanitizeText(input) {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize markdown-like content
 * Allows basic formatting but strips dangerous elements
 * @param {string} content - Markdown content
 * @returns {string} - Sanitized markdown
 */
export function sanitizeMarkdown(content) {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'code',
      'pre',
      'blockquote',
      'ul',
      'ol',
      'li',
      'h1',
      'h2',
      'h3',
      'a',
    ],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize URL to prevent javascript: and data: protocols
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL or empty string if invalid
 */
export function sanitizeURL(url) {
  if (!url) return '';

  // Remove whitespace
  url = url.trim();

  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lowerUrl = url.toLowerCase();

  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      console.warn(`[Security] Blocked dangerous URL protocol: ${protocol}`);
      return '';
    }
  }

  // Allow only http, https, mailto, tel
  if (
    !lowerUrl.startsWith('http://') &&
    !lowerUrl.startsWith('https://') &&
    !lowerUrl.startsWith('mailto:') &&
    !lowerUrl.startsWith('tel:') &&
    !lowerUrl.startsWith('/') // Relative URLs
  ) {
    console.warn(`[Security] Blocked invalid URL: ${url}`);
    return '';
  }

  return url;
}

/**
 * Escape HTML entities manually (defense-in-depth)
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeHTML(text) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };

  return String(text).replace(/[&<>"'/]/g, (char) => entityMap[char]);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid (3-20 chars, alphanumeric + underscore)
 */
export function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} - { valid, strength, message }
 */
export function checkPasswordStrength(password) {
  if (!password) {
    return { valid: false, strength: 'none', message: 'Password is required' };
  }

  if (password.length < 8) {
    return {
      valid: false,
      strength: 'weak',
      message: 'Password must be at least 8 characters',
    };
  }

  let strength = 0;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  const strengthLevels = ['weak', 'medium', 'medium', 'strong', 'very-strong'];
  const strengthLevel = strengthLevels[Math.min(strength, 4)];

  return {
    valid: strength >= 3,
    strength: strengthLevel,
    message:
      strength >= 3
        ? 'Password is strong'
        : 'Password should contain uppercase, lowercase, and numbers',
  };
}

/**
 * Rate limiting helper (client-side tracking)
 * Helps prevent abuse by tracking request frequency
 */
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }

  /**
   * Check if request is allowed
   * @returns {boolean} - True if allowed
   */
  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      return false;
    }

    this.requests.push(now);
    return true;
  }

  /**
   * Get time until next request allowed (ms)
   * @returns {number} - Milliseconds until allowed
   */
  getTimeUntilAllowed() {
    if (this.requests.length < this.maxRequests) return 0;

    const now = Date.now();
    const oldestRequest = this.requests[0];
    return this.windowMs - (now - oldestRequest);
  }
}

/**
 * Create rate limiter instance
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {RateLimiter} - Rate limiter instance
 */
export function createRateLimiter(maxRequests, windowMs) {
  return new RateLimiter(maxRequests, windowMs);
}

/**
 * Secure random string generator
 * @param {number} length - Length of random string
 * @returns {string} - Random string
 */
export function generateSecureRandomString(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
}

/**
 * Content Security Policy (CSP) helper
 * Check if CSP is properly configured
 */
export function checkCSP() {
  const metaCsp = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"]'
  );
  if (!metaCsp) {
    console.warn(
      '[Security] CSP meta tag not found. Consider adding CSP headers.'
    );
  }
}

/**
 * Initialize security utilities
 * Call this once when app starts
 */
export function initSecurity() {
  // Configure DOMPurify hooks
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    // Set all links to open in new tab with noopener noreferrer
    if (node.tagName === 'A') {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer');
    }
  });

  // Check CSP configuration
  checkCSP();

  console.log('🛡️ [Security] Security utilities initialized with DOMPurify');
}

export default {
  sanitizeHTML,
  sanitizeText,
  sanitizeMarkdown,
  sanitizeURL,
  escapeHTML,
  isValidEmail,
  isValidUsername,
  checkPasswordStrength,
  createRateLimiter,
  generateSecureRandomString,
  initSecurity,
};
