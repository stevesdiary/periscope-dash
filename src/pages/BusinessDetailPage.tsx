import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, Calendar, Users, DollarSign, Layers } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AppTag } from '../components/ui/AppTag';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../api/client';
import { mockBusinessDetail, mockBusinesses } from '../lib/mockData';
import { PRODUCT_COLORS } from '../types';
import type { BusinessDetail } from '../types';

function fmt(n: number) { return `$${n.toLocaleString()}`; }
function fmtDate(s: string) { return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

export function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<'overview' | 'activity'>('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getBusiness(id)
      .then(setData)
      .catch((err) => {
        if (err?.status === 404) {
          setNotFound(true);
        } else {
          // fallback to mock
          const businesses = mockBusinesses();
          const mock = businesses?.find(b => b.id === id);
          const detail = mockBusinessDetail();
          if (mock) {
            setData(id === 'biz-cedarpark' && detail ? detail : { ...mock, applicationUsage: mock.applications.map(k => ({ key: k, name: k, status: mock.status, plan: 'Growth', mrr: mock.mrr, users: mock.users, createdAt: '2025-11-02T09:00:00.000Z' })) });
          } else {
            setNotFound(true);
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="p-6 space-y-5 max-w-[1000px] mx-auto">
      <Skeleton className="h-4 w-48" />
      <div className="card p-6 space-y-4">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-4 mt-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-28" />)}
        </div>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center mb-4">
        <Layers size={28} className="text-muted" />
      </div>
      <h2 className="text-lg font-semibold text-on-surface mb-1">Business not found</h2>
      <p className="text-sm text-muted mb-1">No business with ID</p>
      <code className="text-xs font-mono bg-surface-container px-2 py-1 rounded mb-4">{id}</code>
      <button onClick={() => navigate('/businesses')} className="btn-primary">
        <ArrowLeft size={14} />Back to Businesses
      </button>
    </div>
  );

  if (!data) return null;

  const donutData = data.applicationUsage.map(u => ({ name: u.name, value: u.mrr, key: u.key }));

  return (
    <div className="p-6 space-y-5 max-w-[1000px] mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <Link to="/businesses" className="text-muted hover:text-on-surface transition-colors">Businesses</Link>
        <span className="text-muted">/</span>
        <span className="text-on-surface font-medium">{data.name}</span>
      </div>

      {/* Header card */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-semibold text-on-surface">{data.name}</h1>
              <StatusBadge status={data.status} />
            </div>
            <p className="text-xs font-mono text-muted mb-2">{data.id}</p>
            <div className="flex flex-wrap gap-1">
              {data.applications.map(a => <AppTag key={a} appKey={a} />)}
            </div>
          </div>

          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)}
              className="p-2 rounded-lg border border-outline hover:bg-surface-container-low transition-colors">
              <MoreHorizontal size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-outline shadow-dropdown z-10 overflow-hidden">
                {['Suspend', 'Message owner', 'Open in product'].map(action => (
                  <button key={action} onClick={() => setMenuOpen(false)}
                    className={`flex w-full px-3 py-2 text-sm hover:bg-surface-container-low ${action === 'Suspend' ? 'text-danger' : 'text-on-surface'}`}>
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-outline">
          {[
            { icon: DollarSign, label: 'MRR', value: fmt(data.mrr) },
            { icon: Users, label: 'Users', value: data.users.toLocaleString() },
            { icon: Layers, label: 'Applications', value: data.applications.length.toString() },
            { icon: Calendar, label: 'Since', value: data.applicationUsage[0] ? fmtDate(data.applicationUsage[0].createdAt) : '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1 flex items-center gap-1">
                <Icon size={11} />{label}
              </p>
              <p className="text-lg font-semibold tabular text-on-surface">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline gap-1">
        {(['overview', 'activity'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Application usage */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-base font-semibold text-on-surface">Application usage</h2>
            {data.applicationUsage.map(u => (
              <div key={u.key} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PRODUCT_COLORS[u.key] ?? '#94A3B8' }} />
                    <span className="text-sm font-semibold text-on-surface">{u.name}</span>
                  </div>
                  <StatusBadge status={u.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Plan', value: u.plan },
                    { label: 'MRR', value: fmt(u.mrr) },
                    { label: 'Users', value: u.users.toLocaleString() },
                    { label: 'Created', value: fmtDate(u.createdAt) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted">{label}</p>
                      <p className="text-sm font-medium tabular text-on-surface">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Revenue donut */}
          {donutData.length > 1 && (
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-on-surface mb-3">Revenue split</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                      {donutData.map(entry => (
                        <Cell key={entry.key} fill={PRODUCT_COLORS[entry.key] ?? '#94A3B8'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: unknown) => [fmt(Number(v)), '']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'activity' && (
        <div className="card p-8 text-center">
          <p className="text-sm text-muted">Activity log coming soon.</p>
        </div>
      )}
    </div>
  );
}
