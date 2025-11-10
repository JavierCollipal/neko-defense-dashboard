/**
 * 💡 Idea Board Component
 * Trello-style board for community ideas with voting and status tracking
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  IconButton,
  Grid,
  LinearProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  ThumbUp as UpvoteIcon,
  ThumbDown as DownvoteIcon,
  Visibility as ViewsIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CompletedIcon,
  HourglassEmpty as ProposedIcon,
  Build as InProgressIcon,
} from '@mui/icons-material';

// Idea statuses with colors
const IDEA_STATUSES = {
  proposed: { label: 'Proposed', color: '#95a5a6', icon: <ProposedIcon /> },
  reviewing: { label: 'Under Review', color: '#f39c12', icon: <TrendingIcon /> },
  approved: { label: 'Approved', color: '#3498db', icon: <TrendingIcon /> },
  in_progress: { label: 'In Progress', color: '#9b59b6', icon: <InProgressIcon /> },
  completed: { label: 'Completed', color: '#27ae60', icon: <CompletedIcon /> },
  rejected: { label: 'Rejected', color: '#e74c3c', icon: <ProposedIcon /> },
};

// Idea categories
const IDEA_CATEGORIES = {
  feature: { label: 'Feature Request', icon: '✨' },
  improvement: { label: 'Improvement', icon: '🔧' },
  bug: { label: 'Bug Report', icon: '🐛' },
  content: { label: 'Content Idea', icon: '📝' },
  design: { label: 'Design', icon: '🎨' },
  other: { label: 'Other', icon: '💡' },
};

/**
 * IdeaCard Component
 */
