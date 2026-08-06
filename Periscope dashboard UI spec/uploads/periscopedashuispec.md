# Periscope-Dash — v0.dev Build Spec

**How to use this doc:** Paste **Sections 0–6** into v0.dev first (they establish the design
system, types, mock data, API seam, routing/RBAC, and components). Then generate screens **one at
a time** from Section 7, pasting the relevant screen block. Every screen references the shared
types and mock modules, so keep them in the project. API wiring (replacing mocks with live calls)
is done afterward by Claude Code against the seam in Section 4.

> **Why this exists:** the original prompt set was ~80% aligned to the real Periscope backend.
> This spec corrects field names, enums, and currency to the **actual API contract**, marks which
> visuals are backed vs. mocked, repurposes the Support screen to the real tools, and adds three
> screens the backend supports but the prompt omitted (Notifications, Activity feed, Security→IPs).

---

## 0. Product context

Periscope is an **internal-only** Operations Platform (IOP) — a command center used by internal
staff (super-admin, support, sales), never customers. It aggregates revenue, businesses, users,
subscriptions, system health, support and security across a portfolio of SaaS products
(**Estate, School, Hospital, Logistics, Hospitality**) by calling each product's private `/internal/*`
API through a gateway. Tone: calm, precise, data-dense, trustworthy — Stripe Dashboard × Linear
(light) × Mercury.

**Two facts that shape the UI:**
1. **Products are dynamic.** The dashboard returns an `applications[]` array; today only **Estate**
   returns real data and the others may be mock or **unavailable**. Render products **generically
   from the array** — never hard-code five columns. Handle the `unavailable: true` per-app state.
2. **Money is multi-currency.** Amounts come with a `currency` field (default **`NGN`**). Format
   with `formatMoney(amount, currency)` → `₦120,000`. Do **not** hard-code `$`.

---

## 1. Tech stack (for v0)

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Recharts** for charts
- **lucide-react** for icons
- **@tanstack/react-query** for data fetching/caching
- State: React Query cache + minimal local state (no Redux)
- All numeric text uses **tabular figures** (`font-variant-numeric: tabular-nums`)

---

## 2. Design system tokens

Define once as CSS variables + Tailwind theme extension; reuse everywhere. WCAG AA contrast.

```css
:root {
  /* Surfaces */
  --bg: #F7F8FA;            /* app background */
  --surface: #FFFFFF;       /* cards */
  --border: #E5E7EB;        /* borders / dividers */

  /* Brand */
  --primary: #4F46E5;       /* indigo */
  --primary-hover: #4338CA;
  --primary-tint: #EEF2FF;

  /* Text */
  --text: #0F172A;
  --text-secondary: #475569;
  --text-muted: #94A3B8;

  /* Semantic (fg / bg) */
  --success: #16A34A; --success-bg: #DCFCE7;   /* healthy · active */
  --warning: #D97706; --warning-bg: #FEF3C7;   /* degraded · suspended · past_due */
  --danger:  #DC2626; --danger-bg:  #FEE2E2;   /* down · cancelled · error */
  --info:    #0EA5E9; --info-bg:    #E0F2FE;

  --focus-ring: rgba(79,70,229,.40);           /* 2px focus ring */
}
```

- **Shadow (cards):** `0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)` + `1px solid var(--border)`
- **Radius:** cards `12px`, controls/inputs `8px`, badges/pills fully rounded
- **Spacing:** 8px grid; page gutters 24–32px
- **Focus:** 2px ring at `--focus-ring`

**Typography (Inter):** page title 28/600 · section 18/600 · stat value 24/600 tabular · body 14/400 ·
label/eyebrow 12/500 uppercase `.04em` · numbers tabular.

**Status color mapping (single source of truth):**

| Value | Color |
| --- | --- |
| `healthy`, `active` | success (green) |
| `degraded`, `suspended`, `past_due`, `trialing` | warning (amber) |
| `down`, `cancelled` | danger (red) |
| `inactive`, `paused` | muted (grey) |

**Product color dots** (stable per product key): `estate` indigo `#4F46E5` · `logistics` teal
`#0D9488` · `school` violet `#7C3AED` · `hospital` rose `#E11D48` · `hospitality` amber `#D97706`.
Derive from the app `key`, with a neutral fallback for unknown keys.

---

## 3. API contract — `lib/types.ts`

These interfaces mirror the backend **exactly** (from `src/gateway/contract.ts` and the domain
services). Do not invent fields.

