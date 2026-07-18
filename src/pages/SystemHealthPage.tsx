import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, CheckCircle, XCircle, BellOff } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MOCK_LATENCY_TREND } from '../lib/mockData';
import { api } from '../api/client';
import { PRODUCT_COLORS } from '../types';
import type { MetricSnapshot } from '../types';
import { clsx } from 'clsx';

function fmtTick(iso: string) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/** Reshape KPI snapshots into per-product latency rows the line chart expects. */
function toLatencyTrend(snapshots: MetricSnapshot[]) {
  return snapshots.map(s => {
    const row: Record<string, string | number> = { time: fmtTick(s.capturedAt) };
    for (const a of s.perApp) row[a.key] = Math.round(a.avgResponseTimeMs);
    return row;
  });
}

type Service = {
  key: string; name: string; status: string; uptime: string;
  latency: number | null; errorRate: string; failedPayments: number | null; lastSeen?: string;
};

const SERVICES: Service[] = [
  { key: 'gateway', name: 'Periscope Gateway', status: 'healthy', uptime: '99.98%', latency: 38, errorRate: '0.01%', failedPayments: null },
  { key: 'estate', name: 'Estate', status: 'healthy', uptime: '99.95%', latency: 142, errorRate: '0.2%', failedPayments: 3 },
  { key: 'logistics', name: 'Logistics', status: 'healthy', uptime: '99.97%', latency: 148, errorRate: '0.1%', failedPayments: 5 },
  { key: 'school', name: 'School', status: 'healthy', uptime: '99.99%', latency: 130, errorRate: '0.0%', failedPayments: null },
  { key: 'esusu', name: 'esusu', status: 'healthy', uptime: '99.90%', latency: 121, errorRate: '0.3%', failedPayments: null },
  { key: 'hospital', name: 'Hospital', status: 'down', uptime: '—', latency: null, errorRate: '—', failedPayments: null, lastSeen: '6m ago' },
];

const ALERTS = [
  { id: 'a1', title: 'Hospital API unreachable', severity: 'critical', time: '6m ago', acknowledged: false },
  { id: 'a2', title: 'Logistics failed payments above threshold', severity: 'warning', time: '22m ago', acknowledged: false },
];

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;

export function SystemHealthPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alerts, setAlerts] = useState(ALERTS);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [latencyTrend, setLatencyTrend] = useState<Record<string, string | number>[]>(MOCK_LATENCY_TREND);

  useEffect(() => {
    api.getDashboardHistory({ limit: 500 })
      .then(({ snapshots }) => { if (snapshots.length) setLatencyTrend(toLatencyTrend(snapshots)); })
      .catch(() => { /* keep mock trend */ });
  }, []);

  useEffect(() => {
    Promise.all([api.getDashboard(), api.getMetrics().catch(() => null)])
      .then(([dash, metrics]) => {
        const gateway: Service = {
          key: 'gateway',
          name: 'Periscope Gateway',
          status: metrics ? (dash.kpis.systemHealth) : 'healthy',
          uptime: metrics ? pct(metrics.uptime) : '—',
          latency: metrics ? Math.round(metrics.avgResponseTimeMs) : null,
          errorRate: metrics && metrics.requestCount > 0
            ? pct(metrics.errorCount / metrics.requestCount) : '—',
          failedPayments: null,
        };
        const apps: Service[] = dash.applications.map(a => ({
          key: a.key,
          name: a.name,
          status: a.systemHealth,
          uptime: '—',
          latency: a.systemHealth === 'down' ? null : Math.round(a.avgResponseTimeMs),
          errorRate: '—',
          failedPayments: a.failedPayments ?? null,
          lastSeen: a.systemHealth === 'down' ? 'just now' : undefined,
        }));
        setServices([gateway, ...apps]);
      })
      .catch(() => { /* keep mock */ });
  }, []);

  const overallStatus = services.some(s => s.status === 'down') ? 'degraded' : 'healthy';

  const acknowledge = (id: string) => setAlerts(a => a.map(x => x.id === id ? { ...x, acknowledged: true } : x));

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-on-surface">System Health</h1>
          <StatusBadge status={overallStatus} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Last checked 5s ago</span>
          <button onClick={() => setAutoRefresh(v => !v)}
            className={clsx('flex items-center gap-1.5 px-3 h-8 rounded-lg border text-xs font-medium transition-colors',
              autoRefresh ? 'border-primary bg-primary-tint text-primary' : 'border-outline bg-white text-on-surface-variant'
            )}>
            <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} />
            Auto-refresh {autoRefresh ? 'on' : 'off'}
          </button>
        </div>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(svc => (
          <div key={svc.key} className={clsx('card p-4', svc.status === 'down' && 'border-danger/30 bg-danger-bg/10')}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: svc.key === 'gateway' ? '#4F46E5' : PRODUCT_COLORS[svc.key] ?? '#94A3B8' }} />
                <span className="text-sm font-semibold text-on-surface">{svc.name}</span>
              </div>
              <StatusBadge status={svc.status as any} />
            </div>

            {svc.status === 'down' ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-danger">
                  <XCircle size={14} />
                  <span>Unreachable · last seen {svc.lastSeen}</span>
                </div>
                <button className="text-xs text-primary hover:underline">Retry</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {[
                  { label: 'Uptime', value: svc.uptime },
                  { label: 'Avg latency', value: `${svc.latency}ms` },
                  { label: 'Error rate', value: svc.errorRate },
                  { label: 'Failed pmts', value: svc.failedPayments != null ? svc.failedPayments.toString() : '—' },
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

      {/* Latency chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-on-surface mb-4">Response time (last 60 min)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${v}ms`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v: unknown) => [`${Number(v)}ms`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                {Object.keys(PRODUCT_COLORS).map(key => (
                  <Line key={key} type="monotone" dataKey={key} name={key.charAt(0).toUpperCase() + key.slice(1)}
                    stroke={PRODUCT_COLORS[key]} strokeWidth={2} dot={false} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active alerts */}
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-on-surface mb-3">Active alerts</h2>
          {alerts.filter(a => !a.acknowledged).length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <CheckCircle size={24} className="text-success mb-2" />
              <p className="text-sm text-muted">All clear</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.filter(a => !a.acknowledged).map(alert => (
                <div key={alert.id} className={clsx('p-3 rounded-xl border',
                  alert.severity === 'critical' ? 'bg-danger-bg border-danger/20' : 'bg-warning-bg border-warning/20'
                )}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={14} className={clsx('mt-0.5 flex-shrink-0', alert.severity === 'critical' ? 'text-danger' : 'text-warning')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-on-surface">{alert.title}</p>
                      <p className="text-xs text-muted">{alert.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => acknowledge(alert.id)}
                      className="text-xs text-primary hover:underline">Acknowledge</button>
                    <button className="text-xs text-on-surface-variant hover:underline flex items-center gap-0.5">
                      <BellOff size={10} />Mute
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
