/**
 * 🐾 User Model - MongoDB Schema
 * Part of Neko Dashboard UGC Platform
 *
 * Handles user authentication, profiles, reputation, and achievements
 */

const { ObjectId } = require('mongodb');

/**
 * User Schema Definition
 * Collection: users
 */
const UserSchema = {
  _id: ObjectId,
  username: String, // Unique, 3-20 chars
  email: String, // Verified email
  password_hash: String, // bcrypt hashed password
  display_name: String, // Public display name
  avatar_url: String, // GridFS or external URL
  bio: String, // Max 500 chars

  links: {
    website: String,
    twitter: String,
    github: String,
    youtube: String,
  },

  role: String, // "user", "moderator", "admin", "creator"
  verified: Boolean, // Verified badge

  reputation: {
    points: Number, // Total reputation score
    level: Number, // 1-100 based on points
    badges: [
      {
        id: String,
        name: String,
        icon: String,
        earned_at: Date,
      },
    ],
  },

  stats: {
    content_count: Number,
    total_views: Number,
    total_likes: Number,
    followers: Number,
    following: Number,
  },

  preferences: {
    language: String, // "en", "es", etc.
    theme: String, // "dark", "light", "neko-kawaii"
    notifications: {
      email: Boolean,
      push: Boolean,
      frequency: String, // "realtime", "daily", "weekly"
    },
  },

  moderation: {
    warnings: Number,
    strikes: Number,
    banned: Boolean,
    ban_reason: String,
    ban_expires: Date,
  },

  created_at: Date,
  last_login: Date,
  updated_at: Date,
};

/**
 * Reputation points awarded for actions
 */
const REPUTATION_POINTS = {
  content_published: 10,
  content_liked: 2,
  content_featured: 50,
  comment_posted: 1,
  comment_liked: 1,
  first_video: 25,
  views_100: 15,
  views_1000: 100,
  verified_contribution: 200,
};

/**
 * Badge achievements
 */
const BADGES = [
  {
    id: 'first_post',
    name: 'First Steps',
    icon: '🐾',
    points_required: 10,
    description: 'Published your first post',
  },
  {
    id: 'popular',
    name: 'Popular Creator',
    icon: '⭐',
    points_required: 100,
    description: 'Earned 100 reputation points',
  },
  {
    id: 'influencer',
    name: 'Neko Influencer',
    icon: '🌟',
    points_required: 1000,
    description: 'Earned 1000 reputation points',
  },
  {
    id: 'legendary',
    name: 'Legendary Contributor',
    icon: '👑',
    points_required: 5000,
    description: 'Earned 5000 reputation points',
  },
  {
    id: 'video_master',
    name: 'Video Master',
    icon: '🎥',
    requirement: 'custom',
    description: 'Published 10 videos',
  },
  {
    id: 'community_hero',
    name: 'Community Hero',
    icon: '🏆',
    requirement: 'custom',
    description: 'Received 100 comment likes',
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    icon: '🎖️',
    requirement: 'custom',
    description: 'Joined during beta phase',
  },
  {
    id: 'neko_warrior',
    name: 'Neko Warrior',
    icon: '⚔️',
    requirement: 'custom',
    description: 'Contributed to threat intelligence',
  },
];

/**
 * Calculate user level from reputation points
 * @param {number} points - Total reputation points
 * @returns {number} - User level (1-100)
 */
function calculateLevel(points) {
  // Level formula: sqrt(points / 10)
  // Level 1 = 0-10 points
  // Level 10 = 1000 points
  // Level 100 = 100,000 points
  return Math.min(100, Math.floor(Math.sqrt(points / 10)) + 1);
}

/**
 * Get badges a user has earned based on reputation
 * @param {number} points - Total reputation points
 * @returns {Array} - Array of badge IDs earned
 */
function getEarnedBadges(points) {
  return BADGES.filter(
    (badge) => badge.points_required && points >= badge.points_required
  ).map((badge) => ({
    id: badge.id,
    name: badge.name,
    icon: badge.icon,
    earned_at: new Date(),
  }));
}

/**
 * Create default user object
 * @param {Object} userData - User registration data
 * @returns {Object} - Complete user object
 */
function createDefaultUser(userData) {
  return {
    username: userData.username,
    email: userData.email,
    password_hash: userData.password_hash,
    display_name: userData.display_name || userData.username,
    avatar_url: userData.avatar_url || null,
    bio: '',

    links: {
      website: '',
      twitter: '',
      github: '',
      youtube: '',
    },

    role: 'user',
    verified: false,

    reputation: {
      points: 0,
      level: 1,
      badges: [],
    },

    stats: {
      content_count: 0,
      total_views: 0,
      total_likes: 0,
      followers: 0,
      following: 0,
    },

    preferences: {
      language: userData.language || 'en',
      theme: 'neko-kawaii',
      notifications: {
        email: true,
        push: true,
        frequency: 'realtime',
      },
    },

    moderation: {
      warnings: 0,
      strikes: 0,
      banned: false,
      ban_reason: null,
      ban_expires: null,
    },

    created_at: new Date(),
    last_login: new Date(),
    updated_at: new Date(),
  };
}

/**
 * Validate username format
 * @param {string} username
 * @returns {Object} - { valid: boolean, error: string }
 */
function validateUsername(username) {
  if (!username) {
    return { valid: false, error: 'Username is required' };
  }
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (username.length > 20) {
    return { valid: false, error: 'Username must be at most 20 characters' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return {
      valid: false,
      error:
        'Username can only contain letters, numbers, underscores, and hyphens',
    };
  }
  return { valid: true };
}

/**
 * Validate email format
 * @param {string} email
 * @returns {Object} - { valid: boolean, error: string }
 */
function validateEmail(email) {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  return { valid: true };
}

/**
 * Validate password strength
 * @param {string} password
 * @returns {Object} - { valid: boolean, error: string }
 */
function validatePassword(password) {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (password.length > 128) {
    return { valid: false, error: 'Password must be at most 128 characters' };
  }
  // Check for at least one letter and one number
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one letter and one number',
    };
  }
  return { valid: true };
}

module.exports = {
  UserSchema,
  REPUTATION_POINTS,
  BADGES,
  calculateLevel,
  getEarnedBadges,
  createDefaultUser,
  validateUsername,
  validateEmail,
  validatePassword,
};
