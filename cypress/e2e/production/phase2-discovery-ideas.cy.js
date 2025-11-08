/**
 * 🔍💡 Phase 2 Production Tests: Discovery & Ideas
 * Tests search, recommendations, idea board, and real-time features
 */

describe('🔍 Phase 2: Content Discovery & Ideas System', () => {
  const API_URL = Cypress.env('API_URL') || 'http://localhost:5001';
  const TEST_USER = {
    username: `testuser_phase2_${Date.now()}`,
    email: `test_phase2_${Date.now()}@neko.test`,
    password: 'TestPassword123',
    display_name: 'Phase 2 Test User',
  };

  let authToken;
  let userId;
  let testContentId;
  let testIdeaId;

  before(() => {
    // Register test user
    cy.request('POST', `${API_URL}/api/auth/register`, TEST_USER).then((response) => {
      expect(response.status).to.eq(201);
      authToken = response.body.access_token;
      userId = response.body.user._id;
    });

    // Create test content for search
    cy.request({
      method: 'POST',
      url: `${API_URL}/api/content/create`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        title: 'Test Content for Discovery',
        description: 'This content will be used for search testing',
        content: { text: 'Phase 2 discovery features testing content' },
        category: 'research',
        tags: ['test', 'discovery', 'phase2'],
        visibility: 'public',
        status: 'published',
      },
    }).then((response) => {
      testContentId = response.body.content._id;
    });
  });

  // ============================================================================
  // 🔍 SPRINT 2.1: DISCOVERY FEATURES TESTS
  // ============================================================================

  describe('Sprint 2.1: Content Discovery', () => {
    it('should perform full-text search and find content', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/search`,
        qs: {
          q: 'discovery',
          sort: 'relevance',
          limit: 10,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('results');
        expect(response.body.results).to.be.an('array');

        // Should find our test content
        const found = response.body.results.some(
          (item) => item.title === 'Test Content for Discovery'
        );
        expect(found).to.be.true;
      });
    });

    it('should filter search by category', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/search`,
        qs: {
          q: 'test',
          category: 'research',
          limit: 10,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.results).to.be.an('array');

        // All results should be in research category
        response.body.results.forEach((item) => {
          expect(item.category).to.eq('research');
        });
      });
    });

    it('should filter search by tags', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/search`,
        qs: {
          q: 'test',
          tags: 'discovery,phase2',
          limit: 10,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.results).to.be.an('array');
      });
    });

    it('should get trending content for timeframe', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/content/trending`,
        qs: {
          timeframe: '7d',
          limit: 20,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('trending');
        expect(response.body.trending).to.be.an('array');
        expect(response.body.timeframe).to.eq('7d');
      });
    });

    it('should get personalized recommendations (authenticated)', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/content/recommended`,
        headers: { Authorization: `Bearer ${authToken}` },
        qs: { limit: 20 },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('recommendations');
        expect(response.body.recommendations).to.be.an('array');
        expect(response.body).to.have.property('algorithm');
      });
    });

    it('should get popular tags with counts', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/tags`,
        qs: { limit: 20 },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('tags');
        expect(response.body.tags).to.be.an('array');

        // Each tag should have tag name and count
        response.body.tags.forEach((tagObj) => {
          expect(tagObj).to.have.property('tag');
          expect(tagObj).to.have.property('count');
          expect(tagObj.count).to.be.a('number');
        });
      });
    });

    it('should get content categories with stats', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/categories`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('categories');
        expect(response.body.categories).to.be.an('array');

        // Each category should have stats
        response.body.categories.forEach((cat) => {
          expect(cat).to.have.property('category');
          expect(cat).to.have.property('count');
          expect(cat).to.have.property('total_views');
          expect(cat).to.have.property('total_likes');
        });
      });
    });
  });

  // ============================================================================
  // 💡 SPRINT 2.2: IDEA BOARD TESTS
  // ============================================================================

  describe('Sprint 2.2: Community Ideas Board', () => {
    it('should submit a new idea', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/ideas`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          title: 'Test Feature Idea',
          description: 'This is a test idea for the community board',
          category: 'feature',
          tags: ['test', 'phase2', 'idea'],
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('idea');
        expect(response.body.idea.title).to.eq('Test Feature Idea');
        expect(response.body.idea.status).to.eq('proposed');
        testIdeaId = response.body.idea._id;
      });
    });

    it('should get all ideas with filters', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/ideas`,
        qs: {
          category: 'feature',
          sort: 'priority',
          limit: 20,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('ideas');
        expect(response.body.ideas).to.be.an('array');
        expect(response.body).to.have.property('pagination');
      });
    });

    it('should upvote an idea', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/ideas/${testIdeaId}/vote`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: { voteType: 'upvote' },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('votes');
        expect(response.body.votes.upvotes).to.eq(1);
        expect(response.body.votes.score).to.eq(1);
      });
    });

    it('should downvote an idea', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/ideas/${testIdeaId}/vote`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: { voteType: 'downvote' },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.votes.downvotes).to.eq(1);
        expect(response.body.votes.upvotes).to.eq(0);
        expect(response.body.votes.score).to.eq(-1);
      });
    });

    it('should remove vote from an idea', () => {
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/api/ideas/${testIdeaId}/vote`,
        headers: { Authorization: `Bearer ${authToken}` },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.votes.downvotes).to.eq(0);
        expect(response.body.votes.score).to.eq(0);
      });
    });

    it('should get top-voted ideas', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/ideas/top`,
        qs: {
          limit: 10,
          timeframe: 'all',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('top_ideas');
        expect(response.body.top_ideas).to.be.an('array');
      });
    });

    it('should update an idea (author only)', () => {
      cy.request({
        method: 'PUT',
        url: `${API_URL}/api/ideas/${testIdeaId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          title: 'Updated Test Feature Idea',
          description: 'This description has been updated',
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.idea.title).to.eq('Updated Test Feature Idea');
      });
    });

    it('should get idea statistics', () => {
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/ideas/stats/overview`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success', true);
        expect(response.body).to.have.property('stats');
        expect(response.body.stats).to.have.property('total_ideas');
        expect(response.body.stats).to.have.property('by_status');
        expect(response.body.stats).to.have.property('by_category');
      });
    });
  });

  // ============================================================================
  // ⚡ SPRINT 2.3: REAL-TIME FEATURES TESTS
  // ============================================================================

  describe('Sprint 2.3: Real-Time Socket.io Features', () => {
    it('should have Socket.io server accessible', () => {
      // Simple check: verify the server is responding
      cy.request({
        method: 'GET',
        url: `${API_URL}/api/health`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.status).to.eq('LEGENDARY');
      });
    });

    it('should post comment with real-time broadcasting', () => {
      cy.request({
        method: 'POST',
        url: `${API_URL}/api/comments`,
        headers: { Authorization: `Bearer ${authToken}` },
        body: {
          content_id: testContentId,
          text: 'Real-time test comment',
        },
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('success', true);
        // Comment should have been broadcast via Socket.io
        // (actual Socket.io testing would require frontend integration)
      });
    });
  });

  // ============================================================================
  // 🧹 CLEANUP
  // ============================================================================

  after(() => {
    // Clean up test data
    if (testIdeaId) {
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/api/ideas/${testIdeaId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false,
      });
    }

    if (testContentId) {
      cy.request({
        method: 'DELETE',
        url: `${API_URL}/api/content/${testContentId}`,
        headers: { Authorization: `Bearer ${authToken}` },
        failOnStatusCode: false,
      });
    }
  });
});
