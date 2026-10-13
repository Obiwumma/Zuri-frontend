'use client';

import React, { useState } from 'react';

export interface DevStateOption {
  id: string;
  label: string;
  onClick?: () => void;
}

export interface DevStateLensProps {
  label?: string;
  options: DevStateOption[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function DevStateLens({
  label = 'Dev State Lens',
  options,
  activeId,
  onSelect,
}: DevStateLensProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Exclude completely from production builds
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="bg-surface-container-highest/95 backdrop-blur-md border border-outline-variant p-space-sm rounded-xl shadow-xl flex flex-col gap-space-xs min-w-[240px] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between px-space-xs pb-space-xs border-b border-outline-variant/50">
            <span className="font-label-caps text-label-caps uppercase text-secondary font-bold flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[14px]">tune</span>
              {label}
            </span>
            <button
              aria-label="Close Dev Controls"
              className="text-on-surface-variant hover:text-on-surface p-0.5 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="flex flex-col gap-1 py-1">
            {options.map((option) => {
              const isSelected = activeId === option.id;
              return (
                <button
                  key={option.id}
                  className={`text-left px-space-sm py-1.5 rounded-md font-ui-functional text-[12px] transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-on-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                  onClick={() => {
                    onSelect(option.id);
                    option.onClick?.();
                    setIsOpen(false);
                  }}
                  type="button"
                >
                  <span>{option.label}</span>
                  {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        className="flex items-center gap-space-xs bg-surface-container-highest/90 hover:bg-surface-container-highest text-on-surface border border-outline-variant px-space-sm py-1.5 rounded-full shadow-md backdrop-blur-md font-label-caps text-label-caps uppercase tracking-wider text-secondary transition-all hover:scale-105 active:scale-95 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Dev State Lens"
        type="button"
      >
        <span className="material-symbols-outlined text-[16px]">tune</span>
        <span>Demo State</span>
        <span className="w-2 h-2 rounded-full bg-secondary"></span>
      </button>
    </div>
  );
}
