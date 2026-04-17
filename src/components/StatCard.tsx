import { ReactNode } from 'react';

export default function StatCard({ label, value, icon, hint, accent }: {
  label: string; value: ReactNode; icon?: ReactNode; hint?: string; accent?: boolean;
}) {
  return (
    <div className={`card p-5 card-hover ${accent ? 'bg-gradient-to-br from-brand-50 to-white border-brand-200' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="label">{label}</div>
          <div className="text-3xl font-extrabold text-brand-700 mt-1">{value}</div>
          {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
