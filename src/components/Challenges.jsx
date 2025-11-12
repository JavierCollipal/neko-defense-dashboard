/**
 * 🏅⚔️ Challenges Component
 * Community challenges with countdown, submissions, and leaderboards
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  LinearProgress,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Avatar,
  AvatarGroup,
  Stack,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Send as SubmitIcon,
  Leaderboard as LeaderboardIcon,
} from '@mui/icons-material';

/**
 * Status colors
 */
const STATUS_COLORS = {
  upcoming: '#2196f3',
  active: '#4caf50',
  judging: '#ff9800',
  completed: '#9e9e9e',
  cancelled: '#f44336',
};

/**
 * Challenges Component
 * @param {Object} currentUser - Current authenticated user
 */
const Challenges = ({ currentUser }) => {
  const [challenges, setChallenges] = useState([]);
  const [selectedTab, setSelectedTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [submitDialog, setSubmitDialog] = useState({
    open: false,
    challenge: null,
  });
  const [submissionData, setSubmissionData] = useState({
    title: '',
    description: '',
    submission_url: '',
  });
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const authToken = localStorage.getItem('auth_token');

  // Fetch challenges
  useEffect(() => {
    fetchChallenges();
    const interval = setInterval(fetchChallenges, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedTab]);

  /**
   * Fetch challenges by status
   */
  const fetchChallenges = async () => {
    try {
      setLoading(true);

      const headers = {};
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `${API_URL}/api/challenges?status=${selectedTab}&limit=20`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to fetch challenges');
      const data = await response.json();

      setChallenges(data.challenges || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculate time remaining
   */
  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  /**
   * Register for challenge
   */
  const registerForChallenge = async (challengeId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/challenges/${challengeId}/register`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to register');

      setNotification({
        open: true,
        message: '✅ Successfully registered for challenge!',
        severity: 'success',
      });

      fetchChallenges();
    } catch (error) {
      console.error('Error registering:', error);
      setNotification({
        open: true,
        message: error.message,
        severity: 'error',
      });
    }
  };

  /**
   * Open submit dialog
   */
  const openSubmitDialog = (challenge) => {
    setSubmitDialog({ open: true, challenge });
    setSubmissionData({ title: '', description: '', submission_url: '' });
  };

  /**
   * Submit entry
   */
  const submitEntry = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/challenges/${submitDialog.challenge._id}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) throw new Error('Failed to submit');

      setNotification({
        open: true,
        message: '🎉 Submission successful!',
        severity: 'success',
      });

      setSubmitDialog({ open: false, challenge: null });
      fetchChallenges();
    } catch (error) {
      console.error('Error submitting:', error);
      setNotification({
        open: true,
        message: error.message,
        severity: 'error',
      });
    }
  };

  /**
   * Render challenge card
   */
  const renderChallengeCard = (challenge) => {
    const isRegistered = challenge.participants?.some(
      (p) => p.user_id === currentUser?._id
    );
    const hasSubmitted = challenge.submissions?.some(
      (s) => s.user_id === currentUser?._id
    );

    return (
      <Card
        key={challenge._id}
        sx={{
          borderLeft: `4px solid ${STATUS_COLORS[challenge.status]}`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h5" gutterBottom>
                {challenge.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {challenge.description}
              </Typography>
            </Box>
            <Chip
              label={challenge.status}
              sx={{
                bgcolor: STATUS_COLORS[challenge.status],
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
              }}
            />
          </Box>

          {/* Type and Category */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip label={challenge.type} size="small" variant="outlined" />
            <Chip label={challenge.category} size="small" variant="outlined" />
            {challenge.featured && (
              <Chip label="Featured" size="small" color="primary" />
            )}
          </Stack>

          {/* Stats */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TimeIcon color="action" />
                <Typography variant="caption" display="block">
                  {getTimeRemaining(challenge.end_time)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <PeopleIcon color="action" />
                <Typography variant="caption" display="block">
                  {challenge.total_participants} participants
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ textAlign: 'center' }}>
                <TrophyIcon color="action" />
                <Typography variant="caption" display="block">
                  {challenge.prizes?.[0]?.points || 0} pts prize
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Progress bar for active challenges */}
          {challenge.status === 'active' && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Challenge Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={
                  ((new Date() - new Date(challenge.start_time)) /
                    (new Date(challenge.end_time) -
                      new Date(challenge.start_time))) *
                  100
                }
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {!currentUser ? (
              <Typography variant="body2" color="text.secondary">
                Login to participate
              </Typography>
            ) : challenge.status === 'active' ||
              challenge.status === 'upcoming' ? (
              <>
                {!isRegistered ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => registerForChallenge(challenge._id)}
                  >
                    Register
                  </Button>
                ) : !hasSubmitted ? (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SubmitIcon />}
                    onClick={() => openSubmitDialog(challenge)}
                    disabled={challenge.status !== 'active'}
                  >
                    Submit Entry
                  </Button>
                ) : (
                  <Chip label="Submitted ✓" color="success" />
                )}
                <Button
                  variant="text"
                  size="small"
                  startIcon={<LeaderboardIcon />}
                >
                  View Leaderboard
                </Button>
              </>
            ) : (
              <Button
                variant="text"
                size="small"
                startIcon={<LeaderboardIcon />}
              >
                View Results
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

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
      <Typography variant="h4" component="h1" gutterBottom>
        🏅 Challenges & Contests
      </Typography>

      {/* Tabs */}
      <Tabs
        value={selectedTab}
        onChange={(e, newValue) => setSelectedTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Active" value="active" />
        <Tab label="Upcoming" value="upcoming" />
        <Tab label="Completed" value="completed" />
      </Tabs>

      {/* Challenge grid */}
      <Grid container spacing={3}>
        {challenges.length > 0 ? (
          challenges.map((challenge) => (
            <Grid item xs={12} md={6} key={challenge._id}>
              {renderChallengeCard(challenge)}
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              No {selectedTab} challenges at the moment.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Submit Dialog */}
      <Dialog
        open={submitDialog.open}
        onClose={() => setSubmitDialog({ open: false, challenge: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Submit Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="normal"
            value={submissionData.title}
            onChange={(e) =>
              setSubmissionData({ ...submissionData, title: e.target.value })
            }
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={submissionData.description}
            onChange={(e) =>
              setSubmissionData({
                ...submissionData,
                description: e.target.value,
              })
            }
          />
          <TextField
            label="Submission URL (optional)"
            fullWidth
            margin="normal"
            value={submissionData.submission_url}
            onChange={(e) =>
              setSubmissionData({
                ...submissionData,
                submission_url: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSubmitDialog({ open: false, challenge: null })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitEntry}
            disabled={!submissionData.title || !submissionData.description}
          >
            Submit Entry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
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

export default Challenges;
