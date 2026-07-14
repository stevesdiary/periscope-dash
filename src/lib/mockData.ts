import type { ExecutiveDashboard, BusinessListItem, BusinessDetail, SubscriptionRecord } from '../types';

export const MOCK_DASHBOARD: ExecutiveDashboard = {
  generatedAt: new Date().toISOString(),
  kpis: {
    applications: 5,
    businesses: 200,
    activeBusinesses: 180,
    users: 12000,
    mrr: 120000,
    arr: 1440000,
    monthlyRevenue: 120000,
    activeSubscriptions: 175,
    failedPayments: 8,
    todaySignups: 12,
    todayRevenue: 4500,
    systemHealth: 'degraded',
    avgResponseTimeMs: 135,
  },
  applications: [
    { key: 'estate', name: 'Estate', businesses: 128, activeBusinesses: 111, users: 5421, mrr: 48250, arr: 579000, activeSubscriptions: 119, failedPayments: 3, todaySignups: 7, todayRevenue: 1820, systemHealth: 'healthy', avgResponseTimeMs: 142 },
    { key: 'logistics', name: 'Logistics', businesses: 72, activeBusinesses: 68, users: 6579, mrr: 71750, arr: 861000, activeSubscriptions: 68, failedPayments: 5, todaySignups: 4, todayRevenue: 2400, systemHealth: 'healthy', avgResponseTimeMs: 148 },
    { key: 'school', name: 'School', businesses: 96, activeBusinesses: 90, users: 3240, mrr: 22400, arr: 268800, activeSubscriptions: 90, failedPayments: 0, todaySignups: 3, todayRevenue: 820, systemHealth: 'healthy', avgResponseTimeMs: 130 },
    { key: 'esusu', name: 'esusu', businesses: 54, activeBusinesses: 50, users: 980, mrr: 8900, arr: 106800, activeSubscriptions: 50, failedPayments: 0, todaySignups: 2, todayRevenue: 310, systemHealth: 'healthy', avgResponseTimeMs: 121 },
    { key: 'hospital', name: 'Hospital', unavailable: true, businesses: 0, activeBusinesses: 0, users: 0, mrr: 0, arr: 0, activeSubscriptions: 0, failedPayments: 0, todaySignups: 0, todayRevenue: 0, systemHealth: 'down', avgResponseTimeMs: 0 },
  ],
};

export const MOCK_MRR_TREND = [
  { month: 'Aug', estate: 38000, logistics: 55000, school: 17000, esusu: 6200, hospital: 4100 },
  { month: 'Sep', estate: 40000, logistics: 57000, school: 18000, esusu: 6500, hospital: 4300 },
  { month: 'Oct', estate: 41500, logistics: 59000, school: 18500, esusu: 6800, hospital: 4500 },
  { month: 'Nov', estate: 43000, logistics: 61000, school: 19500, esusu: 7000, hospital: 4700 },
  { month: 'Dec', estate: 44000, logistics: 63000, school: 20000, esusu: 7200, hospital: 4900 },
  { month: 'Jan', estate: 44500, logistics: 64000, school: 20500, esusu: 7400, hospital: 5000 },
  { month: 'Feb', estate: 45000, logistics: 65500, school: 21000, esusu: 7600, hospital: 5100 },
  { month: 'Mar', estate: 45500, logistics: 67000, school: 21500, esusu: 7800, hospital: 5200 },
  { month: 'Apr', estate: 46000, logistics: 68500, school: 22000, esusu: 8000, hospital: 5300 },
  { month: 'May', estate: 46500, logistics: 70000, school: 22200, esusu: 8400, hospital: 5400 },
  { month: 'Jun', estate: 47000, logistics: 71000, school: 22300, esusu: 8700, hospital: 5500 },
  { month: 'Jul', estate: 48250, logistics: 71750, school: 22400, esusu: 8900, hospital: 0 },
];

export const MOCK_LATENCY_TREND = Array.from({ length: 12 }, (_, i) => ({
  time: `${i * 5}m`,
  estate: 130 + Math.round(Math.random() * 30),
  logistics: 140 + Math.round(Math.random() * 25),
  school: 120 + Math.round(Math.random() * 20),
  esusu: 115 + Math.round(Math.random() * 15),
}));

