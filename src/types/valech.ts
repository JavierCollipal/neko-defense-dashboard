/**
 * VALECH 2.0 DATABASE SCHEMA DEFINITIONS
 *
 * Comprehensive TypeScript types for Chilean human rights documentation
 * Based on the Valech Commission Reports (2004, 2011)
 *
 * Target: 27,255 victims + 1,097 DINA perpetrators
 *
 * Created: October 29, 2025
 * By: Neko-Arc + Mario + Noel + Glam + Hannibal + Tetora (The Supreme Six)
 */

import { ObjectId } from 'mongodb';

// ============================================================
// VICTIM DOCUMENTATION
// ============================================================

export interface ValechVictim {
  // Unique identifier
  _id?: ObjectId;
  victimId: string;  // Human-readable ID (e.g., "VICTIM-00001")

  // Personal identity
  fullName: string;
  alternativeNames?: string[];  // Aliases, maiden names
  dateOfBirth?: Date;
  placeOfBirth?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
  nationality: string;  // Usually "Chilean"

  // Pre-arrest life
  profession?: string;
  education?: string;
  politicalAffiliation?: string;
  unionMembership?: string;
  studentOrganization?: string;

  // Arrest & detention
  detentionHistory: DetentionRecord[];

  // Outcome
  outcome: 'SURVIVED' | 'KILLED' | 'DISAPPEARED' | 'UNKNOWN';
  dateOfDeath?: Date;
  causeOfDeath?: string;
  placeOfDeath?: string;
  bodyRecovered?: boolean;

  // Health impact
  physicalInjuries: string[];
  psychologicalTrauma: string[];
  longTermHealthConsequences: string[];
  medicalRecords?: string[];

  // Family impact
  familyMembers: FamilyMember[];
  childrenOrphaned?: number;
  economicImpactDescription?: string;

  // Testimonies
  testimonies: Testimony[];

  // Legal status
  legalCase?: {
    caseNumber?: string;
    courtJurisdiction?: string;
    prosecutionStatus: 'PENDING' | 'CLOSED' | 'ONGOING' | 'NONE';
    verdict?: string;
    sentenceIssued?: boolean;
    reparationsReceived?: boolean;
  };

  // Documentation quality
  documentationStatus: 'COMPLETE' | 'PARTIAL' | 'MINIMAL' | 'NEEDS_VERIFICATION';
  confidenceLevel: 'CONFIRMED' | 'PROBABLE' | 'ALLEGED' | 'DISPUTED';
  sources: DocumentSource[];

  // Privacy controls
  publicVisibility: 'PUBLIC' | 'RESEARCHERS_ONLY' | 'FAMILY_ONLY' | 'ADMIN_ONLY';
  sensitiveContent: boolean;

  // Metadata
  createdAt: Date;
  lastUpdated: Date;
  createdBy: string;
  lastModifiedBy: string;
  verifiedBy?: string;
  verificationDate?: Date;
}

export interface DetentionRecord {
  // Location
  detentionCenterId: string;  // Reference to detention center
  detentionCenterName: string;
  centerLocation: string;

  // Timeline
  dateArrested: Date;
  dateReleased?: Date;
  durationDays?: number;
  stillDetained?: boolean;

  // Conditions
  cellType?: string;  // Solitary, shared, etc.
  conditionsDescription: string;

  // Torture & abuse
  tortureMethodsUsed: string[];
  tortureFrequency?: string;
  physicalHarm: string[];
  psychologicalTorment: string[];

  // Perpetrators present
  perpetratorIds: string[];  // References to DINA agents
  perpetratorNames: string[];
  interrogatorsPresent: string[];

  // Witnesses
  fellowPrisoners?: string[];
  witnessTestimonies?: string[];
}

export interface FamilyMember {
  name: string;
  relationship: string;  // Spouse, child, parent, sibling
  alsoVictimized: boolean;
  victimId?: string;  // If also a victim
  dateOfBirth?: Date;
  currentStatus: 'ALIVE' | 'DECEASED' | 'UNKNOWN';
  impactDescription?: string;
}

export interface Testimony {
  testimonialId: string;
  date: Date;
  location: string;
  recordedBy: string;  // Organization or person
  language: 'es' | 'en' | 'pt' | 'de' | 'fr';

  // Content
  content: string;  // Full text
  summary?: string;
  themes: string[];  // TORTURE, EXECUTION, FAMILY_SEPARATION, etc.

  // Media
  videoLink?: string;
  audioLink?: string;
  documentLink?: string;
  transcriptionFile?: string;

  // Verification
  verified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;

  // Privacy
  publicVisibility: 'PUBLIC' | 'RESEARCHERS_ONLY' | 'PRIVATE';
  anonymized: boolean;
}

