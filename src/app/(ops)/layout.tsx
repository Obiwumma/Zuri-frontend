import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getFrontendRoleLabel, canAccessOps } from '@/lib/auth/roles';
import { OpsLayoutClient } from './OpsLayoutClient';

export default async function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  // Standalone auth and recovery pages render without ops shell
  if (
    pathname === '/ops/login' ||
    pathname === '/ops/forgot-password' ||
    pathname === '/ops/reset-password' ||
    pathname === '/ops/change-password'
  ) {
    return <div className="dark min-h-screen bg-surface font-body-md text-on-surface">{children}</div>;
  }

  // Derive authenticated identity from session on the server
  const session = await getSession();

  // Defense-in-depth: Re-check session on server rendering
  if (process.env.NODE_ENV === 'production' && (!session || !canAccessOps(session.role))) {
    redirect('/ops/login');
  }
  const displayRole = session?.role ? getFrontendRoleLabel(session.role) : 'Ops Administrator';
  const displayName = session?.email
    ? session.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'SecOps Lead';
  const displayEmail = session?.email || 'operator@lexi.internal';

  return (
    <OpsLayoutClient
      user={{
        name: displayName,
        email: displayEmail,
        role: displayRole,
      }}
    >
      {children}
    </OpsLayoutClient>
  );
}
