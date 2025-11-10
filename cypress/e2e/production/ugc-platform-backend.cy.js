/**
 * 🎨✨ UGC Platform Backend/Frontend Connection Tests
 * Production Testing Stage - Phase 1
 *
 * Tests fundamental backend and frontend integration:
 * - User registration and authentication
 * - Content creation and retrieval
 * - Comment posting and reactions
 * - Token management and authorization
 */

describe('🎨 UGC Platform - Production Backend/Frontend Integration', () => {
  const API_URL = Cypress.env('API_URL') || 'http://localhost:5001';
  const TEST_USER = {
    username: `testuser_${Date.now()}`,
    email: `test_${Date.now()}@neko.test`,
    password: 'NekoPassword123',
    display_name: 'Neko Test User',
  };

  let authTokens = null;
  let testContent = null;
  let testComment = null;

  // ============================================================================
  // AUTHENTICATION TESTS 🔐
  // ============================================================================

  describe('🔐 Authentication System', () => {
    it('should successfully register a new user', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/register`,
        body: TEST_USER,
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
        expect(response.body.user).to.exist;
        expect(response.body.user.username).to.eq(TEST_USER.username.toLowerCase());
        expect(response.body.user.email).to.eq(TEST_USER.email.toLowerCase());
        expect(response.body.user.password_hash).to.not.exist; // Should not expose password hash

        // Check tokens
        expect(response.body.tokens).to.exist;
        expect(response.body.tokens.access_token).to.exist;
        expect(response.body.tokens.refresh_token).to.exist;
        expect(response.body.tokens.expires_in).to.eq('24h');

        // Check reputation system initialized
        expect(response.body.user.reputation).to.exist;
        expect(response.body.user.reputation.points).to.eq(0);
        expect(response.body.user.reputation.level).to.eq(1);
        expect(response.body.user.reputation.badges).to.be.an('array').that.is.empty;

        // Store tokens for later tests
        authTokens = response.body.tokens;
      });
    });

    it('should reject duplicate username registration', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/register`,
        body: TEST_USER,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(409);
        expect(response.body.success).to.be.false;
        expect(response.body.error).to.include('Username already exists');
      });
    });

    it('should reject weak passwords', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/register`,
        body: {
          username: 'weakpassuser',
          email: 'weak@test.com',
          password: 'weak',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.success).to.be.false;
        expect(response.body.error).to.exist;
      });
    });

    it('should successfully login with username', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/login`,
        body: {
          username_or_email: TEST_USER.username,
          password: TEST_USER.password,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.user).to.exist;
        expect(response.body.tokens).to.exist;
      });
    });

    it('should successfully login with email', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/login`,
        body: {
          username_or_email: TEST_USER.email,
          password: TEST_USER.password,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
      });
    });

    it('should reject invalid credentials', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/login`,
        body: {
          username_or_email: TEST_USER.username,
          password: 'WrongPassword123',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.success).to.be.false;
        expect(response.body.error).to.include('Invalid credentials');
      });
    });

    it('should get current user with valid token', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/auth/me`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.user.username).to.eq(TEST_USER.username.toLowerCase());
      });
    });

    it('should reject requests without token', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/auth/me`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
        expect(response.body.success).to.be.false;
        expect(response.body.error).to.include('Access token required');
      });
    });

    it('should refresh access token with refresh token', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/refresh`,
        body: {
          refresh_token: authTokens.refresh_token,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.access_token).to.exist;
        expect(response.body.expires_in).to.eq('24h');

        // Update access token
        authTokens.access_token = response.body.access_token;
      });
    });
  });

  // ============================================================================
  // CONTENT CREATION TESTS 🎨
  // ============================================================================

  describe('🎨 Content Creation & Management', () => {
    it('should create content in draft mode', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/content/create`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          title: 'Test Threat Intelligence Report',
          description: 'A comprehensive analysis of emerging threats',
          content: {
            text: '# Threat Analysis\n\nThis is a test report about cybersecurity threats.',
          },
          category: 'threat-intel',
          tags: ['security', 'threats', 'analysis'],
          status: 'draft',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
        expect(response.body.content).to.exist;
        expect(response.body.content.title).to.eq('Test Threat Intelligence Report');
        expect(response.body.content.status).to.eq('draft');
        expect(response.body.content.engagement.views).to.eq(0);
        expect(response.body.content.engagement.likes).to.eq(0);

        // Check AI metadata
        expect(response.body.content.ai_metadata).to.exist;
        expect(response.body.content.ai_metadata.quality_score).to.be.a('number');

        testContent = response.body.content;
      });
    });

    it('should publish draft content', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/content/${testContent._id}/publish`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.include('published');
      });
    });

    it('should create and publish content directly', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/content/create`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          title: 'Published Content Test',
          description: 'This content is published immediately',
          content: {
            text: 'Testing direct publish workflow',
          },
          category: 'general',
          tags: ['test'],
          status: 'published',
          visibility: 'public',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
        expect(response.body.content.status).to.eq('published');
        expect(response.body.content.published_at).to.exist;
      });
    });

    it('should reject content creation without authentication', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/content/create`,
        body: {
          title: 'Unauthorized Content',
          status: 'published',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should retrieve content by ID', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/content/${testContent._id}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.content._id).to.eq(testContent._id);
        expect(response.body.content.author).to.exist;
        expect(response.body.content.author.username).to.eq(TEST_USER.username.toLowerCase());

        // Views should increment
        expect(response.body.content.engagement.views).to.be.greaterThan(0);
      });
    });

    it('should retrieve content feed with pagination', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/content/feed?page=1&limit=10&sort=recent`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.content).to.be.an('array');
        expect(response.body.pagination).to.exist;
        expect(response.body.pagination.page).to.eq(1);
        expect(response.body.pagination.limit).to.eq(10);
      });
    });

    it('should filter content feed by category', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/content/feed?category=threat-intel`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;

        // All returned content should be threat-intel category
        response.body.content.forEach((content) => {
          expect(content.category).to.eq('threat-intel');
        });
      });
    });

    it('should update own content', () => {
      cy.request({
        method: 'PUT',
        url: `${API_URL}/api/content/${testContent._id}`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          title: 'Updated Threat Intelligence Report',
          description: 'Updated description',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.content.title).to.eq('Updated Threat Intelligence Report');
      });
    });

    it('should like content', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/content/${testContent._id}/like`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          action: 'like',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
      });
    });
  });

  // ============================================================================
  // COMMENT SYSTEM TESTS 💬
  // ============================================================================

  describe('💬 Comment & Reaction System', () => {
    it('should post a comment on content', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/comments`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          content_id: testContent._id,
          text: 'Great threat analysis! Thanks for sharing, @testuser',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
        expect(response.body.comment).to.exist;
        expect(response.body.comment.text).to.include('Great threat analysis');
        expect(response.body.comment.mentions).to.be.an('array');

        testComment = response.body.comment;
      });
    });

    it('should retrieve comments for content', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/comments/${testContent._id}`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.comments).to.be.an('array');
        expect(response.body.total_count).to.be.greaterThan(0);

        // Comments should have author information
        const comment = response.body.comments[0];
        expect(comment.author).to.exist;
        expect(comment.author.username).to.exist;
        expect(comment.author.password_hash).to.not.exist; // Security check
      });
    });

    it('should add emoji reaction to comment', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/comments/${testComment._id}/react`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          emoji: '🐾',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.message).to.include('Reaction added');
      });
    });

    it('should reject invalid emoji reactions', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/comments/${testComment._id}/react`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          emoji: '❌', // Not in NEKO_REACTIONS list
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.success).to.be.false;
        expect(response.body.error).to.include('Invalid emoji');
      });
    });

    it('should get list of available reactions', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/comments/reactions/list`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.reactions).to.be.an('array');
        expect(response.body.reactions.length).to.eq(15); // 15 Neko reactions

        // Verify reaction structure
        const reaction = response.body.reactions[0];
        expect(reaction.emoji).to.exist;
        expect(reaction.name).to.exist;
        expect(reaction.label).to.exist;
      });
    });

    it('should edit own comment', () => {
      cy.request({
        method: 'PUT',
        url: `${API_URL}/api/comments/${testComment._id}`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          text: 'Updated comment: Even better threat analysis!',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.comment.text).to.include('Updated comment');
        expect(response.body.comment.is_edited).to.be.true;
        expect(response.body.comment.edit_history).to.be.an('array');
      });
    });

    it('should post a reply to a comment', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/comments`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          content_id: testContent._id,
          parent_comment_id: testComment._id,
          text: 'Thanks for the feedback!',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.success).to.be.true;
        expect(response.body.comment.parent_comment_id).to.exist;
      });
    });

    it('should remove emoji reaction from comment', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/api/comments/${testComment._id}/react`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          emoji: '🐾',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
      });
    });
  });

  // ============================================================================
  // REPUTATION & GAMIFICATION TESTS 🏆
  // ============================================================================

  describe('🏆 Reputation & Gamification System', () => {
    it('should track user reputation points after content creation', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/auth/me`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        const user = response.body.user;

        // User should have gained reputation points
        expect(user.reputation.points).to.be.greaterThan(0);

        // Stats should be updated
        expect(user.stats.content_count).to.be.greaterThan(0);
        expect(user.stats.total_likes).to.be.greaterThan(0);
      });
    });
  });

  // ============================================================================
  // SECURITY TESTS 🔒
  // ============================================================================

  describe('🔒 Security & Authorization', () => {
    it('should not allow users to edit other users content', () => {
      // Create a second user
      const secondUser = {
        username: `seconduser_${Date.now()}`,
        email: `second_${Date.now()}@neko.test`,
        password: 'SecondPassword123',
      };

      cy.request({
        method: 'POST',
        url: `${API_URL}/api/auth/register`,
        body: secondUser,
      }).then((registerResponse) => {
        const secondUserToken = registerResponse.body.tokens.access_token;

        // Try to edit first user's content with second user's token
        cy.request({
          method: 'PUT',
          url: `${API_URL}/api/content/${testContent._id}`,
          headers: {
            Authorization: `Bearer ${secondUserToken}`,
          },
          body: {
            title: 'Attempting unauthorized edit',
          },
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(403);
          expect(response.body.success).to.be.false;
          expect(response.body.error).to.include('only edit your own');
        });
      });
    });

    it('should not expose password hashes in any endpoint', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/auth/me`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
      }).then((response) => {
        expect(response.body.user.password_hash).to.not.exist;
      });

      cy.request({
        method: 'GET',
        url: `${API_URL}/api/content/${testContent._id}`,
      }).then((response) => {
        expect(response.body.content.author.password_hash).to.not.exist;
      });
    });

    it('should validate content title is required', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/content/create`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          description: 'Content without title',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.include('required');
      });
    });

    it('should validate comment text length', () => {
      const longText = 'a'.repeat(1001); // Over 1000 char limit

      cy.request({
        method: 'POST',
        url: `${API_URL}/api/comments`,
        headers: {
          Authorization: `Bearer ${authTokens.access_token}`,
        },
        body: {
          content_id: testContent._id,
          text: longText,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(400);
        expect(response.body.error).to.include('1000 characters');
      });
    });
  });

  // ============================================================================
  // CLEANUP
  // ============================================================================

  after(() => {
    cy.log('🎉 All UGC Platform production tests completed successfully!');
  });
});
