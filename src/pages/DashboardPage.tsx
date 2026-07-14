import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KpiCard } from '../components/ui/KpiCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { api } from '../api/client';
import { MOCK_DASHBOARD, MOCK_MRR_TREND } from '../lib/mockData';
import { PRODUCT_COLORS } from '../types';
import type { ExecutiveDashboard } from '../types';
import { clsx } from 'clsx';

const MRR_SPARK = [38000, 40000, 41500, 43000, 44000, 44500, 45000, 45500, 46000, 46500, 47000, 48250];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toLocaleString()}`;
}

export function DashboardPage() {
  const [data, setData] = useState<ExecutiveDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<'Today' | '7d' | '30d'>('30d');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboard();
      setData(res);
    } catch {
      setData(MOCK_DASHBOARD); // fallback to mock
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = data?.kpis ?? MOCK_DASHBOARD.kpis;
  const apps = data?.applications ?? MOCK_DASHBOARD.applications;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Dashboard</h1>
          <p className="text-sm text-muted mt-0.5">
            Updated {data ? 'just now' : '—'} · aggregated across {kpis.applications} products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-outline overflow-hidden bg-white">
            {(['Today', '7d', '30d'] as const).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={clsx('px-3 h-8 text-xs font-medium transition-colors',
                  range === r ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
                )}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={load} className="btn-secondary h-8 px-3 text-xs gap-1.5">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh
          </button>
        </div>
      </div>

      {/* System health banner */}
      {kpis.systemHealth !== 'healthy' && (
        <div className={clsx('flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 text-sm',
          kpis.systemHealth === 'degraded'
            ? 'bg-warning-bg border-warning text-warning'
            : 'bg-danger-bg border-danger text-danger'
        )}>
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span className="flex-1">
            {kpis.systemHealth === 'degraded'
              ? 'System degraded — Hospital API is unavailable; showing last known values.'
              : 'System down — multiple product APIs are unreachable.'}
          </span>
          <button className="text-xs font-medium underline underline-offset-2 flex items-center gap-1">
            View System Health <ExternalLink size={11} />
          </button>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <KpiCard label="MRR" value={fmt(kpis.mrr)} delta={{ value: '6.4%', positive: true }} sparkData={MRR_SPARK} />
            <KpiCard label="ARR" value={fmt(kpis.arr)} />
            <KpiCard label="Businesses" value={kpis.businesses.toLocaleString()} subline={`${kpis.activeBusinesses} active`} />
            <KpiCard label="Users" value={kpis.users.toLocaleString()} delta={{ value: '3.1%', positive: true }} sparkData={MRR_SPARK.map(v => v / 10)} />
            <KpiCard label="Active Subscriptions" value={kpis.activeSubscriptions.toLocaleString()} />
            <KpiCard label="Failed Payments" value={kpis.failedPayments.toString()} delta={{ value: '2', positive: false }} danger />
            <KpiCard label="Signups Today" value={kpis.todaySignups.toString()} />
            <KpiCard label="Revenue Today" value={fmt(kpis.todayRevenue)} />
          </>
        )}
      </div>

      {/* MRR Trend chart */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-on-surface mb-4">Monthly recurring revenue</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_MRR_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                {Object.entries(PRODUCT_COLORS).map(([key, color]) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `$${v / 1000}k`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={48} />
              <Tooltip formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              {Object.entries(PRODUCT_COLORS).map(([key, color]) => (
                <Area key={key} type="monotone" dataKey={key} name={key.charAt(0).toUpperCase() + key.slice(1)}
                  stroke={color} strokeWidth={2} fill={`url(#grad-${key})`} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-product breakdown */}
      <div>
        <h2 className="text-base font-semibold text-on-surface mb-3">By product</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {apps.map(app => (
            <div key={app.key} className={clsx('card p-4', app.unavailable && 'opacity-60')}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PRODUCT_COLORS[app.key] ?? '#94A3B8' }} />
                  <span className="text-sm font-semibold text-on-surface">{app.name}</span>
                </div>
                {app.unavailable
                  ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-container text-muted">Unavailable</span>
                  : <StatusBadge status={app.systemHealth} />
                }
              </div>
              {app.unavailable ? (
                <div className="text-center py-3">
                  <p className="text-xs text-muted mb-2">Data unavailable</p>
                  <button className="text-xs text-primary hover:underline">Retry</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                  {[
                    { label: 'Businesses', value: app.businesses.toLocaleString() },
                    { label: 'Users', value: app.users.toLocaleString() },
                    { label: 'MRR', value: fmt(app.mrr) },
                    { label: 'Latency', value: `${app.avgResponseTimeMs}ms` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted">{label}</p>
                      <p className="text-sm font-semibold tabular text-on-surface">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