```ts
// ---------- Auth ----------
export type Role = 'super-admin' | 'support' | 'sales';
export type Permission =
  | 'business.read' | 'business.write' | 'business.delete'
  | 'user.read' | 'user.write'
  | 'billing.read' | 'billing.write'
  | 'subscription.read' | 'customer.read'
  | 'support.read' | 'support.write'
  | 'system.read' | 'system.write';

export interface AuthUser { email: string; role: Role; permissions: Permission[]; }

// POST /auth/login  { email, password }
export type LoginResponse =
  | { accessToken: string; user: AuthUser }     // no TOTP → straight in
  | { mfaRequired: true; mfaToken: string };    // TOTP enabled → step 2

// POST /auth/login/totp  { mfaToken, code }   (code = 6-digit TOTP OR recovery code)
export interface TotpLoginResponse { accessToken: string; user: AuthUser }

// POST /auth/totp/setup → ; /enable { code } → ; /disable { code } →
export interface TotpSetupResponse  { secret: string; otpauthUrl: string }
export interface TotpEnableResponse { recoveryCodes: string[] }        // shown once
export interface TotpDisableResponse { disabled: true }

// ---------- Dashboard  (GET /internal/dashboard, perm: system.read) ----------
export type SystemHealth = 'healthy' | 'degraded' | 'down';
export interface AppDashboardMetrics {
  businesses: number; activeBusinesses: number; users: number;
  mrr: number; arr: number; activeSubscriptions: number;
  failedPayments: number; todaySignups: number; todayRevenue: number;
  systemHealth: SystemHealth; avgResponseTimeMs: number;
}
export interface PerAppSummary extends AppDashboardMetrics {
  key: string; name: string; unavailable?: boolean;   // unavailable=true → greyed card
}
export interface ExecutiveDashboard {
  generatedAt: string;
  kpis: {
    applications: number; businesses: number; activeBusinesses: number; users: number;
    mrr: number; arr: number; monthlyRevenue: number; activeSubscriptions: number;
    failedPayments: number; todaySignups: number; todayRevenue: number;
    systemHealth: SystemHealth; avgResponseTimeMs: number;
  };
  applications: PerAppSummary[];
}

// ---------- Businesses  (business.read) ----------
export type BusinessStatus = 'active' | 'inactive' | 'suspended';
export interface BusinessListItem {              // GET /internal/businesses
  id: string; name: string; status: BusinessStatus;
  applications: string[];                        // product keys, e.g. ['estate','logistics']
  mrr: number; users: number;
}
export interface BusinessAppUsage {
  key: string; name: string; status: BusinessStatus;
  plan: string; mrr: number; users: number; createdAt: string;
}
export interface BusinessDetail extends BusinessListItem {   // GET /internal/businesses/:id (404 NOT_FOUND)
  applicationUsage: BusinessAppUsage[];
}

// ---------- Subscriptions  (subscription.read) ----------
export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'paused';
export interface SubscriptionListItem {          // GET /internal/subscriptions
  id: string; businessId: string; businessName: string;
  plan: string; status: SubscriptionStatus; mrr: number;
  renewsAt: string | null; cancelledAt: string | null; createdAt: string;
  appKey: string; appName: string;
}
export interface PlanBreakdown { plan: string; count: number; mrr: number; }
export interface UpcomingRenewal {
  subscriptionId: string; businessName: string; plan: string;
  mrr: number; renewsAt: string; appKey: string;
}
export interface SubscriptionSummary {           // GET /internal/subscriptions/summary
  total: number; active: number; trialing: number; pastDue: number;
  cancelled: number; paused: number; mrr: number; arr: number;
  churnedThisMonth: number;
  upcomingRenewals: UpcomingRenewal[]; planBreakdown: PlanBreakdown[];
}

// ---------- Revenue  (billing.read) ----------
export interface RevenueRecord {
  appKey: string; todayRevenue: number; mtdRevenue: number; ytdRevenue: number;
  todayTransactions: number; mtdTransactions: number;
  commission: number; refunds: number; outstanding: number; currency: string;
}
export interface RevenueSummary {                // GET /internal/revenue
  todayRevenue: number; mtdRevenue: number; ytdRevenue: number;
  todayTransactions: number; mtdTransactions: number;
  commission: number; refunds: number; outstanding: number;
  currency: string; byApp: RevenueRecord[];
}

// ---------- Users  (user.read) ----------
export type UserStatus = 'active' | 'inactive' | 'suspended';
export interface UserListItem {                  // GET /internal/users
  id: string; email: string; name: string;
  role: string;                                  // product role (free string: Owner/Admin/Staff…)
  status: UserStatus;
  businessId: string | null; businessName: string | null;
  lastLoginAt: string | null; createdAt: string;
  appKey: string; appName: string;
}

// ---------- Monitoring  (GET /internal/monitoring/metrics, system.read) ----------
export interface PlatformMetrics {               // platform-level only (the gateway itself)
  uptime: number; requestCount: number; errorCount: number;
  avgResponseTimeMs: number; p95ResponseTimeMs: number; p99ResponseTimeMs: number;
  memoryUsageMB: number; cpuUsagePercent: number;
}

// ---------- Audit  (GET /internal/audit, system.read) ----------
// query: ?actor&action&resource&resourceId&from&to&limit&offset
export interface AuditEvent {
  id: number; actor: string; actorId: number | null;
  action: string; resource: string; resourceId: string | null;
  before: Record<string, unknown> | null; after: Record<string, unknown> | null;
  ip: string; correlationId: string; createdAt: string;
}

// ---------- Notifications  (system.read / system.write) ----------
export type NotificationCategory = 'business'|'security'|'billing'|'infrastructure'|'support'|'system';
export type NotificationPriority = 'low'|'medium'|'high'|'critical';
export interface Notification {
  id: number; category: NotificationCategory; priority: NotificationPriority;
  title: string; message: string; appKey: string | null;
  readAt: string | null; createdAt: string;
}

// ---------- Activity feed (GET /internal/activity/stream, SSE, system.read) ----------
export interface ActivityEvent { id: string; type: string; timestamp: string; [k: string]: unknown; }

// ---------- Security  (system.read / system.write) ----------
export interface Session   { id: number; adminId: number; ip: string; userAgent: string; expiresAt: string; createdAt: string; }
export interface FailedLogin { id: number; email: string; ip: string; reason: string; createdAt: string; }
export interface BlockedIP { id: number; ip: string; reason: string; blockedBy: string; expiresAt: string | null; createdAt: string; }
export interface AllowedIP { id: number; ip: string; label: string; createdAt: string; }

// ---------- Support tools (support.write / system.write) ----------
export interface ImpersonateResponse { accessToken: string; expiresIn: string; readOnly: true; }  // POST /internal/support/impersonate { adminId }
export interface MagicLinkResponse   { magicToken: string; expiresIn: string; }                   // POST /internal/support/magic-link { email }
export interface ForceLogoutResponse { loggedOut: true; sessionsRevoked: number; }                // POST /internal/support/force-logout { adminId }

// ---------- Admins (NO list endpoint yet — mock; see §8) ----------
export interface AdminRow {
  id: number; name: string; email: string; role: Role;
  totpEnabled: boolean; isActive: boolean; lastLoginAt: string | null;
}

// ---------- Error envelope (every non-2xx) ----------
export interface ApiError { error: { code: string; message: string; correlationId: string; details?: unknown } }
// codes: UNAUTHORIZED(401) FORBIDDEN(403) BAD_REQUEST(400) NOT_FOUND(404) BAD_GATEWAY(502)
//        VALIDATION_ERROR(400) INTERNAL_ERROR(500)
```

