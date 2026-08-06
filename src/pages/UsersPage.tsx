import { useState, useEffect } from 'react';
import { Search, X, Mail, Building2 } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AppTag } from '../components/ui/AppTag';
import { MOCK_USERS } from '../lib/mockData';
import { api } from '../api/client';
import { clsx } from 'clsx';

type AppFilter = 'all' | 'estate' | 'school' | 'hospital' | 'logistics' | 'hospitality';
type StatusFilter = 'all' | 'active' | 'invited' | 'inactive';
type UserRow = typeof MOCK_USERS[0];

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function UsersPage() {
  const [search, setSearch] = useState('');
  const [appFilter, setAppFilter] = useState<AppFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [users, setUsers] = useState<UserRow[]>(MOCK_USERS);

  useEffect(() => {
    api.getUsers()
      .then(rows => setUsers(rows.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        business: u.businessName ?? '—',
        businessId: u.businessId ?? '',
        applications: [u.appKey],
        role: u.role,
        status: u.status,
        lastActive: relativeTime(u.lastLoginAt),
      }))))
      .catch(() => { /* keep mock */ });
  }, []);

  const filtered = users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (appFilter !== 'all' && !u.applications.includes(appFilter)) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Users</h1>
          <p className="text-sm text-muted mt-0.5">{filtered.length.toLocaleString()} users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="h-8 pl-8 pr-3 rounded-lg border border-outline bg-white text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-56" />
        </div>
        <select value={appFilter} onChange={e => setAppFilter(e.target.value as AppFilter)}
          className="h-8 px-3 rounded-lg border border-outline bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All products</option>
          {['estate', 'school', 'hospital', 'logistics', 'hospitality'].map(a => (
            <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          className="h-8 px-3 rounded-lg border border-outline bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="invited">Invited</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className={clsx('card overflow-hidden flex-1 min-w-0 transition-all', selected && 'hidden lg:block')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="table-cell py-3 text-left">User</th>
                  <th className="table-cell py-3 text-left">Business</th>
                  <th className="table-cell py-3 text-left">Products</th>
                  <th className="table-cell py-3 text-left">Role</th>
                  <th className="table-cell py-3 text-left">Status</th>
                  <th className="table-cell py-3 text-left">Last active</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-sm text-muted">No users match your filters</td></tr>
                ) : filtered.map(u => (
                  <tr key={u.id} className={clsx('table-row', selected?.id === u.id && 'bg-primary-tint/30')}
                    onClick={() => setSelected(u)}>
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary-tint flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                          {initials(u.name)}
                        </div>
                        <div>
                          <p className="font-medium text-on-surface">{u.name}</p>
                          <p className="text-xs text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell text-on-surface-variant text-xs">{u.business}</td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {u.applications.map(a => <AppTag key={a} appKey={a} />)}
                      </div>
                    </td>
                    <td className="table-cell text-on-surface-variant">{u.role}</td>
                    <td className="table-cell"><StatusBadge status={u.status as any} /></td>
                    <td className="table-cell text-on-surface-variant text-xs">{u.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail drawer */}
        {selected && (
          <div className="w-full lg:w-80 flex-shrink-0 card p-5 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-on-surface">User detail</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-surface-container-low">
                <X size={15} className="text-muted" />
              </button>
            </div>
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-primary-tint flex items-center justify-center text-primary text-xl font-semibold mb-2">
                {initials(selected.name)}
              </div>
              <p className="font-semibold text-on-surface">{selected.name}</p>
              <p className="text-xs text-muted">{selected.email}</p>
              <StatusBadge status={selected.status as any} className="mt-2" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Building2 size={14} className="flex-shrink-0" />
                <span>{selected.business}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Mail size={14} className="flex-shrink-0" />
                <span className="truncate">{selected.email}</span>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted mb-1.5">Products</p>
                <div className="flex flex-wrap gap-1">
                  {selected.applications.map(a => <AppTag key={a} appKey={a} />)}
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline">
                <span className="text-muted">Role</span>
                <span className="font-medium text-on-surface">{selected.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Last active</span>
                <span className="font-medium text-on-surface">{selected.lastActive}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
