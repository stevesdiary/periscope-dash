import type { ExecutiveDashboard, BusinessListItem, BusinessDetail, SubscriptionRecord } from '../types';

const ENABLED = import.meta.env.VITE_USE_MOCKS === 'true';

function pick<T>(enabled: boolean, value: T): T | null {
  return enabled ? value : null;
}

export function mockDashboard(): ExecutiveDashboard | null {
  return pick(ENABLED, {
    generatedAt: new Date().toISOString(),
    kpis: {
      applications: 4, businesses: 200, activeBusinesses: 180, users: 12000,
      mrr: 120000, arr: 1440000, monthlyRevenue: 120000, activeSubscriptions: 175,
      failedPayments: 8, todaySignups: 12, todayRevenue: 4500,
      systemHealth: 'degraded', avgResponseTimeMs: 135,
    },
    applications: [
      { key: 'estate', name: 'Estate', businesses: 128, activeBusinesses: 111, users: 5421, mrr: 48250, arr: 579000, activeSubscriptions: 119, failedPayments: 3, todaySignups: 7, todayRevenue: 1820, systemHealth: 'healthy', avgResponseTimeMs: 142 },
      { key: 'logistics', name: 'Logistics', businesses: 72, activeBusinesses: 68, users: 6579, mrr: 71750, arr: 861000, activeSubscriptions: 68, failedPayments: 5, todaySignups: 4, todayRevenue: 2400, systemHealth: 'healthy', avgResponseTimeMs: 148 },
      { key: 'school', name: 'School', businesses: 96, activeBusinesses: 90, users: 3240, mrr: 22400, arr: 268800, activeSubscriptions: 90, failedPayments: 0, todaySignups: 3, todayRevenue: 820, systemHealth: 'healthy', avgResponseTimeMs: 130 },
      { key: 'hospital', name: 'Hospital', businesses: 42, activeBusinesses: 38, users: 1850, mrr: 18600, arr: 223200, activeSubscriptions: 38, failedPayments: 2, todaySignups: 1, todayRevenue: 640, systemHealth: 'degraded', avgResponseTimeMs: 210 },
    ],
  });
}

export function mockMrrTrend() {
  return pick(ENABLED, [
    { month: 'Aug', estate: 38000, logistics: 55000, school: 17000, hospital: 4100 },
    { month: 'Sep', estate: 40000, logistics: 57000, school: 18000, hospital: 4300 },
    { month: 'Oct', estate: 41500, logistics: 59000, school: 18500, hospital: 4500 },
    { month: 'Nov', estate: 43000, logistics: 61000, school: 19500, hospital: 4700 },
    { month: 'Dec', estate: 44000, logistics: 63000, school: 20000, hospital: 4900 },
    { month: 'Jan', estate: 44500, logistics: 64000, school: 20500, hospital: 5000 },
    { month: 'Feb', estate: 45000, logistics: 65500, school: 21000, hospital: 5100 },
    { month: 'Mar', estate: 45500, logistics: 67000, school: 21500, hospital: 5200 },
    { month: 'Apr', estate: 46000, logistics: 68500, school: 22000, hospital: 5300 },
    { month: 'May', estate: 46500, logistics: 70000, school: 22200, hospital: 5400 },
    { month: 'Jun', estate: 47000, logistics: 71000, school: 22300, hospital: 5500 },
    { month: 'Jul', estate: 48250, logistics: 71750, school: 22400, hospital: 18600 },
  ]);
}

