/**
 * 👤 User Profile Component
 * Displays user information, reputation, badges, and statistics
 */

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Grid,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  Visibility as ViewsIcon,
  ThumbUp as LikesIcon,
  Article as ArticleIcon,
  People as FollowersIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

/**
 * Calculate progress to next level
 * Formula: Level = floor(sqrt(points / 10)) + 1
 * Reverse: points_for_next_level = (level)^2 * 10
 */
const calculateLevelProgress = (currentPoints, currentLevel) => {
  const nextLevel = currentLevel + 1;
  const pointsForNextLevel = Math.pow(nextLevel - 1, 2) * 10;
  const pointsForCurrentLevel = Math.pow(currentLevel - 1, 2) * 10;
  const pointsNeeded = pointsForNextLevel - pointsForCurrentLevel;
  const pointsEarned = currentPoints - pointsForCurrentLevel;
  const progress = (pointsEarned / pointsNeeded) * 100;

  return {
    progress: Math.min(100, Math.max(0, progress)),
    pointsNeeded,
    pointsEarned,
    pointsToNextLevel: pointsForNextLevel - currentPoints,
  };
};

/**
 * UserProfile Component
 * @param {Object} user - User object from API
 * @param {boolean} isOwnProfile - Whether this is the current user's profile
 * @param {Function} onEdit - Callback for edit button
 */
const UserProfile = ({ user, isOwnProfile = false, onEdit }) => {
  const [levelProgress, setLevelProgress] = useState({
    progress: 0,
    pointsNeeded: 0,
    pointsEarned: 0,
    pointsToNextLevel: 0,
  });

  useEffect(() => {
    if (user?.reputation) {
      const progress = calculateLevelProgress(
        user.reputation.points,
        user.reputation.level
      );
      setLevelProgress(progress);
    }
  }, [user]);

  if (!user) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading user profile...</Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    username,
    display_name,
    bio,
    avatar_url,
    reputation,
    stats,
    role,
    verified,
  } = user;

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <CardContent>
        {/* Header Section */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Avatar
            src={avatar_url}
            alt={display_name}
            sx={{
              width: 100,
              height: 100,
              mr: 3,
              fontSize: '2rem',
              bgcolor: 'primary.main',
            }}
          >
            {display_name?.charAt(0).toUpperCase() || '🐾'}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h4" component="h1">
                {display_name}
              </Typography>
              {verified && (
                <Tooltip title="Verified User">
                  <StarIcon color="primary" />
                </Tooltip>
              )}
              {isOwnProfile && (
                <IconButton
                  size="small"
                  onClick={onEdit}
                  sx={{ ml: 'auto' }}
                  aria-label="Edit profile"
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              @{username}
            </Typography>

            {role !== 'user' && (
              <Chip
                label={role.toUpperCase()}
                size="small"
                color={role === 'admin' ? 'error' : 'secondary'}
                sx={{ mb: 1 }}
              />
            )}

            {bio && (
              <Typography variant="body1" sx={{ mt: 2 }}>
                {bio}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Reputation Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TrophyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Level {reputation.level}</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 'auto' }}
            >
              {reputation.points.toLocaleString()} points
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={levelProgress.progress}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 0.5,
            }}
          />

          <Typography variant="caption" color="text.secondary">
            {levelProgress.pointsToNextLevel > 0
              ? `${levelProgress.pointsToNextLevel.toLocaleString()} points to level ${reputation.level + 1}`
              : 'Max level reached!'}
          </Typography>
        </Box>

        {/* Badges Section */}
        {reputation.badges && reputation.badges.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Achievements
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {reputation.badges.map((badge) => (
                <Tooltip
                  key={badge.id}
                  title={`${badge.name} - Earned ${new Date(badge.earned_at).toLocaleDateString()}`}
                >
                  <Chip
                    icon={<span>{badge.icon}</span>}
                    label={badge.name}
                    variant="outlined"
                    color="primary"
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Stats Section */}
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <ArticleIcon color="action" />
              </Box>
              <Typography variant="h6">
                {stats.content_count.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Posts
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <ViewsIcon color="action" />
              </Box>
              <Typography variant="h6">
                {stats.total_views.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Views
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <LikesIcon color="action" />
              </Box>
              <Typography variant="h6">
                {stats.total_likes.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Likes
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <FollowersIcon color="action" />
              </Box>
              <Typography variant="h6">
                {stats.followers.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Followers
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
