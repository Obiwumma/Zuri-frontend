'use client';

import React, { useState } from 'react';
import { KpiTile } from '@/components/ui/KpiTile';
import { DevStateLens } from '@/components/ui/DevStateLens';
import { DataTable, Column } from '@/components/ui/DataTable';

interface RoleDefinition {
  id: string;
  name: string;
  badge: string;
  badgeType: 'primary' | 'secondary' | 'high';
  membersCount: number;
  membersLabel: string;
  description: string;
  permissions: string[];
  restrictedMessage?: string;
  avatars: string[];
}

interface AssignedUserAudit {
  id: string;
  name: string;
  email: string;
  college: string;
  initials: string;
  role: string;
  authorizedBy: string;
  governanceScope: string;
  termDate: string;
  syncStatus: string;
}

export default function RolesPage() {
  const [lensState, setLensState] = useState<'populated' | 'drawer' | 'custom-empty' | 'audit'>('populated');
  const [activeTab, setActiveTab] = useState<'core-tab' | 'users-tab' | 'custom-tab'>('core-tab');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [selectedRoleOption, setSelectedRoleOption] = useState<string>('hod');
  const [activeRole, setActiveRole] = useState<string>('admin');
  const [userSearchQuery, setUserSearchQuery] = useState<string>('');

  const setLens = (lensId: 'populated' | 'drawer' | 'custom-empty' | 'audit') => {
    setLensState(lensId);
    if (lensId === 'drawer') {
      setIsAssignModalOpen(true);
      setActiveTab('core-tab');
    } else {
      setIsAssignModalOpen(false);
    }

    if (lensId === 'custom-empty') {
      setActiveTab('custom-tab');
    } else if (lensId === 'audit') {
      setActiveTab('users-tab');
    } else if (lensId === 'populated') {
      setActiveTab('core-tab');
    }
  };

  const coreRolesData: RoleDefinition[] = [
    {
      id: 'admin',
      name: 'Institution Admin',
      badge: 'Full System Scope',
      badgeType: 'primary',
      membersCount: 14,
      membersLabel: 'Senate Officers',
      description:
        'Full institution management, policy administration, federated directory synchronization, and university-wide academic intelligence dossiers.',
      permissions: [
        'University-wide aggregate telemetry, retention indicators & Senate intelligence dossiers',
        'Curricular syllabus ingestion, faculty department cross-mapping & accreditation archives',
        'InCommon & Oxford SSO federated governance, policy configuration & audit registries',
        'Full student matriculation registries, supervisory rosters & tutor reassignments',
        'Institutional telemetry settings, privacy governance, retention rules & security logs',
      ],
      avatars: ['EV', 'AM', '+12'],
    },
    {
      id: 'hod',
      name: 'Head of Department (HOD)',
      badge: 'Divisional & Faculty Scope',
      badgeType: 'secondary',
      membersCount: 58,
      membersLabel: 'Department Chairs',
      description:
        'Department-level academic oversight, faculty workload governance, course curriculum reviews, and aggregated cohort telemetry.',
      permissions: [
        'Department-level formative assessment mastery telemetry & lecture engagement',
        'Course conveneerships, syllabus graph synthesis & reading list approvals for own faculty',
        'Faculty supervisor assignments and tutorial group distribution across colleges',
        'Anonymized cohort intervention alerts and retake trend trajectories',
      ],
      restrictedMessage: 'Cannot modify university-wide SSO federation or global access rules',
      avatars: ['CS', 'RL', '+56'],
    },
    {
      id: 'lecturer',
      name: 'Lecturer / Staff',
      badge: 'Course & Cohort Scope',
      badgeType: 'high',
      membersCount: 842,
      membersLabel: 'Fellows & Tutors',
      description:
        'Authorized course syllabi, collegiate tutorial supervision groups, student formative diagnostics, and AI-assisted pedagogical tools.',
      permissions: [
        'Own course syllabus dossiers, lecture audio ingests, problem sets & reading lists',
        'Formative quiz generation, concept review signals, and retake cadences for assigned students',
        'Matriculated students enrolled in assigned tutorial supervision and seminar groups',
        'Formative pedagogical intervention logs and diagnostic hints for supervisees',
      ],
      restrictedMessage: "Cannot view other faculties' unpublished curricula or administrative costs",
      avatars: ['JH', 'TL', '+840'],
    },
    {
      id: 'researcher',
      name: 'Researcher',
      badge: 'Research & Synthesis Scope',
      badgeType: 'high',
      membersCount: 334,
      membersLabel: 'Postdoctoral & DPhil',
      description:
        'Authorized research corpus query tools, AI-assisted document extraction, and Bodleian/Radcliffe scholarly literature synthesis.',
      permissions: [
        'Research query dialogues, Radcliffe Science & Bodleian corpus semantic queries',
        'Document extraction pipelines, tabular parsing, and citation lineage verification tools',
        'Laboratory knowledge base synthesis, preprint analysis, and experimental protocol notes',
      ],
      restrictedMessage: 'No access to student matriculation registries, grades, or supervision rosters',
      avatars: ['SK', 'OG', '+332'],
    },
  ];

  const assignedUsersData: AssignedUserAudit[] = [
    {
      id: '1',
      name: 'Prof. Alistair Montgomery',
      email: 'alistair.m@chch.ox.ac.uk',
      college: 'Christ Church',
      initials: 'AM',
      role: 'Institution Admin',
      authorizedBy: 'Prof. Eleanor Vance (Provost)',
      governanceScope: 'MPLS Division & Senate Oversight',
      termDate: 'Michaelmas Wk 7 • 24 Oct 2024',
      syncStatus: 'Active Synced',
    },
    {
      id: '2',
      name: 'Dr. Clara Sterling',
      email: 'clara.s@balliol.ox.ac.uk',
      college: 'Balliol College',
      initials: 'CS',
      role: 'Head of Department (HOD)',
      authorizedBy: 'Senior Proctor Registry',
      governanceScope: 'Faculty of History (42 courses)',
      termDate: 'Michaelmas Wk 6 • 18 Oct 2024',
      syncStatus: 'Active Synced',
    },
    {
      id: '3',
      name: 'Dr. Rowan Lennox',
      email: 'r.lennox@magd.ox.ac.uk',
      college: 'Magdalen College',
      initials: 'RL',
      role: 'Lecturer / Staff',
      authorizedBy: 'Faculty Board (History)',
      governanceScope: 'Hist 201, 312 • 4 Tutorial Groups',
      termDate: 'Michaelmas Wk 5 • 11 Oct 2024',
      syncStatus: 'Active Synced',
    },
    {
      id: '4',
      name: 'Dr. Siobhan Kapoor',
      email: 's.kapoor@sjc.ox.ac.uk',
      college: "St John's College",
      initials: 'SK',
      role: 'Researcher',
      authorizedBy: 'Bodleian Curators Council',
      governanceScope: 'Radcliffe Science Semantic Extraction',
      termDate: 'Michaelmas Wk 4 • 04 Oct 2024',
      syncStatus: 'Active Synced',
    },
  ];

  const filteredUsersData = assignedUsersData.filter((user) => {
    if (!userSearchQuery) return true;
    const q = userSearchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.college.toLowerCase().includes(q) ||
      user.role.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q)
    );
  });

  const columns: Column<AssignedUserAudit>[] = [
    {
      header: 'User & College',
      accessor: (row) => (
        <div className="flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-serif font-bold text-xs flex items-center justify-center shrink-0">
            {row.initials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-primary truncate">{row.name}</span>
            <span className="text-[12px] text-on-surface-variant truncate">
              {row.college} • {row.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Academic Role',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-caps text-[11px] font-semibold ${
            row.role === 'Institution Admin'
              ? 'bg-primary-container text-on-primary-container'
              : row.role === 'Head of Department (HOD)'
              ? 'bg-secondary-fixed text-on-secondary-fixed'
              : 'bg-surface-container-high text-primary'
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      header: 'Authorized By',
      accessor: (row) => <span className="text-[13px] text-on-surface-variant">{row.authorizedBy}</span>,
    },
    {
      header: 'Governance Scope',
      accessor: (row) => <span className="text-[13px]">{row.governanceScope}</span>,
    },
    {
      header: 'Term Date',
      accessor: (row) => <span className="text-[13px] text-on-surface-variant whitespace-nowrap">{row.termDate}</span>,
    },
    {
      header: 'InCommon Sync',
      className: 'text-right',
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 text-[12px] text-surface-tint font-medium">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          {row.syncStatus}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl flex flex-col w-full font-body-md text-on-surface">
        {/* Top Preview Lens Switcher */}
        <aside
          aria-label="Registry Prototype Lens Switcher"
          className="mb-space-lg p-space-sm bg-surface-container-low rounded-xl flex flex-wrap items-center justify-between gap-space-sm shadow-sm"
        >
          <div className="flex items-center gap-space-xs pl-space-xs">
            <span className="material-symbols-outlined text-secondary text-[18px]">visibility</span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">
              Registry Prototype Lens:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={`px-space-md py-1.5 rounded-full text-ui-functional font-ui-functional transition-all flex items-center gap-1.5 cursor-pointer ${
                lensState === 'populated'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              onClick={() => setLens('populated')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">domain</span>
              <span>1. Default Populated (Core Roles)</span>
            </button>
            <button
              className={`px-space-md py-1.5 rounded-full text-ui-functional font-ui-functional transition-all flex items-center gap-1.5 cursor-pointer ${
                lensState === 'drawer'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              onClick={() => setLens('drawer')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>2. Assign Role Drawer Open</span>
            </button>
            <button
              className={`px-space-md py-1.5 rounded-full text-ui-functional font-ui-functional transition-all flex items-center gap-1.5 cursor-pointer ${
                lensState === 'custom-empty'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              onClick={() => setLens('custom-empty')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span>3. Custom Roles Lens</span>
            </button>
            <button
              className={`px-space-md py-1.5 rounded-full text-ui-functional font-ui-functional transition-all flex items-center gap-1.5 cursor-pointer ${
                lensState === 'audit'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
              onClick={() => setLens('audit')}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">history_edu</span>
              <span>4. Filtered User Audit View</span>
            </button>
          </div>
        </aside>

        {/* Editorial Page Header */}
        <header className="flex flex-col gap-space-sm mb-space-xl">
          <div className="flex items-center gap-space-xs flex-wrap">
            <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary font-semibold">
              University of Oxford • Identity & Federated Governance • Access Policies
            </span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[11px] tracking-wider uppercase font-medium">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              InCommon • eduGAIN Active
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div className="max-w-3xl">
              <h1 className="font-headline-md text-headline-md font-serif text-primary tracking-tight">
                Roles & permissions
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
                Control access to Lexi based on academic and administrative responsibilities across the university. Permissions are translated into plain academic governance language so provosts, senior tutors, and registry deans can audit access without technical complexity.
              </p>
            </div>
            <div className="flex items-center gap-space-sm shrink-0">
              <button
                className="px-space-md py-2.5 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-ui-functional text-ui-functional font-medium transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">sync</span>
                <span>Audit InCommon Sync</span>
              </button>
              <button
                className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-ui-functional text-ui-functional font-medium transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                onClick={() => setIsAssignModalOpen(true)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>+ Assign Role to User</span>
              </button>
            </div>
          </div>
        </header>

        {/* Governance Metrics Summary Tiles using KpiTile */}
        <section aria-label="Governance Metrics Summary" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
          <KpiTile
            icon="group"
            label="Active Assignments"
            subtext={
              <div className="font-ui-functional text-[13px] text-on-surface-variant leading-snug">
                Across 38 constituent colleges & 4 academic divisions
              </div>
            }
            value="1,248"
          />
          <KpiTile
            icon="policy"
            label="Standard Academic Roles"
            subtext={
              <div className="font-ui-functional text-[13px] text-on-surface-variant leading-snug">
                InCommon-federated Oxford role archetypes active
              </div>
            }
            value="4 Defined"
          />
          <KpiTile
            icon="tune"
            label="Custom Governance Roles"
            subtext={
              <div className="font-ui-functional text-[13px] text-on-surface-variant leading-snug">
                No custom roles defined; university defaults enforce compliance
              </div>
            }
            value="0 Active"
          />
          <KpiTile
            label="Pending Access Reviews"
            subtext={
              <div className="font-ui-functional text-[13px] text-on-surface-variant leading-snug">
                Flagged for Michaelmas Term tutorial re-verification
              </div>
            }
            trend="6 Reviews"
            trendDirection="down"
            value="6 Reviews"
          />
        </section>

        {/* Navigation Tabs */}
        <div className="mb-space-lg flex items-center gap-space-lg bg-surface-container-low px-space-md pt-space-sm rounded-t-xl overflow-x-auto">
          <button
            className={`pb-3 font-ui-functional text-ui-functional transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'core-tab'
                ? 'font-semibold text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setActiveTab('core-tab')}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Institutional Roles (4 Core)</span>
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[11px] font-semibold">
              4
            </span>
          </button>
          <button
            className={`pb-3 font-ui-functional text-ui-functional transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'users-tab'
                ? 'font-semibold text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setActiveTab('users-tab')}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
            <span>Assigned Users Directory</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
              1,248
            </span>
          </button>
          <button
            className={`pb-3 font-ui-functional text-ui-functional transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'custom-tab'
                ? 'font-semibold text-primary border-b-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            onClick={() => setActiveTab('custom-tab')}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add_moderator</span>
            <span>Custom Roles</span>
            <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-medium">
              0
            </span>
          </button>
        </div>

        {/* Assign Role Workflow Drawer / Modal Panel */}
        {isAssignModalOpen && (
          <section className="mb-space-xl p-space-lg rounded-2xl bg-surface-container-lowest shadow-md transition-all">
            <div className="flex items-center justify-between pb-space-sm mb-space-md bg-surface-container-low -mx-space-lg -mt-space-lg px-space-lg py-space-sm rounded-t-2xl">
              <div className="flex items-center gap-space-xs">
                <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm font-serif text-primary">Assign Role to Academic User</h2>
                  <p className="font-ui-functional text-ui-functional text-on-surface-variant">
                    Federated Single Sign-On (Oxford InCommon Provisioning)
                  </p>
                </div>
              </div>
              <button
                className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
                onClick={() => setIsAssignModalOpen(false)}
                title="Close Assignment Panel"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* 4-Step Progress Bar */}
            <div className="mb-space-lg grid grid-cols-1 sm:grid-cols-4 gap-space-xs text-center">
              <div className="p-2 rounded-lg bg-surface-container-high text-primary flex items-center justify-center gap-2">
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary font-ui-functional text-xs flex items-center justify-center font-bold">
                  ✓
                </span>
                <span className="font-ui-functional text-ui-functional font-semibold">1. Select User</span>
              </div>
              <div className="p-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center gap-2">
                <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary font-ui-functional text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span className="font-ui-functional text-ui-functional font-bold">2. Assign Role</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center gap-2">
                <span className="w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant font-ui-functional text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span className="font-ui-functional text-ui-functional">3. Review Scope</span>
              </div>
              <div className="p-2 rounded-lg bg-surface-container text-on-surface-variant flex items-center justify-center gap-2">
                <span className="w-5 h-5 rounded-full bg-surface-container-highest text-on-surface-variant font-ui-functional text-xs flex items-center justify-center font-bold">
                  4
                </span>
                <span className="font-ui-functional text-ui-functional">4. Synchronize</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col gap-space-md">
                <div>
                  <label className="block font-ui-functional text-ui-functional font-medium text-on-surface-variant mb-1.5">
                    Academic User (SSO Email or Oxford Single Sign-On Username)
                  </label>
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container font-serif font-bold text-lg flex items-center justify-center">
                        CS
                      </div>
                      <div className="flex flex-col">
                        <span className="font-ui-functional text-ui-functional font-bold text-primary">Dr. Clara Sterling</span>
                        <span className="font-ui-functional text-[13px] text-on-surface-variant">
                          clara.sterling@balliol.ox.ac.uk • Balliol College • Faculty of History
                        </span>
                      </div>
                    </div>
                    <button className="text-secondary font-ui-functional text-ui-functional hover:underline cursor-pointer" type="button">
                      Change
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-ui-functional text-ui-functional font-medium text-on-surface-variant mb-2">
                    Select Core Governance Role
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <label
                      className={`p-space-sm rounded-lg cursor-pointer flex items-start gap-space-xs transition-colors ${
                        selectedRoleOption === 'admin'
                          ? 'bg-secondary-fixed/40 shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <input
                        checked={selectedRoleOption === 'admin'}
                        className="mt-1 accent-primary"
                        name="role-assignment"
                        onChange={() => setSelectedRoleOption('admin')}
                        type="radio"
                        value="admin"
                      />
                      <div>
                        <span className="font-ui-functional text-ui-functional font-bold text-primary block">
                          Institution Admin
                        </span>
                        <span className="font-ui-functional text-[12px] text-on-surface-variant leading-tight block mt-0.5">
                          Full university system scope & governance
                        </span>
                      </div>
                    </label>

                    <label
                      className={`p-space-sm rounded-lg cursor-pointer flex items-start gap-space-xs transition-colors ${
                        selectedRoleOption === 'hod'
                          ? 'bg-secondary-fixed/40 shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <input
                        checked={selectedRoleOption === 'hod'}
                        className="mt-1 accent-secondary"
                        name="role-assignment"
                        onChange={() => setSelectedRoleOption('hod')}
                        type="radio"
                        value="hod"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-ui-functional text-ui-functional font-bold text-primary">
                            Head of Department (HOD)
                          </span>
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        </div>
                        <span className="font-ui-functional text-[12px] text-on-secondary-fixed-variant leading-tight block mt-0.5">
                          Divisional curriculum & departmental telemetry
                        </span>
                      </div>
                    </label>

                    <label
                      className={`p-space-sm rounded-lg cursor-pointer flex items-start gap-space-xs transition-colors ${
                        selectedRoleOption === 'lecturer'
                          ? 'bg-secondary-fixed/40 shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <input
                        checked={selectedRoleOption === 'lecturer'}
                        className="mt-1 accent-primary"
                        name="role-assignment"
                        onChange={() => setSelectedRoleOption('lecturer')}
                        type="radio"
                        value="lecturer"
                      />
                      <div>
                        <span className="font-ui-functional text-ui-functional font-bold text-primary block">
                          Lecturer / Staff
                        </span>
                        <span className="font-ui-functional text-[12px] text-on-surface-variant leading-tight block mt-0.5">
                          Tutorial groups & course problem sets
                        </span>
                      </div>
                    </label>

                    <label
                      className={`p-space-sm rounded-lg cursor-pointer flex items-start gap-space-xs transition-colors ${
                        selectedRoleOption === 'researcher'
                          ? 'bg-secondary-fixed/40 shadow-sm'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <input
                        checked={selectedRoleOption === 'researcher'}
                        className="mt-1 accent-primary"
                        name="role-assignment"
                        onChange={() => setSelectedRoleOption('researcher')}
                        type="radio"
                        value="researcher"
                      />
                      <div>
                        <span className="font-ui-functional text-ui-functional font-bold text-primary block">
                          Researcher
                        </span>
                        <span className="font-ui-functional text-[12px] text-on-surface-variant leading-tight block mt-0.5">
                          Bodleian document extraction & corpora queries
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column Summary */}
              <div className="lg:col-span-5 p-space-md rounded-xl bg-surface-container flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-space-xs">
                    <span className="material-symbols-outlined text-[18px] text-secondary">fact_check</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">
                      Academic Impact Summary
                    </span>
                  </div>
                  <p className="font-ui-functional text-ui-functional text-primary leading-relaxed">
                    Assigning <strong className="font-bold text-primary">Head of Department (HOD)</strong> will grant{' '}
                    <strong className="font-bold text-primary">Dr. Clara Sterling</strong> supervisory access to the Faculty of History (42 active courses, 1,420 students) and weekly departmental assessment telemetry.
                  </p>
                  <div className="mt-space-sm pt-space-sm flex flex-col gap-1.5 text-[13px] text-on-surface-variant">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-surface-tint">check_circle</span>
                      <span>Oxford InCommon SSO credentials mapped immediately</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-surface-tint">check_circle</span>
                      <span>Automated Michaelmas term audit notification to Provost Vance</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-space-sm pt-space-md">
                  <button
                    className="px-space-md py-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-on-surface font-ui-functional text-ui-functional font-medium transition-colors cursor-pointer"
                    onClick={() => setIsAssignModalOpen(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-space-md py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-ui-functional text-ui-functional font-medium shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsAssignModalOpen(false)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Confirm Role Assignment</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 1 CONTENT: CORE ROLES GRID */}
        {activeTab === 'core-tab' && (
          <section aria-label="Standard Academic Governance Roles" className="flex flex-col gap-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-serif text-primary">Standard Academic Roles</h2>
                <p className="font-ui-functional text-ui-functional text-on-surface-variant">
                  Four InCommon federated archetypes governing permissions across all colleges and faculties.
                </p>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                All 4 Roles Active • InCommon Synced
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
              {coreRolesData.map((role) => (
                <article
                  key={role.id}
                  className="p-space-lg rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-space-sm">
                      <div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-caps text-[11px] tracking-wider uppercase font-semibold ${
                            role.badgeType === 'primary'
                              ? 'bg-primary-container text-on-primary-container'
                              : role.badgeType === 'secondary'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-surface-container-high text-primary'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {role.badge}
                        </span>
                        <h3 className="font-headline-sm text-headline-sm font-serif text-primary mt-2">{role.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="font-ui-functional text-ui-functional font-bold text-primary block">
                          {role.membersCount} Members
                        </span>
                        <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary">
                          {role.membersLabel}
                        </span>
                      </div>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-space-md leading-relaxed">
                      {role.description}
                    </p>

                    <div className="p-space-md rounded-xl bg-surface-container-low mb-space-md">
                      <h4 className="font-label-caps text-label-caps uppercase tracking-wider text-secondary mb-space-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        What this role can access:
                      </h4>
                      <ul className="flex flex-col gap-2 font-ui-functional text-[13px] text-on-surface">
                        {role.permissions.map((perm, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-surface-tint shrink-0 mt-0.5">
                              check_circle
                            </span>
                            <span>{perm}</span>
                          </li>
                        ))}
                        {role.restrictedMessage && (
                          <li className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-[16px] text-on-error-container shrink-0 mt-0.5">
                              cancel
                            </span>
                            <span className="text-on-surface-variant italic">{role.restrictedMessage}</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-space-sm flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-t border-surface-container">
                    <div className="flex items-center gap-space-xs">
                      <div className="flex -space-x-2 overflow-hidden">
                        {role.avatars.map((av, idx) => (
                          <div
                            key={idx}
                            className="inline-block h-7 w-7 rounded-full bg-primary text-on-primary font-ui-functional text-[11px] font-bold flex items-center justify-center ring-2 ring-surface-container-lowest"
                          >
                            {av}
                          </div>
                        ))}
                      </div>
                      <span className="font-ui-functional text-[13px] text-on-surface-variant">
                        {role.membersCount} {role.membersLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="font-ui-functional text-ui-functional text-secondary font-semibold hover:underline cursor-pointer"
                        onClick={() => setActiveTab('users-tab')}
                        type="button"
                      >
                        View Members ({role.membersCount})
                      </button>
                      <span className="text-outline-variant">•</span>
                      <button
                        className="font-ui-functional text-ui-functional text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                        type="button"
                      >
                        Manage Scope
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2 CONTENT: ASSIGNED USERS DIRECTORY */}
        {activeTab === 'users-tab' && (
          <section aria-label="Recent Role Assignments & Audit Ledger" className="flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-serif text-primary">Assigned Users Directory & Audit Ledger</h2>
                <p className="font-ui-functional text-ui-functional text-on-surface-variant">
                  Traceable collegiate role assignments synchronized with Oxford University IT InCommon SAML credentials.
                </p>
              </div>
              <div className="relative w-full sm:w-72">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-outline">search</span>
                <input
                  className="w-full bg-surface-container-lowest pl-9 pr-3 py-2 rounded-lg font-ui-functional text-ui-functional text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder="Filter by name, college, role..."
                  type="text"
                  value={userSearchQuery}
                />
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-lowest shadow-sm overflow-hidden flex flex-col">
              <DataTable
                columns={columns}
                data={filteredUsersData}
                keyExtractor={(row) => row.id}
              />

              <div className="p-space-sm bg-surface-container-low flex items-center justify-between font-ui-functional text-[13px] text-on-surface-variant border-t border-surface-container">
                <span>Showing {filteredUsersData.length} of 1,248 active role delegations across Oxford Colleges</span>
                <div className="flex items-center gap-2">
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high font-medium text-primary cursor-pointer" type="button">
                    Previous
                  </button>
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high font-medium text-primary cursor-pointer" type="button">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3 CONTENT: CUSTOM GOVERNANCE ROLES */}
        {activeTab === 'custom-tab' && (
          <section aria-label="Custom Roles Section" className="flex flex-col gap-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div>
                <h2 className="font-headline-sm text-headline-sm font-serif text-primary">Custom Governance Roles</h2>
                <p className="font-ui-functional text-ui-functional text-on-surface-variant">
                  Collegiate sub-roles and tailored access scopes beyond standard InCommon definitions.
                </p>
              </div>
              <button
                className="px-space-md py-2 rounded-lg bg-surface-container text-primary hover:bg-surface-container-high font-ui-functional text-ui-functional font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>+ Create Custom Role</span>
              </button>
            </div>

            <div className="p-space-xl rounded-2xl bg-surface-container-lowest shadow-sm flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-space-md">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-space-md">
                <span className="material-symbols-outlined text-[32px] text-secondary">security</span>
              </div>
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary mb-1">
                Standard Archetypes Sufficient
              </span>
              <h3 className="font-headline-sm text-headline-sm font-serif text-primary mb-space-xs">No custom roles defined yet</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg max-w-lg leading-relaxed">
                Your institution is currently operating entirely on Oxford's standard federated roles (Institution Admin, HOD, Lecturer/Staff, Researcher). If your collegiate governance requires hybrid supervisory or library archivist permissions, you can define a custom access profile.
              </p>
              <div className="flex items-center gap-space-sm">
                <button
                  className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-ui-functional text-ui-functional font-medium shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Define First Custom Role</span>
                </button>
                <button
                  className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface font-ui-functional text-ui-functional transition-colors cursor-pointer"
                  onClick={() => setActiveTab('core-tab')}
                  type="button"
                >
                  Review Standard Roles
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Editorial Footnote / InCommon Federation Banner */}
        <footer className="mt-space-xl pt-space-md pb-space-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md text-on-surface-variant text-[13px] font-ui-functional border-t border-surface-container">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">shield</span>
            <span>
              Policy governance governed by Oxford University Statutes, Title IX (Discipline) and InCommon Identity Federation v4.2.
            </span>
          </div>
          <div className="flex items-center gap-space-md text-secondary">
            <a className="hover:underline" href="#">Academic Governance Code</a>
            <span>•</span>
            <a className="hover:underline" href="#">InCommon SAML Attribute Specs</a>
          </div>
        </footer>
    </div>
  );
}
