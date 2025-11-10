/**
 * 🐾⚡ Unit Tests for Auth Middleware ⚡🐾
 * Testing JWT token generation, verification, and authentication middleware
 */

const { ObjectId } = require('mongodb');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  authenticateToken,
  optionalAuth,
  authorize,
  checkBanned,
} = require('../../middleware/auth');

describe('Auth Middleware - Token Functions', () => {
  const mockUser = {
    _id: new ObjectId(),
    username: 'neko',
    email: 'neko@test.com',
    role: 'user',
  };

  describe('generateAccessToken', () => {
    it('should generate valid access token', () => {
      const token = generateAccessToken(mockUser);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('should include user data in token payload', () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyToken(token);

      expect(decoded.user_id).toBe(mockUser._id.toString());
      expect(decoded.username).toBe(mockUser.username);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should not include type field in access token', () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyToken(token);

      expect(decoded.type).toBeUndefined();
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate valid refresh token', () => {
      const token = generateRefreshToken(mockUser);
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('should include type=refresh in payload', () => {
      const token = generateRefreshToken(mockUser);
      const decoded = verifyToken(token);

      expect(decoded.type).toBe('refresh');
      expect(decoded.user_id).toBe(mockUser._id.toString());
    });

    it('should not include sensitive user data', () => {
      const token = generateRefreshToken(mockUser);
      const decoded = verifyToken(token);

      expect(decoded.email).toBeUndefined();
      expect(decoded.username).toBeUndefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify valid access token', () => {
      const token = generateAccessToken(mockUser);
      const decoded = verifyToken(token);

      expect(decoded).toBeTruthy();
      expect(decoded.user_id).toBe(mockUser._id.toString());
    });

    it('should verify valid refresh token', () => {
      const token = generateRefreshToken(mockUser);
      const decoded = verifyToken(token);

      expect(decoded).toBeTruthy();
      expect(decoded.type).toBe('refresh');
    });

    it('should return null for invalid token', () => {
      const decoded = verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should return null for empty token', () => {
      const decoded = verifyToken('');
      expect(decoded).toBeNull();
    });

    it('should return null for tampered token', () => {
      const token = generateAccessToken(mockUser);
      const tamperedToken = token + 'tampered';
      const decoded = verifyToken(tamperedToken);

      expect(decoded).toBeNull();
    });
  });
});

describe('Auth Middleware - Middleware Functions', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should reject request without token', () => {
      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Access token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
      mockReq.headers['authorization'] = 'Bearer invalid-token';

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid or expired token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept request with valid access token', () => {
      const mockUser = {
        _id: new ObjectId(),
        username: 'neko',
        email: 'neko@test.com',
        role: 'user',
      };
      const token = generateAccessToken(mockUser);
      mockReq.headers['authorization'] = `Bearer ${token}`;

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeTruthy();
      expect(mockReq.user.username).toBe('neko');
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject refresh token for API access', () => {
      const mockUser = {
        _id: new ObjectId(),
        username: 'neko',
        email: 'neko@test.com',
        role: 'user',
      };
      const refreshToken = generateRefreshToken(mockUser);
      mockReq.headers['authorization'] = `Bearer ${refreshToken}`;

      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Refresh token cannot be used for API access',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should allow request without token', () => {
      optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });

    it('should attach user if valid token provided', () => {
      const mockUser = {
        _id: new ObjectId(),
        username: 'neko',
        email: 'neko@test.com',
        role: 'user',
      };
      const token = generateAccessToken(mockUser);
      mockReq.headers['authorization'] = `Bearer ${token}`;

      optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeTruthy();
      expect(mockReq.user.username).toBe('neko');
    });

    it('should not attach user for invalid token', () => {
      mockReq.headers['authorization'] = 'Bearer invalid-token';

      optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });

    it('should not attach user for refresh token', () => {
      const mockUser = {
        _id: new ObjectId(),
        username: 'neko',
        email: 'neko@test.com',
        role: 'user',
      };
      const refreshToken = generateRefreshToken(mockUser);
      mockReq.headers['authorization'] = `Bearer ${refreshToken}`;

      optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });
  });

  describe('authorize', () => {
    it('should reject request without user', () => {
      const middleware = authorize('admin', 'moderator');
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Authentication required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow user with correct role', () => {
      mockReq.user = { role: 'admin' };
      const middleware = authorize('admin', 'moderator');

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject user with wrong role', () => {
      mockReq.user = { role: 'user' };
      const middleware = authorize('admin', 'moderator');

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Insufficient permissions',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('checkBanned', () => {
    let db;
    let userId;

    beforeEach(async () => {
      db = global.__MONGO_DB__;

      // Create test user
      const user = {
        username: 'neko',
        email: 'neko@test.com',
        moderation: {
          banned: false,
          ban_reason: null,
          ban_expires: null,
        },
      };

      const result = await db.collection('users').insertOne(user);
      userId = result.insertedId;
    });

    it('should allow request without user', async () => {
      const middleware = checkBanned(db);
      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow non-banned user', async () => {
      mockReq.user = { user_id: userId.toString() };
      const middleware = checkBanned(db);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject banned user', async () => {
      // Ban the user
      await db.collection('users').updateOne(
        { _id: userId },
        {
          $set: {
            'moderation.banned': true,
            'moderation.ban_reason': 'Test ban',
          },
        }
      );

      mockReq.user = { user_id: userId.toString() };
      const middleware = checkBanned(db);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          reason: 'Test ban',
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should show temporary ban message', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      await db.collection('users').updateOne(
        { _id: userId },
        {
          $set: {
            'moderation.banned': true,
            'moderation.ban_expires': futureDate,
          },
        }
      );

      mockReq.user = { user_id: userId.toString() };
      const middleware = checkBanned(db);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('temporarily banned'),
        })
      );
    });

    it('should return 404 for non-existent user', async () => {
      const fakeUserId = new ObjectId();
      mockReq.user = { user_id: fakeUserId.toString() };
      const middleware = checkBanned(db);

      await middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'User not found',
      });
    });
  });
});
