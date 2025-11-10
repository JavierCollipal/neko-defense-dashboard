/**
 * 🐾⚡ Unit Tests for User Model ⚡🐾
 * Testing validation functions and user creation logic
 */

const {
  validateUsername,
  validateEmail,
  validatePassword,
  createDefaultUser,
  calculateLevel,
  getEarnedBadges,
  REPUTATION_POINTS,
  BADGES,
} = require('../../models/User');

describe('User Model - Validation Functions', () => {
  describe('validateUsername', () => {
    it('should validate correct username', () => {
      const result = validateUsername('neko-arc');
      expect(result.valid).toBe(true);
    });

    it('should reject empty username', () => {
      const result = validateUsername('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('should reject username shorter than 3 characters', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    it('should reject username longer than 20 characters', () => {
      const result = validateUsername('a'.repeat(21));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username must be at most 20 characters');
    });

    it('should reject username with invalid characters', () => {
      const result = validateUsername('neko@arc');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('can only contain');
    });

    it('should accept username with underscores and hyphens', () => {
      expect(validateUsername('neko_arc-123').valid).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      const result = validateEmail('neko@example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    it('should reject email without @', () => {
      const result = validateEmail('nekoexample.com');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email without domain', () => {
      const result = validateEmail('neko@');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should reject email without TLD', () => {
      const result = validateEmail('neko@example');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should accept complex valid emails', () => {
      expect(validateEmail('neko.arc+test@example.co.uk').valid).toBe(true);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong password', () => {
      const result = validatePassword('NekoArc123');
      expect(result.valid).toBe(true);
    });

    it('should reject empty password', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password is required');
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('Neko1');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    it('should reject password longer than 128 characters', () => {
      const result = validatePassword('Neko1' + 'a'.repeat(125));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Password must be at most 128 characters');
    });

    it('should reject password without letters', () => {
      const result = validatePassword('12345678');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least one letter and one number');
    });

    it('should reject password without numbers', () => {
      const result = validatePassword('NekoNekoNeko');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least one letter and one number');
    });

    it('should accept password with special characters', () => {
      const result = validatePassword('Neko@Arc123!');
      expect(result.valid).toBe(true);
    });
  });
});

describe('User Model - Helper Functions', () => {
  describe('createDefaultUser', () => {
    it('should create user with minimal data', () => {
      const userData = {
        username: 'neko',
        email: 'neko@example.com',
        password_hash: '$2b$12$hashedpassword',
      };

      const user = createDefaultUser(userData);

      expect(user.username).toBe('neko');
      expect(user.email).toBe('neko@example.com');
      expect(user.password_hash).toBe('$2b$12$hashedpassword');
      expect(user.display_name).toBe('neko'); // Default to username
      expect(user.role).toBe('user');
      expect(user.verified).toBe(false);
    });

    it('should create user with custom display name', () => {
      const userData = {
        username: 'neko',
        email: 'neko@example.com',
        password_hash: '$2b$12$hashedpassword',
        display_name: 'Neko-Arc Chaos',
      };

      const user = createDefaultUser(userData);

      expect(user.display_name).toBe('Neko-Arc Chaos');
    });

    it('should initialize reputation correctly', () => {
      const userData = {
        username: 'neko',
        email: 'neko@example.com',
        password_hash: '$2b$12$hashedpassword',
      };

      const user = createDefaultUser(userData);

      expect(user.reputation.points).toBe(0);
      expect(user.reputation.level).toBe(1);
      expect(user.reputation.badges).toEqual([]);
    });

    it('should initialize stats correctly', () => {
      const userData = {
        username: 'neko',
        email: 'neko@example.com',
        password_hash: '$2b$12$hashedpassword',
      };

      const user = createDefaultUser(userData);

      expect(user.stats.content_count).toBe(0);
      expect(user.stats.total_views).toBe(0);
      expect(user.stats.total_likes).toBe(0);
      expect(user.stats.followers).toBe(0);
      expect(user.stats.following).toBe(0);
    });

    it('should use custom language preference', () => {
      const userData = {
        username: 'neko',
        email: 'neko@example.com',
        password_hash: '$2b$12$hashedpassword',
        language: 'es',
      };

      const user = createDefaultUser(userData);

      expect(user.preferences.language).toBe('es');
    });

    it('should set default theme to neko-kawaii', () => {
      const userData = {
        username: 'neko',
        email: 'neko@example.com',
        password_hash: '$2b$12$hashedpassword',
      };

      const user = createDefaultUser(userData);

      expect(user.preferences.theme).toBe('neko-kawaii');
    });

    it('should initialize moderation data', () => {
      const userData = {
        username: 'neko',
        email: 'neko@example.com',
        password_hash: '$2b$12$hashedpassword',
      };

      const user = createDefaultUser(userData);

      expect(user.moderation.warnings).toBe(0);
      expect(user.moderation.strikes).toBe(0);
      expect(user.moderation.banned).toBe(false);
    });

    it('should set timestamps', () => {
      const beforeCreate = new Date();
      const userData = {
        username: 'neko',
        email: 'neko@example.com',
        password_hash: '$2b$12$hashedpassword',
      };

      const user = createDefaultUser(userData);
      const afterCreate = new Date();

      expect(user.created_at).toBeInstanceOf(Date);
      expect(user.last_login).toBeInstanceOf(Date);
      expect(user.updated_at).toBeInstanceOf(Date);
      expect(user.created_at.getTime()).toBeGreaterThanOrEqual(
        beforeCreate.getTime()
      );
      expect(user.created_at.getTime()).toBeLessThanOrEqual(
        afterCreate.getTime()
      );
    });
  });

  describe('calculateLevel', () => {
    it('should return level 1 for 0 points', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should return level 1 for 10 points', () => {
      expect(calculateLevel(10)).toBe(2);
    });

    it('should return level 10 for 1000 points', () => {
      expect(calculateLevel(1000)).toBe(11);
    });

    it('should return level 100 for 100000 points', () => {
      expect(calculateLevel(100000)).toBe(100);
    });

    it('should cap at level 100', () => {
      expect(calculateLevel(1000000)).toBe(100);
    });

    it('should handle fractional results correctly', () => {
      const level = calculateLevel(500);
      expect(level).toBeGreaterThan(1);
      expect(level).toBeLessThan(100);
      expect(Number.isInteger(level)).toBe(true);
    });
  });

  describe('getEarnedBadges', () => {
    it('should return no badges for 0 points', () => {
      const badges = getEarnedBadges(0);
      expect(badges).toEqual([]);
    });

    it('should return first_post badge for 10 points', () => {
      const badges = getEarnedBadges(10);
      expect(badges.length).toBe(1);
      expect(badges[0].id).toBe('first_post');
      expect(badges[0].name).toBe('First Steps');
      expect(badges[0].icon).toBe('🐾');
      expect(badges[0].earned_at).toBeInstanceOf(Date);
    });

    it('should return multiple badges for 100 points', () => {
      const badges = getEarnedBadges(100);
      expect(badges.length).toBeGreaterThanOrEqual(2);
      expect(badges.some((b) => b.id === 'first_post')).toBe(true);
      expect(badges.some((b) => b.id === 'popular')).toBe(true);
    });

    it('should return all point-based badges for 5000 points', () => {
      const badges = getEarnedBadges(5000);
      expect(badges.length).toBeGreaterThanOrEqual(4);
      expect(badges.some((b) => b.id === 'legendary')).toBe(true);
    });

    it('should not include custom requirement badges', () => {
      const badges = getEarnedBadges(10000);
      expect(badges.some((b) => b.id === 'video_master')).toBe(false);
      expect(badges.some((b) => b.id === 'community_hero')).toBe(false);
    });
  });

  describe('REPUTATION_POINTS constants', () => {
    it('should have correct point values', () => {
      expect(REPUTATION_POINTS.content_published).toBe(10);
      expect(REPUTATION_POINTS.content_liked).toBe(2);
      expect(REPUTATION_POINTS.content_featured).toBe(50);
      expect(REPUTATION_POINTS.first_video).toBe(25);
    });
  });

  describe('BADGES constants', () => {
    it('should have correct badge structure', () => {
      expect(BADGES).toBeInstanceOf(Array);
      expect(BADGES.length).toBeGreaterThan(0);

      const firstBadge = BADGES[0];
      expect(firstBadge).toHaveProperty('id');
      expect(firstBadge).toHaveProperty('name');
      expect(firstBadge).toHaveProperty('icon');
      expect(firstBadge).toHaveProperty('description');
    });
  });
});
