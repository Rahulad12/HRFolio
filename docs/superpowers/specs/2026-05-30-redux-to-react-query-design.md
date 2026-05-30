# Redux → React Query + Module Restructure Design

**Date:** 2026-05-30
**Author:** Agent
**Status:** Approved

---

## 1. Goals

- Replace Redux Toolkit (RTK Query + slices) with TanStack React Query for all server state
- Restructure flat `src/` into feature-based modules per `.agents/rules/module-structure.md`
- Migrate auth to React Context, UI state to Zustand
- Add Zod schemas for form validation
- Add axios HTTP layer with `ApiError` normalization
- Remove `@reduxjs/toolkit` and `react-redux` from dependencies

## 2. Module Layout

```
client/src/
├── shared/
│   ├── lib/
│   │   ├── axios.ts              ApiError + GET/POST/PUT/PATCH/DELETE helpers
│   │   └── query-client.ts       QueryClient singleton
│   ├── hooks/
│   │   └── useAuth.tsx           AuthContext + AuthProvider + useAuth hook
│   ├── store/                    Zustand stores
│   │   ├── theme.store.ts
│   │   ├── sidebar.store.ts
│   │   ├── search.store.ts
│   │   └── button.store.ts
│   ├── constants/
│   │   └── api.ts                API_BASE_URL, endpoint constants
│   ├── types/
│   │   └── index.ts              Shared types (globalResponse, etc.)
│   ├── utils/
│   │   └── TextAlter.ts
│   └── components/               Shared UI (Layout, Header, Sidebar, Table, etc.)
│       ├── layout/
│       ├── ui/button/
│       ├── Charts/
│       └── common/
├── modules/
│   ├── auth/
│   │   ├── index.ts
│   │   ├── pages/
│   │   │   ├── login-page.tsx
│   │   │   └── welcome-back-page.tsx
│   │   ├── components/
│   │   │   ├── GoogleLoginButton.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── lib/
│   │   │   ├── api/auth.api.ts
│   │   │   ├── queries/auth.queries.ts
│   │   │   └── mutations/auth.mutations.ts
│   │   ├── types/auth.types.ts
│   │   └── routes/auth.routes.tsx
│   ├── candidates/
│   │   ├── index.ts
│   │   ├── pages/
│   │   │   ├── list-page.tsx
│   │   │   ├── detail-page.tsx
│   │   │   └── form-page.tsx
│   │   ├── components/
│   │   │   ├── CandidateHistory.tsx
│   │   │   ├── CandidateInfo.tsx
│   │   │   ├── CandidateQuickAction.tsx
│   │   │   └── CandidateTimeLine.tsx
│   │   ├── lib/
│   │   │   ├── api/candidate.api.ts
│   │   │   ├── queries/candidate.queries.ts
│   │   │   └── mutations/candidate.mutations.ts
│   │   ├── types/candidate.types.ts
│   │   ├── schemas/candidate.schema.ts
│   │   └── routes/candidate.routes.tsx
│   ├── interviews/
│   │   ├── index.ts
│   │   ├── pages/
│   │   │   ├── list-page.tsx
│   │   │   ├── schedule-page.tsx
│   │   │   ├── calendar-page.tsx
│   │   │   ├── interviewer-list-page.tsx
│   │   │   └── interviewer-form-page.tsx
│   │   ├── components/
│   │   │   ├── InterviewDetailsModal.tsx
│   │   │   └── InterviewListView.tsx
│   │   ├── lib/
│   │   │   ├── api/interview.api.ts
│   │   │   ├── api/interviewer.api.ts
│   │   │   ├── queries/interview.queries.ts
│   │   │   └── mutations/interview.mutations.ts
│   │   ├── types/interview.types.ts
│   │   ├── schemas/interview.schema.ts
│   │   └── routes/interview.routes.tsx
│   ├── assessments/
│   │   ├── index.ts
│   │   ├── pages/
│   │   │   ├── list-page.tsx
│   │   │   ├── form-page.tsx
│   │   │   ├── assign-page.tsx
│   │   │   └── assignment-list-page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api/assessment.api.ts
│   │   │   ├── queries/assessment.queries.ts
│   │   │   └── mutations/assessment.mutations.ts
│   │   ├── types/assessment.types.ts
│   │   ├── schemas/assessment.schema.ts
│   │   └── routes/assessment.routes.tsx
│   ├── offers/
│   │   ├── index.ts
│   │   ├── pages/
│   │   │   ├── list-page.tsx
│   │   │   └── form-page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api/offer.api.ts
│   │   │   ├── queries/offer.queries.ts
│   │   │   └── mutations/offer.mutations.ts
│   │   ├── types/offer.types.ts
│   │   ├── schemas/offer.schema.ts
│   │   └── routes/offer.routes.tsx
│   ├── emails/
│   │   ├── index.ts
│   │   ├── pages/
│   │   │   ├── list-page.tsx
│   │   │   ├── form-page.tsx
│   │   │   └── general-email-page.tsx
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api/email.api.ts
│   │   │   ├── queries/email.queries.ts
│   │   │   └── mutations/email.mutations.ts
│   │   ├── types/email.types.ts
│   │   ├── schemas/email.schema.ts
│   │   └── routes/email.routes.tsx
│   ├── dashboard/
│   │   ├── index.ts
│   │   ├── pages/dashboard-page.tsx
│   │   ├── components/
│   │   │   ├── CandidateByTechnology.tsx
│   │   │   ├── CandidateLevelDistribution.tsx
│   │   │   ├── HiredandRejectedCorelation.tsx
│   │   │   ├── ListOfCandidatesWithStatus.tsx
│   │   │   ├── MetricsCard.tsx
│   │   │   ├── RecentActivitiesLog.tsx
│   │   │   └── UpComingInterviews.tsx
│   │   ├── types/dashboard.types.ts
│   │   └── routes/dashboard.routes.tsx
│   └── landing/
│       ├── index.ts
│       ├── pages/landing-page.tsx
│       ├── components/
│       │   ├── Hero.tsx
│       │   ├── Feature.tsx
│       │   ├── Benefits.tsx
│       │   ├── Testimonials.tsx
│       │   ├── Footer.tsx
│       │   ├── Header.tsx
│       │   └── LandingPageLayout.tsx
│       └── routes/landing.routes.tsx
├── routes/
│   ├── MainRoutes.tsx
│   ├── Protected.tsx
│   └── Public.tsx
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

## 3. Data Flow

### API Layer (axios + ApiError)

```
shared/lib/axios.ts
  ├── ApiError class (status, message, errors)
  ├── axios instance with interceptor:
  │   ├── Request: attach Authorization header from localStorage
  │   └── Response/Error: normalize to ApiError, 401→logout
  └── GET<T>, POST<T>, PUT<T>, PATCH<T>, DELETE<T> helpers
