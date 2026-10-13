export async function getSession() {
  return { user: null, role: 'GUEST' };
}

export function hasRole(role: string, requiredRole: string) {
  return role === requiredRole;
}
