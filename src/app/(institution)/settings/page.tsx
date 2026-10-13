'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="max-w-max-width mx-auto px-margin-desktop py-space-xl">
      <div className="flex flex-col gap-space-md">
        <div className="pb-4 border-b border-outline-variant/20">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-[32px] text-primary tracking-tight font-bold">
            Institution Settings
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 mt-1">
            Configure institutional parameters, Shibboleth/InCommon SSO federation, and API credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-gutter)] mt-4">
          <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl p-5 flex flex-col gap-3">
            <h2 className="font-serif text-lg font-bold text-primary">Single Sign-On (SSO) Federation</h2>
            <p className="text-xs text-on-surface-variant/80">InCommon / Shibboleth SAML 2.0 Identity Provider configuration for Oxford SSO.</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-xs font-semibold text-primary">InCommon Active (99.8% Sync)</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/25 rounded-xl p-5 flex flex-col gap-3">
            <h2 className="font-serif text-lg font-bold text-primary">Data Privacy & Retention</h2>
            <p className="text-xs text-on-surface-variant/80">Governs student interaction telemetry and AI supervision data retention schedules.</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-mono bg-surface-container px-2 py-1 rounded text-on-surface">365 Day Audit Log Retention</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
