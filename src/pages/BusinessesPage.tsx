import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { AppTag } from '../components/ui/AppTag';
import { SkeletonTable } from '../components/ui/Skeleton';
import { api } from '../api/client';
import { MOCK_BUSINESSES } from '../lib/mockData';
import type { BusinessListItem } from '../types';
import { clsx } from 'clsx';

type SortKey = 'name' | 'mrr' | 'users';
type StatusFilter = 'all' | 'active' | 'inactive' | 'suspended';

function fmt(n: number) {
  return n === 0 ? '—' : `$${n.toLocaleString()}`;
}

export function BusinessesPage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<BusinessListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [appFilter, setAppFilter] = useState('all');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'mrr', dir: 'desc' });
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  useEffect(() => {
    api.getBusinesses()
      .then(setBusinesses)
      .catch(() => setBusinesses(MOCK_BUSINESSES))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = businesses;
    if (search) list = list.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search.toLowerCase()));
    if (statusFilter !== 'all') list = list.filter(b => b.status === statusFilter);
    if (appFilter !== 'all') list = list.filter(b => b.applications.includes(appFilter));
    list = [...list].sort((a, b) => {
      const v = sort.key === 'name' ? a.name.localeCompare(b.name) : (a[sort.key] - b[sort.key]);
      return sort.dir === 'asc' ? v : -v;
    });
    return list;
  }, [businesses, search, statusFilter, appFilter, sort]);

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleSort = (key: SortKey) => {
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={10} className={sort.key === k && sort.dir === 'asc' ? 'text-primary' : 'text-muted'} />
      <ChevronDown size={10} className={sort.key === k && sort.dir === 'desc' ? 'text-primary' : 'text-muted'} />
    </span>
  );

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-on-surface">Businesses</h1>
          <p className="text-sm text-muted mt-0.5">{filtered.length} businesses</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or ID"
            className="h-8 pl-8 pr-3 rounded-lg border border-outline bg-white text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-56" />
        </div>

        {/* Status filter */}
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
          className="h-8 px-3 rounded-lg border border-outline bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>

        {/* App filter */}
        <select value={appFilter} onChange={e => { setAppFilter(e.target.value); setPage(1); }}
          className="h-8 px-3 rounded-lg border border-outline bg-white text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20">
          <option value="all">All products</option>
          {['estate', 'school', 'hospital', 'logistics', 'hospitality'].map(a => (
            <option key={a} value={a}>{a.charAt(0).toUpperCase() + a.slice(1)}</option>
          ))}
        </select>

        {(search || statusFilter !== 'all' || appFilter !== 'all') && (
          <button onClick={() => { setSearch(''); setStatusFilter('all'); setAppFilter('all'); setPage(1); }}
            className="h-8 px-3 rounded-lg text-sm text-primary hover:bg-primary-tint transition-colors">
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? <SkeletonTable /> : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="table-cell py-3 text-left cursor-pointer select-none" onClick={() => toggleSort('name')}>
                    Business <SortIcon k="name" />
                  </th>
                  <th className="table-cell py-3 text-left">Status</th>
                  <th className="table-cell py-3 text-left">Products</th>
                  <th className="table-cell py-3 text-right cursor-pointer select-none" onClick={() => toggleSort('mrr')}>
                    MRR <SortIcon k="mrr" />
                  </th>
                  <th className="table-cell py-3 text-right cursor-pointer select-none" onClick={() => toggleSort('users')}>
                    Users <SortIcon k="users" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <p className="text-sm font-medium text-on-surface mb-1">No businesses match your filters</p>
                      <button onClick={() => { setSearch(''); setStatusFilter('all'); setAppFilter('all'); }}
                        className="text-sm text-primary hover:underline">Clear filters</button>
                    </td>
                  </tr>
                ) : paged.map(b => (
                  <tr key={b.id} className="table-row" onClick={() => navigate(`/businesses/${b.id}`)}>
                    <td className="table-cell">
                      <p className="font-medium text-on-surface">{b.name}</p>
                      <p className="text-xs text-muted font-mono">{b.id}</p>
                    </td>
                    <td className="table-cell"><StatusBadge status={b.status} /></td>
                    <td className="table-cell">
                      <div className="flex flex-wrap gap-1">
                        {b.applications.map(a => <AppTag key={a} appKey={a} />)}
                      </div>
                    </td>
                    <td className="table-cell text-right tabular font-medium">{fmt(b.mrr)}</td>
                    <td className="table-cell text-right tabular">{b.users.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-outline">
              <p className="text-xs text-muted">
                {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="p-1.5 rounded-lg hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={clsx('w-7 h-7 rounded-lg text-xs font-medium transition-colors',
                      p === page ? 'bg-primary text-white' : 'hover:bg-surface-container-low text-on-surface-variant'
                    )}>
                    {p}
                  </button>
                ))}
                <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                  className="p-1.5 rounded-lg hover:bg-surface-container-low disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
