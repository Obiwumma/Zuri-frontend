'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavShell, NavShellUser, NavGroup } from '@/components/ui/NavShell';

interface InstitutionLayoutClientProps {
  activeRoute: string;
  navGroups: NavGroup[];
  user: NavShellUser;
  isDev: boolean;
  children?: React.ReactNode;
}

export function InstitutionLayoutClient({
  activeRoute,
  navGroups,
  user,
  isDev,
  children,
}: InstitutionLayoutClientProps) {
  const clientPathname = usePathname();
  const [activeRole, setActiveRole] = useState<string>('admin');

  // The switcher is only permitted behind a NODE_ENV === 'development' check.
  // Note: changing activeRole in dev does NOT affect navGroups; nav visibility
  // is strictly derived from getSession().role on the server.
  const roles = isDev
    ? [
        { value: 'admin', label: 'Institution Admin' },
        { value: 'hod', label: 'Head of Department (HOD)' },
        { value: 'lecturer', label: 'Lecturer / Staff' },
        { value: 'researcher', label: 'Academic Researcher' },
      ]
    : [];

  return (
    <NavShell
      activeRoute={clientPathname || activeRoute}
      activeRole={activeRole}
      brandLogoUrl="https://lh3.googleusercontent.com/aida/AEtjO1VZfxGhytYIkp9Gf5rWisz-FzjMyrO9DHxV3ZegwvQVuO5U9pO75tY9-2TuGVW8FfQUr2M_5TKAvgGWeTKVhynvIupWYe4s732dy-zj7lRb7x7vkkUMs-H6oi2Vl3oTtO49LD5i1zB8O-sAF186Q5E2yqTlWm75TIseaDENALm9-3BEcse4pqQCxyoPgLaycJ4FQ-35C6lDrUUQGBEhOBNmovuEpdzjEVIzTEDDucb58sCXGcZG_NkJyHo"
      brandName="Lexi"
      brandSubtitle="Academic Intelligence"
      federationTag="InCommon Fed. Active"
      institutionName="University of Oxford"
      institutionSubtitle="Faculty Senate Academic Console"
      navGroups={navGroups}
      onRoleChange={(r) => setActiveRole(r)}
      roles={roles}
      termInfo="Michaelmas Term 2024–25 • Week 7"
      user={user}
      versionTag="v4.2-oxon"
    >
      {children}
    </NavShell>
  );
}
