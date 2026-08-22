import type {
  LoginResponse, ExecutiveDashboard, BusinessListItem, BusinessDetail,
  SubscriptionListItem, SubscriptionSummary, RevenueSummary, UserRecord,
  PlatformMetrics, AuditEvent, Notification, Session, FailedLogin, BlockedIP,
  AllowedIP, ImpersonateResponse, MagicLinkResponse, ForceLogoutResponse,
  DashboardHistory, FailedPayment,
} from '../types';

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('periscope_token') ?? '';
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const correlationId = crypto.randomUUID();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      'x-correlation-id': correlationId,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { status: res.status, ...body };
  }
  return res.json();
}

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (!entries.length) return '';
  return '?' + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&');
}

export const api = {
  // ---- Auth ----
  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  loginTotp: (mfaToken: string, code: string) =>
    request<LoginResponse>('/auth/login/totp', { method: 'POST', body: JSON.stringify({ mfaToken, code }) }),

  totpSetup: () => request<{ secret: string; otpauthUrl: string }>('/auth/totp/setup', { method: 'POST' }),
  totpEnable: (code: string) =>
    request<{ recoveryCodes: string[] }>('/auth/totp/enable', { method: 'POST', body: JSON.stringify({ code }) }),
  totpDisable: (code: string) =>
    request<{ disabled: boolean }>('/auth/totp/disable', { method: 'POST', body: JSON.stringify({ code }) }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ changed: boolean }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // ---- Dashboard ----
  getDashboard: () => request<ExecutiveDashboard>('/internal/dashboard'),
  getDashboardHistory: (params: { from?: string; to?: string; limit?: number } = {}) =>
    request<DashboardHistory>(`/internal/dashboard/history${qs(params)}`),

  // ---- Businesses ----
  getBusinesses: () => request<BusinessListItem[]>('/internal/businesses'),
  getBusiness: (id: string) => request<BusinessDetail>(`/internal/businesses/${id}`),

  // ---- Subscriptions ----
  getSubscriptions: () => request<SubscriptionListItem[]>('/internal/subscriptions'),
  getSubscriptionsSummary: () => request<SubscriptionSummary>('/internal/subscriptions/summary'),

  // ---- Revenue ----
  getRevenue: () => request<RevenueSummary>('/internal/revenue'),
  getFailedPayments: (params: { limit?: number } = {}) =>
    request<FailedPayment[]>(`/internal/revenue/failed-payments${qs(params)}`),

  // ---- Users ----
  getUsers: () => request<UserRecord[]>('/internal/users'),

  // ---- Monitoring ----
  getMetrics: () => request<PlatformMetrics>('/internal/monitoring/metrics'),

  // ---- Audit ----
  getAudit: (params: { actor?: string; action?: string; resource?: string; limit?: number; offset?: number } = {}) =>
    request<AuditEvent[]>(`/internal/audit${qs(params)}`),

  // ---- Notifications ----
  getNotifications: (params: { category?: string; priority?: string; unread?: boolean } = {}) =>
    request<Notification[]>(`/internal/notifications${qs(params)}`),
  markNotificationRead: (id: number) =>
    request<{ read: boolean }>(`/internal/notifications/${id}/read`, { method: 'POST' }),
  markAllNotificationsRead: () =>
    request<{ marked: number }>('/internal/notifications/read-all', { method: 'POST' }),

  // ---- Security ----
  getSessions: () => request<Session[]>('/internal/security/sessions'),
  revokeSession: (id: number) => request<{ revoked: boolean }>(`/internal/security/sessions/${id}`, { method: 'DELETE' }),
  getFailedLogins: () => request<FailedLogin[]>('/internal/security/failed-logins'),
  getBlockedIps: () => request<BlockedIP[]>('/internal/security/blocked-ips'),
  getAllowlist: () => request<AllowedIP[]>('/internal/security/allowlist'),

  // ---- Support tools ----
  impersonate: (adminId: number) =>
    request<ImpersonateResponse>('/internal/support/impersonate', { method: 'POST', body: JSON.stringify({ adminId }) }),
  magicLink: (email: string) =>
    request<MagicLinkResponse>('/internal/support/magic-link', { method: 'POST', body: JSON.stringify({ email }) }),
  forceLogout: (adminId: number) =>
    request<ForceLogoutResponse>('/internal/support/force-logout', { method: 'POST', body: JSON.stringify({ adminId }) }),
};
