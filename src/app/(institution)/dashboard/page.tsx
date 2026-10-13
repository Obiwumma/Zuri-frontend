'use client';

import React, { useState } from 'react';
import { KpiTile } from '@/components/ui/KpiTile';
import { DataTable, Column } from '@/components/ui/DataTable';
import { FilterBar } from '@/components/ui/FilterBar';
import { DevStateLens } from '@/components/ui/DevStateLens';

interface DivisionData {
  division: string;
  subfields: string;
  enrolment: string;
  curriculumIngestedPct: number;
  weeklyInterventions: string;
  interventionsStatus: string;
  quizMastery: string;
  contact: string;
}

export default function InstitutionDashboardPage() {
  const [dashboardState, setDashboardState] = useState<'populated' | 'onboarding' | 'loading'>('populated');
  const [activityCategory, setActivityCategory] = useState<string>('all');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [activeRole, setActiveRole] = useState<string>('admin');

  const triggerSyncSimulation = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const divisionData: DivisionData[] = [
    {
      division: 'Humanities Division',
      subfields: 'Philosophy, History, Classics & Lit',
      enrolment: '4,810',
      curriculumIngestedPct: 96.8,
      weeklyInterventions: '31 alerts',
      interventionsStatus: '100% triaged',
      quizMastery: '89.2%',
      contact: 'Prof. Alistair MacIntyre',
    },
    {
      division: 'Mathematical, Physical & Life Sciences (MPLS)',
      subfields: 'Engineering, Physics, CompSci, Maths',
      enrolment: '5,420',
      curriculumIngestedPct: 92.4,
      weeklyInterventions: '54 alerts',
      interventionsStatus: '8 pending tutor',
      quizMastery: '84.8%',
      contact: 'Dr. Fiona Campbell',
    },
    {
      division: 'Medical Sciences Division',
      subfields: 'Clinical Medicine, Pharmacology, Neuro',
      enrolment: '3,650',
      curriculumIngestedPct: 98.1,
      weeklyInterventions: '38 alerts',
      interventionsStatus: '4 under review',
      quizMastery: '91.4%',
      contact: 'Prof. Kenneth Thorne',
    },
    {
      division: 'Social Sciences Division',
      subfields: 'Law, Economics, Politics & IR',
      enrolment: '4,540',
      curriculumIngestedPct: 95.0,
      weeklyInterventions: '19 alerts',
      interventionsStatus: '100% resolved',
      quizMastery: '88.1%',
      contact: 'Dr. Harriet Vane-Smythe',
    },
  ];

  const divisionColumns: Column<DivisionData>[] = [
    {
      header: 'Academic Division',
      accessor: (row) => (
        <div className="font-semibold text-primary">
          {row.division}
          <span className="block font-normal text-[12px] text-on-surface-variant">{row.subfields}</span>
        </div>
      ),
    },
    {
      header: 'Active Enrolment',
      accessor: (row) => <span className="text-on-surface">{row.enrolment}</span>,
    },
    {
      header: 'Curriculum Ingested',
      accessor: (row) => (
        <div className="flex items-center gap-space-xs">
          <span className="text-on-surface font-medium">{row.curriculumIngestedPct}%</span>
          <div className="w-16 bg-surface-container rounded-full h-1">
            <div className="bg-primary h-1 rounded-full" style={{ width: `${row.curriculumIngestedPct}%` }}></div>
          </div>
        </div>
      ),
    },
    {
      header: 'Weekly Interventions',
      accessor: (row) => (
        <div>
          <span className="font-medium text-secondary">{row.weeklyInterventions}</span>
          <span className="text-[11px] text-on-surface-variant block">{row.interventionsStatus}</span>
        </div>
      ),
    },
    {
      header: 'Quiz Mastery',
      accessor: (row) => <span className="text-on-surface font-semibold">{row.quizMastery}</span>,
    },
    {
      header: 'Lead Academic Contact',
      accessor: (row) => <span className="text-on-surface-variant text-[13px]">{row.contact}</span>,
    },
  ];

  return (
    <>
      <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl">
        <div className="flex flex-col w-full">
          {/* STATE 1: POPULATED ACTIVE TERM VIEW */}
          {dashboardState === 'populated' && (
            <div className="flex flex-col w-full space-y-[var(--spacing-gutter)]" id="view-populated">
              {/* Page Header */}
              <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-4 border-b border-outline-variant/20">
                <div className="flex-1 w-full min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
                    <span className="font-label-caps text-[11px] uppercase tracking-widest text-secondary font-medium">Institution Overview</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-serif text-primary tracking-tight font-bold leading-tight break-words">Good morning, University of Oxford.</h1>
                  <p className="mt-1.5 font-body-md text-xs sm:text-sm text-on-surface-variant/80 leading-relaxed max-w-3xl">
                    Current collegiate snapshot of academic activity, student interventions, and Lexi-supported learning across all 8 collegiate divisions as of 08:30 AM GMT.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full xl:w-auto pt-2 xl:pt-0">
                  <div className="relative w-full sm:w-auto sm:min-w-[180px]">
                    <select
                      aria-label="Academic Term Selector"
                      className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/25 text-on-surface font-ui-functional text-xs sm:text-sm py-2 pl-3 pr-8 rounded-lg outline-none cursor-pointer hover:bg-surface transition-colors"
                      defaultValue="Michaelmas 2024–25"
                    >
                      <option value="Michaelmas 2024–25">Michaelmas 2024–25</option>
                      <option value="Hilary 2024–25">Hilary 2024–25 (Upcoming)</option>
                      <option value="Trinity 2023–24">Trinity 2023–24 (Archival)</option>
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">expand_more</span>
                  </div>
                  <button
                    className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/20 text-on-surface hover:bg-surface-container px-3.5 py-2 rounded-lg font-ui-functional text-xs sm:text-sm transition-colors cursor-pointer"
                    onClick={triggerSyncSimulation}
                    type="button"
                  >
                    <span className={`material-symbols-outlined text-[16px] text-secondary ${isSyncing ? 'animate-spin' : ''}`} id="sync-icon">sync</span>
                    <span className="whitespace-nowrap">Refresh Live Signals</span>
                  </button>
                  <button className="flex-1 sm:flex-initial justify-center flex items-center gap-1.5 bg-primary text-on-primary hover:bg-primary-container px-3.5 py-2 rounded-lg font-ui-functional text-xs sm:text-sm transition-colors font-medium shadow-xs cursor-pointer" type="button">
                    <span className="material-symbols-outlined text-[16px]">article</span>
                    <span className="whitespace-nowrap">Term Report</span>
                  </button>
                </div>
              </header>

              {/* Component 2: KPI Metric Cards Grid (using KpiTile) */}
              <section aria-label="Key Institutional Indicators" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-gutter)] mb-[var(--spacing-gutter)]">
                <KpiTile
                  icon="school"
                  label="Active Students"
                  progressWidth="99.1%"
                  subtext={<>Enrolled across 38 colleges & PPHs • <span className="text-on-surface font-semibold">99.1%</span> identity sync</>}
                  trend="+2.4%"
                  trendDirection="up"
                  value="18,420"
                />
                <KpiTile
                  icon="supervisor_account"
                  label="Active Lecturers"
                  progressWidth="94.2%"
                  subtext={<>Across 34 faculties • <span className="text-on-surface font-semibold">412</span> tutorial fellows active today</>}
                  trend="94.2%"
                  trendDirection="neutral"
                  value="1,248"
                />
                <KpiTile
                  icon="psychology_alt"
                  label="Interventions This Week"
                  progressWidth="76%"
                  subtext={<><span className="text-on-surface font-semibold">76%</span> within 48h protocol • 12 tutorial review pending</>}
                  trend="-18% wk 5"
                  trendDirection="down"
                  value="142"
                />
                <KpiTile
                  icon="fact_check"
                  label="Quiz Success Rate"
                  progressWidth="87.6%"
                  subtext={<>Across <span className="text-on-surface font-semibold">4,890</span> formative module assessments this term</>}
                  trend="+3.1%"
                  trendDirection="up"
                  value="87.6%"
                />
              </section>

              {/* Main Content Asymmetric 7:5 Composition */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)] items-start">
                {/* Left Column: Editorial Activity Stream (~7 cols) */}
                <section className="lg:col-span-7 bg-surface-container-lowest rounded-lg p-space-lg flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
                    <div>
                      <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">Telemetry Ledger</span>
                      <h2 className="font-headline-sm text-headline-sm font-serif text-primary">Academic Activity Stream</h2>
                    </div>

                    {/* Component 4: FilterBar (Pills for Activity Stream) */}
                    <FilterBar
                      activeId={activityCategory}
                      onSelect={(id) => setActivityCategory(id)}
                      options={[
                        { id: 'all', label: 'All' },
                        { id: 'intervention', label: 'Interventions' },
                        { id: 'knowledge', label: 'Lectures' },
                        { id: 'quiz', label: 'Quizzes' },
                      ]}
                      variant="pills"
                    />
                  </div>

                  {/* Activity Timeline Entries */}
                  <div className="flex flex-col space-y-space-md" id="activity-stream-items">
                    {/* Item A */}
                    {(activityCategory === 'all' || activityCategory === 'intervention') && (
                      <article className="activity-entry p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex gap-space-md items-start">
                        <div className="w-9 h-9 rounded-full bg-secondary-fixed/50 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px] text-secondary">crisis_alert</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-space-sm">
                            <span className="font-label-caps text-[11px] text-secondary uppercase font-semibold">Intervention Surfaced</span>
                            <time className="font-label-caps text-[11px] text-on-surface-variant">18 min ago</time>
                          </div>
                          <h3 className="font-ui-functional text-ui-functional font-bold text-on-surface mt-0.5 truncate">
                            Cellular Signalling Diagnostic Anomaly • BIO-410
                          </h3>
                          <p className="font-body-md text-[14px] text-on-surface-variant mt-1 leading-normal">
                            Department of Molecular Medicine. Diagnostic trigger: 18 tutorial students flagged for receptor pathway remediation before Friday seminar.
                          </p>
                          <div className="mt-space-xs flex items-center gap-space-sm text-[12px] font-ui-functional">
                            <span className="inline-flex items-center gap-1 text-secondary font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Notified Senior Tutor
                            </span>
                            <span className="text-outline">•</span>
                            <span className="text-on-surface-variant">Balliol & Magdalen Cohorts</span>
                          </div>
                        </div>
                      </article>
                    )}

                    {/* Item B */}
                    {(activityCategory === 'all' || activityCategory === 'knowledge') && (
                      <article className="activity-entry p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex gap-space-md items-start">
                        <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px] text-primary">auto_stories</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-space-sm">
                            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">Lecture Processed • Knowledge Indexed</span>
                            <time className="font-label-caps text-[11px] text-on-surface-variant">42 min ago</time>
                          </div>
                          <h3 className="font-ui-functional text-ui-functional font-bold text-on-surface mt-0.5 truncate">
                            Late Imperial Diplomacy (1890–1914) • HIST-204
                          </h3>
                          <p className="font-body-md text-[14px] text-on-surface-variant mt-1 leading-normal">
                            Faculty of History. Prof. Julian Sterling's audio capture and transcript parsed into archival knowledge graph (48 concepts extracted, 12 citation cross-references).
                          </p>
                          <div className="mt-space-xs flex items-center gap-space-sm text-[12px] font-ui-functional">
                            <span className="text-on-surface-variant font-medium">Indexed to Michaelmas Week 7 Syllabus</span>
                            <span className="text-outline">•</span>
                            <span className="text-secondary">Ready for Socratic Q&A</span>
                          </div>
                        </div>
                      </article>
                    )}

                    {/* Item C */}
                    {(activityCategory === 'all' || activityCategory === 'quiz') && (
                      <article className="activity-entry p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex gap-space-md items-start">
                        <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px] text-primary">psychology</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-space-sm">
                            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">Formative Assessment Calibrated</span>
                            <time className="font-label-caps text-[11px] text-on-surface-variant">1h 15m ago</time>
                          </div>
                          <h3 className="font-ui-functional text-ui-functional font-bold text-on-surface mt-0.5 truncate">
                            Logic & Dialectic Adaptive Problem Set • PHIL-101
                          </h3>
                          <p className="font-body-md text-[14px] text-on-surface-variant mt-1 leading-normal">
                            Faculty of Philosophy. 12-question formative assessment generated and automatically cross-validated against Michael's Term week 7 modal logic milestones.
                          </p>
                          <div className="mt-space-xs flex items-center gap-space-sm text-[12px] font-ui-functional">
                            <span className="text-on-surface-variant">Available across 14 College Sub-groups</span>
                          </div>
                        </div>
                      </article>
                    )}

                    {/* Item D */}
                    {(activityCategory === 'all' || activityCategory === 'knowledge') && (
                      <article className="activity-entry p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex gap-space-md items-start">
                        <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px] text-primary">folder_supervised</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-space-sm">
                            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">Curricular Packet Ingested</span>
                            <time className="font-label-caps text-[11px] text-on-surface-variant">2h 30m ago</time>
                          </div>
                          <h3 className="font-ui-functional text-ui-functional font-bold text-on-surface mt-0.5 truncate">
                            Advanced Fluid Dynamics Syllabus & Problem Sheets • ENG-320
                          </h3>
                          <p className="font-body-md text-[14px] text-on-surface-variant mt-1 leading-normal">
                            Department of Engineering Science. Mathematical notation and Navier-Stokes tensor formulations validated for multi-modal student tutoring.
                          </p>
                          <div className="mt-space-xs flex items-center gap-space-sm text-[12px] font-ui-functional">
                            <span className="text-on-surface-variant">Parsed via Lexi MathEngine v3.4</span>
                          </div>
                        </div>
                      </article>
                    )}

                    {/* Item E */}
                    {(activityCategory === 'all' || activityCategory === 'timetable') && (
                      <article className="activity-entry p-space-md rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex gap-space-md items-start">
                        <div className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-space-sm">
                            <span className="font-label-caps text-[11px] text-on-surface-variant uppercase font-semibold">Timetable Reconciliation Complete</span>
                            <time className="font-label-caps text-[11px] text-on-surface-variant">3h 10m ago</time>
                          </div>
                          <h3 className="font-ui-functional text-ui-functional font-bold text-on-surface mt-0.5 truncate">
                            Term 2 Examination Schedule Matrix • Sub-Faculty of Languages
                          </h3>
                          <p className="font-body-md text-[14px] text-on-surface-variant mt-1 leading-normal">
                            42 tutorial conflict checks performed across Examination Schools halls. Zero room collision anomalies detected.
                          </p>
                        </div>
                      </article>
                    )}
                  </div>
                  <div className="pt-space-sm flex justify-start">
                    <a className="inline-flex items-center gap-space-xs text-primary hover:text-secondary font-ui-functional text-ui-functional font-semibold transition-colors" href="#">
                      <span>View Complete Institutional Activity Ledger</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </a>
                  </div>
                </section>

                {/* Right Column: Academic Operations & Intelligence (~5 cols) */}
                <section className="lg:col-span-5 flex flex-col gap-space-md">
                  {/* Quick Access Priority Panel */}
                  <div className="bg-surface-container-lowest rounded-lg p-space-lg flex flex-col gap-space-md">
                    <div className="flex items-center justify-between pb-space-xs">
                      <div>
                        <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">Mission Control</span>
                        <h2 className="font-headline-sm text-headline-sm font-serif text-primary">Academic Intelligence</h2>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant text-[22px]">hub</span>
                    </div>
                    <div className="flex flex-col gap-space-xs">
                      {/* Link 1 */}
                      <a className="group p-space-sm rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-between" href="/analytics/interventions">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">emergency_heat</span>
                          </div>
                          <div>
                            <h4 className="font-ui-functional text-ui-functional font-bold text-on-surface group-hover:text-primary">Intervention Analytics</h4>
                            <p className="font-body-md text-[12px] text-on-surface-variant">Early warning signals & tutorial triage queues</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-caps text-[11px] bg-secondary-fixed/50 text-on-secondary-fixed font-semibold px-2 py-0.5 rounded">12 Pending</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </div>
                      </a>
                      {/* Link 2 */}
                      <a className="group p-space-sm rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-between" href="/analytics/ai-usage">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">neurology</span>
                          </div>
                          <div>
                            <h4 className="font-ui-functional text-ui-functional font-bold text-on-surface group-hover:text-primary">AI Usage & Adoption</h4>
                            <p className="font-body-md text-[12px] text-on-surface-variant">Curriculum indexing & faculty pedagogical volume</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-caps text-[11px] bg-surface-container text-on-surface font-semibold px-2 py-0.5 rounded">94% Active</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </div>
                      </a>
                      {/* Link 3 */}
                      <a className="group p-space-sm rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-between" href="/analytics/quiz-performance">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">quiz</span>
                          </div>
                          <div>
                            <h4 className="font-ui-functional text-ui-functional font-bold text-on-surface group-hover:text-primary">Quiz Performance & Mastery</h4>
                            <p className="font-body-md text-[12px] text-on-surface-variant">Difficulty index & student misconception clusters</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-caps text-[11px] bg-surface-container text-on-surface font-semibold px-2 py-0.5 rounded">87.6% Avg</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </div>
                      </a>
                      {/* Link 4 */}
                      <a className="group p-space-sm rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-between" href="/students">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">groups</span>
                          </div>
                          <div>
                            <h4 className="font-ui-functional text-ui-functional font-bold text-on-surface group-hover:text-primary">Student Directory</h4>
                            <p className="font-body-md text-[12px] text-on-surface-variant">Matriculation rosters & tutorial fellowship links</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-caps text-[11px] bg-surface-container text-on-surface font-semibold px-2 py-0.5 rounded">18.4k</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </div>
                      </a>
                      {/* Link 5 */}
                      <a className="group p-space-sm rounded-lg hover:bg-surface-container-low transition-all flex items-center justify-between" href="/courses">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                            <span className="material-symbols-outlined text-[18px]">menu_book</span>
                          </div>
                          <div>
                            <h4 className="font-ui-functional text-ui-functional font-bold text-on-surface group-hover:text-primary">Course & Curriculum Graphs</h4>
                            <p className="font-body-md text-[12px] text-on-surface-variant">Active modules, lecture archives & cross-faculties</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-space-xs">
                          <span className="font-label-caps text-[11px] bg-surface-container text-on-surface font-semibold px-2 py-0.5 rounded">412 Mod</span>
                          <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Curated Archival Botanical / Academic Highlight Box */}
                  <div className="bg-surface-container-low rounded-lg p-space-lg relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                      <div className="flex items-center gap-space-xs text-secondary font-label-caps text-label-caps uppercase">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>InCommon Federation Cryptographic Telemetry</span>
                      </div>
                      <h3 className="font-headline-sm text-[20px] font-serif text-primary mt-1">Radcliffe Science Knowledge Graph</h3>
                      <p className="font-body-md text-[13px] text-on-surface-variant mt-2">
                        Lexi neural indexing verified 98.4% of Michaelmas stem lecture audio streams without pedagogical hallucination flags.
                      </p>
                    </div>
                    <div className="relative z-10 mt-space-md pt-space-sm flex items-center justify-between">
                      <div className="flex items-center gap-space-xs">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                        <span className="font-ui-functional text-[12px] font-semibold text-on-surface">Synapse 4.2 Engine Live</span>
                      </div>
                      <span className="font-label-caps text-[11px] text-outline">Latency &lt;42ms</span>
                    </div>
                  </div>
                </section>
              </div>

              {/* Component 3: DataTable (Cross-Faculty Health Telemetry Snapshot) */}
              <DataTable
                categoryLabel="Cross-Division Comparative"
                columns={divisionColumns}
                data={divisionData}
                keyExtractor={(row) => row.division}
                subtitle="Weekly aggregate health metrics across the four Oxford academic divisions"
                title="Academic Division Telemetry"
              />
            </div>
          )}

          {/* STATE 2: ONBOARDING / EMPTY STATE VIEW */}
          {dashboardState === 'onboarding' && (
            <div className="flex flex-col w-full space-y-space-xl" id="view-onboarding">
              <header className="flex flex-col md:flex-row md:items-start justify-between gap-space-lg pb-space-lg">
                <div className="flex-1 min-w-0 max-w-4xl">
                  <div className="flex items-center gap-space-xs mb-space-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="font-label-caps text-label-caps uppercase tracking-widest text-secondary font-semibold">Collegiate Initialization • Michaelmas Term 2024–25</span>
                  </div>
                  <h1 className="text-display-lg font-serif text-primary tracking-tight">Welcome to Lexi, Oxford Administration.</h1>
                  <p className="mt-space-xs font-body-md text-body-md text-on-surface-variant max-w-2xl leading-relaxed">
                    Your institution tenant has been provisioned under InCommon Federation SSO. Begin by ingesting academic course syllabi or enrolling department administrators.
                  </p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <button className="flex items-center gap-space-xs bg-primary text-on-primary hover:bg-primary-container px-space-md py-2 rounded-lg font-ui-functional text-ui-functional transition-colors" type="button">
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                    <span>Import Curriculum Dossier</span>
                  </button>
                </div>
              </header>

              <section className="bg-surface-container-lowest rounded-lg p-space-xl flex flex-col md:flex-row items-center gap-space-xl">
                <div className="flex-1 space-y-space-md">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary">Step 1 of 3: Initial Setup</span>
                  <h2 className="font-headline-md text-headline-md font-serif text-primary">Establish Your Academic Divisions & Knowledge Repositories</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Lexi automatically parses timetable feeds, lecture recordings, and tutorial reading lists into unified cognitive models for your students. To begin observing activity, populate your first department or invite divisional Heads of Department.
                  </p>
                  <div className="pt-space-xs flex flex-wrap items-center gap-space-md">
                    <button className="bg-primary text-on-primary hover:bg-primary-container px-space-md py-2.5 rounded-lg font-ui-functional text-ui-functional font-semibold transition-colors flex items-center gap-space-xs" type="button">
                      <span className="material-symbols-outlined text-[18px]">group_add</span>
                      <span>Invite Department Heads</span>
                    </button>
                    <button className="bg-surface-container text-on-surface hover:bg-surface-container-high px-space-md py-2.5 rounded-lg font-ui-functional text-ui-functional transition-colors flex items-center gap-space-xs" type="button">
                      <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                      <span>Browse Setup Guidebook</span>
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-80 bg-surface-container-low p-space-lg rounded-lg shrink-0">
                  <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-surface-variant">Federation Status</span>
                  <div className="mt-space-sm space-y-space-sm">
                    <div className="flex items-center justify-between text-[13px] font-ui-functional">
                      <span className="text-on-surface-variant">SAML 2.0 InCommon:</span>
                      <span className="font-semibold text-secondary">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px] font-ui-functional">
                      <span className="text-on-surface-variant">Student Identity Sync:</span>
                      <span className="font-semibold text-on-surface">Standing By</span>
                    </div>
                    <div className="flex items-center justify-between text-[13px] font-ui-functional">
                      <span className="text-on-surface-variant">Syllabus Indexing:</span>
                      <span className="font-semibold text-on-surface">0 / 412 Modules</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="bg-surface-container-lowest p-space-lg rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-[28px]">import_contacts</span>
                  <h3 className="font-headline-sm text-[18px] font-serif text-primary mt-space-sm">Upload Syllabus Packet</h3>
                  <p className="font-body-md text-[13px] text-on-surface-variant mt-space-xs">
                    Drop PDF or DOCX course handbooks. Lexi converts them into structured knowledge trees and formative milestones.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-lg rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-[28px]">calendar_view_week</span>
                  <h3 className="font-headline-sm text-[18px] font-serif text-primary mt-space-sm">Link Collegiate Timetables</h3>
                  <p className="font-body-md text-[13px] text-on-surface-variant mt-space-xs">
                    Synchronize term lecture timetables to activate automated post-lecture Socratic diagnostic quizzes.
                  </p>
                </div>
                <div className="bg-surface-container-lowest p-space-lg rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-[28px]">health_and_safety</span>
                  <h3 className="font-headline-sm text-[18px] font-serif text-primary mt-space-sm">Configure Early Triage Protocols</h3>
                  <p className="font-body-md text-[13px] text-on-surface-variant mt-space-xs">
                    Define tutorial intervention criteria: threshold scores, attendance signals, and cognitive distress alerts.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: TELEMETRY LOADING STATE */}
          {dashboardState === 'loading' && (
            <div className="flex flex-col w-full space-y-space-xl" id="view-loading">
              <header className="pb-space-lg flex flex-col gap-space-sm">
                <div className="h-3 w-48 bg-surface-container-high rounded animate-pulse"></div>
                <div className="h-10 w-96 bg-surface-container-highest rounded animate-pulse"></div>
                <div className="h-4 w-2/3 bg-surface-container-high rounded animate-pulse"></div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-surface-container-lowest p-space-lg rounded-lg space-y-space-md animate-pulse">
                    <div className="flex justify-between">
                      <div className="h-3 w-20 bg-surface-container rounded"></div>
                      <div className="w-5 h-5 bg-surface-container rounded-full"></div>
                    </div>
                    <div className="h-8 w-28 bg-surface-container-highest rounded"></div>
                    <div className="h-3 w-36 bg-surface-container rounded"></div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-lg p-space-lg space-y-space-md animate-pulse">
                  <div className="h-5 w-48 bg-surface-container rounded"></div>
                  <div className="space-y-space-sm">
                    <div className="h-20 bg-surface-container-low rounded-lg"></div>
                    <div className="h-20 bg-surface-container-low rounded-lg"></div>
                    <div className="h-20 bg-surface-container-low rounded-lg"></div>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-lg p-space-lg space-y-space-md animate-pulse">
                  <div className="h-5 w-40 bg-surface-container rounded"></div>
                  <div className="space-y-space-xs">
                    <div className="h-12 bg-surface-container-low rounded"></div>
                    <div className="h-12 bg-surface-container-low rounded"></div>
                    <div className="h-12 bg-surface-container-low rounded"></div>
                    <div className="h-12 bg-surface-container-low rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <DevStateLens
        activeId={dashboardState}
        label="Dashboard State Lens"
        onSelect={(id) => setDashboardState(id as 'populated' | 'onboarding' | 'loading')}
        options={[
          { id: 'populated', label: '1. Populated (Active Term)' },
          { id: 'onboarding', label: '2. First-Term Onboarding' },
          { id: 'loading', label: '3. Telemetry Loading' },
        ]}
      />
    </>
  );
}
