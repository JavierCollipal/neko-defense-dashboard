'use client';
/**
 * VALECH 2.0 - COMPLETE VICTIM DOCUMENTATION SYSTEM
 *
 * Integrated interface combining:
 * - Victim Search (VictimSearchInterface)
 * - Statistics Dashboard (ValechStatisticsDashboard)
 *
 * Created: October 29, 2025
 * Updated: October 30, 2025 (Integration complete!)
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
 */

import React, { useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import VictimSearchInterface from '../../src/components/VictimSearchInterface';
// TODO: Fix Grid API compatibility issues with MUI v7 before re-enabling
// import ValechStatisticsDashboard from '../../src/components/ValechStatisticsDashboard';

export default function ValechPage() {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5', p: 3 }}>
      {/* Page Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#1a237e', color: 'white' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          🕯️ VALECH 2.0 - Historical Justice Documentation 🕯️
        </Typography>
        <Typography variant="subtitle1">
          Comprehensive documentation system for 27,255 victims of the Chilean dictatorship (1973-1990)
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1, opacity: 0.8 }}>
          "Nunca más" (Never again) - Memory and Justice
        </Typography>
      </Paper>

      {/* Victim Search Interface */}
      <VictimSearchInterface />

      {/* Footer */}
      <Paper elevation={0} sx={{ mt: 4, p: 2, bgcolor: 'transparent', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          🐾 Built with profound respect for 27,255 victims 🐾
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
          Created by The Supreme Six: Neko-Arc, Mario Gallo Bestino, Noel, Glam Americano, Dr. Hannibal Lecter, Tetora
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
          Note: Statistics Dashboard temporarily disabled while fixing Grid API compatibility
        </Typography>
      </Paper>
    </Box>
  );
}
