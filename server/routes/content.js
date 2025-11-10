/**
 * 🎨 Content Routes
 * Part of Neko Dashboard UGC Platform
 *
 * Handles user-generated content creation, retrieval, and management
 */

const express = require('express');
const { ObjectId } = require('mongodb');
const multer = require('multer');
const {
  authenticateToken,
  optionalAuth,
  authorize,
} = require('../middleware/auth');
const {
  createDefaultContent,
  validateContent,
  validateFileUpload,
  calculateQualityScore,
  MAX_FILE_SIZES,
} = require('../models/Content');
const { REPUTATION_POINTS, calculateLevel } = require('../models/User');

const router = express.Router();

// Configure multer for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.video, // Maximum file size (100MB)
  },
});

/**
 * POST /api/content/create
 * Create new content (draft or publish)
 */
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const contentData = {
      ...req.body,
      author_id: req.user.user_id,
    };

    // Validate content
    const validation = validateContent(contentData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Create content object
    const newContent = createDefaultContent(contentData);

    // Calculate AI quality score
    newContent.ai_metadata.quality_score = calculateQualityScore(newContent);

    // Insert content
    const result = await db
      .collection('user_generated_content')
      .insertOne(newContent);

    // If published, update user stats and reputation
    if (newContent.status === 'published') {
      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.user_id) },
        {
          $inc: {
            'stats.content_count': 1,
            'reputation.points': REPUTATION_POINTS.content_published,
          },
        }
      );

      // Update level based on new reputation
      const user = await db
        .collection('users')
        .findOne({ _id: new ObjectId(req.user.user_id) });
      const newLevel = calculateLevel(user.reputation.points);

      await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.user_id) },
        {
          $set: {
            'reputation.level': newLevel,
          },
        }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Content created successfully',
      content: {
        ...newContent,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create content',
    });
  }
});

/**
 * GET /api/content/feed
 * Get paginated content feed with filters
 */
router.get('/feed', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100 per page
    const category = req.query.category;
    const sort = req.query.sort || 'recent'; // recent, popular, trending

    // Build filter
    const filter = {
      status: 'published',
      visibility: 'public',
    };

    if (category) {
      filter.category = category;
    }

    // Build sort
    let sortOption = { created_at: -1 }; // Default: most recent

    if (sort === 'popular') {
      sortOption = { 'engagement.views': -1 };
    } else if (sort === 'trending') {
      // Trending = recent + high engagement
      sortOption = {
        'engagement.views': -1,
        created_at: -1,
      };
    }

    // Get total count
    const totalCount = await db
      .collection('user_generated_content')
      .countDocuments(filter);

    // Get content with pagination
    const content = await db
      .collection('user_generated_content')
      .find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Get author information for each content
    const contentWithAuthors = await Promise.all(
      content.map(async (item) => {
        const author = await db
          .collection('users')
          .findOne(
            { _id: item.author_id },
            { projection: { password_hash: 0 } }
          );

        return {
          ...item,
          author,
        };
      })
    );

    res.json({
      success: true,
      content: contentWithAuthors,
      pagination: {
        page,
        limit,
        total_pages: Math.ceil(totalCount / limit),
        total_count: totalCount,
      },
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content feed',
    });
  }
});

