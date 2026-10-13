'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';

interface ActivityItem {
  id: string;
  timeAgo: string;
  category: 'intervention' | 'knowledge' | 'assessment' | 'supervision';
  title: string;
  division: string;
  moduleCode: string;
  description: string;
  statusBadge: string;
  contact: string;
}

export default function AcademicActivityPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeDivision, setActiveDivision] = useState<string>('all');

  const activities: ActivityItem[] = [
    {
      id: 'ACT-9041',
      timeAgo: '12 min ago',
      category: 'intervention',
      title: 'Cellular Signalling Diagnostic Anomaly Flagged',
      division: 'Medical Sciences Division',
      moduleCode: 'BIO-410',
      description: '18 tutorial students flagged for receptor pathway remediation prior to Friday seminar.',
      statusBadge: 'Urgent Triage',
      contact: 'Prof. Alistair MacIntyre',
    },
    {
      id: 'ACT-9040',
      timeAgo: '28 min ago',
      category: 'knowledge',
      title: 'Lecture Transcript & Primary Sources Ingested',
      division: 'Humanities Division',
      moduleCode: 'HIST-302',
      description: 'Late Imperial Diplomacy primary source corpus ingested and semantically mapped into Knowledge Graph.',
      statusBadge: 'Ingestion Complete',
      contact: 'Dr. Helena Vance',
    },
    {
      id: 'ACT-9039',
      timeAgo: '45 min ago',
      category: 'assessment',
      title: 'Quantum Information Formative Assessment Completed',
      division: 'MPLS Division',
      moduleCode: 'CS-501',
      description: '142 students completed formative diagnostic test with 91.2% threshold mastery.',
      statusBadge: 'Automated Verified',
      contact: 'Prof. Sarah Jenkins',
    },
    {
      id: 'ACT-9038',
      timeAgo: '1 hr ago',
      category: 'supervision',
      title: 'Senior Tutor Tutorial Group Review Conducted',
      division: 'Social Sciences Division',
      moduleCode: 'ECON-204',
      description: 'Michaelmas Term tutorial group 4 review logged by Senior Tutor with 0 remediation flags.',
      statusBadge: 'Triaged',
      contact: 'Dr. Marcus Holloway',
    },
    {
      id: 'ACT-9037',
      timeAgo: '2 hrs ago',
      category: 'intervention',
      title: 'Clinical Neurology Concept Gap surfeaced',
      division: 'Medical Sciences Division',
      moduleCode: 'MED-601',
      description: 'Early-warning Socratic dialogue session flagged synaptic transmission understanding gap.',
      statusBadge: 'In Remediation',
      contact: 'Prof. Eleanor Vance',
    },
  ];

  const filteredActivities = activities.filter((act) => {
    const matchCat = activeCategory === 'all' || act.category === activeCategory;
    const matchDiv =
      activeDivision === 'all' || act.division.toLowerCase().includes(activeDivision.toLowerCase());
    return matchCat && matchDiv;
  });

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl space-y-[var(--spacing-section-gap)] font-body-md text-on-surface">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
              Live Telemetry Ledger
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            Academic Activity Stream
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Real-time collegiate activity feed across Oxford tutorial groups, lecture halls, and assessment engines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container-low px-3.5 py-1.5 rounded-full border border-outline-variant/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary">sensors</span>
            <span className="font-ui-functional text-xs font-semibold text-on-surface">2,840 Events Today</span>
          </div>
        </div>
      </header>

      {/* FILTER CONTROL BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/25">
        <FilterBar
          activeId={activeCategory}
          onSelect={setActiveCategory}
          options={[
            { id: 'all', label: 'All Telemetry' },
            { id: 'intervention', label: 'Interventions' },
            { id: 'knowledge', label: 'Knowledge Ingests' },
            { id: 'assessment', label: 'Assessments' },
            { id: 'supervision', label: 'Supervision Notes' },
          ]}
          variant="pills"
        />

        <select
          className="bg-surface-container-low text-on-surface font-ui-functional text-xs py-1.5 px-3 rounded-lg border border-outline-variant/30 outline-none cursor-pointer hover:bg-surface-container"
          value={activeDivision}
          onChange={(e) => setActiveDivision(e.target.value)}
        >
          <option value="all">All Divisions</option>
          <option value="Medical">Medical Sciences</option>
          <option value="Humanities">Humanities</option>
          <option value="MPLS">MPLS</option>
          <option value="Social">Social Sciences</option>
        </select>
      </div>

      {/* SPLIT LAYOUT: TIMELINE FEED (LEFT 8 COLS) + DIVISION TELEMETRY HEAT (RIGHT 4 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-gutter)] items-start">
        {/* LEFT COLUMN: EDITORIAL ACTIVITY STREAM */}
        <section className="lg:col-span-8 flex flex-col gap-space-md">
          {filteredActivities.map((act) => {
            const getIcon = () => {
              switch (act.category) {
                case 'intervention':
                  return 'crisis_alert';
                case 'knowledge':
                  return 'menu_book';
                case 'assessment':
                  return 'fact_check';
                case 'supervision':
                  return 'person_apron';
              }
            };

            const getIconBg = () => {
              switch (act.category) {
                case 'intervention':
                  return 'bg-error-container/40 text-error';
                case 'knowledge':
                  return 'bg-secondary-fixed/50 text-secondary';
                case 'assessment':
                  return 'bg-primary-fixed/50 text-primary';
                case 'supervision':
                  return 'bg-surface-container-high text-on-surface-variant';
              }
            };

            return (
              <article
                key={act.id}
                className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 hover:border-outline-variant/60 transition-all flex gap-4 items-start"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${getIconBg()}`}>
                  <span className="material-symbols-outlined text-[20px]">{getIcon()}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">{act.moduleCode} • {act.id}</span>
                    <time className="font-label-caps text-[11px] text-on-surface-variant/70">{act.timeAgo}</time>
                  </div>

                  <h3 className="font-serif text-base font-bold text-on-surface mt-1 leading-snug">
                    {act.title}
                  </h3>

                  <p className="font-body-md text-xs text-on-surface-variant/90 mt-1.5 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-outline-variant/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-surface-container font-medium text-secondary text-[11px]">
                        {act.division}
                      </span>
                      <span className="text-on-surface-variant/70">Lead: {act.contact}</span>
                    </div>

                    <span className="font-ui-functional text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-surface-container-high text-on-surface">
                      {act.statusBadge}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* RIGHT COLUMN: DIVISION PULSE & SUMMARY WIDGETS */}
        <aside className="lg:col-span-4 flex flex-col gap-space-md">
          {/* DIVISION PULSE HEAT */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-primary">Division Activity Heat</h3>
              <span className="material-symbols-outlined text-[18px] text-secondary">insights</span>
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-on-surface">Medical Sciences</span>
                  <span className="text-secondary font-semibold">912 events</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-on-surface">Humanities Division</span>
                  <span className="text-secondary font-semibold">784 events</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-on-surface">MPLS Division</span>
                  <span className="text-secondary font-semibold">640 events</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-on-surface">Social Sciences</span>
                  <span className="text-secondary font-semibold">504 events</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* TELEMETRY NOTICE CARD */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-col gap-2">
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-semibold">
              Live Audit Log
            </span>
            <p className="font-body-md text-xs text-on-surface-variant leading-normal">
              Telemetry events are cryptographically recorded into the Oxford Academic Ledger. Senior Tutors receive real-time alerts for diagnostic anomalies.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
