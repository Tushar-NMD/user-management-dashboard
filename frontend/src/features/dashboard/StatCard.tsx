import React from 'react';
import { Spinner } from '../../components/ui/Spinner';

interface StatCardProps {
  label: string;
  value?: number;
  loading?: boolean;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  accentVariant?: 'primary' | 'success' | 'warning' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  loading = false,
  icon,
  description,
  badge,
  accentVariant = 'neutral',
}) => {
  const iconBgClasses = {
    primary: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    success: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border border-amber-100',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            {loading ? (
              <div className="h-9 flex items-center">
                <Spinner size="sm" />
              </div>
            ) : (
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {value !== undefined ? value.toLocaleString() : '—'}
              </span>
            )}
            {badge && !loading && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className={`p-2.5 rounded-xl shrink-0 ${iconBgClasses[accentVariant]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="truncate">{description}</span>
      </div>
    </div>
  );
};
