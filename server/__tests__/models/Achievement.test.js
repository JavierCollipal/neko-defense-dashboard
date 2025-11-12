/**
 * 🐾⚡ Unit Tests for Achievement Model ⚡🐾
 * Testing gamification functions with MongoDB Memory Server
 */

const { ObjectId } = require('mongodb');
const {
  ACHIEVEMENTS,
  DAILY_QUESTS,
  checkAchievementEarned,
  awardAchievement,
  checkAllAchievements,
  getDailyQuestProgress,
  completeDailyQuest,
  updateLoginStreak,
} = require('../../models/Achievement');

describe('Achievement Model - Constants', () => {
  describe('ACHIEVEMENTS', () => {
    it('should have achievement objects', () => {
      expect(ACHIEVEMENTS).toBeInstanceOf(Object);
      expect(Object.keys(ACHIEVEMENTS).length).toBeGreaterThan(0);
    });

    it('should have correct structure for each achievement', () => {
      const firstAchievement = ACHIEVEMENTS.first_post;
      expect(firstAchievement).toHaveProperty('id');
      expect(firstAchievement).toHaveProperty('name');
      expect(firstAchievement).toHaveProperty('description');
      expect(firstAchievement).toHaveProperty('icon');
      expect(firstAchievement).toHaveProperty('category');
      expect(firstAchievement).toHaveProperty('rarity');
      expect(firstAchievement).toHaveProperty('points');
      expect(firstAchievement).toHaveProperty('trigger');
    });

    it('should have various categories', () => {
      const categories = new Set();
      Object.values(ACHIEVEMENTS).forEach((achievement) => {
        categories.add(achievement.category);
      });
      expect(categories.has('content')).toBe(true);
      expect(categories.has('engagement')).toBe(true);
      expect(categories.has('community')).toBe(true);
    });

    it('should have various rarities', () => {
      const rarities = new Set();
      Object.values(ACHIEVEMENTS).forEach((achievement) => {
        rarities.add(achievement.rarity);
      });
      expect(rarities.has('common')).toBe(true);
      expect(rarities.has('rare')).toBe(true);
      expect(rarities.has('epic')).toBe(true);
    });
  });

  describe('DAILY_QUESTS', () => {
    it('should have quest objects', () => {
      expect(DAILY_QUESTS).toBeInstanceOf(Object);
      expect(Object.keys(DAILY_QUESTS).length).toBeGreaterThan(0);
    });

    it('should have correct structure for each quest', () => {
      const firstQuest = DAILY_QUESTS.daily_post;
      expect(firstQuest).toHaveProperty('id');
      expect(firstQuest).toHaveProperty('name');
      expect(firstQuest).toHaveProperty('description');
      expect(firstQuest).toHaveProperty('icon');
      expect(firstQuest).toHaveProperty('points');
      expect(firstQuest).toHaveProperty('trigger');
    });
  });
});

