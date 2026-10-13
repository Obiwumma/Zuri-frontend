import React from 'react';

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterBarProps {
  label?: string;
  icon?: string;
  options: FilterOption[];
  activeId: string;
  onSelect: (id: string) => void;
  variant?: 'pills' | 'tabs';
  className?: string;
}

export function FilterBar({
  label,
  icon,
  options,
  activeId,
  onSelect,
  variant = 'pills',
  className = '',
}: FilterBarProps) {
  if (variant === 'tabs') {
    return (
      <aside aria-label={label || 'Filter Bar'} className={`flex flex-col md:flex-row md:items-center justify-between gap-3 bg-surface-container-low/50 px-4 py-2 rounded-xl border border-outline-variant/20 ${className}`}>
        {(label || icon) && (
          <div className="flex items-center gap-2">
            {icon && <span className="material-symbols-outlined text-[18px] text-secondary/80">{icon}</span>}
            {label && <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant/70 font-medium">{label}</span>}
          </div>
        )}
        <div className="flex items-center gap-1 p-1 bg-surface-container/60 rounded-lg" role="tablist">
          {options.map((option) => {
            const isSelected = activeId === option.id;
            return (
              <button
                key={option.id}
                aria-selected={isSelected}
                className={`px-3 py-1 rounded-md font-ui-functional text-[12px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface-container-lowest text-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant/70 hover:text-on-surface font-normal'
                }`}
                onClick={() => onSelect(option.id)}
                role="tab"
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {options.map((option) => {
        const isSelected = activeId === option.id;
        return (
          <button
            key={option.id}
            className={`activity-pill px-3 py-1 rounded-full font-ui-functional text-[12px] transition-all cursor-pointer ${
              isSelected
                ? 'bg-primary text-on-primary font-medium shadow-xs'
                : 'bg-surface-container-low text-on-surface-variant/80 hover:bg-surface-container hover:text-on-surface font-normal'
            }`}
            onClick={() => onSelect(option.id)}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
