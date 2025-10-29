/**
 * VALECH 2.0 VICTIM SEARCH INTERFACE
 *
 * Comprehensive search interface for the Valech victim database
 * Supports 15+ filter parameters with real-time search
 *
 * Features:
 * - Multi-field search (name, detention center, date range)
 * - Advanced filters (outcome, gender, documentation status)
 * - Pagination with configurable page size
 * - Sort by multiple fields
 * - Export search results
 *
 * Created: October 29, 2025
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VictimListTable from './VictimListTable';

interface SearchFilters {
  name: string;
  nameExact: boolean;
  detentionCenter: string;
  dateArrestedFrom: string;
  dateArrestedTo: string;
  outcome: string;
  gender: string;
  profession: string;
  politicalAffiliation: string;
  documentationStatus: string;
  confidenceLevel: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchResults {
  success: boolean;
  data: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  executionTime?: string;
}

const VictimSearchInterface: React.FC = () => {
  // State
  const [filters, setFilters] = useState<SearchFilters>({
    name: '',
    nameExact: false,
    detentionCenter: '',
    dateArrestedFrom: '',
    dateArrestedTo: '',
    outcome: '',
    gender: '',
    profession: '',
    politicalAffiliation: '',
    documentationStatus: '',
    confidenceLevel: '',
    page: 1,
    limit: 50,
    sortBy: 'fullName',
    sortOrder: 'asc'
  });

  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Active filter count
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'page' || key === 'limit' || key === 'sortBy' || key === 'sortOrder') return false;
    if (key === 'nameExact') return false;
    return value !== '' && value !== false;
  }).length;

  // Search function
  const executeSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== false) {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/valech/victims?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setResults(data);
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  // Handle search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  // Handle filter changes
  const handleFilterChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      // Reset to page 1 when filters change
      page: field !== 'page' ? 1 : value
    }));
  };

  // Handle pagination
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    handleFilterChange('page', page);
    executeSearch();
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      name: '',
      nameExact: false,
      detentionCenter: '',
      dateArrestedFrom: '',
      dateArrestedTo: '',
      outcome: '',
      gender: '',
      profession: '',
      politicalAffiliation: '',
      documentationStatus: '',
      confidenceLevel: '',
      page: 1,
      limit: 50,
      sortBy: 'fullName',
      sortOrder: 'asc'
    });
    setResults(null);
  };

  // Initial search on mount
  useEffect(() => {
    executeSearch();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          🕯️ Valech 2.0 - Victim Search
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search and explore documentation of 27,255 victims of the Chilean dictatorship (1973-1990)
        </Typography>
      </Box>

      {/* Search Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Basic Search */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Victim Name"
                placeholder="Search by name..."
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Detention Center"
                placeholder="Villa Grimaldi, Estadio Nacional..."
                value={filters.detentionCenter}
                onChange={(e) => handleFilterChange('detentionCenter', e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={executeSearch}
                disabled={loading}
                sx={{ height: '56px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Search'}
              </Button>
            </Grid>
          </Grid>

          {/* Advanced Filters */}
          <Accordion expanded={advancedOpen} onChange={() => setAdvancedOpen(!advancedOpen)} sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterListIcon />
                <Typography>Advanced Filters</Typography>
                {activeFilterCount > 0 && (
                  <Chip label={`${activeFilterCount} active`} size="small" color="primary" />
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* Date Range */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Arrested From"
                    value={filters.dateArrestedFrom}
                    onChange={(e) => handleFilterChange('dateArrestedFrom', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Arrested To"
                    value={filters.dateArrestedTo}
                    onChange={(e) => handleFilterChange('dateArrestedTo', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Outcome */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Outcome</InputLabel>
                    <Select
                      value={filters.outcome}
                      label="Outcome"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('outcome', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="SURVIVED">Survived</MenuItem>
                      <MenuItem value="KILLED">Killed</MenuItem>
                      <MenuItem value="DISAPPEARED">Disappeared</MenuItem>
                      <MenuItem value="UNKNOWN">Unknown</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Gender */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={filters.gender}
                      label="Gender"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('gender', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                      <MenuItem value="UNKNOWN">Unknown</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Documentation Status */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Documentation</InputLabel>
                    <Select
                      value={filters.documentationStatus}
                      label="Documentation"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('documentationStatus', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="COMPLETE">Complete</MenuItem>
                      <MenuItem value="PARTIAL">Partial</MenuItem>
                      <MenuItem value="MINIMAL">Minimal</MenuItem>
                      <MenuItem value="NEEDS_VERIFICATION">Needs Verification</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Confidence Level */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Confidence</InputLabel>
                    <Select
                      value={filters.confidenceLevel}
                      label="Confidence"
                      onChange={(e: SelectChangeEvent) => handleFilterChange('confidenceLevel', e.target.value)}
                    >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                      <MenuItem value="PROBABLE">Probable</MenuItem>
                      <MenuItem value="ALLEGED">Alleged</MenuItem>
                      <MenuItem value="DISPUTED">Disputed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Profession */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Profession"
                    placeholder="Teacher, Worker, Student..."
                    value={filters.profession}
                    onChange={(e) => handleFilterChange('profession', e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </Grid>

                {/* Political Affiliation */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Political Affiliation"
                    placeholder="Socialist, Communist, Christian Democrat..."
                    value={filters.politicalAffiliation}
                    onChange={(e) => handleFilterChange('politicalAffiliation', e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </Grid>
              </Grid>

              {/* Clear Filters Button */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  disabled={activeFilterCount === 0}
                >
                  Clear All Filters
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Results */}
      {results && (
        <>
          {/* Results Summary */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1">
              Found <strong>{results.pagination.total.toLocaleString()}</strong> victims
              {results.executionTime && ` (${results.executionTime})`}
            </Typography>

            {/* Results per page */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Per Page</InputLabel>
              <Select
                value={filters.limit}
                label="Per Page"
                onChange={(e: SelectChangeEvent<number>) => handleFilterChange('limit', Number(e.target.value))}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Results Table */}
          <VictimListTable victims={results.data} loading={loading} />

          {/* Pagination */}
          {results.pagination.pages > 1 && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                count={results.pagination.pages}
                page={results.pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* No Results */}
      {results && results.data.length === 0 && (
        <Alert severity="info">
          No victims found matching your search criteria. Try adjusting your filters.
        </Alert>
      )}
    </Box>
  );
};

export default VictimSearchInterface;
