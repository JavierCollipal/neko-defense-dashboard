/**
 * 💡 Community Ideas Routes
 * Trello-style idea board with voting system
 */

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const {
  requireAuth,
  optionalAuth,
  requireRole,
} = require('../middleware/auth');
const {
  IDEA_STATUSES,
  IDEA_CATEGORIES,
  createDefaultIdea,
  validateIdeaData,
  voteOnIdea,
  removeVote,
  updatePriorityScore,
} = require('../models/Idea');

/**
 * POST /api/ideas
 * Submit a new idea
 * Requires authentication
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;

    const { title, description, category, tags, attachments } = req.body;

    // Validate idea data
    const ideaData = {
      title,
      description,
      author_id: userId,
      category,
      tags,
      attachments,
    };

    const validation = validateIdeaData(ideaData);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    // Create idea document
    const newIdea = createDefaultIdea(ideaData);

    // Insert into database
    await db.collection('community_ideas').insertOne(newIdea);

    // Get author information
    const author = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      {
        projection: {
          username: 1,
          display_name: 1,
          avatar_url: 1,
          verified: 1,
        },
      }
    );

    newIdea.author = author;

    res.status(201).json({
      success: true,
      message: 'Idea submitted successfully!',
      idea: newIdea,
    });
  } catch (error) {
    console.error('Submit idea error:', error);
    res.status(500).json({ error: 'Failed to submit idea' });
  }
});

/**
 * GET /api/ideas
 * List ideas with filters
 *
 * Query params:
 * - status: Filter by status
 * - category: Filter by category
 * - author: Filter by author ID
 * - sort: 'recent', 'votes', 'priority' (default 'priority')
 * - page: Page number (default 1)
 * - limit: Results per page (default 20, max 100)
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const {
      status,
      category,
      author,
      sort = 'priority',
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (author) {
      query.author_id = new ObjectId(author);
    }

    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'recent':
        sortOptions = { created_at: -1 };
        break;
      case 'votes':
        sortOptions = { 'votes.score': -1, created_at: -1 };
        break;
      case 'priority':
      default:
        sortOptions = { priority_score: -1, created_at: -1 };
        break;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const ideas = await db
      .collection('community_ideas')
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Get total count for pagination
    const totalIdeas = await db
      .collection('community_ideas')
      .countDocuments(query);

    // Populate author information
    for (const idea of ideas) {
      if (idea.author_id) {
        const author = await db.collection('users').findOne(
          { _id: new ObjectId(idea.author_id) },
          {
            projection: {
              username: 1,
              display_name: 1,
              avatar_url: 1,
              verified: 1,
            },
          }
        );
        idea.author = author;
      }

      // Check if current user has voted
      if (req.user) {
        const userId = new ObjectId(req.user.user_id);
        idea.user_vote = null;

        if (idea.votes?.upvotes?.some((id) => id.equals(userId))) {
          idea.user_vote = 'upvote';
        } else if (idea.votes?.downvotes?.some((id) => id.equals(userId))) {
          idea.user_vote = 'downvote';
        }
      }
    }

    res.json({
      success: true,
      ideas,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalIdeas,
        pages: Math.ceil(totalIdeas / limitNum),
      },
    });
  } catch (error) {
    console.error('Fetch ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

/**
 * GET /api/ideas/top
 * Get top-voted ideas
 *
 * Query params:
 * - limit: Number of ideas to return (default 10, max 50)
 * - timeframe: 'all', '7d', '30d' (default 'all')
 */
router.get('/top', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { limit = 10, timeframe = 'all' } = req.query;

    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    // Build query with timeframe filter
    const query = {};

    if (timeframe !== 'all') {
      const now = new Date();
      let dateThreshold;

      switch (timeframe) {
        case '7d':
          dateThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          dateThreshold = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateThreshold = null;
      }

      if (dateThreshold) {
        query.created_at = { $gte: dateThreshold };
      }
    }

    const topIdeas = await db
      .collection('community_ideas')
      .find(query)
      .sort({ 'votes.score': -1, created_at: -1 })
      .limit(limitNum)
      .toArray();

    // Populate author information
    for (const idea of topIdeas) {
      if (idea.author_id) {
        const author = await db.collection('users').findOne(
          { _id: new ObjectId(idea.author_id) },
          {
            projection: {
              username: 1,
              display_name: 1,
              avatar_url: 1,
              verified: 1,
            },
          }
        );
        idea.author = author;
      }

      // Check if current user has voted
      if (req.user) {
        const userId = new ObjectId(req.user.user_id);
        idea.user_vote = null;

        if (idea.votes?.upvotes?.some((id) => id.equals(userId))) {
          idea.user_vote = 'upvote';
        } else if (idea.votes?.downvotes?.some((id) => id.equals(userId))) {
          idea.user_vote = 'downvote';
        }
      }
    }

    res.json({
      success: true,
      top_ideas: topIdeas,
      timeframe,
    });
  } catch (error) {
    console.error('Fetch top ideas error:', error);
    res.status(500).json({ error: 'Failed to fetch top ideas' });
  }
});

