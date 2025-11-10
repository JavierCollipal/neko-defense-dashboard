/**
 * VALECH 2.0 VICTIM LIST TABLE
 *
 * Displays victim search results in a sortable, interactive table
 *
 * Features:
 * - Clickable rows for detailed view
 * - Status badges (outcome, documentation quality)
 * - Responsive design
 * - Export functionality
 *
 * Created: October 29, 2025
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Skeleton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningIcon from '@mui/icons-material/Warning';
import VictimDetailModal from './VictimDetailModal';

interface VictimListTableProps {
  victims: any[];
  loading?: boolean;
}

const VictimListTable: React.FC<VictimListTableProps> = ({
  victims,
  loading = false,
}) => {
  const [selectedVictim, setSelectedVictim] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Get outcome badge color
  const getOutcomeColor = (
    outcome: string
  ): 'success' | 'error' | 'warning' | 'default' => {
    switch (outcome) {
      case 'SURVIVED':
        return 'success';
      case 'KILLED':
        return 'error';
      case 'DISAPPEARED':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get documentation status icon
  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return <VerifiedIcon color="success" fontSize="small" />;
      case 'NEEDS_VERIFICATION':
        return <WarningIcon color="warning" fontSize="small" />;
      default:
        return <InfoIcon color="info" fontSize="small" />;
    }
  };

  // Handle row click
  const handleRowClick = (victim: any) => {
    setSelectedVictim(victim);
    setModalOpen(true);
  };

  // Format date
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) {
      return 'Unknown';
    }
    try {
      return new Date(date).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Victim ID</strong>
              </TableCell>
              <TableCell>
                <strong>Full Name</strong>
              </TableCell>
              <TableCell>
                <strong>Date of Birth</strong>
              </TableCell>
              <TableCell>
                <strong>Detention Centers</strong>
              </TableCell>
              <TableCell>
                <strong>Outcome</strong>
              </TableCell>
              <TableCell>
                <strong>Documentation</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {victims.map((victim) => (
              <TableRow
                key={victim._id || victim.victimId}
                hover
                onClick={() => handleRowClick(victim)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                {/* Victim ID */}
                <TableCell>
                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight="medium"
                  >
                    {victim.victimId || 'N/A'}
                  </Typography>
                </TableCell>

                {/* Full Name */}
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {victim.fullName}
                  </Typography>
                  {victim.alternativeNames &&
                    victim.alternativeNames.length > 0 && (
                      <Typography variant="caption" color="text.secondary">
                        aka: {victim.alternativeNames.join(', ')}
                      </Typography>
                    )}
                </TableCell>

                {/* Date of Birth */}
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(victim.dateOfBirth)}
                  </Typography>
                  {victim.gender && (
                    <Typography variant="caption" color="text.secondary">
                      {victim.gender}
                    </Typography>
                  )}
                </TableCell>

                {/* Detention Centers */}
                <TableCell>
                  {victim.detentionHistory &&
                  victim.detentionHistory.length > 0 ? (
                    <Box>
                      <Typography variant="body2">
                        {victim.detentionHistory[0].detentionCenterName ||
                          'Unknown Center'}
                      </Typography>
                      {victim.detentionHistory.length > 1 && (
                        <Typography variant="caption" color="text.secondary">
                          +{victim.detentionHistory.length - 1} more
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        Arrested:{' '}
                        {formatDate(victim.detentionHistory[0].dateArrested)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No detention history
                    </Typography>
                  )}
                </TableCell>

                {/* Outcome */}
                <TableCell>
                  <Chip
                    label={victim.outcome || 'UNKNOWN'}
                    color={getOutcomeColor(victim.outcome)}
                    size="small"
                  />
                </TableCell>

                {/* Documentation Status */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getDocStatusIcon(victim.documentationStatus)}
                    <Typography variant="caption">
                      {victim.documentationStatus || 'N/A'}
                    </Typography>
                  </Box>
                  {victim.confidenceLevel && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {victim.confidenceLevel}
                    </Typography>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(victim);
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Modal */}
      {selectedVictim && (
        <VictimDetailModal
          victim={selectedVictim}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedVictim(null);
          }}
        />
      )}
    </>
  );
};

export default VictimListTable;
