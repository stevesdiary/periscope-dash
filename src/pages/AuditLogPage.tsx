import { useState } from 'react';
import { Search, Download, X, Copy, Check } from 'lucide-react';
import { MOCK_AUDIT_LOG } from '../lib/mockData';
import { clsx } from 'clsx';

const ACTION_COLORS: Record<string, string> = {
  'totp.disable': 'bg-warning-bg text-warning',
  'totp.enable': 'bg-success-bg text-success',
  'auth.login': 'bg-info-bg text-info',
  'business.view': 'bg-primary-tint text-primary',
  'dashboard.view': 'bg-primary-tint text-primary',
  'admin.invite': 'bg-success-bg text-success',
};

function fmtTime(s: string) {
  return new Date(s).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'medium' });
}

function initials(email: string) { return email[0].toUpperCase(); }

export function AuditLogPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof MOCK_AUDIT_LOG[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = MOCK_AUDIT_LOG.filter(e =>
    !search ||
    e.actor.toLowerCase().includes(search.toLowerCase()) ||
    e.action.toLowerCase().includes(search.toLowerCase()) ||
    e.target.toLowerCase().includes(search.toLowerCase()) ||
    e.correlationId.includes(search)
  );

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-semibold text-on-surface">Audit Log</h1>
        <button className="btn-secondary h-8 px-3 text-xs gap-1.5">
          <Download size={13} />Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search actor, action, target…"
            className="h-8 pl-8 pr-3 rounded-lg border border-outline bg-white text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64" />
        </div>
        <select className="h-8 px-3 rounded-lg border border-outline bg-white text-sm text-on-surface focus:outline-none">
          <option>All actors</option>
          {[...new Set(MOCK_AUDIT_LOG.map(e => e.actor))].map(a => <option key={a}>{a}</option>)}
        </select>
        <select className="h-8 px-3 rounded-lg border border-outline bg-white text-sm text-on-surface focus:outline-none">
          <option>All actions</option>
          {[...new Set(MOCK_AUDIT_LOG.map(e => e.action))].map(a => <option key={a}>{a}</option>)}
        </select>
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="card overflow-hidden flex-1 min-w-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="table-cell py-3 text-left">Time (UTC)</th>
                  <th className="table-cell py-3 text-left">Actor</th>
                  <th className="table-cell py-3 text-left">Action</th>
                  <th className="table-cell py-3 text-left">Target</th>
                  <th className="table-cell py-3 text-left">Correlation ID</th>
                  <th className="table-cell py-3 text-left">Result</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} onClick={() => setSelected(e)}
                    className={clsx('table-row', selected?.id === e.id && 'bg-primary-tint/30',
                      e.result !== 'success' && 'bg-danger-bg/10'
                    )}>
                    <td className="table-cell font-mono text-xs text-on-surface-variant whitespace-nowrap">
                      {fmtTime(e.time)}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-tint flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                          {initials(e.actor)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-on-surface">{e.actor}</p>
                          <p className="text-[10px] text-muted">{e.actorRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', ACTION_COLORS[e.action] ?? 'bg-surface-container text-on-surface-variant')}>
                        {e.action}
                      </span>
                    </td>
                    <td className="table-cell font-mono text-xs text-on-surface-variant">{e.target}</td>
                    <td className="table-cell">
                      <span className="font-mono text-xs text-muted">{e.correlationId}</span>
                    </td>
                    <td className="table-cell">
                      <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium',
                        e.result === 'success' ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'
                      )}>
                        {e.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail drawer */}
        {selected && (
          <div className="w-80 flex-shrink-0 card p-4 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-on-surface">Event detail</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-surface-container-low">
                <X size={15} className="text-muted" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Time', value: fmtTime(selected.time) },
                { label: 'Actor', value: selected.actor },
                { label: 'Role', value: selected.actorRole },
                { label: 'Action', value: selected.action },
                { label: 'Target', value: selected.target },
                { label: 'Result', value: selected.result },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-muted font-medium">{label}</span>
                  <span className="font-mono text-on-surface text-right">{value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-outline">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-muted font-medium">Correlation ID</span>
                  <button onClick={() => copy(selected.correlationId)}
                    className="flex items-center gap-1 text-primary hover:underline">
                    {copied ? <Check size={11} /> : <Copy size={11} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <code className="block font-mono text-on-surface bg-surface-container-low px-2 py-1.5 rounded-lg break-all">
                  {selected.correlationId}
                </code>
              </div>
              <div className="pt-2 border-t border-outline">
                <p className="text-muted font-medium mb-1">Raw event</p>
                <pre className="font-mono text-[10px] text-on-surface bg-surface-container-low px-2 py-2 rounded-lg overflow-auto max-h-48">
                  {JSON.stringify(selected, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
