'use client';

import React, { useState } from 'react';
import { KpiTile } from '@/components/ui/KpiTile';
import { DataTable, Column } from '@/components/ui/DataTable';
import { FilterBar } from '@/components/ui/FilterBar';
import { DevStateLens } from '@/components/ui/DevStateLens';

interface CourseLedgerRow {
  title: string;
  code: string;
  department: string;
  interventions: number;
  accepted: number;
  rate: string;
  isHighRate: boolean;
  trend: string;
  isTrendUp: boolean;
}

export default function InterventionAnalyticsPage() {
  const [analyticsState, setAnalyticsState] = useState<'populated' | 'empty' | 'filtered-empty' | 'loading'>('populated');
  const [activeRole, setActiveRole] = useState<string>('admin');
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'Status: Actioned & Pending',
    'Cohort: 2024 Matriculation',
  ]);

  const removeFilter = (filterToRemove: string) => {
    const updated = activeFilters.filter((f) => f !== filterToRemove);
    setActiveFilters(updated);
    if (updated.length === 0) {
      setAnalyticsState('filtered-empty');
    }
  };

  const resetFilters = () => {
    setActiveFilters([
      'Status: Actioned & Pending',
      'Cohort: 2024 Matriculation',
    ]);
    setAnalyticsState('populated');
  };

  const ledgerData: CourseLedgerRow[] = [
    {
      title: 'Late Imperial Diplomacy',
      code: 'HIST-204 • Michaelmas Option',
      department: 'Faculty of History',
      interventions: 482,
      accepted: 418,
      rate: '86.7%',
      isHighRate: true,
      trend: '+6.2% Wk/Wk',
      isTrendUp: true,
    },
    {
      title: 'Cellular Signalling & Genomic Medicine',
      code: 'BIO-410 • Advanced Core',
      department: 'Medical Sciences Division',
      interventions: 540,
      accepted: 442,
      rate: '81.8%',
      isHighRate: true,
      trend: '+3.5% Wk/Wk',
      isTrendUp: true,
    },
    {
      title: 'Formal Logic & Dialectic',
      code: 'PHIL-101 • Introductory Mods',
      department: 'Faculty of Philosophy',
      interventions: 398,
      accepted: 322,
      rate: '80.9%',
      isHighRate: true,
      trend: '+8.1% Wk/Wk',
      isTrendUp: true,
    },
    {
      title: 'Advanced Fluid Dynamics & Navier-Stokes',
      code: 'ENG-320 • Part II Specialization',
      department: 'Department of Engineering Science',
      interventions: 315,
      accepted: 230,
      rate: '73.0%',
      isHighRate: false,
      trend: 'Steady',
      isTrendUp: false,
    },
    {
      title: 'Linear Algebra & Matrix Decompositions',
      code: 'MATH-210 • Year 2 Foundation',
      department: 'Mathematical Institute',
      interventions: 610,
      accepted: 458,
      rate: '75.1%',
      isHighRate: true,
      trend: '+1.8% Wk/Wk',
      isTrendUp: true,
    },
  ];

  const ledgerColumns: Column<CourseLedgerRow>[] = [
    {
      header: 'Course & Module',
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-primary hover:text-secondary transition-colors">{row.title}</span>
          <span className="font-label-caps text-[11px] text-on-surface-variant">{row.code}</span>
        </div>
      ),
    },
    {
      header: 'Department / Faculty',
      accessor: (row) => <span className="text-on-surface-variant">{row.department}</span>,
    },
    {
      header: 'Interventions',
      className: 'text-right',
      accessor: (row) => <span className="font-semibold text-primary">{row.interventions}</span>,
    },
    {
      header: 'Accepted',
      className: 'text-right',
      accessor: (row) => <span className="text-on-surface">{row.accepted}</span>,
    },
    {
      header: 'Acceptance Rate',
      className: 'text-center',
      accessor: (row) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[13px] ${
          row.isHighRate
            ? 'bg-primary-container text-on-primary-container'
            : 'bg-surface-container text-on-surface'
        }`}>
          {row.rate}
        </span>
      ),
    },
    {
      header: 'Trend',
      accessor: (row) => (
        <div className={`flex items-center gap-1 text-[13px] ${row.isTrendUp ? 'text-secondary font-semibold' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[15px]">{row.isTrendUp ? 'arrow_outward' : 'trending_flat'}</span>
          {row.trend}
        </div>
      ),
    },
    {
      header: 'Action',
      className: 'text-right',
      accessor: () => (
        <button className="text-secondary hover:text-on-secondary-container font-semibold text-[13px] inline-flex items-center gap-1 transition-transform hover:translate-x-0.5" type="button">
          <span>View Cohort Dossier</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl">
        <div className="flex flex-col w-full gap-space-xl">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="flex flex-col gap-1 max-w-2xl">
              <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">Intelligence & Analytics • Pedagogical Outcomes</span>
              <h1 className="font-headline-md text-headline-md text-primary font-serif font-bold tracking-tight">Intervention analytics</h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Understand which proactive learning interventions are being surfaced, accepted, and acted upon across Oxford faculties and constituent colleges.
              </p>
            </div>
            <div className="flex items-center gap-space-md self-start md:self-auto">
              <a className="font-ui-functional text-ui-functional text-secondary hover:text-on-secondary-container transition-colors flex items-center gap-1 underline underline-offset-4 decoration-outline-variant" href="#">
                <span className="material-symbols-outlined text-[16px]">tune</span>
                Intervention Protocol Settings
              </a>
              <button className="px-space-md py-2 rounded-lg bg-surface-container-lowest text-primary hover:bg-surface-container font-ui-functional text-ui-functional shadow-sm flex items-center gap-space-xs transition-colors" type="button">
                <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
                <span>Export Senate Analytics Dossier</span>
              </button>
            </div>
          </div>

          {/* Filter & Control Bar */}
          <div className="w-full bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-sm">
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Academic Term</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-space-sm pr-8 rounded-lg appearance-none cursor-pointer outline-none hover:bg-surface-container">
                    <option>Michaelmas Term (Weeks 1–7)</option>
                    <option>Hilary Term (Archived 2024)</option>
                    <option>Trinity Term (Archived 2024)</option>
                    <option>All Academic Year 2024–25</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">keyboard_arrow_down</span>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Course Scope</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-space-sm pr-8 rounded-lg appearance-none cursor-pointer outline-none hover:bg-surface-container">
                    <option>All Courses (412 active)</option>
                    <option>Undergraduate Tripos / Mods</option>
                    <option>Postgraduate Research Seminars</option>
                    <option>Clinical & Laboratory Courses</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">keyboard_arrow_down</span>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Faculty & Division</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-space-sm pr-8 rounded-lg appearance-none cursor-pointer outline-none hover:bg-surface-container">
                    <option>All Divisions & Faculties</option>
                    <option>Humanities Division</option>
                    <option>Mathematical, Physical & Life Sciences</option>
                    <option>Medical Sciences Division</option>
                    <option>Social Sciences Division</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">keyboard_arrow_down</span>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Intervention Type</label>
                <div className="relative">
                  <select className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 px-space-sm pr-8 rounded-lg appearance-none cursor-pointer outline-none hover:bg-surface-container">
                    <option>All Types (4 Categories)</option>
                    <option>Pre-Class Reading Diagnostic</option>
                    <option>Post-Lecture Reinforcement</option>
                    <option>Exam & Collections Prep</option>
                    <option>Assignment Reminder & Scaffold</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">keyboard_arrow_down</span>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="font-label-caps text-label-caps uppercase text-on-surface-variant mb-1">Registry Search</label>
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low text-on-surface font-ui-functional text-ui-functional py-2 pl-9 pr-3 rounded-lg outline-none hover:bg-surface-container focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                    defaultValue="HIST-204"
                    placeholder="Search course code..."
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-[18px]">search</span>
                </div>
              </div>
            </div>

            {/* Active Filters & Reset */}
            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-caps text-label-caps uppercase text-on-surface-variant mr-1">Active Criteria:</span>
                {activeFilters.map((filter) => (
                  <span key={filter} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container font-ui-functional text-[12px] text-on-surface">
                    {filter}
                    <button
                      className="material-symbols-outlined text-[14px] text-on-surface-variant hover:text-error"
                      onClick={() => removeFilter(filter)}
                      type="button"
                    >
                      close
                    </button>
                  </span>
                ))}
              </div>
              <button
                className="font-label-caps text-label-caps uppercase text-secondary hover:underline"
                onClick={resetFilters}
                type="button"
              >
                Clear all filters
              </button>
            </div>
          </div>

          {/* STATE CONTAINER 1: POPULATED VIEW */}
          {analyticsState === 'populated' && (
            <div className="flex flex-col gap-space-xl transition-opacity duration-300" id="view-populated">
              {/* Top KPI Row (4 Editorial Cards using KpiTile) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                <KpiTile
                  icon="trending_up"
                  label="Total Interventions"
                  subtext="Across 38 constituent colleges"
                  trend="+12.4% vs Michaelmas 2023"
                  trendDirection="up"
                  value="3,842"
                />
                <KpiTile
                  icon="task_alt"
                  label="Student Acceptance"
                  subtext="+5.1% since Week 3 diagnostic baseline"
                  trend="3,012 acted on within 48h"
                  trendDirection="up"
                  value="78.4%"
                />
                <KpiTile
                  icon="flag"
                  label="Interventions This Week"
                  subtext="142 active responses in last 48h"
                  trend="32 flagged for tutorial triage"
                  trendDirection="neutral"
                  value="412"
                />
                <KpiTile
                  icon="auto_stories"
                  label="Most Common Modality"
                  subtext="84% completion • Followed by Exam Prep"
                  trend="44.2% of all signals (1,698)"
                  trendDirection="up"
                  value="Pre-Class Review"
                />
              </div>

              {/* Main Visualizations: 2-Column Asymmetric Grid (7 cols / 5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
                {/* Chart 1: Intervention Volume & Student Uptake Over Time (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-md">
                    <div className="flex flex-col">
                      <h2 className="font-headline-sm text-headline-sm font-serif text-primary">Intervention Volume & Uptake</h2>
                      <p className="font-ui-functional text-ui-functional text-on-surface-variant">Weekly volume of proactive learning signals surfaced vs. student engagement</p>
                    </div>
                    <div className="flex items-center gap-space-md">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="font-ui-functional text-[12px] text-on-surface-variant">Surfaced Signals</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-secondary"></span>
                        <span className="font-ui-functional text-[12px] text-on-surface-variant">Accepted & Completed</span>
                      </div>
                    </div>
                  </div>
                  {/* SVG Line/Area Restrained Chart */}
                  <div className="relative w-full h-64 mt-2">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 240">
                      <defs>
                        <linearGradient id="gradient-surfaced" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#131900" stopOpacity="0.12"></stop>
                          <stop offset="100%" stopColor="#131900" stopOpacity="0.0"></stop>
                        </linearGradient>
                        <linearGradient id="gradient-accepted" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#855300" stopOpacity="0.18"></stop>
                          <stop offset="100%" stopColor="#855300" stopOpacity="0.0"></stop>
                        </linearGradient>
                      </defs>
                      <line stroke="#f0eee9" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="680" y1="20" y2="20"></line>
                      <line stroke="#f0eee9" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="680" y1="75" y2="75"></line>
                      <line stroke="#f0eee9" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="680" y1="130" y2="130"></line>
                      <line stroke="#e4e2dd" strokeWidth="1" x1="40" x2="680" y1="185" y2="185"></line>
                      <text className="fill-outline text-[11px] font-sans" textAnchor="end" x="30" y="24">700</text>
                      <text className="fill-outline text-[11px] font-sans" textAnchor="end" x="30" y="79">500</text>
                      <text className="fill-outline text-[11px] font-sans" textAnchor="end" x="30" y="134">300</text>
                      <text className="fill-outline text-[11px] font-sans" textAnchor="end" x="30" y="189">0</text>
                      <polygon fill="url(#gradient-surfaced)" points="70,165 170,140 270,110 370,85 470,62 570,38 670,72 670,185 70,185"></polygon>
                      <polygon fill="url(#gradient-accepted)" points="70,172 170,152 270,128 370,105 470,88 570,64 670,95 670,185 70,185"></polygon>
                      <polyline fill="none" points="70,165 170,140 270,110 370,85 470,62 570,38 670,72" stroke="#131900" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></polyline>
                      <polyline fill="none" points="70,172 170,152 270,128 370,105 470,88 570,64 670,95" stroke="#855300" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></polyline>
                      <circle cx="570" cy="38" fill="#131900" r="4.5"></circle>
                      <circle cx="570" cy="64" fill="#855300" r="4.5"></circle>
                      <rect fill="#131900" height="22" rx="4" width="100" x="520" y="8"></rect>
                      <text className="fill-on-primary text-[10px] font-sans font-bold" textAnchor="middle" x="570" y="23">Wk 6: 620 Surfaced</text>
                      <text className="fill-on-surface-variant text-[12px] font-sans" textAnchor="middle" x="70" y="212">Wk 1</text>
                      <text className="fill-on-surface-variant text-[12px] font-sans" textAnchor="middle" x="170" y="212">Wk 2</text>
                      <text className="fill-on-surface-variant text-[12px] font-sans" textAnchor="middle" x="270" y="212">Wk 3</text>
                      <text className="fill-on-surface-variant text-[12px] font-sans" textAnchor="middle" x="370" y="212">Wk 4</text>
                      <text className="fill-on-surface-variant text-[12px] font-sans" textAnchor="middle" x="470" y="212">Wk 5</text>
                      <text className="fill-primary font-bold text-[12px] font-sans" textAnchor="middle" x="570" y="212">Wk 6 (Midterm)</text>
                      <text className="fill-on-surface-variant text-[12px] font-sans" textAnchor="middle" x="670" y="212">Wk 7 (Now)</text>
                    </svg>
                  </div>
                  <div className="mt-space-md p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-space-xs text-on-surface-variant font-ui-functional text-[13px]">
                      <span className="material-symbols-outlined text-[16px] text-secondary">info</span>
                      <span>Midterm diagnostic period in Week 6 represented the highest surge in support requests.</span>
                    </div>
                    <span className="font-label-caps text-label-caps text-secondary font-semibold">91.4% Tutorial Follow-through</span>
                  </div>
                </div>

                {/* Chart 2: Acceptance & Action Rate by Type (5 Cols) */}
                <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col mb-space-md">
                      <h2 className="font-headline-sm text-headline-sm font-serif text-primary">Acceptance by Category</h2>
                      <p className="font-ui-functional text-ui-functional text-on-surface-variant">Proportion of students taking action within 72 hours</p>
                    </div>
                    <div className="flex flex-col gap-space-md">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-ui-functional font-ui-functional">
                          <span className="font-medium text-primary">Pre-Class Review</span>
                          <span className="font-bold text-primary">84.2% <span className="font-normal text-on-surface-variant text-[12px]">(1,698 signals)</span></span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                          <div className="bg-primary h-2.5 rounded-full" style={{ width: '84.2%' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-ui-functional font-ui-functional">
                          <span className="font-medium text-primary">Post-Lecture Reinforcement</span>
                          <span className="font-bold text-primary">79.1% <span className="font-normal text-on-surface-variant text-[12px]">(912 signals)</span></span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                          <div className="bg-secondary h-2.5 rounded-full" style={{ width: '79.1%' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-ui-functional font-ui-functional">
                          <span className="font-medium text-primary">Exam Preparation</span>
                          <span className="font-bold text-primary">74.8% <span className="font-normal text-on-surface-variant text-[12px]">(780 signals)</span></span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                          <div className="bg-surface-tint h-2.5 rounded-full" style={{ width: '74.8%' }}></div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-ui-functional font-ui-functional">
                          <span className="font-medium text-primary">Assignment Scaffold & Reminder</span>
                          <span className="font-bold text-primary">68.3% <span className="font-normal text-on-surface-variant text-[12px]">(452 signals)</span></span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                          <div className="bg-secondary-container h-2.5 rounded-full" style={{ width: '68.3%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-space-lg p-space-md bg-secondary-fixed/40 rounded-lg flex items-start gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[22px] mt-0.5">school</span>
                    <div className="flex flex-col">
                      <span className="font-label-caps text-label-caps uppercase text-secondary font-bold">Pedagogical Correlation Note</span>
                      <p className="font-body-md text-[13px] text-on-surface leading-snug mt-0.5">
                        Students engaging with pre-class review recommendations demonstrate a <strong>+14% higher tutorial participation score</strong> as recorded by college tutors.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course & Department Telemetry Ledger Section (using DataTable) */}
              <DataTable
                categoryLabel="Academic Distribution"
                columns={ledgerColumns}
                data={ledgerData}
                keyExtractor={(row) => row.code}
                subtitle="Comprehensive breakdown of intervention cadence and student acceptance across faculties. Click any row to view granular cohort telemetry and tutorial notes."
                title="Course & Department Telemetry Ledger"
              />
            </div>
          )}

          {/* STATE CONTAINER 2: EMPTY STATE */}
          {analyticsState === 'empty' && (
            <div className="flex flex-col items-center justify-center py-20 px-space-md bg-surface-container-lowest rounded-xl shadow-sm text-center" id="view-empty">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-space-md text-secondary">
                <span className="material-symbols-outlined text-[36px]">history_edu</span>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-secondary">Awaiting Michaelmas Term Onset</span>
              <h2 className="font-headline-md text-headline-md font-serif text-primary mt-1 max-w-lg">No Interventions Recorded for Selected Term</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-md">
                Once Michaelmas Term commences and syllabus telemetry is connected with Oxford tutorial registries, proactive intervention signals will appear here.
              </p>
              <div className="mt-space-lg flex items-center gap-space-sm">
                <button className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-ui-functional text-ui-functional hover:bg-primary-container transition-colors" type="button">
                  Configure Term Signal Thresholds
                </button>
                <button className="px-space-md py-2 rounded-lg bg-surface-container text-on-surface font-ui-functional text-ui-functional hover:bg-surface-container-high transition-colors" onClick={() => setAnalyticsState('populated')} type="button">
                  View Previous Term Archives
                </button>
              </div>
            </div>
          )}

          {/* STATE CONTAINER 3: FILTERED-EMPTY STATE */}
          {analyticsState === 'filtered-empty' && (
            <div className="flex flex-col items-center justify-center py-20 px-space-md bg-surface-container-lowest rounded-xl shadow-sm text-center" id="view-filtered-empty">
              <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-space-md text-outline">
                <span className="material-symbols-outlined text-[36px]">filter_alt_off</span>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Telemetry Query: 0 Records</span>
              <h2 className="font-headline-md text-headline-md font-serif text-primary mt-1 max-w-lg">No interventions match your active filter criteria</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-md">
                There are no learning interventions recorded under the specified faculty, course code, or type within Michaelmas Term Weeks 1–7.
              </p>
              <div className="mt-space-lg">
                <button className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-ui-functional text-ui-functional hover:bg-primary-container transition-colors inline-flex items-center gap-1.5" onClick={resetFilters} type="button">
                  <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  Reset all filters to defaults
                </button>
              </div>
            </div>
          )}

          {/* STATE CONTAINER 4: TELEMETRY LOADING STATE */}
          {analyticsState === 'loading' && (
            <div className="flex flex-col gap-space-xl animate-pulse" id="view-loading">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm h-36 flex flex-col justify-between">
                    <div className="h-3 bg-surface-container rounded w-1/3"></div>
                    <div className="h-10 bg-surface-container rounded w-1/2 my-2"></div>
                    <div className="h-3 bg-surface-container rounded w-3/4"></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
                <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm h-80 flex flex-col justify-between">
                  <div className="h-4 bg-surface-container rounded w-1/4"></div>
                  <div className="h-48 bg-surface-container-low rounded w-full"></div>
                  <div className="h-3 bg-surface-container rounded w-1/2"></div>
                </div>
                <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm h-80 flex flex-col justify-between">
                  <div className="h-4 bg-surface-container rounded w-1/3"></div>
                  <div className="flex flex-col gap-4 my-2">
                    <div className="h-6 bg-surface-container-low rounded w-full"></div>
                    <div className="h-6 bg-surface-container-low rounded w-full"></div>
                    <div className="h-6 bg-surface-container-low rounded w-full"></div>
                  </div>
                  <div className="h-12 bg-surface-container-low rounded w-full"></div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-4">
                <div className="h-5 bg-surface-container rounded w-1/4"></div>
                <div className="h-10 bg-surface-container-low rounded w-full"></div>
                <div className="h-10 bg-surface-container-low rounded w-full"></div>
                <div className="h-10 bg-surface-container-low rounded w-full"></div>
                <div className="h-10 bg-surface-container-low rounded w-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <DevStateLens
        activeId={analyticsState}
        label="Interventions State Lens"
        onSelect={(id) => setAnalyticsState(id as 'populated' | 'empty' | 'filtered-empty' | 'loading')}
        options={[
          { id: 'populated', label: '1. Populated (Michaelmas Wk 7)' },
          { id: 'empty', label: '2. Empty Term' },
          { id: 'filtered-empty', label: '3. Filtered-Zero' },
          { id: 'loading', label: '4. Telemetry Loading' },
        ]}
      />
    </>
  );
}