**Endpoint ↔ permission map**

| Method | Path | Permission |
| --- | --- | --- |
| POST | `/auth/login` · `/auth/login/totp` | none |
| POST | `/auth/totp/setup` · `/enable` · `/disable` | Bearer (any role) |
| GET | `/internal/dashboard` | `system.read` |
| GET | `/internal/businesses` · `/:id` | `business.read` |
| GET | `/internal/subscriptions` · `/summary` | `subscription.read` |
| GET | `/internal/revenue` | `billing.read` |
| GET | `/internal/users` | `user.read` |
| GET | `/internal/audit` | `system.read` |
| GET | `/internal/monitoring/metrics` | `system.read` |
| GET | `/internal/notifications` · POST `/:id/read` · `/read-all` | `system.read` |
| POST | `/internal/notifications` | `system.write` |
| GET | `/internal/activity/stream` (SSE) | `system.read` |
| GET/DELETE | `/internal/security/sessions[/:id]` | `system.read` / `system.write` |
| GET | `/internal/security/failed-logins` | `system.read` |
| GET/POST/DELETE | `/internal/security/blocked-ips[/:ip]` | `system.read` / `system.write` |
| GET/POST/DELETE | `/internal/security/allowlist[/:ip]` | `system.read` / `system.write` |
| POST | `/internal/support/impersonate` · `/magic-link` | `support.write` |
| POST | `/internal/support/force-logout` | `system.write` |

