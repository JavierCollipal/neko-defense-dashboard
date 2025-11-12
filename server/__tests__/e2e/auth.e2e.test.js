/**
 * 🐾⚡ E2E Tests for Authentication Routes ⚡🐾
 * Testing /api/auth endpoints with Supertest
 */

const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

// Create test app
function createTestApp(db) {
  const app = express();
  app.use(express.json());

  // Make database available to routes
  app.locals.db = db;

  // Import and use auth routes
  const authRoutes = require('../../routes/auth');
  app.use('/api/auth', authRoutes);

  return app;
}

describe('Auth Routes E2E - /api/auth', () => {
  let app;
  let db;

  beforeAll(() => {
    db = global.__MONGO_DB__;
    app = createTestApp(db);
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await db.collection('users').deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register new user with valid data', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'neko',
        email: 'neko@test.com',
        password: 'NekoArc123',
        display_name: 'Neko-Arc',
        language: 'en',
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('username', 'neko');
      expect(response.body.user).toHaveProperty('email', 'neko@test.com');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    it('should reject registration with invalid username', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'ab', // Too short
        email: 'test@test.com',
        password: 'Password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('at least 3 characters');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'neko',
        email: 'invalid-email',
        password: 'Password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('email');
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'neko',
        email: 'neko@test.com',
        password: 'weak',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('password');
    });

    it('should reject duplicate username', async () => {
      // Create first user
      await request(app).post('/api/auth/register').send({
        username: 'neko',
        email: 'neko1@test.com',
        password: 'Password123',
      });

      // Try to register with same username
      const response = await request(app).post('/api/auth/register').send({
        username: 'neko',
        email: 'neko2@test.com',
        password: 'Password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should reject duplicate email', async () => {
      // Create first user
      await request(app).post('/api/auth/register').send({
        username: 'neko1',
        email: 'neko@test.com',
        password: 'Password123',
      });

      // Try to register with same email
      const response = await request(app).post('/api/auth/register').send({
        username: 'neko2',
        email: 'neko@test.com',
        password: 'Password123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should hash password correctly', async () => {
      await request(app).post('/api/auth/register').send({
        username: 'neko',
        email: 'neko@test.com',
        password: 'Password123',
      });

      const user = await db.collection('users').findOne({ username: 'neko' });

      expect(user.password_hash).toBeDefined();
      expect(user.password_hash).not.toBe('Password123');
      expect(user.password_hash.startsWith('$2b$')).toBe(true);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('Password123', 12);
      await db.collection('users').insertOne({
        username: 'neko',
        email: 'neko@test.com',
        password_hash: hashedPassword,
        role: 'user',
        reputation: {
          points: 0,
          level: 1,
          badges: [],
        },
        stats: {
          content_count: 0,
        },
        created_at: new Date(),
      });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'neko',
        password: 'Password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('username', 'neko');
      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'neko',
        password: 'WrongPassword123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid');
    });

    it('should reject login with non-existent username', async () => {
      const response = await request(app).post('/api/auth/login').send({
        username: 'nonexistent',
        password: 'Password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid');
    });

    it('should update last_login timestamp', async () => {
      const beforeLogin = new Date();

      await request(app).post('/api/auth/login').send({
        username: 'neko',
        password: 'Password123',
      });

      const user = await db.collection('users').findOne({ username: 'neko' });

      expect(user.last_login).toBeInstanceOf(Date);
      expect(user.last_login.getTime()).toBeGreaterThanOrEqual(
        beforeLogin.getTime()
      );
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      // Register and get refresh token
      const response = await request(app).post('/api/auth/register').send({
        username: 'neko',
        email: 'neko@test.com',
        password: 'Password123',
      });

      refreshToken = response.body.refresh_token;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('access_token');
      expect(response.body.access_token).toBeTruthy();
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: 'invalid-token' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app).post('/api/auth/refresh').send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken;

    beforeEach(async () => {
      // Register and get access token
      const response = await request(app).post('/api/auth/register').send({
        username: 'neko',
        email: 'neko@test.com',
        password: 'Password123',
      });

      accessToken = response.body.access_token;
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toHaveProperty('username', 'neko');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });
});
