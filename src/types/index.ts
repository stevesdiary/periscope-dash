// Auth
export interface LoginResponse {
  accessToken?: string;
  user?: { email: string; role: string; permissions: string[] };
  mfaRequired?: boolean;
  mfaToken?: string;
}

export interface User {
  email: string;
  role: string;
  permissions: string[];
}

// Dashboard
export interface PerAppSummary {
  key: string;
  name: string;
  unavailable?: boolean;
  businesses: number;
  activeBusinesses: number;
  users: number;
  mrr: number;
  arr: number;
  activeSubscriptions: number;
  failedPayments: number;
  todaySignups: number;
  todayRevenue: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
  avgResponseTimeMs: number;
}

export interface ExecutiveDashboard {
  generatedAt: string;
  kpis: {
    applications: number;
    businesses: number;
    activeBusinesses: number;
    users: number;
    mrr: number;
    arr: number;
    monthlyRevenue: number;
    activeSubscriptions: number;
    failedPayments: number;
    todaySignups: number;
    todayRevenue: number;
    systemHealth: 'healthy' | 'degraded' | 'down';
    avgResponseTimeMs: number;
  };
  applications: PerAppSummary[];
}

// Businesses
export interface BusinessListItem {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  applications: string[];
  mrr: number;
  users: number;
}

export interface BusinessAppUsage {
  key: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: string;
  mrr: number;
  users: number;
  createdAt: string;
}

export interface BusinessDetail extends BusinessListItem {
  applicationUsage: BusinessAppUsage[];
}

// Subscriptions
export interface SubscriptionRecord {
  id: string;
  businessId: string;
  businessName: string;
  plan: string;
  status: 'active' | 'trialing' | 'past_due' | 'cancelled' | 'paused';
  mrr: number;
  renewsAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

// API Error
export interface ApiError {
  error: { code: string; message: string; correlationId: string };
}

// Product colors
export const PRODUCT_COLORS: Record<string, string> = {
  estate: '#4F46E5',
  logistics: '#0EA5E9',
  school: '#16A34A',
  esusu: '#D97706',
  hospital: '#DC2626',
};

export const PRODUCT_NAMES: Record<string, string> = {
  estate: 'Estate',
  logistics: 'Logistics',
  school: 'School',
  esusu: 'esusu',
  hospital: 'Hospital',
};