export interface DocumentSource {
  sourceType: 'VALECH_REPORT' | 'INDH_DATABASE' | 'COURT_RECORD' | 'TESTIMONY' | 'MEMORIAL_ARCHIVE' | 'MEDIA' | 'OTHER';
  sourceName: string;
  sourceUrl?: string;
  sourceDate?: Date;
  pageNumber?: number;
  reliability: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  notes?: string;
}

// ============================================================
// DETENTION CENTERS
// ============================================================

export interface DetentionCenter {
  _id?: ObjectId;
  centerId: string;  // e.g., "CENTER-VILLA-GRIMALDI"

  // Identity
  officialName: string;
  aliases: string[];  // "Cuartel Terranova", etc.
  centerType: 'SECRET_DETENTION' | 'CONCENTRATION_CAMP' | 'PRISON' | 'MILITARY_BASE' | 'OTHER';

  // Location
  location: {
    address: string;
    city: string;
    region: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };

  // Operational period
  operationalPeriod: {
    opened: Date;
    closed?: Date;
    peakOperation?: Date;
  };

  // Administration
  commandingOfficers: string[];  // DINA agent IDs
  operatingUnit: string;  // DINA brigade/unit
  militaryBranch?: string;

  // Infrastructure
  infrastructure: {
    estimatedCapacity: number;
    cellCount?: number;
    cellTypes: string[];
    interrogationRooms?: number;
    tortureRooms?: number;
    executionAreas?: boolean;
    burialSites?: boolean;
  };

  // Known practices
  knownTortureMethodsUsed: string[];
  knownExecutionMethods?: string[];
  medicalExperimentation?: boolean;
  sexualViolence?: boolean;

  // Statistics
  statistics: {
    estimatedVictims: number;
    confirmedVictims: number;
    survivors: number;
    deaths: number;
    disappeared: number;
    femaleVictims?: number;
    maleVictims?: number;
    minorsDetained?: number;
  };

  // Current status
  currentStatus: 'DEMOLISHED' | 'PRESERVED' | 'MEMORIAL' | 'REPURPOSED' | 'UNKNOWN';
  memorialSiteName?: string;
  memorialUrl?: string;
  touristAccess?: boolean;

  // Documentation
  sources: DocumentSource[];
  photographs?: string[];
  maps?: string[];
  blueprints?: string[];

  // Metadata
  createdAt: Date;
  lastUpdated: Date;
}

// ============================================================
// CROSS-REFERENCES (Victim ↔ Perpetrator)
// ============================================================

export interface VictimPerpetratorCrossReference {
  _id?: ObjectId;
  crossRefId: string;

  // Relationship
  victimId: string;  // Reference to victim
  perpetratorId: string;  // Reference to DINA agent

  relationshipType:
    | 'TORTURED_BY'
    | 'INTERROGATED_BY'
    | 'ARRESTED_BY'
    | 'GUARDED_BY'
    | 'WITNESSED_BY'
    | 'EXECUTED_BY'
    | 'COMMANDED_BY';

  // Context
  detentionCenterId?: string;
  detentionCenterName?: string;
  dateInteraction?: Date;
  dateRangeStart?: Date;
  dateRangeEnd?: Date;

  // Description
  description: string;
  incidentType?: string;

  // Evidence
  evidence: Evidence[];

  // Confidence
  confidenceLevel: 'CONFIRMED' | 'PROBABLE' | 'ALLEGED' | 'DISPUTED';
  confidenceScore?: number;  // 0-100

  // Verification
  verifiedBy?: string;
  verificationDate?: Date;
  verificationMethod?: string;

  // Legal
  usedInCourt?: boolean;
  courtCaseNumber?: string;

  // Metadata
  createdAt: Date;
  lastUpdated: Date;
  createdBy: string;
}

export interface Evidence {
  evidenceType:
    | 'TESTIMONY'
    | 'DOCUMENT'
    | 'PHOTOGRAPH'
    | 'VIDEO'
    | 'AUDIO'
    | 'FORENSIC'
    | 'WITNESS_STATEMENT'
    | 'MEDICAL_RECORD';

  description: string;
  source: string;
  sourceUrl?: string;
  dateObtained?: Date;
  reliability: 'HIGH' | 'MEDIUM' | 'LOW';

  // Content
  excerpt?: string;
  fullTextLink?: string;
  mediaLink?: string;
}

// ============================================================
// STATISTICS & ANALYTICS
// ============================================================

export interface ValechStatistics {
  // Overall counts
  overall: {
    totalVictimsDocumented: number;
    totalPerpetratorTracked: number;
    totalDetentionCenters: number;
    totalCrossReferences: number;
    totalTestimonies: number;
  };

  // Victim outcomes
  victimOutcomes: {
    survived: number;
    killed: number;
    disappeared: number;
    unknown: number;
    survivalRate: number;  // Percentage
  };

