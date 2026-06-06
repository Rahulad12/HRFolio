# Dashboard Module Port — Redux → React Query

**Date:** 2026-05-30
**Status:** Approved (conversational)

## Goal

Port the Dashboard page from old Redux + RTK Query architecture to React Query + Zustand, preserving all visual output and behavior exactly.

## Architecture

No cross-module imports. Dashboard creates its own API/query layer using shared axios wrapper + URL constants.

```
modules/dashboard/
├── types/dashboard.types.ts         ← DTOs for candidates, interviews, offers, assignments, activity logs
├── lib/api/dashboard.api.ts         ← fetchCandidates, fetchInterviews, fetchOffers, fetchAssignments, fetchActivityLogs
├── lib/queries/dashboard.queries.ts ← useCandidates, useInterviews, useOffers, useAssignments, useActivityLogs
├── components/
│   ├── MetricsCard.tsx              ← stat card (unchanged logic)
│   ├── ListOfCandidatesWithStatus.tsx ← 6-col candidate board (theme → Zustand)
│   ├── CandidateByTechnology.tsx    ← bar chart, receives candidates as prop
│   ├── CandidateLevelDistribution.tsx ← pie chart, receives candidates as prop
│   ├── HiredandRejectedCorelation.tsx ← line chart, receives candidates as prop
│   ├── UpcomingInterviews.tsx       ← card list (unchanged logic)
│   ├── RecentActivityLog.tsx        ← paginated activity feed, receives data as prop
│   ├── BarGraph.tsx                 ← chart.js bar wrapper (darkMode as prop)
│   ├── PieChart.tsx                 ← chart.js pie wrapper (unchanged)
│   └── LineGraph.tsx                ← chart.js line wrapper (unchanged)
├── page.tsx                         ← orchestrator: calls queries, derives metrics, composes components
└── index.ts                         ← exports DashboardPage + dashboardRoutes
```

## Data Flow

1. `page.tsx` calls 5 React Query hooks (candidates, interviews, offers, assignments, activity logs)
2. Derives derived metrics via `useMemo` (scheduled count, assessment count, offered count)
3. Filters interviews for current week, passes to UpcomingInterviews
4. Child components receive data as props — they are pure presentational
5. Theme/mode read from Zustand `useThemeStore` (not Redux)
6. Error states handled by each React Query hook — components render empty/loading accordingly

## Key Changes

| Area | Before | After |
|---|---|---|
| Candidates data | Redux `state.candidate` | `useCandidates()` query |
| Interviews data | Redux `state.interview` | `useInterviews()` query |
| Offers data | Redux `state.offer` | `useOffers()` query |
| Assignments data | Redux `state.assessments` | `useAssignments()` query |
| Activity logs | RTK Query `useGetActivityLogsQuery()` | `useActivityLogs()` query |
| Theme | Redux `state.theme.mode` | Zustand `useThemeStore(s => s.mode)` |
| Data trigger | Custom hooks `useCandidate()` etc. (dispatch thunks on mount) | React Query `useQuery` (fetches on mount automatically) |
| Loading states | `isLoading` from custom hooks | `isLoading` from React Query |

## Dependencies Added

- `dayjs` (explicit install — already a transitive dependency via antd)

## Files Ported

| Old file | New location |
|---|---|
| `pages/Dashboard.tsx` | `modules/dashboard/page.tsx` |
| `component/dashboard/MetricsCard.tsx` | `modules/dashboard/components/MetricsCard.tsx` |
| `component/dashboard/ListOfCandidatesWithStatus.tsx` | `modules/dashboard/components/ListOfCandidatesWithStatus.tsx` |
| `component/dashboard/CandidateByTechnology.tsx` | `modules/dashboard/components/CandidateByTechnology.tsx` |
| `component/dashboard/CandidateLevelDistribution.tsx` | `modules/dashboard/components/CandidateLevelDistribution.tsx` |
| `component/dashboard/HiredandRejectedCorelation.tsx` | `modules/dashboard/components/HiredandRejectedCorelation.tsx` |
| `component/dashboard/UpComingInterviews.tsx` | `modules/dashboard/components/UpcomingInterviews.tsx` |
| `component/dashboard/RecentActivitiesLog.tsx` | `modules/dashboard/components/RecentActivityLog.tsx` |
| `component/Charts/BarGraph.tsx` | `modules/dashboard/components/BarGraph.tsx` |
| `component/Charts/PieChart.tsx` | `modules/dashboard/components/PieChart.tsx` |
| `component/Charts/LineGraph.tsx` | `modules/dashboard/components/LineGraph.tsx` |
| `services/activityLogs.ts` | `modules/dashboard/lib/api/dashboard.api.ts` (merged) |
| `utils/TextAlter.ts` | `modules/dashboard/utils/dashboard.utils.ts` |
