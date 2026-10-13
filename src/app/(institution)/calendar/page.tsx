'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';

interface MilestoneCard {
  id: string;
  date: string;
  dayBadge: string;
  termWeek: string;
  term: 'michaelmas' | 'hilary' | 'trinity' | 'longvac';
  title: string;
  category: string;
  venue: string;
  audience: string;
  status: 'Confirmed' | 'Gazette Published' | 'Action Required' | 'Pending Senate';
  description: string;
}

export default function AcademicCalendarPage() {
  const [activeTerm, setActiveTerm] = useState<string>('michaelmas');

  const milestones: MilestoneCard[] = [
    {
      id: 'CAL-201',
      date: '13 Oct 2024',
      dayBadge: 'SUN',
      termWeek: 'Wk 1 Michaelmas',
      term: 'michaelmas',
      title: 'Michaelmas Term Full Term Begins',
      category: 'Term Schedule',
      venue: 'University Wide',
      audience: 'All Colleges & Departments',
      status: 'Confirmed',
      description: 'Official commencement of lectures and tutorial supervisions for Academic Year 2024–25.',
    },
    {
      id: 'CAL-202',
      date: '25 Nov 2024',
      dayBadge: 'MON',
      termWeek: 'Wk 7 Michaelmas',
      term: 'michaelmas',
      title: 'Formative Assessment Submission Deadline',
      category: 'Exam Deadline',
      venue: 'Examination Schools',
      audience: 'Finalist Undergraduates & PGT',
      status: 'Action Required',
      description: 'Final submission window for Michaelmas term-paper diagnostics across Humanities & MedSci.',
    },
    {
      id: 'CAL-203',
      date: '03 Dec 2024',
      dayBadge: 'TUE',
      termWeek: 'Wk 8 Michaelmas',
      term: 'michaelmas',
      title: 'Oxford Congregation Meeting on Statute VI',
      category: 'Governance',
      venue: 'Sheldonian Theatre',
      audience: 'Members of Congregation & Faculty Senate',
      status: 'Gazette Published',
      description: 'Formal vote on AI Supervision protocols and Socratic Knowledge Graph governance.',
    },
    {
      id: 'CAL-204',
      date: '07 Dec 2024',
      dayBadge: 'SAT',
      termWeek: 'End of Term',
      term: 'michaelmas',
      title: 'Michaelmas Full Term Ends',
      category: 'Term Schedule',
      venue: 'University Wide',
      audience: 'All Students & Academic Staff',
      status: 'Confirmed',
      description: 'Instructional period concludes; Christmas vacation tutorial reading begins.',
    },
    {
      id: 'CAL-205',
      date: '19 Jan 2025',
      dayBadge: 'SUN',
      termWeek: 'Wk 1 Hilary',
      term: 'hilary',
      title: 'Hilary Term Full Term Begins',
      category: 'Term Schedule',
      venue: 'University Wide',
      audience: 'All Colleges & Departments',
      status: 'Gazette Published',
      description: 'Commencement of Hilary Term lectures and tutorial series.',
    },
    {
      id: 'CAL-206',
      date: '08 Mar 2025',
      dayBadge: 'SAT',
      termWeek: 'Wk 7 Hilary',
      term: 'hilary',
      title: 'Degree Conferral Ceremony & Matriculation',
      category: 'Degree Ceremony',
      venue: 'Sheldonian Theatre',
      audience: 'Graduands & College Deans',
      status: 'Confirmed',
      description: 'Formal degree conferral ceremony presided over by the Vice-Chancellor.',
    },
  ];

  const filteredMilestones = milestones.filter(
    (m) => activeTerm === 'all' || m.term === activeTerm
  );

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl space-y-[var(--spacing-section-gap)] font-body-md text-on-surface">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
              University Almanac &amp; Governance
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            University Academic Calendar
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Official Oxford term schedules, Congregation votes, exam deadlines, and Gazette publications.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/25 px-4 py-2 rounded-xl flex items-center gap-4 text-xs">
          <div>
            <span className="text-on-surface-variant/70 block">Active Term Ticker</span>
            <span className="font-serif text-lg font-bold text-primary">Michaelmas Wk 7</span>
          </div>
        </div>
      </header>

      {/* TERM SELECTOR FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/25">
        <FilterBar
          activeId={activeTerm}
          onSelect={setActiveTerm}
          options={[
            { id: 'michaelmas', label: 'Michaelmas 2024' },
            { id: 'hilary', label: 'Hilary 2025' },
            { id: 'trinity', label: 'Trinity 2025' },
            { id: 'longvac', label: 'Long Vacation' },
            { id: 'all', label: 'All Terms' },
          ]}
          variant="pills"
        />
      </div>

      {/* CHRONOLOGICAL MILESTONE ROADMAP CARDS */}
      <div className="flex flex-col gap-space-md">
        {filteredMilestones.map((m) => (
          <article
            key={m.id}
            className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 hover:border-outline-variant/60 transition-all flex flex-col sm:flex-row gap-5 items-start"
          >
            {/* DATE BADGE COLUMN */}
            <div className="bg-surface-container-low px-4 py-3 rounded-lg border border-outline-variant/20 flex flex-col items-center justify-center shrink-0 min-w-[100px] text-center">
              <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-semibold">
                {m.dayBadge}
              </span>
              <span className="font-serif text-xl font-bold text-primary my-0.5">{m.date.split(' ')[0]} {m.date.split(' ')[1]}</span>
              <span className="font-mono text-[10px] text-on-surface-variant/70">{m.termWeek}</span>
            </div>

            {/* MILESTONE DETAILS COLUMN */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                  {m.category}
                </span>
                <span className="font-label-caps text-[11px] font-semibold text-primary">
                  {m.status}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-primary mt-1.5 leading-snug">
                {m.title}
              </h3>

              <p className="text-xs text-on-surface-variant/90 mt-1.5 leading-relaxed">
                {m.description}
              </p>

              <div className="mt-4 pt-3 border-t border-outline-variant/15 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-variant">
                <div>
                  <span>Venue: </span>
                  <span className="font-semibold text-on-surface">{m.venue}</span>
                  <span className="mx-2">•</span>
                  <span>Target: </span>
                  <span className="font-medium text-on-surface">{m.audience}</span>
                </div>

                <button
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  onClick={() => alert(`Opening Gazette notice for ${m.title}`)}
                  type="button"
                >
                  Gazette Notice <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
