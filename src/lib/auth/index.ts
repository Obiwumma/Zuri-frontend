export { getSession } from './session';
export type { SessionUser } from './session';
export { singleFlightRefreshToken } from './refresh';
export type { RefreshResult } from './refresh';

export function hasRole(role: string, requiredRole: string): boolean {
  return role.toUpperCase() === requiredRole.toUpperCase();
}