export const MOCK_BUSINESSES: BusinessListItem[] = [
  { id: 'biz-cedarpark', name: 'CedarPark Estate', status: 'active', applications: ['estate', 'logistics'], mrr: 2000, users: 114 },
  { id: 'biz-northgate', name: 'Northgate Schools', status: 'active', applications: ['school'], mrr: 3400, users: 260 },
  { id: 'biz-havenwood', name: 'Havenwood Clinic', status: 'suspended', applications: ['hospital'], mrr: 0, users: 40 },
  { id: 'biz-riverside', name: 'Riverside Logistics', status: 'active', applications: ['logistics'], mrr: 1150, users: 58 },
  { id: 'biz-oakmount', name: 'Oakmount Estate', status: 'inactive', applications: ['estate'], mrr: 0, users: 12 },
  { id: 'biz-unity', name: 'Unity Esusu Co-op', status: 'active', applications: ['esusu', 'school'], mrr: 760, users: 210 },
  { id: 'biz-greenfield', name: 'Greenfield Properties', status: 'active', applications: ['estate'], mrr: 1200, users: 84 },
  { id: 'biz-summit', name: 'Summit Health Group', status: 'active', applications: ['hospital', 'logistics'], mrr: 2800, users: 320 },
];

export const MOCK_BUSINESS_DETAIL: BusinessDetail = {
  id: 'biz-cedarpark',
  name: 'CedarPark Estate',
  status: 'active',
  applications: ['estate', 'logistics'],
  mrr: 2000,
  users: 114,
  applicationUsage: [
    { key: 'estate', name: 'Estate', status: 'active', plan: 'Growth', mrr: 1200, users: 84, createdAt: '2025-11-02T09:00:00.000Z' },
    { key: 'logistics', name: 'Logistics', status: 'active', plan: 'Pro', mrr: 800, users: 30, createdAt: '2026-02-01T00:00:00.000Z' },
  ],
};

export const MOCK_SUBSCRIPTIONS: SubscriptionRecord[] = [
  { id: 'sub-001', businessId: 'biz-cedarpark', businessName: 'CedarPark Estate', plan: 'Growth', status: 'active', mrr: 1200, renewsAt: '2026-08-02T00:00:00.000Z', cancelledAt: null, createdAt: '2025-11-02T09:00:00.000Z' },
  { id: 'sub-002', businessId: 'biz-cedarpark', businessName: 'CedarPark Estate', plan: 'Pro', status: 'active', mrr: 800, renewsAt: '2026-08-01T00:00:00.000Z', cancelledAt: null, createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 'sub-003', businessId: 'biz-northgate', businessName: 'Northgate Schools', plan: 'Growth', status: 'past_due', mrr: 3400, renewsAt: '2026-07-12T00:00:00.000Z', cancelledAt: null, createdAt: '2025-09-15T00:00:00.000Z' },
  { id: 'sub-004', businessId: 'biz-havenwood', businessName: 'Havenwood Clinic', plan: 'Starter', status: 'cancelled', mrr: 0, renewsAt: null, cancelledAt: '2026-05-01T00:00:00.000Z', createdAt: '2025-06-01T00:00:00.000Z' },
  { id: 'sub-005', businessId: 'biz-riverside', businessName: 'Riverside Logistics', plan: 'Pro', status: 'active', mrr: 1150, renewsAt: '2026-08-15T00:00:00.000Z', cancelledAt: null, createdAt: '2025-12-01T00:00:00.000Z' },
  { id: 'sub-006', businessId: 'biz-unity', businessName: 'Unity Esusu Co-op', plan: 'Starter', status: 'trialing', mrr: 760, renewsAt: '2026-07-20T00:00:00.000Z', cancelledAt: null, createdAt: '2026-07-01T00:00:00.000Z' },
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Ada Balogun', email: 'ada@cedarpark.io', business: 'CedarPark Estate', businessId: 'biz-cedarpark', applications: ['estate', 'logistics'], role: 'Owner', status: 'active', lastActive: '2h ago' },
  { id: 'u2', name: 'Tomiwa Idris', email: 'tom@northgate.sch', business: 'Northgate Schools', businessId: 'biz-northgate', applications: ['school'], role: 'Admin', status: 'active', lastActive: '1d ago' },
  { id: 'u3', name: 'Grace Nkemdi', email: 'grace@havenwood.med', business: 'Havenwood Clinic', businessId: 'biz-havenwood', applications: ['hospital'], role: 'Staff', status: 'inactive', lastActive: '3w ago' },
  { id: 'u4', name: 'Kunle Adeyemi', email: 'kunle@riverside.co', business: 'Riverside Logistics', businessId: 'biz-riverside', applications: ['logistics'], role: 'Member', status: 'invited', lastActive: '—' },
  { id: 'u5', name: 'Bisi Okonkwo', email: 'bisi@unity.coop', business: 'Unity Esusu Co-op', businessId: 'biz-unity', applications: ['esusu', 'school'], role: 'Admin', status: 'active', lastActive: '5h ago' },
  { id: 'u6', name: 'Emeka Eze', email: 'emeka@greenfield.ng', business: 'Greenfield Properties', businessId: 'biz-greenfield', applications: ['estate'], role: 'Owner', status: 'active', lastActive: '30m ago' },
];

