'use client';

import React, { useState } from 'react';
import { DevStateLens } from '@/components/ui/DevStateLens';
import { KpiTile } from '@/components/ui/KpiTile';
import { DataTable, Column } from '@/components/ui/DataTable';

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  college: string;
  matriculationId: string;
  division: string;
  department: string;
  moduleCode: string;
  moduleTitle: string;
  level: string;
  status: 'Active Matriculated' | 'Suspended (Leave)';
  engagementLabel: string;
  engagementPct: number;
  engagementDetail: string;
  tutor?: string;
  matriculationYear?: string;
  isSelected?: boolean;
}

export default function StudentsPage() {
  const [lensState, setLensState] = useState<'populated' | 'empty' | 'no-search' | 'no-filter' | 'loading'>('populated');
  const [activeRole, setActiveRole] = useState<string>('admin');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({ 'OX-948201': true });
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'Faculty: All Active',
    'Status: Active Matriculated',
    'Term: Michaelmas 2024',
  ]);

  const studentsData: StudentRecord[] = [
    {
      id: 'OX-948201',
      name: 'Clara Holloway',
      email: 'clara.holloway@balliol.ox.ac.uk',
      college: 'Balliol College',
      matriculationId: 'OX-948201',
      division: 'MPLS',
      department: 'Engineering Science',
      moduleCode: 'ENG-320',
      moduleTitle: 'Fluid Dynamics',
      level: 'UG Finals (Year 3)',
      status: 'Active Matriculated',
      engagementLabel: 'Optimal (98%)',
      engagementPct: 98,
      engagementDetail: '14 Quizzes',
      tutor: 'Prof. C. Ravenscroft, FRS',
      matriculationYear: 'Michaelmas 2022 (Cohort 24)',
    },
    {
      id: 'OX-882104',
      name: 'Alistair Montgomery',
      email: 'alistair.montgomery@chch.ox.ac.uk',
      college: 'Christ Church',
      matriculationId: 'OX-882104',
      division: 'Humanities',
      department: 'Faculty of History',
      moduleCode: 'HIST-204',
      moduleTitle: 'Imperial Diplomacy',
      level: 'UG Prelims (Year 1)',
      status: 'Active Matriculated',
      engagementLabel: 'Diagnostic Review',
      engagementPct: 48,
      engagementDetail: 'Sub-threshold',
      tutor: 'Dr. H. Trevor-Roper',
      matriculationYear: 'Michaelmas 2024 (Cohort 26)',
    },
    {
      id: 'OX-729015',
      name: 'Dr. Priya Ramachandran',
      email: 'priya.ramachandran@sjc.ox.ac.uk',
      college: "St John's College",
      matriculationId: 'OX-729015',
      division: 'Medical Sciences',
      department: 'Clinical Medicine',
      moduleCode: 'BIO-410',
      moduleTitle: 'Genomic Medicine',
      level: 'DPhil Candidate',
      status: 'Active Matriculated',
      engagementLabel: 'Exceptional (100%)',
      engagementPct: 100,
      engagementDetail: '42 Queries',
      tutor: 'Prof. S. Bhattacharya',
      matriculationYear: 'Michaelmas 2021 (Cohort 23)',
    },
    {
      id: 'OX-640192',
      name: 'Julian Sterling-Cross',
      email: 'julian.sterling-cross@magd.ox.ac.uk',
      college: 'Magdalen College',
      matriculationId: 'OX-640192',
      division: 'Humanities',
      department: 'Faculty of Philosophy',
      moduleCode: 'PHIL-101',
      moduleTitle: 'Formal Logic & Dialectic',
      level: 'UG Finals (Year 2)',
      status: 'Active Matriculated',
      engagementLabel: 'Stable (84%)',
      engagementPct: 84,
      engagementDetail: '2 Actioned',
      tutor: 'Dr. A. Kenny',
      matriculationYear: 'Michaelmas 2023 (Cohort 25)',
    },
    {
      id: 'OX-518290',
      name: 'Feng Wei',
      email: 'feng.wei@trinity.ox.ac.uk',
      college: 'Trinity College',
      matriculationId: 'OX-518290',
      division: 'MPLS',
      department: 'Mathematical Institute',
      moduleCode: 'MATH-210',
      moduleTitle: 'Linear Algebra',
      level: 'MSt Candidate',
      status: 'Active Matriculated',
      engagementLabel: 'Optimal (92%)',
      engagementPct: 92,
      engagementDetail: '0 Flags',
      tutor: 'Prof. R. Penrose',
      matriculationYear: 'Michaelmas 2024 (Cohort 26)',
    },
    {
      id: 'OX-439201',
      name: 'Beatrice de Montfort',
      email: 'beatrice.demontfort@new.ox.ac.uk',
      college: 'New College',
      matriculationId: 'OX-439201',
      division: 'Social Sciences',
      department: 'Faculty of Law',
      moduleCode: 'LAW-105',
      moduleTitle: 'Jurisprudence',
      level: 'UG Finals (Year 3)',
      status: 'Active Matriculated',
      engagementLabel: 'Pre-Class Inactive',
      engagementPct: 55,
      engagementDetail: 'Missed 2',
      tutor: 'Prof. H.L.A. Hart',
      matriculationYear: 'Michaelmas 2022 (Cohort 24)',
    },
    {
      id: 'OX-382910',
      name: 'Tarik Al-Mansoor',
      email: 'tarik.almansoor@wadham.ox.ac.uk',
      college: 'Wadham College',
      matriculationId: 'OX-382910',
      division: 'MPLS',
      department: 'Computer Science',
      moduleCode: 'CS-301',
      moduleTitle: 'Distributed Systems',
      level: 'UG Prelims (Year 1)',
      status: 'Active Matriculated',
      engagementLabel: 'High Mastery (95%)',
      engagementPct: 95,
      engagementDetail: 'Problem Set',
      tutor: 'Dr. C.A.R. Hoare',
      matriculationYear: 'Michaelmas 2024 (Cohort 26)',
    },
    {
      id: 'OX-291048',
      name: 'Eleanor Finchley-Smith',
      email: 'eleanor.finchleysmith@lmh.ox.ac.uk',
      college: 'Lady Margaret Hall',
      matriculationId: 'OX-291048',
      division: 'Humanities',
      department: 'English Faculty',
      moduleCode: 'ENG-102',
      moduleTitle: 'Old English Literature',
      level: 'UG Finals (Year 2)',
      status: 'Suspended (Leave)',
      engagementLabel: 'Interrupted Term',
      engagementPct: 15,
      engagementDetail: 'Michaelmas',
      tutor: 'Dr. J.R.R. Tolkien',
      matriculationYear: 'Michaelmas 2023 (Cohort 25)',
    },
  ];

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    if (val.toLowerCase().includes('kowalski')) {
      setLensState('no-search');
    } else if (val.trim().length === 0 && lensState === 'no-search') {
      setLensState('populated');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setLensState('populated');
  };

  const removeFilter = (filterToRemove: string) => {
    const updated = activeFilters.filter((f) => f !== filterToRemove);
    setActiveFilters(updated);
    if (updated.length === 0) {
      setLensState('no-filter');
    }
  };

  const resetFilters = () => {
    setActiveFilters([
      'Faculty: All Active',
      'Status: Active Matriculated',
      'Term: Michaelmas 2024',
    ]);
    setLensState('populated');
  };

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const columns: Column<StudentRecord>[] = [
    {
      header: '',
      className: 'w-10 pl-5 pr-3',
      accessor: (row) => (
        <div onClick={(e) => toggleCheck(row.id, e)}>
          <input
            checked={!!checkedIds[row.id]}
            className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            onChange={() => {}}
            type="checkbox"
          />
        </div>
      ),
    },
    {
      header: 'Student & College',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-serif text-[15px] text-primary font-semibold group-hover:underline">
            {row.name}
          </span>
          <span className="text-[12px] text-on-surface-variant/75 font-normal">{row.college} • {row.email}</span>
        </div>
      ),
    },
    {
      header: 'Matriculation ID',
      accessor: (row) => <span className="font-mono text-[12px] text-on-surface-variant/80">{row.matriculationId}</span>,
    },
    {
      header: 'Faculty & Division',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-on-surface text-[13px]">{row.division}</span>
          <span className="text-[12px] text-on-surface-variant/75">{row.department}</span>
        </div>
      ),
    },
    {
      header: 'Department / Module',
      accessor: (row) => (
        <div>
          <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-mono">
            {row.moduleCode}
          </span>
          <div className="text-[12px] text-on-surface-variant/75 mt-0.5 truncate max-w-[150px]">{row.moduleTitle}</div>
        </div>
      ),
    },
    {
      header: 'Level',
      accessor: (row) => <span className="text-[13px] text-on-surface-variant/80">{row.level}</span>,
    },
    {
      header: 'Enrollment Status',
      accessor: (row) => (
        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-on-surface">
          <span
            className={`w-2 h-2 rounded-full ${
              row.status === 'Active Matriculated' ? 'bg-emerald-600' : 'bg-amber-600'
            }`}
          ></span>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Engagement Snapshot',
      accessor: (row) => (
        <div className="flex flex-col gap-1 max-w-[180px]">
          <div className="flex items-center justify-between text-[11px]">
            <span
              className={`font-medium ${
                row.engagementPct >= 90
                  ? 'text-emerald-800'
                  : row.engagementPct >= 70
                  ? 'text-primary'
                  : 'text-amber-800'
              }`}
            >
              {row.engagementLabel}
            </span>
            <span className="text-outline">{row.engagementDetail}</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${
                row.engagementPct >= 90
                  ? 'bg-emerald-700'
                  : row.engagementPct >= 70
                  ? 'bg-primary'
                  : 'bg-amber-600'
              }`}
              style={{ width: `${row.engagementPct}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      header: 'Supervision',
      className: 'text-right pr-6 pl-4',
      accessor: (row) => (
        <button
          className="inline-flex items-center gap-1 text-primary hover:text-secondary font-ui-functional text-[12px] font-medium transition-colors cursor-pointer"
          onClick={() => setSelectedStudent(row)}
          type="button"
        >
          <span>Dossier</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl flex flex-col w-full font-body-md text-on-surface">
        {/* Page Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-[var(--spacing-gutter)] pb-4 border-b border-outline-variant/20">
          <div className="flex-1 w-full min-w-0 max-w-3xl">
            <div className="flex items-center gap-2 font-label-caps text-label-caps uppercase tracking-widest text-secondary font-medium text-[11px] flex-wrap">
              <span>University of Oxford</span>
              <span className="text-outline-variant/60">•</span>
              <span>Academic Registry</span>
              <span className="text-outline-variant/60">•</span>
              <span>People & Access</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold leading-tight break-words">Students</h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 max-w-2xl leading-relaxed mt-1">
              View enrolled students and monitor their real-time collegiate engagement across academic divisions, faculties, and tutorial supervisions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full xl:w-auto pt-2 xl:pt-0">
            <button
              className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-ui-functional text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer border border-outline-variant/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
              <span className="whitespace-nowrap">Export Registry Dossier</span>
            </button>
            <button
              className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer font-medium"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span className="whitespace-nowrap">Add Enrolled Student</span>
            </button>
          </div>
        </div>

        {/* Registry Summary KPI Quartet */}
        <section aria-label="Registry Stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-gutter)] mb-[var(--spacing-gutter)]">
          <KpiTile
            icon="account_balance"
            label="Total Matriculated"
            subtext={
              <div className="font-ui-functional text-[12px] text-on-surface-variant/75 flex items-center gap-1">
                <span className="text-primary font-semibold">+2.4%</span>
                <span>vs 2023 cohort • 38 colleges</span>
              </div>
            }
            value="18,420"
          />
          <KpiTile
            icon="auto_stories"
            label="Active Engagement"
            subtext={
              <div className="font-ui-functional text-[12px] text-on-surface-variant/75">
                Interacting with Lexi syllabi or supervisions
              </div>
            }
            value="94.8%"
          />
          <KpiTile
            icon="flag"
            label="Tutorial Interventions"
            subtext={
              <div className="font-ui-functional text-[12px] text-on-surface-variant/75 flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container text-[10px] font-medium">
                  Priority
                </span>
                <span>Pending supervisory review</span>
              </div>
            }
            value="142"
          />
          <KpiTile
            icon="school"
            label="Cohort Division"
            subtext={
              <div className="font-ui-functional text-[12px] text-on-surface-variant/75 flex items-center justify-between">
                <span>11,840 UG</span>
                <span className="text-outline-variant/60">•</span>
                <span>6,580 PG (MSt/DPhil)</span>
              </div>
            }
            value="11.8k / 6.6k"
          />
        </section>

        {/* Search, Filters & Controls Container */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/25 p-5 flex flex-col gap-4 mb-[var(--spacing-gutter)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-sm items-center">
            {/* Global Search Field */}
            <div className="lg:col-span-4 relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[20px] text-outline">
                search
              </span>
              <input
                className="w-full pl-10 pr-9 py-2.5 bg-surface-container-low rounded-lg font-ui-functional text-ui-functional text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary transition-all"
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search student, Oxford SSO, or ID..."
                type="text"
                value={searchQuery}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface cursor-pointer"
                  onClick={clearSearch}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Dropdown Filters */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
              <div className="relative">
                <select className="w-full appearance-none bg-surface-container-low text-on-surface font-ui-functional text-[13px] py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                  <option value="all">All Faculties</option>
                  <option value="mpls">MPLS Division</option>
                  <option value="humanities">Humanities</option>
                  <option value="medsci">Medical Sciences</option>
                  <option value="socsci">Social Sciences</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
              <div className="relative">
                <select className="w-full appearance-none bg-surface-container-low text-on-surface font-ui-functional text-[13px] py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                  <option value="all">All Departments</option>
                  <option value="eng">Engineering Science</option>
                  <option value="hist">Faculty of History</option>
                  <option value="clinmed">Clinical Medicine</option>
                  <option value="phil">Faculty of Philosophy</option>
                  <option value="math">Mathematical Institute</option>
                  <option value="law">Faculty of Law</option>
                  <option value="cs">Computer Science</option>
                  <option value="englit">English Faculty</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
              <div className="relative">
                <select className="w-full appearance-none bg-surface-container-low text-on-surface font-ui-functional text-[13px] py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                  <option value="all">All Levels</option>
                  <option value="prelims">UG Prelims (Year 1)</option>
                  <option value="finals">UG Finals (Years 2-4)</option>
                  <option value="pgt">Taught PG (MSt/MSc)</option>
                  <option value="pgr">Research PG (DPhil)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
              <div className="relative">
                <select className="w-full appearance-none bg-surface-container-low text-on-surface font-ui-functional text-[13px] py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer">
                  <option value="all">All Statuses</option>
                  <option selected value="active">Active Matriculated</option>
                  <option value="suspended">Suspended / Leave</option>
                  <option value="probationary">Probationary Research</option>
                  <option value="exam">Final Exam Leave</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>
          </div>

          {/* Active Constraint Chips */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2 border-t border-outline-variant/30">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label-caps text-[11px] uppercase tracking-wider text-outline">Active Constraints:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-ui-functional text-[12px]"
                >
                  <span>{filter}</span>
                  <button
                    aria-label={`Remove filter ${filter}`}
                    className="hover:text-error text-outline cursor-pointer"
                    onClick={() => removeFilter(filter)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </span>
              ))}
              {activeFilters.length > 0 && (
                <button
                  className="text-secondary hover:text-on-secondary-container font-ui-functional text-[12px] underline ml-1 cursor-pointer"
                  onClick={resetFilters}
                  type="button"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-ui-functional text-[13px]">
              <button className="px-2.5 py-1.5 rounded-lg hover:bg-surface-container flex items-center gap-1 text-on-surface-variant cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[16px]">view_column</span>
                <span>Columns</span>
              </button>
              <span className="text-outline-variant">|</span>
              <button className="px-2.5 py-1.5 rounded-lg hover:bg-surface-container flex items-center gap-1 text-on-surface-variant cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[16px]">density_medium</span>
                <span>Comfort</span>
              </button>
              <span className="text-outline-variant">|</span>
              <button className="px-2.5 py-1.5 rounded-lg hover:bg-surface-container flex items-center gap-1 text-on-surface-variant cursor-pointer" type="button">
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* STATE VIEW 1: POPULATED */}
        {lensState === 'populated' && (
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            <DataTable
              columns={columns}
              data={studentsData}
              keyExtractor={(row) => row.id}
            />

            {/* Pagination Strip */}
            <div className="p-space-md border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-space-md bg-surface-container-lowest">
              <div className="flex items-center gap-space-md text-on-surface-variant font-ui-functional text-[13px]">
                <span>
                  Showing <strong className="text-primary font-semibold">1–8</strong> of{' '}
                  <strong className="text-primary font-semibold">18,420</strong> matriculated students
                </span>
                <span className="text-outline-variant hidden md:inline">|</span>
                <div className="hidden md:flex items-center gap-1.5">
                  <span>Rows per page:</span>
                  <select className="bg-surface-container-low px-2 py-1 rounded border border-outline-variant/40 text-on-surface text-[12px] focus:outline-none">
                    <option selected>8</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-outline hover:text-on-surface hover:bg-surface-container-low font-ui-functional text-[13px] disabled:opacity-40 transition-colors flex items-center gap-1 cursor-not-allowed"
                  disabled
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  Previous
                </button>
                <div className="flex items-center gap-1 font-ui-functional text-[13px]">
                  <span className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-semibold">1</span>
                  <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center cursor-pointer" type="button">2</button>
                  <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center cursor-pointer" type="button">3</button>
                  <span className="px-1 text-outline">…</span>
                  <button className="w-8 h-8 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center cursor-pointer" type="button">2,303</button>
                </div>
                <button
                  className="px-3 py-1.5 rounded-lg border border-outline-variant/40 text-on-surface hover:bg-surface-container-low font-ui-functional text-[13px] transition-colors flex items-center gap-1 cursor-pointer"
                  type="button"
                >
                  Next
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
                <div className="hidden lg:flex items-center gap-1.5 ml-2 pl-2 border-l border-outline-variant/30 text-[12px] font-ui-functional text-on-surface-variant">
                  <span>Go to:</span>
                  <input
                    className="w-10 px-1.5 py-1 text-center bg-surface-container-low rounded border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="1"
                    type="text"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STATE VIEW 2: EMPTY */}
        {lensState === 'empty' && (
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-16 text-center flex flex-col items-center justify-center my-8">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-secondary mb-space-md">
              <span className="material-symbols-outlined text-[32px]">history_edu</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-serif">Academic Registry Awaiting Matriculation</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2">
              No students are currently catalogued in the Michaelmas 2024 ledger. Run an InCommon directory pull or import the University Student Information System (SITS) CSV batch.
            </p>
            <div className="flex items-center gap-space-sm mt-6">
              <button
                className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional transition-colors flex items-center gap-2 cursor-pointer"
                onClick={() => setLensState('populated')}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">sync</span>
                Run SITS SIS Sync
              </button>
              <button
                className="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface font-ui-functional text-ui-functional transition-colors cursor-pointer"
                type="button"
              >
                Upload CSV Register
              </button>
            </div>
          </div>
        )}

        {/* STATE VIEW 3: NO SEARCH RESULTS */}
        {lensState === 'no-search' && (
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-16 text-center flex flex-col items-center justify-center my-8">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline mb-space-md">
              <span className="material-symbols-outlined text-[32px]">search_off</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-serif">No Students Matching "Kowalski-Zimmerman"</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2">
              We couldn't locate any student record matching this query in the active Oxford registry. Check for alternate spellings, or search directly by Oxford SSO username or matriculation ID.
            </p>
            <div className="flex items-center gap-space-sm mt-6">
              <button
                className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional transition-colors flex items-center gap-2 cursor-pointer"
                onClick={clearSearch}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">backspace</span>
                Clear Search Query
              </button>
              <button
                className="px-4 py-2.5 rounded-lg bg-surface-container text-on-surface font-ui-functional text-ui-functional hover:bg-surface-container-highest transition-colors cursor-pointer"
                type="button"
              >
                Query Suspended / Alumni Archive
              </button>
            </div>
          </div>
        )}

        {/* STATE VIEW 4: NO FILTER MATCH */}
        {lensState === 'no-filter' && (
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-16 text-center flex flex-col items-center justify-center my-8">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-secondary mb-space-md">
              <span className="material-symbols-outlined text-[32px]">filter_list_off</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-primary font-serif">Zero Match for Current Filter Parameters</h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2">
              No registered student satisfies all 5 active constraints simultaneously (Faculty: Medical Sciences • Level: UG Prelims • Status: Suspended).
            </p>
            <div className="flex items-center gap-space-sm mt-6">
              <button
                className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional transition-colors flex items-center gap-2 cursor-pointer"
                onClick={resetFilters}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* STATE VIEW 5: LOADING */}
        {lensState === 'loading' && (
          <div className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-6 overflow-hidden flex flex-col gap-4 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 animate-pulse">
              <div className="h-4 bg-surface-container-high rounded w-48"></div>
              <div className="h-4 bg-surface-container-high rounded w-24"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="h-14 bg-surface-container-low rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="flex justify-center items-center gap-2 py-6 text-on-surface-variant font-ui-functional text-ui-functional">
              <span className="material-symbols-outlined animate-spin text-secondary text-[20px]">sync</span>
              <span>Synchronizing with InCommon Identity Federation & Oxford Kerberos Directory...</span>
            </div>
          </div>
        )}

        {/* Student Dossier Detail Side-Panel Drawer Modal */}
        {selectedStudent && (
          <div
            className="fixed inset-0 z-50 bg-ink-black/40 backdrop-blur-sm flex justify-end transition-opacity duration-300"
            onClick={() => setSelectedStudent(null)}
          >
            <div
              className="w-full max-w-xl h-full bg-surface-bright shadow-2xl p-8 flex flex-col justify-between overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-space-lg">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-outline-variant/30 pb-4">
                  <div>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">
                      Oxford Student Profile & Supervisions
                    </span>
                    <h2 className="font-headline-md text-headline-md text-primary font-serif mt-1">
                      {selectedStudent.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-ui-functional text-[13px]">
                      <span className="font-medium text-primary">{selectedStudent.college}</span>
                      <span className="text-outline-variant">•</span>
                      <span className="font-mono">{selectedStudent.matriculationId}</span>
                    </div>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface transition-colors cursor-pointer"
                    onClick={() => setSelectedStudent(null)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                {/* Academic Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 bg-surface-container-low p-4 rounded-xl">
                  <div>
                    <div className="font-label-caps text-[11px] uppercase tracking-wider text-outline">Division / Faculty</div>
                    <div className="font-ui-functional text-[14px] text-primary font-semibold mt-0.5">
                      {selectedStudent.division} • {selectedStudent.department}
                    </div>
                  </div>
                  <div>
                    <div className="font-label-caps text-[11px] uppercase tracking-wider text-outline">Tutor / Senior Fellow</div>
                    <div className="font-ui-functional text-[14px] text-primary font-semibold mt-0.5">
                      {selectedStudent.tutor || 'Prof. C. Ravenscroft, FRS'}
                    </div>
                  </div>
                  <div>
                    <div className="font-label-caps text-[11px] uppercase tracking-wider text-outline">Matriculation Year</div>
                    <div className="font-ui-functional text-[14px] text-on-surface mt-0.5">
                      {selectedStudent.matriculationYear || 'Michaelmas 2022 (Cohort 24)'}
                    </div>
                  </div>
                  <div>
                    <div className="font-label-caps text-[11px] uppercase tracking-wider text-outline">InCommon SSO Status</div>
                    <div className="font-ui-functional text-[14px] text-emerald-800 font-semibold mt-0.5 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Authenticated via Kerberos
                    </div>
                  </div>
                </div>

                {/* Academic Engagement Deep Dive */}
                <div className="flex flex-col gap-2">
                  <h4 className="font-headline-sm text-[18px] text-primary font-serif">Lexi Intelligence Engagement Dossier</h4>
                  <p className="font-body-md text-[14px] text-on-surface-variant">
                    Weekly supervision reading analytics, automated formative essay feedback, and tutorial dialogue queries.
                  </p>
                  <div className="space-y-3 mt-2">
                    <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <div className="font-ui-functional text-[13px] font-semibold text-primary">Syllabus Synthesis Rate</div>
                        <div className="text-[12px] text-on-surface-variant">14/14 core readings integrated with citation proofs</div>
                      </div>
                      <span className="font-headline-sm text-[16px] font-bold text-emerald-800">
                        {selectedStudent.engagementPct}%
                      </span>
                    </div>
                    <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <div className="font-ui-functional text-[13px] font-semibold text-primary">Formative Problem Sets</div>
                        <div className="text-[12px] text-on-surface-variant">
                          {selectedStudent.moduleCode} {selectedStudent.moduleTitle} Module
                        </div>
                      </div>
                      <span className="font-headline-sm text-[16px] font-bold text-primary">Alpha (1st Class)</span>
                    </div>
                    <div className="p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 flex items-center justify-between">
                      <div>
                        <div className="font-ui-functional text-[13px] font-semibold text-primary">Tutorial Supervision Flags</div>
                        <div className="text-[12px] text-on-surface-variant">Pending academic review by College Senior Tutor</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-label-caps text-[10px] font-semibold">
                        0 Action Required
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
                <button
                  className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-ui-functional text-ui-functional transition-colors cursor-pointer"
                  onClick={() => setSelectedStudent(null)}
                  type="button"
                >
                  Close Preview
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  type="button"
                >
                  <span>Full Academic Profile</span>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <DevStateLens
        activeId={lensState}
        label="Students State Lens"
        onSelect={(id) => setLensState(id as 'populated' | 'empty' | 'no-search' | 'no-filter' | 'loading')}
        options={[
          { id: 'populated', label: '1. Populated (18,420 Enrolled)' },
          { id: 'empty', label: '2. Empty Institution' },
          { id: 'no-search', label: '3. No Search Match' },
          { id: 'no-filter', label: '4. Zero Filter Match' },
          { id: 'loading', label: '5. Directory Sync' },
        ]}
      />
    </>
  );
}
