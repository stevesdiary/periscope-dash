import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface KpiCardProps {
  label: string;
  value: string;
  delta?: { value: string; positive: boolean };
  subline?: string;
  danger?: boolean;
  sparkData?: number[];
}

export function KpiCard({ label, value, delta, subline, danger, sparkData }: KpiCardProps) {
  return (
    <div className={clsx('card p-5 flex flex-col gap-3', danger && 'border-danger/30 bg-danger-bg/20')}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{label}</p>
        {delta && (
          <span className={clsx('inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium',
            delta.positive ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
          )}>
            {delta.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {delta.value}
          </span>
        )}
      </div>
      <div>
        <p className={clsx('text-2xl font-semibold tabular', danger ? 'text-danger' : 'text-on-surface')}>{value}</p>
        {subline && <p className="text-xs text-muted mt-0.5">{subline}</p>}
      </div>
      {sparkData && (
        <div className="h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData.map((v, i) => ({ v, i }))}>
              <Line type="monotone" dataKey="v" stroke="#4F46E5" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
