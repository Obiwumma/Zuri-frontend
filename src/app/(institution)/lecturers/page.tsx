'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';

interface FacultyProfile {
  id: string;
  name: string;
  academicTitle: string;
  category: 'chair' | 'assoc' | 'fellow' | 'research';
  department: string;
  division: string;
  college: string;
  modules: string[];
  studentLoad: number;
  weeklyHours: number;
  officeHours: string;
  aiStatus: 'Active Supervisor' | 'Co-Pilot Enabled' | 'Review Pending';
  avatarInitials: string;
}

export default function LecturersPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const faculty: FacultyProfile[] = [
    {
      id: 'FAC-101',
      name: 'Prof. Alistair MacIntyre',
      academicTitle: 'Regius Professor of Modern History',
      category: 'chair',
      department: 'Faculty of History',
      division: 'Humanities Division',
      college: 'Christ Church',
      modules: ['HIST-302', 'HIST-410'],
      studentLoad: 28,
      weeklyHours: 14,
      officeHours: 'Tues 14:00 - 16:00',
      aiStatus: 'Active Supervisor',
      avatarInitials: 'AM',
    },
    {
      id: 'FAC-102',
      name: 'Prof. Sarah Jenkins',
      academicTitle: 'Professor of Quantum Computing',
      category: 'chair',
      department: 'Department of Computer Science',
      division: 'MPLS Division',
      college: 'Magdalen College',
      modules: ['CS-501', 'CS-620'],
      studentLoad: 42,
      weeklyHours: 18,
      officeHours: 'Weds 10:00 - 12:00',
      aiStatus: 'Active Supervisor',
      avatarInitials: 'SJ',
    },
    {
      id: 'FAC-103',
      name: 'Prof. Eleanor Vance',
      academicTitle: 'Vice-Chancellor & Chair of Neurology',
      category: 'chair',
      department: 'Nuffield Dept of Medicine',
      division: 'Medical Sciences Division',
      college: 'Balliol College',
      modules: ['MED-601', 'BIO-410'],
      studentLoad: 35,
      weeklyHours: 16,
      officeHours: 'Mon 11:00 - 13:00',
      aiStatus: 'Active Supervisor',
      avatarInitials: 'EV',
    },
    {
      id: 'FAC-104',
      name: 'Dr. Julian Thorne',
      academicTitle: 'Associate Professor of Epistemology',
      category: 'assoc',
      department: 'Faculty of Philosophy',
      division: 'Humanities Division',
      college: 'Trinity College',
      modules: ['PHIL-101', 'PHIL-204'],
      studentLoad: 24,
      weeklyHours: 12,
      officeHours: 'Thurs 15:00 - 17:00',
      aiStatus: 'Co-Pilot Enabled',
      avatarInitials: 'JT',
    },
    {
      id: 'FAC-105',
      name: 'Dr. Marcus Holloway',
      academicTitle: 'Tutorial Fellow in Economics',
      category: 'fellow',
      department: 'Department of Economics',
      division: 'Social Sciences Division',
      college: 'St John\'s College',
      modules: ['ECON-204', 'ECON-310'],
      studentLoad: 30,
      weeklyHours: 15,
      officeHours: 'Fri 09:30 - 11:30',
      aiStatus: 'Active Supervisor',
      avatarInitials: 'MH',
    },
    {
      id: 'FAC-106',
      name: 'Prof. Richard Sterling',
      academicTitle: 'Professor of Mechanical Engineering',
      category: 'chair',
      department: 'Dept of Engineering Science',
      division: 'MPLS Division',
      college: 'New College',
      modules: ['ENG-320', 'ENG-405'],
      studentLoad: 38,
      weeklyHours: 16,
      officeHours: 'Mon 14:00 - 16:00',
      aiStatus: 'Co-Pilot Enabled',
      avatarInitials: 'RS',
    },
  ];

  const filteredFaculty = faculty.filter((f) => {
    const matchCat = activeCategory === 'all' || f.category === activeCategory;
    const matchSearch =
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.academicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl space-y-[var(--spacing-section-gap)] font-body-md text-on-surface">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
              People &amp; Access • Academic Faculty Census
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            Lecturers &amp; Professorial Faculty
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Directory of Oxford statutory chairs, associate professors, tutorial fellows, and academic supervisors.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/25 px-4 py-2 rounded-xl flex items-center gap-4 text-xs">
          <div>
            <span className="text-on-surface-variant/70 block">Professorial Staff</span>
            <span className="font-serif text-lg font-bold text-primary">840 Active</span>
          </div>
          <div className="h-6 w-px bg-outline-variant/30"></div>
          <div>
            <span className="text-on-surface-variant/70 block">Weekly Tutorial Hours</span>
            <span className="font-serif text-lg font-bold text-secondary">4,890 hrs</span>
          </div>
        </div>
      </header>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/25">
        <FilterBar
          activeId={activeCategory}
          onSelect={setActiveCategory}
          options={[
            { id: 'all', label: 'All Faculty' },
            { id: 'chair', label: 'Statutory Chairs' },
            { id: 'assoc', label: 'Associate Professors' },
            { id: 'fellow', label: 'Tutorial Fellows' },
          ]}
          variant="pills"
        />

        <input
          className="w-64 bg-surface-container-low text-on-surface font-ui-functional text-xs py-1.5 px-3 rounded-lg border border-outline-variant/30 outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
          placeholder="Search faculty, title, college..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* FACULTY PROFILE CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
        {filteredFaculty.map((f) => (
          <article
            key={f.id}
            className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 hover:border-outline-variant/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-on-primary font-serif font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                    {f.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-primary leading-tight">{f.name}</h3>
                    <span className="text-xs text-secondary font-medium block mt-0.5">{f.academicTitle}</span>
                  </div>
                </div>

                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                  {f.id}
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-outline-variant/15 text-xs">
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Department:</span>
                  <span className="font-semibold text-on-surface">{f.department}</span>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>College Affiliation:</span>
                  <span className="font-medium text-on-surface">{f.college}</span>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Office Hours:</span>
                  <span className="font-medium text-secondary">{f.officeHours}</span>
                </div>

                <div className="flex items-center justify-between text-on-surface-variant">
                  <span>Tutorial Student Load:</span>
                  <span className="font-semibold text-primary">{f.studentLoad} Students ({f.weeklyHours} hrs/wk)</span>
                </div>

                {/* SUPERVISED MODULE PILLS */}
                <div className="pt-2">
                  <span className="text-[11px] text-on-surface-variant/70 block mb-1">Supervised Modules:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {f.modules.map((m) => (
                      <span key={m} className="font-mono text-xs px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-full bg-surface-container-high font-medium text-on-surface text-[11px]">
                {f.aiStatus}
              </span>

              <button
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                onClick={() => alert(`Opening profile for ${f.name}`)}
                type="button"
              >
                Profile <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
