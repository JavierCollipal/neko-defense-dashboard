/**
 * 🏅⚔️ Challenges & Contests Routes
 * Community challenges with submissions, judging, and winners
 */

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const {
  CHALLENGE_TYPES,
  CHALLENGE_STATUS,
  createDefaultChallenge,
  validateChallenge,
  updateChallengeStatus,
  registerForChallenge,
  submitToChallenge,
  scoreSubmission,
  determineWinners,
} = require('../models/Challenge');

/**
 * GET /api/challenges
 * Get all challenges with filters
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { status, type, featured, limit = 20, page = 1 } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const pageNum = Math.max(1, parseInt(page));
    const skip = (pageNum - 1) * limitNum;

    const challenges = await db
      .collection('challenges')
      .find(filter)
      .sort({ start_time: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Update statuses
    for (const challenge of challenges) {
      await updateChallengeStatus(db, challenge._id);
    }

    const total = await db.collection('challenges').countDocuments(filter);

    res.json({
      success: true,
      challenges,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_challenges: total,
        per_page: limitNum,
      },
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ error: 'Failed to fetch challenges' });
  }
});

/**
 * POST /api/challenges
 * Create new challenge (admin only)
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res
        .status(403)
        .json({ error: 'Only admins can create challenges' });
    }

    const challengeData = {
      ...req.body,
      created_by: new ObjectId(req.user.user_id),
    };

    // Validate challenge
    const validation = validateChallenge(challengeData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Create challenge
    const newChallenge = createDefaultChallenge(challengeData);
    const result = await db.collection('challenges').insertOne(newChallenge);

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully',
      challenge: {
        ...newChallenge,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
});

/**
 * GET /api/challenges/:id
 * Get single challenge
 */
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const challengeId = req.params.id;

    if (!ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }

    const challenge = await db
      .collection('challenges')
      .findOne({ _id: new ObjectId(challengeId) });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Update status
    await updateChallengeStatus(db, challenge._id);

    // Increment view count
    await db
      .collection('challenges')
      .updateOne({ _id: new ObjectId(challengeId) }, { $inc: { views: 1 } });

    // Get creator info
    const creator = await db.collection('users').findOne(
      { _id: challenge.created_by },
      {
        projection: {
          username: 1,
          display_name: 1,
          avatar_url: 1,
          verified: 1,
        },
      }
    );

    res.json({
      success: true,
      challenge: {
        ...challenge,
        creator,
      },
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

/**
 * POST /api/challenges/:id/register
 * Register for challenge
 */
router.post('/:id/register', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const challengeId = req.params.id;
    const userId = new ObjectId(req.user.user_id);

    if (!ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }

    const success = await registerForChallenge(
      db,
      new ObjectId(challengeId),
      userId
    );

    if (!success) {
      return res.status(400).json({
        error:
          'Could not register for challenge (already registered, full, or not available)',
      });
    }

    res.json({
      success: true,
      message: 'Successfully registered for challenge!',
    });
  } catch (error) {
    console.error('Register for challenge error:', error);
    res.status(500).json({ error: 'Failed to register for challenge' });
  }
});

/**
 * POST /api/challenges/:id/submit
 * Submit entry to challenge
 */
router.post('/:id/submit', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const challengeId = req.params.id;
    const userId = req.user.user_id;

    if (!ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }

    const { title, description, content_id, submission_url, attachments } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: 'Title and description are required',
      });
    }

    const submission = await submitToChallenge(db, new ObjectId(challengeId), {
      user_id: userId,
      title,
      description,
      content_id,
      submission_url,
      attachments: attachments || [],
    });

    if (!submission) {
      return res.status(400).json({
        error:
          'Could not submit entry (not registered, already submitted, or challenge not active)',
      });
    }

    // Emit Socket.io notification
    const io = req.app.locals.io;
    if (io) {
      io.to(`challenge:${challengeId}`).emit('new-submission', {
        submission,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Submission created successfully!',
      submission,
    });
  } catch (error) {
    console.error('Submit to challenge error:', error);
    res.status(500).json({ error: 'Failed to submit entry' });
  }
});

/**
 * GET /api/challenges/:id/submissions
 * Get all submissions for a challenge
 */
