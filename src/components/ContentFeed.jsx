/**
 * 🔍 Content Feed Component
 * Advanced content discovery with search, filtering, trending, and recommendations
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Button,
  ButtonGroup,
  Grid,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  Star as FeaturedIcon,
  Visibility as ViewsIcon,
  ThumbUp as LikesIcon,
  Comment as CommentIcon,
  FilterList as FilterIcon,
  ArrowUpward as SortIcon,
  Close as ClearIcon,
} from '@mui/icons-material';

// Content categories from backend
const CONTENT_CATEGORIES = {
  all: { name: 'All Content', icon: '📚', color: '#666' },
  'threat-intel': { name: 'Threat Intelligence', icon: '🔍', color: '#e74c3c' },
  defense: { name: 'Defense Strategies', icon: '🛡️', color: '#3498db' },
  research: { name: 'Research', icon: '📊', color: '#9b59b6' },
  ideas: { name: 'Ideas & Suggestions', icon: '💡', color: '#f39c12' },
  general: { name: 'General Discussion', icon: '💬', color: '#95a5a6' },
  'ascii-art': { name: 'ASCII Art', icon: '🎨', color: '#1abc9c' },
  video: { name: 'Videos', icon: '🎥', color: '#e67e22' },
};

/**
 * ContentCard Component
 * Displays a single content item
 */
