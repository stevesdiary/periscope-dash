import { useState, useEffect } from 'react';
import { RefreshCw, Truck, Package, MapPin, Timer, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KpiCard } from '../components/ui/KpiCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SkeletonCard, SkeletonTable } from '../components/ui/Skeleton';
import { MOCK_LOGISTICS } from '../lib/mockData';
import { api } from '../api/client';
import type { LogisticsOverview } from '../types';

const CURRENCY_SYMBOL: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };
function fmtMoney(amount: number, currency = 'NGN') {
  return `${CURRENCY_SYMBOL[currency] ?? ''}${amount.toLocaleString()}`;
}

export function LogisticsPage() {
  const [data, setData] = useState<LogisticsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getLogistics();
      setData(res);
    } catch {
      setData(MOCK_LOGISTICS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const kpis = data?.kpis ?? MOCK_LOGISTICS.kpis;
  const currency = kpis.currency;
  const deliverySpark = (data?.deliveriesTrend ?? MOCK_LOGISTICS.deliveriesTrend).map(d => d.delivered);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#0EA5E9', color: '#fff' }}>
            <Truck size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-on-surface">Logistics</h1>
            <p className="text-sm text-muted mt-0.5">
              Updated {data ? 'just now' : '—'} · {fmtMoney(kpis.revenueMtd, currency)} MTD
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={data?.systemHealth ?? MOCK_LOGISTICS.systemHealth} />
          <button onClick={load} className="btn-secondary h-8 px-3 text-xs gap-1.5">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <KpiCard label="Shipments Today" value={kpis.shipmentsToday.toLocaleString()} delta={{ value: '8.2%', positive: true }} sparkData={deliverySpark} />
            <KpiCard label="Deliveries Today" value={kpis.deliveriesToday.toLocaleString()} subline={`${kpis.inTransit} in transit`} />
            <KpiCard label="On-time Rate" value={`${kpis.onTimeRate}%`} delta={{ value: '1.2pt', positive: true }} />
            <KpiCard label="Active Vehicles" value={kpis.activeVehicles.toString()} subline={`${kpis.fleetSize} in fleet`} />
            <KpiCard label="Active Drivers" value={kpis.activeDrivers.toString()} />
            <KpiCard label="In Transit" value={kpis.inTransit.toString()} />
            <KpiCard label="Delayed Shipments" value={kpis.delayed.toString()} danger={kpis.delayed > 0} delta={{ value: String(kpis.delayed), positive: false }} />
            <KpiCard label="Revenue Today" value={fmtMoney(kpis.revenueToday, currency)} subline={`${fmtMoney(kpis.mrr, currency)} MRR`} />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-on-surface mb-4">Deliveries (last 14 days)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.deliveriesTrend ?? MOCK_LOGISTICS.deliveriesTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="delivered" name="Delivered" stackId="a" fill="#16A34A" radius={[0, 0, 0, 0]} />
                <Bar dataKey="in_transit" name="In transit" stackId="a" fill="#0EA5E9" />
                <Bar dataKey="delayed" name="Delayed" stackId="a" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-on-surface mb-4">On-time delivery rate</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.onTimeTrend ?? MOCK_LOGISTICS.onTimeTrend} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[90, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip formatter={(v: unknown) => [`${Number(v)}%`, 'On-time']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                <Line type="monotone" dataKey="rate" name="On-time" stroke="#0EA5E9" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Shipments table */}
      <div>
        <h2 className="text-base font-semibold text-on-surface mb-3">Recent shipments</h2>
        {loading ? (
          <SkeletonTable rows={6} />
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="table-cell py-2.5 text-left">Tracking</th>
                    <th className="table-cell py-2.5 text-left">Business</th>
                    <th className="table-cell py-2.5 text-left">Route</th>
                    <th className="table-cell py-2.5 text-left">Driver / Vehicle</th>
                    <th className="table-cell py-2.5 text-right">Weight</th>
                    <th className="table-cell py-2.5 text-left">Status</th>
                    <th className="table-cell py-2.5 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.shipments ?? MOCK_LOGISTICS.shipments).map(s => (
                    <tr key={s.id} className="table-row">
                      <td className="table-cell font-medium tabular">{s.trackingCode}</td>
                      <td className="table-cell">{s.businessName}</td>
                      <td className="table-cell text-on-surface-variant text-xs">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} className="text-muted flex-shrink-0" />
                          {s.origin} → {s.destination}
                        </span>
                      </td>
                      <td className="table-cell text-on-surface-variant text-xs">
                        {s.driverName && s.vehiclePlate !== '—'
                          ? `${s.driverName} · ${s.vehiclePlate}`
                          : <span className="text-muted">Not assigned</span>}
                      </td>
                      <td className="table-cell text-right tabular">{s.weightKg.toLocaleString()} kg</td>
                      <td className="table-cell"><StatusBadge status={s.status} /></td>
                      <td className="table-cell text-right tabular font-medium">{fmtMoney(s.revenue, s.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Fleet + Routes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck size={14} className="text-on-surface-variant" />
            <h2 className="text-sm font-semibold text-on-surface">Fleet</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-10" />)}
            </div>
          ) : (
            <div className="space-y-2.5">
              {(data?.vehicles ?? MOCK_LOGISTICS.vehicles).map(v => (
                <div key={v.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-outline">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface tabular">{v.plateNumber}</p>
                    <p className="text-xs text-muted truncate">
                      {v.model}{v.driverName ? ` · ${v.driverName}` : ''}
                    </p>
                  </div>
                  <StatusBadge status={v.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package size={14} className="text-on-surface-variant" />
            <h2 className="text-sm font-semibold text-on-surface">Active routes</h2>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-10" />)}
            </div>
          ) : (
            <div className="space-y-2.5">
              {(data?.routes ?? MOCK_LOGISTICS.routes).map(r => (
                <div key={r.id} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-outline">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface">{r.name}</p>
                    <p className="text-xs text-muted truncate">
                      <span className="inline-flex items-center gap-0.5"><MapPin size={10} />{r.stops} stops</span>
                      {' · '}{r.distanceKm.toLocaleString()} km
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-on-surface-variant">
                    <Timer size={11} className="text-muted" />
                    {r.activeDeliveries} active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delayed banner */}
      {!loading && kpis.delayed > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-warning bg-warning-bg text-warning text-sm">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <span>{kpis.delayed} shipment{kpis.delayed === 1 ? ' is' : 's are'} delayed — PSL-4204 (Northgate Schools) is the longest open delay.</span>
        </div>
      )}
    </div>
  );
}
