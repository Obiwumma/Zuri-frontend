'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';

interface CollegeAllocation {
  name: string;
  enrolled: number;
  capacity: number;
  homePct: number;
  overseasPct: number;
  euPct: number;
  matriculatedPct: number;
}

export default function EnrollmentPage() {
  const [activeLevel, setActiveLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const colleges: CollegeAllocation[] = [
    {
      name: 'Christ Church',
      enrolled: 640,
      capacity: 650,
      homePct: 62,
      overseasPct: 28,
      euPct: 10,
      matriculatedPct: 99.4,
    },
    {
      name: 'Magdalen College',
      enrolled: 580,
      capacity: 600,
      homePct: 58,
      overseasPct: 32,
      euPct: 10,
      matriculatedPct: 99.1,
    },
    {
      name: 'Balliol College',
      enrolled: 520,
      capacity: 530,
      homePct: 65,
      overseasPct: 25,
      euPct: 10,
      matriculatedPct: 98.8,
    },
    {
      name: 'Trinity College',
      enrolled: 430,
      capacity: 440,
      homePct: 60,
      overseasPct: 30,
      euPct: 10,
      matriculatedPct: 99.6,
    },
    {
      name: 'St John\'s College',
      enrolled: 690,
      capacity: 700,
      homePct: 64,
      overseasPct: 26,
      euPct: 10,
      matriculatedPct: 99.2,
    },
    {
      name: 'New College',
      enrolled: 610,
      capacity: 620,
      homePct: 61,
      overseasPct: 29,
      euPct: 10,
      matriculatedPct: 99.5,
    },
  ];

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl space-y-[var(--spacing-section-gap)] font-body-md text-on-surface">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
              Admissions &amp; Matriculation
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            Collegiate Student Enrollment Console
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Matriculation census across 38 constituent Oxford Colleges, fee classification, and cohort allocation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-surface-container-lowest border border-outline-variant/25 px-4 py-2 rounded-xl flex items-center gap-4 text-xs">
            <div>
              <span className="text-on-surface-variant/70 block">Total Enrolled</span>
              <span className="font-serif text-lg font-bold text-primary">24,180</span>
            </div>
            <div className="h-6 w-px bg-outline-variant/30"></div>
            <div>
              <span className="text-on-surface-variant/70 block">Matriculated</span>
              <span className="font-serif text-lg font-bold text-secondary">99.2%</span>
            </div>
          </div>
        </div>
      </header>

      {/* ENROLLMENT LEVEL FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/25">
        <FilterBar
          activeId={activeLevel}
          onSelect={setActiveLevel}
          options={[
            { id: 'all', label: 'All Students (24,180)' },
            { id: 'ug', label: 'Undergraduate (12,840)' },
            { id: 'pgt', label: 'PG Taught (6,120)' },
            { id: 'pgr', label: 'PG Research (5,220)' },
          ]}
          variant="pills"
        />

        <input
          className="w-64 bg-surface-container-low text-on-surface font-ui-functional text-xs py-1.5 px-3 rounded-lg border border-outline-variant/30 outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
          placeholder="Search college or SSO ID..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CONSTITUENT COLLEGE ALLOCATION CARDS GRID */}
      <div>
        <div className="pb-3 mb-4 border-b border-outline-variant/20 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-primary">Constituent College Allocation Census</h2>
          <span className="text-xs text-on-surface-variant/70 font-medium">38 Oxford Colleges Synced</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
          {colleges
            .filter((c) => searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((col) => {
              const filledPct = Math.round((col.enrolled / col.capacity) * 100);
              return (
                <article
                  key={col.name}
                  className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 hover:border-outline-variant/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-serif text-base font-bold text-primary">{col.name}</h3>
                      <span className="font-mono text-xs font-semibold text-secondary">{filledPct}% Capacity</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-on-surface-variant/80 mb-2">
                      <span>Enrolled Students:</span>
                      <span className="font-semibold text-on-surface">{col.enrolled} / {col.capacity}</span>
                    </div>

                    <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden mb-4">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${filledPct}%` }}></div>
                    </div>

                    {/* FEE CLASSIFICATION STACK */}
                    <div className="space-y-1.5 pt-3 border-t border-outline-variant/15 text-xs">
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary"></span> Home / UK:
                        </span>
                        <span className="font-medium text-on-surface">{col.homePct}%</span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-secondary"></span> Overseas:
                        </span>
                        <span className="font-medium text-on-surface">{col.overseasPct}%</span>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-outline"></span> EU Settled:
                        </span>
                        <span className="font-medium text-on-surface">{col.euPct}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                    <span className="text-secondary font-medium">Matriculated: {col.matriculatedPct}%</span>
                    <button
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                      onClick={() => alert(`Opening enrollment roster for ${col.name}`)}
                      type="button"
                    >
                      Roster <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    </div>
  );
}
