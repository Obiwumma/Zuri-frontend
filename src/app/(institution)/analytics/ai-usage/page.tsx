'use client';

import React, { useState } from 'react';
import { DevStateLens } from '@/components/ui/DevStateLens';
import { KpiTile } from '@/components/ui/KpiTile';
import { DataTable, Column } from '@/components/ui/DataTable';

interface DepartmentLedgerRow {
  department: string;
  division: string;
  coursesCount: number;
  lecturesProcessed: number;
  syllabusCoveredPct: number;
  quizzesGenerated: number;
  quizDetail: string;
  chatSessions: number;
  chatDetail: string;
  researchQueries: number;
  researchDetail: string;
  totalActivity: number;
  activityGrowth: string;
  isBrightRow?: boolean;
}

export default function AiUsagePage() {
  const [lensState, setLensState] = useState<'populated' | 'empty' | 'filtered-zero' | 'loading'>('populated');
  const [activeDivisionTab, setActiveDivisionTab] = useState<string>('All Divisions');
  const [activeRole, setActiveRole] = useState<string>('admin');
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'Scope: University-Wide',
    'Term: Current Session',
  ]);

  const removeFilter = (filterToRemove: string) => {
    const updated = activeFilters.filter((f) => f !== filterToRemove);
    setActiveFilters(updated);
    if (updated.length === 0) {
      setLensState('filtered-zero');
    }
  };

  const resetFilters = () => {
    setActiveFilters(['Scope: University-Wide', 'Term: Current Session']);
    setLensState('populated');
  };

  const ledgerData: DepartmentLedgerRow[] = [
    {
      department: 'Faculty of History',
      division: 'Humanities Division',
      coursesCount: 42,
      lecturesProcessed: 312,
      syllabusCoveredPct: 94,
      quizzesGenerated: 1140,
      quizDetail: '8,240 questions',
      chatSessions: 6820,
      chatDetail: '89% undergrad reach',
      researchQueries: 4210,
      researchDetail: 'Manuscripts cited',
      totalActivity: 12482,
      activityGrowth: '+11.8%',
    },
    {
      department: 'Department of Engineering Science',
      division: 'MPLS Division',
      coursesCount: 38,
      lecturesProcessed: 284,
      syllabusCoveredPct: 91,
      quizzesGenerated: 1420,
      quizDetail: '11,400 calculations',
      chatSessions: 7940,
      chatDetail: '94% undergrad reach',
      researchQueries: 2650,
      researchDetail: 'IEEE citations indexed',
      totalActivity: 12294,
      activityGrowth: '+8.4%',
      isBrightRow: true,
    },
    {
      department: 'Medical Sciences (Clinical Medicine)',
      division: 'Medical Sciences Division',
      coursesCount: 29,
      lecturesProcessed: 360,
      syllabusCoveredPct: 98,
      quizzesGenerated: 1680,
      quizDetail: '14,200 clinical cases',
      chatSessions: 5120,
      chatDetail: '96% clinical cohorts',
      researchQueries: 3890,
      researchDetail: 'PubMed/Cochrane refs',
      totalActivity: 11050,
      activityGrowth: '+14.2%',
    },
    {
      department: 'Faculty of Philosophy',
      division: 'Humanities Division',
      coursesCount: 18,
      lecturesProcessed: 198,
      syllabusCoveredPct: 88,
      quizzesGenerated: 780,
      quizDetail: '3,900 logic premises',
      chatSessions: 4310,
      chatDetail: '82% tutorial turnout',
      researchQueries: 2140,
      researchDetail: 'Primary philosophical texts',
      totalActivity: 7428,
      activityGrowth: '+5.1%',
      isBrightRow: true,
    },
    {
      department: 'Mathematical Institute',
      division: 'MPLS Division',
      coursesCount: 34,
      lecturesProcessed: 328,
      syllabusCoveredPct: 92,
      quizzesGenerated: 820,
      quizDetail: '4,920 theorem proofs',
      chatSessions: 4460,
      chatDetail: '87% student reach',
      researchQueries: 1420,
      researchDetail: 'arXiv citation graphs',
      totalActivity: 7028,
      activityGrowth: '+9.3%',
    },
  ];

  const filteredLedgerData = ledgerData.filter((row) => {
    if (activeDivisionTab === 'All Divisions') return true;
    if (activeDivisionTab === 'Humanities') return row.division.includes('Humanities');
    if (activeDivisionTab === 'MPLS') return row.division.includes('MPLS');
    if (activeDivisionTab === 'Medical') return row.division.includes('Medical');
    return true;
  });

  const columns: Column<DepartmentLedgerRow>[] = [
    {
      header: 'Department / Faculty',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary group-hover:text-secondary transition-colors">
            {row.department}
          </span>
          <span className="text-xs text-on-surface-variant">
            {row.division} • {row.coursesCount} Courses Active
          </span>
        </div>
      ),
    },
    {
      header: 'Lectures Processed',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{row.lecturesProcessed.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant">{row.syllabusCoveredPct}% syllabus covered</span>
        </div>
      ),
    },
    {
      header: 'Quizzes Generated',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{row.quizzesGenerated.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant">{row.quizDetail}</span>
        </div>
      ),
    },
    {
      header: 'Chat Sessions',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{row.chatSessions.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant">{row.chatDetail}</span>
        </div>
      ),
    },
    {
      header: 'Research Queries',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{row.researchQueries.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant">{row.researchDetail}</span>
        </div>
      ),
    },
    {
      header: 'Total Activity',
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">{row.totalActivity.toLocaleString()}</span>
          <span className="text-[11px] font-semibold text-secondary bg-surface-container px-1.5 py-0.5 rounded">
            {row.activityGrowth}
          </span>
        </div>
      ),
    },
    {
      header: 'Division Dossier',
      className: 'text-right',
      accessor: () => (
        <button
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
          type="button"
        >
          <span>View Report</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl flex flex-col w-full font-body-md text-on-surface">
        {/* Page Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-xl">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary font-semibold">
                Intelligence & Analytics
              </span>
              <span className="text-outline-variant font-label-caps text-label-caps">•</span>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
                Institutional Adoption
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-primary font-serif tracking-tight">AI usage</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
              See how Lexi-supported academic activities are being used across your institution.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <button
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors font-ui-functional text-ui-functional shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">menu_book</span>
              <span>Academic Adoption Standards</span>
            </button>
            <button
              className="inline-flex items-center gap-2 px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-ui-functional text-ui-functional shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Institutional Usage Dossier</span>
            </button>
          </div>
        </header>

        {/* Filter Apparatus */}
        <section
          aria-label="Academic Usage Filters"
          className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm mb-space-xl flex flex-col gap-space-md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Date Range */}
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="filter-date">
                Academic Session / Term
              </label>
              <div className="relative flex items-center">
                <select
                  className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-3 pr-8 rounded-lg outline-none cursor-pointer hover:bg-surface-container transition-colors"
                  id="filter-date"
                >
                  <option selected>Michaelmas Term 2024–25 (Wks 1–7)</option>
                  <option>Trinity Term 2023–24 (Complete)</option>
                  <option>Hilary Term 2023–24 (Complete)</option>
                  <option>Full Academic Year 2023–24</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 text-on-surface-variant text-[18px]">
                  arrow_drop_down
                </span>
              </div>
            </div>
            {/* Academic Division */}
            <div className="flex flex-col gap-1">
              <label
                className="font-label-caps text-label-caps uppercase text-on-surface-variant"
                htmlFor="filter-division"
              >
                Faculty / Division
              </label>
              <div className="relative flex items-center">
                <select
                  className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-3 pr-8 rounded-lg outline-none cursor-pointer hover:bg-surface-container transition-colors"
                  id="filter-division"
                >
                  <option selected>All 4 Academic Divisions (34 Faculties)</option>
                  <option>Humanities Division (11 Faculties)</option>
                  <option>Mathematical, Physical & Life Sciences (10)</option>
                  <option>Medical Sciences Division (8 Faculties)</option>
                  <option>Social Sciences Division (5 Departments)</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 text-on-surface-variant text-[18px]">
                  arrow_drop_down
                </span>
              </div>
            </div>
            {/* Course Scope */}
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant" htmlFor="filter-course">
                Course Scope
              </label>
              <div className="relative flex items-center">
                <select
                  className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-3 pr-8 rounded-lg outline-none cursor-pointer hover:bg-surface-container transition-colors"
                  id="filter-course"
                >
                  <option selected>All Curricula (412 Active Courses)</option>
                  <option>Honour Moderations & Prelims (Year 1)</option>
                  <option>Final Honour Schools (Years 2 & 3)</option>
                  <option>Postgraduate Taught (BPhil / MSt / MSc)</option>
                  <option>Doctoral Research Colloquia</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 text-on-surface-variant text-[18px]">
                  arrow_drop_down
                </span>
              </div>
            </div>
            {/* Activity Modality */}
            <div className="flex flex-col gap-1">
              <label
                className="font-label-caps text-label-caps uppercase text-on-surface-variant"
                htmlFor="filter-modality"
              >
                Activity Modality
              </label>
              <div className="relative flex items-center">
                <select
                  className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-3 pr-8 rounded-lg outline-none cursor-pointer hover:bg-surface-container transition-colors"
                  id="filter-modality"
                >
                  <option selected>All Academic Activities (4 Modalities)</option>
                  <option>Lectures Processed & Syllabus Graphs</option>
                  <option>Formative Quizzes Calibrated</option>
                  <option>Academic Tutorial Dialogues</option>
                  <option>Scholarly Research Queries</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2 text-on-surface-variant text-[18px]">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Search & Active Tags */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-space-sm pt-space-xs">
            <div className="relative flex-1 max-w-lg">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-on-surface-variant">
                search
              </span>
              <input
                className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-ui-functional text-ui-functional pl-9 pr-3 py-2 rounded-lg outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#131900] transition-all"
                id="registry-search"
                placeholder="Search department, college, or faculty code (e.g., HIST-204, Balliol, MPLS)..."
                type="text"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Active:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface text-ui-functional font-ui-functional text-xs"
                >
                  <span>{filter}</span>
                  <button
                    aria-label="Remove filter"
                    className="hover:text-error cursor-pointer"
                    onClick={() => removeFilter(filter)}
                    type="button"
                  >
                    ×
                  </button>
                </span>
              ))}
              {activeFilters.length > 0 && (
                <button
                  className="text-secondary font-ui-functional text-xs font-semibold hover:underline ml-1 cursor-pointer"
                  onClick={resetFilters}
                  type="button"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* VIEW STATE 1: POPULATED */}
        {lensState === 'populated' && (
          <div className="flex flex-col gap-space-xl">
            {/* 4 KPI Stat Tiles using KpiTile */}
            <section aria-label="Key Academic Adoption Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              <KpiTile
                icon="mic"
                label="Lectures Processed"
                subtext={
                  <div className="pt-space-sm bg-surface-container-low p-2 rounded text-on-surface-variant font-ui-functional text-xs">
                    892 audio hours parsed into syllabus concept graphs
                  </div>
                }
                trend="+18.4%"
                trendDirection="up"
                value="1,482"
              />
              <KpiTile
                icon="quiz"
                label="Quizzes Generated"
                subtext={
                  <div className="pt-space-sm bg-surface-container-low p-2 rounded text-on-surface-variant font-ui-functional text-xs">
                    42,100 formative assessment questions calibrated
                  </div>
                }
                trend="38 colleges"
                trendDirection="neutral"
                value="5,840"
              />
              <KpiTile
                icon="forum"
                label="Academic Dialogue & Chat"
                subtext={
                  <div className="pt-space-sm bg-surface-container-low p-2 rounded text-on-surface-variant font-ui-functional text-xs">
                    Average depth: 8.4 pedagogical exchanges per inquiry
                  </div>
                }
                trend="+24.2%"
                trendDirection="up"
                value="28,650"
              />
              <KpiTile
                icon="auto_stories"
                label="Scholarly Research Queries"
                subtext={
                  <div className="pt-space-sm bg-surface-container-low p-2 rounded text-on-surface-variant font-ui-functional text-xs">
                    99.4% citation lineage verified to licensed journals
                  </div>
                }
                trend="Radcliffe & Bodleian"
                trendDirection="neutral"
                value="14,310"
              />
            </section>

            {/* Faculty Time Dividend Banner */}
            <div className="bg-primary-container text-on-primary-container p-space-md rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md shadow-sm">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary-fixed text-[22px]">hourglass_bottom</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary-fixed">
                    Institutional Efficiency Impact
                  </span>
                  <span className="font-headline-sm text-headline-sm text-paper-white font-serif leading-snug">
                    Faculty Time Dividend: 3,240 Hours Saved
                  </span>
                  <span className="font-ui-functional text-xs text-on-primary-container">
                    An estimated 3,240 hours of repetitive transcription, syllabus indexing, and formative question drafting saved this term across collegiate faculties.
                  </span>
                </div>
              </div>
              <button
                className="shrink-0 px-space-md py-2 rounded bg-secondary-container text-on-secondary-container font-ui-functional text-ui-functional font-semibold hover:brightness-105 transition-all cursor-pointer"
                type="button"
              >
                Methodology & Survey Basis
              </button>
            </div>

            {/* Editorial Dual-Column Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
              {/* Visual 1: Line/Area Cadence Graph (7 cols) */}
              <section
                aria-labelledby="cadence-heading"
                className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                      <h2 className="font-headline-sm text-headline-sm font-serif text-primary" id="cadence-heading">
                        AI-Assisted Academic Activity Cadence
                      </h2>
                    </div>
                    <span className="font-label-caps text-label-caps text-outline">Michaelmas 2024–25</span>
                  </div>
                  <p className="font-ui-functional text-ui-functional text-on-surface-variant mb-space-md">
                    Weekly volume of Lexi-supported learning tasks across Michaelmas Term (Wks 1–7)
                  </p>
                </div>
                {/* Inline SVG Area/Line Chart */}
                <div className="relative w-full overflow-hidden my-space-sm">
                  <svg
                    aria-label="Cadence graph depicting weekly academic activity surges"
                    className="w-full h-auto text-primary"
                    viewBox="0 0 680 280"
                  >
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="660" y1="30" y2="30" />
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="660" y1="90" y2="90" />
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="660" y1="150" y2="150" />
                    <line className="text-surface-container-high" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1" x1="40" x2="660" y1="210" y2="210" />
                    <line className="text-outline-variant" stroke="currentColor" strokeWidth="1" x1="40" x2="660" y1="240" y2="240" />

                    <text className="text-[10px] fill-on-surface-variant font-ui-functional" textAnchor="end" x="32" y="34">6,000</text>
                    <text className="text-[10px] fill-on-surface-variant font-ui-functional" textAnchor="end" x="32" y="94">4,500</text>
                    <text className="text-[10px] fill-on-surface-variant font-ui-functional" textAnchor="end" x="32" y="154">3,000</text>
                    <text className="text-[10px] fill-on-surface-variant font-ui-functional" textAnchor="end" x="32" y="214">1,500</text>
                    <text className="text-[10px] fill-on-surface-variant font-ui-functional" textAnchor="end" x="32" y="244">0</text>

                    <text className="text-[11px] fill-on-surface font-ui-functional" textAnchor="middle" x="60" y="260">Wk 1</text>
                    <text className="text-[11px] fill-on-surface font-ui-functional" textAnchor="middle" x="160" y="260">Wk 2</text>
                    <text className="text-[11px] fill-on-surface font-ui-functional" textAnchor="middle" x="260" y="260">Wk 3</text>
                    <text className="text-[11px] fill-on-surface font-ui-functional" textAnchor="middle" x="360" y="260">Wk 4</text>
                    <text className="text-[11px] fill-on-surface font-ui-functional" textAnchor="middle" x="460" y="260">Wk 5</text>
                    <text className="text-[11px] fill-on-surface font-semibold font-ui-functional" textAnchor="middle" x="560" y="260">Wk 6</text>
                    <text className="text-[11px] fill-secondary font-semibold font-ui-functional" textAnchor="middle" x="640" y="260">Wk 7 (Now)</text>

                    <defs>
                      <linearGradient id="dialogueGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#fdba64" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#fdba64" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <polygon fill="url(#dialogueGrad)" points="60,200 160,170 260,140 360,110 460,85 560,50 640,65 640,240 60,240" />
                    <polyline fill="none" points="60,200 160,170 260,140 360,110 460,85 560,50 640,65" stroke="#fdba64" strokeLinecap="round" strokeWidth="2.5" />
                    <polyline fill="none" points="60,225 160,215 260,195 360,170 460,150 560,70 640,110" stroke="#855300" strokeLinecap="round" strokeWidth="2.5" />
                    <circle cx="560" cy="70" fill="#855300" r="4.5" />
                    <polyline fill="none" points="60,220 160,200 260,185 360,165 460,155 560,140 640,135" stroke="#5b6239" strokeDasharray="4 2" strokeLinecap="round" strokeWidth="2" />
                    <polyline fill="none" points="60,160 160,150 260,180 360,190 460,200 560,210 640,215" stroke="#131900" strokeLinecap="round" strokeWidth="2" />

                    <g transform="translate(430, 32)">
                      <rect fill="#131900" height="24" opacity="0.92" rx="4" width="180" />
                      <text className="text-[9.5px] font-ui-functional" fill="#ffffff" x="8" y="16">Wk 6: Midterm formative surge (+42%)</text>
                      <line stroke="#131900" strokeWidth="1.5" x1="130" x2="130" y1="24" y2="38" />
                    </g>
                  </svg>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap items-center justify-between gap-y-2 pt-space-sm text-xs font-ui-functional">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-secondary-container"></span>
                    <span className="text-on-surface">Tutorial & Dialogue Chats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-secondary"></span>
                    <span className="text-on-surface">Quizzes & Problem Sets</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-surface-tint"></span>
                    <span className="text-on-surface">Research Queries</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1.5 rounded-full bg-primary"></span>
                    <span className="text-on-surface">Lecture Audio Ingestion</span>
                  </div>
                </div>
              </section>

              {/* Visual 2: Proportional Distribution & Benchmark (5 cols) */}
              <section
                aria-labelledby="distribution-heading"
                className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-headline-sm text-headline-sm font-serif text-primary" id="distribution-heading">
                      Academic Activity Distribution
                    </h2>
                    <span className="material-symbols-outlined text-secondary text-[20px]">pie_chart</span>
                  </div>
                  <p className="font-ui-functional text-ui-functional text-on-surface-variant mb-space-lg">
                    Proportional share of institutional capabilities utilized this term
                  </p>
                  <div className="flex flex-col gap-space-md">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between font-ui-functional text-xs">
                        <span className="font-semibold text-primary">Tutorial & Learning Dialogues</span>
                        <span className="text-on-surface-variant">41% (28,650 sessions)</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-container rounded-full" style={{ width: '41%' }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between font-ui-functional text-xs">
                        <span className="font-semibold text-primary">Formative Quiz & Problem Sets</span>
                        <span className="text-on-surface-variant">28% (5,840 sets)</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between font-ui-functional text-xs">
                        <span className="font-semibold text-primary">Primary Research Inquiries</span>
                        <span className="text-on-surface-variant">19% (14,310 queries)</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-surface-tint rounded-full" style={{ width: '19%' }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between font-ui-functional text-xs">
                        <span className="font-semibold text-primary">Lecture Ingestion & Indexing</span>
                        <span className="text-on-surface-variant">12% (1,482 lectures)</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '12%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="mt-space-lg p-space-md rounded-lg bg-surface-container-low flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span className="font-label-caps text-label-caps uppercase tracking-wider font-semibold">
                      Collegiate Adoption Benchmark
                    </span>
                  </div>
                  <p className="font-body-md text-xs text-on-surface leading-relaxed">
                    <span className="font-semibold text-primary">91.2% of active tutorial fellows</span> incorporate Lexi lecture concept summaries and generated discussion questions into weekly undergraduate supervision pre-reads.
                  </p>
                </aside>
              </section>
            </div>

            {/* Departmental Adoption Ledger section using DataTable */}
            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-space-sm">
                <div>
                  <h2 className="font-headline-sm text-headline-sm font-serif text-primary">
                    Departmental Adoption & Academic Value Ledger
                  </h2>
                  <p className="font-ui-functional text-ui-functional text-on-surface-variant">
                    Cross-faculty breakdown of learning activity and syllabus enablement
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-space-sm">
                  <div className="inline-flex rounded-lg bg-surface-container p-0.5">
                    {['All Divisions', 'Humanities', 'MPLS', 'Medical'].map((tab) => (
                      <button
                        key={tab}
                        className={`px-3 py-1 text-xs font-ui-functional rounded-md transition-all cursor-pointer ${
                          activeDivisionTab === tab
                            ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        onClick={() => setActiveDivisionTab(tab)}
                        type="button"
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <select className="bg-surface-container text-on-surface font-ui-functional text-xs py-1.5 px-3 pr-7 rounded-lg outline-none cursor-pointer">
                      <option>Sort by: Total Activity (Desc)</option>
                      <option>Sort by: Lectures Processed</option>
                      <option>Sort by: Quizzes Generated</option>
                      <option>Sort by: Department Name (A-Z)</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1.5 text-on-surface-variant text-[16px]">
                      arrow_drop_down
                    </span>
                  </div>
                </div>
              </div>

              <DataTable
                columns={columns}
                data={filteredLedgerData}
                keyExtractor={(row) => row.department}
              />

              <nav
                aria-label="Ledger Pagination"
                className="flex flex-col sm:flex-row items-center justify-between gap-space-sm pt-space-sm text-xs font-ui-functional text-on-surface-variant border-t border-surface-container-high"
              >
                <span>Showing {filteredLedgerData.length} of 34 academic departments</span>
                <div className="flex items-center gap-1">
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface cursor-pointer" type="button">
                    Previous
                  </button>
                  <button className="px-2.5 py-1 rounded bg-primary text-on-primary font-semibold" type="button">
                    1
                  </button>
                  <button className="px-2.5 py-1 rounded hover:bg-surface-container transition-colors text-on-surface cursor-pointer" type="button">
                    2
                  </button>
                  <button className="px-2.5 py-1 rounded hover:bg-surface-container transition-colors text-on-surface cursor-pointer" type="button">
                    3
                  </button>
                  <span className="px-1 text-outline">…</span>
                  <button className="px-2.5 py-1 rounded hover:bg-surface-container transition-colors text-on-surface cursor-pointer" type="button">
                    7
                  </button>
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface cursor-pointer" type="button">
                    Next
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* VIEW STATE 2: EMPTY */}
        {lensState === 'empty' && (
          <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-lg shadow-sm text-center py-20">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary mb-space-md">
              <span className="material-symbols-outlined text-[32px]">library_books</span>
            </div>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary mb-1">
              New Term Academic Initialization
            </span>
            <h2 className="font-headline-md text-headline-md font-serif text-primary mb-space-sm max-w-lg">
              No academic usage recorded yet for this term.
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-space-lg">
              As faculty upload lecture audio, generate formative assessment quizzes, and activate syllabus companion modules, comprehensive institutional adoption telemetry will populate in this ledger.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-sm">
              <button
                className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors font-ui-functional text-ui-functional flex items-center gap-2 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">school</span>
                <span>View Faculty Enablement Guide</span>
              </button>
              <button
                className="px-space-md py-2.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-ui-functional text-ui-functional cursor-pointer"
                type="button"
              >
                Import Michaelmas Syllabi
              </button>
            </div>
          </div>
        )}

        {/* VIEW STATE 3: FILTERED ZERO RESULTS */}
        {lensState === 'filtered-zero' && (
          <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-lg shadow-sm text-center py-20">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-outline mb-space-md">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline mb-1">
              No Academic Criteria Matches
            </span>
            <h2 className="font-headline-sm text-headline-sm font-serif text-primary mb-space-xs">
              No academic records match your active query filters.
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant max-w-md mb-space-lg">
              We could not locate usage telemetry for the selected division, course scope, or department search string.
            </p>
            <button
              className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-ui-functional text-ui-functional font-semibold hover:brightness-105 transition-all cursor-pointer"
              onClick={resetFilters}
              type="button"
            >
              Reset All Filter Criteria
            </button>
          </div>
        )}

        {/* VIEW STATE 4: LOADING */}
        {lensState === 'loading' && (
          <div className="flex flex-col gap-space-lg">
            <div className="p-space-md rounded-lg bg-surface-container flex items-center gap-3 animate-pulse">
              <div className="w-5 h-5 rounded-full bg-surface-container-high"></div>
              <div className="h-4 bg-surface-container-high rounded w-72"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-3 animate-pulse">
                  <div className="h-3 bg-surface-container rounded w-28"></div>
                  <div className="h-10 bg-surface-container rounded w-20"></div>
                  <div className="h-3 bg-surface-container rounded w-36"></div>
                </div>
              ))}
            </div>
            <div className="bg-surface-container-lowest p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md animate-pulse">
              <div className="h-5 bg-surface-container rounded w-1/3"></div>
              <div className="h-3 bg-surface-container rounded w-1/4 mb-4"></div>
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="h-12 bg-surface-container-low rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <DevStateLens
        activeId={lensState}
        label="AI Adoption State Lens"
        onSelect={(id) => setLensState(id as 'populated' | 'empty' | 'filtered-zero' | 'loading')}
        options={[
          { id: 'populated', label: '1. Populated (Michaelmas 2024–25)' },
          { id: 'empty', label: '2. New Term Onboarding' },
          { id: 'filtered-zero', label: '3. Filtered-Zero Results' },
          { id: 'loading', label: '4. Telemetry Syncing' },
        ]}
      />
    </>
  );
}
