/**
 * 🏆 Achievement Display Component
 * Shows user's earned achievements and progress
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  LinearProgress,
  Button,
  Avatar,
  Tooltip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Lock as LockedIcon,
  CheckCircle as CompletedIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

/**
 * Achievement rarity colors
 */
const RARITY_COLORS = {
  common: '#9e9e9e',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
};

/**
 * Achievement categories
 */
const CATEGORIES = [
  { id: 'all', label: 'All Achievements' },
  { id: 'content', label: 'Content Creation' },
  { id: 'engagement', label: 'Engagement' },
  { id: 'community', label: 'Community' },
  { id: 'special', label: 'Special' },
  { id: 'challenges', label: 'Challenges' },
];

/**
 * AchievementDisplay Component
 * @param {Object} currentUser - Current authenticated user
 */
const AchievementDisplay = ({ currentUser }) => {
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const authToken = localStorage.getItem('auth_token');

  // Fetch achievements on mount
  useEffect(() => {
    if (currentUser) {
      fetchAchievements();
    }
  }, [currentUser]);

  /**
   * Fetch user's earned achievements and all available achievements
   */
  const fetchAchievements = async () => {
    try {
      setLoading(true);

      // Fetch earned achievements
      const earnedResponse = await fetch(
        `${API_URL}/api/gamification/my-achievements`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!earnedResponse.ok)
        throw new Error('Failed to fetch earned achievements');
      const earnedData = await earnedResponse.json();
      setEarnedAchievements(earnedData.earned_achievements || []);
      setStats(earnedData.stats);

      // Fetch all achievements
      const allResponse = await fetch(
        `${API_URL}/api/gamification/achievements?include_secret=true`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!allResponse.ok) throw new Error('Failed to fetch all achievements');
      const allData = await allResponse.json();
      setAllAchievements(allData.achievements || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setNotification({
        open: true,
        message: 'Failed to load achievements',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check for new achievements
   */
  const checkForNewAchievements = async () => {
    try {
      setChecking(true);

      const response = await fetch(
        `${API_URL}/api/gamification/check-achievements`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to check achievements');
      const data = await response.json();

      if (data.newly_earned && data.newly_earned.length > 0) {
        setNotification({
          open: true,
          message: `🎉 You earned ${data.newly_earned.length} new achievement(s)!`,
          severity: 'success',
        });
        // Refresh achievements
        await fetchAchievements();
      } else {
        setNotification({
          open: true,
          message: 'No new achievements yet. Keep going!',
          severity: 'info',
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
      setNotification({
        open: true,
        message: 'Failed to check for new achievements',
        severity: 'error',
      });
    } finally {
      setChecking(false);
    }
  };

  /**
   * Check if achievement is earned
   */
  const isAchievementEarned = (achievementId) => {
    return earnedAchievements.some((badge) => badge.id === achievementId);
  };

  /**
   * Get earned achievement data
   */
  const getEarnedData = (achievementId) => {
    return earnedAchievements.find((badge) => badge.id === achievementId);
  };

  /**
   * Filter achievements by category
   */
  const filteredAchievements = allAchievements.filter((achievement) => {
    if (selectedCategory === 'all') return true;
    return achievement.category === selectedCategory;
  });

  /**
   * Render achievement card
   */
  const renderAchievementCard = (achievement) => {
    const earned = isAchievementEarned(achievement.id);
    const earnedData = getEarnedData(achievement.id);

    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={achievement.id}>
        <Card
          sx={{
            height: '100%',
            opacity: earned ? 1 : 0.6,
            borderTop: `4px solid ${RARITY_COLORS[achievement.rarity]}`,
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            },
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                mb: 2,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: earned
                    ? RARITY_COLORS[achievement.rarity]
                    : 'grey.400',
                  width: 56,
                  height: 56,
                  fontSize: '2rem',
                }}
              >
                {earned ? achievement.icon : <LockedIcon />}
              </Avatar>
              {earned && (
                <Tooltip title="Achievement Unlocked!">
                  <CompletedIcon color="success" />
                </Tooltip>
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              {achievement.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, minHeight: 40 }}
            >
              {achievement.description}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Chip
                label={achievement.rarity}
                size="small"
                sx={{
                  bgcolor: RARITY_COLORS[achievement.rarity],
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              />
              <Chip
                label={`${achievement.points} pts`}
                size="small"
                icon={<TrophyIcon />}
                variant="outlined"
              />
            </Box>

            {earned && earnedData && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1 }}
              >
                Earned on {new Date(earnedData.earned_at).toLocaleDateString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please log in to view achievements
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header with stats */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            🏆 Achievements
          </Typography>
          <Button
            variant="contained"
            startIcon={
              checking ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <RefreshIcon />
              )
            }
            onClick={checkForNewAchievements}
            disabled={checking}
          >
            Check for New
          </Button>
        </Box>

        {/* Stats overview */}
        {stats && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h3" color="primary">
                    {stats.total_earned}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Achievements Earned
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h3" color="primary">
                    {stats.total_available}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Available
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box>
                    <Typography variant="h3" color="primary">
                      {stats.completion_percentage}%
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Completion
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats.completion_percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Category tabs */}
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 2 }}
        >
          {CATEGORIES.map((category) => (
            <Tab key={category.id} label={category.label} value={category.id} />
          ))}
        </Tabs>
      </Box>

      {/* Achievement grid */}
      <Grid container spacing={3}>
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map(renderAchievementCard)
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              No achievements in this category yet.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Notification snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AchievementDisplay;
