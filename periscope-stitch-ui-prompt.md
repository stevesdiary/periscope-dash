# Periscope — Google Stitch UI Design Prompt

A step-by-step, screen-by-screen prompt pack for generating the **Periscope** operations
dashboard UI in [Google Stitch](https://stitch.withgoogle.com).

**Periscope** is an *Internal Operations Platform (IOP)* — an internal-only "command center"
that aggregates revenue, businesses, users, subscriptions, system health, support and security
across a portfolio of SaaS products (**Estate, School, Hospital, Logistics, esusu**). Customers
never see it; internal operators (super-admin, support, sales) do.

Every prompt below uses **real field names and realistic sample data from the actual API**, so
the generated screens match the backend contract. Copy each block into Stitch as-is.

---

## Section 0 — How to use this in Stitch

1. Open **stitch.withgoogle.com** and start a new project in **Web** mode (desktop dashboard).
2. Switch the model to **Experimental** (Gemini 2.5 Pro) for higher fidelity on data-dense
   screens. Use **Standard** (Flash) for fast iteration once the look is dialed in.
3. **Paste Section 1 (Master design-system prompt) first.** This establishes the theme
   (colors, type, components). You can also mirror these values in Stitch's Theme panel.
4. Paste **Section 2 (App shell)** to lock the navigation frame.
5. Generate screens **one at a time** using Section 3. Each screen prompt is self-contained and
   restates the theme, so it works even if pasted independently.
6. Refine any screen with the follow-up snippets in **Section 5** (they operate on the
   currently selected screen).
7. Add responsive/mobile variants with **Section 4**.
8. When happy, **export to Figma** or **copy the front-end code** (Section 6).

> Tips: Stitch works best when a prompt describes *one screen* with concrete content. Keep the
> sample data — it dramatically improves layout quality versus placeholder text. If a generation
> drifts from the theme, re-paste the color/type line from Section 1 and regenerate.

---

## Section 1 — Master design-system prompt

> Paste this first. It defines the product and the visual language for everything that follows.

```
You are designing "Periscope", an internal Operations Platform (IOP) — a web command center
used by internal staff (not customers) to monitor a portfolio of SaaS products (Estate, School,
Hospital, Logistics, esusu). It aggregates revenue, businesses, users, subscriptions, system
health, support and security into one dashboard. The tone is calm, precise, data-dense, and
trustworthy — like Stripe Dashboard, Linear (light), and Mercury.

Design a cohesive, clean light-enterprise design system with these exact tokens:

COLORS
- App background: #F7F8FA
- Surface / cards: #FFFFFF with a soft shadow (0 1px 2px rgba(16,24,40,.06), 0 1px 3px
  rgba(16,24,40,.10)) and a 1px #E5E7EB border
- Primary (indigo): #4F46E5, hover #4338CA, subtle tint #EEF2FF
- Text: primary #0F172A, secondary #475569, muted #94A3B8
- Borders / dividers: #E5E7EB
- Semantic: success #16A34A (bg #DCFCE7), warning #D97706 (bg #FEF3C7),
  danger #DC2626 (bg #FEE2E2), info #0EA5E9 (bg #E0F2FE)
- Status mapping: healthy/active = success, degraded/suspended = warning,
  down/inactive = danger/muted

TYPOGRAPHY (Inter)
- Page title: 28px / 600
- Section heading: 18px / 600
- Card/stat value: 24px / 600 (tabular numerals)
- Body: 14px / 400
- Label / eyebrow: 12px / 500, letter-spacing .04em, uppercase
- Numbers use tabular/monospaced figures

LAYOUT & SHAPE
- 8px spacing grid; page gutters 24–32px
- Card radius 12px; control/input radius 8px; pill/badge fully rounded
- Data tables: no zebra striping, 1px row dividers, 44px row height, sticky header,
  right-align numeric columns
- Focus ring: 2px indigo at 40% opacity

REUSABLE COMPONENTS (define these and reuse across screens)
- App shell: 240px left sidebar nav + 56px top bar
- KPI stat card: label, big value, small delta chip (▲ green / ▼ red), optional sparkline
- Status badge (pill), Application tag/chip (small, with product color dot)
- Data table with search, filters, sort, pagination
- Right-side detail drawer / split detail pane
- States: empty, skeleton-loading, error, and 403 "insufficient permission"
- Buttons: primary (indigo solid), secondary (white + border), ghost, destructive
- Toast/notification, modal dialog, segmented control, tabs

Deliver a clean, accessible (WCAG AA contrast) light theme. Keep it uncluttered with generous
whitespace and clear visual hierarchy.
```

---

## Section 2 — App shell prompt

> Establishes the persistent navigation frame reused by every internal screen.

```
Design the persistent app shell for the Periscope internal ops dashboard (clean light-enterprise
theme: #F7F8FA background, white surfaces, indigo #4F46E5 primary, Inter font).

LEFT SIDEBAR (fixed, 240px, white with a right 1px #E5E7EB border):
- Top: "Periscope" wordmark with a small periscope/aperture glyph in indigo, and a subtle
  "IOP" eyebrow label
- Nav grouped with small uppercase group labels:
  • OVERVIEW → Dashboard (grid icon)
  • PORTFOLIO → Businesses, Revenue, Subscriptions, Users
  • OPERATIONS → Support, System Health, Audit Log
- Active item: indigo text, #EEF2FF pill background, 3px indigo left accent
- Bottom of sidebar: Settings, and a divider then a user chip (avatar, name "Ada Okafor",
  role label "Super Admin")
- Provide a collapsed variant: 64px icon-only rail with tooltips

TOP BAR (56px, white, 1px bottom border):
- Left: current page title / breadcrumb
- Center: global search input ("Search businesses, users…") with ⌘K hint
- Right: an environment pill ("Production"), a notifications bell with a red dot, and the
  user avatar menu

Note that navigation items are role-gated: Dashboard, Revenue, Subscriptions, System Health,
Audit Log, and Settings→Admins are visible only to super-admin; Support is visible to support;
Businesses/Users are visible to all roles. Show the full super-admin version.

Show the shell wrapping a placeholder content area.
```

---

## Section 3 — Screens

Each screen is a standalone prompt: **purpose → layout → components → sample data → states.**

### 3.1 — Login

```
Design the LOGIN screen for Periscope, an internal operations platform (clean light-enterprise
theme: #F7F8FA base, white card, indigo #4F46E5 primary, Inter).

Two-column layout on desktop:
- LEFT (55%): a soft indigo-tinted brand panel (#EEF2FF → white gradient) with the Periscope
  wordmark + periscope glyph, a headline "One command center for the whole portfolio", a short
  subline "Revenue, businesses, users, health — across Estate, School, Hospital, Logistics and
  esusu", and 3 tiny muted product logos row.
- RIGHT (45%): a centered white card (max 400px) with:
  • "Sign in to Periscope" title, "Internal access only" muted subline
  • Email field (label "Work email", placeholder "you@periscope.local")
  • Password field with show/hide toggle
  • Primary full-width "Continue" button (indigo)
  • Small "Forgot password?" ghost link
  • Footer note: "Protected by two-factor authentication"

Include an inline error state variant: a danger-tinted (#FEE2E2) banner reading "Invalid email
or password." above the form, with fields showing a red border.

Responsive: on mobile, hide the left brand panel and show the card full-width with the wordmark
on top.
```

### 3.2 — Two-factor verification (TOTP step 2)

```
Design the TWO-FACTOR VERIFICATION screen for Periscope (clean light-enterprise theme, indigo
#4F46E5, Inter). This is step 2 after a correct password when the account has TOTP enabled.

Centered white card (max 420px) on #F7F8FA:
- Shield/lock icon in an indigo tint circle
- Title "Enter your verification code"
- Subline "Open your authenticator app and enter the 6-digit code for Periscope IOP."
- A 6-box segmented code input (large, tabular numerals), auto-advancing
- A muted countdown note: "This challenge expires in 4:52"
- Primary "Verify" button (full width)
- A ghost link toggle: "Use a recovery code instead" → reveals a single text field labeled
  "Recovery code" (placeholder "xxxx-xxxx")
- Secondary ghost link: "Back to sign in"

Include an error variant: red helper text under the boxes "Incorrect or expired code. Try again."
with the boxes outlined in danger red.
```

### 3.3 — Two-factor enrolment (TOTP setup)

```
Design the TWO-FACTOR ENROLMENT screen for Periscope (clean light-enterprise theme, indigo
#4F46E5, Inter). Reached from Settings → Security. Shown inside the app shell content area.

A centered white setup card (max 560px) with a 2-step progress indicator ("1 Scan · 2 Verify"):
- Title "Set up two-factor authentication"
- Subline "Scan the QR code with an authenticator app (Google Authenticator, 1Password, Authy)."
- LEFT: a QR code image placeholder (generated from an otpauth:// URL), 180x180, in a bordered box
- RIGHT: a "Can't scan?" block with a monospaced secret key in a copyable field
  (e.g. "JBSW Y3DP EHPK 3PXP") and a copy button; issuer shown as "Periscope IOP"
- Below: a 6-box code input labeled "Enter the 6-digit code to confirm"
- Buttons: primary "Enable two-factor", secondary "Cancel"

State note: after success this transitions to the Recovery Codes screen (3.4).
```

### 3.4 — Recovery codes

```
Design the RECOVERY CODES screen for Periscope (clean light-enterprise theme, indigo #4F46E5,
Inter). Shown once, immediately after enabling two-factor authentication, inside a modal dialog
over the Settings page.

Modal (max 520px), white:
- Warning-tinted (#FEF3C7) banner at top: "Save these codes now — they're shown only once."
- Title "Your recovery codes"
- Subline "Each code works once if you lose access to your authenticator."
- A 2-column grid of 10 monospaced single-use codes, e.g.:
  4f9a-2c81   7d3e-0b62
  a1c4-9e70   3b8f-11d5
  6e21-4aa9   0c77-58b3
  9f2d-7c40   2a6b-e913
  d84c-1f05   5e90-6b2a
- Actions row: "Copy all" (secondary), "Download .txt" (secondary)
- A required checkbox "I have saved my recovery codes in a safe place"
- Primary "Done" button, disabled until the checkbox is ticked
```

### 3.5 — Executive Dashboard

```
Design the EXECUTIVE DASHBOARD (home) screen for Periscope, an internal ops command center
(clean light-enterprise theme: #F7F8FA base, white cards with soft shadow, indigo #4F46E5,
Inter, tabular numerals). Use the app shell (240px sidebar, top bar). Super-admin view.

HEADER ROW: page title "Dashboard", a muted "Updated just now · aggregated across 5 products"
timestamp, and a right-aligned date-range segmented control (Today / 7d / 30d) plus a "Refresh"
ghost button.

SYSTEM HEALTH BANNER (full width, below header): a slim card showing overall systemHealth.
Show the "degraded" variant: warning-tinted (#FEF3C7) left border, text "System degraded —
Hospital API is unavailable; showing last known values." with a "View System Health" link.

KPI STAT-CARD GRID (4 columns on desktop, wrapping): each card = uppercase label, big value,
and a small delta chip. Use this real data:
- MRR — $120,000  (▲ 6.4% vs last month)
- ARR — $1.44M
- Businesses — 200  (180 active)   [show "180 active" as a muted subline]
- Users — 12,000  (▲ 3.1%)
- Active subscriptions — 175
- Failed payments — 8  (danger-tinted, ▲ 2)
- Signups today — 12
- Revenue today — $4,500
Give MRR and Users cards a small sparkline.

REVENUE TREND: a wide white card titled "Monthly recurring revenue" with a smooth area/line
chart (last 12 months, indigo line, subtle fill), y-axis in $k.

PER-APPLICATION BREAKDOWN: a section titled "By product" with a responsive grid of product
cards, one per app. Each card: product name + colored dot, a health badge, and mini stats
(Businesses, Users, MRR, Avg latency). Real data:
- Estate — healthy — 128 businesses · 5,421 users · $48,250 MRR · 142ms
- Logistics — healthy — 72 businesses · 6,579 users · $71,750 MRR · 148ms
- School — healthy — 96 businesses · 3,240 users · $22,400 MRR · 130ms
- esusu — healthy — 54 businesses · 980 users · $8,900 MRR · 121ms
- Hospital — UNAVAILABLE — show this card greyed out with a "Data unavailable" pill and a
  small "Retry" ghost link (this is the graceful-degradation state)

Include a skeleton-loading variant of the whole page (shimmering placeholder cards and chart).
```

### 3.6 — Businesses list

```
Design the BUSINESSES screen for the Periscope internal ops dashboard (clean light-enterprise
theme: #F7F8FA base, white cards, indigo #4F46E5 primary, Inter, tabular numerals). Use the app
shell (240px sidebar, top bar with search).

HEADER: page title "Businesses" with a muted result count "200 businesses" and a right-aligned
toolbar: a search field ("Search by name or ID"), a Status filter (All / Active / Inactive /
Suspended), an Application filter (Estate / School / Hospital / Logistics / esusu), and a Sort
dropdown (MRR, Users, Name).

DATA TABLE (full-width white card, 44px rows, sticky header, no zebra striping, hover highlight):
Columns — Business (name in primary text + muted monospace id below), Status (colored pill),
Applications (small chips with product color dots), MRR (right-aligned), Users (right-aligned).
Sample rows:
- CedarPark Estate    · biz-cedarpark  · Active    · [Estate][Logistics] · $2,000 · 114
- Northgate Schools   · biz-northgate  · Active    · [School]            · $3,400 · 260
- Havenwood Clinic    · biz-havenwood  · Suspended · [Hospital]          · $0     · 40
- Riverside Logistics · biz-riverside  · Active    · [Logistics]         · $1,150 · 58
- Oakmount Estate     · biz-oakmount   · Inactive  · [Estate]            · $0     · 12
- Unity Esusu Co-op   · biz-unity      · Active    · [esusu][School]     · $760   · 210
Status pills: Active = green, Suspended = amber, Inactive = grey.

FOOTER: pagination ("1–6 of 200", page controls) and a rows-per-page selector.
Clicking a row navigates to Business detail.

Also produce two state variants of this table: an EMPTY state ("No businesses match your
filters" with a "Clear filters" button) and a SKELETON-LOADING state.
```

### 3.7 — Business detail

```
Design the BUSINESS DETAIL screen for Periscope (clean light-enterprise theme: #F7F8FA base,
white cards, indigo #4F46E5, Inter, tabular numerals). Use the app shell. This is the
cross-application view of one business merged across every product it uses.

BREADCRUMB: Businesses / CedarPark Estate.

HEADER CARD: large business name "CedarPark Estate", muted monospace id "biz-cedarpark", an
Active green status pill, and application chips [Estate][Logistics]. On the right, a row of
consolidated KPI stats: MRR $2,000 · Users 114 · Applications 2 · Since Nov 2025.
Include a right-aligned actions menu (⋯) with items "Suspend", "Message owner", "Open in
product" — note these are gated by role (only super-admin sees write actions; support/sales
see a read-only header without the actions menu).

TABS: "Overview" (active) and "Activity".

OVERVIEW → APPLICATION USAGE: a section titled "Application usage" with one card per product
this business uses (the applicationUsage breakdown). Each card: product name + colored dot,
status pill, and stats — Plan, MRR, Users, Created. Real data:
- Estate    — Active — Plan: Growth  · MRR $1,200 · 84 users · Created 2 Nov 2025
- Logistics — Active — Plan: Pro     · MRR $800   · 30 users · Created 1 Feb 2026

Add a small "Revenue split" donut showing Estate $1,200 / Logistics $800.

Include a NOT-FOUND state variant for an unknown id: a centered empty state "Business not found"
with the monospace id and a "Back to Businesses" button (maps to the API 404 NOT_FOUND).
```

### 3.8 — Revenue & Subscriptions

```
Design the REVENUE & SUBSCRIPTIONS screen for Periscope (clean light-enterprise theme: #F7F8FA,
white cards, indigo #4F46E5, Inter, tabular numerals). Use the app shell. Super-admin / sales view.

HEADER: title "Revenue", date-range segmented control (30d / QTD / YTD), "Export CSV" secondary
button.

TOP KPI ROW: MRR $120,000 (▲6.4%) · ARR $1.44M · Net new MRR $7,200 · Failed payments 8 (danger).

CHARTS ROW (two cards):
- "MRR trend" — stacked area chart by product (Estate, Logistics, School, esusu, Hospital),
  last 12 months, legend with product color dots.
- "MRR by plan" — horizontal bar chart: Pro $58k, Growth $41k, Starter $21k.

SUBSCRIPTIONS TABLE: title "Active subscriptions" with a lifecycle filter (Active / Past due /
Canceled / Trialing). Columns: Business, Product, Plan, MRR, Status, Renews. Sample rows:
- CedarPark Estate  · Estate    · Growth · $1,200 · Active   · 2 Aug 2026
- CedarPark Estate  · Logistics · Pro    · $800   · Active   · 1 Aug 2026
- Northgate Schools · School    · Growth · $3,400 · Past due · 12 Jul 2026 (amber)
- Havenwood Clinic  · Hospital  · Starter· $0     · Canceled · —          (grey)

FAILED PAYMENTS panel (right column or below): a compact list of 8 recent failed payments with
business, amount, reason ("card_declined", "insufficient_funds"), and a "Retry" ghost action.
```

### 3.9 — Users (cross-application)

```
Design the USERS screen for Periscope (clean light-enterprise theme: #F7F8FA, white cards,
indigo #4F46E5, Inter). Use the app shell. This aggregates end-users across all products
(these are product users, not Periscope admins).

HEADER: title "Users", result count "12,000 users", search field ("Search by name or email"),
filters (Application, Status: Active/Invited/Deactivated).

DATA TABLE (44px rows, sticky header): Columns — User (avatar + name + muted email), Business,
Applications (chips), Role, Status, Last active. Sample rows:
- Ada Balogun    · ada@cedarpark.io      · CedarPark Estate   · [Estate][Logistics] · Owner  · Active     · 2h ago
- Tomiwa Idris   · tom@northgate.sch     · Northgate Schools  · [School]            · Admin  · Active     · 1d ago
- Grace Nkemdi   · grace@havenwood.med   · Havenwood Clinic   · [Hospital]          · Staff  · Deactivated· 3w ago
- Kunle Adeyemi  · kunle@riverside.co    · Riverside Logistics· [Logistics]         · Member · Invited    · —

FOOTER: pagination. Row click opens a right-side detail drawer showing the user's profile,
business membership, per-app roles, and recent activity.

Include an empty search state and a skeleton-loading state.
```

### 3.10 — Support tickets

```
Design the SUPPORT screen for Periscope (clean light-enterprise theme: #F7F8FA, white cards,
indigo #4F46E5, Inter). Use the app shell. Primary view for the support role.

Split layout:
- LEFT (list, ~380px): title "Support tickets" with tabs (Open / Pending / Closed) and a count
  badge. A scrollable list of ticket cards, each: priority dot (High=red, Med=amber, Low=grey),
  subject, business name, requester, relative time, and an unread indicator. Sample:
  • [High] "Cannot access billing" · CedarPark Estate · ada@cedarpark.io · 12m ago (selected)
  • [Med]  "Add seats to plan"      · Northgate Schools · tom@northgate.sch · 1h ago
  • [Low]  "Export data request"    · Unity Esusu Co-op · admin@unity.coop · 3h ago
- RIGHT (detail pane): the selected ticket — header (subject, priority pill, status dropdown,
  assignee), a BUSINESS CONTEXT card (name biz-cedarpark, Active, plan Growth, MRR $2,000, apps
  Estate+Logistics, with a "View business" link), a threaded conversation of messages, and a
  reply composer at the bottom with "Send" (indigo) and an internal-note toggle.

Include an empty state for the detail pane ("Select a ticket to view details").
```

### 3.11 — Audit log

```
Design the AUDIT LOG screen for Periscope (clean light-enterprise theme: #F7F8FA, white cards,
indigo #4F46E5, Inter, tabular numerals). Use the app shell. Super-admin only.

HEADER: title "Audit log", a date-range picker, and filters: Actor (admin), Action, and a
search field. An "Export" secondary button.

DATA TABLE (dense, 44px rows, sticky header, monospace for ids/timestamps): Columns — Time
(UTC), Actor (avatar + email + role chip), Action (verb pill), Target, Correlation ID
(monospace, copyable), Result. Sample rows:
- 2026-07-08 12:04:11Z · ada@periscope.local (Super Admin) · totp.disable · admin:12    · 3f2a…9c1 · Success
- 2026-07-08 11:58:02Z · sam@periscope.local (Support)     · business.view· biz-cedarpark· a1c4…70b · Success
- 2026-07-08 11:40:55Z · sam@periscope.local (Support)     · dashboard.view· —          · 6e21…aa9 · 403 Forbidden (danger)
- 2026-07-08 10:12:30Z · ada@periscope.local (Super Admin) · auth.login    · self        · 0c77…8b3 · Success
Action pills colored by category; failed/forbidden rows show a danger-tinted result pill.

Row click opens a right-side drawer with the full event JSON (pretty-printed, monospace),
including the correlationId, IP, user agent, and before/after where relevant.

Include a skeleton-loading state.
```

### 3.12 — System health / monitoring

```
Design the SYSTEM HEALTH screen for Periscope (clean light-enterprise theme: #F7F8FA, white
cards, indigo #4F46E5, Inter, tabular numerals). Use the app shell. Super-admin only.

HEADER: title "System Health", overall status pill (show "Degraded" in amber), auto-refresh
toggle, "last checked 5s ago".

STATUS GRID: one card per product API plus the Periscope gateway. Each card: name + colored dot,
big status label, and metrics (Uptime, Avg latency, Error rate, Failed payments). Real data:
- Periscope Gateway — Healthy — 99.98% · 38ms · 0.01%
- Estate    — Healthy  — 99.95% · 142ms · 0.2% · 3 failed payments
- Logistics — Healthy  — 99.97% · 148ms · 0.1% · 5 failed payments
- School    — Healthy  — 99.99% · 130ms · 0.0%
- esusu     — Healthy  — 99.90% · 121ms · 0.3%
- Hospital  — DOWN     — show red: "Unreachable · last seen 6m ago" with a "Retry" button
  (this drives the dashboard's degraded banner)

LATENCY CHART: a wide card "Response time (last 60 min)" with a multi-line chart per product
(product color dots in legend), y-axis in ms.

ACTIVE ALERTS panel: a list of alerts — e.g. "Hospital API unreachable" (critical, red, 6m),
"Logistics failed payments above threshold" (warning, amber, 22m) — each with acknowledge/mute
actions.
```

### 3.13 — Admin & roles management

```
Design the ADMINS & ROLES settings screen for Periscope (clean light-enterprise theme: #F7F8FA,
white cards, indigo #4F46E5, Inter). Use the app shell. Super-admin only. These are Periscope
internal operators, secured with password + TOTP.

TABS: "Admins" (active) and "Roles & permissions".

ADMINS TAB:
- Header: "Team members" + an "Invite admin" primary button.
- Table columns: Admin (avatar + name + email), Role (chip), 2FA (green "Enabled" check or grey
  "Not set"), Status (Active/Deactivated), Last login. Sample rows:
  • Ada Okafor   · ada@periscope.local   · Super Admin · 2FA Enabled  · Active      · 2m ago
  • Sam Peters   · sam@periscope.local   · Support     · 2FA Enabled  · Active      · 1h ago
  • Zoe Martins  · zoe@periscope.local   · Sales       · 2FA Not set  · Active      · 3d ago
  • Ken Idowu    · ken@periscope.local   · Support     · 2FA Enabled  · Deactivated · 40d ago
- Row ⋯ menu: Edit role, Reset password, Deactivate, Remove.

ROLES & PERMISSIONS TAB:
- A permission MATRIX: rows = the 13 permissions (business.read, business.write, business.delete,
  user.read, user.write, billing.read, billing.write, subscription.read, customer.read,
  support.read, support.write, system.read, system.write); columns = roles (Super Admin,
  Support, Sales). Cells show a green check or a grey dash.
  • Super Admin: all checked.
  • Support: business.read, user.read, support.read, support.write checked; rest dashed.
  • Sales: business.read, subscription.read, billing.read, customer.read checked; rest dashed.
- Group permissions by resource with subheadings (Business, Users, Billing, Subscriptions,
  Customers, Support, System).
```

### 3.14 — Notifications & alerts

```
Design the NOTIFICATIONS screen for Periscope (clean light-enterprise theme: #F7F8FA, white
cards, indigo #4F46E5, Inter). Use the app shell.

Two-part layout:
- FEED (left/main): title "Notifications" with tabs (All / Unread / Mentions) and a "Mark all
  read" ghost action. A vertically grouped feed (Today / Yesterday / Earlier) of items, each:
  a category icon in a tinted circle, title, one-line detail, relative time, and unread dot.
  Samples:
  • [Critical] "Hospital API unreachable" — health check failed 6 minutes ago · 6m (red)
  • [Billing]  "Failed payment — Northgate Schools" — $3,400 card_declined · 22m (amber)
  • [Business] "New business signed up — Unity Esusu Co-op" — esusu · Starter · 2h
  • [Security] "TOTP disabled for ada@periscope.local" — step-up verified · 5h
- RULES (right, ~360px): title "Alert rules" with toggle rows: "System health changes",
  "Failed payments over $1,000", "New business signups", "Security events (2FA, logins)", each
  with channel chips (In-app, Email, Slack) and an on/off switch.

Also design the top-bar notification DROPDOWN (a compact 360px panel version of the feed with
the 5 most recent items and a "View all" footer link).
```

### 3.15 — Settings / Security

```
Design the SETTINGS → SECURITY screen for Periscope (clean light-enterprise theme: #F7F8FA,
white cards, indigo #4F46E5, Inter). Use the app shell. This is the signed-in admin's own
account (any role).

Left sub-nav within Settings: Profile, Security (active), Notifications, Admins (super-admin only).

SECURITY CONTENT (stacked white cards):
1) PROFILE card: avatar with change button, name "Ada Okafor", email "ada@periscope.local"
   (read-only), role chip "Super Admin".
2) PASSWORD card: "Change password" with current/new/confirm fields and a "Update password"
   button; a muted "Last changed 3 months ago".
3) TWO-FACTOR card (show the ENABLED state): a green "Enabled" pill, text "Authenticator app
   added on 12 Jun 2026", a "View recovery codes" secondary button, and a destructive
   "Disable two-factor" button. Clicking Disable opens a STEP-UP modal: "Confirm it's you —
   enter your current 6-digit code to disable two-factor", a 6-box code input, and a red
   "Disable" button. (Also mention an alternate DISABLED state where this card instead shows a
   "Set up two-factor" primary button leading to screen 3.3.)
4) ACTIVE SESSIONS card: a table of trusted devices — Device (Chrome on macOS), Location, IP,
   Last active, with a "Revoke" action per row and a "Sign out everywhere" button. Sample:
   • Chrome · macOS · Lagos, NG · 102.89.x.x · Current session
   • Safari · iPhone · Lagos, NG · 102.89.x.x · 2d ago
```

### 3.16 — Shared states (empty / loading / error / 403)

```
Design a set of reusable STATE screens for the Periscope internal ops dashboard (clean
light-enterprise theme: #F7F8FA, white cards, indigo #4F46E5, Inter), each centered inside the
app shell content area with an illustration/icon, title, description, and action:

1) EMPTY — a soft indigo line-icon, "Nothing here yet", muted description, and a primary action
   button (e.g. "Add filter" / "Invite admin"). Neutral and friendly.

2) SKELETON LOADING — the dashboard/table layout rendered as shimmering grey placeholder blocks
   (cards, chart area, and 6 table rows). No text.

3) ERROR (gateway) — a danger-tinted icon, "Something went wrong", description
   "We couldn't load this data. A downstream product API returned an error.", a monospace
   detail line "code: BAD_GATEWAY · correlationId: 3f2a-9c1b-77ad" (copyable), and a "Retry"
   primary button plus a "Copy correlation ID" ghost button. (Mirrors the API error envelope
   { error: { code, message, correlationId } }.)

4) 403 FORBIDDEN — a lock icon, "You don't have access to this", description "Your role
   (Support) doesn't include the permission required for this page (system.read). Contact a
   super-admin if you need access.", and a "Back to Businesses" button. This is what support/
   sales see when opening Dashboard, Revenue, System Health, or Audit Log.
```

---

## Section 4 — Responsive & mobile

```
Adapt the Periscope dashboard for tablet and mobile (keep the clean light-enterprise theme:
#F7F8FA, white cards, indigo #4F46E5, Inter). Rules:

- BELOW 1024px: collapse the 240px sidebar into a hamburger that opens it as a left drawer over
  a scrim. Top bar keeps search (as an icon that expands) and the user/notifications icons.
- KPI grid: 4 columns → 2 columns (tablet) → 1 column (mobile), cards stack full-width.
- Charts stay full-width, reduce height; legends wrap.
- Data tables → on mobile become stacked "record cards": each row becomes a card with the
  primary label on top and the other columns as label/value pairs; filters collapse into a
  bottom-sheet "Filters" button.
```

```
Design the MOBILE EXECUTIVE DASHBOARD for Periscope (390px width, clean light-enterprise theme,
indigo #4F46E5, Inter): a top app bar (hamburger, "Dashboard", notifications bell), a degraded
system-health banner, a single-column stack of KPI cards (MRR $120,000 ▲6.4%, Businesses 200/180
active, Users 12,000, Failed payments 8), a full-width MRR area chart, and a vertical list of
per-product rows (Estate/Logistics/School/esusu healthy, Hospital unavailable greyed). Bottom
safe-area padding.
```

```
Design the MOBILE BUSINESS DETAIL for Periscope (390px width, clean light-enterprise theme):
back chevron + "CedarPark Estate" title, an Active status pill and app chips [Estate][Logistics],
a 2x2 KPI grid (MRR $2,000, Users 114, Apps 2, Since Nov 2025), then an "Application usage"
section as stacked cards (Estate — Growth · $1,200 · 84 users; Logistics — Pro · $800 · 30 users),
and a sticky bottom bar with a "View revenue" primary button.
```

---

## Section 5 — Iteration & refinement snippets

Paste any of these as a follow-up on the currently selected screen in Stitch:

```
Increase information density: reduce card padding to 16px, table row height to 40px, and tighten
vertical spacing. Keep the same colors and typography.
```
```
Add a compact date-range comparison to each KPI card: show the previous-period value in muted
text under the delta chip.
```
```
Replace the plain metric with a chart: turn the "MRR trend" card into a stacked area chart split
by product (Estate, Logistics, School, esusu, Hospital) with a legend of colored dots.
```
```
Make the status system clearer: use pill badges with a leading dot — green for active/healthy,
amber for suspended/degraded, red for inactive/down — and ensure WCAG AA contrast on text.
```
```
Strengthen the empty and loading states for this screen: add a skeleton-loading variant and a
friendly empty variant with a primary call-to-action.
```
```
Produce a DARK MODE variant of this screen: background #0B0F14, surfaces #141A22 with 1px
#1F2833 borders, text #E5E7EB / #94A3B8, keep indigo #6366F1 as primary, and map the same
semantic status colors. Keep layout identical.
```
```
Tighten the theme to match Stripe/Linear: flatter shadows, thinner 1px borders, more whitespace,
and slightly smaller body text (13px). Keep indigo #4F46E5 as the only accent.
```

---

## Section 6 — Export & handoff

- In Stitch, use **Export to Figma** to hand the screens to a designer, or **Copy code** to pull
  the generated front-end (HTML + Tailwind) for reference.
- The tokens in Section 1 (colors, type scale, radii, spacing) are chosen to translate directly
  into CSS variables / a Tailwind theme in the **separate React dashboard repo** that consumes
  the Periscope API — reuse them there so design and implementation stay in sync.
- Keep field names and sample values aligned with the API contract
  (`README.md`, `src/gateway/contract.ts`): dashboard KPIs, business list/detail shapes, roles &
  the 13 permissions, and the `{ error: { code, message, correlationId } }` envelope.

---

### Quick screen index

| # | Screen | Primary role(s) | API source |
|---|--------|-----------------|------------|
| 3.1 | Login | all | `POST /auth/login` |
| 3.2 | Two-factor verify | all | `POST /auth/login/totp` |
| 3.3 | Two-factor enrolment | all | `POST /auth/totp/setup` |
| 3.4 | Recovery codes | all | `POST /auth/totp/enable` |
| 3.5 | Executive Dashboard | super-admin | `GET /internal/dashboard` |
| 3.6 | Businesses list | all | `GET /internal/businesses` |
| 3.7 | Business detail | all | `GET /internal/businesses/:id` |
| 3.8 | Revenue & Subscriptions | super-admin, sales | roadmap |
| 3.9 | Users (cross-app) | all | roadmap |
| 3.10 | Support tickets | support | roadmap |
| 3.11 | Audit log | super-admin | roadmap |
| 3.12 | System health | super-admin | roadmap (from dashboard health) |
| 3.13 | Admins & roles | super-admin | `src/auth/permissions.ts` |
| 3.14 | Notifications & alerts | all | roadmap |
| 3.15 | Settings / Security | all | `POST /auth/totp/disable` (step-up) |
| 3.16 | Shared states | all | error envelope / RBAC |
