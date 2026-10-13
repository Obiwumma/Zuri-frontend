import React from 'react';

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  categoryLabel?: string;
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
}

export function DataTable<T>({
  title,
  subtitle,
  categoryLabel,
  columns,
  data,
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/25 p-5 flex flex-col gap-4">
      {(title || subtitle || categoryLabel) && (
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-outline-variant/20">
          <div>
            {categoryLabel && (
              <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-medium">{categoryLabel}</span>
            )}
            {title && <h2 className="font-headline-sm text-[18px] font-serif text-primary font-bold">{title}</h2>}
          </div>
          {subtitle && <p className="font-ui-functional text-[13px] text-on-surface-variant/70">{subtitle}</p>}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-ui-functional text-[13px]">
          <thead>
            <tr className="text-on-surface-variant/70 font-label-caps text-[11px] uppercase tracking-wider bg-surface-container-low/60 border-b border-outline-variant/30">
              {columns.map((col, idx) => (
                <th key={idx} className={`py-3 px-4 font-medium ${col.className || ''}`} scope="col">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15">
            {data.map((row, rowIdx) => (
              <tr key={keyExtractor(row, rowIdx)} className="hover:bg-surface-container-low/40 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={`py-3.5 px-4 ${col.className || ''}`}>
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
