/**
 * 🔐 Authentication Middleware
 * Part of Neko Dashboard UGC Platform
 *
 * Handles JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');

// JWT secret from environment variable (MUST be set in production)
const JWT_SECRET =
  process.env.JWT_SECRET || 'dev-test-secret-DO-NOT-USE-IN-PRODUCTION';
const JWT_EXPIRES_IN = '24h'; // Token expiration time
const JWT_REFRESH_EXPIRES_IN = '7d'; // Refresh token expiration

/**
 * Generate JWT access token
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
function generateAccessToken(user) {
  const payload = {
    user_id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'neko-defense-dashboard',
  });
}

/**
 * Generate JWT refresh token
 * @param {Object} user - User object
 * @returns {string} - Refresh token
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
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
function authenticateToken(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required',
    });
  }

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }

  // Check if it's a refresh token (not allowed for API access)
  if (decoded.type === 'refresh') {
    return res.status(403).json({
      success: false,
      error: 'Refresh token cannot be used for API access',
    });
  }

  // Attach user data to request
  req.user = decoded;
  next();
}

/**
 * Optional authentication middleware
 * Allows requests without token but attaches user data if token is present
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const decoded = verifyToken(token);
    if (decoded && decoded.type !== 'refresh') {
      req.user = decoded;
    }
  }

  next();
}

/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - Array of allowed roles
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
      });
    }

    next();
  };
}

/**
 * Check if user is banned
 * @param {Object} db - MongoDB database instance
 */
function checkBanned(db) {
  return async (req, res, next) => {
    if (!req.user) {
      return next();
    }

    try {
      const { ObjectId } = require('mongodb');
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(req.user.user_id) });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      // Check if user is banned
      if (user.moderation.banned) {
        const banMessage =
          user.moderation.ban_expires &&
          user.moderation.ban_expires > new Date()
            ? `You are temporarily banned until ${user.moderation.ban_expires.toISOString()}`
            : 'You are permanently banned';

        return res.status(403).json({
          success: false,
          error: banMessage,
          reason: user.moderation.ban_reason,
        });
      }

      next();
    } catch (error) {
      console.error('Error checking ban status:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  authenticateToken,
  requireAuth: authenticateToken, // Alias for authenticateToken (used in routes)
  optionalAuth,
  authorize,
  requireRole: authorize, // Alias for authorize (role-based access control)
  checkBanned,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
};
