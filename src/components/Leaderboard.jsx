/**
 * 🏆📊 Leaderboard Component
 * Shows user rankings by points, content, and engagement
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingIcon,
  Create as ContentIcon,
  ThumbUp as EngagementIcon,
} from '@mui/icons-material';

/**
 * Medal colors for top 3
 */
const MEDAL_COLORS = {
  1: '#FFD700', // Gold
  2: '#C0C0C0', // Silver
  3: '#CD7F32', // Bronze
};

/**
 * Category icons
 */
const CATEGORY_ICONS = {
  points: <TrophyIcon />,
  content: <ContentIcon />,
  engagement: <EngagementIcon />,
};

/**
 * Leaderboard Component
 * @param {Object} currentUser - Current authenticated user
 */
const Leaderboard = ({ currentUser }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [timeframe, setTimeframe] = useState('all');
  const [category, setCategory] = useState('points');
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const authToken = localStorage.getItem('auth_token');

  // Fetch leaderboard data
  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, category]);

  /**
   * Fetch leaderboard
   */
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      const headers = {};
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_URL}/api/gamification/leaderboard?timeframe=${timeframe}&category=${category}&limit=100`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      const data = await response.json();

      setLeaderboard(data.leaderboard || []);
      setCurrentUserRank(data.current_user_rank);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get rank icon/medal
   */
  const getRankDisplay = (rank) => {
    if (rank <= 3) {
      return (
        <Tooltip title={`${rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'} Medal`}>
          <TrophyIcon sx={{ color: MEDAL_COLORS[rank], fontSize: 32 }} />
        </Tooltip>
      );
    }
    return (
      <Chip
        label={`#${rank}`}
        size="small"
        sx={{ fontWeight: 'bold', minWidth: 45 }}
      />
    );
  };

  /**
   * Get score label based on category
   */
  const getScoreLabel = () => {
    switch (category) {
      case 'points':
        return 'Points';
      case 'content':
        return 'Content Published';
      case 'engagement':
        return 'Total Views';
      default:
        return 'Score';
    }
  };

  /**
   * Format score display
   */
  const formatScore = (score) => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`;
    }
    return score.toLocaleString();
  };

  /**
   * Check if row is current user
   */
  const isCurrentUser = (entry) => {
    return currentUser && entry.user._id === currentUser._id;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🏆 Leaderboard
        </Typography>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select value={timeframe} label="Timeframe" onChange={(e) => setTimeframe(e.target.value)}>
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              startAdornment={CATEGORY_ICONS[category]}
            >
              <MenuItem value="points">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon fontSize="small" />
                  Points
                </Box>
              </MenuItem>
              <MenuItem value="content">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContentIcon fontSize="small" />
                  Content Created
                </Box>
              </MenuItem>
              <MenuItem value="engagement">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EngagementIcon fontSize="small" />
                  Engagement
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Current user rank card */}
        {currentUser && currentUserRank && (
          <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    src={currentUser.avatar_url}
                    alt={currentUser.username}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="h6">Your Rank</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {currentUser.username}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h3">#{currentUserRank}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    out of {leaderboard.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Leaderboard table */}
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                {getScoreLabel()}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Total Points
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry) => (
                <TableRow
                  key={entry.user._id}
                  sx={{
                    bgcolor: isCurrentUser(entry)
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    '&:hover': {
                      bgcolor: isCurrentUser(entry)
                        ? alpha(theme.palette.primary.main, 0.2)
                        : 'action.hover',
                    },
                  }}
                >
                  {/* Rank */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {getRankDisplay(entry.rank)}
                    </Box>
                  </TableCell>

                  {/* User */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        src={entry.user.avatar_url}
                        alt={entry.user.username}
                        sx={{ width: 40, height: 40 }}
                      >
                        {entry.user.username?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body1" fontWeight={isCurrentUser(entry) ? 'bold' : 'normal'}>
                            {entry.user.display_name || entry.user.username}
                          </Typography>
                          {entry.user.verified && (
                            <Tooltip title="Verified User">
                              <VerifiedIcon color="primary" fontSize="small" />
                            </Tooltip>
                          )}
                          {isCurrentUser(entry) && (
                            <Chip label="You" size="small" color="primary" />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          @{entry.user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Score */}
                  <TableCell align="right">
                    <Typography variant="h6" color="primary">
                      {formatScore(entry.score)}
                    </Typography>
                  </TableCell>

                  {/* Total Points */}
                  <TableCell align="right">
                    <Chip
                      icon={<TrophyIcon />}
                      label={formatScore(entry.reputation?.points || 0)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                    No leaderboard data available yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer note */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
        Leaderboard updates in real-time. Rankings reset based on selected timeframe.
      </Typography>
    </Box>
  );
};

export default Leaderboard;
