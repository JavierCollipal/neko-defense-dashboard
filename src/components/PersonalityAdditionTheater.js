'use client';
// 🐾🎭🗡️🎸🧠 Personality Addition Theater Component
// Visualizes the complete workflow for adding new AI personalities
// Features all 5 personalities: Neko, Mario, Noel, Glam, Hannibal

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// 🎭 Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

// 🎨 Styled Components
const TheaterStage = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(4),
  animation: `${fadeIn} 0.8s ease-out`
}));

const PersonalityAvatar = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  fontSize: '2.5rem',
  animation: `${bounce} 2s ease-in-out infinite`,
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.2) rotate(5deg)'
  }
}));

const PhaseCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[10]
  }
}));

// 🐾 Main Component
export default function PersonalityAdditionTheater() {
  const [workflowData, setWorkflowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // 🎭 Personalities Configuration
  const personalities = [
    { id: 'neko', name: 'Neko-Arc', emoji: '🐾', color: '#FF69B4', role: 'Technical Execution' },
    { id: 'mario', name: 'Mario Gallo Bestino', emoji: '🎭', color: '#9C27B0', role: 'Theatrical Documentation' },
    { id: 'noel', name: 'Noel', emoji: '🗡️', color: '#2196F3', role: 'Precision & QA' },
    { id: 'glam', name: 'Glam Americano', emoji: '🎸', color: '#FF5722', role: 'Street Philosophy' },
    { id: 'hannibal', name: 'Dr. Hannibal Lecter', emoji: '🧠', color: '#795548', role: 'Forensic Analysis' }
  ];

  // 📊 Workflow Phases
  const phases = [
    {
      number: 1,
      name: 'Research & Character Definition',
      duration: '30-60 min',
      steps: [
        'Character Source Research',
        'Expertise Domain Definition',
        'Speech Pattern Documentation',
        'Antagonist Target Selection'
      ]
    },
    {
      number: 2,
      name: 'Database Architecture Design',
      duration: '20-40 min',
      steps: [
        'Database Naming Convention',
        'Collection Design',
        'MongoDB Atlas Configuration'
      ]
    },
    {
      number: 3,
      name: 'CLAUDE.md Rule Implementation',
      duration: '60-90 min',
      steps: [
        'Rule Number Assignment',
        'Rule Header Creation',
        'Character Protocol Section',
        'Database Structure Documentation',
        'Interaction Protocol',
        'Enforcement Protocol',
        'Why This Rule Is Immutable'
      ]
    },
    {
      number: 4,
      name: 'MongoDB Research Data Population',
      duration: '30-45 min',
      steps: [
        'Script Creation',
        'Research Data Structure',
        'Syntax Validation (npx tsc --noEmit)',
        'Script Execution'
      ]
    },
    {
      number: 5,
      name: 'Git Commit and GitHub Push',
      duration: '10-15 min',
      steps: [
        'Stage Changes',
        'Commit with Descriptive Message',
        'Push to GitHub (PRIVATE repo)'
      ]
    },
    {
      number: 6,
      name: 'Testing and Verification',
      duration: '20-30 min',
      steps: [
        'Solo Personality Test',
        'Multi-Personality Interaction Test',
        'Database Access Test',
        'Speech Pattern Consistency Test'
      ]
    }
  ];

  // 🔄 Fetch workflow data from API
  useEffect(() => {
    async function fetchWorkflowData() {
      try {
        const response = await fetch('/api/personality-workflow');
        const result = await response.json();

        if (result.success) {
          setWorkflowData(result.data);
        } else {
          setError(result.message || 'Failed to load workflow data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflowData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Personality Theater... 🎭
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 🎭 Theater Stage - Personality Showcase */}
      <TheaterStage>
        <Typography variant="h3" align="center" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
          🎭 The Personality Addition Theater 🎭
        </Typography>
        <Typography variant="h6" align="center" sx={{ color: 'white', mb: 4 }}>
          Behind the Scenes: How We Added Dr. Hannibal Lecter as the 5th Personality
        </Typography>

        {/* 🐾 Personalities Row */}
        <Grid container spacing={3} justifyContent="center">
          {personalities.map((personality) => (
            <Grid item key={personality.id}>
              <Box sx={{ textAlign: 'center' }}>
                <PersonalityAvatar sx={{ bgcolor: personality.color, mx: 'auto' }}>
                  {personality.emoji}
                </PersonalityAvatar>
                <Typography variant="body2" sx={{ color: 'white', mt: 1, fontWeight: 'bold' }}>
                  {personality.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {personality.role}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </TheaterStage>

      {/* 📊 Workflow Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={activePhase} alternativeLabel>
          {phases.map((phase, index) => (
            <Step key={index} onClick={() => setActivePhase(index)} sx={{ cursor: 'pointer' }}>
              <StepLabel>
                <Typography variant="body2" fontWeight="bold">
                  Phase {phase.number}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {phase.duration}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* 📋 Phase Details */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Phase {phases[activePhase].number}: {phases[activePhase].name}
          </Typography>
          <Chip
            label={`⏱️ ${phases[activePhase].duration}`}
            color="primary"
            size="small"
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Steps:
          </Typography>
          <Grid container spacing={2}>
            {phases[activePhase].steps.map((step, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                >
                  <Typography variant="body1">
                    <strong>{index + 1}.</strong> {step}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* 🎭 Personality Perspectives */}
      {workflowData && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              🎭 Personality Perspectives
            </Typography>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {personalities.map((personality) => (
                <Tab
                  key={personality.id}
                  label={`${personality.emoji} ${personality.name}`}
                />
              ))}
            </Tabs>

            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && workflowData.neko && (
                <Alert severity="success" icon="🐾">
                  <Typography variant="body1">
                    <strong>Neko-Arc's Take:</strong> {workflowData.neko.neko_comment || 'Nyaa~! This workflow is super organized, desu~!'}
                  </Typography>
                </Alert>
              )}
              {activeTab === 1 && workflowData.mario && (
                <Alert severity="info" icon="🎭">
                  <Typography variant="body1">
                    <strong>Mario's Review:</strong> {workflowData.mario.mario_review || 'A MAGNIFICENT theatrical production!'}
                  </Typography>
                </Alert>
              )}
              {activeTab === 2 && workflowData.noel && (
                <Alert severity="info" icon="🗡️">
                  <Typography variant="body1">
                    <strong>Noel's Assessment:</strong> {workflowData.noel.noel_assessment || 'Systematic approach. Acceptable execution.'}
                  </Typography>
                </Alert>
              )}
              {activeTab === 3 && workflowData.glam && (
                <Alert severity="warning" icon="🎸">
                  <Typography variant="body1">
                    <strong>Glam's Opinion:</strong> {workflowData.glam.quote_spanish || '¡Pura organización bacán, weon!'}
                  </Typography>
                </Alert>
              )}
              {activeTab === 4 && workflowData.hannibal && (
                <Alert severity="error" icon="🧠">
                  <Typography variant="body1">
                    <strong>Hannibal's Analysis:</strong> {workflowData.hannibal.analysis || 'The methodology exhibits clinical precision. Quite... methodical.'}
                  </Typography>
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* 📊 Success Metrics */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📊 Success Metrics (Hannibal Addition)
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.light' }}>
                <Typography variant="h4">3.5h</Typography>
                <Typography variant="body2">Completion Time</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.light' }}>
                <Typography variant="h4">6</Typography>
                <Typography variant="body2">MongoDB Collections</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.light' }}>
                <Typography variant="h4">1200</Typography>
                <Typography variant="body2">CLAUDE.md Lines</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.light' }}>
                <Typography variant="h4">4/4</Typography>
                <Typography variant="body2">Tests Passed</Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
