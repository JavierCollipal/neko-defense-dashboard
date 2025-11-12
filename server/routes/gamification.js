/**
 * 🏆🎮 Gamification Routes
 * Achievements, daily quests, leaderboards, and streaks
 */

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const {
  ACHIEVEMENTS,
  DAILY_QUESTS,
  checkAllAchievements,
  getDailyQuestProgress,
  completeDailyQuest,
  updateLoginStreak,
} = require('../models/Achievement');

/**
 * GET /api/gamification/achievements
 * Get all available achievements
 */
router.get('/achievements', optionalAuth, async (req, res) => {
  try {
    const { category, rarity, include_secret } = req.query;

    let achievements = Object.values(ACHIEVEMENTS);

    // Filter by category
    if (category) {
      achievements = achievements.filter((a) => a.category === category);
    }

    // Filter by rarity
    if (rarity) {
      achievements = achievements.filter((a) => a.rarity === rarity);
    }

    // Hide secret achievements unless user is authenticated
    if (!include_secret || !req.user) {
      achievements = achievements.filter((a) => !a.secret);
    }

    res.json({
      success: true,
      achievements,
      total: achievements.length,
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

/**
 * GET /api/gamification/my-achievements
 * Get current user's earned achievements
 * Requires authentication
 */
router.get('/my-achievements', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = new ObjectId(req.user.user_id);

    const user = await db.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const earnedBadges = user.reputation?.badges || [];
    const totalAchievements = Object.keys(ACHIEVEMENTS).length;
    const earnedCount = earnedBadges.length;
    const completionPercentage = (earnedCount / totalAchievements) * 100;

    // Group by category
    const byCategory = {};
    earnedBadges.forEach((badge) => {
      if (!byCategory[badge.category]) {
        byCategory[badge.category] = [];
      }
      byCategory[badge.category].push(badge);
    });

    res.json({
      success: true,
      earned_achievements: earnedBadges,
      stats: {
        total_earned: earnedCount,
        total_available: totalAchievements,
        completion_percentage: Math.round(completionPercentage),
        by_category: byCategory,
      },
    });
  } catch (error) {
    console.error('Get my achievements error:', error);
    res.status(500).json({ error: 'Failed to fetch achievements' });
  }
});

/**
 * POST /api/gamification/check-achievements
 * Check and award pending achievements for current user
 * Requires authentication
 */
router.post('/check-achievements', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = new ObjectId(req.user.user_id);

    const newlyEarned = await checkAllAchievements(db, userId);

    // Emit Socket.io notification for new achievements
    const io = req.app.locals.io;
    if (io && newlyEarned.length > 0) {
      io.to(`user:${req.user.user_id}`).emit('notification', {
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `You earned: ${newlyEarned.map((a) => `${a.icon} ${a.name}`).join(', ')}`,
        time: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      newly_earned: newlyEarned,
      count: newlyEarned.length,
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ error: 'Failed to check achievements' });
  }
});

/**
 * GET /api/gamification/daily-quests
 * Get daily quests with progress for current user
 * Requires authentication
 */
router.get('/daily-quests', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = new ObjectId(req.user.user_id);

    const quests = await getDailyQuestProgress(db, userId);

    const completed = quests.filter((q) => q.already_completed_today).length;
    const available = quests.length;
    const completionPercentage = (completed / available) * 100;

    res.json({
      success: true,
      quests,
      stats: {
        completed_today: completed,
        total_available: available,
        completion_percentage: Math.round(completionPercentage),
      },
    });
  } catch (error) {
    console.error('Get daily quests error:', error);
    res.status(500).json({ error: 'Failed to fetch daily quests' });
  }
});

/**
 * POST /api/gamification/daily-quests/:quest_id/complete
 * Complete a daily quest and claim rewards
 * Requires authentication
 */
router.post(
  '/daily-quests/:quest_id/complete',
  requireAuth,
  async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = new ObjectId(req.user.user_id);
      const questId = req.params.quest_id;

      const success = await completeDailyQuest(db, userId, questId);

      if (!success) {
        return res.status(400).json({
          error: 'Quest not completed or already claimed today',
        });
      }

      const quest = DAILY_QUESTS[questId];

      // Emit Socket.io notification
      const io = req.app.locals.io;
      if (io) {
        io.to(`user:${req.user.user_id}`).emit('notification', {
          type: 'quest_complete',
          title: 'Daily Quest Complete!',
          message: `${quest.icon} ${quest.name} - Earned ${quest.points} points`,
          time: new Date().toISOString(),
        });
      }

      res.json({
        success: true,
        message: 'Quest completed successfully',
        reward: {
          points: quest.points,
        },
      });
    } catch (error) {
      console.error('Complete daily quest error:', error);
      res.status(500).json({ error: 'Failed to complete quest' });
    }
  }
);

