/**
 * 💬 Comments Routes
 * Part of Neko Dashboard UGC Platform
 *
 * Handles comments, replies, reactions, and moderation
 */

const express = require('express');
const { ObjectId } = require('mongodb');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const {
  createDefaultComment,
  validateComment,
  extractMentions,
  isValidReaction,
  getReactionCounts,
  NEKO_REACTIONS,
} = require('../models/Comment');
const { REPUTATION_POINTS } = require('../models/User');

const router = express.Router();

/**
 * POST /api/comments
 * Post new comment
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const commentData = {
      ...req.body,
      author_id: req.user.user_id,
    };

    // Validate comment
    const validation = validateComment(commentData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      });
    }

    // Verify content exists
    const content = await db
      .collection('user_generated_content')
      .findOne({ _id: new ObjectId(commentData.content_id) });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Extract mentions
    const mentionedUsernames = extractMentions(commentData.text);

    // Get mentioned user IDs
    const mentionedUsers = await db
      .collection('users')
      .find({ username: { $in: mentionedUsernames } })
      .toArray();

    const mentionIds = mentionedUsers.map((user) => user._id);

    // Create comment
    const newComment = createDefaultComment({
      ...commentData,
      mentions: mentionIds,
    });

    // Insert comment
    const result = await db.collection('comments').insertOne(newComment);

    // Update content comment count
    await db
      .collection('user_generated_content')
      .updateOne(
        { _id: new ObjectId(commentData.content_id) },
        { $inc: { 'engagement.comments': 1 } }
      );

    // Award reputation to commenter
    await db.collection('users').updateOne(
      { _id: new ObjectId(req.user.user_id) },
      {
        $inc: {
          'reputation.points': REPUTATION_POINTS.comment_posted,
        },
      }
    );

    res.status(201).json({
      success: true,
      message: 'Comment posted successfully',
      comment: {
        ...newComment,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error('Post comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to post comment',
    });
  }
});

/**
 * GET /api/comments/:content_id
 * Get all comments for a piece of content
 */
router.get('/:content_id', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const contentId = req.params.content_id;

    if (!ObjectId.isValid(contentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid content ID',
      });
    }

    // Get all comments for this content
    const comments = await db
      .collection('comments')
      .find({
        content_id: new ObjectId(contentId),
        'moderation.removed': { $ne: true },
      })
      .sort({ created_at: -1 })
      .toArray();

    // Get author information for each comment
    const commentsWithAuthors = await Promise.all(
      comments.map(async (comment) => {
        const author = await db.collection('users').findOne(
          { _id: comment.author_id },
          {
            projection: {
              password_hash: 0,
              email: 0,
              moderation: 0,
            },
          }
        );

        // Get reaction counts
        const reactionCounts = getReactionCounts(comment.reactions);

        return {
          ...comment,
          author,
          reaction_counts: reactionCounts,
        };
      })
    );

    // Organize comments into threaded structure
    const topLevelComments = commentsWithAuthors.filter(
      (c) => !c.parent_comment_id
    );
    const replies = commentsWithAuthors.filter((c) => c.parent_comment_id);

    // Attach replies to parent comments
    const threaded = topLevelComments.map((comment) => {
      const commentReplies = replies.filter(
        (r) => r.parent_comment_id.toString() === comment._id.toString()
      );

      return {
        ...comment,
        replies: commentReplies,
      };
    });

    res.json({
      success: true,
      comments: threaded,
      total_count: comments.length,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch comments',
    });
  }
});

/**
 * PUT /api/comments/:id
 * Edit comment (author only)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const commentId = req.params.id;
    const { text } = req.body;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid comment ID',
      });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Comment text is required',
      });
    }

    if (text.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Comment must be at most 1000 characters',
      });
    }

    // Get comment
    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }

    // Check if user is author
    if (comment.author_id.toString() !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        error: 'You can only edit your own comments',
      });
    }

    // Extract new mentions
    const mentionedUsernames = extractMentions(text);
    const mentionedUsers = await db
      .collection('users')
      .find({ username: { $in: mentionedUsernames } })
      .toArray();
    const mentionIds = mentionedUsers.map((user) => user._id);

    // Add current text to edit history
    const editHistory = comment.edit_history || [];
    editHistory.push({
      text: comment.text,
      edited_at: new Date(),
    });

    // Update comment
    await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: {
          text,
          mentions: mentionIds,
          is_edited: true,
          edit_history: editHistory,
          updated_at: new Date(),
        },
      }
    );

    // Get updated comment
    const updatedComment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(commentId) });

    res.json({
      success: true,
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (error) {
    console.error('Edit comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to edit comment',
    });
  }
});

/**
 * DELETE /api/comments/:id
 * Delete comment (author only or admin)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const commentId = req.params.id;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid comment ID',
      });
    }

    // Get comment
    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }

    // Check permissions
    if (
      comment.author_id.toString() !== req.user.user_id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own comments',
      });
    }

    // Delete comment
    await db.collection('comments').deleteOne({ _id: new ObjectId(commentId) });

    // Update content comment count
    await db.collection('user_generated_content').updateOne(
      { _id: comment.content_id },
      {
        $inc: { 'engagement.comments': -1 },
      }
    );

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete comment',
    });
  }
});

/**
 * POST /api/comments/:id/react
 * Add reaction to comment
 */
