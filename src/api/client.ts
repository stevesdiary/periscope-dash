import type { LoginResponse, ExecutiveDashboard, BusinessListItem, BusinessDetail, SubscriptionRecord } from '../types';

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

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  loginTotp: (mfaToken: string, code: string) =>
    request<LoginResponse>('/auth/login/totp', {
      method: 'POST',
      body: JSON.stringify({ mfaToken, code }),
    }),

  totpSetup: () => request<{ secret: string; otpauthUrl: string }>('/auth/totp/setup', { method: 'POST' }),

  totpEnable: (code: string) =>
    request<{ recoveryCodes: string[] }>('/auth/totp/enable', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  totpDisable: (code: string) =>
    request<{ disabled: boolean }>('/auth/totp/disable', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Dashboard
  getDashboard: () => request<ExecutiveDashboard>('/internal/dashboard'),

  // Businesses
  getBusinesses: () => request<BusinessListItem[]>('/internal/businesses'),
  getBusiness: (id: string) => request<BusinessDetail>(`/internal/businesses/${id}`),

  // Subscriptions
  getSubscriptions: () => request<SubscriptionRecord[]>('/internal/subscriptions'),
};
