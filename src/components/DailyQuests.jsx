/**
 * 📝✨ Daily Quests Component
 * Shows daily quests with progress tracking and rewards
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  LinearProgress,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Stack,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  EmojiEvents as TrophyIcon,
  Refresh as RefreshIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

/**
 * DailyQuests Component
 * @param {Object} currentUser - Current authenticated user
 */
const DailyQuests = ({ currentUser }) => {
  const [quests, setQuests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const authToken = localStorage.getItem('auth_token');

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (currentUser) {
      fetchQuests();
      const interval = setInterval(fetchQuests, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  /**
   * Fetch daily quests
   */
  const fetchQuests = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/gamification/daily-quests`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch quests');
      const data = await response.json();

      setQuests(data.quests || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching quests:', error);
      setNotification({
        open: true,
        message: 'Failed to load daily quests',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Claim quest reward
   */
  const claimQuest = async (questId) => {
    try {
      setClaiming(questId);

      const response = await fetch(
        `${API_URL}/api/gamification/daily-quests/${questId}/complete`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to claim quest');
      }

      const data = await response.json();

      setNotification({
        open: true,
        message: `🎉 Quest completed! Earned ${data.reward.points} points!`,
        severity: 'success',
      });

      // Refresh quests
      await fetchQuests();
    } catch (error) {
      console.error('Error claiming quest:', error);
      setNotification({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setClaiming(null);
    }
  };

  /**
   * Get time until reset (midnight)
   */
  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  /**
   * Render quest card
   */
  const renderQuestCard = (quest) => {
    const isComplete = quest.completed && !quest.already_completed_today;
    const alreadyClaimed = quest.already_completed_today;

    return (
      <Card
        key={quest.id}
        sx={{
          borderLeft: alreadyClaimed
            ? '4px solid #4caf50'
            : isComplete
              ? '4px solid #2196f3'
              : '4px solid #9e9e9e',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h3" component="span">
                {quest.icon}
              </Typography>
              <Box>
                <Typography variant="h6">{quest.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {quest.description}
                </Typography>
              </Box>
            </Box>
            {alreadyClaimed && (
              <CompleteIcon color="success" fontSize="large" />
            )}
          </Box>

          {/* Progress bar */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
            >
              <Typography variant="body2" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {quest.progress.current} / {quest.progress.target}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={quest.progress.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: alreadyClaimed
                    ? '#4caf50'
                    : isComplete
                      ? '#2196f3'
                      : '#9e9e9e',
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.5 }}
            >
              {quest.progress.percentage.toFixed(0)}% Complete
            </Typography>
          </Box>

          {/* Reward and action */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Chip
              icon={<TrophyIcon />}
              label={`${quest.points} points`}
              color={alreadyClaimed ? 'success' : 'primary'}
              variant={alreadyClaimed ? 'filled' : 'outlined'}
            />

            {alreadyClaimed ? (
              <Chip label="Claimed" color="success" icon={<CompleteIcon />} />
            ) : isComplete ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => claimQuest(quest.id)}
                disabled={claiming === quest.id}
                startIcon={
                  claiming === quest.id ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <TrophyIcon />
                  )
                }
              >
                {claiming === quest.id ? 'Claiming...' : 'Claim Reward'}
              </Button>
            ) : (
              <Chip label="In Progress" variant="outlined" />
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (!currentUser) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Please log in to view daily quests
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
      {/* Header */}
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
            📝 Daily Quests
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchQuests}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>

        {/* Stats card */}
        {stats && (
          <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3">
                      {stats.completed_today}
                    </Typography>
                    <Typography variant="body2">Completed Today</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3">
                      {stats.total_available}
                    </Typography>
                    <Typography variant="body2">Total Quests</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3">
                      {stats.completion_percentage}%
                    </Typography>
                    <Typography variant="body2">Daily Progress</Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats.completion_percentage}
                      sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'white',
                        },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Reset timer */}
        <Alert severity="info" icon={<TimerIcon />} sx={{ mb: 3 }}>
          Quests reset in: <strong>{getTimeUntilReset()}</strong>
        </Alert>
      </Box>

      {/* Quest list */}
      <Stack spacing={2}>
        {quests.length > 0 ? (
          quests.map(renderQuestCard)
        ) : (
          <Typography variant="body1" color="text.secondary" textAlign="center">
            No daily quests available.
          </Typography>
        )}
      </Stack>

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

export default DailyQuests;
