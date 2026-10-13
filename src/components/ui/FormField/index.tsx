import React from 'react';

export function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 mb-4">
      <label className="text-xs font-semibold text-on-surface-variant">{label}</label>
      {children}
    </div>
  );
}