---

## 4. API client seam — `lib/api.ts`

The single point Claude Code wires later. Screens call typed helpers; a `USE_MOCK` flag serves
mock data until the backend is connected.

```ts
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000';

function correlationId() { return crypto.randomUUID(); }

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAccessToken();               // from auth store
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-correlation-id': correlationId(),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiClientError(res.status, body?.error);   // {code,message,correlationId}
  }
  return res.json() as Promise<T>;
}
```

- **Every** data hook must be swappable: `USE_MOCK ? mock.foo() : apiFetch<Foo>('/internal/foo')`.
- Surface the **error envelope** in the error state (show `code` + `correlationId`, copyable).
- SSE (activity): use `EventSource(`${BASE}/internal/activity/stream`)`; in mock mode, emit fake
  `ActivityEvent`s on an interval.
- **Money helper** `formatMoney(amount, currency)` → `new Intl.NumberFormat('en-NG',{style:'currency',currency}).format(amount)` (renders `₦` for `NGN`).

---

## 5. Routing, navigation & RBAC

**Auth store** holds `{ accessToken, user }`. `user.permissions` drives everything.
`usePermission(p)` → boolean. Wrap gated pages so a user lacking the permission sees the **403
screen** (§7.16), and hide nav items they can't use.

**Sidebar nav → route → required permission** (hide item if missing):

| Group | Item | Route | Permission |
| --- | --- | --- | --- |
| OVERVIEW | Dashboard | `/` | `system.read` |
| PORTFOLIO | Businesses | `/businesses` | `business.read` |
| PORTFOLIO | Revenue | `/revenue` | `billing.read` |
| PORTFOLIO | Subscriptions | `/subscriptions` | `subscription.read` |
| PORTFOLIO | Users | `/users` | `user.read` |
| OPERATIONS | Support | `/support` | `support.write` |
| OPERATIONS | Notifications | `/notifications` | `system.read` |
| OPERATIONS | Activity | `/activity` | `system.read` |
| OPERATIONS | System Health | `/system-health` | `system.read` |
| OPERATIONS | Audit Log | `/audit` | `system.read` |
| — | Settings → Security | `/settings/security` | any (self) |
| — | Settings → Admins | `/settings/admins` | `system.write` |
| — | Settings → Roles | `/settings/roles` | `system.write` |

**Effective visibility by seed role:** super-admin sees all; **support** sees Businesses, Users,
Support, Settings→Security; **sales** sees Businesses, Subscriptions, Revenue, Settings→Security.
(Support/Sales opening Dashboard/Revenue*/Health/Audit → 403. *Sales has `billing.read` so Revenue
is allowed for sales but not support.)

Auth routes (`/login`, `/login/2fa`) render **without** the app shell.

---

## 6. Reusable components (build once, reuse)

- **AppShell** — 240px sidebar (collapsible to 64px icon rail w/ tooltips) + 56px top bar.
- **KpiCard** — eyebrow label, 24/600 tabular value, delta chip (▲ green / ▼ red), optional
  sparkline (mock series ok — see §8).
- **StatusBadge** — pill using the status→color map. **AppChip** — small chip with product color dot.
- **DataTable** — search, filters, sort, pagination; 44px rows, 1px dividers, no zebra, sticky
  header, right-aligned numerics, row hover, row-click.
- **DetailDrawer** — right-side slide-over (used by Users, Audit).
- **States** — `<EmptyState>`, `<SkeletonBlock>`, `<ErrorState>` (renders `code` + copyable
  `correlationId`), `<Forbidden>` (403).
- **Buttons** — primary (indigo), secondary (white+border), ghost, destructive.
- **Toast**, **Modal**, **SegmentedControl**, **Tabs**, **CodeInput** (6-box OTP).

---

## 7. Screens

> Design tone/tokens per §2. Each screen uses AppShell unless noted. Use the exact field names and
> NGN currency from §3. Where a visual is marked **[MOCK]**, drive it from `lib/mock` with a small
> "sample data" caption — it is not yet backed by the API.