  // Justice metrics
  justiceProgress: {
    perpetratorsConvicted: number;
    perpetratorsAtLarge: number;
    perpetratorsDeceased: number;
    perpetratorsUnprosecuted: number;
    convictionRate: number;  // Percentage
    averageSentenceYears?: number;
    ongoingProsecutions: number;
  };

  // Documentation quality
  documentationQuality: {
    complete: number;
    partial: number;
    minimal: number;
    needsVerification: number;
    completenessRate: number;  // Percentage
  };

  // Timeline distribution
  byYear: Array<{
    year: number;
    arrests: number;
    deaths: number;
    disappeared: number;
  }>;

  // Geographic distribution
  byRegion: Array<{
    region: string;
    victims: number;
    detentionCenters: number;
  }>;

  // Detention centers ranked
  topCenters: Array<{
    centerId: string;
    centerName: string;
    victims: number;
    deaths: number;
  }>;

  // Gender distribution
  byGender: {
    male: number;
    female: number;
    other: number;
    unknown: number;
  };

  // Age distribution (at time of arrest)
  byAgeGroup: Array<{
    ageGroup: string;  // "18-25", "26-35", etc.
    count: number;
  }>;

  // Last updated
  lastCalculated: Date;
}

// ============================================================
// SEARCH & FILTER TYPES
// ============================================================

export interface VictimSearchParams {
  // Text search
  name?: string;
  nameExact?: boolean;

  // Detention
  detentionCenter?: string;
  detentionCenterId?: string;

  // Date range
  dateArrestedFrom?: Date;
  dateArrestedTo?: Date;

  // Outcome
  outcome?: 'SURVIVED' | 'KILLED' | 'DISAPPEARED' | 'UNKNOWN';

  // Demographics
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN';
  profession?: string;
  politicalAffiliation?: string;

  // Perpetrator link
  perpetratorId?: string;
  perpetratorName?: string;

  // Documentation status
  documentationStatus?: 'COMPLETE' | 'PARTIAL' | 'MINIMAL' | 'NEEDS_VERIFICATION';
  confidenceLevel?: 'CONFIRMED' | 'PROBABLE' | 'ALLEGED' | 'DISPUTED';

  // Pagination
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface VictimSearchResult {
  success: boolean;
  data: ValechVictim[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  executionTime?: number;  // milliseconds
}

// ============================================================
// DATA QUALITY & VALIDATION
// ============================================================

export interface DataQualityMetrics {
  victimId: string;
  completenessScore: number;  // 0-100
  missingFields: string[];
  requiredFieldsPresent: boolean;

  checks: {
    hasName: boolean;
    hasDetentionHistory: boolean;
    hasOutcome: boolean;
    hasTestimony: boolean;
    hasSources: boolean;
    hasVerification: boolean;
  };

  recommendations: string[];
  lastAssessed: Date;
}

export interface DuplicateDetectionResult {
  victimId: string;
  potentialDuplicates: Array<{
    duplicateVictimId: string;
    matchScore: number;  // 0-100
    matchReasons: string[];
  }>;
  requiresReview: boolean;
}

// ============================================================
// INGESTION PIPELINE TYPES
// ============================================================

export interface IngestionJob {
  _id?: ObjectId;
  jobId: string;
  jobType: 'PDF_PARSE' | 'INDH_FETCH' | 'NLP_EXTRACT' | 'CROSS_REFERENCE' | 'MANUAL_ENTRY';

  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'PAUSED';
  progress: number;  // 0-100

  source: {
    sourceType: string;
    sourceFile?: string;
    sourceUrl?: string;
  };

  results: {
    victimsProcessed: number;
    victimsCreated: number;
    victimsUpdated: number;
    errorsEncountered: number;
    duplicatesFound: number;
  };

  errors?: Array<{
    message: string;
    context: any;
    timestamp: Date;
  }>;

  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;

  createdBy: string;
  createdAt: Date;
}

// ============================================================
// USER ROLES & PERMISSIONS
// ============================================================

export interface ValechUser {
  _id?: ObjectId;
  userId: string;
  username: string;
  email: string;

  role: 'PUBLIC' | 'RESEARCHER' | 'EDITOR' | 'ADMIN' | 'FAMILY_MEMBER';

  permissions: {
    canViewPublic: boolean;
    canViewRestricted: boolean;
    canEdit: boolean;
    canVerify: boolean;
    canDelete: boolean;
    canManageUsers: boolean;
  };

  affiliation?: string;  // University, organization
  researchPurpose?: string;

  createdAt: Date;
  lastLogin?: Date;
}

// ============================================================
// EXPORT TYPES
// ============================================================

export type ValechExportFormat = 'CSV' | 'JSON' | 'PDF' | 'XML';

export interface ExportRequest {
  format: ValechExportFormat;
  includeFields: string[];
  filters?: VictimSearchParams;
  includeTestimonies?: boolean;
  includeCrossReferences?: boolean;
  anonymize?: boolean;
  purpose: string;  // Research, legal, educational
  requestedBy: string;
}
