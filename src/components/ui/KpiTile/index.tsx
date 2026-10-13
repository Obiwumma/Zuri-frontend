import React from 'react';

export interface KpiTileProps {
  label: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon?: string;
  subtext?: React.ReactNode;
  progressWidth?: string;
}

export function KpiTile({
  label,
  value,
  trend,
  trendDirection = 'up',
  icon,
  subtext,
  progressWidth,
}: KpiTileProps) {
  const getTrendStyle = () => {
    if (trendDirection === 'down') {
      return 'text-error bg-error-container/30 border border-error/10';
    }
    if (trendDirection === 'neutral') {
      return 'text-on-surface-variant/80 bg-surface-container-high/60';
    }
    return 'text-primary bg-primary-fixed/40 border border-primary/10';
  };

  const getProgressBarColor = () => {
    if (trendDirection === 'down') {
      return 'bg-secondary';
    }
    return 'bg-primary';
  };

  return (
    <article className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/25 flex flex-col justify-between hover:border-outline-variant/50 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-label-caps text-[11px] uppercase tracking-wider text-on-surface-variant/70 font-medium">{label}</span>
          {icon && <span className="material-symbols-outlined text-[18px] text-outline/40 shrink-0">{icon}</span>}
        </div>
        <div className="flex items-baseline justify-between gap-3 my-1">
          <span className="font-serif text-[32px] leading-none text-primary font-bold tracking-tight">{value}</span>
          {trend && (
            <span className={`font-ui-functional text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${getTrendStyle()}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
      {subtext && (
        <div className="mt-3 pt-2.5 border-t border-outline-variant/15">
          <div className="font-ui-functional text-[12px] text-on-surface-variant/70 font-normal leading-normal">
            {subtext}
          </div>
          {progressWidth && (
            <div className="mt-2 w-full bg-surface-container rounded-full h-1 overflow-hidden">
              <div className={`${getProgressBarColor()} h-1 rounded-full`} style={{ width: progressWidth }}></div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
