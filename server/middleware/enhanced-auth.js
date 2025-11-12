/**
 * 🔐 Enhanced Authentication Middleware with httpOnly Cookies + CSRF Protection
 * Part of Neko Dashboard Security Audit Implementation
 *
 * Security Features:
 * - httpOnly cookies for JWT tokens (prevents XSS token theft)
 * - SameSite=Strict cookies (prevents CSRF)
 * - Double-submit CSRF token pattern
 * - Secure flag for production HTTPS
 * - Token rotation on refresh
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// JWT secret from environment variable (MUST be set in production)
const JWT_SECRET =
  process.env.JWT_SECRET || 'dev-test-secret-DO-NOT-USE-IN-PRODUCTION';
const JWT_ACCESS_EXPIRES_IN = '15m'; // Short-lived access token (15 minutes)
const JWT_REFRESH_EXPIRES_IN = '7d'; // Long-lived refresh token (7 days)
const CSRF_SECRET = process.env.CSRF_SECRET || JWT_SECRET; // Use separate secret in production

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true, // Prevents JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict', // CSRF protection
  path: '/',
};

/**
 * Generate JWT access token (short-lived)
 * @param {Object} user - User object
 * @returns {string} - JWT access token
 */
function generateAccessToken(user) {
  const payload = {
    user_id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    type: 'access',
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRES_IN,
    issuer: 'neko-defense-dashboard',
  });
}

/**
 * Generate JWT refresh token (long-lived)
 * @param {Object} user - User object
 * @returns {string} - JWT refresh token
 */
function generateRefreshToken(user) {
  const payload = {
    user_id: user._id.toString(),
    type: 'refresh',
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
    issuer: 'neko-defense-dashboard',
  });
}

/**
 * Generate CSRF token
 * @returns {string} - CSRF token
 */
function generateCsrfToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded payload or null
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'neko-defense-dashboard',
    });
  } catch (error) {
    return null;
  }
}

/**
 * Set authentication cookies
 * @param {Object} res - Express response object
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 */
function setAuthCookies(res, accessToken, refreshToken) {
  // Set access token cookie (15 minutes)
  res.cookie('access_token', accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
  });

  // Set refresh token cookie (7 days)
  res.cookie('refresh_token', refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  // Generate and set CSRF token
  const csrfToken = generateCsrfToken();
  res.cookie('csrf_token', csrfToken, {
    ...COOKIE_OPTIONS,
    httpOnly: false, // Allow JavaScript to read CSRF token
  });

  return csrfToken;
}

/**
 * Clear authentication cookies (logout)
 * @param {Object} res - Express response object
 */
function clearAuthCookies(res) {
  res.clearCookie('access_token', COOKIE_OPTIONS);
  res.clearCookie('refresh_token', COOKIE_OPTIONS);
  res.clearCookie('csrf_token', { ...COOKIE_OPTIONS, httpOnly: false });
}

/**
 * Enhanced authentication middleware with httpOnly cookies
 * Reads JWT from httpOnly cookies instead of Authorization header
 */
function authenticateWithCookies(req, res, next) {
  // Get token from httpOnly cookie
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded || decoded.type !== 'access') {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }

  // Attach user data to request
  req.user = decoded;
  next();
}

/**
 * Optional authentication with cookies
 * Allows requests without token but attaches user data if present
 */
function optionalAuthWithCookies(req, res, next) {
  const token = req.cookies?.access_token;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.type === 'access') {
      req.user = decoded;
    }
  }

  next();
}

/**
 * CSRF protection middleware (double-submit cookie pattern)
 * Verifies CSRF token from request header matches cookie
 */
function verifyCsrf(req, res, next) {
  // Skip CSRF check for GET, HEAD, OPTIONS (safe methods)
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Get CSRF token from header and cookie
  const csrfTokenHeader = req.headers['x-csrf-token'];
  const csrfTokenCookie = req.cookies?.csrf_token;

  if (!csrfTokenHeader || !csrfTokenCookie) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token missing',
    });
  }

  // Verify tokens match (double-submit cookie pattern)
  if (csrfTokenHeader !== csrfTokenCookie) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token mismatch',
    });
  }

  next();
}

/**
 * Combined middleware: Authentication + CSRF protection
 */
function authenticateWithCsrf(req, res, next) {
  authenticateWithCookies(req, res, (err) => {
    if (err) return next(err);
    verifyCsrf(req, res, next);
  });
}

/**
 * Legacy support: Read JWT from Authorization header (backward compatibility)
 * Use this for clients that haven't migrated to cookies yet
 */
function authenticateWithHeader(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
    });
  }

  const decoded = verifyToken(token);

  if (!decoded || decoded.type !== 'access') {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }

  req.user = decoded;
  next();
}

/**
 * Hybrid authentication: Try cookies first, fallback to header
 * Use during migration period
 */
function authenticateHybrid(req, res, next) {
  // Try cookies first
  const cookieToken = req.cookies?.access_token;
  if (cookieToken) {
    const decoded = verifyToken(cookieToken);
    if (decoded && decoded.type === 'access') {
      req.user = decoded;
      return next();
    }
  }

  // Fallback to Authorization header
  const authHeader = req.headers['authorization'];
  const headerToken = authHeader && authHeader.split(' ')[1];
  if (headerToken) {
    const decoded = verifyToken(headerToken);
    if (decoded && decoded.type === 'access') {
      req.user = decoded;
      return next();
    }
  }

  return res.status(401).json({
    success: false,
    error: 'Authentication required',
  });
}

module.exports = {
  // Token generation
  generateAccessToken,
  generateRefreshToken,
  generateCsrfToken,
  verifyToken,

  // Cookie management
  setAuthCookies,
  clearAuthCookies,

  // Authentication middleware
  authenticateWithCookies,
  optionalAuthWithCookies,
  authenticateWithHeader, // Legacy
  authenticateHybrid, // Migration helper

  // CSRF protection
  verifyCsrf,
  authenticateWithCsrf,

  // Configuration
  JWT_SECRET,
  JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
  COOKIE_OPTIONS,
};
