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

  // Omit layout shell on login and standalone auth/recovery pages
  if (
    pathname === '/login' ||
    pathname === '/institution/login' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/change-password' ||
    pathname === '/institution/forgot-password' ||
    pathname === '/institution/reset-password'
  ) {
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
    : 'Institution Admin';

  const displayName = session?.email
    ? session.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Institution Admin';

  const userEmail = session?.email || '';

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <InstitutionLayoutClient
      activeRoute={pathname}
      navGroups={serverNavGroups}
      user={{
        name: displayName,
        email: userEmail,
        role: displayRole,
      }}
      isDev={isDev}
    >
      {children}
    </InstitutionLayoutClient>
  );
}