```

### Auth (React Context)

```
<AuthProvider> (wraps App)
  ├── Reads token/user from localStorage on mount
  ├── Exposes: user, token, isAuthenticated, isLoading, login(), logout()
  ├── login(): stores token in localStorage, updates state
  └── logout(): clears localStorage, resets state, redirects to login
```

### Server State (React Query)

```
modules/<name>/lib/api/<name>.api.ts   → raw axios calls
modules/<name>/lib/queries/<name>.queries.ts  → queryOptions()
modules/<name>/lib/mutations/<name>.mutations.ts → mutationOptions()

// Consumption in pages:
useQuery(candidateListOptions(filters))
useMutation(createCandidateMutation)
```

### UI State (Zustand)

```
theme.store.ts      → mode, setThemeMode, toggleThemeMode (persisted to localStorage)
sidebar.store.ts    → collapsed, toggle
search.store.ts     → text, status, setSearch (candidate filter state)
button.store.ts     → text, icon, onClick, disabled, loading (header button)
```

## 4. Form Validation (Zod)

Each form-heavy module gets a schema file:

```ts
// modules/candidates/schemas/candidate.schema.ts
export const candidateFormSchema = z.object({ ... })
export type CandidateFormData = z.infer<typeof candidateFormSchema>
export const candidateFormDefaults = { ... }
```

Schemas used with Ant Design's `useForm` + manual validation (no react-hook-form per existing pattern).

## 5. Route Structure

`routes/` imports from module barrels:

```tsx
import { authRoutes } from '@/modules/auth/routes/auth.routes'
import { candidateRoutes } from '@/modules/candidates/routes/candidate.routes'
import { interviewRoutes } from '@/modules/interviews/routes/interview.routes'
import { assessmentRoutes } from '@/modules/assessments/routes/assessment.routes'
import { offerRoutes } from '@/modules/offers/routes/offer.routes'
import { emailRoutes } from '@/modules/emails/routes/email.routes'
import { dashboardRoutes } from '@/modules/dashboard/routes/dashboard.routes'
import { landingRoutes } from '@/modules/landing/routes/landing.routes'
```

## 6. Dependencies

**Add:**
- `axios`
- `@tanstack/react-query`
- `@tanstack/react-query-devtools` (dev)
- `zustand`
- `zod`

**Remove:**
- `@reduxjs/toolkit`
- `react-redux`

**Config:**
- `vite.config.ts` → `resolve.alias` for `@/`
- `tsconfig.json` → `paths` for `@/*`

## 7. Files to Delete

- `src/services/*` (9 files: api.ts, activityLogs.ts, assessmentServiceApi.ts, authServiceApi.ts, candidateServiceApi.ts, emailService.ts, interviewServiceApi.ts, offerService.ts, searchService.ts, uploadFileService.ts)
- `src/slices/*` (10 files: assessmentSlices.ts, authSlices.ts, ButtonPropsSlices.ts, candidateSlices.ts, interviewSlices.ts, offerSlices.ts, searchTermsSlices.ts, setSearchSlices.ts, sideBarCollapsed.ts, themeSlices.ts)
- `src/action/*` (4 files: StoreAssessment.tsx, StoreCandidate.tsx, StoreInterview.tsx, storeOffer.tsx)
- `src/store.ts`
- `src/Hooks/hook.ts`

## 8. Migration Order

1. Shared infrastructure (axios, query-client, deps, config)
2. Zustand stores (theme, sidebar, search, button)
3. Auth module + AuthContext
4. Types split (per-module type files)
5. Zod schemas (per module)
6. API layer (per-module api/queries/mutations)
7. Module pages + components (migrate one module at a time)
8. Route updates
9. Delete legacy files
10. Update `.agents/rules/api-conventions.md`
11. Verify build + lint
