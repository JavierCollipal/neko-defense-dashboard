/**
 * 🏆 Achievement & Badge System
 * Gamification features for user engagement
 */

const { ObjectId } = require('mongodb');

/**
 * Achievement Definitions
 * Each achievement has trigger conditions and rewards
 */
const ACHIEVEMENTS = {
  // Content Creation Achievements
  first_post: {
    id: 'first_post',
    name: 'First Steps',
    description: 'Publish your first content',
    icon: '🎯',
    category: 'content',
    rarity: 'common',
    points: 10,
    trigger: { type: 'content_published', count: 1 },
  },
  prolific_writer: {
    id: 'prolific_writer',
    name: 'Prolific Writer',
    description: 'Publish 10 pieces of content',
    icon: '📝',
    category: 'content',
    rarity: 'rare',
    points: 100,
    trigger: { type: 'content_published', count: 10 },
  },
  content_master: {
    id: 'content_master',
    name: 'Content Master',
    description: 'Publish 50 pieces of content',
    icon: '👑',
    category: 'content',
    rarity: 'epic',
    points: 500,
    trigger: { type: 'content_published', count: 50 },
  },

  // Engagement Achievements
  first_comment: {
    id: 'first_comment',
    name: 'Conversation Starter',
    description: 'Post your first comment',
    icon: '💬',
    category: 'engagement',
    rarity: 'common',
    points: 5,
    trigger: { type: 'comment_posted', count: 1 },
  },
  active_commenter: {
    id: 'active_commenter',
    name: 'Active Commenter',
    description: 'Post 100 comments',
    icon: '🗣️',
    category: 'engagement',
    rarity: 'rare',
    points: 150,
    trigger: { type: 'comment_posted', count: 100 },
  },
  popular_content: {
    id: 'popular_content',
    name: 'Rising Star',
    description: 'Get 100 views on a single piece of content',
    icon: '⭐',
    category: 'engagement',
    rarity: 'rare',
    points: 100,
    trigger: { type: 'content_views', count: 100 },
  },
  viral_content: {
    id: 'viral_content',
    name: 'Viral Sensation',
    description: 'Get 1000 views on a single piece of content',
    icon: '🌟',
    category: 'engagement',
    rarity: 'epic',
    points: 500,
    trigger: { type: 'content_views', count: 1000 },
  },

  // Community Achievements
  helpful_neko: {
    id: 'helpful_neko',
    name: 'Helpful Neko',
    description: 'Receive 100 likes on your comments',
    icon: '🐾',
    category: 'community',
    rarity: 'epic',
    points: 300,
    trigger: { type: 'comment_likes', count: 100 },
  },
  idea_champion: {
    id: 'idea_champion',
    name: 'Idea Champion',
    description: 'Submit 5 community ideas',
    icon: '💡',
    category: 'community',
    rarity: 'rare',
    points: 150,
    trigger: { type: 'ideas_submitted', count: 5 },
  },
  top_voter: {
    id: 'top_voter',
    name: 'Democracy Advocate',
    description: 'Vote on 50 community ideas',
    icon: '🗳️',
    category: 'community',
    rarity: 'rare',
    points: 100,
    trigger: { type: 'ideas_voted', count: 50 },
  },

  // Special Achievements
  night_owl: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Post content at 3 AM',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    points: 50,
    trigger: { type: 'post_at_hour', hour: 3 },
    secret: true,
  },
  speed_demon: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Publish 100 pieces of content in one month',
    icon: '⚡',
    category: 'special',
    rarity: 'legendary',
    points: 1000,
    trigger: { type: 'content_per_month', count: 100 },
    secret: true,
  },
  early_adopter: {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'One of the first 100 users',
    icon: '🎖️',
    category: 'special',
    rarity: 'legendary',
    points: 500,
    trigger: { type: 'user_rank', max_rank: 100 },
  },
  streak_master: {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 30-day login streak',
    icon: '🔥',
    category: 'special',
    rarity: 'epic',
    points: 300,
    trigger: { type: 'login_streak', days: 30 },
  },

  // Challenge Achievements
  challenge_winner: {
    id: 'challenge_winner',
    name: 'Challenge Winner',
    description: 'Win your first challenge',
    icon: '🏆',
    category: 'challenges',
    rarity: 'epic',
    points: 250,
    trigger: { type: 'challenge_won', count: 1 },
  },
  challenge_master: {
    id: 'challenge_master',
    name: 'Challenge Master',
    description: 'Win 5 challenges',
    icon: '👑',
    category: 'challenges',
    rarity: 'legendary',
    points: 1000,
    trigger: { type: 'challenge_won', count: 5 },
  },
};

