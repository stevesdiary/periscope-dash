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

export interface SubscriptionListItem extends SubscriptionRecord {
  appKey: string;
  appName: string;
}

export interface PlanBreakdown { plan: string; count: number; mrr: number; }
export interface UpcomingRenewal {
  subscriptionId: string; businessName: string; plan: string;
  mrr: number; renewsAt: string; appKey: string;
}
export interface SubscriptionSummary {
  total: number; active: number; trialing: number; pastDue: number;
  cancelled: number; paused: number; mrr: number; arr: number;
  churnedThisMonth: number;
  upcomingRenewals: UpcomingRenewal[]; planBreakdown: PlanBreakdown[];
}

// Revenue
export interface RevenueRecord {
  appKey: string; todayRevenue: number; mtdRevenue: number; ytdRevenue: number;
  todayTransactions: number; mtdTransactions: number;
  commission: number; refunds: number; outstanding: number; currency: string;
}
export interface RevenueSummary {
  todayRevenue: number; mtdRevenue: number; ytdRevenue: number;
  todayTransactions: number; mtdTransactions: number;
  commission: number; refunds: number; outstanding: number;
  currency: string; byApp: RevenueRecord[];
}
export interface FailedPayment {
  id: string; businessId: string; businessName: string;
  amount: number; currency: string; reason: string;
  failedAt: string; retryable: boolean;
  appKey: string; appName: string;
}

// Users
export interface UserRecord {
  id: string; email: string; name: string;
  role: string; status: 'active' | 'inactive' | 'suspended';
  businessId: string | null; businessName: string | null;
  lastLoginAt: string | null; createdAt: string;
  appKey: string; appName: string;
}

// Dashboard KPI history (trend charts)
export interface SnapshotPerApp {
  key: string;
  name: string;
  mrr: number;
  avgResponseTimeMs: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
  failedPayments: number;
}
export interface MetricSnapshot {
  id: number;
  capturedAt: string;
  mrr: number;
  arr: number;
  monthlyRevenue: number;
  todayRevenue: number;
  businesses: number;
  activeBusinesses: number;
  users: number;
  activeSubscriptions: number;
  failedPayments: number;
  todaySignups: number;
  avgResponseTimeMs: number;
  systemHealth: 'healthy' | 'degraded' | 'down';
  perApp: SnapshotPerApp[];
}
export interface DashboardHistory {
  snapshots: MetricSnapshot[];
}

// Monitoring
export interface PlatformMetrics {
  uptime: number; requestCount: number; errorCount: number;
  avgResponseTimeMs: number; p95ResponseTimeMs: number; p99ResponseTimeMs: number;
  memoryUsageMB: number; cpuUsagePercent: number;
}

// Audit
export interface AuditEvent {
  id: number; actor: string; actorId: number | null;
  action: string; resource: string; resourceId: string | null;
  before: Record<string, unknown> | null; after: Record<string, unknown> | null;
  ip: string; correlationId: string; createdAt: string;
}

// Notifications
export type NotificationCategory = 'business' | 'security' | 'billing' | 'infrastructure' | 'support' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';
export interface Notification {
  id: number; category: NotificationCategory; priority: NotificationPriority;
  title: string; message: string; appKey: string | null;
  readAt: string | null; createdAt: string;
}

// Security
export interface Session { id: number; adminId: number; ip: string; userAgent: string; expiresAt: string; createdAt: string; }
export interface FailedLogin { id: number; email: string; ip: string; reason: string; createdAt: string; }
export interface BlockedIP { id: number; ip: string; reason: string; blockedBy: string; expiresAt: string | null; createdAt: string; }
export interface AllowedIP { id: number; ip: string; label: string; createdAt: string; }

// Support tools
export interface ImpersonateResponse { accessToken: string; expiresIn: string; readOnly: boolean; }
export interface MagicLinkResponse { magicToken: string; expiresIn: string; }
export interface ForceLogoutResponse { loggedOut: boolean; sessionsRevoked: number; }

// API Error
export interface ApiError {
  error: { code: string; message: string; correlationId: string };
}

// Product colors
export const PRODUCT_COLORS: Record<string, string> = {
  estate: '#4F46E5',
  logistics: '#0EA5E9',
  school: '#16A34A',
  hospital: '#DC2626',
};

export const PRODUCT_NAMES: Record<string, string> = {
  estate: 'Estate',
  logistics: 'Logistics',
  school: 'School',
  hospital: 'Hospital',
};
