'use client';

import React, { useState } from 'react';
import { DevStateLens } from '@/components/ui/DevStateLens';
import { KpiTile } from '@/components/ui/KpiTile';
import { DataTable, Column } from '@/components/ui/DataTable';

interface CourseLedgerRow {
  code: string;
  name: string;
  department: string;
  division: string;
  attempts: number;
  successRate: number;
  subThresholdPct: number;
  trend: string;
  trendType: 'warning' | 'positive' | 'steady';
  isRowLight?: boolean;
}

interface ConceptSignalRow {
  title: string;
  courseCode: string;
  division: string;
  attempts: number;
  tutorialGroups?: number;
  masteryPct: number;
  statusLabel: string;
  statusType: 'secondary-fixed' | 'surface-container' | 'primary-fixed';
  dotColor: 'secondary' | 'primary';
}

export default function QuizPerformancePage() {
  const [lensState, setLensState] = useState<'populated' | 'empty' | 'filtered-zero' | 'loading'>('populated');
  const [activeDivisionTab, setActiveDivisionTab] = useState<string>('All Divisions');
  const [activeRole, setActiveRole] = useState<string>('admin');
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'Mode: Formative & Diagnostic',
    'Threshold: Standard (<65% Review)',
  ]);

  const removeFilter = (filterToRemove: string) => {
    const updated = activeFilters.filter((f) => f !== filterToRemove);
    setActiveFilters(updated);
    if (updated.length === 0) {
      setLensState('filtered-zero');
    }
  };

  const resetFilters = () => {
    setActiveFilters([
      'Mode: Formative & Diagnostic',
      'Threshold: Standard (<65% Review)',
    ]);
    setLensState('populated');
  };

  const courseLedgerData: CourseLedgerRow[] = [
    {
      code: 'ENG-320',
      name: 'Advanced Fluid Dynamics',
      department: 'Engineering Science',
      division: 'MPLS',
      attempts: 1240,
      successRate: 61.5,
      subThresholdPct: 38.5,
      trend: '-3.2% Wk/Wk',
      trendType: 'warning',
    },
    {
      code: 'BIO-410',
      name: 'Cellular Signalling & Genomic Medicine',
      department: 'Biochemistry',
      division: 'Medical Sciences',
      attempts: 2110,
      successRate: 72.8,
      subThresholdPct: 27.2,
      trend: 'Steady',
      trendType: 'steady',
      isRowLight: true,
    },
    {
      code: 'MATH-210',
      name: 'Linear Algebra & Spectral Theory',
      department: 'Mathematical Institute',
      division: 'MPLS',
      attempts: 1780,
      successRate: 81.0,
      subThresholdPct: 19.0,
      trend: '+2.1% Wk/Wk',
      trendType: 'positive',
    },
    {
      code: 'HIST-204',
      name: 'Late Imperial Diplomacy (1870–1914)',
      department: 'Faculty of History',
      division: 'Humanities',
      attempts: 890,
      successRate: 86.4,
      subThresholdPct: 13.6,
      trend: '+4.5% Wk/Wk',
      trendType: 'positive',
      isRowLight: true,
    },
    {
      code: 'LAW-105',
      name: 'Constitutional Jurisprudence',
      department: 'Faculty of Law',
      division: 'Social Sciences',
      attempts: 1450,
      successRate: 88.2,
      subThresholdPct: 11.8,
      trend: 'Steady',
      trendType: 'steady',
    },
  ];

  const conceptSignalsData: ConceptSignalRow[] = [
    {
      title: 'Navier-Stokes Boundary Layer Discretization',
      courseCode: 'ENG-320 (MPLS)',
      division: 'MPLS',
      attempts: 412,
      tutorialGroups: 12,
      masteryPct: 52.8,
      statusLabel: 'Pedagogical Review Recommended',
      statusType: 'secondary-fixed',
      dotColor: 'secondary',
    },
    {
      title: 'Mendelian Linkage Disequilibrium & Epistasis',
      courseCode: 'BIO-410 (Medical Sciences)',
      division: 'Medical Sciences',
      attempts: 680,
      masteryPct: 56.4,
      statusLabel: 'Tutorial Discussion Flag',
      statusType: 'secondary-fixed',
      dotColor: 'secondary',
    },
    {
      title: "Kant's Transcendental Deduction (Critique of Pure Reason)",
      courseCode: 'PHIL-101 (Philosophy)',
      division: 'Humanities',
      attempts: 340,
      masteryPct: 58.1,
      statusLabel: 'Concept Clarity Signal',
      statusType: 'secondary-fixed',
      dotColor: 'secondary',
    },
    {
      title: 'Eigenvalue Perturbation in Hermite Matrices',
      courseCode: 'MATH-210 (Mathematical Institute)',
      division: 'MPLS',
      attempts: 520,
      masteryPct: 59.2,
      statusLabel: 'Problem Sheet Calibrated',
      statusType: 'surface-container',
      dotColor: 'primary',
    },
    {
      title: 'Bismarckian Diplomatic Realignment (1871–1890)',
      courseCode: 'HIST-204 (History)',
      division: 'Humanities',
      attempts: 610,
      masteryPct: 63.5,
      statusLabel: 'Optimal Monitoring',
      statusType: 'primary-fixed',
      dotColor: 'primary',
    },
  ];

  const filteredCourseData = courseLedgerData.filter((row) => {
    if (activeDivisionTab === 'All Divisions') return true;
    if (activeDivisionTab === 'Humanities') return row.division === 'Humanities';
    if (activeDivisionTab === 'MPLS') return row.division === 'MPLS';
    if (activeDivisionTab === 'Medical') return row.division === 'Medical Sciences';
    return true;
  });

  const columns: Column<CourseLedgerRow>[] = [
    {
      header: 'Course',
      accessor: (row) => (
        <div className="font-medium text-primary">
          <div className="font-semibold">{row.code}</div>
          <div className="text-[13px] text-on-surface-variant font-normal">{row.name}</div>
        </div>
      ),
    },
    {
      header: 'Department / Faculty',
      accessor: (row) => (
        <span className="text-on-surface">
          {row.department} ({row.division})
        </span>
      ),
    },
    {
      header: 'Attempts',
      className: 'text-right',
      accessor: (row) => <span className="font-medium text-ink-black">{row.attempts.toLocaleString()}</span>,
    },
    {
      header: 'Success Rate (≥70%)',
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-28 bg-surface-container-highest rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                row.successRate < 70
                  ? 'bg-secondary'
                  : row.successRate < 80
                  ? 'bg-primary-container'
                  : 'bg-primary'
              }`}
              style={{ width: `${row.successRate}%` }}
            ></div>
          </div>
          <span className="font-semibold text-ink-black">{row.successRate.toFixed(1)}%</span>
        </div>
      ),
    },
    {
      header: 'Sub-Threshold',
      className: 'text-right',
      accessor: (row) => <span className="font-medium text-secondary">{row.subThresholdPct.toFixed(1)}%</span>,
    },
    {
      header: 'Trend',
      accessor: (row) => {
        if (row.trendType === 'warning') {
          return (
            <span className="inline-flex items-center gap-1 font-label-caps text-[11px] px-2 py-0.5 rounded bg-error-container/50 text-error uppercase">
              <span className="material-symbols-outlined text-[12px]">warning</span>
              {row.trend}
            </span>
          );
        }
        if (row.trendType === 'positive') {
          return (
            <span className="inline-flex items-center gap-1 font-label-caps text-[11px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed uppercase">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              {row.trend}
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 font-label-caps text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant uppercase">
            {row.trend}
          </span>
        );
      },
    },
    {
      header: 'Action',
      className: 'text-right',
      accessor: () => (
        <button
          className="text-primary hover:text-primary-container font-semibold inline-flex items-center gap-0.5 cursor-pointer"
          type="button"
        >
          View Course Dossier →
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl flex flex-col w-full font-body-md text-on-surface">
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-xl">
          <div className="flex flex-col max-w-2xl">
            <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest mb-1">
              Intelligence & Analytics • Formative Assessment Telemetry
            </span>
            <h1 className="font-headline-md text-headline-md text-ink-black tracking-tight leading-tight mb-2">
              Quiz performance
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Monitor formative assessment mastery, passing thresholds, and concept-level diagnostic signals across academic divisions and collegiate courses.
            </p>
          </div>
          <div className="flex items-center gap-space-sm self-start lg:self-auto flex-wrap">
            <button
              className="px-space-md py-2 rounded-lg font-ui-functional text-ui-functional text-primary bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">rule_folder</span>
              <span>Assessment Benchmarking Standards</span>
            </button>
            <button
              className="px-space-md py-2 rounded-lg font-ui-functional text-ui-functional text-on-primary bg-primary hover:bg-primary-container transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Senate Assessment Dossier</span>
            </button>
          </div>
        </div>

        {/* Filter Container */}
        <section
          aria-label="Quiz Performance Filters"
          className="bg-paper-white p-space-md rounded-lg shadow-sm mb-space-xl flex flex-col gap-space-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-space-sm">
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Academic Term</label>
              <select className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-space-sm rounded-DEFAULT outline-none focus:bg-surface-container">
                <option selected>Michaelmas Term (Wks 1–7)</option>
                <option>Hilary Term (Scheduled)</option>
                <option>Trinity Term (Archive 23–24)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Faculty / Division</label>
              <select className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-space-sm rounded-DEFAULT outline-none focus:bg-surface-container">
                <option selected>All Academic Divisions (4)</option>
                <option>Humanities Division</option>
                <option>Mathematical, Physical & Life Sciences</option>
                <option>Medical Sciences Division</option>
                <option>Social Sciences Division</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Course Scope</label>
              <select className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-space-sm rounded-DEFAULT outline-none focus:bg-surface-container">
                <option selected>All Curricula (412 Active)</option>
                <option>ENG-320: Advanced Fluid Dynamics</option>
                <option>BIO-410: Cellular Signalling</option>
                <option>HIST-204: Late Imperial Diplomacy</option>
                <option>MATH-210: Linear Algebra</option>
                <option>PHIL-101: Formal Logic & Dialectic</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Concept / Topic</label>
              <select className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-space-sm rounded-DEFAULT outline-none focus:bg-surface-container">
                <option selected>All Syllabus Topics</option>
                <option>Boundary Layer Discretization</option>
                <option>Linkage Disequilibrium & Epistasis</option>
                <option>Transcendental Deduction</option>
                <option>Eigenvalue Perturbation</option>
                <option>Diplomatic Realignment</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-label-caps uppercase text-on-surface-variant">Registry Search</label>
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-outline">search</span>
                <input
                  className="w-full pl-8 pr-space-sm py-1.5 bg-surface-container-low text-on-surface font-ui-functional text-ui-functional rounded-DEFAULT outline-none focus:bg-surface-container"
                  placeholder="Search topic or code..."
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-2 bg-paper-white">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="font-label-caps text-label-caps uppercase text-outline">Active Constraints:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full font-ui-functional text-ui-functional text-on-surface"
                >
                  {filter}
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
            </div>
            {activeFilters.length > 0 && (
              <button
                className="font-ui-functional text-ui-functional text-secondary hover:text-on-secondary-container transition-colors underline underline-offset-4 cursor-pointer"
                onClick={resetFilters}
                type="button"
              >
                Clear all filters
              </button>
            )}
          </div>
        </section>

        {/* STATE VIEW 1: POPULATED */}
        {lensState === 'populated' && (
          <div className="flex flex-col w-full space-y-space-xl">
            {/* KPI ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
              <KpiTile
                icon="verified"
                label="Cohort Mastery"
                subtext={
                  <div className="flex items-center justify-between font-ui-functional text-[13px] text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-primary-container">trending_up</span>
                      +2.8% vs Michaelmas 2023
                    </span>
                    <span className="font-label-caps text-[11px] text-outline uppercase">38 Colleges</span>
                  </div>
                }
                trend="+2.8%"
                trendDirection="up"
                value="84.6%"
              />
              <KpiTile
                icon="crisis_alert"
                label="Intervention Margin"
                subtext={
                  <div className="flex items-center justify-between font-ui-functional text-[13px] text-on-surface-variant">
                    <span className="text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">trending_down</span>
                      -1.4% failure reduction
                    </span>
                    <span className="font-label-caps text-[11px] text-outline uppercase">Term-Over-Term</span>
                  </div>
                }
                trend="-1.4%"
                trendDirection="down"
                value="15.4%"
              />
              <KpiTile
                icon="military_tech"
                label="Highest Cohort Baseline"
                subtext={
                  <div className="flex items-center justify-between font-ui-functional text-[13px]">
                    <span className="font-semibold text-primary">92.4% success</span>
                    <span className="font-label-caps text-[11px] px-2 py-0.5 bg-surface-container rounded-full text-on-surface-variant uppercase">
                      14 Cohorts
                    </span>
                  </div>
                }
                trend="Formal Logic"
                trendDirection="neutral"
                value="PHIL-101"
              />
              <KpiTile
                icon="flag"
                label="Tutorial Flag Registry"
                subtext={
                  <div className="flex items-center justify-between font-ui-functional text-[13px] text-on-surface-variant">
                    <span className="text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">campaign</span>
                      Tutorial triage notified
                    </span>
                    <span className="font-label-caps text-[11px] text-outline uppercase">3 Faculties</span>
                  </div>
                }
                trend="7 Topics"
                trendDirection="neutral"
                value="7 Topics"
              />
            </div>

            {/* MAIN ANALYTICS SECTION: TREND VISUALIZATION */}
            <div className="bg-paper-white p-space-lg rounded-lg shadow-sm flex flex-col">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider">
                    Cohort Mastery Trajectory
                  </span>
                  <h2 className="font-headline-md text-headline-md text-ink-black tracking-tight mt-0.5">
                    Formative Assessment Mastery & Retake Cadence
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                    Weekly aggregate trajectory of first-attempt success vs. remediation attempts across Michaelmas Term (Weeks 1–7).
                  </p>
                </div>
                <div className="flex items-center gap-space-md p-space-sm bg-surface-container-low rounded-lg self-start md:self-auto">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                    <span className="font-ui-functional text-ui-functional text-on-surface font-medium">Success (≥70%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary inline-block"></span>
                    <span className="font-ui-functional text-ui-functional text-on-surface font-medium">Remediation (&lt;70%)</span>
                  </div>
                </div>
              </div>

              {/* SVG DUAL LINE & AREA CHART */}
              <div className="relative w-full h-80 bg-surface-container-low rounded-lg p-space-md flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-x-8 inset-y-8 flex flex-col justify-between pointer-events-none opacity-40">
                  <div className="w-full flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-outline">100%</span>
                    <div className="w-full ml-4 h-[1px] bg-outline-variant/30"></div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-outline">80%</span>
                    <div className="w-full ml-4 h-[1px] bg-outline-variant/30"></div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-outline">60%</span>
                    <div className="w-full ml-4 h-[1px] bg-outline-variant/30"></div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-outline">40%</span>
                    <div className="w-full ml-4 h-[1px] bg-outline-variant/30"></div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-outline">20%</span>
                    <div className="w-full ml-4 h-[1px] bg-outline-variant/30"></div>
                  </div>
                  <div className="w-full flex items-center justify-between">
                    <span className="font-label-caps text-[10px] text-outline">0%</span>
                    <div className="w-full ml-4 h-[1px] bg-outline-variant/30"></div>
                  </div>
                </div>

                <div className="relative w-full h-full pl-8 pb-6 pt-2 pr-4">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
                    <defs>
                      <linearGradient id="successFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#272e0a" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#272e0a" stopOpacity="0.01" />
                      </linearGradient>
                      <linearGradient id="failFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#855300" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#855300" stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <path d="M 10 74 Q 120 70, 230 58 T 460 42 T 580 36 L 690 32 L 690 235 L 10 235 Z" fill="url(#successFill)" />
                    <path d="M 10 74 Q 120 70, 230 58 T 460 42 T 580 36 L 690 32" fill="none" stroke="#272e0a" strokeLinecap="round" strokeWidth="3" />
                    <path d="M 10 166 Q 120 170, 230 182 T 460 198 T 580 204 L 690 208 L 690 235 L 10 235 Z" fill="url(#failFill)" />
                    <path d="M 10 166 Q 120 170, 230 182 T 460 198 T 580 204 L 690 208" fill="none" stroke="#855300" strokeDasharray="4 3" strokeLinecap="round" strokeWidth="2.5" />
                    <line stroke="#77786c" strokeDasharray="3 3" strokeWidth="1.5" x1="580" x2="580" y1="20" y2="235" />
                    <circle cx="580" cy="36" fill="#272e0a" r="6" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="580" cy="204" fill="#855300" r="5" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  <div className="absolute top-6 right-[12%] bg-ink-black text-paper-white p-2.5 rounded-lg shadow-xl pointer-events-none hidden md:flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-secondary-fixed"></span>
                      <span className="font-label-caps text-[11px] uppercase tracking-wide text-secondary-fixed">Wk 6 Formative Checkpoint</span>
                    </div>
                    <div className="font-ui-functional text-ui-functional font-medium leading-none mb-1">4,820 Submissions Verified</div>
                    <div className="font-label-caps text-[11px] text-surface-container-high opacity-85">Success: 84.8% • Retakes: 15.2%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pl-8 pr-4 pt-2">
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Week 1 (Induction)</span>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Week 2</span>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Week 3</span>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Week 4</span>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Week 5</span>
                  <span className="font-label-caps text-label-caps uppercase text-primary font-bold">Week 6 (Midterm)</span>
                  <span className="font-label-caps text-label-caps uppercase text-on-surface font-semibold">Week 7 (Active)</span>
                </div>
              </div>

              {/* Institutional Summary Footer */}
              <div className="mt-space-md p-space-md bg-surface-container rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[22px]">school</span>
                  <div>
                    <span className="font-ui-functional text-ui-functional font-semibold text-primary">Collegiate Mastery Index:</span>
                    <span className="font-ui-functional text-ui-functional text-on-surface ml-1">
                      88.2% of tutorial fellows conduct pre-supervision diagnostic quizzes prior to 1-on-1 sessions.
                    </span>
                  </div>
                </div>
                <span className="font-label-caps text-[11px] text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
                  Telemetry Source: InCommon Fed. Synapse v4.2
                </span>
              </div>
            </div>

            {/* SECOND SECTION: COURSE PERFORMANCE LEDGER using DataTable */}
            <div className="bg-paper-white p-space-lg rounded-lg shadow-sm flex flex-col gap-space-md">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
                <div>
                  <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider">Curricular Ledger</span>
                  <h2 className="font-headline-md text-headline-md text-ink-black tracking-tight mt-0.5">
                    Course Assessment Mastery Ledger
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-space-sm">
                  <div className="flex items-center bg-surface-container rounded-lg p-1">
                    {['All Divisions', 'Humanities', 'MPLS', 'Medical'].map((tab) => (
                      <button
                        key={tab}
                        className={`px-3 py-1 rounded-DEFAULT font-ui-functional text-ui-functional transition-all cursor-pointer ${
                          activeDivisionTab === tab
                            ? 'bg-paper-white font-semibold text-primary shadow-sm'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        onClick={() => setActiveDivisionTab(tab)}
                        type="button"
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <select className="bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-1.5 px-space-sm rounded-DEFAULT outline-none focus:bg-surface-container">
                    <option>Sort by: Lowest Success Rate (Asc)</option>
                    <option>Sort by: Highest Total Attempts</option>
                    <option>Sort by: Largest Remediation Burden</option>
                    <option>Sort by: Course Code (A–Z)</option>
                  </select>
                </div>
              </div>

              <DataTable
                columns={columns}
                data={filteredCourseData}
                keyExtractor={(row) => row.code}
              />

              <div className="mt-space-md flex items-center justify-between font-ui-functional text-[13px] text-on-surface-variant pt-2 bg-paper-white border-t border-surface-container-high">
                <span>Displaying {filteredCourseData.length} of 412 collegiate curricula</span>
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer" type="button">Previous</button>
                  <span className="px-2 font-semibold text-primary">1</span>
                  <button className="px-2 py-1 rounded hover:bg-surface-container transition-colors cursor-pointer" type="button">2</button>
                  <button className="px-2 py-1 rounded hover:bg-surface-container transition-colors cursor-pointer" type="button">3</button>
                  <span className="px-1">…</span>
                  <button className="px-2 py-1 rounded hover:bg-surface-container transition-colors cursor-pointer" type="button">83</button>
                  <button className="px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer" type="button">Next</button>
                </div>
              </div>
            </div>

            {/* THIRD SECTION: WEAK TOPICS & CONCEPT SIGNALS */}
            <div className="bg-paper-white p-space-lg rounded-lg shadow-sm flex flex-col">
              <div className="flex flex-col mb-space-md">
                <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider">Formative Diagnostic Signals</span>
                <h2 className="font-headline-md text-headline-md text-ink-black tracking-tight mt-0.5">
                  Syllabus Concept Review Signals
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-4xl">
                  Specific curriculum topics surfacing sub-optimal cohort comprehension. These signals are designed as formative guidance for tutorial fellows and syllabus directors to consider during weekly supervisions.
                </p>
              </div>
              <div className="flex flex-col gap-space-sm">
                {conceptSignalsData.map((concept, idx) => (
                  <div
                    key={idx}
                    className="p-space-md bg-surface-container-low rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm hover:bg-surface-container transition-colors"
                  >
                    <div className="flex items-start gap-space-sm">
                      <span
                        className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                          concept.dotColor === 'secondary' ? 'bg-secondary' : 'bg-primary'
                        }`}
                      ></span>
                      <div>
                        <div className="font-ui-functional text-ui-functional font-semibold text-primary">
                          {concept.title}
                        </div>
                        <div className="font-body-md text-[13px] text-on-surface-variant mt-0.5">
                          Course: <span className="font-medium text-ink-black">{concept.courseCode}</span> • {concept.attempts.toLocaleString()} student attempts logged
                          {concept.tutorialGroups ? ` across ${concept.tutorialGroups} tutorial groups` : ''}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-md flex-wrap self-end lg:self-center">
                      <div className="text-right">
                        <span className="font-label-caps text-[11px] uppercase text-outline block">Cohort Mastery</span>
                        <span
                          className={`font-headline-sm text-headline-sm font-bold leading-none ${
                            concept.masteryPct < 60 ? 'text-secondary' : 'text-primary'
                          }`}
                        >
                          {concept.masteryPct.toFixed(1)}%
                        </span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded font-label-caps text-[11px] uppercase font-semibold ${
                          concept.statusType === 'secondary-fixed'
                            ? 'bg-secondary-fixed text-on-secondary-fixed'
                            : concept.statusType === 'primary-fixed'
                            ? 'bg-primary-fixed text-on-primary-fixed'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {concept.statusLabel}
                      </span>
                      <button
                        className="px-space-sm py-1 rounded bg-paper-white hover:bg-surface-container-high text-primary font-ui-functional text-ui-functional shadow-sm font-medium cursor-pointer"
                        type="button"
                      >
                        Inspect Concept Breakdown →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STATE VIEW 2: EMPTY */}
        {lensState === 'empty' && (
          <div className="flex flex-col w-full">
            <div className="bg-paper-white p-16 rounded-lg shadow-sm text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-12">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-primary mb-space-md">
                <span className="material-symbols-outlined text-[32px]">edit_calendar</span>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider mb-1">Pre-Assessment Period</span>
              <h3 className="font-headline-md text-headline-md text-ink-black mb-2">No Formative Data Logged for Hilary Term</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                The upcoming academic term has not yet commenced formative diagnostic quiz schedules. Initial quiz telemetry will populate automatically following Week 1 tutorial inductions.
              </p>
              <div className="flex items-center gap-space-sm">
                <button
                  className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-ui-functional text-ui-functional hover:bg-primary-container transition-colors cursor-pointer"
                  onClick={() => setLensState('populated')}
                  type="button"
                >
                  Return to Michaelmas Active Term
                </button>
                <button
                  className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-ui-functional text-ui-functional hover:bg-surface-container-high transition-colors cursor-pointer"
                  type="button"
                >
                  Configure Term Quiz Benchmarks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE VIEW 3: FILTERED ZERO RESULTS */}
        {lensState === 'filtered-zero' && (
          <div className="flex flex-col w-full">
            <div className="bg-paper-white p-16 rounded-lg shadow-sm text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-12">
              <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-secondary mb-space-md">
                <span className="material-symbols-outlined text-[32px]">filter_alt_off</span>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-wider mb-1">Query Mismatch</span>
              <h3 className="font-headline-md text-headline-md text-ink-black mb-2">Zero Matching Assessment Cohorts</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">
                No active course cohorts matched your current composite filter combination of threshold (&lt;65%), syllabus topic, and division scope. Try loosening threshold bounds or clearing topic keywords.
              </p>
              <button
                className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-ui-functional text-ui-functional hover:bg-primary-container transition-colors cursor-pointer"
                onClick={resetFilters}
                type="button"
              >
                Reset to Default Michaelmas Telemetry
              </button>
            </div>
          </div>
        )}

        {/* STATE VIEW 4: LOADING */}
        {lensState === 'loading' && (
          <div className="flex flex-col w-full space-y-space-md">
            <div className="bg-paper-white p-space-lg rounded-lg shadow-sm flex items-center gap-space-md">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="flex flex-col">
                <span className="font-ui-functional text-ui-functional font-semibold text-primary">Synchronizing Formative Datastores with InCommon Federation...</span>
                <span className="font-label-caps text-[11px] text-on-surface-variant uppercase">Ingesting quiz submission bundles from 38 collegiate faculties • Batch #4092</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="bg-paper-white p-space-lg rounded-lg h-36 animate-pulse flex flex-col justify-between">
                  <div className="h-4 bg-surface-container rounded w-1/3"></div>
                  <div className="h-10 bg-surface-container-high rounded w-1/2"></div>
                  <div className="h-3 bg-surface-container rounded w-2/3"></div>
                </div>
              ))}
            </div>
            <div className="bg-paper-white p-space-lg rounded-lg h-96 animate-pulse flex flex-col justify-between">
              <div className="h-6 bg-surface-container rounded w-1/4"></div>
              <div className="h-64 bg-surface-container-low rounded"></div>
              <div className="h-4 bg-surface-container rounded w-1/3"></div>
            </div>
          </div>
        )}
      </div>
      <DevStateLens
        activeId={lensState}
        label="Quiz Telemetry State Lens"
        onSelect={(id) => setLensState(id as 'populated' | 'empty' | 'filtered-zero' | 'loading')}
        options={[
          { id: 'populated', label: '1. Populated (Michaelmas 2024–25)' },
          { id: 'empty', label: '2. Fresh Term / Pre-Assessment' },
          { id: 'filtered-zero', label: '3. Filtered-Zero Results' },
          { id: 'loading', label: '4. Synapse Ingestion' },
        ]}
      />
    </>
  );
}
