# Design Spec: Lookup Tables for Enum Values

**Date:** 2026-06-04
**Status:** Approved

---

## Problem

Enum values for interview rounds, candidate statuses, interview types, and interview statuses are hardcoded in MongoDB schemas and scattered across frontend components as inline label/color maps. Adding a new interview round or renaming a status requires code changes in multiple files on both backend and frontend.

Additionally, 4 frontend locations display raw enum strings (`"first"`, `"second"`, `"third"`) instead of human-readable labels because there is no single source of truth for display names.

---

## Goal

Replace hardcoded enums with four separate backend collections that act as lookup tables. Each collection stores a `systemName` (the stored value, never changes), a `displayName` (shown in UI, editable by admins), an `order`, a `color`, and an `isActive` flag. The frontend fetches these tables and uses them everywhere — dropdowns, tags, pipeline steps, and history logs.

Adding a new interview round = one API call. No code change required.

---

## Backend

### New Collections

Four separate collections, each with the same document shape:

```js
{
  _id: ObjectId,
  systemName: String,   // stored value in other collections — never changes
  displayName: String,  // human-readable label shown in UI
  order: Number,        // controls sort order in dropdowns and pipeline steps
  color: String,        // Ant Design tag color token (e.g. "blue", "purple", "green")
  isActive: Boolean,    // soft-delete — deactivated values hidden in dropdowns but old records stay valid
  createdAt: Date,
  updatedAt: Date,
}
```

**Collections:**
- `interview_rounds` — Model: `InterviewRound.js`
- `candidate_statuses` — Model: `CandidateStatus.js`
- `interview_types` — Model: `InterviewType.js`
- `interview_statuses` — Model: `InterviewStatus.js`

### Seed Data

**interview_rounds:**
| systemName | displayName | order | color |
|---|---|---|---|
| first | First Interview | 1 | blue |
| second | Second Interview | 2 | purple |
| third | Third Interview | 3 | volcano |

**candidate_statuses:**
| systemName | displayName | order | color |
|---|---|---|---|
| shortlisted | Shortlisted | 1 | default |
| assessment | Assessment | 2 | orange |
| first | First Interview | 3 | blue |
| second | Second Interview | 4 | purple |
| third | Third Interview | 5 | volcano |
| offered | Offered | 6 | gold |
| hired | Hired | 7 | green |
| rejected | Rejected | 8 | red |

**interview_types:**
| systemName | displayName | order |
|---|---|---|
| video | Video Call | 1 |
| in-person | In Person | 2 |

**interview_statuses:**
| systemName | displayName | order | color |
|---|---|---|---|
| draft | Draft | 1 | default |
| scheduled | Scheduled | 2 | blue |
| completed | Completed | 3 | green |
| cancelled | Cancelled | 4 | orange |
| failed | Failed | 5 | red |

### Schema Changes

Remove `enum` constraints from:
- `Interview.InterviewRound` — was `enum: ["first", "second", "third"]`, now plain `String`
- `Interview.status` — was `enum: ["draft", "scheduled", "cancelled", "completed", "failed"]`, now plain `String`
- `Interview.type` — was `enum: ["in-person", "video"]`, now plain `String`
- `Candidate.status` — was a hardcoded enum, now plain `String`

**No data migration required.** Existing stored values (`"first"`, `"second"`, etc.) remain valid — the lookup collections are the new authority for what values are valid.

### APIs

Each collection gets the same 4 routes. Example for interview rounds:

```
GET    /api/interview-rounds           → all active rounds, sorted by order
POST   /api/interview-rounds           → create new round (admin only)
PUT    /api/interview-rounds/:id       → update displayName / color / order
DELETE /api/interview-rounds/:id       → soft-delete (sets isActive: false)
```

Same pattern for:
- `/api/candidate-statuses`
- `/api/interview-types`
- `/api/interview-statuses`

**GET response shape:**
```json
[
  { "_id": "...", "systemName": "first", "displayName": "First Interview", "order": 1, "color": "blue", "isActive": true }
]
```

---

## Frontend

### New Module: `client/src/modules/lookup/`

**Files:**
- `lib/api/lookup.api.ts` — one fetch function per collection
- `lib/queries/lookup.queries.ts` — four React Query hooks
- `types/lookup.types.ts` — shared `LookupValue` interface

**`LookupValue` type:**
```ts
interface LookupValue {
  _id: string
  systemName: string
  displayName: string
  order: number
  color?: string
  isActive: boolean
}
```

**Hooks:**
```ts
useInterviewRounds()     // → LookupValue[]
useCandidateStatuses()   // → LookupValue[]
useInterviewTypes()      // → LookupValue[]
useInterviewStatuses()   // → LookupValue[]
```

All four hooks use `staleTime: Infinity` — lookup data rarely changes, no need to refetch on every mount.

**Shared utilities** (`client/src/shared/utils/lookup.ts`):
```ts
getLookupLabel(values: LookupValue[], systemName: string): string
// returns displayName, falls back to systemName if not found

getLookupColor(values: LookupValue[], systemName: string): string
// returns color, falls back to "default"
```

### Component Migration

All hardcoded inline maps and raw string displays are replaced with hook data:

| File | Change |
|---|---|
| `candidates/components/CandidateProgress.tsx` | Replace `labelMap` with `useCandidateStatuses()`. Pipeline steps rendered dynamically from hook data. |
| `candidates/components/CandidateTable.tsx` | Replace inline `labelMap` + `colorMap` with `useCandidateStatuses()` |
| `candidates/components/CandidateHistory.tsx` | Replace raw `interviewRound` string with `getLookupLabel(interviewRounds, round)` |
| `interviews/components/InterviewList.tsx` | Replace `capitalize + " Interview"` + `getRoundColor()` with hook data |
| `interviews/components/InterviewCalendar.tsx` | Replace raw `InterviewRound` string with `getLookupLabel()` |
| `interviews/components/InterviewSchedule.tsx` | Replace hardcoded `<Select.Option>` children with dynamic render from `useInterviewRounds()` |
| `dashboard/ListOfCandidatesWithStatus.tsx` | Replace raw `InterviewRound` string with `getLookupLabel()` |

### Admin UI

**New page:** `client/src/modules/settings/` (new module)

**Route:** `/dashboard/settings/lookup-values`

**Features:**
- Tabs per category: Interview Rounds / Candidate Statuses / Interview Types / Interview Statuses
- Table showing systemName, displayName, order, color, isActive per tab
- Add new value (systemName + displayName + order + color)
- Edit displayName, color, order inline
- Deactivate (soft-delete) — hides from dropdowns, old records unaffected
- Cannot delete or edit systemName — it is the stored identifier

---

## Out of Scope

- Making `systemName` editable (would break existing stored data)
- Inter-collection dependencies (e.g. when a candidateStatus is deactivated, blocking new candidates from reaching it) — future work
- Role-based access on the admin UI — covered by existing RBAC on this branch

---

## Testing

- Verify GET endpoints return active values sorted by order
- Add a new interview round via POST, confirm it appears in the InterviewSchedule dropdown
- Deactivate a round, confirm it disappears from dropdowns but existing interviews still display correctly
- Verify all 7 migrated components display `displayName` not `systemName`
- Verify `getLookupLabel` falls back to `systemName` when value not found