### 7.1 Login  *(no shell)*
Two-column: LEFT 55% indigo-tinted brand panel (`#EEF2FF`→white) with Periscope wordmark + aperture
glyph, headline "One command center for the whole portfolio", subline naming the five products, a
row of muted product dots. RIGHT 45% white card (max 400px): "Sign in to Periscope" / "Internal
access only"; **Work email** (`you@periscope.local`); **Password** with show/hide; full-width indigo
**Continue**; ghost "Forgot password?"; footer "Protected by two-factor authentication". On
`{mfaRequired}` response → route to 7.2; else store token → Dashboard. **Error variant:**
`#FEE2E2` banner "Invalid email or password." + red field borders (maps to 401 UNAUTHORIZED).
Mobile: hide brand panel, wordmark on top.

### 7.2 Two-factor verification  *(no shell)*
Centered card (max 420px). Shield icon in indigo tint. "Enter your verification code" / "Open your
authenticator app and enter the 6-digit code for Periscope IOP." **CodeInput** (6 boxes, tabular,
auto-advance). Muted countdown "This challenge expires in 4:52" (mfaToken ≈ 5 min). Full-width
**Verify** → `POST /auth/login/totp {mfaToken, code}`. Ghost toggle "Use a recovery code instead" →
single field `xxxx-xxxx` (same endpoint, `code`=recovery). Ghost "Back to sign in". **Error:** red
helper "Incorrect or expired code. Try again." + danger boxes (401).

### 7.3 Two-factor enrolment  *(Settings → Security)*
Card (max 560px), 2-step indicator "1 Scan · 2 Verify". `POST /auth/totp/setup` returns
`{secret, otpauthUrl}`. LEFT: QR (render from `otpauthUrl`) 180×180 bordered. RIGHT: "Can't scan?"
with monospace `secret` in a copyable field + copy button; issuer "Periscope IOP". Below: 6-box code
"Enter the 6-digit code to confirm". Primary **Enable two-factor** → `POST /auth/totp/enable {code}`
→ on success go to 7.4. Secondary **Cancel**.

### 7.4 Recovery codes  *(modal, shown once)*
`#FEF3C7` banner "Save these codes now — they're shown only once." Title "Your recovery codes",
subline "Each code works once if you lose access to your authenticator." 2-col grid of the 10
monospace codes from `recoveryCodes`. Actions: **Copy all**, **Download .txt** (secondary). Required
checkbox "I have saved my recovery codes in a safe place". Primary **Done** disabled until checked.

### 7.5 Executive Dashboard  → `GET /internal/dashboard`
Header: title "Dashboard", muted "Updated {relative(generatedAt)} · aggregated across
{kpis.applications} products", right: date-range segmented (Today/7d/30d) **[MOCK range — API is
point-in-time]** + Refresh (ghost). **System health banner** driven by `kpis.systemHealth`: show the
`degraded` amber variant "System degraded — {name} is unavailable; showing last known values." with
"View System Health" link (derive the failing product from any `applications[i].unavailable` /
`systemHealth==='down'`). **KPI grid** from `kpis`: MRR `formatMoney(mrr)` (▲ delta **[MOCK]**), ARR,
Businesses `businesses` (muted subline "`activeBusinesses` active"), Users, Active subscriptions,
Failed payments (danger tint if >0), Signups today, Revenue today. Sparklines on MRR & Users **[MOCK
series]**. **MRR trend** wide card, 12-mo area chart **[MOCK]**. **By product** grid, one card per
`applications[]` item: name + color dot, health badge, mini stats (Businesses, Users,
`formatMoney(mrr)`, `avgResponseTimeMs` ms). For `unavailable:true` → greyed card, "Data unavailable"
pill, "Retry" ghost. Provide a full **skeleton** variant.

### 7.6 Businesses list  → `GET /internal/businesses`
Header "Businesses" + muted count "{n} businesses"; toolbar: search (name/ID), Status filter
(All/Active/Inactive/Suspended), Application filter (from product keys), Sort (MRR/Users/Name).
DataTable columns: **Business** (name + muted monospace `id`), **Status** pill, **Applications**
AppChips from `applications[]`, **MRR** (`formatMoney`, right), **Users** (right). Status pills:
active=green, suspended=amber, inactive=grey. Footer pagination + rows-per-page. Row → 7.7. Provide
**empty** ("No businesses match your filters" + Clear filters) and **skeleton** variants. *(Search/
filter/sort/paginate client-side; the endpoint returns the full merged list.)*

