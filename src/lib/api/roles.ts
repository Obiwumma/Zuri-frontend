/**
 * Roles & Governance API Module
 *
 * Mock stub implementation housing institutional role definitions and user assignments.
 * Mocks extracted from: src/app/(institution)/roles/page.tsx (lines 60-183)
 */

import { ENDPOINTS } from './endpoints';
import type { RoleDefinition, AssignedUserAudit } from './types';

export const MOCK_CORE_ROLES: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Institution Admin',
    badge: 'Full System Scope',
    badgeType: 'primary',
    membersCount: 14,
    membersLabel: 'Senate Officers',
    description:
      'Full institution management, policy administration, federated directory synchronization, and university-wide academic intelligence dossiers.',
    permissions: [
      'University-wide aggregate telemetry, retention indicators & Senate intelligence dossiers',
      'Curricular syllabus ingestion, faculty department cross-mapping & accreditation archives',
      'InCommon & Oxford SSO federated governance, policy configuration & audit registries',
      'Full student matriculation registries, supervisory rosters & tutor reassignments',
      'Institutional telemetry settings, privacy governance, retention rules & security logs',
    ],
    avatars: ['EV', 'AM', '+12'],
  },
  {
    id: 'hod',
    name: 'Head of Department (HOD)',
    badge: 'Divisional & Faculty Scope',
    badgeType: 'secondary',
    membersCount: 58,
    membersLabel: 'Department Chairs',
    description:
      'Department-level academic oversight, faculty workload governance, course curriculum reviews, and aggregated cohort telemetry.',
    permissions: [
      'Department-level formative assessment mastery telemetry & lecture engagement',
      'Course conveneerships, syllabus graph synthesis & reading list approvals for own faculty',
      'Faculty supervisor assignments and tutorial group distribution across colleges',
      'Anonymized cohort intervention alerts and retake trend trajectories',
    ],
    restrictedMessage: 'Cannot modify university-wide SSO federation or global access rules',
    avatars: ['CS', 'RL', '+56'],
  },
  {
    id: 'lecturer',
    name: 'Lecturer / Staff',
    badge: 'Course & Cohort Scope',
    badgeType: 'high',
    membersCount: 842,
    membersLabel: 'Fellows & Tutors',
    description:
      'Authorized course syllabi, collegiate tutorial supervision groups, student formative diagnostics, and AI-assisted pedagogical tools.',
    permissions: [
      'Own course syllabus dossiers, lecture audio ingests, problem sets & reading lists',
      'Formative quiz generation, concept review signals, and retake cadences for assigned students',
      'Matriculated students enrolled in assigned tutorial supervision and seminar groups',
      'Formative pedagogical intervention logs and diagnostic hints for supervisees',
    ],
    restrictedMessage: "Cannot view other faculties' unpublished curricula or administrative costs",
    avatars: ['JH', 'TL', '+840'],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    badge: 'Research & Synthesis Scope',
    badgeType: 'high',
    membersCount: 334,
    membersLabel: 'Postdoctoral & DPhil',
    description:
      'Authorized research corpus query tools, AI-assisted document extraction, and Bodleian/Radcliffe scholarly literature synthesis.',
    permissions: [
      'Research query dialogues, Radcliffe Science & Bodleian corpus semantic queries',
      'Document extraction pipelines, tabular parsing, and citation lineage verification tools',
      'Laboratory knowledge base synthesis, preprint analysis, and experimental protocol notes',
    ],
    restrictedMessage: 'No access to student matriculation registries, grades, or supervision rosters',
    avatars: ['SK', 'OG', '+332'],
  },
];

export const MOCK_ASSIGNED_USERS: AssignedUserAudit[] = [
  {
    id: '1',
    name: 'Prof. Alistair Montgomery',
    email: 'alistair.m@chch.ox.ac.uk',
    college: 'Christ Church',
    initials: 'AM',
    role: 'Institution Admin',
    authorizedBy: 'Prof. Eleanor Vance (Provost)',
    governanceScope: 'MPLS Division & Senate Oversight',
    termDate: 'Michaelmas Wk 7 • 24 Oct 2024',
    syncStatus: 'Active Synced',
  },
  {
    id: '2',
    name: 'Dr. Clara Sterling',
    email: 'clara.s@balliol.ox.ac.uk',
    college: 'Balliol College',
    initials: 'CS',
    role: 'Head of Department (HOD)',
    authorizedBy: 'Senior Proctor Registry',
    governanceScope: 'Faculty of History (42 courses)',
    termDate: 'Michaelmas Wk 6 • 18 Oct 2024',
    syncStatus: 'Active Synced',
  },
  {
    id: '3',
    name: 'Dr. Rowan Lennox',
    email: 'r.lennox@magd.ox.ac.uk',
    college: 'Magdalen College',
    initials: 'RL',
    role: 'Lecturer / Staff',
    authorizedBy: 'Faculty Board (History)',
    governanceScope: 'Hist 201, 312 • 4 Tutorial Groups',
    termDate: 'Michaelmas Wk 5 • 11 Oct 2024',
    syncStatus: 'Active Synced',
  },
  {
    id: '4',
    name: 'Dr. Siobhan Kapoor',
    email: 's.kapoor@sjc.ox.ac.uk',
    college: "St John's College",
    initials: 'SK',
    role: 'Researcher',
    authorizedBy: 'Bodleian Curators Council',
    governanceScope: 'Radcliffe Science Semantic Extraction',
    termDate: 'Michaelmas Wk 4 • 04 Oct 2024',
    syncStatus: 'Active Synced',
  },
];

/**
 * Retrieves institutional role definitions and system permission sets.
 */
// TODO(real): GET /api/v1/users/me/memberships
export async function getRoleDefinitions(): Promise<RoleDefinition[]> {
  // Uses ENDPOINTS.users.memberships when transitioning to live gateway calls
  return Promise.resolve([...MOCK_CORE_ROLES]);
}

/**
 * Retrieves assigned faculty users and academic governance audit entries.
 */
// TODO(real): GET /api/v1/users/me
export async function getAssignedUsersAudit(): Promise<AssignedUserAudit[]> {
  // Uses ENDPOINTS.users.me when transitioning to live gateway calls
  return Promise.resolve([...MOCK_ASSIGNED_USERS]);
}
