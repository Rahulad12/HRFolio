# Dashboard UI Enhancement — Design Spec

**Date:** 2026-06-04
**Branch:** feature/32-rbac-implementation (to be implemented on a dedicated feature branch)
**Scope:** Full visual overhaul of `client/src/modules/dashboard/` — UI layer only, no API or data model changes.

---

## Goal

Replace the current basic dashboard with a production-quality, dark-analytics-styled interface. Primary audience is HR/Recruiter (daily operational use) and Manager/Admin (pipeline health overview). The redesigned dashboard must:

1. Give instant operational context at the top (KPIs + trends)
2. Show the full candidate pipeline visually (Kanban)
3. Surface analytics and activity below (charts + interviews + feed)
4. Fully respond to light/dark mode toggle via the existing Zustand `theme.store`

---

## Design Direction

**Style:** Dark Analytics — dark slate backgrounds (`#0f172a` / `#1e293b`), vivid accent colors per entity type, bold numbers, minimal borders. Mirrors a modern SaaS product dashboard.

**Theme behaviour:** All components use Ant Design `ConfigProvider` token overrides for dark/light switching plus Tailwind `dark:` variants for any custom classes. No separate stylesheet — one component, both modes.

**Animations:** Existing Framer Motion stagger pattern is retained (container with `staggerChildren: 0.1`, item with `y: 20 → 0` + opacity fade).

**Color palette (dark mode base):**

| Token | Hex | Usage |
|-------|-----|-------|
| bg-base | `#0f172a` | Page background, card inner backgrounds |
| bg-surface | `#1e293b` | Card surfaces, Kanban column wrappers |
| border | `#334155` | Subtle card borders |
| text-primary | `#f1f5f9` | Headings, bold numbers |
| text-secondary | `#94a3b8` | Labels, secondary text |
| text-muted | `#475569` | Timestamps, helper text |
| accent-indigo | `#6366f1` | Candidates / Shortlisted |
| accent-amber | `#f59e0b` | Assignments / Assessment |
| accent-blue | `#3b82f6` | Interviews |
| accent-green | `#22c55e` | Offers / Hired |
| accent-orange | `#f97316` | Offered stage |
| accent-red | `#ef4444` | Rejected |

---

## Layout — 3-Zone Structure

```
┌─────────────────────────────────────────────────┐
│  Zone 1: KPI Metric Cards (4-column grid)       │
├─────────────────────────────────────────────────┤
│  Zone 2: Kanban Pipeline (full width, scrollable│
├─────────────────────────────────────────────────┤
│  Zone 3: Analytics Grid                         │
│  [Tech Bar] [Level Donut] [Hired vs Rejected]   │
│  [Upcoming Interviews (2/3)] [Activity (1/3)]   │
└─────────────────────────────────────────────────┘
```

The three zones are separated by `mb-4` spacing. Each zone is a Framer Motion animated container.

---

## Zone 1 — KPI Metric Cards

**Component:** `MetricsCard.tsx` (refactor existing)

Four cards in a responsive 4-column grid (`grid-cols-2 md:grid-cols-4`), each containing:

| Element | Detail |
|---------|--------|
| Label | Uppercase, small, `text-secondary` |
| Value | Large bold number (`text-3xl font-extrabold text-primary`) |
| Trend badge | Pill badge: green `↑ X%` for positive, amber `● N pending` for neutral, red `↓` for negative |
| Context label | `vs last week` in `text-muted` |
| Icon | Rounded square with 15% opacity tinted background, Lucide icon in accent color |
| Sparkline | 7-bar mini bar chart (last 7 days), bars darkening toward the current value. Rendered as inline SVG (no Chart.js — lightweight, no registration overhead) |

Card style: `bg-surface`, `rounded-xl`, `border border-[#334155]`, no top border accent. Clicking a card navigates to the module page (existing behavior retained).

**Cards:**
1. Active Candidates — indigo accent, `↑ X%` trend
2. Active Assignments — amber accent, `● N pending`
3. Scheduled Interviews — blue accent, `N today`
4. Offers Sent — green accent, `↑ N new`

---

## Zone 2 — Kanban Pipeline

**Component:** `ListOfCandidatesWithStatus.tsx` (refactor existing)

Full-width card (`bg-surface rounded-xl border`) with:

### Header bar
- Title: "Hiring Pipeline" (`text-primary font-semibold`)
- Right side: Search input + Date Range picker (existing filters, restyled with dark Ant Design tokens)

### Kanban columns

Horizontally scrollable container (`overflow-x-auto`, `flex gap-3`). One column per status stage:

**Stages (in order):** Shortlisted → Assessment → First Interview → Second Interview → Third Interview → Offered → Hired → Rejected

