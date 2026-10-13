'use client';

import React, { useState } from 'react';
import { DevStateLens } from '@/components/ui/DevStateLens';
import { KpiTile } from '@/components/ui/KpiTile';
import { DataTable, Column } from '@/components/ui/DataTable';

interface CourseRecord {
  code: string;
  title: string;
  subtitle: string;
  department: string;
  division: string;
  leadName: string;
  leadInitials: string;
  college: string;
  enrolledCount: number;
  enrolledDetail: string;
  enrolledPct: number;
  status: 'Active' | 'Upcoming' | 'Archived';
  masteryPct: string;
  masteryStatus: string;
  conceptNodes: number;
  activeInterventions: number;
  lectureCadence: string;
  hallLocation: string;
  supervisingRatio: string;
  socraticEnabled: boolean;
}

export default function CoursesPage() {
  const [lensState, setLensState] = useState<'populated-drawer' | 'populated-table' | 'empty-directory' | 'filtered-zero' | 'loading-state'>('populated-drawer');
  const [activeRole, setActiveRole] = useState<string>('admin');
  const [searchQuery, setSearchQuery] = useState<string>('ENG-320');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('ENG-320');
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'Query: "ENG-320"',
    'Division: MPLS',
    'Status: Active',
  ]);

  const coursesData: CourseRecord[] = [
    {
      code: 'ENG-320',
      title: 'Advanced Fluid Dynamics',
      subtitle: 'Navier-Stokes solutions & boundary layer turbulence',
      department: 'Dept. of Engineering Science',
      division: 'MPLS Division',
      leadName: 'Prof. Alistair Montgomery',
      leadInitials: 'AM',
      college: 'Christ Church',
      enrolledCount: 412,
      enrolledDetail: '14 tutorial groups',
      enrolledPct: 80,
      status: 'Active',
      masteryPct: '61.5%',
      masteryStatus: 'Needs Review',
      conceptNodes: 48,
      activeInterventions: 34,
      lectureCadence: 'Tues & Thurs • 10:00 AM',
      hallLocation: 'Exam Schools Hall 4',
      supervisingRatio: '1:4 Fellow-to-Undergrad',
      socraticEnabled: true,
    },
    {
      code: 'HIST-204',
      title: 'Late Imperial Diplomacy (1870–1914)',
      subtitle: 'Bismarckian alliances & Great Power rivalry',
      department: 'Faculty of History',
      division: 'Humanities Division',
      leadName: 'Dr. Clara Sterling',
      leadInitials: 'CS',
      college: 'Balliol College',
      enrolledCount: 285,
      enrolledDetail: '8 college seminars',
      enrolledPct: 66,
      status: 'Active',
      masteryPct: '88.2%',
      masteryStatus: 'Exemplary',
      conceptNodes: 36,
      activeInterventions: 12,
      lectureCadence: 'Mon & Wed • 11:00 AM',
      hallLocation: 'Schools Lecture Room 2',
      supervisingRatio: '1:6 Fellow-to-Undergrad',
      socraticEnabled: true,
    },
    {
      code: 'BIO-410',
      title: 'Cellular Signalling & Genomic Medicine',
      subtitle: 'Phosphorylation cascades & CRISPR therapies',
      department: 'Dept. of Biochemistry',
      division: 'Medical Sciences',
      leadName: 'Prof. Rowan Thorne',
      leadInitials: 'RT',
      college: 'Magdalen College',
      enrolledCount: 194,
      enrolledDetail: '6 wet labs',
      enrolledPct: 50,
      status: 'Upcoming',
      masteryPct: '74.1%',
      masteryStatus: 'Nominal',
      conceptNodes: 52,
      activeInterventions: 8,
      lectureCadence: 'Wed & Fri • 09:00 AM',
      hallLocation: 'Medical Sciences Teaching Centre',
      supervisingRatio: '1:2 Fellow-to-Undergrad',
      socraticEnabled: true,
    },
    {
      code: 'PHIL-101',
      title: 'Formal Logic & Dialectic',
      subtitle: 'Fregean semantics, Gödel completeness & proof theory',
      department: 'Faculty of Philosophy',
      division: 'Humanities Division',
      leadName: 'Dr. Aris Thorne',
      leadInitials: 'AT',
      college: 'New College',
      enrolledCount: 520,
      enrolledDetail: '22 college tutorials',
      enrolledPct: 100,
      status: 'Active',
      masteryPct: '82.9%',
      masteryStatus: 'Exemplary',
      conceptNodes: 42,
      activeInterventions: 18,
      lectureCadence: 'Tues & Thurs • 14:00 PM',
      hallLocation: 'Radcliffe Humanities Auditorium',
      supervisingRatio: '1:4 Fellow-to-Undergrad',
      socraticEnabled: true,
    },
    {
      code: 'MATH-210',
      title: 'Linear Algebra & Spectral Theory',
      subtitle: 'Eigenvalue decompositions and infinite dimensional spaces',
      department: 'Mathematical Institute',
      division: 'MPLS Division',
      leadName: 'Prof. Keith Sutherland',
      leadInitials: 'KS',
      college: "St John's College",
      enrolledCount: 680,
      enrolledDetail: 'Prelims cohort',
      enrolledPct: 100,
      status: 'Active',
      masteryPct: '70.4%',
      masteryStatus: 'Nominal',
      conceptNodes: 60,
      activeInterventions: 28,
      lectureCadence: 'Mon, Wed, Fri • 10:00 AM',
      hallLocation: 'Mathematical Institute L1',
      supervisingRatio: '1:8 Fellow-to-Undergrad',
      socraticEnabled: false,
    },
    {
      code: 'LAW-105',
      title: 'Constitutional Jurisprudence',
      subtitle: 'Parliamentary sovereignty, administrative review',
      department: 'Faculty of Law',
      division: 'Social Sciences',
      leadName: 'Baroness Helena Cross',
      leadInitials: 'HC',
      college: 'Trinity College',
      enrolledCount: 310,
      enrolledDetail: '10 collegiate moot courts',
      enrolledPct: 75,
      status: 'Active',
      masteryPct: '91.2%',
      masteryStatus: 'Exemplary',
      conceptNodes: 38,
      activeInterventions: 6,
      lectureCadence: 'Tues & Fri • 11:00 AM',
      hallLocation: 'Gulbenkian Lecture Theatre',
      supervisingRatio: '1:4 Fellow-to-Undergrad',
      socraticEnabled: true,
    },
    {
      code: 'COMP-501',
      title: 'Automated Reasoning & Proofs',
      subtitle: 'SAT/SMT solvers and Coq interactive theorem proving',
      department: 'Dept. of Computer Science',
      division: 'MPLS Division',
      leadName: 'Dr. Vivek Ramanujan',
      leadInitials: 'VR',
      college: 'Wadham College',
      enrolledCount: 84,
      enrolledDetail: 'MSc advanced module',
      enrolledPct: 25,
      status: 'Archived',
      masteryPct: '64.0%',
      masteryStatus: 'In Review',
      conceptNodes: 30,
      activeInterventions: 4,
      lectureCadence: 'Thurs • 14:00 PM',
      hallLocation: 'Wolfson Building Room 101',
      supervisingRatio: '1:3 Fellow-to-Undergrad',
      socraticEnabled: true,
    },
    {
      code: 'ARCH-102',
      title: 'Classical Greek Epigraphy',
      subtitle: 'Attic inscriptions and monetary policy of the Delian League',
      department: 'Faculty of Classics',
      division: 'Humanities Division',
      leadName: 'Prof. Daphne Sterling',
      leadInitials: 'DS',
      college: 'Merton College',
      enrolledCount: 118,
      enrolledDetail: 'Ashmolean collection practicum',
      enrolledPct: 33,
      status: 'Active',
      masteryPct: '79.6%',
      masteryStatus: 'Nominal',
      conceptNodes: 24,
      activeInterventions: 5,
      lectureCadence: 'Wed • 14:00 PM',
      hallLocation: 'Ashmolean Museum Seminar Room',
      supervisingRatio: '1:2 Fellow-to-Undergrad',
      socraticEnabled: true,
    },
  ];

  const selectedCourse = coursesData.find((c) => c.code === selectedCourseCode) || coursesData[0];

  const selectCourse = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
    if (!isDrawerOpen) {
      setIsDrawerOpen(true);
    }
  };

  const removeFilter = (filterToRemove: string) => {
    const updated = activeFilters.filter((f) => f !== filterToRemove);
    setActiveFilters(updated);
    if (updated.length === 0) {
      setLensState('filtered-zero');
    }
  };

  const resetFilters = () => {
    setActiveFilters([
      'Query: "ENG-320"',
      'Division: MPLS',
      'Status: Active',
    ]);
    setSearchQuery('ENG-320');
    setLensState('populated-drawer');
  };

  const columns: Column<CourseRecord>[] = [
    {
      header: 'Course Code',
      accessor: (row) => {
        const isSelected = row.code === selectedCourseCode;
        return (
          <div className="flex items-center gap-space-xs">
            <div
              className={`w-1.5 h-6 rounded-full ${
                isSelected ? 'bg-primary' : 'bg-transparent group-hover:bg-outline'
              }`}
            ></div>
            <span className="font-mono font-bold text-primary">{row.code}</span>
          </div>
        );
      },
    },
    {
      header: 'Curriculum Title',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-headline-sm text-[16px] text-primary group-hover:text-secondary transition-colors font-semibold">
            {row.title}
          </span>
          <span className="text-outline text-xs">{row.subtitle}</span>
        </div>
      ),
    },
    {
      header: 'Division & Department',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-on-surface font-medium">{row.department}</span>
          <span className="text-outline text-xs">{row.division}</span>
        </div>
      ),
    },
    {
      header: 'Senior Fellow / Lecturer',
      accessor: (row) => (
        <div className="flex items-center gap-space-xs">
          <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
            {row.leadInitials}
          </div>
          <div className="flex flex-col">
            <span className="text-on-surface font-medium">{row.leadName}</span>
            <span className="text-outline text-xs">{row.college}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Matriculation',
      accessor: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-on-surface font-semibold">{row.enrolledCount} students</span>
          <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${row.status === 'Upcoming' ? 'bg-secondary' : 'bg-primary'}`}
              style={{ width: `${row.enrolledPct}%` }}
            ></div>
          </div>
          <span className="text-outline text-[11px]">{row.enrolledDetail}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full font-label-caps text-[11px] uppercase font-bold ${
            row.status === 'Active'
              ? 'bg-surface-container text-primary'
              : row.status === 'Upcoming'
              ? 'bg-secondary-fixed text-on-secondary-fixed'
              : 'bg-surface-container-high text-outline'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === 'Active'
                ? 'bg-primary'
                : row.status === 'Upcoming'
                ? 'bg-secondary'
                : 'bg-outline'
            }`}
          ></span>
          {row.status}
        </span>
      ),
    },
    {
      header: 'Dossier',
      className: 'text-right',
      accessor: (row) => (
        <button
          className="text-primary hover:text-secondary cursor-pointer"
          onClick={() => selectCourse(row.code)}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl flex flex-col w-full font-body-md text-on-surface">
        {/* Top Context Meta-Bar & Simulated State Switcher */}
        <section className="w-full bg-surface-container-lowest shadow-[0_1px_0_rgba(199,199,185,0.3)] p-space-sm rounded-lg mb-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex items-center gap-space-sm text-on-surface-variant font-ui-functional text-ui-functional flex-wrap">
            <span className="material-symbols-outlined text-secondary text-[20px]">account_balance</span>
            <span className="font-semibold text-primary">University of Oxford</span>
            <span className="text-outline">•</span>
            <span>Faculty Senate Academic Console</span>
            <span className="text-outline">•</span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container font-label-caps text-label-caps uppercase text-secondary">
              Michaelmas Term 2024–25 • W7
            </span>
          </div>
        </section>

        {/* Screen Header */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-[var(--spacing-gutter)] pb-4 border-b border-outline-variant/20">
          <div className="flex flex-col gap-1 min-w-0 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
              <span className="font-label-caps text-[11px] uppercase tracking-widest text-secondary font-medium">
                University of Oxford • Academic Registry • Curricular Architecture
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-serif text-primary font-bold tracking-tight leading-tight">
              Collegiate Courses & Faculties
            </h1>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed mt-1">
              View and govern collegiate courses, faculty ownership, syllabus graph synthesis, and active student matriculation across Oxford’s academic divisions.
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full lg:w-auto">
            <button
              className="flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container font-ui-functional text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-outline-variant/20"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
              <span className="whitespace-nowrap">Export Curricular Catalog</span>
            </button>
            <button
              className="flex-1 sm:flex-none justify-center px-3.5 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-ui-functional text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 cursor-pointer font-medium"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="whitespace-nowrap">Add Academic Course</span>
            </button>
          </div>
        </section>

        {/* KPI Summary Row using KpiTile */}
        <section aria-label="Curricular Stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-gutter)] mb-[var(--spacing-gutter)]">
          <KpiTile
            icon="menu_book"
            label="Total Curricula"
            subtext={
              <div className="font-ui-functional text-[12px] text-on-surface-variant/75">
                Across 38 sovereign constituent colleges
              </div>
            }
            trend="+14 this term"
            trendDirection="up"
            value="412"
          />
          <KpiTile
            icon="schema"
            label="Active Ingested"
            subtext={
              <div className="font-ui-functional text-[12px] text-on-surface-variant/75">
                Parsed into conceptual knowledge graphs
              </div>
            }
            trend="93.7%"
            trendDirection="up"
            value="386"
          />
          <KpiTile
            icon="groups"
            label="Active Enrollment"
            subtext={
              <div className="font-ui-functional text-[12px] text-on-surface-variant/75">
                Prelims, Finals & Postgraduate research
              </div>
            }
            trend="Matriculated"
            trendDirection="neutral"
            value="18,420"
          />
          <KpiTile
            icon="psychology_alt"
            label="Formative Interventions"
            subtext={
              <div className="font-ui-functional text-[12px] text-on-surface-variant/75">
                Flagged across active tutorial sequences
              </div>
            }
            trend="Active"
            trendDirection="neutral"
            value="142"
          />
        </section>

        {/* Filter & Query Command Bar */}
        <section className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl p-5 shadow-xs flex flex-col gap-4 mb-[var(--spacing-gutter)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
            <div className="md:col-span-5 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                search
              </span>
              <input
                className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-bright shadow-sm transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course code, syllabus title, or fellow..."
                type="text"
                value={searchQuery}
              />
              {searchQuery && (
                <button
                  className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary text-[18px] cursor-pointer"
                  onClick={() => setSearchQuery('')}
                  type="button"
                >
                  close
                </button>
              )}
            </div>
            <div className="md:col-span-7 flex flex-wrap lg:flex-nowrap items-center gap-space-xs">
              <div className="relative w-full sm:w-auto flex-1">
                <select className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-ui-functional text-ui-functional shadow-sm focus:outline-none cursor-pointer">
                  <option>All Divisions (MPLS, Hum, Med, SocSci)</option>
                  <option selected>MPLS Division</option>
                  <option>Humanities Division</option>
                  <option>Medical Sciences Division</option>
                  <option>Social Sciences Division</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
              <div className="relative w-full sm:w-auto flex-1">
                <select className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-ui-functional text-ui-functional shadow-sm focus:outline-none cursor-pointer">
                  <option>All Departments</option>
                  <option selected>Engineering Science</option>
                  <option>History Faculty</option>
                  <option>Biochemistry</option>
                  <option>Philosophy Faculty</option>
                  <option>Law Faculty</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
              <div className="relative w-full sm:w-auto flex-1">
                <select className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-ui-functional text-ui-functional shadow-sm focus:outline-none cursor-pointer">
                  <option>All Statuses</option>
                  <option selected>Active Matriculated</option>
                  <option>Upcoming (Hilary '25)</option>
                  <option>Archived Curricula</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
              <button
                className="px-space-md py-2.5 rounded-lg bg-surface-container-highest text-primary hover:bg-surface-dim font-ui-functional text-ui-functional flex items-center gap-space-xs transition-colors whitespace-nowrap cursor-pointer"
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isDrawerOpen ? 'right_panel_close' : 'right_panel_open'}
                </span>
                <span>{isDrawerOpen ? 'Hide Dossier' : 'Open Dossier'}</span>
              </button>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-outline mr-1">Active Constraints:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-ui-functional text-ui-functional"
                >
                  <span>{filter}</span>
                  <button
                    aria-label={`Remove filter ${filter}`}
                    className="material-symbols-outlined text-[14px] hover:text-secondary cursor-pointer"
                    onClick={() => removeFilter(filter)}
                    type="button"
                  >
                    close
                  </button>
                </span>
              ))}
              {activeFilters.length > 0 && (
                <button
                  className="text-secondary hover:text-on-secondary-container font-ui-functional text-ui-functional underline ml-space-xs cursor-pointer"
                  onClick={resetFilters}
                  type="button"
                >
                  Reset Filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-space-sm text-outline font-ui-functional text-ui-functional">
              <span>
                Sort: <strong className="text-primary font-medium">Curricular Code (Asc)</strong>
              </span>
              <span className="material-symbols-outlined text-[18px] text-outline cursor-pointer hover:text-primary">
                swap_vert
              </span>
            </div>
          </div>
        </section>

        {/* STATE 1: POPULATED DRAWER / TABLE */}
        {(lensState === 'populated-drawer' || lensState === 'populated-table') && (
          <div className="flex flex-col xl:flex-row items-start gap-space-md w-full">
            {/* Table Area */}
            <div className="flex-1 w-full bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
              <DataTable
                columns={columns}
                data={coursesData}
                keyExtractor={(row) => row.code}
              />

              {/* Table Footer Pagination */}
              <div className="px-space-lg py-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md">
                <div className="flex items-center gap-space-md text-on-surface-variant font-ui-functional text-ui-functional">
                  <span>
                    Showing <strong className="text-primary font-bold">1–8</strong> of{' '}
                    <strong className="text-primary font-bold">412</strong> collegiate courses
                  </span>
                  <span className="text-outline">•</span>
                  <div className="flex items-center gap-1">
                    <span>Display:</span>
                    <select className="bg-surface-container-lowest px-2 py-1 rounded text-primary text-xs font-semibold focus:outline-none">
                      <option>8 rows</option>
                      <option>25 rows</option>
                      <option>50 rows</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-ui-functional text-ui-functional">
                  <button className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant disabled:opacity-50 cursor-not-allowed" disabled type="button">
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded bg-primary text-on-primary font-semibold" type="button">1</button>
                  <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface cursor-pointer" type="button">2</button>
                  <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface cursor-pointer" type="button">3</button>
                  <span className="px-1 text-outline">…</span>
                  <button className="w-8 h-8 rounded hover:bg-surface-container text-on-surface cursor-pointer" type="button">52</button>
                  <button className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant cursor-pointer" type="button">
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Course Detail Panel (Drawer) */}
            {isDrawerOpen && lensState === 'populated-drawer' && (
              <aside className="w-full xl:w-[420px] bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col gap-space-lg flex-shrink-0 transition-all duration-300 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-sm py-1 rounded bg-surface-container font-mono text-sm font-bold text-primary">
                      {selectedCourse.code}
                    </span>
                    <span className="inline-flex items-center gap-1 px-space-xs py-0.5 rounded bg-primary text-on-primary font-label-caps text-[10px] uppercase font-bold tracking-wider">
                      {selectedCourse.status} Matriculated
                    </span>
                  </div>
                  <button
                    className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-outline hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setIsDrawerOpen(false)}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <h2 className="font-headline-sm text-headline-sm text-primary leading-tight">
                    {selectedCourse.title}
                  </h2>
                  <p className="font-ui-functional text-xs text-secondary font-medium">
                    {selectedCourse.department} • {selectedCourse.division}
                  </p>
                </div>

                <div className="bg-surface-container-low rounded-lg p-space-md flex items-center gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-base flex-shrink-0">
                    {selectedCourse.leadInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-[10px] uppercase tracking-wider text-outline">Appointed Course Convenor</span>
                    <span className="font-ui-functional text-sm font-bold text-primary">
                      {selectedCourse.leadName} • {selectedCourse.college}
                    </span>
                    <span className="text-xs text-on-surface-variant">Senior Examiner & Fellow</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 pb-space-xs">
                  <span className="font-label-caps text-label-caps uppercase text-outline">Matriculated Cohort</span>
                  <span className="font-ui-functional text-ui-functional text-on-surface font-semibold">
                    Michaelmas Term 2024–25 • UG Finals • {selectedCourse.enrolledCount} Enrolled
                  </span>
                </div>

                <div className="flex flex-col gap-space-xs">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline">Academic Telemetry • Week 7</span>
                  <div className="grid grid-cols-2 gap-space-xs">
                    <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1">
                      <span className="text-xs text-on-surface-variant font-medium">Formative Mastery</span>
                      <span className="font-headline-sm text-[20px] text-secondary font-bold">
                        {selectedCourse.masteryPct}
                      </span>
                      <span className="text-[11px] text-error font-medium">{selectedCourse.masteryStatus}</span>
                    </div>
                    <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1">
                      <span className="text-xs text-on-surface-variant font-medium">Syllabus Concepts</span>
                      <span className="font-headline-sm text-[20px] text-primary font-bold">
                        {selectedCourse.conceptNodes} Nodes
                      </span>
                      <span className="text-[11px] text-primary font-medium">Graph Ingested</span>
                    </div>
                  </div>
                  <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">warning</span>
                      <span className="text-xs text-on-surface font-medium">Formative Interventions</span>
                    </div>
                    <span className="font-bold text-sm text-secondary">{selectedCourse.activeInterventions} Active</span>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-lg p-space-md flex flex-col gap-space-sm text-xs">
                  <div className="flex items-start justify-between">
                    <span className="text-outline">Lecture Cadence</span>
                    <span className="text-on-surface font-medium text-right">
                      {selectedCourse.lectureCadence}<br />
                      <span className="text-outline">{selectedCourse.hallLocation}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Tutorial Supervising Ratio</span>
                    <span className="text-on-surface font-semibold">{selectedCourse.supervisingRatio}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-outline">Socratic Synapse Q&A</span>
                    <span className="text-primary font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {selectedCourse.socraticEnabled ? 'Enabled for Supervisions' : 'Disabled'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-space-xs pt-space-xs">
                  <button
                    className="w-full py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container font-ui-functional text-ui-functional font-semibold shadow-sm transition-all flex items-center justify-center gap-space-xs cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_tree</span>
                    <span>Open Course Syllabus Dossier</span>
                  </button>
                  <button
                    className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-ui-functional text-ui-functional font-medium transition-all flex items-center justify-center gap-space-xs cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">insights</span>
                    <span>Inspect Formative Telemetry</span>
                  </button>
                  <button
                    className="w-full py-1 text-center font-ui-functional text-ui-functional text-secondary hover:text-on-secondary-container underline cursor-pointer"
                    type="button"
                  >
                    View Matriculated Student Roster ({selectedCourse.enrolledCount}) →
                  </button>
                </div>
              </aside>
            )}
          </div>
        )}

        {/* STATE 3: EMPTY DIRECTORY */}
        {lensState === 'empty-directory' && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl text-center flex flex-col items-center justify-center gap-space-md max-w-2xl mx-auto my-space-lg">
            <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[36px]">auto_stories</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              <h3 className="font-headline-md text-headline-md text-primary">No Curricula Ingested for Michaelmas Term</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                The collegiate course repository is currently empty for this academic year. Connect your student information system (SITS / InCommon EduGAIN) or initiate a manual syllabus batch upload.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-xs">
              <button
                className="px-space-lg py-space-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container font-ui-functional text-ui-functional shadow-md flex items-center gap-space-xs cursor-pointer"
                onClick={() => setLensState('populated-drawer')}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                <span>Trigger SITS SIS Synchronization</span>
              </button>
              <button
                className="px-space-md py-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-ui-functional text-ui-functional flex items-center gap-space-xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                <span>Upload Curricular CSV Manifest</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE 4: FILTERED ZERO RESULTS */}
        {lensState === 'filtered-zero' && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-xl text-center flex flex-col items-center justify-center gap-space-md max-w-xl mx-auto my-space-lg">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[30px]">filter_alt_off</span>
            </div>
            <div className="flex flex-col gap-space-xs">
              <h3 className="font-headline-sm text-headline-sm text-primary">No Matching Collegiate Courses Found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                No active courses match your combined filter criteria for Division, Department, and Term constraints.
              </p>
            </div>
            <button
              className="px-space-md py-space-sm rounded-lg bg-secondary-container text-on-secondary-container hover:opacity-90 font-ui-functional text-ui-functional font-semibold cursor-pointer"
              onClick={resetFilters}
              type="button"
            >
              Reset Filter Queries
            </button>
          </div>
        )}

        {/* STATE 5: REGISTRY SYNCING (LOADING) */}
        {lensState === 'loading-state' && (
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md my-space-lg">
            <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/30">
              <div className="flex items-center gap-space-sm">
                <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <span className="font-ui-functional text-ui-functional font-semibold text-primary">
                  Synchronizing with Oxford InCommon Registry Synapse...
                </span>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-outline">Ingestion Progress: 64%</span>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((idx) => (
                <div key={idx} className="h-12 bg-surface-container rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        )}
      </div>
      <DevStateLens
        activeId={lensState}
        label="Courses State Lens"
        onSelect={(id) => setLensState(id as 'populated-drawer' | 'populated-table' | 'empty-directory' | 'filtered-zero' | 'loading-state')}
        options={[
          { id: 'populated-drawer', label: '1. Populated (Drawer Open)', onClick: () => setIsDrawerOpen(true) },
          { id: 'populated-table', label: '2. Table Only', onClick: () => setIsDrawerOpen(false) },
          { id: 'empty-directory', label: '3. Empty Directory' },
          { id: 'filtered-zero', label: '4. Filtered Zero' },
          { id: 'loading-state', label: '5. Registry Syncing' },
        ]}
      />
    </>
  );
}
