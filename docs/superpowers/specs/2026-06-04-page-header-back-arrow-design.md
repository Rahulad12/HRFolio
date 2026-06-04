# Design Spec: Shared PageHeader Component with Back Arrow

**Date:** 2026-06-04
**Status:** Approved

---

## Problem

The back-arrow + page title header pattern is duplicated inline across 9 detail/form pages in the client. Each implementation hardcodes its own layout, button style, and navigation path. This causes inconsistency and makes future changes to the header pattern require editing all 9 files.

---

## Goal

Extract the back-arrow + title + right-actions header into a single shared `PageHeader` component. Apply it consistently across all non-list pages.

---

## Component Design

**Location:** `client/src/shared/components/PageHeader.tsx`

**Interface:**
```ts
interface PageHeaderProps {
  title: string
  backPath: string
  rightContent?: ReactNode
}
```

**Rendered layout:**
```
┌────────────────────────────────────────────────┐
│  [←]  Page Title               [Right Content] │
└────────────────────────────────────────────────┘
```

- Back button: `<Button type="text" icon={<ArrowLeft size={18} />} onClick={() => navigate(backPath)} />`
- Title: `<Typography.Title level={3} className="!mb-0">`
- Wrapper: `flex justify-between items-center flex-wrap gap-2`
- `rightContent` is optional — pages with no actions omit it

**Navigation:** hardcoded `backPath` prop — always navigates to the explicit parent list route, not browser history.

---

## Migration

All 9 existing inline header blocks are replaced with `<PageHeader>`. List pages are untouched.

| Page | File | `backPath` |
|---|---|---|
| `CandidateDetailPage` | `candidates/page.tsx` | `/dashboard/candidates` |
| `CandidateForm` | `candidates/components/CandidateForm.tsx` | `/dashboard/candidates` |
| `CandidateSendEmail` | `candidates/components/CandidateSendEmail.tsx` | `/dashboard/candidates` |
| `AssessmentForm` | `assessments/components/AssessmentForm.tsx` | `/dashboard/assessments` |
| `AssignAssessmentForm` | `assessments/components/AssignAssessmentForm.tsx` | `/dashboard/assessments/assignments` |
| `OfferForm` | `offers/components/OfferForm.tsx` | `/dashboard/offers` |
| `InterviewerForm` | `interviewers/components/InterviewerForm.tsx` | `/dashboard/interviewers` |
| `EmailTemplateForm` | `emails/components/EmailTemplateForm.tsx` | `/dashboard/email-templates` |
| `InterviewSchedule` | `interviews/components/InterviewSchedule.tsx` | `/dashboard/interviews` |

---

## Out of Scope

- List pages (`CandidateListPage`, `InterviewListPage`, etc.) — top-level pages, no back arrow needed
- Auth, landing, dashboard root pages
- Changing navigation strategy (browser history) — out of scope per design decision
- Adding a subtitle or breadcrumb — not needed now

---

## Testing

- Manually verify back arrow navigates to the correct list page on each of the 9 pages
- Verify `rightContent` renders correctly where present and is absent where omitted
- Verify layout is consistent (title size, button style, spacing) across all pages
