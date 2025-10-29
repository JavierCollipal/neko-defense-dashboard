/**
 * VALECH 2.0 VICTIM DETAIL MODAL
 *
 * Comprehensive victim profile view with:
 * - Personal information
 * - Detention history
 * - Testimonies
 * - Family members
 * - Perpetrator cross-references
 *
 * Created: October 29, 2025
 * By: The Supreme Six (Neko + Mario + Noel + Glam + Hannibal + Tetora)
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import GavelIcon from '@mui/icons-material/Gavel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';

interface VictimDetailModalProps {
  victim: any;
  open: boolean;
  onClose: () => void;
}

const VictimDetailModal: React.FC<VictimDetailModalProps> = ({ victim, open, onClose }) => {
  if (!victim) return null;

  // Format date
  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return 'Unknown';
    try {
      return new Date(date).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Calculate age at arrest
  const calculateAge = (birthDate: Date | string | undefined, arrestDate: Date | string | undefined): string => {
    if (!birthDate || !arrestDate) return 'Unknown';
    try {
      const birth = new Date(birthDate);
      const arrest = new Date(arrestDate);
      const age = arrest.getFullYear() - birth.getFullYear();
      return `${age} years old`;
    } catch {
      return 'Unknown';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      {/* Header */}
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" component="div">
              {victim.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Victim ID: {victim.victimId}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status Chips */}
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={victim.outcome || 'UNKNOWN'}
            color={
              victim.outcome === 'SURVIVED' ? 'success' :
              victim.outcome === 'KILLED' ? 'error' :
              victim.outcome === 'DISAPPEARED' ? 'warning' : 'default'
            }
          />
          <Chip label={victim.documentationStatus || 'N/A'} variant="outlined" />
          <Chip label={victim.confidenceLevel || 'N/A'} variant="outlined" />
          {victim.gender && <Chip icon={<PersonIcon />} label={victim.gender} size="small" />}
        </Box>

        {/* Personal Information */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                <Typography variant="body1">{formatDate(victim.dateOfBirth)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Place of Birth</Typography>
                <Typography variant="body1">{victim.placeOfBirth || 'Unknown'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Nationality</Typography>
                <Typography variant="body1">{victim.nationality || 'Chilean'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Profession</Typography>
                <Typography variant="body1">{victim.profession || 'Unknown'}</Typography>
              </Grid>
              {victim.politicalAffiliation && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Political Affiliation</Typography>
                  <Typography variant="body1">{victim.politicalAffiliation}</Typography>
                </Grid>
              )}
              {victim.alternativeNames && victim.alternativeNames.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Also Known As</Typography>
                  <Typography variant="body1">{victim.alternativeNames.join(', ')}</Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Detention History */}
        {victim.detentionHistory && victim.detentionHistory.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Detention History ({victim.detentionHistory.length} location{victim.detentionHistory.length > 1 ? 's' : ''})
              </Typography>
              {victim.detentionHistory.map((detention: any, index: number) => (
                <Accordion key={index} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {detention.detentionCenterName || 'Unknown Center'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(detention.dateArrested)} - {formatDate(detention.dateReleased) || 'Unknown'}
                        {detention.durationDays && ` (${detention.durationDays} days)`}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Location</Typography>
                        <Typography variant="body1">{detention.centerLocation || 'Unknown'}</Typography>
                      </Grid>
                      {detention.conditionsDescription && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Conditions</Typography>
                          <Typography variant="body1">{detention.conditionsDescription}</Typography>
                        </Grid>
                      )}
                      {detention.tortureMethodsUsed && detention.tortureMethodsUsed.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            Torture Methods Documented
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {detention.tortureMethodsUsed.map((method: string, i: number) => (
                              <Chip key={i} label={method} size="small" color="error" variant="outlined" />
                            ))}
                          </Box>
                        </Grid>
                      )}
                      {detention.perpetratorNames && detention.perpetratorNames.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">Perpetrators Present</Typography>
                          <List dense>
                            {detention.perpetratorNames.map((name: string, i: number) => (
                              <ListItem key={i}>
                                <ListItemText
                                  primary={name}
                                  secondary={detention.perpetratorIds?.[i] || 'ID unknown'}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Grid>
                      )}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Family Members */}
        {victim.familyMembers && victim.familyMembers.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FamilyRestroomIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Family Members ({victim.familyMembers.length})
              </Typography>
              <List>
                {victim.familyMembers.map((member: any, index: number) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={member.name}
                      secondary={
                        <>
                          {member.relationship}
                          {member.alsoVictimized && (
                            <Chip label="Also victimized" size="small" color="warning" sx={{ ml: 1 }} />
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Testimonies */}
        {victim.testimonies && victim.testimonies.length > 0 && (
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <GavelIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Testimonies ({victim.testimonies.length})
              </Typography>
              {victim.testimonies.map((testimony: any, index: number) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {formatDate(testimony.date)} - {testimony.location}
                    {testimony.verified && <Chip label="Verified" size="small" color="success" sx={{ ml: 1 }} />}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {testimony.summary || testimony.content?.substring(0, 200) + '...'}
                  </Typography>
                  {index < victim.testimonies.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Legal Information */}
        {victim.legalCase && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Legal Case Information</Typography>
              <Grid container spacing={2}>
                {victim.legalCase.caseNumber && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Case Number</Typography>
                    <Typography variant="body1">{victim.legalCase.caseNumber}</Typography>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Prosecution Status</Typography>
                  <Chip label={victim.legalCase.prosecutionStatus} size="small" />
                </Grid>
                {victim.legalCase.reparationsReceived !== undefined && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Reparations</Typography>
                    <Chip
                      label={victim.legalCase.reparationsReceived ? 'Received' : 'Not Received'}
                      color={victim.legalCase.reparationsReceived ? 'success' : 'default'}
                      size="small"
                    />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Metadata */}
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Created: {formatDate(victim.createdAt)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            Last Updated: {formatDate(victim.lastUpdated)}
          </Typography>
          {victim.sources && victim.sources.length > 0 && (
            <Typography variant="caption" color="text.secondary" display="block">
              Sources: {victim.sources.map((s: any) => s.sourceName || s.sourceType).join(', ')}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => alert('Export functionality coming soon')}>
          Export Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VictimDetailModal;
