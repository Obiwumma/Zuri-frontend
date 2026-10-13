'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavShell, NavShellUser } from '@/components/ui/NavShell';
import { institutionalNavGroups } from '@/lib/navConfig';

export default function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<string>('admin');

  // Omit layout shell on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const currentUser: NavShellUser = {
    name: 'Prof. Eleanor Vance',
    role: 'Provost & Vice-Chancellor',
  };

  return (
    <NavShell
      activeRoute={pathname}
      activeRole={activeRole}
      brandLogoUrl="https://lh3.googleusercontent.com/aida/AEtjO1VZfxGhytYIkp9Gf5rWisz-FzjMyrO9DHxV3ZegwvQVuO5U9pO75tY9-2TuGVW8FfQUr2M_5TKAvgGWeTKVhynvIupWYe4s732dy-zj7lRb7x7vkkUMs-H6oi2Vl3oTtO49LD5i1zB8O-sAF186Q5E2yqTlWm75TIseaDENALm9-3BEcse4pqQCxyoPgLaycJ4FQ-35C6lDrUUQGBEhOBNmovuEpdzjEVIzTEDDucb58sCXGcZG_NkJyHo"
      brandName="Lexi"
      brandSubtitle="Academic Intelligence"
      federationTag="InCommon Fed. Active"
      institutionName="University of Oxford"
      institutionSubtitle="Faculty Senate Academic Console"
      navGroups={institutionalNavGroups}
      onRoleChange={(r) => setActiveRole(r)}
      roles={[
        { value: 'admin', label: 'Institution Admin' },
        { value: 'hod', label: 'Head of Department (HOD)' },
        { value: 'lecturer', label: 'Lecturer / Staff' },
        { value: 'researcher', label: 'Academic Researcher' },
      ]}
      termInfo="Michaelmas Term 2024–25 • Week 7"
      user={currentUser}
      versionTag="v4.2-oxon"
    >
      {children}
    </NavShell>
  );
}
