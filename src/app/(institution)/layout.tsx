import React from 'react';
import { headers } from 'next/headers';
import { getSession } from '@/lib/auth/session';
import { institutionalNavGroups } from '@/lib/navConfig';
import { filterNavGroupsByRole, getFrontendRoleLabel } from '@/lib/auth/roles';
import { InstitutionLayoutClient } from './InstitutionLayoutClient';

export default async function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Omit layout shell on login page
  if (pathname === '/login' || pathname === '/institution/login') {
    return <>{children}</>;
  }

  // Derive session and nav items on the server from getSession().role
  const session = await getSession();
  const userRole = session?.role;

  // Nav items derive strictly from getSession().role on the server
  const serverNavGroups = filterNavGroupsByRole(
    institutionalNavGroups,
    userRole || (process.env.NODE_ENV === 'development' ? 'institution_admin' : undefined)
  );

  const displayRole = userRole
    ? getFrontendRoleLabel(userRole)
    : 'Provost & Vice-Chancellor';

  const displayName = session?.email
    ? session.email.split('@')[0]
    : 'Prof. Eleanor Vance';

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <InstitutionLayoutClient
      activeRoute={pathname}
      navGroups={serverNavGroups}
      user={{
        name: displayName,
        role: displayRole,
      }}
      isDev={isDev}
    >
      {children}
    </InstitutionLayoutClient>
  );
}
