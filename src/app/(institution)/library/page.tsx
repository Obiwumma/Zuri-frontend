'use client';

import React, { useState } from 'react';
import { FilterBar } from '@/components/ui/FilterBar';

interface LibraryCard {
  id: string;
  title: string;
  moduleCode: string;
  department: string;
  typeCategory: 'transcript' | 'reading' | 'bodleian' | 'exampaper';
  typeLabel: string;
  conceptNodes: string[];
  accessScope: 'Open Student Access' | 'Faculty Restricted' | 'Honours Finalists';
  indexingStatus: 'Fully Indexed' | 'Graph Linked' | 'OCR Processing';
  author: string;
  fileSize: string;
  icon: string;
}

export default function ContentLibraryPage() {
  const [activeType, setActiveType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const libraryCards: LibraryCard[] = [
    {
      id: 'LIB-4091',
      title: 'Cellular Signalling & Receptor Transduction Lecture Corpus',
      moduleCode: 'BIO-410',
      department: 'Nuffield Dept of Medicine',
      typeCategory: 'transcript',
      typeLabel: 'Lecture Transcript',
      conceptNodes: ['Receptor Pathways', 'Kinase Cascades', 'G-Protein'],
      accessScope: 'Open Student Access',
      indexingStatus: 'Graph Linked',
      author: 'Prof. Eleanor Vance',
      fileSize: '4.2 MB',
      icon: 'subtitles',
    },
    {
      id: 'LIB-4092',
      title: 'Bodleian MS. Oxford 342: Late Imperial Treaty Treatises (Digitized)',
      moduleCode: 'HIST-302',
      department: 'Faculty of History',
      typeCategory: 'bodleian',
      typeLabel: 'Bodleian Holding',
      conceptNodes: ['Imperial Diplomacy', '19th C Governance'],
      accessScope: 'Honours Finalists',
      indexingStatus: 'Fully Indexed',
      author: 'Bodleian Special Collections',
      fileSize: '12.8 MB',
      icon: 'auto_stories',
    },
    {
      id: 'LIB-4093',
      title: 'Quantum Information & Qubit Verification Reading List',
      moduleCode: 'CS-501',
      department: 'Dept of Computer Science',
      typeCategory: 'reading',
      typeLabel: 'Reading List',
      conceptNodes: ['Entanglement', 'Qubit Gates', 'Error Correction'],
      accessScope: 'Open Student Access',
      indexingStatus: 'Fully Indexed',
      author: 'Prof. Sarah Jenkins',
      fileSize: '8.6 MB',
      icon: 'format_list_bulleted',
    },
    {
      id: 'LIB-4094',
      title: 'Macroeconomic Policy Architecture Formative Exam Papers',
      moduleCode: 'ECON-204',
      department: 'Department of Economics',
      typeCategory: 'exampaper',
      typeLabel: 'Exam Paper',
      conceptNodes: ['Monetary Policy', 'Fiscal Multipliers'],
      accessScope: 'Open Student Access',
      indexingStatus: 'Fully Indexed',
      author: 'Oxford Academic Registry',
      fileSize: '2.1 MB',
      icon: 'quiz',
    },
    {
      id: 'LIB-4095',
      title: 'Epistemology & Socratic Dialogue Session Transcripts',
      moduleCode: 'PHIL-101',
      department: 'Faculty of Philosophy',
      typeCategory: 'transcript',
      typeLabel: 'Lecture Transcript',
      conceptNodes: ['Logic Fallacies', 'Rationalism'],
      accessScope: 'Faculty Restricted',
      indexingStatus: 'Graph Linked',
      author: 'Dr. Julian Thorne',
      fileSize: '3.4 MB',
      icon: 'subtitles',
    },
    {
      id: 'LIB-4096',
      title: 'Advanced Fluid Mechanics & Aerodynamic Modelling Monographs',
      moduleCode: 'ENG-320',
      department: 'Dept of Engineering Science',
      typeCategory: 'reading',
      typeLabel: 'Reading List',
      conceptNodes: ['Navier-Stokes', 'Boundary Layer Theory'],
      accessScope: 'Open Student Access',
      indexingStatus: 'OCR Processing',
      author: 'Prof. Richard Sterling',
      fileSize: '6.5 MB',
      icon: 'format_list_bulleted',
    },
  ];

  const filteredCards = libraryCards.filter((card) => {
    const matchType = activeType === 'all' || card.typeCategory === activeType;
    const matchSearch =
      searchQuery === '' ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.moduleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchType && matchSearch;
  });

  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl space-y-[var(--spacing-section-gap)] font-body-md text-on-surface">
      {/* PAGE HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-4 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">
              Digital Catalogue • Bodleian SOLO Integration
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            Institutional Content Library
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Digitized manuscripts, lecture transcripts, reading lists, and Socratic Knowledge Graph concept mappings.
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/25 px-4 py-2 rounded-xl flex items-center gap-4 text-xs">
          <div>
            <span className="text-on-surface-variant/70 block">Catalogued Assets</span>
            <span className="font-serif text-lg font-bold text-primary">48,290</span>
          </div>
          <div className="h-6 w-px bg-outline-variant/30"></div>
          <div>
            <span className="text-on-surface-variant/70 block">Knowledge Graph</span>
            <span className="font-serif text-lg font-bold text-secondary">99.1% Coverage</span>
          </div>
        </div>
      </header>

      {/* FILTER SHELF TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/25">
        <FilterBar
          activeId={activeType}
          onSelect={setActiveType}
          options={[
            { id: 'all', label: 'All Shelves' },
            { id: 'transcript', label: 'Lecture Transcripts' },
            { id: 'reading', label: 'Reading Lists' },
            { id: 'bodleian', label: 'Bodleian Holdings' },
            { id: 'exampaper', label: 'Exam Papers' },
          ]}
          variant="pills"
        />

        <input
          className="w-64 bg-surface-container-low text-on-surface font-ui-functional text-xs py-1.5 px-3 rounded-lg border border-outline-variant/30 outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
          placeholder="Search asset, code or concept..."
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* CONTENT ASSET CARDS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
        {filteredCards.map((card) => (
          <article
            key={card.id}
            className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 hover:border-outline-variant/60 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[18px]">{card.icon}</span>
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-semibold">
                    {card.moduleCode}
                  </span>
                </div>

                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">
                  {card.id}
                </span>
              </div>

              <h2 className="font-serif text-base font-bold text-primary leading-tight">
                {card.title}
              </h2>
              <span className="text-xs text-on-surface-variant/70 block mt-1">Author / Source: {card.author}</span>

              {/* KNOWLEDGE GRAPH CONCEPT TAGS */}
              <div className="mt-3 pt-3 border-t border-outline-variant/15">
                <span className="text-[11px] font-semibold text-secondary block mb-1.5">Knowledge Graph Concept Nodes:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {card.conceptNodes.map((node) => (
                    <span key={node} className="text-[11px] px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-medium">
                      {node}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-outline-variant/15 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant/80 font-medium">{card.accessScope}</span>
              <button
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                onClick={() => alert(`Opening digital asset ${card.id}: ${card.title}`)}
                type="button"
              >
                Access Asset <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
