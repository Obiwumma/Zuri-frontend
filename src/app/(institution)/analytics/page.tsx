'use client';

import React from 'react';
import Link from 'next/link';

export default function AnalyticsPage() {
  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl">
      <div className="flex flex-col gap-space-md">
        <div className="pb-4 border-b border-outline-variant/20">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            Analytics Overview
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Institutional intelligence suites for student interventions, Socratic AI usage, and assessment outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--spacing-gutter)] mt-4">
          <Link
            href="/analytics/interventions"
            className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl p-5 hover:border-primary/50 transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <span className="material-symbols-outlined text-[24px] text-secondary mb-2">flag</span>
              <h2 className="font-serif text-lg font-bold text-primary">Intervention Analytics</h2>
              <p className="text-xs text-on-surface-variant/80 mt-1">Monitor tutorial alerts and early-warning student reviews.</p>
            </div>
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              View Dashboard <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </Link>

          <Link
            href="/analytics/ai-usage"
            className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl p-5 hover:border-primary/50 transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <span className="material-symbols-outlined text-[24px] text-secondary mb-2">psychology</span>
              <h2 className="font-serif text-lg font-bold text-primary">AI Usage Monitoring</h2>
              <p className="text-xs text-on-surface-variant/80 mt-1">Track Socratic AI query volume across undergraduate & PG cohorts.</p>
            </div>
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              View Dashboard <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </Link>

          <Link
            href="/analytics/quiz-performance"
            className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl p-5 hover:border-primary/50 transition-all flex flex-col justify-between gap-4"
          >
            <div>
              <span className="material-symbols-outlined text-[24px] text-secondary mb-2">fact_check</span>
              <h2 className="font-serif text-lg font-bold text-primary">Quiz Performance</h2>
              <p className="text-xs text-on-surface-variant/80 mt-1">Assessment outcomes, pass/fail rates, and formative mastery.</p>
            </div>
            <span className="text-xs font-semibold text-primary flex items-center gap-1">
              View Dashboard <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
