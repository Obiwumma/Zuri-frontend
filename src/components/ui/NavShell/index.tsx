'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export interface NavItem {
  label: string;
  href: string;
  path: string;
  icon?: string;
  subItems?: NavItem[];
}

export interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export interface NavShellUser {
  name: string;
  role: string;
  email?: string;
  avatarIcon?: string;
}

export interface NavShellProps {
  activeRoute: string;
  navGroups: NavGroup[];
  user: NavShellUser;
  brandName?: string;
  brandSubtitle?: string;
  brandLogoUrl?: string;
  institutionName?: string;
  institutionSubtitle?: string;
  termInfo?: string;
  roles?: { value: string; label: string }[];
  activeRole?: string;
  onRoleChange?: (role: string) => void;
  onLogout?: () => void;
  federationTag?: string;
  versionTag?: string;
  children: React.ReactNode;
}

export function NavShell({
  activeRoute,
  navGroups,
  user,
  brandName,
  brandSubtitle,
  brandLogoUrl,
  institutionName,
  institutionSubtitle,
  termInfo,
  roles = [],
  activeRole,
  onRoleChange,
  onLogout,
  federationTag,
  versionTag,
  children,
}: NavShellProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      if (onLogout) {
        onLogout();
      } else {
        router.push('/login');
      }
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] overflow-y-auto">
        <div className="flex flex-col">
          <div className="h-16 px-space-lg flex items-center gap-space-sm bg-surface-container-low">
            {brandLogoUrl && (
              <img
                alt={`${brandName} Logo`}
                className="h-8 w-auto object-contain"
                src={brandLogoUrl}
              />
            )}
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm tracking-tight text-primary leading-none">{brandName}</span>
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary mt-0.5">{brandSubtitle}</span>
            </div>
          </div>

          {roles.length > 0 && (
            <div className="px-space-md py-space-sm">
              <div className="bg-surface-container p-space-sm rounded-lg flex flex-col gap-space-xs">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant flex items-center justify-between" htmlFor="role-switch">
                  <span>Active Role View</span>
                  <span className="material-symbols-outlined text-[14px] text-secondary">sync_alt</span>
                </label>
                <select
                  className="w-full bg-surface-container-lowest text-on-surface font-ui-functional text-ui-functional py-1 px-space-sm rounded-DEFAULT outline-none cursor-pointer hover:bg-surface"
                  value={activeRole}
                  onChange={(e) => onRoleChange?.(e.target.value)}
                  id="role-switch"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <nav className="flex-1 px-space-md py-space-sm flex flex-col gap-space-md">
            {navGroups.map((group, idx) => (
              <div key={group.groupName} data-nav-group={group.groupName.toLowerCase().replace(/\s+/g, '-')}>
                <div className="px-space-sm mb-space-xs font-label-caps text-label-caps uppercase tracking-wider text-secondary">
                  {idx + 1}. {group.groupName}
                </div>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const isActive =
                      activeRoute === item.path ||
                      activeRoute === item.href ||
                      (currentPath && currentPath === item.href && item.href !== '#');
                    return (
                      <React.Fragment key={item.path || item.label}>
                        <Link
                          aria-current={isActive ? 'page' : undefined}
                          className={`flex items-center justify-between px-space-sm py-1.5 rounded-lg transition-colors font-ui-functional text-ui-functional ${
                            isActive
                              ? 'bg-primary-container text-on-primary-container font-semibold'
                              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                          }`}
                          data-path={item.path}
                          href={item.href}
                        >
                          <span>{item.label}</span>
                          {item.subItems && (
                            <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
                          )}
                        </Link>
                        {item.subItems && (
                          <div className="pl-3 ml-3 border-l border-outline-variant/30 flex flex-col gap-1 my-0.5">
                            {item.subItems.map((subItem) => {
                              const isSubActive =
                                activeRoute === subItem.path ||
                                activeRoute === subItem.href ||
                                (currentPath && currentPath === subItem.href && subItem.href !== '#');
                              return (
                                <Link
                                  key={subItem.path || subItem.label}
                                  aria-current={isSubActive ? 'page' : undefined}
                                  className={`flex items-center px-space-sm py-1 rounded-md transition-colors font-ui-functional text-[13px] ${
                                    isSubActive
                                      ? 'bg-primary-container/80 text-on-primary-container font-semibold'
                                      : 'text-on-surface-variant/80 hover:bg-surface-container-high hover:text-on-surface'
                                  }`}
                                  data-path={subItem.path}
                                  href={subItem.href}
                                >
                                  {subItem.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="p-space-md bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">{federationTag}</span>
          </div>
          <span className="font-label-caps text-label-caps text-outline">{versionTag}</span>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-margin-desktop">
          <div className="flex items-center gap-space-md">
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary leading-tight font-serif">{institutionName}</span>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">{institutionSubtitle}</span>
            </div>
            {termInfo && (
              <>
                <div className="h-6 w-px bg-outline-variant hidden lg:block"></div>
                <div className="hidden lg:flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
                  <span className="font-ui-functional text-ui-functional text-on-surface">{termInfo}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-space-md">
            <button aria-label="Notifications" className="relative p-space-xs rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" type="button">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
            </button>
            <div className="h-6 w-px bg-outline-variant"></div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-space-sm hover:opacity-85 transition-opacity cursor-pointer text-left p-1 rounded-lg"
                id="navshell-user-menu-button"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className="flex flex-col text-right">
                  <span className="font-ui-functional text-ui-functional font-semibold text-on-surface leading-snug">{user.name}</span>
                  <div className="flex items-center justify-end gap-1">
                    <span className="font-label-caps text-label-caps uppercase text-secondary font-medium">{user.role}</span>
                    <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                      {isUserMenuOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-primary text-[18px]">{user.avatarIcon || 'person'}</span>
                </div>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 top-12 w-64 bg-surface-container rounded-lg shadow-lg border border-outline-variant p-space-sm z-50 flex flex-col gap-1"
                  role="menu"
                  aria-labelledby="navshell-user-menu-button"
                >
                  <div className="px-2 py-1.5 border-b border-outline-variant/30 flex flex-col">
                    <span className="font-ui-functional text-ui-functional font-semibold text-on-surface truncate">{user.name}</span>
                    {user.email && (
                      <span className="text-xs text-on-surface-variant truncate">{user.email}</span>
                    )}
                    <span className="font-label-caps text-label-caps uppercase text-secondary mt-1">{user.role}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-2 rounded text-sm text-error hover:bg-error-container/20 transition-colors w-full text-left cursor-pointer mt-1"
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

        <main className="relative pt-16 bg-surface min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