Each column:
- Background: `bg-base` (`#0f172a`), `rounded-lg`, `border border-[#1e293b]`, `p-2`, `min-w-[160px] flex-1`
- **No top border accent** — color identity carried by header text color and count badge only
- Header row: colored stage label (left) + colored count badge (right)
- Candidate cards: stacked below, `bg-surface rounded-md p-2 mb-1.5`, showing:
  - Candidate name (`text-primary text-xs font-semibold`)
  - Tech tag (colored pill matching stage accent) + Level badge (neutral dark pill)
- `+N more` label when count exceeds 2 visible cards
- Rejected column: `opacity-70` to visually de-emphasize

**Candidate card click:** navigates to candidate detail page (existing behavior).

---

## Zone 3 — Analytics Grid

### Row 1: Three charts (equal 3-column grid, `grid-cols-1 md:grid-cols-3 gap-4`)

**1. Tech Distribution (`CandidateByTechnology.tsx` + `BarGraph.tsx`)**
- Horizontal bar chart (Chart.js)
- Bars: indigo gradient (`#6366f1` → `#818cf8`)
- Background: `#0f172a`, grid lines: `#1e293b`
- Labels on y-axis, count inside bar end

**2. Level Distribution (`CandidateLevelDistribution.tsx` + `PieChart.tsx`)**
- Donut chart (Chart.js, `cutout: '65%'`)
- Colors: Senior = indigo, Mid = amber, Junior = green
- Center label: total count + "total"
- Legend beside (right of donut): color square + label + percentage

**3. Hired vs Rejected (`HiredandRejectedCorelation.tsx` + `LineGraph.tsx`)**
- Area line chart (Chart.js `fill: true`)
- Hired: green line + 15% opacity green fill area
- Rejected: red line + 15% opacity red fill area
- X-axis: last 7 day labels (M T W T F S S)
- Legend: two inline pill labels top-right

All three charts share these Chart.js global overrides:
- `backgroundColor: 'transparent'`
- `color: '#94a3b8'` (axis labels)
- `grid.color: '#1e293b'`
- `plugins.legend.display: false` (custom legends only)

### Row 2: Two panels (2/3 + 1/3 grid)

**4. Upcoming Interviews (`UpcomingInterviews.tsx`) — 2/3 width**
- Card list, each row: avatar initials circle (colored bg per level) + candidate name + interviewer name + time (amber) + level badge
- Today / This Week toggle (styled as pill tabs)
- "View all interviews →" link in indigo at bottom right

**5. Recent Activity Feed (`RecentActivityLog.tsx`) — 1/3 width**
- Timeline layout: icon circle (entity-colored, 20% opacity bg) + connecting vertical line between items
- Each item: action text with entity name highlighted in accent color + timestamp in `text-muted`
- Entity color map: candidates=indigo, interviews=blue, assessments=amber, offers=green
- 4–5 items visible, no pagination visible on dashboard (full log accessible via separate page)

---

## Component File Map

| File | Change type |
|------|-------------|
| `dashboard/components/MetricsCard.tsx` | Refactor — add sparkline, trend badge, new styling |
| `dashboard/components/ListOfCandidatesWithStatus.tsx` | Refactor — replace horizontal list with Kanban columns |
| `dashboard/components/BarGraph.tsx` | Update — dark theme Chart.js config |
| `dashboard/components/PieChart.tsx` | Update — donut style, dark theme config |
| `dashboard/components/LineGraph.tsx` | Update — area fill, dark theme config |
| `dashboard/components/CandidateByTechnology.tsx` | Minor — pass updated chart config |
| `dashboard/components/CandidateLevelDistribution.tsx` | Minor — donut cutout, custom legend |
| `dashboard/components/HiredandRejectedCorelation.tsx` | Minor — area fill, legend pills |
| `dashboard/components/UpcomingInterviews.tsx` | Refactor — avatar initials, level badge, pill toggle |
| `dashboard/components/RecentActivityLog.tsx` | Refactor — timeline layout with connecting line |
| `dashboard/page.tsx` | Update — new 3-zone grid layout, Framer Motion wrappers |

No changes to: API files, query files, types, schemas, routes, or any non-dashboard module.

---

## Theme Compatibility

All color values are expressed as Tailwind classes with `dark:` variants or as CSS variables resolved by Ant Design's `ConfigProvider`. The Zustand `theme.store` drives the `<ConfigProvider theme={...}>` already in place — no new wiring needed.

Light mode counterparts:
- `bg-base` → `#f8fafc`
- `bg-surface` → `#ffffff`
- `border` → `#e2e8f0`
- `text-primary` → `#0f172a`
- Accent colors remain the same (vivid on both modes)

---

## Out of Scope

- Drag-and-drop between Kanban columns (read-only view)
- New API endpoints or data queries
- Changes to any non-dashboard module
- Mobile-specific layout (responsive grid collapses to single column naturally)