### 7.7 Business detail  → `GET /internal/businesses/:id`
Breadcrumb Businesses / {name}. Header card: name, muted monospace `id`, status pill, AppChips
(`applications`). Right consolidated stats: MRR `formatMoney(mrr)` · Users `users` · Applications
`applications.length` · Since `{min(applicationUsage.createdAt)}`. Actions menu (⋯) "Suspend",
"Message owner", "Open in product" — **no write API today: show disabled with a "Coming soon"
tooltip, and hide the menu entirely for roles without `business.write`.** Tabs "Overview" / "Activity"
(Activity = **[MOCK]** until per-business events exist). **Overview → Application usage**: one card per
`applicationUsage[]`: name + dot, status pill, Plan, `formatMoney(mrr)`, `users`, Created. Small
**Revenue split** donut over `applicationUsage[].mrr`. **Not-found** variant for unknown id
("Business not found" + monospace id + Back) maps to **404 NOT_FOUND**.

### 7.8 Revenue & Subscriptions  → `GET /internal/revenue`, `/internal/subscriptions[/summary]`
Header "Revenue", date-range segmented (30d/QTD/YTD) **[MOCK range]**, "Export CSV" (client-side from
loaded rows). **KPI row** from `subscriptions/summary` + `revenue`: MRR `formatMoney(summary.mrr)`
(▲ **[MOCK]**), ARR `summary.arr`, Net-new MRR **[MOCK]**, Failed payments (danger) = dashboard
`failedPayments`. **Charts:** "MRR trend" stacked area by product **[MOCK]**; "MRR by plan"
horizontal bars from `summary.planBreakdown` (**backed**). **Subscriptions table** from
`/subscriptions`: lifecycle filter (Active/Trialing/Past due/Cancelled/Paused — match enum). Columns
Business (`businessName`), Product (`appName`), Plan, MRR (`formatMoney`), Status pill (past_due=amber,
cancelled=grey, trialing=amber), Renews (`renewsAt`). **Upcoming renewals** panel from
`summary.upcomingRenewals` (**backed**). **Failed payments** panel — **[MOCK]** (API exposes only the
count, not per-payment rows/reasons); caption it as sample and gate the "Retry" action off.

### 7.9 Users  → `GET /internal/users`
Header "Users", count, search (name/email), filters: Application (`appKey`), **Status: Active/
Inactive/Suspended** (real enum — not Invited/Deactivated). DataTable: **User** (avatar + `name` +
muted `email`), **Business** (`businessName`), **Applications** (AppChip from `appKey`), **Role**
(`role`, free string), **Status** pill, **Last active** (`lastLoginAt`, "—" if null). Row → right
**DetailDrawer**: profile, business membership, per-app role, recent activity (**[MOCK]** activity).
Empty + skeleton variants.

### 7.10 Support  *(repurposed — real backed tools, not tickets)*
Header "Support" — muted "Look up an account and take action. All actions are audit-logged." No
ticket inbox (no tickets API). Layout:
- **Lookup panel**: search a business (`/internal/businesses`) or user (`/internal/users`); selecting
  shows a **context card** (name, id, status, plan, MRR, apps, "View business" link).
- **Actions** (gated by permission, each opens a confirm modal, each returns a result toast):
  • **Impersonate (read-only)** → `POST /internal/support/impersonate {adminId}` → shows
    `{expiresIn:'15m', readOnly:true}`; explain it strips write perms. *(perm: `support.write`)*
  • **Send magic link** → `POST /internal/support/magic-link {email}` → shows `{expiresIn:'5m'}`.
    *(perm: `support.write`)*
  • **Force logout** → `POST /internal/support/force-logout {adminId}` → shows
    `{sessionsRevoked}`. *(perm: `system.write` — hide for support role)*
- Note: these operate on **Periscope admins** (adminId/email), the internal operators. Empty state
  "Search for an account to begin."

### 7.11 Audit log  → `GET /internal/audit`
Header "Audit log", date-range picker (`from`/`to`), filters Actor (`actor`), Action (`action`),
search; "Export" (client-side). DataTable (dense, monospace ids/timestamps): **Time** (`createdAt`
UTC), **Actor** (`actor` + role chip if derivable), **Action** (`action` verb pill, colored by
prefix e.g. `support.*`, `auth.*`, `business.*`), **Target** (`resource`/`resourceId`),
**Correlation ID** (`correlationId`, monospace copyable), **Result** — derive from `action`
(e.g. `login.failed` → danger "Failed"; else "Success"). Row → **DetailDrawer** with pretty-printed
JSON of the full event incl. `before`/`after`, `ip`, `correlationId`. Pagination via `limit`/`offset`.

