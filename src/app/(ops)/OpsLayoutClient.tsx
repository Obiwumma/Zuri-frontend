'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface OpsUser {
  name: string;
  role: string;
  email?: string;
}

export function OpsLayoutClient({
  user,
  children,
}: {
  user: OpsUser;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      router.push('/ops/login');
    }
  };

  const navItemsOps = [
    { label: 'System Health', href: '/ops/health', icon: 'monitor_heart', badge: 'Pulse', path: 'system-health' },
    { label: 'AI Cost & Requests', href: '/ops/ai-cost', icon: 'data_usage', badge: '2.4k/s', path: 'ai-cost-and-requests' },
    { label: 'AI Routing', href: '/ops/routing', icon: 'alt_route', badge: 'Mesh', path: 'ai-routing' },
    { label: 'Student Signal', href: '/ops/routing', icon: 'sensors', badge: 'Dot', path: 'student-signal' },
    { label: 'Logging', href: '/ops/logs', icon: 'terminal', badge: 'stdout', path: 'logging' },
  ];

  const navItemsGovernance = [
    {
      label: 'Documentation & Settings',
      href: '/ops/health#docs',
      icon: 'folder_open',
      path: 'documentation-and-settings',
      subItems: [
        { label: 'Operations Docs', href: '/ops/health#docs', icon: 'menu_book', path: 'operations-docs' },
        { label: 'Cluster Settings', href: '/ops/health#settings', icon: 'tune', path: 'cluster-settings' },
      ],
    },
  ];

  return (
    <div className="dark bg-surface-container-lowest text-on-surface antialiased selection:bg-primary selection:text-on-primary font-body-md text-body-md min-h-screen">
      {/* FIXED TOP HEADER */}
      <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-surface-container-low/95 backdrop-blur-md border-b border-outline-variant flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">Lexi</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">
                Ops
              </span>
            </div>
          </div>
          <div className="h-4 w-px bg-outline-variant hidden sm:block"></div>
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container border border-outline-variant">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-code-md text-code-md text-on-surface-variant font-medium">PROD-CLUSTER-A</span>
            <span className="text-outline font-code-md text-code-md">{'//'}</span>
            <span className="font-code-md text-code-md text-on-surface-variant">eu-west-1</span>
          </div>
          <div className="hidden xl:flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>All Systems Nominal</span>
            <span className="text-outline">·</span>
            <span>99.98% Uptime</span>
            <span className="text-outline">·</span>
            <span className="font-code-md text-code-md text-on-surface">p95 42ms</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden lg:flex items-center">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:border-outline transition-colors cursor-pointer w-64">
              <span className="material-symbols-outlined text-[16px] text-outline">search</span>
              <span className="font-body-sm text-body-sm flex-1 text-on-surface-variant">Search telemetry, nodes...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline-variant text-outline font-label-sm text-label-sm">
                ⌘K
              </kbd>
            </div>
          </div>
          <button type="button" className="relative p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-surface-container-low"></span>
          </button>
          <div className="h-4 w-px bg-outline-variant"></div>

          {/* User Chip with User Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 pl-1 hover:opacity-85 transition-opacity cursor-pointer text-left"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
              id="ops-user-menu-button"
            >
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="font-body-sm text-body-sm font-semibold text-on-surface leading-tight">{user.name}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{user.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
              <span className="material-symbols-outlined text-[18px] text-outline hover:text-on-surface hidden sm:block">
                {isUserMenuOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 top-12 w-64 bg-surface-container rounded-lg shadow-xl border border-outline-variant p-2 z-50 flex flex-col gap-1 select-none"
                role="menu"
                aria-labelledby="ops-user-menu-button"
              >
                <div className="px-2.5 py-2 border-b border-outline-variant/30 flex flex-col gap-0.5">
                  <span className="font-body-sm text-body-sm font-semibold text-on-surface truncate">{user.name}</span>
                  {user.email && (
                    <span className="text-xs text-on-surface-variant font-code-md truncate">{user.email}</span>
                  )}
                  <span className="font-label-sm text-label-sm text-primary uppercase mt-1">{user.role}</span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-2.5 py-2 rounded text-sm text-error hover:bg-error-container/20 transition-colors w-full text-left cursor-pointer mt-1"
                  role="menuitem"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* FIXED LEFT SIDEBAR */}
      <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest border-r border-outline-variant z-40 flex flex-col justify-between select-none">
        <div className="flex flex-col flex-1 py-3 overflow-y-auto">
          <div className="px-4 pb-2 text-outline font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Operations Engine
          </div>
          <nav className="flex flex-col gap-0.5 px-2">
            {navItemsOps.map((item) => {
              const isActive = pathname === item.href || (item.href === '/ops/health' && pathname === '/ops');
              return (
                <Link
                  key={item.path}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
                    isActive
                      ? 'bg-surface-container text-primary font-semibold border-l-2 border-primary'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-body-md text-body-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge === 'Pulse' ? (
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  ) : item.badge === 'Dot' ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  ) : item.badge === 'Mesh' ? (
                    <span className="px-1 py-0.5 text-primary font-code-md text-code-md font-medium">Mesh</span>
                  ) : item.badge ? (
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-code-md text-code-md">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="my-4 border-t border-outline-variant mx-4"></div>

          <div className="px-4 pb-2 text-outline font-label-sm text-label-sm uppercase tracking-wider font-semibold">
            Governance &amp; Documentation
          </div>
          <nav className="flex flex-col gap-0.5 px-2">
            {navItemsGovernance.map((item) => {
              return (
                <div key={item.path} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-3 px-3 py-2 text-on-surface font-body-md text-body-md font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-primary">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.subItems && (
                    <div className="pl-4 ml-3 border-l border-outline-variant/30 flex flex-col gap-0.5 my-0.5">
                      {item.subItems.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.path}
                            href={sub.href}
                            className={`flex items-center gap-2.5 px-3 py-1.5 rounded transition-colors text-body-sm ${
                              isSubActive
                                ? 'bg-surface-container text-primary font-semibold border-l-2 border-primary'
                                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[16px] text-outline">{sub.icon}</span>
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="p-3 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between">
          <div className="flex items-center gap-2 text-outline font-code-md text-code-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span>v2.41.8-core</span>
          </div>
          <button type="button" className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">dock_to_left</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="pl-64">
        <main className="relative w-full pt-14 bg-surface-container-lowest min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
