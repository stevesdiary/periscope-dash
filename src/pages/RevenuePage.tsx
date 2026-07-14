import { useState } from 'react';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AppTag } from '../components/ui/AppTag';
import { MOCK_MRR_TREND, MOCK_SUBSCRIPTIONS } from '../lib/mockData';
import { PRODUCT_COLORS } from '../types';
import { clsx } from 'clsx';

const PLAN_DATA = [
  { plan: 'Pro', mrr: 58000 },
  { plan: 'Growth', mrr: 41000 },
  { plan: 'Starter', mrr: 21000 },
];

const FAILED_PAYMENTS = [
  { business: 'Northgate Schools', amount: 3400, reason: 'card_declined', time: '22m ago' },
  { business: 'Havenwood Clinic', amount: 1200, reason: 'insufficient_funds', time: '2h ago' },
  { business: 'Oakmount Estate', amount: 800, reason: 'card_expired', time: '5h ago' },
];

function fmtDate(s: string | null) {
  if (!s) return '—';
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

type Range = '30d' | 'QTD' | 'YTD';
type SubFilter = 'all' | 'active' | 'past_due' | 'cancelled' | 'trialing';

export function RevenuePage() {
  const [range, setRange] = useState<Range>('30d');
  const [subFilter, setSubFilter] = useState<SubFilter>('all');

  const subs = subFilter === 'all' ? MOCK_SUBSCRIPTIONS : MOCK_SUBSCRIPTIONS.filter(s => s.status === subFilter);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-on-surface">Revenue</h1>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-outline overflow-hidden bg-white">
            {(['30d', 'QTD', 'YTD'] as Range[]).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className={clsx('px-3 h-8 text-xs font-medium transition-colors',
                  range === r ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
                )}>
                {r}
              </button>
            ))}
          </div>
          <button className="btn-secondary h-8 px-3 text-xs gap-1.5">
            <Download size={13} />Export CSV
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'MRR', value: '$120,000', delta: { v: '6.4%', pos: true } },
          { label: 'ARR', value: '$1.44M', delta: null },
          { label: 'Net new MRR', value: '$7,200', delta: { v: '12%', pos: true } },
          { label: 'Failed payments', value: '8', delta: { v: '2', pos: false }, danger: true },
        ].map(({ label, value, delta, danger }) => (
          <div key={label} className={clsx('card p-4', danger && 'border-danger/30 bg-danger-bg/20')}>
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-2">{label}</p>
            <div className="flex items-end justify-between gap-2">
              <p className={clsx('text-2xl font-semibold tabular', danger ? 'text-danger' : 'text-on-surface')}>{value}</p>
              {delta && (
                <span className={clsx('inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium mb-0.5',
                  delta.pos ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                )}>
                  {delta.pos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {delta.v}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-on-surface mb-4">MRR trend by product</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MRR_TREND} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  {Object.entries(PRODUCT_COLORS).map(([key, color]) => (
                    <linearGradient key={key} id={`rev-grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${v / 1000}k`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                {Object.entries(PRODUCT_COLORS).map(([key, color]) => (
                  <Area key={key} type="monotone" dataKey={key} name={key.charAt(0).toUpperCase() + key.slice(1)}
                    stroke={color} strokeWidth={2} fill={`url(#rev-grad-${key})`} dot={false} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-on-surface mb-4">MRR by plan</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLAN_DATA} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
                <XAxis type="number" tickFormatter={v => `$${v / 1000}k`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="plan" tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} width={52} />
                <Tooltip formatter={(v: unknown) => [`$${Number(v).toLocaleString()}`, 'MRR']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Bar dataKey="mrr" fill="#4F46E5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subscriptions + Failed payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Subscriptions table */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline">
            <h2 className="text-sm font-semibold text-on-surface">Active subscriptions</h2>
            <div className="flex rounded-lg border border-outline overflow-hidden bg-white">
              {(['all', 'active', 'past_due', 'cancelled', 'trialing'] as SubFilter[]).map(f => (
                <button key={f} onClick={() => setSubFilter(f)}
                  className={clsx('px-2.5 h-7 text-xs font-medium transition-colors capitalize',
                    subFilter === f ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
                  )}>
                  {f === 'past_due' ? 'Past due' : f}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="table-cell py-2.5 text-left">Business</th>
                  <th className="table-cell py-2.5 text-left">Product</th>
                  <th className="table-cell py-2.5 text-left">Plan</th>
                  <th className="table-cell py-2.5 text-right">MRR</th>
                  <th className="table-cell py-2.5 text-left">Status</th>
                  <th className="table-cell py-2.5 text-left">Renews</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(s => (
                  <tr key={s.id} className="table-row">
                    <td className="table-cell font-medium">{s.businessName}</td>
                    <td className="table-cell"><AppTag appKey={s.businessId.includes('northgate') ? 'school' : s.businessId.includes('havenwood') ? 'hospital' : 'estate'} /></td>
                    <td className="table-cell text-on-surface-variant">{s.plan}</td>
                    <td className="table-cell text-right tabular font-medium">{s.mrr > 0 ? `$${s.mrr.toLocaleString()}` : '—'}</td>
                    <td className="table-cell"><StatusBadge status={s.status} /></td>
                    <td className="table-cell text-on-surface-variant text-xs">{fmtDate(s.renewsAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Failed payments */}
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-on-surface mb-3">Failed payments</h2>
          <div className="space-y-3">
            {FAILED_PAYMENTS.map((p, i) => (
              <div key={i} className="flex items-start justify-between gap-3 pb-3 border-b border-outline last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-on-surface">{p.business}</p>
                  <p className="text-xs text-muted">{p.reason} · {p.time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold tabular text-danger">${p.amount.toLocaleString()}</p>
                  <button className="text-xs text-primary hover:underline">Retry</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