### 7.12 System Health  → dashboard `applications[]` + `GET /internal/monitoring/metrics`
Header "System Health", overall pill from dashboard `systemHealth` (show Degraded amber), auto-refresh
toggle, "last checked {n}s ago". **Status grid**: one card per `applications[]` product + one
**Periscope Gateway** card from `monitoring/metrics`. Product cards (**backed subset**): name + dot,
big status label (`systemHealth`), **Avg latency** (`avgResponseTimeMs`), **Failed payments**
(`failedPayments`). **Uptime % and error rate per product are [MOCK]** (not in the API) — label them
sample. Gateway card (**backed**): uptime (`uptime`), avg/`p95`/`p99` ms, error rate
(`errorCount`/`requestCount`), memory (`memoryUsageMB`). For `unavailable`/`down` product → red
"Unreachable" + Retry. **Latency chart** "Response time (last 60 min)" multi-line **[MOCK series]**.
**Active alerts** panel **[MOCK]** (derive one alert per `down`/`degraded` product from real state;
others sample).

### 7.13 Admins & Roles  *(Settings, `system.write`)*
Tabs "Admins" / "Roles & permissions".
- **Admins** — **[MOCK list]** (no admins-list endpoint yet; use `AdminRow` mock). Header "Team
  members" + "Invite admin" (disabled/"coming soon"). Columns: Admin (avatar+name+email), Role chip,
  **2FA** (`totpEnabled` → green "Enabled" / grey "Not set"), Status (`isActive`), Last login. Row ⋯:
  Edit role / Reset password / Deactivate / Remove — all disabled pending endpoints.
- **Roles & permissions** — **backed by static RBAC** (§3). Permission **matrix**: rows = 13
  permissions grouped by resource (Business, Users, Billing, Subscriptions, Customers, Support,
  System); columns = Super Admin / Support / Sales; cell = green check / grey dash. Fill from:
  super-admin=all; support=`business.read,user.read,support.read,support.write`;
  sales=`business.read,subscription.read,billing.read,customer.read`.

### 7.15 Settings → Security  *(self; any role)*
Left sub-nav: Profile · Security(active) · Notifications · Admins (system.write only). Cards:
1) **Profile** — avatar + change, `name`, `email` (read-only), role chip.
2) **Password** — current/new/confirm + "Update password" **[MOCK — no change-password endpoint]**;
   muted "Last changed …".
3) **Two-factor** — **Enabled** state: green pill, "Authenticator app added on {date}", "View
   recovery codes" (secondary), destructive "Disable two-factor" → **step-up modal** "Confirm it's
   you — enter your current 6-digit code" (CodeInput) → `POST /auth/totp/disable {code}`. **Disabled**
   state: "Set up two-factor" primary → 7.3.
4) **Active sessions** → `GET /internal/security/sessions`: table Device (parse `userAgent`), IP
   (`ip`), Last active (`createdAt`), Expires (`expiresAt`); **Revoke** per row →
   `DELETE /internal/security/sessions/:id`; "Sign out everywhere" (force-logout self). Mark the
   current session.

### 7.16 Shared states
1) **Empty** — soft indigo line icon, "Nothing here yet", muted description, primary action.
2) **Skeleton** — shimmering grey placeholders (cards + chart + 6 rows), no text.
3) **Error (gateway)** — danger icon, "Something went wrong", "We couldn't load this data. A
   downstream product API returned an error.", monospace `code: BAD_GATEWAY · correlationId: …`
   (copyable), **Retry** + "Copy correlation ID". Mirrors `{error:{code,message,correlationId}}`.
4) **403 Forbidden** — lock icon, "You don't have access to this", "Your role ({role}) doesn't
   include the permission required for this page ({permission}). Contact a super-admin if you need
   access.", "Back to Businesses". Shown when a role lacks the route's permission (§5).