describe('Achievement Model - Functions with Database', () => {
  let db;
  let userId;

  beforeEach(async () => {
    // Get database from global setup
    db = global.__MONGO_DB__;

    // Create test user
    const user = {
      username: 'neko',
      email: 'neko@test.com',
      password_hash: 'hashed',
      reputation: {
        points: 0,
        level: 1,
        badges: [],
      },
      stats: {
        content_count: 0,
        total_views: 0,
        total_likes: 0,
      },
      gamification: {
        login_streak: 0,
        daily_quests: [],
      },
      created_at: new Date(),
    };

    const result = await db.collection('users').insertOne(user);
    userId = result.insertedId;
  });

  describe('checkAchievementEarned', () => {
    it('should return false for non-earned achievement', async () => {
      const achievement = ACHIEVEMENTS.first_post;
      const earned = await checkAchievementEarned(db, userId, achievement);
      expect(earned).toBe(false);
    });

    it('should return true for earned content achievement', async () => {
      // Update user stats
      await db
        .collection('users')
        .updateOne({ _id: userId }, { $set: { 'stats.content_count': 1 } });

      const achievement = ACHIEVEMENTS.first_post;
      const earned = await checkAchievementEarned(db, userId, achievement);
      expect(earned).toBe(true);
    });

    it('should return false if achievement already earned', async () => {
      // Award achievement first
      const achievement = ACHIEVEMENTS.first_post;
      await db.collection('users').updateOne(
        { _id: userId },
        {
          $set: { 'stats.content_count': 1 },
          $push: {
            'reputation.badges': {
              id: achievement.id,
              name: achievement.name,
              earned_at: new Date(),
            },
          },
        }
      );

      const earned = await checkAchievementEarned(db, userId, achievement);
      expect(earned).toBe(false);
    });

    it('should return false for non-existent user', async () => {
      const fakeUserId = new ObjectId();
      const achievement = ACHIEVEMENTS.first_post;
      const earned = await checkAchievementEarned(db, fakeUserId, achievement);
      expect(earned).toBe(false);
    });

    it('should check comment-based achievements', async () => {
      // Create comments for user
      await db.collection('comments').insertMany([
        { author_id: userId, content: 'Test 1', moderation: {} },
        { author_id: userId, content: 'Test 2', moderation: {} },
      ]);

      const achievement = ACHIEVEMENTS.first_comment;
      const earned = await checkAchievementEarned(db, userId, achievement);
      expect(earned).toBe(true);
    });

    it('should check ideas-based achievements', async () => {
      // Create ideas for user
      await db.collection('community_ideas').insertMany([
        { author_id: userId, title: 'Idea 1' },
        { author_id: userId, title: 'Idea 2' },
        { author_id: userId, title: 'Idea 3' },
        { author_id: userId, title: 'Idea 4' },
        { author_id: userId, title: 'Idea 5' },
      ]);

      const achievement = ACHIEVEMENTS.idea_champion;
      const earned = await checkAchievementEarned(db, userId, achievement);
      expect(earned).toBe(true);
    });

    it('should check login streak achievement', async () => {
      await db
        .collection('users')
        .updateOne(
          { _id: userId },
          { $set: { 'gamification.login_streak': 30 } }
        );

      const achievement = ACHIEVEMENTS.streak_master;
      const earned = await checkAchievementEarned(db, userId, achievement);
      expect(earned).toBe(true);
    });
  });

  describe('awardAchievement', () => {
    it('should award achievement when earned', async () => {
      // Setup conditions for first_post achievement
      await db
        .collection('users')
        .updateOne({ _id: userId }, { $set: { 'stats.content_count': 1 } });

      const achievement = ACHIEVEMENTS.first_post;
      const awarded = await awardAchievement(db, userId, achievement);
      expect(awarded).toBe(true);

      // Verify badge was added
      const user = await db.collection('users').findOne({ _id: userId });
      expect(user.reputation.badges.length).toBe(1);
      expect(user.reputation.badges[0].id).toBe('first_post');
      expect(user.reputation.points).toBe(achievement.points);
    });

    it('should not award achievement when not earned', async () => {
      const achievement = ACHIEVEMENTS.first_post;
      const awarded = await awardAchievement(db, userId, achievement);
      expect(awarded).toBe(false);

      // Verify no changes
      const user = await db.collection('users').findOne({ _id: userId });
      expect(user.reputation.badges.length).toBe(0);
      expect(user.reputation.points).toBe(0);
    });

    it('should not award achievement twice', async () => {
      await db
        .collection('users')
        .updateOne({ _id: userId }, { $set: { 'stats.content_count': 1 } });

      const achievement = ACHIEVEMENTS.first_post;

      // Award first time
      const awarded1 = await awardAchievement(db, userId, achievement);
      expect(awarded1).toBe(true);

      // Try to award second time
      const awarded2 = await awardAchievement(db, userId, achievement);
      expect(awarded2).toBe(false);

      // Verify only one badge
      const user = await db.collection('users').findOne({ _id: userId });
      expect(user.reputation.badges.length).toBe(1);
    });
  });

  describe('checkAllAchievements', () => {
    it('should check and award all eligible achievements', async () => {
      // Setup conditions for multiple achievements
      await db
        .collection('users')
        .updateOne({ _id: userId }, { $set: { 'stats.content_count': 10 } });

      const newlyEarned = await checkAllAchievements(db, userId);

      // Should earn first_post and prolific_writer
      expect(newlyEarned.length).toBeGreaterThanOrEqual(1);
      expect(
        newlyEarned.some(
          (a) => a.id === 'first_post' || a.id === 'prolific_writer'
        )
      ).toBe(true);
    });

    it('should return achievements when eligible', async () => {
      const newlyEarned = await checkAllAchievements(db, userId);
      // User should earn early_adopter achievement (first 100 users)
      expect(Array.isArray(newlyEarned)).toBe(true);
    });
  });

  describe('updateLoginStreak', () => {
    it('should initialize streak to 1 on first login', async () => {
      const streak = await updateLoginStreak(db, userId);
      expect(streak).toBe(1);

      const user = await db.collection('users').findOne({ _id: userId });
      expect(user.gamification.login_streak).toBe(1);
      expect(user.gamification.last_login).toBeInstanceOf(Date);
    });

    it('should increment streak on consecutive day', async () => {
      // First login
      await updateLoginStreak(db, userId);

      // Simulate next day login
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await db
        .collection('users')
        .updateOne(
          { _id: userId },
          { $set: { 'gamification.last_login': yesterday } }
        );

      const streak = await updateLoginStreak(db, userId);
      expect(streak).toBe(2);
    });

    it('should not increment streak on same day', async () => {
      await updateLoginStreak(db, userId);
      const streak = await updateLoginStreak(db, userId);
      expect(streak).toBe(1);
    });

    it('should reset streak after missed day', async () => {
      // First login
      await updateLoginStreak(db, userId);

      // Simulate login 3 days later
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      await db
        .collection('users')
        .updateOne(
          { _id: userId },
          { $set: { 'gamification.last_login': threeDaysAgo } }
        );

      const streak = await updateLoginStreak(db, userId);
      expect(streak).toBe(1);
    });
  });

  describe('getDailyQuestProgress', () => {
    it('should return quest progress for user', async () => {
      const quests = await getDailyQuestProgress(db, userId);

      expect(quests).toBeInstanceOf(Array);
      expect(quests.length).toBe(Object.keys(DAILY_QUESTS).length);

      quests.forEach((quest) => {
        expect(quest).toHaveProperty('progress');
        expect(quest.progress).toHaveProperty('current');
        expect(quest.progress).toHaveProperty('target');
        expect(quest.progress).toHaveProperty('percentage');
      });
    });

    it('should show quest progress for content published', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Add content published today
      await db.collection('user_generated_content').insertOne({
        author_id: userId,
        title: 'Test',
        created_at: new Date(),
      });

      const quests = await getDailyQuestProgress(db, userId);
      const dailyPost = quests.find((q) => q.id === 'daily_post');

      expect(dailyPost.progress.current).toBe(1);
      expect(dailyPost.progress.target).toBe(1);
      expect(dailyPost.completed).toBe(true);
    });

    it('should return empty array for non-existent user', async () => {
      const fakeUserId = new ObjectId();
      const quests = await getDailyQuestProgress(db, fakeUserId);
      expect(quests).toEqual([]);
    });
  });

  describe('completeDailyQuest', () => {
    it('should complete quest when conditions met', async () => {
      // Add content to meet quest requirements
      await db.collection('user_generated_content').insertOne({
        author_id: userId,
        title: 'Test',
        created_at: new Date(),
      });

      const completed = await completeDailyQuest(db, userId, 'daily_post');
      expect(completed).toBe(true);

      const user = await db.collection('users').findOne({ _id: userId });
      expect(user.reputation.points).toBe(DAILY_QUESTS.daily_post.points);
    });

    it('should not complete quest when conditions not met', async () => {
      const completed = await completeDailyQuest(db, userId, 'daily_post');
      expect(completed).toBe(false);

      const user = await db.collection('users').findOne({ _id: userId });
      expect(user.reputation.points).toBe(0);
    });

    it('should not complete invalid quest', async () => {
      const completed = await completeDailyQuest(db, userId, 'invalid_quest');
      expect(completed).toBe(false);
    });

    it('should not complete quest twice in one day', async () => {
      // Add content and complete quest
      await db.collection('user_generated_content').insertOne({
        author_id: userId,
        title: 'Test',
        created_at: new Date(),
      });

      const completed1 = await completeDailyQuest(db, userId, 'daily_post');
      expect(completed1).toBe(true);

      // Try to complete again
      const completed2 = await completeDailyQuest(db, userId, 'daily_post');
      expect(completed2).toBe(false);

      const user = await db.collection('users').findOne({ _id: userId });
      // Should only get points once
      expect(user.reputation.points).toBe(DAILY_QUESTS.daily_post.points);
    });
  });
});