router.get('/:id/submissions', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const challengeId = req.params.id;

    if (!ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }

    const challenge = await db
      .collection('challenges')
      .findOne({ _id: new ObjectId(challengeId) });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Get submitters' user info
    const submissionsWithUsers = await Promise.all(
      challenge.submissions.map(async (submission) => {
        const user = await db.collection('users').findOne(
          { _id: submission.user_id },
          {
            projection: {
              username: 1,
              display_name: 1,
              avatar_url: 1,
              verified: 1,
            },
          }
        );

        return {
          ...submission,
          user,
        };
      })
    );

    res.json({
      success: true,
      submissions: submissionsWithUsers,
      total_submissions: challenge.total_submissions,
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

/**
 * POST /api/challenges/:id/score
 * Score a submission (judge only)
 */
router.post('/:id/score', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const challengeId = req.params.id;
    const judgeId = new ObjectId(req.user.user_id);

    if (!ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }

    const { submission_id, scores, comment } = req.body;

    if (!submission_id || !scores) {
      return res.status(400).json({
        error: 'Submission ID and scores are required',
      });
    }

    const success = await scoreSubmission(
      db,
      new ObjectId(challengeId),
      new ObjectId(submission_id),
      judgeId,
      scores,
      comment
    );

    if (!success) {
      return res.status(400).json({
        error: 'Could not score submission (not a judge or invalid submission)',
      });
    }

    res.json({
      success: true,
      message: 'Submission scored successfully',
    });
  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ error: 'Failed to score submission' });
  }
});

/**
 * POST /api/challenges/:id/determine-winners
 * Determine winners and award prizes (admin only)
 */
router.post('/:id/determine-winners', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const challengeId = req.params.id;

    if (!ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res
        .status(403)
        .json({ error: 'Only admins can determine winners' });
    }

    const winners = await determineWinners(db, new ObjectId(challengeId));

    if (winners.length === 0) {
      return res.status(400).json({
        error: 'No valid submissions to determine winners from',
      });
    }

    // Emit Socket.io notification for winners
    const io = req.app.locals.io;
    if (io) {
      for (const winner of winners) {
        io.to(`user:${winner.user_id.toString()}`).emit('notification', {
          type: 'challenge_win',
          title: 'Challenge Winner!',
          message: `🏆 You placed #${winner.place} in the challenge!`,
          time: new Date().toISOString(),
        });
      }
    }

    res.json({
      success: true,
      message: 'Winners determined and prizes awarded!',
      winners,
    });
  } catch (error) {
    console.error('Determine winners error:', error);
    res.status(500).json({ error: 'Failed to determine winners' });
  }
});

/**
 * GET /api/challenges/:id/leaderboard
 * Get challenge leaderboard (ranked submissions)
 */
router.get('/:id/leaderboard', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const challengeId = req.params.id;

    if (!ObjectId.isValid(challengeId)) {
      return res.status(400).json({ error: 'Invalid challenge ID' });
    }

    const challenge = await db
      .collection('challenges')
      .findOne({ _id: new ObjectId(challengeId) });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Sort submissions by average score
    const rankedSubmissions = challenge.submissions
      .filter((s) => !s.disqualified && s.scores.length > 0)
      .sort((a, b) => b.average_score - a.average_score)
      .map((submission, index) => ({
        rank: index + 1,
        submission_id: submission.submission_id,
        user_id: submission.user_id,
        title: submission.title,
        average_score: submission.average_score,
        final_rank: submission.final_rank,
        total_scores: submission.scores.length,
      }));

    // Get user info for leaderboard
    const leaderboardWithUsers = await Promise.all(
      rankedSubmissions.map(async (entry) => {
        const user = await db.collection('users').findOne(
          { _id: entry.user_id },
          {
            projection: {
              username: 1,
              display_name: 1,
              avatar_url: 1,
              verified: 1,
            },
          }
        );

        return {
          ...entry,
          user,
        };
      })
    );

    res.json({
      success: true,
      leaderboard: leaderboardWithUsers,
      total_entries: rankedSubmissions.length,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * GET /api/challenges/stats/overview
 * Get challenges statistics
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const db = req.app.locals.db;

    const totalChallenges = await db.collection('challenges').countDocuments();

    const activeChallenges = await db
      .collection('challenges')
      .countDocuments({ status: 'active' });

    const upcomingChallenges = await db
      .collection('challenges')
      .countDocuments({ status: 'upcoming' });

    const completedChallenges = await db
      .collection('challenges')
      .countDocuments({ status: 'completed' });

    // Get total participants and submissions
    const allChallenges = await db.collection('challenges').find({}).toArray();

    const totalParticipants = allChallenges.reduce(
      (sum, c) => sum + c.total_participants,
      0
    );
    const totalSubmissions = allChallenges.reduce(
      (sum, c) => sum + c.total_submissions,
      0
    );

    res.json({
      success: true,
      stats: {
        total_challenges: totalChallenges,
        active_challenges: activeChallenges,
        upcoming_challenges: upcomingChallenges,
        completed_challenges: completedChallenges,
        total_participants: totalParticipants,
        total_submissions: totalSubmissions,
      },
    });
  } catch (error) {
    console.error('Get challenge stats error:', error);
    res.status(500).json({ error: 'Failed to fetch challenge statistics' });
  }
});

module.exports = router;