### 7.17 Notifications  *(new)* → `GET /internal/notifications`
Header "Notifications" + unread count; filters: Category (`business|security|billing|infrastructure|
support|system`), Priority (`low|medium|high|critical`), unread toggle (`?unread=true`). List rows:
priority dot (critical=red, high=amber, medium=indigo, low=grey), category chip, `title`, muted
`message`, relative `createdAt`, unread indicator (`readAt===null`). Row action **Mark read** →
`POST /internal/notifications/:id/read`; header "Mark all read" → `/read-all`. The top-bar bell badge
= unread count. (Create via `POST` is `system.write` — optional "New notification" for super-admin.)
Empty + skeleton.

### 7.18 Activity feed  *(new)* → `GET /internal/activity/stream` (SSE)
A live feed — as a `/activity` page and/or a top-bar drawer. Connect via `EventSource`; render
newest-first `ActivityEvent`s (`type`, `timestamp`, plus event-specific fields). Show a small live
"connected" indicator (green dot) from the initial `{type:'connected'}` event; reconnect on drop. In
mock mode, synthesize events on a 3–6s interval. Empty ("Waiting for activity…") + connecting states.

### 7.19 Security → IPs  *(new; `system.read`/`system.write`)*
Tabs within a Security ops page: **Failed logins** (`GET /internal/security/failed-logins`: `email`,
`ip`, `reason`, `createdAt`), **Blocked IPs** (`GET/POST/DELETE /internal/security/blocked-ips`: `ip`,
`reason`, `blockedBy`, `expiresAt`; add/remove gated by `system.write`), **Allowlist**
(`GET/POST/DELETE /internal/security/allowlist`: `ip`, `label`). Tables + add-IP modal + row Remove.
Empty + skeleton.

---

## 8. Coverage matrix & backend follow-ups

**Legend:** ✅ backed · 🟡 partially backed · 🟥 mock-only (needs backend).

| Screen | Endpoint(s) | Status |
| --- | --- | --- |
| 7.1 Login | `POST /auth/login` | ✅ |
| 7.2 2FA verify | `POST /auth/login/totp` | ✅ |
| 7.3 2FA enrol | `POST /auth/totp/setup`,`/enable` | ✅ |
| 7.4 Recovery codes | (from `/enable`) | ✅ |
| 7.5 Dashboard | `GET /internal/dashboard` | 🟡 KPIs/per-app ✅; sparklines/MRR-trend/deltas/date-range 🟥 |
| 7.6 Businesses | `GET /internal/businesses` | ✅ (client-side filter/sort/paginate) |
| 7.7 Business detail | `GET /internal/businesses/:id` | 🟡 data ✅; write actions & Activity tab 🟥 |
| 7.8 Revenue & Subs | `/internal/revenue`,`/subscriptions[/summary]` | 🟡 KPIs/plan/renewals ✅; MRR-trend & failed-payment rows 🟥 |
| 7.9 Users | `GET /internal/users` | ✅ (drawer activity 🟥) |
| 7.10 Support tools | `/internal/support/*` | ✅ |
| 7.11 Audit | `GET /internal/audit` | ✅ |
| 7.12 System Health | dashboard + `/internal/monitoring/metrics` | 🟡 status/latency/gateway ✅; uptime%/error-rate per product, latency-over-time, alerts 🟥 |
| 7.13 Admins & Roles | permissions (static) | 🟡 roles matrix ✅; admins list & mgmt 🟥 |
| 7.15 Settings/Security | `/internal/security/sessions`, `/auth/totp/disable` | 🟡 sessions/2FA ✅; change-password 🟥 |
| 7.16 States | error envelope / 403 | ✅ |
| 7.17 Notifications | `/internal/notifications*` | ✅ |
| 7.18 Activity | `/internal/activity/stream` | ✅ |
| 7.19 Security → IPs | `/internal/security/*` | ✅ |

**Backend follow-ups (Claude Code, after v0):**
1. **Snapshot-history endpoint** (e.g. `GET /internal/history?metric=mrr&range=12m`) to back trend
   charts & sparklines — the BullMQ snapshot job already persists periodic snapshots to build from.
2. **Per-product health series** (uptime %, error rate, latency-over-time) for System Health, or a
   time-series store fed by the gateway.
3. **Failed-payments list** endpoint (business, amount, reason, timestamp) — today only the count
   exists.
4. **Admins list + management** endpoints (list/invite/edit-role/deactivate) and **change-password**
   for Settings.
5. (Optional) Business/subscription **write actions** (suspend, retry) if those become in-scope.

Until then, those areas render from `lib/mock` with a "sample data" caption; everything else is live.
