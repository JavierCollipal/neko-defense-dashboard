/**
 * 🐾⚡ Unit Tests for Content & Comment Models ⚡🐾
 * Testing content creation, validation, and helper functions
 */

const { ObjectId } = require('mongodb');
const {
  createDefaultContent,
  validateContent,
  validateFileUpload,
  calculateQualityScore,
  CONTENT_CATEGORIES,
  MAX_FILE_SIZES,
  ALLOWED_FORMATS,
} = require('../../models/Content');

const {
  createDefaultComment,
  validateComment,
  extractMentions,
  isValidReaction,
  getReactionCounts,
  NEKO_REACTIONS,
} = require('../../models/Comment');

describe('Content Model - Validation and Helpers', () => {
  describe('createDefaultContent', () => {
    it('should create content with minimal data', () => {
      const contentData = {
        author_id: new ObjectId().toString(),
        title: 'Test Content',
      };

      const content = createDefaultContent(contentData);

      expect(content.title).toBe('Test Content');
      expect(content.content_type).toBe('text');
      expect(content.category).toBe('general');
      expect(content.visibility).toBe('public');
      expect(content.status).toBe('draft');
    });

    it('should initialize engagement metrics to zero', () => {
      const contentData = {
        author_id: new ObjectId().toString(),
        title: 'Test Content',
      };

      const content = createDefaultContent(contentData);

      expect(content.engagement.views).toBe(0);
      expect(content.engagement.likes).toBe(0);
      expect(content.engagement.comments).toBe(0);
      expect(content.engagement.shares).toBe(0);
    });

    it('should set published_at when status is published', () => {
      const contentData = {
        author_id: new ObjectId().toString(),
        title: 'Test Content',
        status: 'published',
      };

      const content = createDefaultContent(contentData);

      expect(content.published_at).toBeInstanceOf(Date);
    });

    it('should not set published_at for drafts', () => {
      const contentData = {
        author_id: new ObjectId().toString(),
        title: 'Test Content',
        status: 'draft',
      };

      const content = createDefaultContent(contentData);

      expect(content.published_at).toBeNull();
    });
  });

  describe('validateContent', () => {
    it('should validate correct content', () => {
      const contentData = {
        title: 'Valid Title',
        description: 'Valid description',
        category: 'threat-intel',
        visibility: 'public',
        content_type: 'text',
      };

      const result = validateContent(contentData);
      expect(result.valid).toBe(true);
    });

    it('should reject empty title', () => {
      const result = validateContent({ title: '' });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title is required');
    });

    it('should reject missing title', () => {
      const result = validateContent({});
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title is required');
    });

    it('should reject title longer than 200 characters', () => {
      const result = validateContent({ title: 'a'.repeat(201) });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Title must be at most 200 characters');
    });

    it('should reject description longer than 1000 characters', () => {
      const result = validateContent({
        title: 'Valid Title',
        description: 'a'.repeat(1001),
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Description must be at most 1000 characters');
    });

    it('should reject invalid category', () => {
      const result = validateContent({
        title: 'Valid Title',
        category: 'invalid-category',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid category');
    });

    it('should reject invalid visibility', () => {
      const result = validateContent({
        title: 'Valid Title',
        visibility: 'secret',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid visibility option');
    });

    it('should reject invalid content type', () => {
      const result = validateContent({
        title: 'Valid Title',
        content_type: 'invalid',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid content type');
    });
  });

  describe('validateFileUpload', () => {
    it('should validate correct image file', () => {
      const file = {
        originalname: 'test.jpg',
        size: 1024 * 1024, // 1MB
      };

      const result = validateFileUpload(file, 'image');
      expect(result.valid).toBe(true);
    });

    it('should reject file exceeding size limit', () => {
      const file = {
        originalname: 'test.jpg',
        size: MAX_FILE_SIZES.image + 1,
      };

      const result = validateFileUpload(file, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should reject invalid file format', () => {
      const file = {
        originalname: 'test.exe',
        size: 1024,
      };

      const result = validateFileUpload(file, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid file format');
    });

    it('should reject missing file', () => {
      const result = validateFileUpload(null, 'image');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('No file provided');
    });
  });

  describe('calculateQualityScore', () => {
    it('should calculate base score for minimal content', () => {
      const content = {
        title: 'Short',
        description: 'Short desc',
        content: { text: 'Short text', media: [] },
        tags: [],
      };

      const score = calculateQualityScore(content);
      expect(score).toBeGreaterThanOrEqual(50);
    });

    it('should award points for quality title', () => {
      const content = {
        title: 'This is a long title',
        description: '',
        content: { text: '', media: [] },
        tags: [],
      };

      const score = calculateQualityScore(content);
      expect(score).toBeGreaterThan(50);
    });

    it('should award points for quality description', () => {
      const content = {
        title: 'Title',
        description: 'a'.repeat(50),
        content: { text: '', media: [] },
        tags: [],
      };

      const score = calculateQualityScore(content);
      expect(score).toBeGreaterThan(50);
    });

    it('should cap score at 100', () => {
      const content = {
        title: 'This is a long title',
        description: 'a'.repeat(100),
        content: { text: 'a'.repeat(200), media: [{ url: 'test.jpg' }] },
        tags: ['tag1', 'tag2', 'tag3'],
      };

      const score = calculateQualityScore(content);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('Constants', () => {
    it('should have content categories', () => {
      expect(CONTENT_CATEGORIES).toHaveProperty('threat-intel');
      expect(CONTENT_CATEGORIES).toHaveProperty('defense');
      expect(CONTENT_CATEGORIES).toHaveProperty('research');
    });

    it('should have max file sizes', () => {
      expect(MAX_FILE_SIZES.image).toBeGreaterThan(0);
      expect(MAX_FILE_SIZES.video).toBeGreaterThan(0);
      expect(MAX_FILE_SIZES.audio).toBeGreaterThan(0);
    });

    it('should have allowed formats', () => {
      expect(ALLOWED_FORMATS.image).toContain('jpg');
      expect(ALLOWED_FORMATS.video).toContain('mp4');
      expect(ALLOWED_FORMATS.audio).toContain('mp3');
    });
  });
});

describe('Comment Model - Validation and Helpers', () => {
  describe('createDefaultComment', () => {
    it('should create comment with required data', () => {
      const commentData = {
        content_id: new ObjectId().toString(),
        author_id: new ObjectId().toString(),
        text: 'Test comment',
      };

      const comment = createDefaultComment(commentData);

      expect(comment.text).toBe('Test comment');
      expect(comment.is_pinned).toBe(false);
      expect(comment.is_edited).toBe(false);
      expect(comment.reactions).toEqual([]);
    });

    it('should create reply comment with parent_comment_id', () => {
      const commentData = {
        content_id: new ObjectId().toString(),
        author_id: new ObjectId().toString(),
        parent_comment_id: new ObjectId().toString(),
        text: 'Reply comment',
      };

      const comment = createDefaultComment(commentData);

      expect(comment.parent_comment_id).toBeInstanceOf(ObjectId);
    });

    it('should initialize moderation flags', () => {
      const commentData = {
        content_id: new ObjectId().toString(),
        author_id: new ObjectId().toString(),
        text: 'Test comment',
      };

      const comment = createDefaultComment(commentData);

      expect(comment.moderation.flagged).toBe(false);
      expect(comment.moderation.flag_count).toBe(0);
      expect(comment.moderation.removed).toBe(false);
    });
  });

  describe('validateComment', () => {
    it('should validate correct comment', () => {
      const commentData = {
        content_id: new ObjectId().toString(),
        text: 'Valid comment text',
      };

      const result = validateComment(commentData);
      expect(result.valid).toBe(true);
    });

    it('should reject empty text', () => {
      const result = validateComment({
        content_id: new ObjectId().toString(),
        text: '',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Comment text is required');
    });

    it('should reject text longer than 1000 characters', () => {
      const result = validateComment({
        content_id: new ObjectId().toString(),
        text: 'a'.repeat(1001),
      });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Comment must be at most 1000 characters');
    });

    it('should reject missing content_id', () => {
      const result = validateComment({ text: 'Valid text' });
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Content ID is required');
    });
  });

  describe('extractMentions', () => {
    it('should extract single mention', () => {
      const mentions = extractMentions('Hello @neko-arc!');
      expect(mentions).toEqual(['neko-arc']);
    });

    it('should extract multiple mentions', () => {
      const mentions = extractMentions('Hey @neko-arc and @mario how are you?');
      expect(mentions).toContain('neko-arc');
      expect(mentions).toContain('mario');
    });

    it('should remove duplicate mentions', () => {
      const mentions = extractMentions('@neko @neko @mario');
      expect(mentions.filter((m) => m === 'neko').length).toBe(1);
      expect(mentions.length).toBe(2);
    });

    it('should return empty array for no mentions', () => {
      const mentions = extractMentions('No mentions here');
      expect(mentions).toEqual([]);
    });

    it('should handle usernames with numbers', () => {
      const mentions = extractMentions('Hello @user123');
      expect(mentions).toEqual(['user123']);
    });
  });

  describe('isValidReaction', () => {
    it('should validate correct emoji', () => {
      expect(isValidReaction('🐾')).toBe(true);
      expect(isValidReaction('😻')).toBe(true);
      expect(isValidReaction('⚔️')).toBe(true);
    });

    it('should reject invalid emoji', () => {
      expect(isValidReaction('🚀')).toBe(false);
      expect(isValidReaction('invalid')).toBe(false);
    });
  });

  describe('getReactionCounts', () => {
    it('should count reactions correctly', () => {
      const reactions = [
        { user_id: new ObjectId(), emoji: '🐾' },
        { user_id: new ObjectId(), emoji: '🐾' },
        { user_id: new ObjectId(), emoji: '😻' },
      ];

      const counts = getReactionCounts(reactions);

      expect(counts['🐾']).toBe(2);
      expect(counts['😻']).toBe(1);
    });

    it('should return empty object for no reactions', () => {
      const counts = getReactionCounts([]);
      expect(counts).toEqual({});
    });
  });

  describe('NEKO_REACTIONS constant', () => {
    it('should have reaction objects', () => {
      expect(NEKO_REACTIONS).toBeInstanceOf(Array);
      expect(NEKO_REACTIONS.length).toBeGreaterThan(0);
    });

    it('should have correct reaction structure', () => {
      const firstReaction = NEKO_REACTIONS[0];
      expect(firstReaction).toHaveProperty('emoji');
      expect(firstReaction).toHaveProperty('name');
      expect(firstReaction).toHaveProperty('label');
    });
  });
});
