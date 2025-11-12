/**
 * 🔐 Enhanced Authentication Routes with httpOnly Cookies + CSRF
 * Part of Neko Dashboard Security Audit Implementation
 *
 * Security improvements:
 * - JWT tokens in httpOnly cookies (XSS protection)
 * - CSRF token validation (CSRF protection)
 * - Short-lived access tokens (15 minutes)
 * - Long-lived refresh tokens (7 days)
 * - Automatic token rotation
 */

const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  authenticateWithCookies,
  authenticateWithCsrf,
  verifyToken,
} = require('../middleware/enhanced-auth');
const {
  createDefaultUser,
  validateUsername,
  validateEmail,
  validatePassword,
} = require('../models/User');

const router = express.Router();
const BCRYPT_ROUNDS = 12;

/**
 * POST /api/auth/v2/register
 * Register a new user with httpOnly cookies
 */
router.post('/register', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username, email, password, display_name, language } = req.body;

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({
        success: false,
        error: usernameValidation.error,
      });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({
        success: false,
        error: emailValidation.error,
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.error,
      });
    }

    // Check if username already exists
    const existingUsername = await db
      .collection('users')
      .findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        error: 'Username already exists',
      });
    }

    // Check if email already exists
    const existingEmail = await db
      .collection('users')
      .findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered',
      });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Create user object
    const newUser = createDefaultUser({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password_hash,
      display_name: display_name || username,
      language: language || 'en',
    });

    // Insert user into database
    const result = await db.collection('users').insertOne(newUser);

    // Generate tokens
    const user = { ...newUser, _id: result.insertedId };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set httpOnly cookies
    const csrfToken = setAuthCookies(res, accessToken, refreshToken);

    // Return success response (exclude password_hash)
    const { password_hash: _, ...userResponse } = user;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      csrf_token: csrfToken, // Send CSRF token in response body for client storage
      auth_method: 'httpOnly_cookies',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
    });
  }
});

/**
 * POST /api/auth/v2/login
 * Login with username/email and password, set httpOnly cookies
 */
router.post('/login', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username_or_email, password } = req.body;

    if (!username_or_email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username/email and password are required',
      });
    }

    // Find user by username or email
    const user = await db.collection('users').findOne({
      $or: [
        { username: username_or_email.toLowerCase() },
        { email: username_or_email.toLowerCase() },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if user is banned
    if (user.moderation.banned) {
      const banMessage =
        user.moderation.ban_expires && user.moderation.ban_expires > new Date()
          ? `You are temporarily banned until ${user.moderation.ban_expires.toISOString()}`
          : 'You are permanently banned';

      return res.status(403).json({
        success: false,
        error: banMessage,
        reason: user.moderation.ban_reason,
      });
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Update last login
    await db
      .collection('users')
      .updateOne({ _id: user._id }, { $set: { last_login: new Date() } });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set httpOnly cookies
    const csrfToken = setAuthCookies(res, accessToken, refreshToken);

    // Return success response (exclude password_hash)
    const { password_hash: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      csrf_token: csrfToken,
      auth_method: 'httpOnly_cookies',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
    });
  }
});

/**
 * POST /api/auth/v2/refresh
 * Refresh access token using refresh token from httpOnly cookie
 */
router.post('/refresh', async (req, res) => {
  try {
    // Get refresh token from httpOnly cookie
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded || decoded.type !== 'refresh') {
      return res.status(403).json({
        success: false,
        error: 'Invalid refresh token',
      });
    }

    // Get user from database
    const db = req.app.locals.db;
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(decoded.user_id) });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Check if user is banned
    if (user.moderation.banned) {
      clearAuthCookies(res);
      return res.status(403).json({
        success: false,
        error: 'User is banned',
      });
    }

    // Generate new tokens (token rotation)
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Set new httpOnly cookies
    const csrfToken = setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      csrf_token: csrfToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh token',
    });
  }
});

/**
 * GET /api/auth/v2/me
 * Get current user profile (requires authentication)
 */
router.get('/me', authenticateWithCookies, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(req.user.user_id) });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Return user without password_hash
    const { password_hash: _, ...userResponse } = user;

    res.json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
    });
  }
});

/**
 * POST /api/auth/v2/logout
 * Logout by clearing httpOnly cookies
 */
router.post('/logout', authenticateWithCookies, async (req, res) => {
  // Clear all authentication cookies
  clearAuthCookies(res);

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * PUT /api/auth/v2/change-password
 * Change user password (requires authentication + CSRF)
 */
router.put('/change-password', authenticateWithCsrf, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required',
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(new_password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.error,
      });
    }

    // Get user
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(req.user.user_id) });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Verify current password
    const passwordValid = await bcrypt.compare(
      current_password,
      user.password_hash
    );
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Hash new password
    const new_password_hash = await bcrypt.hash(new_password, BCRYPT_ROUNDS);

    // Update password
    await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          password_hash: new_password_hash,
          updated_at: new Date(),
        },
      }
    );

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
    });
  }
});

/**
 * GET /api/auth/v2/csrf-token
 * Get CSRF token (public endpoint)
 * Use this when CSRF token expires or is missing
 */
router.get('/csrf-token', (req, res) => {
  // CSRF token is already set in cookie
  const csrfToken = req.cookies?.csrf_token;

  if (!csrfToken) {
    return res.status(400).json({
      success: false,
      error: 'CSRF token not found. Please login first.',
    });
  }

  res.json({
    success: true,
    csrf_token: csrfToken,
  });
});

module.exports = router;
