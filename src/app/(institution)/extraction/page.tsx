'use client';

import React, { useState } from 'react';
import { KpiTile } from '@/components/ui/KpiTile';

type LensState = 'review' | 'processing' | 'triage' | 'empty' | 'retry';

export default function ExtractionPage() {
  const [lensState, setLensState] = useState<LensState>('review');
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');
  const [venueInput, setVenueInput] = useState<string>('Examination Schools, Hall 3 (South Annex)');
  const [isVenueResolved, setIsVenueResolved] = useState<boolean>(false);

  const handleResolveVenue = () => {
    setIsVenueResolved(true);
  };

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl">
        <div className="flex flex-col w-full">

          {/* SIMULATED STATE LENSES (Academic Administrative Modes) */}
          <div className="w-full bg-surface-container-low rounded-xl p-space-sm mb-space-lg flex flex-wrap items-center justify-between gap-space-sm shadow-xs">
            <div className="flex items-center gap-space-sm">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest">
                Console Simulation Lens:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLensState('review')}
                className={`px-space-sm py-1 rounded-full font-ui-functional text-[13px] transition-all cursor-pointer ${
                  lensState === 'review'
                    ? 'bg-primary text-on-primary shadow-xs font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                1. Populated Review Workspace
              </button>
              <button
                type="button"
                onClick={() => setLensState('processing')}
                className={`px-space-sm py-1 rounded-full font-ui-functional text-[13px] transition-all cursor-pointer ${
                  lensState === 'processing'
                    ? 'bg-primary text-on-primary shadow-xs font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                2. In-Flight Processing
              </button>
              <button
                type="button"
                onClick={() => setLensState('triage')}
                className={`px-space-sm py-1 rounded-full font-ui-functional text-[13px] transition-all cursor-pointer ${
                  lensState === 'triage'
                    ? 'bg-primary text-on-primary shadow-xs font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                3. Needs Review Triage
              </button>
              <button
                type="button"
                onClick={() => setLensState('empty')}
                className={`px-space-sm py-1 rounded-full font-ui-functional text-[13px] transition-all cursor-pointer ${
                  lensState === 'empty'
                    ? 'bg-primary text-on-primary shadow-xs font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                4. Pre-Upload State
              </button>
              <button
                type="button"
                onClick={() => setLensState('retry')}
                className={`px-space-sm py-1 rounded-full font-ui-functional text-[13px] transition-all cursor-pointer ${
                  lensState === 'retry'
                    ? 'bg-primary text-on-primary shadow-xs font-semibold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                5. Processing Exception
              </button>
            </div>
            <div className="hidden xl:flex items-center gap-space-xs text-on-surface-variant font-label-caps text-label-caps uppercase">
              <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
              <span>Registry Engine v4.2</span>
            </div>
          </div>

          {/* EDITORIAL HEADER SECTION */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg mb-space-xl">
            <div className="max-w-3xl">
              <div className="flex items-center gap-space-xs text-secondary font-label-caps text-label-caps uppercase tracking-wider mb-space-xs">
                <span>Content &amp; Knowledge</span>
                <span>•</span>
                <span>Institutional Source Extraction &amp; Syllabus Ingestion</span>
              </div>
              <h1 className="font-headline-md text-headline-md font-serif text-primary tracking-tight leading-none mb-space-sm">
                Timetable &amp; document extraction
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Upload collegiate notices, examination rotas, and departmental syllabi for automated verification into Oxford's knowledge registry. Validated records are persistently indexed for zero-redundancy schedule harmonization across faculties.
              </p>
            </div>
            <div className="flex items-center gap-space-sm flex-shrink-0">
              <button
                type="button"
                className="group px-space-md py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-ui-functional text-ui-functional transition-all flex items-center gap-space-xs shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary group-hover:rotate-180 transition-transform duration-500">
                  sync
                </span>
                <span>Re-index Knowledge Cache</span>
              </button>
              <button
                type="button"
                className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional transition-all flex items-center gap-space-xs shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
                <span className="font-semibold">+ Upload Source Document</span>
              </button>
            </div>
          </div>

          {/* CALM SUMMARY METRICS ROW (4 Cards via KpiTile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
            <KpiTile
              label="Ingested Sources"
              value="42 Documents"
              subtext="28 Timetables, 14 Examination Rosters across 38 colleges"
              trend="All divisions synchronized"
              trendDirection="up"
              icon="folder_special"
            />
            <KpiTile
              label="Cached Re-Use Efficiency"
              value="88.4%"
              subtext="Previously extracted and reused instantly; 0 redundant compute"
              trend="14.2 sec average verification"
              trendDirection="neutral"
              icon="cached"
            />
            <KpiTile
              label="Verification Accuracy"
              value="97.2% Confidence"
              subtext="Average extracted field fidelity across Michaelmas Term"
              trend="Registry standard met"
              trendDirection="up"
              icon="verified_user"
            />
            <KpiTile
              label="Pending Human Review"
              value="3 Fields Flagged"
              subtext="Venue & room allocation ambiguities requiring dean/tutor verification"
              trend="1 in current inspection"
              trendDirection="down"
              icon="assignment_late"
            />
          </div>

          {/* REFINED EDITORIAL DROPZONE */}
          <div className="relative bg-surface-container-low rounded-2xl p-space-lg mb-space-xl overflow-hidden shadow-xs">
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto py-space-sm">
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center mb-space-sm text-primary">
                <span className="material-symbols-outlined text-[28px]">mark_as_unread</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm font-serif text-primary mb-space-xs">
                Drag and drop institutional schedules, forwarded messages, or official registers
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                Supports PDF examination rolls, forwarded WhatsApp / email schedule bulletins, scanned college rotas, and high-res images (PNG, JPG, TIFF) up to 50MB. Lexi reads unstructured layouts and synthesizes structured calendar events.
              </p>
              {/* Academic Source Badges */}
              <div className="flex flex-wrap justify-center gap-space-xs mb-space-md">
                <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-secondary">picture_as_pdf</span>
                  PDF Examination Schedules
                </span>
                <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-secondary">chat</span>
                  Forwarded Chat / WhatsApp Export
                </span>
                <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-secondary">document_scanner</span>
                  Scanned Collegiate Timetables
                </span>
                <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-label-caps uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px] text-secondary">newspaper</span>
                  Departmental Gazettes
                </span>
              </div>
              <div className="flex items-center gap-space-md">
                <button
                  type="button"
                  className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional font-medium shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  <span>Select Document from Faculty Drive</span>
                </button>
                <button
                  type="button"
                  className="px-space-md py-2.5 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface font-ui-functional text-ui-functional shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">content_paste</span>
                  <span>Paste Raw Text / Chat Rota</span>
                </button>
              </div>
            </div>
          </div>

          {/* STATE PANELS CONTAINER */}
          <div className="w-full">
            {/* STATE 1: POPULATED REVIEW WORKSPACE (Default) */}
            {lensState === 'review' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
                {/* LEFT / MASTER TABLE: INGESTION PIPELINE (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-space-md">
                  <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs">
                    <div className="flex items-center justify-between pb-space-sm mb-space-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-headline-sm text-[20px] font-serif text-primary">Ingestion Pipeline</span>
                        <span className="bg-surface-container px-2 py-0.5 rounded-full font-label-caps text-label-caps uppercase text-on-surface-variant">
                          5 Recent
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <button type="button" title="Filter list" className="p-1 hover:bg-surface-container rounded cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        </button>
                        <button type="button" title="Refresh" className="p-1 hover:bg-surface-container rounded cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]">refresh</span>
                        </button>
                      </div>
                    </div>

                    {/* Document List Items */}
                    <div className="flex flex-col gap-space-xs">
                      {/* Row 1: Selected & Active */}
                      <div
                        onClick={() => setSelectedDocId('doc-1')}
                        className={`group p-space-sm rounded-lg relative cursor-pointer shadow-xs transition-all ${
                          selectedDocId === 'doc-1'
                            ? 'bg-surface-container-high'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-start gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center flex-shrink-0 text-on-secondary-fixed">
                            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-ui-functional text-ui-functional font-semibold text-primary truncate">
                                Balliol &amp; Christ Church Michaelmas Exam Timetable
                              </span>
                              {selectedDocId === 'doc-1' && (
                                <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" title="Selected Document"></span>
                              )}
                            </div>
                            <div className="font-label-caps text-[11px] text-on-surface-variant mt-0.5 truncate">
                              Weeks 7–9 • Exam Schedule • Today, 09:14 AM by Registry
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-2">
                              <div className="flex items-center gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-[10px] uppercase font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                  Needs Review
                                </span>
                                <span className="font-label-caps text-[11px] text-secondary font-medium">78% Confidence</span>
                              </div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-ui-functional text-on-surface-variant">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></span>
                                Newly processed
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Complete & Cached */}
                      <div
                        onClick={() => setSelectedDocId('doc-2')}
                        className={`group p-space-sm rounded-lg relative cursor-pointer transition-all ${
                          selectedDocId === 'doc-2'
                            ? 'bg-surface-container-high'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-start gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px]">description</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-ui-functional text-ui-functional font-medium text-primary truncate">
                                MPLS Engineering Lecture Matrix v4.pdf
                              </span>
                              <span className="font-label-caps text-[11px] text-outline">v4.0</span>
                            </div>
                            <div className="font-label-caps text-[11px] text-on-surface-variant mt-0.5 truncate">
                              Lecture Gazette • Yesterday by Senior Proctor
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-[10px] uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Complete
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-ui-functional text-secondary">
                                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                                Previously cached • 99%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Forwarded WhatsApp / TXT */}
                      <div
                        onClick={() => setSelectedDocId('doc-3')}
                        className={`group p-space-sm rounded-lg relative cursor-pointer transition-all ${
                          selectedDocId === 'doc-3'
                            ? 'bg-surface-container-high'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-start gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-ui-functional text-ui-functional font-medium text-primary truncate">
                                Balliol WhatsApp Schedule Bulletin • Week 7.txt
                              </span>
                            </div>
                            <div className="font-label-caps text-[11px] text-on-surface-variant mt-0.5 truncate">
                              Tutorial Rota • 2 days ago via Senior Tutor Desk
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-[10px] uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Complete
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-ui-functional text-on-surface-variant">
                                <span className="material-symbols-outlined text-[13px] text-secondary">cached</span>
                                Registry synced • 94%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 4: Scanned Rota */}
                      <div
                        onClick={() => setSelectedDocId('doc-4')}
                        className={`group p-space-sm rounded-lg relative cursor-pointer transition-all ${
                          selectedDocId === 'doc-4'
                            ? 'bg-surface-container-high'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-start gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-on-surface-variant">
                            <span className="material-symbols-outlined text-[20px]">document_scanner</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-ui-functional text-ui-functional font-medium text-primary truncate">
                                Christ Church Divinity Hall Rosters.pdf
                              </span>
                            </div>
                            <div className="font-label-caps text-[11px] text-on-surface-variant mt-0.5 truncate">
                              Timetable • Nov 18 by Academic Administrator
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-1.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-caps text-[10px] uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                Complete
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-ui-functional text-on-surface-variant">
                                Reused • 98%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Row 5: In-Flight Process */}
                      <div
                        onClick={() => setSelectedDocId('doc-5')}
                        className={`group p-space-sm rounded-lg relative cursor-pointer transition-all ${
                          selectedDocId === 'doc-5'
                            ? 'bg-surface-container-high'
                            : 'hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-start gap-space-sm">
                          <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center flex-shrink-0 text-secondary">
                            <span className="material-symbols-outlined text-[20px] animate-spin">autorenew</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-ui-functional text-ui-functional font-medium text-primary truncate">
                                St John's College Michaelmas Exam Roll.pdf
                              </span>
                            </div>
                            <div className="font-label-caps text-[11px] text-on-surface-variant mt-0.5 truncate">
                              Extracting structured records • 62%
                            </div>
                            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-2">
                              <div className="bg-secondary h-full rounded-full w-3/5"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Authority Notice Box */}
                  <div className="bg-surface-container-low rounded-xl p-space-md">
                    <div className="flex items-start gap-space-sm">
                      <span className="material-symbols-outlined text-secondary text-[22px] flex-shrink-0">shield_lock</span>
                      <div className="flex flex-col">
                        <span className="font-ui-functional text-ui-functional font-semibold text-primary">
                          InCommon Federation &amp; Oxford Registry Policy
                        </span>
                        <p className="font-body-md text-[13px] text-on-surface-variant leading-normal mt-1">
                          Lexi processes all documents within institutional trust boundaries. Examination rolls undergo verification against Oxford Course Registry data prior to calendar publication.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT / DETAIL WORKSPACE: SIDE-BY-SIDE VERIFICATION (7 Cols) */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col gap-space-md">
                  {/* Workspace Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-sm gap-space-sm border-b border-outline-variant/30">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline-sm text-headline-sm font-serif text-primary leading-tight">
                          Balliol &amp; Christ Church Michaelmas Exam Schedule
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-space-xs text-on-surface-variant font-label-caps text-label-caps uppercase mt-1">
                        <span>PDF Format</span>
                        <span>•</span>
                        <span>4.2 MB</span>
                        <span>•</span>
                        <span>Ingested 2 hrs ago</span>
                        <span>•</span>
                        <span className="text-secondary font-semibold">Newly processed • In-memory cache active</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs flex-shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps uppercase font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                        {isVenueResolved ? 'Fully Verified' : 'Needs Review (1 Ambiguity Flagged)'}
                      </span>
                    </div>
                  </div>

                  {/* Split View inside Workspace: Source Preview vs Structured Academic Data */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">
                    {/* Column A: Simulated Authentic Academic Roster Sheet (5 Cols) */}
                    <div className="md:col-span-5 bg-surface-container-low rounded-lg p-space-sm flex flex-col">
                      <div className="flex items-center justify-between pb-2 mb-2">
                        <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">preview</span>
                          Source Roster Sheet
                        </span>
                        <span className="font-label-caps text-[11px] text-outline">Page 1 of 3</span>
                      </div>

                      {/* Authentic Scanned Paper Simulation */}
                      <div className="relative bg-surface-container rounded p-3 text-ink-black shadow-inner min-h-[380px] font-serif text-[11px] leading-relaxed select-none overflow-hidden border border-outline-variant/40">
                        {/* Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                          <span className="text-[48px] font-bold tracking-widest uppercase -rotate-25 text-primary">
                            UNIVERSITY OF OXFORD
                          </span>
                        </div>
                        {/* Sheet Header */}
                        <div className="text-center pb-2 mb-2 border-b border-outline-variant/30">
                          <div className="font-bold text-[10px] tracking-wider uppercase">EXAM SCHOOLS OXFORD • MICHAELMAS 2024</div>
                          <div className="text-[9px] uppercase tracking-widest text-secondary font-sans font-bold">CONFIDENTIAL PROVISIONAL ROSTER</div>
                          <div className="text-[8px] text-on-surface-variant font-sans mt-0.5">Approved under Proctorial Decree • Week 7 Intake</div>
                        </div>
                        {/* Sheet Body Rows */}
                        <div className="space-y-2 font-mono text-[10px]">
                          <div className="flex justify-between font-bold">
                            <span>ENG-320</span>
                            <span>28-NOV-24</span>
                            <span>09:30-12:30</span>
                          </div>
                          <div className="text-on-surface">Title: Adv. Fluid Dynamics &amp; Navier-Stokes</div>
                          <div className="text-on-surface">Candidates: 48 (Balliol: 22, ChCh: 26)</div>
                          {/* Highlight Box Over Flagged Text */}
                          <div className="relative p-1.5 rounded bg-secondary-container/30 border border-secondary/40">
                            <div className="flex items-center justify-between text-on-surface">
                              <span className="font-semibold">Allocated Hall:</span>
                              <span className="bg-secondary-fixed font-bold text-on-secondary-fixed px-1 rounded">
                                Schools Hall 3 (South Upper?)
                              </span>
                            </div>
                            <div className="text-[9px] text-secondary font-sans font-medium mt-1">
                              • Flagged: Room partition suffix ambiguous in physical print
                            </div>
                          </div>
                          <div className="pt-2 text-on-surface">Chief Examiner: Prof. A. Montgomery</div>
                          <div className="text-on-surface">Invigilators: Dr. H. Vance / Dr. K. Shaw</div>
                          <div className="text-on-surface-variant text-[9px] italic pt-3">
                            Note: Candidates must wear subfusc with caps. Desks 1-48 arranged in alphabetical order.
                          </div>
                        </div>
                        {/* Footer Stamp */}
                        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end text-[8px] font-sans text-outline">
                          <span>Ref: OX-ES-2024-M-32</span>
                          <span className="uppercase font-bold text-secondary">Registry Verified Copy</span>
                        </div>
                      </div>

                      <div className="mt-space-sm flex items-center justify-between text-on-surface-variant">
                        <span className="font-label-caps text-[11px]">OCR Engine: Lexi Rota Parser</span>
                        <button type="button" className="font-ui-functional text-[12px] text-secondary hover:underline flex items-center gap-0.5 cursor-pointer">
                          <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                          View High-Res Scan
                        </button>
                      </div>
                    </div>

                    {/* Column B: Extracted Structured Academic Data (7 Cols) */}
                    <div className="md:col-span-7 flex flex-col gap-space-sm">
                      <div className="flex items-center justify-between pb-1">
                        <span className="font-label-caps text-label-caps uppercase text-secondary font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">table_chart</span>
                          Synthesized Academic Records
                        </span>
                        <span className="font-label-caps text-[11px] text-on-surface-variant">Registry Target: Michaelmas 2024</span>
                      </div>

                      {/* Field List / Verification Items */}
                      <div className="flex flex-col gap-2">
                        {/* Item 1: Date */}
                        <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Examination Date</span>
                            <span className="font-ui-functional text-ui-functional font-semibold text-primary">Thursday, 28 November 2024</span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            99% Verified
                          </span>
                        </div>

                        {/* Item 2: Course Code */}
                        <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Course &amp; Unit Code</span>
                            <div className="flex items-center gap-2">
                              <span className="font-ui-functional text-ui-functional font-semibold text-primary">Advanced Fluid Dynamics</span>
                              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface font-mono text-[11px] font-bold">ENG-320</span>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            100% InCommon Matched
                          </span>
                        </div>

                        {/* Item 3: Sitting Time */}
                        <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Sitting Time &amp; Duration</span>
                            <span className="font-ui-functional text-ui-functional font-semibold text-primary">09:30 – 12:30 GMT (3.0 hrs)</span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            96% Verified
                          </span>
                        </div>

                        {/* Item 4: Venue (FLAGGED FIELD) */}
                        <div className={`p-3 rounded-lg shadow-xs flex flex-col gap-1.5 transition-all ${
                          isVenueResolved ? 'bg-surface-container-low' : 'bg-secondary-container/20'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-label-caps text-[10px] uppercase text-secondary font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">{isVenueResolved ? 'check_circle' : 'warning'}</span>
                              {isVenueResolved ? 'Resolved Field: Venue Allocation' : 'Flagged Field: Venue & Room Allocation'}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-caps text-[10px] uppercase font-bold ${
                              isVenueResolved ? 'bg-primary-container text-on-primary-container' : 'bg-secondary text-on-secondary'
                            }`}>
                              {isVenueResolved ? '100% Verified' : '78% Low Confidence'}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="font-ui-functional text-[12px] text-on-surface-variant">Confirmed Registry Venue Description:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={venueInput}
                                onChange={(e) => setVenueInput(e.target.value)}
                                className="flex-1 bg-surface-container-lowest font-ui-functional text-ui-functional text-primary px-2.5 py-1.5 rounded outline-none shadow-xs font-semibold focus:ring-1 focus:ring-primary/40"
                              />
                              <button
                                type="button"
                                onClick={handleResolveVenue}
                                className={`px-2.5 py-1.5 rounded font-ui-functional text-[12px] transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                                  isVenueResolved
                                    ? 'bg-primary-container text-on-primary-container font-semibold'
                                    : 'bg-primary text-on-primary hover:bg-primary-container'
                                }`}
                              >
                                <span className="material-symbols-outlined text-[14px]">{isVenueResolved ? 'done_all' : 'check'}</span>
                                <span>{isVenueResolved ? 'Verified' : 'Accept'}</span>
                              </button>
                            </div>
                            {!isVenueResolved && (
                              <p className="font-ui-functional text-[11px] text-secondary mt-0.5">
                                Source text specifies <span className="font-mono bg-surface-container-lowest px-1 rounded">'Schools Hall 3 (South)'</span>. Please confirm building wing partition before publishing to Oxford Student App.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Item 5: Department */}
                        <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Department &amp; Faculty Division</span>
                            <span className="font-ui-functional text-ui-functional font-semibold text-primary">Dept. of Engineering Science (MPLS Division)</span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            99% Matched
                          </span>
                        </div>

                        {/* Item 6: Presiding Examiner */}
                        <div className="p-2.5 rounded-lg bg-surface-container-low flex items-center justify-between">
                          <div>
                            <span className="font-label-caps text-[10px] uppercase text-on-surface-variant block">Chief Presiding Examiner</span>
                            <span className="font-ui-functional text-ui-functional font-semibold text-primary">Prof. Alistair Montgomery</span>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface font-label-caps text-[10px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            94% Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR IN REVIEW */}
                  <div className="mt-space-sm pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm border-t border-outline-variant/30">
                    <div className="flex items-center gap-space-sm w-full sm:w-auto">
                      <button
                        type="button"
                        className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-ui-functional text-ui-functional transition-all cursor-pointer"
                      >
                        Edit All Extracted Values
                      </button>
                      <button
                        type="button"
                        className="px-space-md py-2 rounded-lg bg-surface-container-low hover:bg-error-container text-error font-ui-functional text-ui-functional transition-all cursor-pointer"
                      >
                        Reject Document
                      </button>
                    </div>
                    <button
                      type="button"
                      className="w-full sm:w-auto px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional font-semibold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">publish</span>
                      <span>
                        {isVenueResolved
                          ? 'Confirm & Publish to Academic Timetable (All Flags Resolved)'
                          : 'Confirm & Publish to Academic Timetable (1 Flag Pending)'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 2: IN-FLIGHT PROCESSING */}
            {lensState === 'processing' && (
              <div className="flex flex-col items-center justify-center bg-surface-container-lowest rounded-2xl p-space-xl shadow-xs text-center min-h-[460px]">
                <div className="relative w-20 h-20 mb-space-md flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></div>
                  <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[32px] animate-spin">cyclone</span>
                  </div>
                </div>
                <div className="font-label-caps text-label-caps uppercase text-secondary tracking-widest mb-1">
                  In-Memory Parser Active
                </div>
                <h3 className="font-headline-md text-headline-md font-serif text-primary mb-space-xs max-w-lg">
                  Lexi is reading St John's College Exam Roll...
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg">
                  Synthesizing calendar structures, resolving departmental course codes with Oxford InCommon Registry, and verifying tutor designations.
                </p>
                {/* Stepper Status */}
                <div className="w-full max-w-md bg-surface-container-low rounded-xl p-space-md shadow-xs">
                  <div className="space-y-3 font-ui-functional text-ui-functional text-left">
                    <div className="flex items-center justify-between text-primary">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px]">check_circle</span>
                        High-resolution OCR layout decomposition
                      </span>
                      <span className="font-label-caps text-[11px] text-secondary">Complete</span>
                    </div>
                    <div className="flex items-center justify-between text-primary">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[18px] animate-spin">sync</span>
                        Cross-referencing Oxford Division Codes
                      </span>
                      <span className="font-label-caps text-[11px] text-secondary">Processing...</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface-variant opacity-60">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        Registry cache population &amp; calendar publish
                      </span>
                      <span className="font-label-caps text-[11px]">Queued</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 3: NEEDS REVIEW TRIAGE */}
            {lensState === 'triage' && (
              <div className="flex flex-col gap-space-md">
                <div className="bg-secondary-container/30 rounded-xl p-space-md flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[24px]">flag</span>
                    <div>
                      <div className="font-ui-functional text-ui-functional font-bold text-primary">
                        Low-Confidence Triage Queue (3 Ambiguities across 2 Documents)
                      </div>
                      <div className="font-body-md text-[13px] text-on-surface-variant">
                        Fields below 85% statistical confidence require academic registry sign-off.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-space-md py-1.5 rounded bg-primary text-on-primary font-ui-functional text-ui-functional shadow-xs cursor-pointer"
                  >
                    Batch Review Mode
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {/* Triage Item 1 */}
                  <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-caps text-[10px] uppercase text-secondary font-bold">Venue Allocation</span>
                        <span className="font-label-caps text-[10px] text-secondary bg-secondary-fixed px-1.5 py-0.5 rounded font-bold">
                          78%
                        </span>
                      </div>
                      <div className="font-ui-functional font-bold text-primary mb-1">Schools Hall 3 (South Annex)</div>
                      <div className="font-body-md text-[13px] text-on-surface-variant mb-space-sm">
                        Balliol &amp; Christ Church Exam Roll • ENG-320
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLensState('review')}
                      className="w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-ui-functional text-ui-functional cursor-pointer transition-colors"
                    >
                      Verify in Detail →
                    </button>
                  </div>

                  {/* Triage Item 2 */}
                  <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-caps text-[10px] uppercase text-secondary font-bold">Invigilator Name</span>
                        <span className="font-label-caps text-[10px] text-secondary bg-secondary-fixed px-1.5 py-0.5 rounded font-bold">
                          69%
                        </span>
                      </div>
                      <div className="font-ui-functional font-bold text-primary mb-1">Dr. K. Shaw / Dr. R. Shaw?</div>
                      <div className="font-body-md text-[13px] text-on-surface-variant mb-space-sm">
                        Christ Church Divinity Hall • THEO-101
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLensState('review')}
                      className="w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-ui-functional text-ui-functional cursor-pointer transition-colors"
                    >
                      Verify in Detail →
                    </button>
                  </div>

                  {/* Triage Item 3 */}
                  <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-label-caps text-[10px] uppercase text-secondary font-bold">Sitting Time Slot</span>
                        <span className="font-label-caps text-[10px] text-secondary bg-secondary-fixed px-1.5 py-0.5 rounded font-bold">
                          81%
                        </span>
                      </div>
                      <div className="font-ui-functional font-bold text-primary mb-1">14:00 vs 14:30 GMT</div>
                      <div className="font-body-md text-[13px] text-on-surface-variant mb-space-sm">
                        Balliol WhatsApp Bulletin • PHIL-204
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLensState('review')}
                      className="w-full py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary font-ui-functional text-ui-functional cursor-pointer transition-colors"
                    >
                      Verify in Detail →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 4: PRE-UPLOAD / EMPTY STATE */}
            {lensState === 'empty' && (
              <div className="flex flex-col items-center justify-center bg-surface-container-lowest rounded-2xl p-space-xl shadow-xs text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-space-md text-secondary">
                  <span className="material-symbols-outlined text-[36px]">cloud_upload</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm font-serif text-primary mb-space-xs">
                  No Ingested Documents Pending Review
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg">
                  Drag and drop Michaelmas Term schedules or forwarded collegiate notices above to begin extraction and knowledge base caching.
                </p>
                <button
                  type="button"
                  onClick={() => setLensState('review')}
                  className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional transition-all shadow-sm cursor-pointer"
                >
                  Load Sample Examination Roll
                </button>
              </div>
            )}

            {/* STATE 5: PROCESSING EXCEPTION / RETRY */}
            {lensState === 'retry' && (
              <div className="flex flex-col items-center justify-center bg-surface-container-lowest rounded-2xl p-space-xl shadow-xs text-center min-h-[400px]">
                <div className="w-16 h-16 rounded-full bg-error-container text-error flex items-center justify-center mb-space-md">
                  <span className="material-symbols-outlined text-[36px]">error_outline</span>
                </div>
                <div className="font-label-caps text-label-caps uppercase text-error tracking-widest mb-1">
                  OCR Document Exception
                </div>
                <h3 className="font-headline-sm text-headline-sm font-serif text-primary mb-space-xs max-w-lg">
                  Scanned Image Resolution Too Low for Reliable Rota Synthesis
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mb-space-lg">
                  Document <span className="font-mono bg-surface-container px-1 py-0.5 rounded text-on-surface">'Magdalen_Draft_Hall_Matrix.jpg'</span> is under 150 DPI. Tabular cell partitions could not be disambiguated according to Oxford Registry tolerances.
                </p>
                <div className="flex items-center gap-space-sm">
                  <button
                    type="button"
                    className="px-space-lg py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-ui-functional text-ui-functional transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">refresh</span>
                    <span>Reprocess with Enhanced Optical Filters</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLensState('review')}
                    className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-ui-functional text-ui-functional cursor-pointer"
                  >
                    Return to Pipeline
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
  );
}
