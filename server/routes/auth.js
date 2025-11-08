/**
 * 🔐 Authentication Routes
 * Part of Neko Dashboard UGC Platform
 *
 * Handles user registration, login, and token management
 */

const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  authenticateToken,
} = require('../middleware/auth');
const {
  createDefaultUser,
  validateUsername,
  validateEmail,
  validatePassword,
  calculateLevel,
} = require('../models/User');

const router = express.Router();
const BCRYPT_ROUNDS = 12; // Security level for password hashing

/**
 * POST /api/auth/register
 * Register a new user
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

    // Return success response (exclude password_hash)
    const { password_hash: _, ...userResponse } = user;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userResponse,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: '24h',
      },
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
 * POST /api/auth/login
 * Login with username/email and password
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

    // Return success response (exclude password_hash)
    const { password_hash: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: '24h',
      },
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
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    // Verify refresh token
    const decoded = verifyToken(refresh_token);
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
      return res.status(403).json({
        success: false,
        error: 'User is banned',
      });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    res.json({
      success: true,
      access_token: accessToken,
      expires_in: '24h',
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
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
router.get('/me', authenticateToken, async (req, res) => {
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
 * POST /api/auth/logout
 * Logout (client should delete tokens)
 */
router.post('/logout', authenticateToken, async (req, res) => {
  // In a stateless JWT system, logout is handled client-side by deleting tokens
  // This endpoint is mainly for consistency and potential future token blacklisting

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * PUT /api/auth/change-password
 * Change user password (requires authentication)
 */
router.put('/change-password', authenticateToken, async (req, res) => {
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

module.exports = router;