const ContentCard = ({ content, onClick }) => {
  const category =
    CONTENT_CATEGORIES[content.category] || CONTENT_CATEGORIES.general;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
      onClick={() => onClick(content)}
    >
      {content.content?.media?.[0]?.type === 'image' && (
        <CardMedia
          component="img"
          height="140"
          image={content.content.media[0].url}
          alt={content.title}
          sx={{ objectFit: 'cover' }}
        />
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header: Category + Status */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Chip
            label={category.name}
            size="small"
            icon={<span>{category.icon}</span>}
            sx={{
              bgcolor: category.color,
              color: 'white',
              fontWeight: 'bold',
            }}
          />
          {content.ai_metadata?.quality_score > 80 && (
            <Tooltip title="High Quality Content">
              <FeaturedIcon color="warning" fontSize="small" />
            </Tooltip>
          )}
        </Box>

        {/* Title */}
        <Typography variant="h6" component="h3" gutterBottom>
          {content.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {content.description}
        </Typography>

        {/* Tags */}
        {content.tags && content.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {content.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                size="small"
                variant="outlined"
              />
            ))}
            {content.tags.length > 3 && (
              <Chip
                label={`+${content.tags.length - 3}`}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
        )}

        {/* Author + Engagement */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              src={content.author?.avatar_url}
              alt={content.author?.display_name}
              sx={{ width: 24, height: 24 }}
            >
              {content.author?.display_name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {content.author?.display_name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <ViewsIcon fontSize="small" color="action" />
              <Typography variant="caption">
                {content.engagement?.views || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <LikesIcon fontSize="small" color="action" />
              <Typography variant="caption">
                {content.engagement?.likes || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <CommentIcon fontSize="small" color="action" />
              <Typography variant="caption">
                {content.engagement?.comments || 0}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * ContentFeed Component
 * @param {Object} currentUser - Current authenticated user
 * @param {string} authToken - JWT authentication token
 * @param {Function} onContentClick - Callback when content is clicked
 */
const ContentFeed = ({ currentUser, authToken, onContentClick }) => {
  const [feedMode, setFeedMode] = useState('recent'); // 'recent', 'trending', 'recommended'
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedTags, setSelectedTags] = useState([]);
  const [content, setContent] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  // Fetch content based on current mode
  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let endpoint = '';
      let params = new URLSearchParams();

      switch (feedMode) {
        case 'trending':
          endpoint = `${API_URL}/api/content/trending`;
          params.append('timeframe', '7d');
          if (category !== 'all') params.append('category', category);
          break;

        case 'recommended':
          if (!authToken) {
            setError('Please log in to see personalized recommendations');
            setContent([]);
            setLoading(false);
            return;
          }
          endpoint = `${API_URL}/api/content/recommended`;
          params.append('limit', '20');
          break;

        case 'search':
          endpoint = `${API_URL}/api/search`;
          params.append('q', searchQuery);
          if (category !== 'all') params.append('category', category);
          if (selectedTags.length > 0)
            params.append('tags', selectedTags.join(','));
          params.append('sort', sortBy);
          params.append('page', page.toString());
          params.append('limit', '20');
          break;

        case 'recent':
        default:
          endpoint = `${API_URL}/api/content/feed`;
          if (category !== 'all') params.append('category', category);
          params.append('sort', sortBy);
          params.append('page', page.toString());
          params.append('limit', '20');
          break;
      }

      const headers = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${endpoint}?${params.toString()}`, {
        headers,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch content');
      }

      // Handle different response formats
      if (feedMode === 'trending') {
        setContent(result.trending || []);
        setTotalPages(1);
      } else if (feedMode === 'recommended') {
        setContent(result.recommendations || []);
        setTotalPages(1);
      } else if (feedMode === 'search') {
        setContent(result.results || []);
        setTotalPages(result.pagination?.pages || 1);
      } else {
        setContent(result.content || []);
        setTotalPages(result.pagination?.pages || 1);
      }
    } catch (err) {
      console.error('Fetch content error:', err);
      setError(err.message);
      setContent([]);
    } finally {
      setLoading(false);
    }
  }, [
    feedMode,
    category,
    searchQuery,
    selectedTags,
    sortBy,
    page,
    authToken,
    API_URL,
  ]);

  // Fetch popular tags
  const fetchPopularTags = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/tags?limit=20`);
      const result = await response.json();
      if (response.ok) {
        setPopularTags(result.tags || []);
      }
    } catch (err) {
      console.error('Fetch tags error:', err);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    fetchPopularTags();
  }, [fetchPopularTags]);

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim().length > 0) {
      setFeedMode('search');
      setPage(1);
    } else {
      setFeedMode('recent');
    }
  };

  // Handle tag selection
  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setFeedMode('search');
    setPage(1);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setCategory('all');
    setSelectedTags([]);
    setSortBy('recent');
    setFeedMode('recent');
    setPage(1);
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        🔍 Content Discovery
      </Typography>

      {/* Feed Mode Tabs */}
      <Tabs
        value={feedMode === 'search' ? 'recent' : feedMode}
        onChange={(e, newMode) => {
          setFeedMode(newMode);
          setPage(1);
        }}
        sx={{ mb: 2 }}
      >
        <Tab
          label="Recent"
          value="recent"
          icon={<span>🆕</span>}
          iconPosition="start"
        />
        <Tab
          label="Trending"
          value="trending"
          icon={<TrendingIcon />}
          iconPosition="start"
        />
        {authToken && (
          <Tab
            label="For You"
            value="recommended"
            icon={<FeaturedIcon />}
            iconPosition="start"
          />
        )}
      </Tabs>

      {/* Search & Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Search Box */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchQuery('')}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Category Filter */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                >
                  {Object.entries(CONTENT_CATEGORIES).map(([key, cat]) => (
                    <MenuItem key={key} value={key}>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort By */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="recent">Most Recent</MenuItem>
                  <MenuItem value="popular">Most Popular</MenuItem>
                  <MenuItem value="relevance">Most Relevant</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Search Button & Clear Filters */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
                {(searchQuery ||
                  category !== 'all' ||
                  selectedTags.length > 0) && (
                  <Button
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  onDelete={() => handleTagToggle(tag)}
                  color="primary"
                />
              ))}
            </Box>
          )}

          {/* Popular Tags */}
          {popularTags.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Popular Tags:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {popularTags.slice(0, 10).map((tagObj) => (
                  <Chip
                    key={tagObj.tag}
                    label={`#${tagObj.tag} (${tagObj.count})`}
                    size="small"
                    onClick={() => handleTagToggle(tagObj.tag)}
                    variant={
                      selectedTags.includes(tagObj.tag) ? 'filled' : 'outlined'
                    }
                    color={
                      selectedTags.includes(tagObj.tag) ? 'primary' : 'default'
                    }
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Content Grid */}
      {!loading && content.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No content found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search filters or category
          </Typography>
        </Box>
      )}

      {!loading && content.length > 0 && (
        <>
          <Grid container spacing={3}>
            {content.map((item) => (
              <Grid item key={item._id} xs={12} sm={6} md={4}>
                <ContentCard content={item} onClick={onContentClick} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ContentFeed;