/**
 * POST /api/gamification/login-streak
 * Update login streak for current user
 * Requires authentication
 */
router.post('/login-streak', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = new ObjectId(req.user.user_id);

    const streak = await updateLoginStreak(db, userId);

    res.json({
      success: true,
      login_streak: streak,
    });
  } catch (error) {
    console.error('Update login streak error:', error);
    res.status(500).json({ error: 'Failed to update login streak' });
  }
});

/**
 * GET /api/gamification/leaderboard
 * Get leaderboard rankings
 *
 * Query params:
 * - timeframe: 'all', 'month', 'week' (default 'all')
 * - category: 'points', 'content', 'engagement' (default 'points')
 * - limit: Number of users to return (default 100, max 500)
 */
router.get('/leaderboard', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { timeframe = 'all', category = 'points', limit = 100 } = req.query;

    const limitNum = Math.min(500, Math.max(1, parseInt(limit)));

    let matchStage = {};
    let sortField = 'reputation.points';

    // Apply timeframe filter for content-based categories
    if (timeframe !== 'all' && category === 'content') {
      const now = new Date();
      let dateThreshold;

      switch (timeframe) {
        case 'week':
          dateThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateThreshold = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      if (dateThreshold) {
        matchStage.created_at = { $gte: dateThreshold };
      }
    }

    // Determine sort field
    switch (category) {
      case 'content':
        sortField = 'stats.content_count';
        break;
      case 'engagement':
        sortField = 'stats.total_views';
        break;
      case 'points':
      default:
        sortField = 'reputation.points';
        break;
    }

    const leaderboard = await db
      .collection('users')
      .find(matchStage, {
        projection: {
          username: 1,
          display_name: 1,
          avatar_url: 1,
          verified: 1,
          reputation: 1,
          stats: 1,
        },
      })
      .sort({ [sortField]: -1 })
      .limit(limitNum)
      .toArray();

    // Add ranking
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      user: {
        _id: user._id,
        username: user.username,
        display_name: user.display_name,
        avatar_url: user.avatar_url,
        verified: user.verified,
      },
      score: sortField.split('.').reduce((obj, key) => obj?.[key], user) || 0,
      reputation: user.reputation,
      stats: user.stats,
    }));

    // Find current user's rank if authenticated
    let currentUserRank = null;
    if (req.user) {
      const currentUserIndex = rankedLeaderboard.findIndex(
        (entry) => entry.user._id.toString() === req.user.user_id
      );
      if (currentUserIndex !== -1) {
        currentUserRank = currentUserIndex + 1;
      }
    }

    res.json({
      success: true,
      leaderboard: rankedLeaderboard,
      current_user_rank: currentUserRank,
      timeframe,
      category,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

/**
 * GET /api/gamification/stats
 * Get gamification statistics
 */
router.get('/stats', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;

    const totalUsers = await db.collection('users').countDocuments();

    const topPlayers = await db
      .collection('users')
      .find({}, { projection: { username: 1, 'reputation.points': 1 } })
      .sort({ 'reputation.points': -1 })
      .limit(3)
      .toArray();

    const achievementStats = await db
      .collection('users')
      .aggregate([
        { $unwind: '$reputation.badges' },
        {
          $group: {
            _id: '$reputation.badges.id',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    const totalBadgesAwarded = await db
      .collection('users')
      .aggregate([
        {
          $project: {
            badge_count: { $size: { $ifNull: ['$reputation.badges', []] } },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$badge_count' },
          },
        },
      ])
      .toArray();

    const stats = {
      total_users: totalUsers,
      total_achievements: Object.keys(ACHIEVEMENTS).length,
      total_badges_awarded: totalBadgesAwarded[0]?.total || 0,
      most_earned_achievements: achievementStats.map((stat) => ({
        achievement_id: stat._id,
        times_earned: stat.count,
      })),
      top_players: topPlayers.map((user) => ({
        username: user.username,
        points: user.reputation?.points || 0,
      })),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Get gamification stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
