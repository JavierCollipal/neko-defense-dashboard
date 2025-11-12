/**
 * 💡 Community Idea Model
 * Trello-style idea board for feature requests and suggestions
 */

const { ObjectId } = require('mongodb');

/**
 * Idea Statuses
 */
const IDEA_STATUSES = {
  PROPOSED: 'proposed',
  REVIEWING: 'reviewing',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

/**
 * Idea Categories
 */
const IDEA_CATEGORIES = {
  FEATURE: 'feature',
  IMPROVEMENT: 'improvement',
  BUG: 'bug',
  CONTENT: 'content',
  DESIGN: 'design',
  OTHER: 'other',
};

/**
 * Calculate priority score for an idea
 * Formula: voteScore * 10 + engagementScore * 0.5 + recencyBoost * 5
 *
 * @param {Object} idea - The idea document
 * @returns {number} Priority score
 */
function calculatePriorityScore(idea) {
  const daysOld =
    (Date.now() - new Date(idea.created_at).getTime()) / (1000 * 60 * 60 * 24);
  const voteScore = idea.votes?.score || 0;
  const engagementScore = (idea.comments_count || 0) * 2 + (idea.views || 0);

  // Recency boost (newer ideas get slight boost, diminishes over 30 days)
  const recencyBoost = Math.max(0, 1 - daysOld / 30);

  return voteScore * 10 + engagementScore * 0.5 + recencyBoost * 5;
}

/**
 * Create a default idea structure
 * @param {Object} ideaData - Initial idea data
 * @returns {Object} Complete idea document
 */
function createDefaultIdea(ideaData) {
  const now = new Date();

  return {
    _id: new ObjectId(),
    title: ideaData.title,
    description: ideaData.description,
    author_id: new ObjectId(ideaData.author_id),
    co_authors: ideaData.co_authors?.map((id) => new ObjectId(id)) || [],
    category: ideaData.category || IDEA_CATEGORIES.FEATURE,
    status: ideaData.status || IDEA_STATUSES.PROPOSED,
    votes: {
      upvotes: [], // Array of user ObjectIds who upvoted
      downvotes: [], // Array of user ObjectIds who downvoted
      score: 0, // upvotes.length - downvotes.length
    },
    priority_score: 0, // Auto-calculated
    tags: ideaData.tags || [],
    attachments: ideaData.attachments || [],
    admin_notes: ideaData.admin_notes || '',
    implementation_link: ideaData.implementation_link || '', // GitHub PR/issue link
    views: 0,
    comments_count: 0,
    created_at: now,
    updated_at: now,
    completed_at: null,
  };
}

/**
 * Validate idea data
 * @param {Object} ideaData - Idea data to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateIdeaData(ideaData) {
  const errors = [];

  // Required fields
  if (!ideaData.title || typeof ideaData.title !== 'string') {
    errors.push('Title is required and must be a string');
  } else if (ideaData.title.length < 5) {
    errors.push('Title must be at least 5 characters long');
  } else if (ideaData.title.length > 200) {
    errors.push('Title must be at most 200 characters long');
  }

  if (!ideaData.description || typeof ideaData.description !== 'string') {
    errors.push('Description is required and must be a string');
  } else if (ideaData.description.length < 10) {
    errors.push('Description must be at least 10 characters long');
  } else if (ideaData.description.length > 5000) {
    errors.push('Description must be at most 5000 characters long');
  }

  if (!ideaData.author_id) {
    errors.push('Author ID is required');
  }

  // Category validation
  if (
    ideaData.category &&
    !Object.values(IDEA_CATEGORIES).includes(ideaData.category)
  ) {
    errors.push(
      `Invalid category. Must be one of: ${Object.values(IDEA_CATEGORIES).join(', ')}`
    );
  }

  // Status validation
  if (
    ideaData.status &&
    !Object.values(IDEA_STATUSES).includes(ideaData.status)
  ) {
    errors.push(
      `Invalid status. Must be one of: ${Object.values(IDEA_STATUSES).join(', ')}`
    );
  }

  // Tags validation
  if (ideaData.tags) {
    if (!Array.isArray(ideaData.tags)) {
      errors.push('Tags must be an array');
    } else if (ideaData.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    } else {
      // Validate each tag
      for (const tag of ideaData.tags) {
        if (typeof tag !== 'string' || tag.length < 2 || tag.length > 50) {
          errors.push('Each tag must be a string between 2 and 50 characters');
          break;
        }
      }
    }
  }

  // Attachments validation
  if (ideaData.attachments) {
    if (!Array.isArray(ideaData.attachments)) {
      errors.push('Attachments must be an array');
    } else if (ideaData.attachments.length > 5) {
      errors.push('Maximum 5 attachments allowed');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Update idea priority score
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} ideaId - Idea ID
 * @returns {Promise<number>} Updated priority score
 */
async function updatePriorityScore(db, ideaId) {
  const idea = await db.collection('community_ideas').findOne({ _id: ideaId });

  if (!idea) {
    throw new Error('Idea not found');
  }

  const priorityScore = calculatePriorityScore(idea);

  await db.collection('community_ideas').updateOne(
    { _id: ideaId },
    {
      $set: {
        priority_score: priorityScore,
        updated_at: new Date(),
      },
    }
  );

  return priorityScore;
}

/**
 * Vote on an idea (upvote or downvote)
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} ideaId - Idea ID
 * @param {ObjectId} userId - User ID
 * @param {string} voteType - 'upvote' or 'downvote'
 * @returns {Promise<Object>} Updated vote counts
 */
async function voteOnIdea(db, ideaId, userId, voteType) {
  const idea = await db.collection('community_ideas').findOne({ _id: ideaId });

  if (!idea) {
    throw new Error('Idea not found');
  }

  const userIdObj = new ObjectId(userId);
  const upvotes = idea.votes?.upvotes || [];
  const downvotes = idea.votes?.downvotes || [];

  // Remove user from both arrays first
  const newUpvotes = upvotes.filter((id) => !id.equals(userIdObj));
  const newDownvotes = downvotes.filter((id) => !id.equals(userIdObj));

  // Add to appropriate array
  if (voteType === 'upvote') {
    newUpvotes.push(userIdObj);
  } else if (voteType === 'downvote') {
    newDownvotes.push(userIdObj);
  }

  const voteScore = newUpvotes.length - newDownvotes.length;

  await db.collection('community_ideas').updateOne(
    { _id: ideaId },
    {
      $set: {
        'votes.upvotes': newUpvotes,
        'votes.downvotes': newDownvotes,
        'votes.score': voteScore,
        updated_at: new Date(),
      },
    }
  );

  // Update priority score
  await updatePriorityScore(db, ideaId);

  return {
    upvotes: newUpvotes.length,
    downvotes: newDownvotes.length,
    score: voteScore,
  };
}

/**
 * Remove vote from an idea
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} ideaId - Idea ID
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Object>} Updated vote counts
 */
async function removeVote(db, ideaId, userId) {
  const idea = await db.collection('community_ideas').findOne({ _id: ideaId });

  if (!idea) {
    throw new Error('Idea not found');
  }

  const userIdObj = new ObjectId(userId);
  const newUpvotes = (idea.votes?.upvotes || []).filter(
    (id) => !id.equals(userIdObj)
  );
  const newDownvotes = (idea.votes?.downvotes || []).filter(
    (id) => !id.equals(userIdObj)
  );
  const voteScore = newUpvotes.length - newDownvotes.length;

  await db.collection('community_ideas').updateOne(
    { _id: ideaId },
    {
      $set: {
        'votes.upvotes': newUpvotes,
        'votes.downvotes': newDownvotes,
        'votes.score': voteScore,
        updated_at: new Date(),
      },
    }
  );

  // Update priority score
  await updatePriorityScore(db, ideaId);

  return {
    upvotes: newUpvotes.length,
    downvotes: newDownvotes.length,
    score: voteScore,
  };
}

module.exports = {
  IDEA_STATUSES,
  IDEA_CATEGORIES,
  createDefaultIdea,
  validateIdeaData,
  calculatePriorityScore,
  updatePriorityScore,
  voteOnIdea,
  removeVote,
};
