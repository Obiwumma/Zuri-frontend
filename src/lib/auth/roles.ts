// NOTE: This role and shell mapping is pending confirmation with the backend owner.

import type { NavGroup } from '@/components/ui/NavShell';

/**
 * Verified backend roles recognized across Zuri microservices:
 * - student
 * - lecturer
 * - instructor
 * - department_admin
 * - faculty_admin
 * - institution_admin
 * - super_admin
 */
export const BACKEND_ROLES = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  INSTRUCTOR: 'instructor',
  DEPARTMENT_ADMIN: 'department_admin',
  FACULTY_ADMIN: 'faculty_admin',
  INSTITUTION_ADMIN: 'institution_admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export type BackendRole = (typeof BACKEND_ROLES)[keyof typeof BACKEND_ROLES] | string;

/**
 * Mapping from backend canonical roles to frontend display labels.
 */
export const FRONTEND_ROLE_LABELS: Record<string, string> = {
  [BACKEND_ROLES.INSTITUTION_ADMIN]: 'Institution Admin',
  [BACKEND_ROLES.DEPARTMENT_ADMIN]: 'HOD',
  [BACKEND_ROLES.FACULTY_ADMIN]: 'Faculty Admin',
  [BACKEND_ROLES.LECTURER]: 'Lecturer/Staff',
  [BACKEND_ROLES.INSTRUCTOR]: 'Lecturer/Staff',
  [BACKEND_ROLES.SUPER_ADMIN]: 'Ops',
  [BACKEND_ROLES.STUDENT]: 'Student',
};

/**
 * Normalizes and formats a backend role for UI presentation.
 */
export function getFrontendRoleLabel(role: string | null | undefined): string {
  if (!role) return 'Guest';
  const normalized = role.toLowerCase().trim();
  return FRONTEND_ROLE_LABELS[normalized] || role;
}

/**
 * Determines whether a user role is permitted to enter the (institution) shell.
 * Permitted: institution_admin, department_admin, faculty_admin, lecturer, instructor.
 * Students and unauthenticated guests are strictly rejected.
 */
export function canAccessInstitution(role: string | null | undefined): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase().trim();
  if (normalized === BACKEND_ROLES.STUDENT) return false;
  return (
    normalized === BACKEND_ROLES.INSTITUTION_ADMIN ||
    normalized === BACKEND_ROLES.DEPARTMENT_ADMIN ||
    normalized === BACKEND_ROLES.FACULTY_ADMIN ||
    normalized === BACKEND_ROLES.LECTURER ||
    normalized === BACKEND_ROLES.INSTRUCTOR ||
    normalized === 'admin' ||
    normalized === 'hod'
  );
}

/**
 * Determines whether a user role is permitted to enter the (ops) shell.
 * Permitted: super_admin (and ops_admin if defined).
 * All standard institution staff, students, and guests are strictly rejected.
 */
export function canAccessOps(role: string | null | undefined): boolean {
  if (!role) return false;
  const normalized = role.toLowerCase().trim();
  if (normalized === BACKEND_ROLES.STUDENT) return false;
  return normalized === BACKEND_ROLES.SUPER_ADMIN || normalized === 'ops' || normalized === 'ops_admin';
}

/**
 * Filters the institutional navigation tree based on verified server role permissions.
 * Prevents unauthorized nav groups (e.g. System Governance, Audit Logs) from rendering for lower roles.
 */
export function filterNavGroupsByRole(
  navGroups: NavGroup[],
  role: string | null | undefined
): NavGroup[] {
  if (!role) return [];
  const normalized = role.toLowerCase().trim();

  // Full administrative access
  if (normalized === BACKEND_ROLES.INSTITUTION_ADMIN || normalized === 'admin') {
    return navGroups;
  }

  // Department Chair / HOD
  if (normalized === BACKEND_ROLES.DEPARTMENT_ADMIN || normalized === 'hod' || normalized === BACKEND_ROLES.FACULTY_ADMIN) {
    return navGroups
      .filter((group) => group.groupName !== 'System & Governance')
      .map((group) => {
        if (group.groupName === 'People & Access') {
          return {
            ...group,
            items: group.items.filter((item) => !item.href.includes('/roles')),
          };
        }
        return group;
      });
  }

  // Lecturer / Instructor / Academic Staff
  if (
    normalized === BACKEND_ROLES.LECTURER ||
    normalized === BACKEND_ROLES.INSTRUCTOR ||
    normalized === 'lecturer'
  ) {
    const allowedGroups = new Set([
      'Overview',
      'Academic Structure',
      'People & Access',
      'Content & Knowledge',
      'Intelligence & Analytics',
    ]);

    return navGroups
      .filter((group) => allowedGroups.has(group.groupName))
      .map((group) => {
        if (group.groupName === 'Academic Structure') {
          return {
            ...group,
            items: group.items.filter((item) => item.href === '/courses' || item.href === '/timetable'),
          };
        }
        if (group.groupName === 'People & Access') {
          return {
            ...group,
            items: group.items.filter((item) => item.href === '/students'),
          };
        }
        return group;
      });
  }

  return [];
}
