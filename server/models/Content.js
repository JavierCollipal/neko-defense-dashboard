/**
 * 🎨 User-Generated Content Model - MongoDB Schema
 * Part of Neko Dashboard UGC Platform
 *
 * Handles all user-created content (text, images, videos, audio)
 */

const { ObjectId } = require('mongodb');

/**
 * User-Generated Content Schema
 * Collection: user_generated_content
 */
const ContentSchema = {
  _id: ObjectId,
  author_id: ObjectId, // Links to users collection
  content_type: String, // "text", "image", "video", "audio", "mixed"

  title: String, // Content title (required)
  description: String, // Short description

  content: {
    text: String, // Markdown content
    media: [
      {
        type: String, // "image", "video", "audio"
        url: String, // GridFS reference or base64
        thumbnail: String, // For videos
        metadata: {
          filename: String,
          size: Number, // Bytes
          duration: Number, // Seconds (for video/audio)
          dimensions: {
            // For images/videos
            width: Number,
            height: Number,
          },
          format: String, // "mp4", "png", "jpg", "mp3", etc.
        },
      },
    ],
  },

  tags: [String], // Auto-generated + user-added
  category: String, // "threat-intel", "defense", "research", "ideas", "general"
  visibility: String, // "public", "unlisted", "private"
  status: String, // "draft", "published", "moderated", "flagged", "removed"

  engagement: {
    views: Number,
    likes: Number,
    comments: Number,
    shares: Number,
  },

  ai_metadata: {
    quality_score: Number, // 0-100, AI-generated
    suggested_tags: [String],
    language: String, // Detected language
    sentiment: String, // "positive", "neutral", "negative"
    summary: String, // AI-generated summary
  },

  created_at: Date,
  updated_at: Date,
  published_at: Date,
};

/**
 * Content categories with descriptions
 */
const CONTENT_CATEGORIES = {
  'threat-intel': {
    name: 'Threat Intelligence',
    description:
      'Security research, threat actor analysis, vulnerability reports',
    icon: '🔍',
  },
  defense: {
    name: 'Defense Strategies',
    description:
      'Security best practices, defense mechanisms, protection methods',
    icon: '🛡️',
  },
  research: {
    name: 'Research',
    description: 'Security research, academic papers, technical analysis',
    icon: '📊',
  },
  ideas: {
    name: 'Ideas & Suggestions',
    description: 'Feature requests, improvement ideas, community feedback',
    icon: '💡',
  },
  general: {
    name: 'General Discussion',
    description: 'Community discussions, off-topic posts, general content',
    icon: '💬',
  },
  'ascii-art': {
    name: 'ASCII Art',
    description: 'ASCII art creations, threat actor representations',
    icon: '🎨',
  },
  video: {
    name: 'Videos',
    description: 'Educational videos, demonstrations, tutorials',
    icon: '🎥',
  },
};

/**
 * Maximum file sizes (in bytes)
 */
const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 100 * 1024 * 1024, // 100 MB
  audio: 5 * 1024 * 1024, // 5 MB
};

/**
 * Allowed file formats
 */
const ALLOWED_FORMATS = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  video: ['mp4', 'webm', 'mov'],
  audio: ['mp3', 'wav', 'ogg', 'm4a'],
};

/**
 * Create default content object
 * @param {Object} contentData - Content creation data
 * @returns {Object} - Complete content object
 */
function createDefaultContent(contentData) {
  return {
    author_id: new ObjectId(contentData.author_id),
    content_type: contentData.content_type || 'text',

    title: contentData.title,
    description: contentData.description || '',

    content: {
      text: contentData.text || '',
      media: contentData.media || [],
    },

    tags: contentData.tags || [],
    category: contentData.category || 'general',
    visibility: contentData.visibility || 'public',
    status: contentData.status || 'draft',

    engagement: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    },

    ai_metadata: {
      quality_score: 0,
      suggested_tags: [],
      language: contentData.language || 'en',
      sentiment: 'neutral',
      summary: '',
    },

    created_at: new Date(),
    updated_at: new Date(),
    published_at: contentData.status === 'published' ? new Date() : null,
  };
}

/**
 * Validate content creation data
 * @param {Object} contentData
 * @returns {Object} - { valid: boolean, error: string }
 */
function validateContent(contentData) {
  // Title is required
  if (!contentData.title || contentData.title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }

  // Title length check
  if (contentData.title.length > 200) {
    return { valid: false, error: 'Title must be at most 200 characters' };
  }

  // Description length check
  if (contentData.description && contentData.description.length > 1000) {
    return {
      valid: false,
      error: 'Description must be at most 1000 characters',
    };
  }

  // Category validation
  if (contentData.category && !CONTENT_CATEGORIES[contentData.category]) {
    return { valid: false, error: 'Invalid category' };
  }

  // Visibility validation
  const validVisibilities = ['public', 'unlisted', 'private'];
  if (
    contentData.visibility &&
    !validVisibilities.includes(contentData.visibility)
  ) {
    return { valid: false, error: 'Invalid visibility option' };
  }

  // Content type validation
  const validTypes = ['text', 'image', 'video', 'audio', 'mixed'];
  if (
    contentData.content_type &&
    !validTypes.includes(contentData.content_type)
  ) {
    return { valid: false, error: 'Invalid content type' };
  }

  return { valid: true };
}

/**
 * Validate file upload
 * @param {Object} file - File object from multer
 * @param {string} type - "image", "video", or "audio"
 * @returns {Object} - { valid: boolean, error: string }
 */
function validateFileUpload(file, type) {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZES[type]) {
    const maxSizeMB = MAX_FILE_SIZES[type] / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds maximum of ${maxSizeMB}MB`,
    };
  }

  // Check file format
  const fileExtension = file.originalname.split('.').pop().toLowerCase();
  if (!ALLOWED_FORMATS[type].includes(fileExtension)) {
    return {
      valid: false,
      error: `Invalid file format. Allowed formats: ${ALLOWED_FORMATS[type].join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Generate AI quality score (placeholder - would use actual AI in production)
 * @param {Object} content - Content object
 * @returns {number} - Quality score (0-100)
 */
function calculateQualityScore(content) {
  let score = 50; // Base score

  // Title quality
  if (content.title && content.title.length >= 10) score += 10;

  // Description quality
  if (content.description && content.description.length >= 50) score += 10;

  // Content length
  if (content.content.text && content.content.text.length >= 100) score += 10;

  // Media presence
  if (content.content.media && content.content.media.length > 0) score += 10;

  // Tags
  if (content.tags && content.tags.length >= 3) score += 10;

  return Math.min(100, score);
}

module.exports = {
  ContentSchema,
  CONTENT_CATEGORIES,
  MAX_FILE_SIZES,
  ALLOWED_FORMATS,
  createDefaultContent,
  validateContent,
  validateFileUpload,
  calculateQualityScore,
};