router.post('/:id/react', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const commentId = req.params.id;
    const { emoji } = req.body;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid comment ID',
      });
    }

    if (!emoji) {
      return res.status(400).json({
        success: false,
        error: 'Emoji is required',
      });
    }

    if (!isValidReaction(emoji)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid emoji reaction',
        valid_reactions: NEKO_REACTIONS,
      });
    }

    // Get comment
    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }

    // Check if user already reacted with this emoji
    const existingReaction = comment.reactions.find(
      (r) => r.user_id.toString() === req.user.user_id && r.emoji === emoji
    );

    if (existingReaction) {
      return res.status(400).json({
        success: false,
        error: 'You already reacted with this emoji',
      });
    }

    // Add reaction
    const newReaction = {
      user_id: new ObjectId(req.user.user_id),
      emoji,
      created_at: new Date(),
    };

    await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      {
        $push: { reactions: newReaction },
      }
    );

    // Award reputation to comment author
    await db.collection('users').updateOne(
      { _id: comment.author_id },
      {
        $inc: {
          'reputation.points': REPUTATION_POINTS.comment_liked,
        },
      }
    );

    res.json({
      success: true,
      message: 'Reaction added successfully',
    });
  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add reaction',
    });
  }
});

/**
 * DELETE /api/comments/:id/react
 * Remove reaction from comment
 */
router.delete('/:id/react', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const commentId = req.params.id;
    const { emoji } = req.body;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid comment ID',
      });
    }

    if (!emoji) {
      return res.status(400).json({
        success: false,
        error: 'Emoji is required',
      });
    }

    // Get comment
    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }

    // Remove reaction
    await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      {
        $pull: {
          reactions: {
            user_id: new ObjectId(req.user.user_id),
            emoji,
          },
        },
      }
    );

    // Remove reputation from comment author
    await db.collection('users').updateOne(
      { _id: comment.author_id },
      {
        $inc: {
          'reputation.points': -REPUTATION_POINTS.comment_liked,
        },
      }
    );

    res.json({
      success: true,
      message: 'Reaction removed successfully',
    });
  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove reaction',
    });
  }
});

/**
 * POST /api/comments/:id/pin
 * Pin comment (content creator only)
 */
router.post('/:id/pin', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const commentId = req.params.id;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid comment ID',
      });
    }

    // Get comment
    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }

    // Get content
    const content = await db
      .collection('user_generated_content')
      .findOne({ _id: comment.content_id });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Check if user is content creator
    if (content.author_id.toString() !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        error: 'Only the content creator can pin comments',
      });
    }

    // Unpin all other comments on this content
    await db.collection('comments').updateMany(
      { content_id: comment.content_id },
      {
        $set: { is_pinned: false },
      }
    );

    // Pin this comment
    await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: { is_pinned: true },
      }
    );

    res.json({
      success: true,
      message: 'Comment pinned successfully',
    });
  } catch (error) {
    console.error('Pin comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to pin comment',
    });
  }
});

/**
 * POST /api/comments/:id/flag
 * Report comment for moderation
 */
router.post('/:id/flag', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const commentId = req.params.id;
    const { reason } = req.body;

    if (!ObjectId.isValid(commentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid comment ID',
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Reason for flagging is required',
      });
    }

    // Get comment
    const comment = await db
      .collection('comments')
      .findOne({ _id: new ObjectId(commentId) });

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }

    // Update comment flag count
    await db.collection('comments').updateOne(
      { _id: new ObjectId(commentId) },
      {
        $set: { 'moderation.flagged': true },
        $inc: { 'moderation.flag_count': 1 },
      }
    );

    // Create moderation queue entry
    await db.collection('moderation_queue').insertOne({
      content_id: new ObjectId(commentId),
      content_type: 'comment',
      flagged_by: [new ObjectId(req.user.user_id)],
      flag_reasons: [reason],
      status: 'pending',
      created_at: new Date(),
    });

    res.json({
      success: true,
      message: 'Comment flagged for review',
    });
  } catch (error) {
    console.error('Flag comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to flag comment',
    });
  }
});

/**
 * GET /api/comments/reactions/list
 * Get list of available reactions
 */
router.get('/reactions/list', (req, res) => {
  res.json({
    success: true,
    reactions: NEKO_REACTIONS,
  });
});

module.exports = router;
