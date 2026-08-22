import { useState, useRef, useEffect, type ReactNode } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Building2, DollarSign, CreditCard, Users, HeadphonesIcon,
  Activity, ScrollText, Settings, Bell, Search, ChevronDown, LogOut,
  Menu, Aperture
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../hooks/useAuth';
import { mockNotifications } from '../../lib/mockData';
import { api } from '../../api/client';

type NotifItem = { id: string; category: string; title: string; detail: string; time: string; read: boolean };

function notifRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

const NAV = [
  { group: 'OVERVIEW', items: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'system.read' },
  ]},
  { group: 'PORTFOLIO', items: [
    { to: '/businesses', label: 'Businesses', icon: Building2, permission: null },
    { to: '/revenue', label: 'Revenue', icon: DollarSign, permission: 'billing.read' },
    { to: '/subscriptions', label: 'Subscriptions', icon: CreditCard, permission: 'subscription.read' },
    { to: '/users', label: 'Users', icon: Users, permission: 'user.read' },
  ]},
  { group: 'OPERATIONS', items: [
    { to: '/support', label: 'Support', icon: HeadphonesIcon, permission: 'support.read' },
    { to: '/system-health', label: 'System Health', icon: Activity, permission: 'system.read' },
    { to: '/audit-log', label: 'Audit Log', icon: ScrollText, permission: 'system.read' },
  ]},
];

function NotifDropdown({ onClose, notifications, onMarkAllRead }: {
  onClose: () => void; notifications: NotifItem[]; onMarkAllRead: () => void;
}) {
  const catIcon: Record<string, string> = {
    critical: '🔴', billing: '💳', business: '🏢', security: '🔒',
    infrastructure: '🖥️', support: '🎧', system: '⚙️',
  };
  return (
    <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-xl border border-outline shadow-dropdown z-50 animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline">
        <span className="text-sm font-semibold text-on-surface">Notifications</span>
        <button onClick={onMarkAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-outline">
        {notifications.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted">No notifications</div>
        ) : notifications.slice(0, 5).map(n => (
          <div key={n.id} className={clsx('flex gap-3 px-4 py-3 hover:bg-surface-container-low cursor-pointer', !n.read && 'bg-primary-tint/30')}>
            <span className="text-base mt-0.5">{catIcon[n.category] ?? '📌'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">{n.title}</p>
              <p className="text-xs text-muted truncate">{n.detail}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs text-muted">{n.time}</span>
              {!n.read && <span className="w-2 h-2 rounded-full bg-primary" />}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2 border-t border-outline">
        <button onClick={onClose} className="text-xs text-primary hover:underline w-full text-center">View all notifications</button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<NotifItem[]>(mockNotifications() ?? []);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    api.getNotifications()
      .then(rows => setNotifications(rows.map(n => ({
        id: String(n.id),
        category: n.priority === 'critical' ? 'critical' : n.category,
        title: n.title,
        detail: n.message,
        time: notifRelative(n.createdAt),
        read: n.readAt != null,
      }))))
      .catch(() => { /* keep mock */ });
  }, []);

  const markAllRead = () => {
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    api.markAllNotificationsRead().catch(() => { /* optimistic */ });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pageTitle = NAV.flatMap(g => g.items).find(i => location.pathname.startsWith(i.to))?.label ?? 'Periscope';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-outline flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Aperture size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface leading-none">Periscope</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-muted leading-none mt-0.5">IOP</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV.map(group => {
          const visible = group.items.filter(item => !item.permission || hasPermission(item.permission));
          if (!visible.length) return null;
          return (
            <div key={group.group} className="mb-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted px-3 mb-1">{group.group}</p>
              {visible.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => clsx(
                    'flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-colors mb-0.5',
                    isActive
                      ? 'bg-primary-tint text-primary border-l-[3px] border-primary -ml-px pl-[11px]'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-outline p-3 flex-shrink-0">
        <NavLink to="/settings" onClick={() => setSidebarOpen(false)}
          className={({ isActive }) => clsx('flex items-center gap-3 px-3 h-9 rounded-lg text-sm font-medium transition-colors mb-1',
            isActive ? 'bg-primary-tint text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
          )}>
          <Settings size={16} />Settings
        </NavLink>
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-container-low cursor-pointer mt-1"
          onClick={() => { logout(); navigate('/login'); }}>
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-on-surface truncate">{user?.email ?? 'Admin'}</p>
            <p className="text-[10px] text-muted capitalize">{user?.role ?? 'super-admin'}</p>
          </div>
          <LogOut size={14} className="text-muted flex-shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-sidebar flex-shrink-0 bg-white border-r border-outline">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="relative z-50 flex flex-col w-sidebar bg-white border-r border-outline animate-slide-in-right">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-topbar flex-shrink-0 bg-white border-b border-outline flex items-center px-4 gap-3 z-30">
          <button className="lg:hidden p-1.5 rounded-lg hover:bg-surface-container-low" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} className="text-on-surface-variant" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden lg:flex items-center gap-1 text-sm">
            <span className="text-muted">Periscope</span>
            <span className="text-muted">/</span>
            <span className="font-medium text-on-surface">{pageTitle}</span>
          </div>
          <span className="lg:hidden text-sm font-semibold text-on-surface">{pageTitle}</span>

          {/* Search */}
          <div className="flex-1 max-w-sm mx-auto lg:mx-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder="Search businesses, users…"
                className="w-full h-8 pl-8 pr-10 rounded-lg border border-outline bg-surface-container-low text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-colors"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted bg-surface-container px-1 rounded hidden sm:block">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-1 ml-auto">
            {/* Env pill */}
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-success-bg text-success border border-success/20">
              Production
            </span>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(v => !v)}
                className="relative p-2 rounded-lg hover:bg-surface-container-low transition-colors">
                <Bell size={18} className="text-on-surface-variant" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
                )}
              </button>
              {notifOpen && <NotifDropdown onClose={() => setNotifOpen(false)} notifications={notifications} onMarkAllRead={markAllRead} />}
            </div>

            {/* User menu */}
            <div className="relative" ref={userRef}>
              <button onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-2 pr-1 h-8 rounded-lg hover:bg-surface-container-low transition-colors">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
                  {user?.email?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <ChevronDown size={14} className="text-muted" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-outline shadow-dropdown z-50 animate-fade-in overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-outline">
                    <p className="text-xs font-medium text-on-surface truncate">{user?.email}</p>
                    <p className="text-[10px] text-muted capitalize">{user?.role}</p>
                  </div>
                  <button onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-on-surface hover:bg-surface-container-low">
                    <Settings size={14} />Settings
                  </button>
                  <button onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger hover:bg-danger-bg/30">
                    <LogOut size={14} />Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
