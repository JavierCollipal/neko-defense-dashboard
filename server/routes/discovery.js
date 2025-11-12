/**
 * 🔍 Discovery & Search Routes
 * Handles content discovery, search, recommendations, and trending content
 */

const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { optionalAuth, requireAuth } = require('../middleware/auth');

/**
 * GET /api/search
 * Full-text search with filters
 *
 * Query params:
 * - q: Search query (required)
 * - category: Filter by category
 * - tags: Comma-separated tags
 * - sort: 'relevance', 'recent', 'popular'
 * - page: Page number (default 1)
 * - limit: Results per page (default 20, max 100)
 */
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const {
      q,
      category,
      tags,
      sort = 'relevance',
      page = 1,
      limit = 20,
    } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const query = {
      status: 'published',
      visibility: { $in: ['public', 'unlisted'] },
      $text: { $search: q },
    };

    // Apply category filter
    if (category) {
      query.category = category;
    }

    // Apply tag filter
    if (tags) {
      const tagArray = tags.split(',').map((t) => t.trim());
      query.tags = { $in: tagArray };
    }

    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'recent':
        sortOptions = { published_at: -1 };
        break;
      case 'popular':
        sortOptions = { 'engagement.views': -1, 'engagement.likes': -1 };
        break;
      case 'relevance':
      default:
        sortOptions = { score: { $meta: 'textScore' } };
        break;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute search with text score for relevance
    const projection =
      sort === 'relevance' ? { score: { $meta: 'textScore' } } : {};

    const results = await db
      .collection('user_generated_content')
      .find(query, { projection })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Get total count for pagination
    const totalResults = await db
      .collection('user_generated_content')
      .countDocuments(query);

    // Populate author information
    for (const content of results) {
      if (content.author_id) {
        const author = await db.collection('users').findOne(
          { _id: new ObjectId(content.author_id) },
          {
            projection: {
              username: 1,
              display_name: 1,
              avatar_url: 1,
              verified: 1,
            },
          }
        );
        content.author = author;
      }
    }

    res.json({
      success: true,
      results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalResults,
        pages: Math.ceil(totalResults / limitNum),
      },
      query: {
        search: q,
        category,
        tags: tags ? tags.split(',') : [],
        sort,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to perform search' });
  }
});

/**
 * GET /api/content/trending
 * Get trending content based on recent engagement
 *
 * Query params:
 * - timeframe: '24h', '7d', '30d' (default '7d')
 * - category: Filter by category
 * - limit: Results to return (default 20, max 100)
 */
router.get('/content/trending', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { timeframe = '7d', category, limit = 20 } = req.query;

    // Calculate date threshold
    const now = new Date();
    let dateThreshold;
    switch (timeframe) {
      case '24h':
        dateThreshold = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '30d':
        dateThreshold = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      case '7d':
      default:
        dateThreshold = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
    }

    const query = {
      status: 'published',
      visibility: 'public',
      published_at: { $gte: dateThreshold },
    };

    if (category) {
      query.category = category;
    }

    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    // Get trending content with engagement scoring
    const trending = await db
      .collection('user_generated_content')
      .aggregate([
        { $match: query },
        {
          $addFields: {
            // Calculate trending score: (views + likes*3 + comments*5) / days_since_published
            trending_score: {
              $divide: [
                {
                  $add: [
                    '$engagement.views',
                    { $multiply: ['$engagement.likes', 3] },
                    { $multiply: ['$engagement.comments', 5] },
                  ],
                },
                {
                  $max: [
                    1,
                    {
                      $divide: [
                        { $subtract: [now, '$published_at'] },
                        1000 * 60 * 60 * 24, // Convert to days
                      ],
                    },
                  ],
                },
              ],
            },
          },
        },
        { $sort: { trending_score: -1 } },
        { $limit: limitNum },
      ])
      .toArray();

    // Populate author information
    for (const content of trending) {
      if (content.author_id) {
        const author = await db.collection('users').findOne(
          { _id: new ObjectId(content.author_id) },
          {
            projection: {
              username: 1,
              display_name: 1,
              avatar_url: 1,
              verified: 1,
            },
          }
        );
        content.author = author;
      }
    }

    res.json({
      success: true,
      trending,
      timeframe,
      category: category || 'all',
    });
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Failed to fetch trending content' });
  }
});

