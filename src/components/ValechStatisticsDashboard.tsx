/**
 * VALECH 2.0 STATISTICS DASHBOARD
 *
 * Comprehensive visualization of Valech database statistics
 *
 * Features:
 * - Overall metrics cards
 * - Victim outcome distribution
 * - Justice progress tracking
 * - Timeline charts (1973-1990)
 * - Top detention centers
 * - Documentation quality metrics
 *
 * Created: October 29, 2025
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
// Temporary Box-based layout until Grid API compatibility is fixed
const Grid = ({
  container,
  spacing,
  xs,
  sm,
  md,
  sx,
  children,
  ...props
}: any) => (
  <Box
    sx={{
      display: container ? 'flex' : 'block',
      flexWrap: container ? 'wrap' : undefined,
      gap: container ? spacing : undefined,
      flex: xs || sm || md ? '1 1 auto' : undefined,
      minWidth:
        xs === 12
          ? '100%'
          : xs === 6
            ? '48%'
            : xs === 3
              ? '23%'
              : md === 2.4
                ? '18%'
                : md === 6
                  ? '48%'
                  : 'auto',
      ...sx,
    }}
    {...props}
  >
    {children}
  </Box>
);
import PeopleIcon from '@mui/icons-material/People';
import GavelIcon from '@mui/icons-material/Gavel';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

interface Statistics {
  overall: {
    totalVictimsDocumented: number;
    totalPerpetratorTracked: number;
    totalDetentionCenters: number;
    totalCrossReferences: number;
    totalTestimonies: number;
  };
  victimOutcomes: {
    survived: number;
    killed: number;
    disappeared: number;
    unknown: number;
    survivalRate: number;
  };
  justiceProgress: {
    perpetratorsConvicted: number;
    perpetratorsAtLarge: number;
    perpetratorsDeceased: number;
    perpetratorsUnprosecuted: number;
    convictionRate: number;
    ongoingProsecutions: number;
  };
  documentationQuality: {
    complete: number;
    partial: number;
    minimal: number;
    needsVerification: number;
    completenessRate: number;
  };
  byGender: {
    male: number;
    female: number;
    other: number;
    unknown: number;
  };
  byYear: Array<{
    year: number;
    arrests: number;
    deaths: number;
    disappeared: number;
  }>;
  topCenters: Array<{
    centerId: string;
    centerName: string;
    victims: number;
  }>;
  lastCalculated: string;
}

const ValechStatisticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/valech/stats/comprehensive');
        const data = (await response.json()) as any;

        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.error || 'Failed to load statistics');
        }
      } catch (err: any) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Error loading statistics: {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info" sx={{ m: 3 }}>
        No statistics available
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          🕯️ Valech 2.0 - Statistics Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive analysis of 27,255 victims of the Chilean dictatorship
          (1973-1990)
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date(stats.lastCalculated).toLocaleString()}
        </Typography>
      </Box>

      {/* Overall Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="primary">
                  {stats.overall.totalVictimsDocumented.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Victims Documented
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(stats.overall.totalVictimsDocumented / 27255) * 100}
                sx={{ mt: 1 }}
              />
              <Typography variant="caption" color="text.secondary">
                Target: 27,255 (
                {((stats.overall.totalVictimsDocumented / 27255) * 100).toFixed(
                  1
                )}
                %)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <GavelIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" color="error">
                  {stats.overall.totalPerpetratorTracked.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Perpetrators Tracked
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 1 }}
              >
                Conviction Rate:{' '}
                {stats.justiceProgress.convictionRate.toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOnIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" color="warning.main">
                  {stats.overall.totalDetentionCenters.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Detention Centers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinkIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" color="info.main">
                  {stats.overall.totalCrossReferences.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Cross-References
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(stats.overall.totalCrossReferences / 50000) * 100}
                sx={{ mt: 1 }}
                color="info"
              />
              <Typography variant="caption" color="text.secondary">
                Target: 50,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="success.main">
                  {stats.overall.totalTestimonies.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Testimonies Archived
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Victim Outcomes */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Victim Outcomes
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="body2">Survived</Typography>
                    </Box>
                    <Typography variant="h6" color="success.main">
                      {stats.victimOutcomes.survived.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ErrorIcon color="error" sx={{ mr: 1 }} />
                      <Typography variant="body2">Killed</Typography>
                    </Box>
                    <Typography variant="h6" color="error.main">
                      {stats.victimOutcomes.killed.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WarningIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="body2">Disappeared</Typography>
                    </Box>
                    <Typography variant="h6" color="warning.main">
                      {stats.victimOutcomes.disappeared.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body2">Unknown</Typography>
                    <Typography variant="h6">
                      {stats.victimOutcomes.unknown.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  Survival Rate:{' '}
                  <strong>
                    {stats.victimOutcomes.survivalRate.toFixed(2)}%
                  </strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Justice Progress */}
        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Justice Progress
              </Typography>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Convicted
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {stats.justiceProgress.perpetratorsConvicted}
                  </Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    At Large
                  </Typography>
                  <Typography variant="h6" color="error.main">
                    {stats.justiceProgress.perpetratorsAtLarge}
                  </Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Deceased
                  </Typography>
                  <Typography variant="h6">
                    {stats.justiceProgress.perpetratorsDeceased}
                  </Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Unprosecuted
                  </Typography>
                  <Typography variant="h6" color="warning.main">
                    {stats.justiceProgress.perpetratorsUnprosecuted}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Typography variant="body2" color="text.secondary">
                  Conviction Rate:{' '}
                  <strong>
                    {stats.justiceProgress.convictionRate.toFixed(2)}%
                  </strong>
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.justiceProgress.convictionRate}
                  color={
                    stats.justiceProgress.convictionRate > 50
                      ? 'success'
                      : 'warning'
                  }
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Documentation Quality */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Documentation Quality
          </Typography>
          <Grid container spacing={2}>
            <Grid xs={3}>
              <Chip label="Complete" color="success" sx={{ width: '100%' }} />
              <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                {stats.documentationQuality.complete.toLocaleString()}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Chip label="Partial" color="info" sx={{ width: '100%' }} />
              <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                {stats.documentationQuality.partial.toLocaleString()}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Chip label="Minimal" color="warning" sx={{ width: '100%' }} />
              <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                {stats.documentationQuality.minimal.toLocaleString()}
              </Typography>
            </Grid>
            <Grid xs={3}>
              <Chip
                label="Needs Verification"
                color="error"
                sx={{ width: '100%' }}
              />
              <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                {stats.documentationQuality.needsVerification.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Completeness Rate:{' '}
              <strong>
                {stats.documentationQuality.completenessRate.toFixed(2)}%
              </strong>
            </Typography>
            <LinearProgress
              variant="determinate"
              value={stats.documentationQuality.completenessRate}
              color={
                stats.documentationQuality.completenessRate > 70
                  ? 'success'
                  : 'warning'
              }
              sx={{ mt: 1 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Top Detention Centers */}
      {stats.topCenters && stats.topCenters.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Top Detention Centers by Victim Count
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Rank</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Center Name</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>Victims</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.topCenters.map((center, index) => (
                    <TableRow key={center.centerId}>
                      <TableCell>#{index + 1}</TableCell>
                      <TableCell>{center.centerName}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={center.victims.toLocaleString()}
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ValechStatisticsDashboard;
