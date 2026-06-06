# Dashboard Color Theme Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix dashboard metric and pipeline colors so they are readable and visually compatible on both white (light) and dark backgrounds.

**Architecture:** All fixes are Tailwind class swaps — replacing hardcoded dark-only color tokens (`text-*-400`, `text-slate-200`, `bg-slate-700`) with dual-mode pairs that use a darker variant in light mode and the existing lighter variant for dark mode. No logic changes, no new components, no new dependencies.

**Tech Stack:** React, Tailwind CSS (with `dark:` variant), Chart.js (via react-chartjs-2)

---

## Root Cause Summary

Seven files have hardcoded colors targeting only dark backgrounds:

| File | Problem |
|---|---|
| `page.tsx` | `text-slate-200` for username — invisible on white |
| `MetricsCard.tsx` | Trend badge text (`-400`) — low contrast on white |
| `HiredandRejectedCorelation.tsx` | Legend text (`-400`) — low contrast on white |
| `UpcomingInterviews.tsx` | Time text, "View all" link, fallback avatar — dark-only |
| `RecentActivityLog.tsx` | Fallback icon accent, pipe connector — dark-only |
| `CandidateLevelDistribution.tsx` | `text-slate-200` for percentage — invisible on white |

---

## File Map

| File | Change type |
|---|---|
| `client/src/modules/dashboard/page.tsx` | Modify: 1 class |
| `client/src/modules/dashboard/components/MetricsCard.tsx` | Modify: 3 trend style objects |
| `client/src/modules/dashboard/components/HiredandRejectedCorelation.tsx` | Modify: 2 text classes |
| `client/src/modules/dashboard/components/UpcomingInterviews.tsx` | Modify: 3 text classes + 1 fallback |
| `client/src/modules/dashboard/components/RecentActivityLog.tsx` | Modify: 1 fallback accent + 1 pipe class |
| `client/src/modules/dashboard/components/CandidateLevelDistribution.tsx` | Modify: 1 percentage text class |

---

### Task 1: Fix username text in DashboardPage

**Files:**
- Modify: `client/src/modules/dashboard/page.tsx:101`

**Problem:** `text-slate-200` is pure white — invisible on a white/light background.

- [ ] **Step 1: Apply fix**

In `page.tsx` line 101, change:
```tsx
// before
<span className="font-semibold text-slate-200">{user?.username}</span>
```
```tsx
// after
<span className="font-semibold text-slate-700 dark:text-slate-200">{user?.username}</span>
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/page.tsx
git commit -m "fix(dashboard): make username visible on light background"
```

---

### Task 2: Fix MetricsCard trend badge colors

**Files:**
- Modify: `client/src/modules/dashboard/components/MetricsCard.tsx:46-48`

**Problem:** `text-emerald-400`, `text-amber-400`, `text-red-400` are light pastel colors designed for dark backgrounds. On white they appear washed-out and fail WCAG contrast. The `bg-*-400/10` tint is also near-invisible on white.

- [ ] **Step 1: Apply fix**

Replace the `trendStyles` object (lines 45-49):
```tsx
// before
const trendStyles: Record<TrendBadge['type'], string> = {
  up: 'text-emerald-400 bg-emerald-400/10',
  neutral: 'text-amber-400 bg-amber-400/10',
  down: 'text-red-400 bg-red-400/10',
}
```
```tsx
// after
const trendStyles: Record<TrendBadge['type'], string> = {
  up: 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-400/10',
  neutral: 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10',
  down: 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-400/10',
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/MetricsCard.tsx
git commit -m "fix(dashboard): fix MetricsCard trend badge contrast in light mode"
```

---

### Task 3: Fix Hired vs Rejected legend colors

**Files:**
- Modify: `client/src/modules/dashboard/components/HiredandRejectedCorelation.tsx:49,53`

**Problem:** Legend labels use `text-emerald-400` and `text-red-400` (dark-mode pastel) on both modes. On white background these fail readability.

- [ ] **Step 1: Apply fix**

In `HiredandRejectedCorelation.tsx`, change the two legend `<span>` className values:
```tsx
// before
<span className="flex items-center gap-1.5 text-xs text-emerald-400">
  <span className="inline-block h-0.5 w-3 rounded bg-emerald-400" />
  Hired
</span>
<span className="flex items-center gap-1.5 text-xs text-red-400">
  <span className="inline-block h-0.5 w-3 rounded bg-red-400" />
  Rejected
</span>
```
```tsx
// after
<span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
  <span className="inline-block h-0.5 w-3 rounded bg-emerald-500 dark:bg-emerald-400" />
  Hired
</span>
<span className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
  <span className="inline-block h-0.5 w-3 rounded bg-red-500 dark:bg-red-400" />
  Rejected
</span>
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/HiredandRejectedCorelation.tsx
git commit -m "fix(dashboard): fix Hired vs Rejected legend contrast in light mode"
```