/**
 * GET /api/content/recommended
 * Get personalized content recommendations
 * Requires authentication
 *
 * Uses hybrid recommendation:
 * - Content-based filtering (user's interests/categories)
 * - Collaborative filtering (what similar users liked)
 * - Trending boost (popular recent content)
 */
router.get('/content/recommended', requireAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const userId = req.user.user_id;
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));

    // 1. Get user's interaction history
    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 2. Get user's liked content to understand preferences
    const likedContent = await db
      .collection('user_generated_content')
      .find({
        'engagement.liked_by': new ObjectId(userId),
      })
      .limit(50)
      .toArray();

    // Extract categories and tags from liked content
    const preferredCategories = [
      ...new Set(likedContent.map((c) => c.category)),
    ];
    const preferredTags = [
      ...new Set(likedContent.flatMap((c) => c.tags || [])),
    ];

    // 3. Content-based recommendations (40% weight)
    const contentBasedQuery = {
      status: 'published',
      visibility: 'public',
      author_id: { $ne: new ObjectId(userId) }, // Don't recommend own content
    };

    // Prefer user's favorite categories and tags
    if (preferredCategories.length > 0 || preferredTags.length > 0) {
      contentBasedQuery.$or = [];
      if (preferredCategories.length > 0) {
        contentBasedQuery.$or.push({ category: { $in: preferredCategories } });
      }
      if (preferredTags.length > 0) {
        contentBasedQuery.$or.push({ tags: { $in: preferredTags } });
      }
    }

    const contentBased = await db
      .collection('user_generated_content')
      .find(contentBasedQuery)
      .sort({ 'engagement.likes': -1, published_at: -1 })
      .limit(Math.floor(limit * 0.4))
      .toArray();

    // 4. Collaborative filtering (40% weight)
    // Find users who liked similar content
    const similarUserIds = await db
      .collection('user_generated_content')
      .aggregate([
        {
          $match: {
            'engagement.liked_by': new ObjectId(userId),
          },
        },
        {
          $project: {
            liked_by: '$engagement.liked_by',
          },
        },
        {
          $unwind: '$liked_by',
        },
        {
          $match: {
            liked_by: { $ne: new ObjectId(userId) },
          },
        },
        {
          $group: {
            _id: '$liked_by',
            commonLikes: { $sum: 1 },
          },
        },
        { $sort: { commonLikes: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    const similarUsers = similarUserIds.map((u) => u._id);

    let collaborative = [];
    if (similarUsers.length > 0) {
      collaborative = await db
        .collection('user_generated_content')
        .find({
          status: 'published',
          visibility: 'public',
          author_id: { $ne: new ObjectId(userId) },
          'engagement.liked_by': { $in: similarUsers },
        })
        .sort({ 'engagement.likes': -1 })
        .limit(Math.floor(limit * 0.4))
        .toArray();
    }

    // 5. Trending boost (20% weight)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const trending = await db
      .collection('user_generated_content')
      .find({
        status: 'published',
        visibility: 'public',
        author_id: { $ne: new ObjectId(userId) },
        published_at: { $gte: sevenDaysAgo },
      })
      .sort({ 'engagement.views': -1, 'engagement.likes': -1 })
      .limit(Math.floor(limit * 0.2))
      .toArray();

    // 6. Combine and deduplicate
    const combined = [...contentBased, ...collaborative, ...trending];
    const uniqueMap = new Map();
    for (const content of combined) {
      const id = content._id.toString();
      if (!uniqueMap.has(id)) {
        uniqueMap.set(id, content);
      }
    }

    let recommendations = Array.from(uniqueMap.values()).slice(0, limit);

    // 7. Populate author information
    for (const content of recommendations) {
      if (content.author_id) {
        const author = await db.collection('users').findOne(
          { _id: new ObjectId(content.author_id) },
          {
            projection: {
              username: 1,
              display_name: 1,
              avatar_url: 1,
              verified: 1,
            },
          }
        );
        content.author = author;
      }
    }

    res.json({
      success: true,
      recommendations,
      algorithm: {
        content_based: contentBased.length,
        collaborative: collaborative.length,
        trending: trending.length,
        total: recommendations.length,
      },
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

/**
 * GET /api/tags
 * Get popular tags with usage counts
 *
 * Query params:
 * - limit: Number of tags to return (default 50, max 200)
 * - category: Filter by content category
 */
router.get('/tags', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { limit = 50, category } = req.query;

    const limitNum = Math.min(200, Math.max(1, parseInt(limit)));

    const matchStage = {
      status: 'published',
      visibility: 'public',
    };

    if (category) {
      matchStage.category = category;
    }

    const tags = await db
      .collection('user_generated_content')
      .aggregate([
        { $match: matchStage },
        { $unwind: '$tags' },
        {
          $group: {
            _id: '$tags',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: limitNum },
        {
          $project: {
            _id: 0,
            tag: '$_id',
            count: 1,
          },
        },
      ])
      .toArray();

    res.json({
      success: true,
      tags,
      category: category || 'all',
    });
  } catch (error) {
    console.error('Tags error:', error);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

/**
 * GET /api/categories
 * Get content categories with counts
 */
router.get('/categories', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;

    const categories = await db
      .collection('user_generated_content')
      .aggregate([
        {
          $match: {
            status: 'published',
            visibility: 'public',
          },
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            total_views: { $sum: '$engagement.views' },
            total_likes: { $sum: '$engagement.likes' },
          },
        },
        { $sort: { count: -1 } },
        {
          $project: {
            _id: 0,
            category: '$_id',
            count: 1,
            total_views: 1,
            total_likes: 1,
          },
        },
      ])
      .toArray();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

/**
 * Initialize MongoDB text search index
 * This should be called once during server startup
 */
async function initializeSearchIndexes(db) {
  try {
    const collection = db.collection('user_generated_content');

    // Check if collection exists before creating indexes
    const collections = await db
      .listCollections({ name: 'user_generated_content' })
      .toArray();

    if (collections.length === 0) {
      // Collection doesn't exist yet - indexes will be created when first document is inserted
      console.log(
        'ℹ️  UGC collection not found - indexes will be created on first use'
      );
      return;
    }

    // Check if text index exists
    const indexes = await collection.indexes();
    const hasTextIndex = indexes.some(
      (idx) => idx.name === 'content_text_search'
    );

    if (!hasTextIndex) {
      // Create text search index
      await collection.createIndex(
        {
          title: 'text',
          description: 'text',
          'content.text': 'text',
          tags: 'text',
        },
        {
          name: 'content_text_search',
          weights: {
            title: 10,
            tags: 5,
            description: 3,
            'content.text': 1,
          },
        }
      );
      console.log('✅ Text search index created successfully');
    }

    // Create performance indexes (with background:true to avoid blocking)
    await collection.createIndex(
      { created_at: -1 },
      { name: 'created_at_desc', background: true }
    );
    await collection.createIndex(
      { published_at: -1 },
      { name: 'published_at_desc', background: true }
    );
    await collection.createIndex(
      { 'engagement.views': -1 },
      { name: 'views_desc', background: true }
    );
    await collection.createIndex(
      { category: 1, created_at: -1 },
      { name: 'category_created_desc', background: true }
    );
    await collection.createIndex(
      { author_id: 1, created_at: -1 },
      { name: 'author_created_desc', background: true }
    );

    console.log('✅ All discovery indexes created successfully');
  } catch (error) {
    // Handle specific MongoDB errors gracefully
    if (error.code === 26 || error.codeName === 'NamespaceNotFound') {
      console.log(
        'ℹ️  UGC collection not found - indexes will be created on first use'
      );
    } else {
      console.error('❌ Failed to create search indexes:', error.message);
    }
  }
}

module.exports = router;
module.exports.initializeSearchIndexes = initializeSearchIndexes;