/**
 * GET /api/content/:id
 * Get single content with engagement stats
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const contentId = req.params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      });
    }

    // Get content
    const content = await db
      .collection('user_generated_content')
      .findOne({ _id: new ObjectId(contentId) });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Check visibility permissions
    if (content.visibility === 'private') {
      if (!req.user || req.user.user_id !== content.author_id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'This content is private',
        });
      }
    }

    // Increment view count
    await db
      .collection('user_generated_content')
      .updateOne(
        { _id: new ObjectId(contentId) },
        { $inc: { 'engagement.views': 1 } }
      );

    // Get author information
    const author = await db
      .collection('users')
      .findOne(
        { _id: content.author_id },
        { projection: { password_hash: 0 } }
      );

    res.json({
      success: true,
      content: {
        ...content,
        author,
      },
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content',
    });
  }
});

/**
 * PUT /api/content/:id
 * Update existing content (author only)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const contentId = req.params.id;

    if (!ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      });
    }

    // Get existing content
    const content = await db
      .collection('user_generated_content')
      .findOne({ _id: new ObjectId(contentId) });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Check if user is author
    if (content.author_id.toString() !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        error: 'You can only edit your own content',
      });
    }

    // Validate updates
    const validation = validateContent({ ...content, ...req.body });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Build update object
    const updateData = {
      updated_at: new Date(),
    };

    // Allowed fields to update
    const allowedFields = [
      'title',
      'description',
      'content',
      'tags',
      'category',
      'visibility',
      'status',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // If publishing for first time, set published_at
    if (updateData.status === 'published' && content.status !== 'published') {
      updateData.published_at = new Date();
    }

    // Update content
    await db
      .collection('user_generated_content')
      .updateOne({ _id: new ObjectId(contentId) }, { $set: updateData });

    // Get updated content
    const updatedContent = await db
      .collection('user_generated_content')
      .findOne({ _id: new ObjectId(contentId) });

    res.json({
      success: true,
      message: 'Content updated successfully',
      content: updatedContent,
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update content',
    });
  }
});

/**
 * DELETE /api/content/:id
 * Delete content (author only or admin)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const contentId = req.params.id;

    if (!ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      });
    }

    // Get content
    const content = await db
      .collection('user_generated_content')
      .findOne({ _id: new ObjectId(contentId) });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Check permissions (author or admin)
    if (
      content.author_id.toString() !== req.user.user_id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own content',
      });
    }

    // Delete content
    await db
      .collection('user_generated_content')
      .deleteOne({ _id: new ObjectId(contentId) });

    // Update user stats
    if (content.status === 'published') {
      await db.collection('users').updateOne(
        { _id: content.author_id },
        {
          $inc: {
            'stats.content_count': -1,
          },
        }
      );
    }

    res.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete content',
    });
  }
});

/**
 * POST /api/content/:id/like
 * Like/unlike content
 */
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const contentId = req.params.id;

    if (!ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      });
    }

    // Check if content exists
    const content = await db
      .collection('user_generated_content')
      .findOne({ _id: new ObjectId(contentId) });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Toggle like (increment or decrement)
    const action = req.body.action || 'like'; // "like" or "unlike"

    if (action === 'like') {
      await db
        .collection('user_generated_content')
        .updateOne(
          { _id: new ObjectId(contentId) },
          { $inc: { 'engagement.likes': 1 } }
        );

      // Award reputation to content author
      await db.collection('users').updateOne(
        { _id: content.author_id },
        {
          $inc: {
            'stats.total_likes': 1,
            'reputation.points': REPUTATION_POINTS.content_liked,
          },
        }
      );
    } else if (action === 'unlike') {
      await db.collection('user_generated_content').updateOne(
        { _id: new ObjectId(contentId) },
        {
          $inc: { 'engagement.likes': -1 },
        }
      );

      await db.collection('users').updateOne(
        { _id: content.author_id },
        {
          $inc: {
            'stats.total_likes': -1,
            'reputation.points': -REPUTATION_POINTS.content_liked,
          },
        }
      );
    }

    res.json({
      success: true,
      message: `Content ${action}d successfully`,
    });
  } catch (error) {
    console.error('Like content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like content',
    });
  }
});

/**
 * POST /api/content/:id/publish
 * Publish draft content
 */
router.post('/:id/publish', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const contentId = req.params.id;

    if (!ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      });
    }

    // Get content
    const content = await db
      .collection('user_generated_content')
      .findOne({ _id: new ObjectId(contentId) });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Check if user is author
    if (content.author_id.toString() !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        error: 'You can only publish your own content',
      });
    }

    // Check if already published
    if (content.status === 'published') {
      return res.status(400).json({
        success: false,
        error: 'Content is already published',
      });
    }

    // Publish content
    await db.collection('user_generated_content').updateOne(
      { _id: new ObjectId(contentId) },
      {
        $set: {
          status: 'published',
          published_at: new Date(),
        },
      }
    );

    // Update user stats
    await db.collection('users').updateOne(
      { _id: content.author_id },
      {
        $inc: {
          'stats.content_count': 1,
          'reputation.points': REPUTATION_POINTS.content_published,
        },
      }
    );

    res.json({
      success: true,
      message: 'Content published successfully',
    });
  } catch (error) {
    console.error('Publish content error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to publish content',
    });
  }
});

module.exports = router;
