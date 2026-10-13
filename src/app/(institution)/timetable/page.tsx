'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';

interface ScheduleSlot {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  timeSlot: string;
  moduleCode: string;
  moduleTitle: string;
  division: string;
  type: 'Lecture' | 'Tutorial Group' | 'Lab Practical' | 'Seminar';
  venue: string;
  capacity: number;
  enrolled: number;
  lecturer: string;
  status: 'Live Streamed' | 'Confirmed' | 'Recorded';
}

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState<string>('monday');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');

  const slots: ScheduleSlot[] = [
    {
      id: 'S101',
      day: 'monday',
      timeSlot: '09:00 AM - 10:30 AM',
      moduleCode: 'BIO-410',
      moduleTitle: 'Cellular Signalling Pathways',
      division: 'Medical Sciences Division',
      type: 'Lecture',
      venue: 'Examination Schools, Hall 3',
      capacity: 240,
      enrolled: 218,
      lecturer: 'Prof. Alistair MacIntyre',
      status: 'Live Streamed',
    },
    {
      id: 'S102',
      day: 'monday',
      timeSlot: '11:00 AM - 12:30 PM',
      moduleCode: 'HIST-302',
      moduleTitle: 'Late Imperial Diplomacy',
      division: 'Humanities Division',
      type: 'Seminar',
      venue: 'Schools Quadrangle, Room 14',
      capacity: 35,
      enrolled: 31,
      lecturer: 'Dr. Helena Vance',
      status: 'Confirmed',
    },
    {
      id: 'S103',
      day: 'tuesday',
      timeSlot: '10:00 AM - 12:00 PM',
      moduleCode: 'CS-501',
      moduleTitle: 'Quantum Information & Computing',
      division: 'MPLS Division',
      type: 'Lab Practical',
      venue: 'Wolfson Building, Software Lab A',
      capacity: 60,
      enrolled: 54,
      lecturer: 'Prof. Sarah Jenkins',
      status: 'Recorded',
    },
    {
      id: 'S104',
      day: 'wednesday',
      timeSlot: '02:00 PM - 03:30 PM',
      moduleCode: 'ECON-204',
      moduleTitle: 'Macroeconomic Policy Architecture',
      division: 'Social Sciences Division',
      type: 'Lecture',
      venue: 'Manor Road Building, Lecture Theatre 1',
      capacity: 180,
      enrolled: 165,
      lecturer: 'Dr. Marcus Holloway',
      status: 'Confirmed',
    },
    {
      id: 'S105',
      day: 'thursday',
      timeSlot: '09:30 AM - 11:00 AM',
      moduleCode: 'PHIL-101',
      moduleTitle: 'Epistemology & Logic Systems',
      division: 'Humanities Division',
      type: 'Tutorial Group',
      venue: 'Christ Church, Quad Room B',
      capacity: 15,
      enrolled: 12,
      lecturer: 'Dr. Julian Thorne',
      status: 'Confirmed',
    },
    {
      id: 'S106',
      day: 'friday',
      timeSlot: '02:00 PM - 04:00 PM',
      moduleCode: 'ENG-320',
      moduleTitle: 'Advanced Fluid Dynamics',
      division: 'MPLS Division',
      type: 'Lecture',
      venue: 'Thom Building, Main Auditorium',
      capacity: 200,
      enrolled: 184,
      lecturer: 'Prof. Richard Sterling',
      status: 'Live Streamed',
    },
  ];

  const filteredSlots = slots.filter((s) => {
    const matchDay = activeDay === 'all' || s.day === activeDay;
    const matchVenue = selectedVenue === 'all' || s.venue.toLowerCase().includes(selectedVenue.toLowerCase());
    return matchDay && matchVenue;
  });

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl space-y-[var(--spacing-section-gap)] font-body-md text-on-surface">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
              Master Schedule • Michaelmas Term Wk 7
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            Institutional Academic Timetable
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Weekly schedule matrix of lectures, tutorial groups, and laboratory practicals across Oxford venues.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/25 px-4 py-2 rounded-xl flex items-center gap-4 text-xs">
          <div>
            <span className="text-on-surface-variant/70 block">Venue Utilization</span>
            <span className="font-serif text-lg font-bold text-primary">96.8%</span>
          </div>
          <div className="h-6 w-px bg-outline-variant/30"></div>
          <div>
            <span className="text-on-surface-variant/70 block">Schedule Conflicts</span>
            <span className="font-serif text-lg font-bold text-secondary">0 Conflicts</span>
          </div>
        </div>
      </header>

      {/* DAY SELECTOR TABS & VENUE FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/25">
        <FilterBar
          activeId={activeDay}
          onSelect={setActiveDay}
          options={[
            { id: 'monday', label: 'Monday' },
            { id: 'tuesday', label: 'Tuesday' },
            { id: 'wednesday', label: 'Wednesday' },
            { id: 'thursday', label: 'Thursday' },
            { id: 'friday', label: 'Friday' },
          ]}
          variant="pills"
        />

        <select
          className="bg-surface-container-low text-on-surface font-ui-functional text-xs py-1.5 px-3 rounded-lg border border-outline-variant/30 outline-none cursor-pointer hover:bg-surface-container"
          value={selectedVenue}
          onChange={(e) => setSelectedVenue(e.target.value)}
        >
          <option value="all">All Venues</option>
          <option value="Examination Schools">Examination Schools</option>
          <option value="Schools Quadrangle">Schools Quadrangle</option>
          <option value="Wolfson">Wolfson Building</option>
          <option value="Manor Road">Manor Road</option>
          <option value="Thom Building">Thom Building</option>
        </select>
      </div>

      {/* TIMETABLE SCHEDULE GRID / SESSION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
        {filteredSlots.map((slot) => {
          const capPct = Math.round((slot.enrolled / slot.capacity) * 100);
          return (
            <article
              key={slot.id}
              className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 hover:border-outline-variant/60 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">
                    {slot.timeSlot}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface">
                    {slot.type}
                  </span>
                </div>

                <h3 className="font-serif text-lg font-bold text-primary mt-2 leading-tight">
                  {slot.moduleCode}: {slot.moduleTitle}
                </h3>
                <span className="text-xs text-secondary font-medium block mt-0.5">{slot.division}</span>

                <div className="mt-4 pt-3 border-t border-outline-variant/15 flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Venue Location:</span>
                    <span className="font-semibold text-on-surface">{slot.venue}</span>
                  </div>

                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span>Lead Lecturer:</span>
                    <span className="font-medium text-on-surface">{slot.lecturer}</span>
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-on-surface-variant/70">Attendance Capacity:</span>
                      <span className="font-semibold text-on-surface">{slot.enrolled} / {slot.capacity} ({capPct}%)</span>
                    </div>
                    <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${capPct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
                <span className="font-medium text-secondary">{slot.status}</span>
                <button
                  className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  onClick={() => alert(`Viewing details for ${slot.moduleCode} at ${slot.venue}`)}
                  type="button"
                >
                  Schedule Details <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