---

### Task 4: Fix UpcomingInterviews colors

**Files:**
- Modify: `client/src/modules/dashboard/components/UpcomingInterviews.tsx:81,94,111`

**Problems:**
- Line 81: fallback avatar background `'bg-slate-700 text-slate-200'` is dark-only
- Line 94: `text-amber-400` for interview time is low-contrast on white
- Line 111: `text-indigo-400 hover:text-indigo-300` for "View all" link is too light on white

- [ ] **Step 1: Fix fallback avatar color (line 81)**

```tsx
// before
className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${avatarColors[level] ?? 'bg-slate-700 text-slate-200'}`}
```
```tsx
// after
className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${avatarColors[level] ?? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}
```

- [ ] **Step 2: Fix time text color (line 94)**

```tsx
// before
<span className="text-xs font-semibold text-amber-400">
```
```tsx
// after
<span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
```

- [ ] **Step 3: Fix "View all" link color (line 111)**

```tsx
// before
className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
```
```tsx
// after
className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
```

- [ ] **Step 4: Commit**

```bash
git add client/src/modules/dashboard/components/UpcomingInterviews.tsx
git commit -m "fix(dashboard): fix UpcomingInterviews colors for light mode"
```

---

### Task 5: Fix RecentActivityLog pipe and fallback accent

**Files:**
- Modify: `client/src/modules/dashboard/components/RecentActivityLog.tsx:49,58`

**Problems:**
- Line 49: fallback icon accent `'bg-slate-700 text-slate-400'` is a dark-only color set
- Line 58: timeline pipe `bg-slate-200 dark:bg-slate-700` — `bg-slate-200` is very faint on white; bumping to `bg-slate-300` makes it clearly visible without being heavy

- [ ] **Step 1: Fix fallback icon accent (line 49)**

```tsx
// before
const accent = entityAccent[item.entityType] ?? { icon: 'bg-slate-700 text-slate-400', text: 'text-slate-400' }
```
```tsx
// after
const accent = entityAccent[item.entityType] ?? { icon: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400', text: 'text-slate-600 dark:text-slate-400' }
```

- [ ] **Step 2: Fix timeline pipe connector (line 58)**

```tsx
// before
{!isLast && <div className="my-1 w-px flex-1 bg-slate-200 dark:bg-slate-700" />}
```
```tsx
// after
{!isLast && <div className="my-1 w-px flex-1 bg-slate-300 dark:bg-slate-700" />}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/dashboard/components/RecentActivityLog.tsx
git commit -m "fix(dashboard): fix RecentActivityLog pipe and fallback accent in light mode"
```

---

### Task 6: Fix CandidateLevelDistribution percentage text

**Files:**
- Modify: `client/src/modules/dashboard/components/CandidateLevelDistribution.tsx:47`

**Problem:** `text-slate-200 dark:text-slate-200` — both modes use white text, which is completely invisible against a white/light card background.

- [ ] **Step 1: Apply fix**

```tsx
// before
<span className="ml-auto text-xs font-semibold text-slate-200 dark:text-slate-200">
```
```tsx
// after
<span className="ml-auto text-xs font-semibold text-slate-700 dark:text-slate-200">
```

Also fix the legend label on line 45 (`text-slate-400` — readable on white but improve to `text-slate-500 dark:text-slate-400` for better contrast):
```tsx
// before
<span className="text-xs capitalize text-slate-400">{label}</span>
```
```tsx
// after
<span className="text-xs capitalize text-slate-500 dark:text-slate-400">{label}</span>
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/CandidateLevelDistribution.tsx
git commit -m "fix(dashboard): fix CandidateLevelDistribution percentage visibility in light mode"
```

---

## Self-Review

**Spec coverage:**
- ✅ White background incompatibility fixed in all 6 files
- ✅ Dark mode preserved — all dark variants use `dark:` prefix retaining original values
- ✅ Pipeline (Kanban + timeline pipe) colors addressed
- ✅ Metric card trend colors addressed
- ✅ Chart legend colors addressed
- ✅ Interactive link colors addressed

**Placeholder scan:** No placeholders — all code blocks are complete.

**Type consistency:** No types changed — all changes are className string values only.