/**
 * GET /api/ideas/:id
 * Get single idea by ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const ideaId = new ObjectId(req.params.id);

    const idea = await db
      .collection('community_ideas')
      .findOne({ _id: ideaId });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Increment view count
    await db
      .collection('community_ideas')
      .updateOne({ _id: ideaId }, { $inc: { views: 1 } });

    idea.views += 1;

    // Populate author information
    if (idea.author_id) {
      const author = await db.collection('users').findOne(
        { _id: new ObjectId(idea.author_id) },
        {
          projection: {
            username: 1,
            display_name: 1,
            avatar_url: 1,
            verified: 1,
          },
        }
      );
      idea.author = author;
    }

    // Check if current user has voted
    if (req.user) {
      const userId = new ObjectId(req.user.user_id);
      idea.user_vote = null;

      if (idea.votes?.upvotes?.some((id) => id.equals(userId))) {
        idea.user_vote = 'upvote';
      } else if (idea.votes?.downvotes?.some((id) => id.equals(userId))) {
        idea.user_vote = 'downvote';
      }
    }

    res.json({
      success: true,
      idea,
    });
  } catch (error) {
    console.error('Fetch idea error:', error);
    res.status(500).json({ error: 'Failed to fetch idea' });
  }
});

/**
 * PUT /api/ideas/:id
 * Update an idea (author only)
 */
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const ideaId = new ObjectId(req.params.id);

    const idea = await db
      .collection('community_ideas')
      .findOne({ _id: ideaId });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Check if user is the author or a co-author
    const isAuthor = idea.author_id.equals(new ObjectId(userId));
    const isCoAuthor = idea.co_authors?.some((id) =>
      id.equals(new ObjectId(userId))
    );

    if (!isAuthor && !isCoAuthor) {
      return res
        .status(403)
        .json({ error: 'Only the author or co-authors can edit this idea' });
    }

    const { title, description, tags, attachments } = req.body;

    // Validate updates
    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || title.length < 5 || title.length > 200) {
        return res
          .status(400)
          .json({ error: 'Title must be between 5 and 200 characters' });
      }
      updates.title = title;
    }

    if (description !== undefined) {
      if (
        typeof description !== 'string' ||
        description.length < 10 ||
        description.length > 5000
      ) {
        return res.status(400).json({
          error: 'Description must be between 10 and 5000 characters',
        });
      }
      updates.description = description;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags) || tags.length > 10) {
        return res
          .status(400)
          .json({ error: 'Tags must be an array with maximum 10 items' });
      }
      updates.tags = tags;
    }

    if (attachments !== undefined) {
      if (!Array.isArray(attachments) || attachments.length > 5) {
        return res.status(400).json({
          error: 'Attachments must be an array with maximum 5 items',
        });
      }
      updates.attachments = attachments;
    }

    updates.updated_at = new Date();

    // Update idea
    await db
      .collection('community_ideas')
      .updateOne({ _id: ideaId }, { $set: updates });

    // Get updated idea
    const updatedIdea = await db
      .collection('community_ideas')
      .findOne({ _id: ideaId });

    // Populate author information
    if (updatedIdea.author_id) {
      const author = await db.collection('users').findOne(
        { _id: new ObjectId(updatedIdea.author_id) },
        {
          projection: {
            username: 1,
            display_name: 1,
            avatar_url: 1,
            verified: 1,
          },
        }
      );
      updatedIdea.author = author;
    }

    res.json({
      success: true,
      message: 'Idea updated successfully',
      idea: updatedIdea,
    });
  } catch (error) {
    console.error('Update idea error:', error);
    res.status(500).json({ error: 'Failed to update idea' });
  }
});

