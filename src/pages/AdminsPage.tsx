import { useState } from 'react';
import { Check, Minus, UserPlus, MoreHorizontal, Shield } from 'lucide-react';
import { mockAdmins, PERMISSIONS_MATRIX } from '../lib/mockData';
import { StatusBadge } from '../components/ui/StatusBadge';
import { clsx } from 'clsx';

type Tab = 'admins' | 'roles';

const ROLE_LABELS: Record<string, string> = {
  'super-admin': 'Super Admin',
  'support': 'Support',
  'sales': 'Sales',
};

export function AdminsPage() {
  const [tab, setTab] = useState<Tab>('admins');
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-5 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-on-surface">Admins & Roles</h1>
        {tab === 'admins' && (
          <button className="btn-primary text-sm gap-1.5">
            <UserPlus size={14} />Invite admin
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-outline gap-1">
        {(['admins', 'roles'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px',
              tab === t ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'
            )}>
            {t === 'roles' ? 'Roles & permissions' : 'Admins'}
          </button>
        ))}
      </div>

      {tab === 'admins' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="table-cell py-3 text-left">Admin</th>
                <th className="table-cell py-3 text-left">Role</th>
                <th className="table-cell py-3 text-left">2FA</th>
                <th className="table-cell py-3 text-left">Status</th>
                <th className="table-cell py-3 text-left">Last login</th>
                <th className="table-cell py-3" />
              </tr>
            </thead>
            <tbody>
              {(mockAdmins() ?? []).map(admin => (
                <tr key={admin.id} className="table-row">
                  <td className="table-cell">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary-tint flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                        {admin.initials}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{admin.name}</p>
                        <p className="text-xs text-muted">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-tint text-primary capitalize">
                      {ROLE_LABELS[admin.role] ?? admin.role}
                    </span>
                  </td>
                  <td className="table-cell">
                    {admin.twoFa ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                        <Check size={12} />Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                        <Shield size={12} />Not set
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={admin.status as any} />
                  </td>
                  <td className="table-cell text-xs text-on-surface-variant">{admin.lastLogin}</td>
                  <td className="table-cell">
                    <div className="relative">
                      <button onClick={() => setMenuOpen(menuOpen === admin.id ? null : admin.id)}
                        className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
                        <MoreHorizontal size={15} className="text-muted" />
                      </button>
                      {menuOpen === admin.id && (
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-outline shadow-dropdown z-10 overflow-hidden">
                          {['Edit role', 'Reset password', 'Deactivate', 'Remove'].map(action => (
                            <button key={action} onClick={() => setMenuOpen(null)}
                              className={clsx('flex w-full px-3 py-2 text-sm hover:bg-surface-container-low',
                                ['Deactivate', 'Remove'].includes(action) ? 'text-danger' : 'text-on-surface'
                              )}>
                              {action}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'roles' && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="table-cell py-3 text-left w-48">Permission</th>
                  {Object.keys(PERMISSIONS_MATRIX.roles).map(role => (
                    <th key={role} className="table-cell py-3 text-center">
                      {ROLE_LABELS[role] ?? role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS_MATRIX.rows.map(group => (
                  <>
                    <tr key={`group-${group.group}`} className="bg-surface-container-low">
                      <td colSpan={4} className="table-cell py-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{group.group}</span>
                      </td>
                    </tr>
                    {group.perms.map(perm => (
                      <tr key={perm} className="table-row">
                        <td className="table-cell font-mono text-xs text-on-surface-variant">{perm}</td>
                        {Object.entries(PERMISSIONS_MATRIX.roles).map(([role, perms]) => (
                          <td key={role} className="table-cell text-center">
                            {perms.includes(perm) ? (
                              <Check size={15} className="text-success mx-auto" />
                            ) : (
                              <Minus size={15} className="text-muted mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
