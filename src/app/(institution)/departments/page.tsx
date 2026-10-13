'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';

interface DepartmentCard {
  code: string;
  name: string;
  division: string;
  hodName: string;
  hodTitle: string;
  programmesCount: number;
  enrolledCount: number;
  curriculumIngestedPct: number;
  engagementStatus: 'Optimal' | 'High' | 'Moderate';
  subfields: string;
  icon: string;
}

export default function DepartmentsPage() {
  const [activeDivisionFilter, setActiveDivisionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const departments: DepartmentCard[] = [
    {
      code: 'HIST',
      name: 'Faculty of History',
      division: 'Humanities Division',
      hodName: 'Prof. Alistair MacIntyre',
      hodTitle: 'Regius Professor of Modern History',
      programmesCount: 14,
      enrolledCount: 1240,
      curriculumIngestedPct: 98.4,
      engagementStatus: 'Optimal',
      subfields: 'Medieval, Early Modern, Imperial & Global History',
      icon: 'menu_book',
    },
    {
      code: 'CS',
      name: 'Department of Computer Science',
      division: 'MPLS Division',
      hodName: 'Prof. Sarah Jenkins',
      hodTitle: 'Head of Department & Statutory Chair',
      programmesCount: 18,
      enrolledCount: 1890,
      curriculumIngestedPct: 94.2,
      engagementStatus: 'Optimal',
      subfields: 'Quantum Computing, AI & Verification, Security',
      icon: 'terminal',
    },
    {
      code: 'MED',
      name: 'Nuffield Department of Medicine',
      division: 'Medical Sciences Division',
      hodName: 'Prof. Eleanor Vance',
      hodTitle: 'Vice-Chancellor & Head of Clinical Studies',
      programmesCount: 22,
      enrolledCount: 2150,
      curriculumIngestedPct: 99.1,
      engagementStatus: 'Optimal',
      subfields: 'Cellular Signalling, Clinical Neurology, Genomics',
      icon: 'biomedical',
    },
    {
      code: 'PHIL',
      name: 'Faculty of Philosophy',
      division: 'Humanities Division',
      hodName: 'Dr. Julian Thorne',
      hodTitle: 'Wykeham Professor of Logic',
      programmesCount: 12,
      enrolledCount: 980,
      curriculumIngestedPct: 92.0,
      engagementStatus: 'High',
      subfields: 'Epistemology, Ethics, Moral Philosophy & Logic',
      icon: 'psychology',
    },
    {
      code: 'ENG',
      name: 'Department of Engineering Science',
      division: 'MPLS Division',
      hodName: 'Prof. Richard Sterling',
      hodTitle: 'Professor of Mechanical Engineering',
      programmesCount: 16,
      enrolledCount: 1650,
      curriculumIngestedPct: 89.6,
      engagementStatus: 'Moderate',
      subfields: 'Fluid Mechanics, Thermodynamics, Materials',
      icon: 'precision_manufacturing',
    },
    {
      code: 'ECON',
      name: 'Department of Economics',
      division: 'Social Sciences Division',
      hodName: 'Dr. Marcus Holloway',
      hodTitle: 'Drummond Professor of Political Economy',
      programmesCount: 15,
      enrolledCount: 1420,
      curriculumIngestedPct: 95.8,
      engagementStatus: 'High',
      subfields: 'Macroeconomic Policy, Econometrics, Micro Theory',
      icon: 'finance',
    },
  ];

  const filteredDepartments = departments.filter((item) => {
    const matchesDiv =
      activeDivisionFilter === 'all' ||
      (activeDivisionFilter === 'humanities' && item.division.includes('Humanities')) ||
      (activeDivisionFilter === 'mpls' && item.division.includes('MPLS')) ||
      (activeDivisionFilter === 'medsci' && item.division.includes('Medical')) ||
      (activeDivisionFilter === 'socialsci' && item.division.includes('Social'));

    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hodName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDiv && matchesSearch;
  });

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl space-y-[var(--spacing-section-gap)] font-body-md text-on-surface">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
              Academic Structure • Department Census
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            Faculty &amp; Department Directory
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Oxford collegiate faculties, department heads, curriculum Knowledge Graph ingestion, and degree programmes.
          </p>
        </div>
      </header>

      {/* TOP DIVISION CARDS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-gutter)]">
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 flex flex-col justify-between">
          <div>
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-semibold">Division 01</span>
            <h3 className="font-serif text-lg font-bold text-primary mt-0.5">Humanities Division</h3>
            <p className="text-xs text-on-surface-variant/70 mt-1">History, Philosophy, Classics, Fine Art &amp; Theology</p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
            <span className="font-medium text-on-surface">4,810 Enrolled</span>
            <span className="text-primary font-semibold">96.8% Ingested</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 flex flex-col justify-between">
          <div>
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-semibold">Division 02</span>
            <h3 className="font-serif text-lg font-bold text-primary mt-0.5">MPLS Division</h3>
            <p className="text-xs text-on-surface-variant/70 mt-1">Computer Science, Engineering, Maths &amp; Physics</p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
            <span className="font-medium text-on-surface">5,420 Enrolled</span>
            <span className="text-primary font-semibold">92.4% Ingested</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 flex flex-col justify-between">
          <div>
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-semibold">Division 03</span>
            <h3 className="font-serif text-lg font-bold text-primary mt-0.5">Medical Sciences</h3>
            <p className="text-xs text-on-surface-variant/70 mt-1">Clinical Medicine, Nuffield Depts &amp; Genomics</p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
            <span className="font-medium text-on-surface">6,120 Enrolled</span>
            <span className="text-primary font-semibold">99.1% Ingested</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 flex flex-col justify-between">
          <div>
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-semibold">Division 04</span>
            <h3 className="font-serif text-lg font-bold text-primary mt-0.5">Social Sciences</h3>
            <p className="text-xs text-on-surface-variant/70 mt-1">Economics, Law, Politics &amp; International Relations</p>
          </div>
          <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
            <span className="font-medium text-on-surface">4,580 Enrolled</span>
            <span className="text-primary font-semibold">95.8% Ingested</span>
          </div>
        </div>
      </div>

      {/* FILTER BAR & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/25">
        <FilterBar
          activeId={activeDivisionFilter}
          onSelect={setActiveDivisionFilter}
          options={[
            { id: 'all', label: 'All Divisions' },
            { id: 'humanities', label: 'Humanities' },
            { id: 'mpls', label: 'MPLS' },
            { id: 'medsci', label: 'Medical Sciences' },
            { id: 'socialsci', label: 'Social Sciences' },
          ]}
          variant="pills"
        />

        <input
          className="w-64 bg-surface-container-low text-on-surface font-ui-functional text-xs py-1.5 px-3 rounded-lg border border-outline-variant/30 outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
          placeholder="Search department or HOD..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* MAIN DEPARTMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
        {filteredDepartments.map((dept) => (
          <article
            key={dept.code}
            className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 hover:border-outline-variant/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">{dept.icon}</span>
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">
                    {dept.code}
                  </span>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-container-high text-on-surface">
                  {dept.engagementStatus} Engagement
                </span>
              </div>

              <h2 className="font-serif text-lg font-bold text-primary leading-tight">
                {dept.name}
              </h2>
              <span className="text-xs text-secondary font-medium block mt-0.5">{dept.division}</span>
              <p className="text-xs text-on-surface-variant/80 mt-2 leading-relaxed">
                {dept.subfields}
              </p>

              <div className="mt-4 pt-3 border-t border-outline-variant/15 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant/70">Head of Department:</span>
                  <span className="font-medium text-on-surface">{dept.hodName}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant/70">Degree Programmes:</span>
                  <span className="font-semibold text-primary">{dept.programmesCount} Active</span>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-on-surface-variant/70">Knowledge Graph Ingested:</span>
                    <span className="font-semibold text-on-surface">{dept.curriculumIngestedPct}%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-1.5 rounded-full" style={{ width: `${dept.curriculumIngestedPct}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-outline-variant/15 flex items-center justify-between">
              <span className="text-xs font-semibold text-on-surface">{dept.enrolledCount.toLocaleString()} Students</span>
              <button
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                onClick={() => alert(`Opening departmental catalog for ${dept.name}`)}
                type="button"
              >
                View Department <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