/**
 * DELETE /api/ideas/:id
 * Delete an idea (author only or admin)
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    const ideaId = new ObjectId(req.params.id);

    const idea = await db
      .collection('community_ideas')
      .findOne({ _id: ideaId });

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Check if user is the author or an admin
    const isAuthor = idea.author_id.equals(new ObjectId(userId));
    const isAdmin = userRole === 'admin' || userRole === 'moderator';

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ error: 'Only the author or admins can delete this idea' });
    }

    await db.collection('community_ideas').deleteOne({ _id: ideaId });

    res.json({
      success: true,
      message: 'Idea deleted successfully',
    });
  } catch (error) {
    console.error('Delete idea error:', error);
    res.status(500).json({ error: 'Failed to delete idea' });
  }
});

/**
 * POST /api/ideas/:id/vote
 * Vote on an idea (upvote or downvote)
 * Requires authentication
 *
 * Body: { voteType: 'upvote' | 'downvote' }
 */
router.post('/:id/vote', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const ideaId = new ObjectId(req.params.id);
    const { voteType } = req.body;

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return res
        .status(400)
        .json({ error: 'Invalid vote type. Must be "upvote" or "downvote"' });
    }

    const voteCounts = await voteOnIdea(db, ideaId, userId, voteType);

    res.json({
      success: true,
      message: `${voteType === 'upvote' ? 'Upvoted' : 'Downvoted'} successfully`,
      votes: voteCounts,
    });
  } catch (error) {
    console.error('Vote error:', error);
    res.status(500).json({ error: error.message || 'Failed to vote on idea' });
  }
});

/**
 * DELETE /api/ideas/:id/vote
 * Remove vote from an idea
 * Requires authentication
 */
router.delete('/:id/vote', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const ideaId = new ObjectId(req.params.id);

    const voteCounts = await removeVote(db, ideaId, userId);

    res.json({
      success: true,
      message: 'Vote removed successfully',
      votes: voteCounts,
    });
  } catch (error) {
    console.error('Remove vote error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove vote' });
  }
});

/**
 * PUT /api/ideas/:id/status
 * Update idea status (admin/moderator only)
 *
 * Body: { status: string, admin_notes?: string, implementation_link?: string }
 */
router.put(
  '/:id/status',
  requireAuth,
  requireRole(['admin', 'moderator']),
  async (req, res) => {
    try {
      const db = req.app.locals.db;
      const ideaId = new ObjectId(req.params.id);
      const { status, admin_notes, implementation_link } = req.body;

      if (!status || !Object.values(IDEA_STATUSES).includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${Object.values(IDEA_STATUSES).join(', ')}`,
        });
      }

      const idea = await db
        .collection('community_ideas')
        .findOne({ _id: ideaId });

      if (!idea) {
        return res.status(404).json({ error: 'Idea not found' });
      }

      const updates = {
        status,
        updated_at: new Date(),
      };

      if (admin_notes !== undefined) {
        updates.admin_notes = admin_notes;
      }

      if (implementation_link !== undefined) {
        updates.implementation_link = implementation_link;
      }

      if (status === IDEA_STATUSES.COMPLETED) {
        updates.completed_at = new Date();
      }

      await db
        .collection('community_ideas')
        .updateOne({ _id: ideaId }, { $set: updates });

      // Update priority score
      await updatePriorityScore(db, ideaId);

      // Get updated idea
      const updatedIdea = await db
        .collection('community_ideas')
        .findOne({ _id: ideaId });

      // Populate author information
      if (updatedIdea.author_id) {
        const author = await db.collection('users').findOne(
          { _id: new ObjectId(updatedIdea.author_id) },
          {
            projection: {
              username: 1,
              display_name: 1,
              avatar_url: 1,
              verified: 1,
            },
          }
        );
        updatedIdea.author = author;
      }

      res.json({
        success: true,
        message: 'Idea status updated successfully',
        idea: updatedIdea,
      });
    } catch (error) {
      console.error('Update status error:', error);
      res.status(500).json({ error: 'Failed to update idea status' });
    }
  }
);

/**
 * GET /api/ideas/stats
 * Get idea board statistics
 */
router.get('/stats/overview', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;

    const totalIdeas = await db.collection('community_ideas').countDocuments();

    const statusCounts = await db
      .collection('community_ideas')
      .aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const categoryCounts = await db
      .collection('community_ideas')
      .aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const stats = {
      total_ideas: totalIdeas,
      by_status: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      by_category: categoryCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Fetch stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