export const MOCK_SUPPORT_TICKETS = [
  { id: 'tkt-001', priority: 'high', subject: 'Cannot access billing', business: 'CedarPark Estate', businessId: 'biz-cedarpark', requester: 'ada@cedarpark.io', time: '12m ago', unread: true, status: 'open', messages: [
    { from: 'ada@cedarpark.io', text: 'Hi, I cannot access the billing section. It shows a 403 error.', time: '12m ago', internal: false },
    { from: 'sam@periscope.local', text: 'Looking into this now. Can you confirm your role in the system?', time: '8m ago', internal: false },
    { from: 'sam@periscope.local', text: 'Internal note: user has support role, billing.read not granted.', time: '5m ago', internal: true },
  ]},
  { id: 'tkt-002', priority: 'medium', subject: 'Add seats to plan', business: 'Northgate Schools', businessId: 'biz-northgate', requester: 'tom@northgate.sch', time: '1h ago', unread: false, status: 'open', messages: [
    { from: 'tom@northgate.sch', text: 'We need to add 50 more seats to our Growth plan.', time: '1h ago', internal: false },
  ]},
  { id: 'tkt-003', priority: 'low', subject: 'Export data request', business: 'Unity Esusu Co-op', businessId: 'biz-unity', requester: 'admin@unity.coop', time: '3h ago', unread: false, status: 'pending', messages: [
    { from: 'admin@unity.coop', text: 'Please provide a full data export for compliance purposes.', time: '3h ago', internal: false },
  ]},
  { id: 'tkt-004', priority: 'medium', subject: 'Payment webhook not firing', business: 'Riverside Logistics', businessId: 'biz-riverside', requester: 'kunle@riverside.co', time: '5h ago', unread: false, status: 'open', messages: [
    { from: 'kunle@riverside.co', text: 'Our payment webhook stopped receiving events since yesterday.', time: '5h ago', internal: false },
  ]},
];

export const MOCK_AUDIT_LOG = [
  { id: 'al-1', time: '2026-07-08T12:04:11Z', actor: 'ada@periscope.local', actorRole: 'Super Admin', action: 'totp.disable', target: 'admin:12', correlationId: '3f2a-9c1b-77ad', result: 'success' },
  { id: 'al-2', time: '2026-07-08T11:58:02Z', actor: 'sam@periscope.local', actorRole: 'Support', action: 'business.view', target: 'biz-cedarpark', correlationId: 'a1c4-70b2-9e11', result: 'success' },
  { id: 'al-3', time: '2026-07-08T11:40:55Z', actor: 'sam@periscope.local', actorRole: 'Support', action: 'dashboard.view', target: '—', correlationId: '6e21-aa9f-4b33', result: '403 Forbidden' },
  { id: 'al-4', time: '2026-07-08T10:12:30Z', actor: 'ada@periscope.local', actorRole: 'Super Admin', action: 'auth.login', target: 'self', correlationId: '0c77-8b3d-58f1', result: 'success' },
  { id: 'al-5', time: '2026-07-08T09:55:10Z', actor: 'zoe@periscope.local', actorRole: 'Sales', action: 'business.view', target: 'biz-northgate', correlationId: 'd84c-1f05-2a6b', result: 'success' },
  { id: 'al-6', time: '2026-07-08T09:30:00Z', actor: 'ada@periscope.local', actorRole: 'Super Admin', action: 'admin.invite', target: 'ken@periscope.local', correlationId: '5e90-6b2a-c3d4', result: 'success' },
];

export const MOCK_ADMINS = [
  { id: 1, name: 'Ada Okafor', email: 'ada@periscope.local', role: 'super-admin', twoFa: true, status: 'active', lastLogin: '2m ago', initials: 'AO' },
  { id: 2, name: 'Sam Peters', email: 'sam@periscope.local', role: 'support', twoFa: true, status: 'active', lastLogin: '1h ago', initials: 'SP' },
  { id: 3, name: 'Zoe Martins', email: 'zoe@periscope.local', role: 'sales', twoFa: false, status: 'active', lastLogin: '3d ago', initials: 'ZM' },
  { id: 4, name: 'Ken Idowu', email: 'ken@periscope.local', role: 'support', twoFa: true, status: 'inactive', lastLogin: '40d ago', initials: 'KI' },
];

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

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', category: 'critical', title: 'Hospital API unreachable', detail: 'Health check failed 6 minutes ago', time: '6m', read: false },
  { id: 'n2', category: 'billing', title: 'Failed payment — Northgate Schools', detail: '$3,400 card_declined', time: '22m', read: false },
  { id: 'n3', category: 'business', title: 'New business signed up — Unity Esusu Co-op', detail: 'esusu · Starter plan', time: '2h', read: true },
  { id: 'n4', category: 'security', title: 'TOTP disabled for ada@periscope.local', detail: 'Step-up verified', time: '5h', read: true },
  { id: 'n5', category: 'billing', title: 'Subscription renewed — CedarPark Estate', detail: 'Growth plan · $1,200', time: '1d', read: true },
];