export function mockLatencyTrend() {
  if (!ENABLED) return null;
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 5}m`,
    estate: 130 + Math.round(Math.random() * 30),
    logistics: 140 + Math.round(Math.random() * 25),
    school: 120 + Math.round(Math.random() * 20),
  }));
}

export function mockBusinesses(): BusinessListItem[] | null {
  return pick(ENABLED, [
    { id: 'biz-cedarpark', name: 'CedarPark Estate', status: 'active', applications: ['estate', 'logistics'], mrr: 2000, users: 114 },
    { id: 'biz-northgate', name: 'Northgate Schools', status: 'active', applications: ['school'], mrr: 3400, users: 260 },
    { id: 'biz-havenwood', name: 'Havenwood Clinic', status: 'suspended', applications: ['hospital'], mrr: 0, users: 40 },
    { id: 'biz-riverside', name: 'Riverside Logistics', status: 'active', applications: ['logistics'], mrr: 1150, users: 58 },
    { id: 'biz-oakmount', name: 'Oakmount Estate', status: 'inactive', applications: ['estate'], mrr: 0, users: 12 },
    { id: 'biz-unity', name: 'Unity Esusu Co-op', status: 'active', applications: ['school'], mrr: 760, users: 210 },
    { id: 'biz-greenfield', name: 'Greenfield Properties', status: 'active', applications: ['estate'], mrr: 1200, users: 84 },
    { id: 'biz-summit', name: 'Summit Health Group', status: 'active', applications: ['hospital', 'logistics'], mrr: 2800, users: 320 },
  ]);
}

export function mockBusinessDetail(): BusinessDetail | null {
  return pick(ENABLED, {
    id: 'biz-cedarpark', name: 'CedarPark Estate', status: 'active',
    applications: ['estate', 'logistics'], mrr: 2000, users: 114,
    applicationUsage: [
      { key: 'estate', name: 'Estate', status: 'active', plan: 'Growth', mrr: 1200, users: 84, createdAt: '2025-11-02T09:00:00.000Z' },
      { key: 'logistics', name: 'Logistics', status: 'active', plan: 'Pro', mrr: 800, users: 30, createdAt: '2026-02-01T00:00:00.000Z' },
    ],
  });
}

export function mockSubscriptions(): SubscriptionRecord[] | null {
  return pick(ENABLED, [
    { id: 'sub-001', businessId: 'biz-cedarpark', businessName: 'CedarPark Estate', plan: 'Growth', status: 'active', mrr: 1200, renewsAt: '2026-08-02T00:00:00.000Z', cancelledAt: null, createdAt: '2025-11-02T09:00:00.000Z' },
    { id: 'sub-002', businessId: 'biz-cedarpark', businessName: 'CedarPark Estate', plan: 'Pro', status: 'active', mrr: 800, renewsAt: '2026-08-01T00:00:00.000Z', cancelledAt: null, createdAt: '2026-02-01T00:00:00.000Z' },
    { id: 'sub-003', businessId: 'biz-northgate', businessName: 'Northgate Schools', plan: 'Growth', status: 'past_due', mrr: 3400, renewsAt: '2026-07-12T00:00:00.000Z', cancelledAt: null, createdAt: '2025-09-15T00:00:00.000Z' },
    { id: 'sub-004', businessId: 'biz-havenwood', businessName: 'Havenwood Clinic', plan: 'Starter', status: 'cancelled', mrr: 0, renewsAt: null, cancelledAt: '2026-05-01T00:00:00.000Z', createdAt: '2025-06-01T00:00:00.000Z' },
    { id: 'sub-005', businessId: 'biz-riverside', businessName: 'Riverside Logistics', plan: 'Pro', status: 'active', mrr: 1150, renewsAt: '2026-08-15T00:00:00.000Z', cancelledAt: null, createdAt: '2025-12-01T00:00:00.000Z' },
    { id: 'sub-006', businessId: 'biz-unity', businessName: 'Unity Esusu Co-op', plan: 'Starter', status: 'trialing', mrr: 760, renewsAt: '2026-07-20T00:00:00.000Z', cancelledAt: null, createdAt: '2026-07-01T00:00:00.000Z' },
  ]);
}

export function mockUsers() {
  return pick(ENABLED, [
    { id: 'u1', name: 'Ada Balogun', email: 'ada@cedarpark.io', business: 'CedarPark Estate', businessId: 'biz-cedarpark', applications: ['estate', 'logistics'], role: 'Owner', status: 'active', lastActive: '2h ago' },
    { id: 'u2', name: 'Tomiwa Idris', email: 'tom@northgate.sch', business: 'Northgate Schools', businessId: 'biz-northgate', applications: ['school'], role: 'Admin', status: 'active', lastActive: '1d ago' },
    { id: 'u3', name: 'Grace Nkemdi', email: 'grace@havenwood.med', business: 'Havenwood Clinic', businessId: 'biz-havenwood', applications: ['hospital'], role: 'Staff', status: 'inactive', lastActive: '3w ago' },
    { id: 'u4', name: 'Kunle Adeyemi', email: 'kunle@riverside.co', business: 'Riverside Logistics', businessId: 'biz-riverside', applications: ['logistics'], role: 'Member', status: 'invited', lastActive: '—' },
    { id: 'u5', name: 'Bisi Okonkwo', email: 'bisi@unity.coop', business: 'Unity Esusu Co-op', businessId: 'biz-unity', applications: ['school'], role: 'Admin', status: 'active', lastActive: '5h ago' },
    { id: 'u6', name: 'Emeka Eze', email: 'emeka@greenfield.ng', business: 'Greenfield Properties', businessId: 'biz-greenfield', applications: ['estate'], role: 'Owner', status: 'active', lastActive: '30m ago' },
  ]);
}

export function mockSupportTickets() {
  return pick(ENABLED, [
    { id: 'tkt-001', priority: 'high', subject: 'Cannot access billing', business: 'CedarPark Estate', businessId: 'biz-cedarpark', requester: 'ada@cedarpark.io', time: '12m ago', unread: true, status: 'open', messages: [
      { from: 'ada@cedarpark.io', text: 'Hi, I cannot access the billing section. It shows a 403 error.', time: '12m ago', internal: false },
      { from: 'sam@periscope.local', text: 'Looking into this now. Can you confirm your role in the system?', time: '8m ago', internal: false },
      { from: 'sam@periscope.local', text: 'Internal note: user has support role, billing.read not granted.', time: '5m ago', internal: true },
    ]},
    { id: 'tkt-002', priority: 'medium', subject: 'Add seats to plan', business: 'Northgate Schools', businessId: 'biz-northgate', requester: 'tom@northgate.sch', time: '1h ago', unread: false, status: 'open', messages: [
      { from: 'tom@northgate.sch', text: 'We need to add 50 more seats to our Growth plan.', time: '1h ago', internal: false },
    ]},
  ]);
}

export function mockAuditLog() {
  return pick(ENABLED, [
    { id: 'al-1', time: '2026-07-08T12:04:11Z', actor: 'ada@periscope.local', actorRole: 'Super Admin', action: 'totp.disable', target: 'admin:12', correlationId: '3f2a-9c1b-77ad', result: 'success' },
    { id: 'al-2', time: '2026-07-08T11:58:02Z', actor: 'sam@periscope.local', actorRole: 'Support', action: 'business.view', target: 'biz-cedarpark', correlationId: 'a1c4-70b2-9e11', result: 'success' },
    { id: 'al-3', time: '2026-07-08T11:40:55Z', actor: 'sam@periscope.local', actorRole: 'Support', action: 'dashboard.view', target: '—', correlationId: '6e21-aa9f-4b33', result: '403 Forbidden' },
  ]);
}

export function mockAdmins() {
  return pick(ENABLED, [
    { id: 1, name: 'Ada Okafor', email: 'ada@periscope.local', role: 'super-admin', twoFa: true, status: 'active', lastLogin: '2m ago', initials: 'AO' },
    { id: 2, name: 'Sam Peters', email: 'sam@periscope.local', role: 'support', twoFa: true, status: 'active', lastLogin: '1h ago', initials: 'SP' },
    { id: 3, name: 'Zoe Martins', email: 'zoe@periscope.local', role: 'sales', twoFa: false, status: 'active', lastLogin: '3d ago', initials: 'ZM' },
  ]);
}

export function mockNotifications() {
  return pick(ENABLED, [
    { id: 'n1', category: 'critical', title: 'Hospital API unreachable', detail: 'Health check failed 6 minutes ago', time: '6m', read: false },
    { id: 'n2', category: 'billing', title: 'Failed payment — Northgate Schools', detail: '$3,400 card_declined', time: '22m', read: false },
    { id: 'n3', category: 'business', title: 'New business signed up — Unity Esusu Co-op', detail: 'school · Starter plan', time: '2h', read: true },
  ]);
}

export const PERMISSIONS_MATRIX = {
  rows: [
    { group: 'Business', perms: ['business.read', 'business.write', 'business.delete'] },
    { group: 'Users', perms: ['user.read', 'user.write'] },
    { group: 'Billing', perms: ['billing.read', 'billing.write'] },
    { group: 'Subscriptions', perms: ['subscription.read'] },
    { group: 'Customers', perms: ['customer.read'] },
    { group: 'Support', perms: ['support.read', 'support.write'] },
    { group: 'System', perms: ['system.read', 'system.write'] },
  ],
  roles: {
    'super-admin': ['business.read','business.write','business.delete','user.read','user.write','billing.read','billing.write','subscription.read','customer.read','support.read','support.write','system.read','system.write'],
    'support': ['business.read','user.read','support.read','support.write'],
    'sales': ['business.read','subscription.read','billing.read','customer.read'],
  },
};