const IdeaCard = ({ idea, currentUser, onVote, onClick }) => {
  const statusInfo = IDEA_STATUSES[idea.status] || IDEA_STATUSES.proposed;
  const categoryInfo = IDEA_CATEGORIES[idea.category] || IDEA_CATEGORIES.other;

  const handleVote = async (voteType, e) => {
    e.stopPropagation();
    if (onVote) {
      await onVote(idea._id, voteType);
    }
  };

  const hasUpvoted = idea.user_vote === 'upvote';
  const hasDownvoted = idea.user_vote === 'downvote';

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderLeft: `4px solid ${statusInfo.color}`,
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
      }}
      onClick={() => onClick(idea)}
    >
      <CardContent>
        {/* Header: Category + Status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Chip
            label={categoryInfo.label}
            icon={<span>{categoryInfo.icon}</span>}
            size="small"
            variant="outlined"
          />
          <Chip
            label={statusInfo.label}
            icon={statusInfo.icon}
            size="small"
            sx={{ bgcolor: statusInfo.color, color: 'white' }}
          />
        </Box>

        {/* Title */}
        <Typography variant="h6" gutterBottom>
          {idea.title}
        </Typography>

        {/* Description Preview */}
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
          {idea.description}
        </Typography>

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {idea.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
            ))}
          </Box>
        )}

        {/* Voting + Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Tooltip title="Upvote">
              <IconButton
                size="small"
                color={hasUpvoted ? 'primary' : 'default'}
                onClick={(e) => handleVote(hasUpvoted ? null : 'upvote', e)}
                disabled={!currentUser}
              >
                <UpvoteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: 30 }}>
              {idea.votes?.score || 0}
            </Typography>
            <Tooltip title="Downvote">
              <IconButton
                size="small"
                color={hasDownvoted ? 'error' : 'default'}
                onClick={(e) => handleVote(hasDownvoted ? null : 'downvote', e)}
                disabled={!currentUser}
              >
                <ThumbDownIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <ViewsIcon fontSize="small" color="action" />
              <Typography variant="caption">{idea.views || 0}</Typography>
            </Box>
            <Avatar
              src={idea.author?.avatar_url}
              sx={{ width: 24, height: 24 }}
              alt={idea.author?.display_name}
            >
              {idea.author?.display_name?.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

/**
 * IdeaBoard Component
 */
const IdeaBoard = ({ currentUser, authToken }) => {
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newIdeaDialogOpen, setNewIdeaDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

  // Fetch ideas
  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      const headers = {};
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const params = new URLSearchParams({ sort: 'priority', limit: '100' });
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }

      const response = await fetch(`${API_URL}/api/ideas?${params.toString()}`, { headers });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch ideas');
      }

      setIdeas(result.ideas || []);
      organizeBoardByStatus(result.ideas || []);
    } catch (err) {
      console.error('Fetch ideas error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [authToken, categoryFilter, API_URL]);

  // Organize ideas by status
  const organizeBoardByStatus = (ideasList) => {
    const organized = {};
    Object.keys(IDEA_STATUSES).forEach((status) => {
      organized[status] = ideasList.filter((idea) => idea.status === status);
    });
    setFilteredIdeas(organized);
  };

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  // Handle voting
  const handleVote = async (ideaId, voteType) => {
    if (!authToken) {
      setError('Please log in to vote');
      return;
    }

    try {
      const endpoint = voteType
        ? `${API_URL}/api/ideas/${ideaId}/vote`
        : `${API_URL}/api/ideas/${ideaId}/vote`;
      const method = voteType ? 'POST' : 'DELETE';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: voteType ? JSON.stringify({ voteType }) : undefined,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to vote');
      }

      // Refresh ideas
      await fetchIdeas();
    } catch (err) {
      console.error('Vote error:', err);
      setError(err.message);
    }
  };

  // Submit new idea
  const handleSubmitIdea = async (ideaData) => {
    try {
      const response = await fetch(`${API_URL}/api/ideas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(ideaData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit idea');
      }

      setNewIdeaDialogOpen(false);
      await fetchIdeas();
    } catch (err) {
      console.error('Submit idea error:', err);
      setError(err.message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">💡 Community Ideas Board</Typography>
        {authToken && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewIdeaDialogOpen(true)}
          >
            Submit Idea
          </Button>
        )}
      </Box>

      {/* Category Filter */}
      <FormControl sx={{ mb: 3, minWidth: 200 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={categoryFilter}
          label="Category"
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <MenuItem value="all">All Categories</MenuItem>
          {Object.entries(IDEA_CATEGORIES).map(([key, cat]) => (
            <MenuItem key={key} value={key}>
              {cat.icon} {cat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Trello-style Board */}
      <Grid container spacing={2}>
        {Object.entries(IDEA_STATUSES).map(([status, statusInfo]) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={status}>
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, minHeight: 400 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {statusInfo.icon}
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {statusInfo.label}
                </Typography>
                <Chip label={filteredIdeas[status]?.length || 0} size="small" />
              </Box>

              <Stack spacing={1.5}>
                {filteredIdeas[status]?.map((idea) => (
                  <IdeaCard
                    key={idea._id}
                    idea={idea}
                    currentUser={currentUser}
                    onVote={handleVote}
                    onClick={setSelectedIdea}
                  />
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* New Idea Dialog */}
      <NewIdeaDialog
        open={newIdeaDialogOpen}
        onClose={() => setNewIdeaDialogOpen(false)}
        onSubmit={handleSubmitIdea}
      />

      {/* Idea Detail Dialog */}
      {selectedIdea && (
        <IdeaDetailDialog
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          currentUser={currentUser}
          authToken={authToken}
        />
      )}
    </Box>
  );
};

/**
 * New Idea Dialog Component
 */
const NewIdeaDialog = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('feature');
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    const ideaData = {
      title,
      description,
      category,
      tags: tags.split(',').map((t) => t.trim()).filter((t) => t),
    };
    onSubmit(ideaData);
    setTitle('');
    setDescription('');
    setCategory('feature');
    setTags('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>💡 Submit New Idea</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief, descriptive title..."
          />

          <TextField
            label="Description"
            fullWidth
            required
            multiline
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of your idea..."
          />

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
              {Object.entries(IDEA_CATEGORIES).map(([key, cat]) => (
                <MenuItem key={key} value={key}>
                  {cat.icon} {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Tags"
            fullWidth
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            helperText="Separate tags with commas"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!title || !description}>
          Submit Idea
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * Idea Detail Dialog Component (simplified)
 */
const IdeaDetailDialog = ({ idea, onClose }) => {
  const statusInfo = IDEA_STATUSES[idea.status] || IDEA_STATUSES.proposed;

  return (
    <Dialog open={Boolean(idea)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{idea.title}</span>
          <Chip label={statusInfo.label} sx={{ bgcolor: statusInfo.color, color: 'white' }} />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
          {idea.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {idea.tags?.map((tag) => <Chip key={tag} label={`#${tag}`} size="small" />)}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdeaBoard;
