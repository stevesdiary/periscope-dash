import { useState, useEffect } from 'react';
import { UserCog, Link2, LogOut, Search, Copy, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MOCK_USERS } from '../lib/mockData';
import { api } from '../api/client';

type UserRow = typeof MOCK_USERS[0];

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

type ToolState = { loading: boolean; error: string | null; result: string | null };
const IDLE: ToolState = { loading: false, error: null, result: null };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}{copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function SupportPage() {
  const [users, setUsers] = useState<UserRow[]>(MOCK_USERS);
  const [search, setSearch] = useState('');

  // Tool inputs
  const [magicEmail, setMagicEmail] = useState('');
  const [impersonateId, setImpersonateId] = useState('');
  const [logoutId, setLogoutId] = useState('');

  // Tool state
  const [magic, setMagic] = useState<ToolState>(IDLE);
  const [impersonate, setImpersonate] = useState<ToolState>(IDLE);
  const [forceLogout, setForceLogout] = useState<ToolState>(IDLE);

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

  const filtered = users.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.business.toLowerCase().includes(search.toLowerCase())
  );

  const errMsg = (e: unknown) =>
    (e as { error?: { message?: string }; message?: string })?.error?.message
    ?? (e as { message?: string })?.message ?? 'Request failed';

  const runMagicLink = () => {
    if (!magicEmail) return;
    setMagic({ loading: true, error: null, result: null });
    api.magicLink(magicEmail)
      .then(r => setMagic({ loading: false, error: null, result: `${r.magicToken}  ·  expires in ${r.expiresIn}` }))
      .catch(e => setMagic({ loading: false, error: errMsg(e), result: null }));
  };

  const runImpersonate = () => {
    const id = Number(impersonateId);
    if (!id) return;
    setImpersonate({ loading: true, error: null, result: null });
    api.impersonate(id)
      .then(r => setImpersonate({ loading: false, error: null, result: `${r.readOnly ? 'read-only' : 'read-write'} session · expires in ${r.expiresIn}\n${r.accessToken}` }))
      .catch(e => setImpersonate({ loading: false, error: errMsg(e), result: null }));
  };

  const runForceLogout = () => {
    const id = Number(logoutId);
    if (!id) return;
    setForceLogout({ loading: true, error: null, result: null });
    api.forceLogout(id)
      .then(r => setForceLogout({ loading: false, error: null, result: r.loggedOut ? `Logged out · ${r.sessionsRevoked} session(s) revoked` : 'No active sessions' }))
      .catch(e => setForceLogout({ loading: false, error: errMsg(e), result: null }));
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Support Console</h1>
        <p className="text-sm text-muted mt-0.5">Impersonate, issue magic links and force-logout — every action is audited.</p>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Magic link */}
        <div className="card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-tint flex items-center justify-center flex-shrink-0">
              <Link2 size={16} className="text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-on-surface">Send magic link</h2>
          </div>
          <p className="text-xs text-muted mb-3">Issue a one-time sign-in link to a user by email.</p>
          <input value={magicEmail} onChange={e => setMagicEmail(e.target.value)} type="email"
            placeholder="user@business.com"
            className="h-8 px-3 rounded-lg border border-outline bg-white text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-2" />
          <button onClick={runMagicLink} disabled={!magicEmail || magic.loading}
            className="btn-primary h-8 text-xs gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <Link2 size={13} />{magic.loading ? 'Sending…' : 'Generate link'}
          </button>
          {magic.error && <p className="mt-2 text-xs text-danger flex items-center gap-1"><AlertTriangle size={11} />{magic.error}</p>}
          {magic.result && (
            <div className="mt-2 p-2 rounded-lg bg-surface-container-low border border-outline">
              <div className="flex items-start justify-between gap-2">
                <code className="text-[10px] font-mono text-on-surface break-all">{magic.result}</code>
                <CopyButton text={magic.result.split('  ·  ')[0]} />
              </div>
            </div>
          )}
        </div>

        {/* Impersonate */}
        <div className="card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-warning-bg flex items-center justify-center flex-shrink-0">
              <UserCog size={16} className="text-warning" />
            </div>
            <h2 className="text-sm font-semibold text-on-surface">Impersonate</h2>
          </div>
          <p className="text-xs text-muted mb-3">Open a scoped, read-only session as another admin.</p>
          <input value={impersonateId} onChange={e => setImpersonateId(e.target.value.replace(/\D/g, ''))} inputMode="numeric"
            placeholder="Admin ID"
            className="h-8 px-3 rounded-lg border border-outline bg-white text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-2" />
          <button onClick={runImpersonate} disabled={!impersonateId || impersonate.loading}
            className="btn-secondary h-8 text-xs gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <UserCog size={13} />{impersonate.loading ? 'Starting…' : 'Start session'}
          </button>
          {impersonate.error && <p className="mt-2 text-xs text-danger flex items-center gap-1"><AlertTriangle size={11} />{impersonate.error}</p>}
          {impersonate.result && (
            <div className="mt-2 p-2 rounded-lg bg-surface-container-low border border-outline">
              <div className="flex items-start justify-between gap-2">
                <code className="text-[10px] font-mono text-on-surface break-all whitespace-pre-wrap">{impersonate.result}</code>
                <CopyButton text={impersonate.result.split('\n')[1] ?? impersonate.result} />
              </div>
            </div>
          )}
        </div>

        {/* Force logout */}
        <div className="card p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-danger-bg flex items-center justify-center flex-shrink-0">
              <LogOut size={16} className="text-danger" />
            </div>
            <h2 className="text-sm font-semibold text-on-surface">Force logout</h2>
          </div>
          <p className="text-xs text-muted mb-3">Revoke every active session for an admin immediately.</p>
          <input value={logoutId} onChange={e => setLogoutId(e.target.value.replace(/\D/g, ''))} inputMode="numeric"
            placeholder="Admin ID"
            className="h-8 px-3 rounded-lg border border-outline bg-white text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mb-2" />
          <button onClick={runForceLogout} disabled={!logoutId || forceLogout.loading}
            className="h-8 text-xs gap-1.5 inline-flex items-center justify-center rounded-lg font-medium bg-danger text-white hover:bg-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <LogOut size={13} />{forceLogout.loading ? 'Revoking…' : 'Force logout'}
          </button>
          {forceLogout.error && <p className="mt-2 text-xs text-danger flex items-center gap-1"><AlertTriangle size={11} />{forceLogout.error}</p>}
          {forceLogout.result && (
            <p className="mt-2 text-xs text-success flex items-center gap-1"><ShieldCheck size={11} />{forceLogout.result}</p>
          )}
        </div>
      </div>

      {/* User directory */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-outline flex-wrap">
          <h2 className="text-sm font-semibold text-on-surface">User directory</h2>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, business…"
              className="h-8 pl-8 pr-3 rounded-lg border border-outline bg-white text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell py-2.5 text-left">User</th>
                <th className="table-cell py-2.5 text-left">Business</th>
                <th className="table-cell py-2.5 text-left">Role</th>
                <th className="table-cell py-2.5 text-left">Status</th>
                <th className="table-cell py-2.5 text-left">Last active</th>
                <th className="table-cell py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-sm text-muted">No users match your search</td></tr>
              ) : filtered.map(u => (
                <tr key={u.id} className="table-row">
                  <td className="table-cell">
                    <p className="font-medium text-on-surface">{u.name}</p>
                    <p className="text-xs text-muted">{u.email}</p>
                  </td>
                  <td className="table-cell text-on-surface-variant text-xs">{u.business}</td>
                  <td className="table-cell text-on-surface-variant">{u.role}</td>
                  <td className="table-cell"><StatusBadge status={u.status as any} /></td>
                  <td className="table-cell text-on-surface-variant text-xs">{u.lastActive}</td>
                  <td className="table-cell text-right">
                    <button onClick={() => { setMagicEmail(u.email); setMagic(IDLE); }}
                      className="text-xs text-primary hover:underline">Magic link</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