/**
 * Daily Quest Definitions
 * Quests reset every 24 hours
 */
const DAILY_QUESTS = {
  daily_post: {
    id: 'daily_post',
    name: 'Daily Creator',
    description: 'Publish 1 piece of content today',
    icon: '📝',
    points: 10,
    trigger: { type: 'content_published', count: 1 },
  },
  daily_commenter: {
    id: 'daily_commenter',
    name: 'Daily Conversationalist',
    description: 'Post 3 comments today',
    icon: '💬',
    points: 15,
    trigger: { type: 'comment_posted', count: 3 },
  },
  daily_voter: {
    id: 'daily_voter',
    name: 'Daily Voter',
    description: 'Vote on 5 ideas today',
    icon: '🗳️',
    points: 10,
    trigger: { type: 'ideas_voted', count: 5 },
  },
  daily_discoverer: {
    id: 'daily_discoverer',
    name: 'Daily Explorer',
    description: 'Discover 5 new creators today',
    icon: '🔍',
    points: 20,
    trigger: { type: 'creators_discovered', count: 5 },
  },
  daily_reactor: {
    id: 'daily_reactor',
    name: 'Daily Reactor',
    description: 'React to 10 pieces of content today',
    icon: '😊',
    points: 15,
    trigger: { type: 'reactions_given', count: 10 },
  },
};

/**
 * Check if user has earned an achievement
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} userId - User ID
 * @param {Object} achievement - Achievement definition
 * @returns {Promise<boolean>} Whether achievement is earned
 */
async function checkAchievementEarned(db, userId, achievement) {
  const user = await db.collection('users').findOne({ _id: userId });
  if (!user) return false;

  // Check if already earned
  const alreadyEarned = user.reputation?.badges?.some(
    (badge) => badge.id === achievement.id
  );
  if (alreadyEarned) return false;

  const { trigger } = achievement;

  switch (trigger.type) {
    case 'content_published':
      return user.stats?.content_count >= trigger.count;

    case 'comment_posted':
      const commentCount = await db.collection('comments').countDocuments({
        author_id: userId,
        'moderation.removed': { $ne: true },
      });
      return commentCount >= trigger.count;

    case 'content_views':
      const contentWithViews = await db
        .collection('user_generated_content')
        .findOne({
          author_id: userId,
          'engagement.views': { $gte: trigger.count },
        });
      return !!contentWithViews;

    case 'comment_likes':
      return user.stats?.total_likes >= trigger.count;

    case 'ideas_submitted':
      const ideasCount = await db.collection('community_ideas').countDocuments({
        author_id: userId,
      });
      return ideasCount >= trigger.count;

    case 'ideas_voted':
      // Count ideas where user has voted
      const votedIdeas = await db.collection('community_ideas').countDocuments({
        $or: [{ 'votes.upvotes': userId }, { 'votes.downvotes': userId }],
      });
      return votedIdeas >= trigger.count;

    case 'post_at_hour':
      // Check if user has posted at specific hour
      const postAtHour = await db.collection('user_generated_content').findOne({
        author_id: userId,
        $expr: {
          $eq: [{ $hour: '$created_at' }, trigger.hour],
        },
      });
      return !!postAtHour;

    case 'content_per_month':
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const monthlyContent = await db
        .collection('user_generated_content')
        .countDocuments({
          author_id: userId,
          created_at: { $gte: oneMonthAgo },
        });
      return monthlyContent >= trigger.count;

    case 'user_rank':
      // User registration order
      const usersBeforeThis = await db.collection('users').countDocuments({
        created_at: { $lt: user.created_at },
      });
      return usersBeforeThis < trigger.max_rank;

    case 'login_streak':
      return (user.gamification?.login_streak || 0) >= trigger.days;

    case 'challenge_won':
      const challengesWon = await db.collection('challenges').countDocuments({
        'winners.user_id': userId,
      });
      return challengesWon >= trigger.count;

    default:
      return false;
  }
}

/**
 * Award achievement to user
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} userId - User ID
 * @param {Object} achievement - Achievement definition
 * @returns {Promise<boolean>} Success status
 */
