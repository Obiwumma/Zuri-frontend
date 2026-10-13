/**
 * Zuri Backend API & Domain Type Definitions
 *
 * All types are derived directly from the verified backend contract and codebase models.
 */

// ============================================================================
// Core Authentication & User Contract Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  school?: string;
  department?: string;
  academic_level?: string;
  timezone?: string;
  email_verified: boolean;
  role: string;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: string;
}

export interface AuthResponseData extends AuthTokens {
  user: User;
}

export interface AuthResponse {
  data: AuthResponseData;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  school?: string;
  department?: string;
  academic_level?: 'undergraduate' | 'postgraduate' | 'faculty' | string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface SwitchInstitutionRequest {
  institution_id: string;
}

export interface SwitchInstitutionResponse {
  message: string;
  data: AuthResponseData;
}

export interface InstitutionMembership {
  id: string;
  institution_id: string;
  institution_name: string;
  role: string;
  is_default: boolean;
  status: 'active' | 'inactive' | string;
}

export interface PublicKeyResponse {
  data: {
    public_key: string;
  };
}

export interface JwtClaims {
  user_id: string;
  email: string;
  role: string;
  token_type: string;
  institution_id?: string;
  exp: number;
  iat: number;
  nbf: number;
  sub: string;
  jti: string;
}

// ============================================================================
// Standard Response & Error Envelope Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
}

export interface ApiMessageResponse {
  message: string;
}

export interface ApiErrorEnvelope {
  message?: string;
  error?: string;
  code?: string;
  user_id?: string;
  errors?: Record<string, string[]>;
}

// ============================================================================
// Student Entity Types (from Students Console)
// ============================================================================

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  college: string;
  matriculationId: string;
  division: string;
  department: string;
  moduleCode: string;
  moduleTitle: string;
  level: string;
  status: 'Active Matriculated' | 'Suspended (Leave)';
  engagementLabel: string;
  engagementPct: number;
  engagementDetail: string;
  tutor?: string;
  matriculationYear?: string;
  isSelected?: boolean;
}

// ============================================================================
// Course Entity Types (from Courses Console)
// ============================================================================

export interface CourseRecord {
  code: string;
  title: string;
  subtitle: string;
  department: string;
  division: string;
  leadName: string;
  leadInitials: string;
  college: string;
  enrolledCount: number;
  enrolledDetail: string;
  enrolledPct: number;
  status: 'Active' | 'Upcoming' | 'Archived';
  masteryPct: string;
  masteryStatus: string;
  conceptNodes: number;
  activeInterventions: number;
  lectureCadence: string;
  hallLocation: string;
  supervisingRatio: string;
  socraticEnabled: boolean;
}

// ============================================================================
// Roles & Governance Audit Types (from Roles Console)
// ============================================================================

export interface RoleDefinition {
  id: string;
  name: string;
  badge: string;
  badgeType: 'primary' | 'secondary' | 'high';
  membersCount: number;
  membersLabel: string;
  description: string;
  permissions: string[];
  restrictedMessage?: string;
  avatars: string[];
}

export interface AssignedUserAudit {
  id: string;
  name: string;
  email: string;
  college: string;
  initials: string;
  role: string;
  authorizedBy: string;
  governanceScope: string;
  termDate: string;
  syncStatus: string;
}

// ============================================================================
// Analytics & Telemetry Types (from Analytics Console)
// ============================================================================

export interface DepartmentLedgerRow {
  department: string;
  division: string;
  coursesCount: number;
  lecturesProcessed: number;
  syllabusCoveredPct: number;
  quizzesGenerated: number;
  quizDetail: string;
  chatSessions: number;
  chatDetail: string;
  researchQueries: number;
  researchDetail: string;
  totalActivity: number;
  activityGrowth: string;
  isBrightRow?: boolean;
}

export interface CourseLedgerRow {
  title: string;
  code: string;
  department: string;
  interventions: number;
  accepted: number;
  rate: string;
  isHighRate: boolean;
  trend: string;
  isTrendUp: boolean;
}

// ============================================================================
// Document Extraction & Timetable Roster Types (from Extraction Console)
// ============================================================================

export interface ExtractionDocument {
  id: string;
  title: string;
  filename: string;
  format: 'pdf' | 'txt' | 'image' | string;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  ingestedTime: string;
  ingestedBy: string;
  division: string;
  status: 'Needs Review' | 'Complete' | 'Processing';
  confidencePct: number;
  isCached: boolean;
  hasAmbiguity: boolean;
  flagDescription?: string;
  extractedRecordsCount?: number;
}

export interface ExtractedEventRecord {
  id: string;
  date: string;
  courseCode: string;
  courseTitle: string;
  sittingTime: string;
  durationHours: number;
  venue: string;
  venueConfidence: string;
  isVenueFlagged: boolean;
  chiefExaminer: string;
  invigilators: string;
  candidatesCount: number;
  notes?: string;
}

export interface ExtractionMetrics {
  ingestedSourcesCount: number;
  cachedReUseEfficiencyPct: number;
  verificationAccuracyPct: number;
  pendingReviewCount: number;
}
