/**
 * 💬 Comment Model - MongoDB Schema
 * Part of Neko Dashboard UGC Platform
 *
 * Handles threaded comments, reactions, and moderation
 */

const { ObjectId } = require('mongodb');

/**
 * Comment Schema
 * Collection: comments
 */
const CommentSchema = {
  _id: ObjectId,
  content_id: ObjectId, // Parent content
  author_id: ObjectId, // Comment author
  parent_comment_id: ObjectId, // null for top-level, set for replies

  text: String, // Max 1000 chars
  mentions: [ObjectId], // @mentioned users

  reactions: [
    {
      user_id: ObjectId,
      emoji: String, // ":neko_love:", ":paw:", etc.
      created_at: Date,
    },
  ],

  is_pinned: Boolean,
  is_edited: Boolean,
  edit_history: [
    {
      text: String,
      edited_at: Date,
    },
  ],

  moderation: {
    flagged: Boolean,
    flag_count: Number,
    removed: Boolean,
    removal_reason: String,
  },

  created_at: Date,
  updated_at: Date,
};

/**
 * Custom Neko Reactions
 */
const NEKO_REACTIONS = [
  { emoji: '🐾', name: 'paw', label: 'Nyaa!' },
  { emoji: '😻', name: 'heart_eyes', label: 'Kawaii!' },
  { emoji: '⚔️', name: 'sword', label: 'Epic!' },
  { emoji: '🎭', name: 'mask', label: 'Dramatic!' },
  { emoji: '🔥', name: 'fire', label: 'Fire!' },
  { emoji: '💎', name: 'gem', label: 'Gem!' },
  { emoji: '🏆', name: 'trophy', label: 'Winner!' },
  { emoji: '🤔', name: 'thinking', label: 'Hmm...' },
  { emoji: '😂', name: 'laugh', label: 'LOL!' },
  { emoji: '🎯', name: 'target', label: 'On Point!' },
  { emoji: '💖', name: 'love', label: 'Love it!' },
  { emoji: '⚡', name: 'lightning', label: 'Electric!' },
  { emoji: '🌟', name: 'star', label: 'Amazing!' },
  { emoji: '🛡️', name: 'shield', label: 'Protected!' },
  { emoji: '🔍', name: 'search', label: 'Insightful!' },
];

/**
 * Create default comment object
 * @param {Object} commentData - Comment creation data
 * @returns {Object} - Complete comment object
 */
function createDefaultComment(commentData) {
  return {
    content_id: new ObjectId(commentData.content_id),
    author_id: new ObjectId(commentData.author_id),
    parent_comment_id: commentData.parent_comment_id
      ? new ObjectId(commentData.parent_comment_id)
      : null,

    text: commentData.text,
    mentions: commentData.mentions || [],

    reactions: [],

    is_pinned: false,
    is_edited: false,
    edit_history: [],

    moderation: {
      flagged: false,
      flag_count: 0,
      removed: false,
      removal_reason: null,
    },

    created_at: new Date(),
    updated_at: new Date(),
  };
}

/**
 * Validate comment data
 * @param {Object} commentData
 * @returns {Object} - { valid: boolean, error: string }
 */
function validateComment(commentData) {
  // Text is required
  if (!commentData.text || commentData.text.trim().length === 0) {
    return { valid: false, error: 'Comment text is required' };
  }

  // Text length check
  if (commentData.text.length > 1000) {
    return { valid: false, error: 'Comment must be at most 1000 characters' };
  }

  // Content ID required
  if (!commentData.content_id) {
    return { valid: false, error: 'Content ID is required' };
  }

  return { valid: true };
}

/**
 * Extract @mentions from comment text
 * @param {string} text - Comment text
 * @returns {Array} - Array of mentioned usernames
 */
function extractMentions(text) {
  const mentionRegex = /@([a-zA-Z0-9_-]+)/g;
  const mentions = [];
  let match;

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1]);
  }

  return [...new Set(mentions)]; // Remove duplicates
}

/**
 * Check if emoji is valid Neko reaction
 * @param {string} emoji
 * @returns {boolean}
 */
function isValidReaction(emoji) {
  return NEKO_REACTIONS.some((reaction) => reaction.emoji === emoji);
}

/**
 * Get reaction counts for a comment
 * @param {Array} reactions - Comment reactions array
 * @returns {Object} - { emoji: count }
 */
function getReactionCounts(reactions) {
  const counts = {};

  reactions.forEach((reaction) => {
    counts[reaction.emoji] = (counts[reaction.emoji] || 0) + 1;
  });

  return counts;
}

module.exports = {
  CommentSchema,
  NEKO_REACTIONS,
  createDefaultComment,
  validateComment,
  extractMentions,
  isValidReaction,
  getReactionCounts,
};