async function awardAchievement(db, userId, achievement) {
  const earned = await checkAchievementEarned(db, userId, achievement);
  if (!earned) return false;

  const badge = {
    id: achievement.id,
    name: achievement.name,
    description: achievement.description,
    icon: achievement.icon,
    rarity: achievement.rarity,
    category: achievement.category,
    earned_at: new Date(),
  };

  await db.collection('users').updateOne(
    { _id: userId },
    {
      $push: { 'reputation.badges': badge },
      $inc: { 'reputation.points': achievement.points },
    }
  );

  return true;
}

/**
 * Check and award all pending achievements for user
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Array>} Newly earned achievements
 */
async function checkAllAchievements(db, userId) {
  const newlyEarned = [];

  for (const achievement of Object.values(ACHIEVEMENTS)) {
    const awarded = await awardAchievement(db, userId, achievement);
    if (awarded) {
      newlyEarned.push(achievement);
    }
  }

  return newlyEarned;
}

/**
 * Get user's daily quest progress
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Array>} Daily quests with progress
 */
async function getDailyQuestProgress(db, userId) {
  const user = await db.collection('users').findOne({ _id: userId });
  if (!user) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const quests = [];

  for (const quest of Object.values(DAILY_QUESTS)) {
    let current = 0;
    const target = quest.trigger.count;

    switch (quest.trigger.type) {
      case 'content_published':
        current = await db.collection('user_generated_content').countDocuments({
          author_id: userId,
          created_at: { $gte: today },
        });
        break;

      case 'comment_posted':
        current = await db.collection('comments').countDocuments({
          author_id: userId,
          created_at: { $gte: today },
        });
        break;

      case 'ideas_voted':
        // Count votes made today (approximate - would need vote timestamp)
        current = 0; // Would need to track vote timestamps
        break;

      case 'reactions_given':
        current = 0; // Would need to track reaction timestamps
        break;

      case 'creators_discovered':
        current = 0; // Would need to track discovery events
        break;
    }

    const completed = current >= target;
    const alreadyCompleted = user.gamification?.daily_quests?.some(
      (q) => q.id === quest.id && q.completed_at > today
    );

    quests.push({
      ...quest,
      progress: {
        current,
        target,
        percentage: Math.min(100, (current / target) * 100),
      },
      completed: completed && !alreadyCompleted,
      already_completed_today: alreadyCompleted,
    });
  }

  return quests;
}

/**
 * Complete a daily quest and award points
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} userId - User ID
 * @param {string} questId - Quest ID
 * @returns {Promise<boolean>} Success status
 */
async function completeDailyQuest(db, userId, questId) {
  const quest = DAILY_QUESTS[questId];
  if (!quest) return false;

  const quests = await getDailyQuestProgress(db, userId);
  const questProgress = quests.find((q) => q.id === questId);

  if (
    !questProgress ||
    !questProgress.completed ||
    questProgress.already_completed_today
  ) {
    return false;
  }

  await db.collection('users').updateOne(
    { _id: userId },
    {
      $push: {
        'gamification.daily_quests': {
          id: questId,
          completed_at: new Date(),
        },
      },
      $inc: { 'reputation.points': quest.points },
    }
  );

  return true;
}

/**
 * Update user login streak
 * @param {Object} db - MongoDB database instance
 * @param {ObjectId} userId - User ID
 * @returns {Promise<number>} Current streak
 */
async function updateLoginStreak(db, userId) {
  const user = await db.collection('users').findOne({ _id: userId });
  if (!user) return 0;

  const now = new Date();
  const lastLogin = user.gamification?.last_login;
  let streak = user.gamification?.login_streak || 0;

  if (!lastLogin) {
    streak = 1;
  } else {
    const lastLoginDate = new Date(lastLogin);
    const daysSinceLastLogin = Math.floor(
      (now - lastLoginDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastLogin === 0) {
      // Same day, no change
      return streak;
    } else if (daysSinceLastLogin === 1) {
      // Consecutive day
      streak += 1;
    } else {
      // Streak broken
      streak = 1;
    }
  }

  await db.collection('users').updateOne(
    { _id: userId },
    {
      $set: {
        'gamification.last_login': now,
        'gamification.login_streak': streak,
      },
    }
  );

  // Check for streak achievements
  await checkAllAchievements(db, userId);

  return streak;
}

module.exports = {
  ACHIEVEMENTS,
  DAILY_QUESTS,
  checkAchievementEarned,
  awardAchievement,
  checkAllAchievements,
  getDailyQuestProgress,
  completeDailyQuest,
  updateLoginStreak,
};
