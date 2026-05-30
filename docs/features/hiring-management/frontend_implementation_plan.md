# Frontend Implementation Plan: Hiring Management Enhancements

**Target Issues:** #36 - #39
**Status:** In Planning
**Architecture:** Modular TypeScript (React 18 / Vite / Ant Design / Redux Toolkit)
**Base Branch:** `feature/32-rbac-implementation` (or new feature branch)

---

## Overview
This plan details the frontend implementation of RBAC UI enforcement, User Management, Escalation workflows, and Audit Log viewing. All new features will be implemented in `client/src/modules/` as independent, type-safe modules.

---

## Phase 1: Authentication & Protection (#36)
### 1.1 Shared Auth Logic
- **Goal:** Centralize role-based access logic.
- **Action:**
  - Create `client/src/shared/hooks/useAuth.ts` to expose `user`, `role`, and `isAuthenticated`.
  - Update Redux auth slice to handle the `role` returned from the login redirect.
- **Location:** `client/src/shared/hooks/`, `client/src/slices/`

### 1.2 Protected Route Component
- **Goal:** Prevent unauthorized access to pages.
- **Action:**
  - Implement `ProtectedRoute` in `client/src/shared/components/protected-route.tsx`.
  - Props: `allowedRoles?: string[]`.
  - Logic: Redirect to `/login` if unauthenticated; show "Access Denied" if role doesn't match.
- **Verification:** Manually changing URL to `/admin/audit-logs` as an HR user should redirect/block.

---

## Phase 2: User Management Module (#37)
### 2.1 Module Scaffolding
- **Action:** `/scaffold user-management client`
- **Structure:**
  - `lib/api/`: `getUsers`, `updateUserRole`, `toggleUserStatus`.
  - `components/`: `UserTable`, `UserRoleModal`.

### 2.2 Features (Admin Only)
- **User List:** Ant Design `Table` showing Name, Email, Role, and Status.
- **Role Management:** Modal to change a user's role (HR, HR Admin, Admin).
- **Status Toggle:** Switch to activate/deactivate users.
- **Verification:** Admin can change an HR user to HR Admin and see the change reflect.

---

## Phase 3: Escalation Workflow Module (#38)
### 3.1 Module Scaffolding
- **Action:** `/scaffold escalations client`
- **Structure:**
  - `lib/api/`: `raiseEscalation`, `resolveEscalation`, `getMyEscalations`.
  - `components/`: `RaiseEscalationModal`, `EscalationDashboard`.

### 3.2 Features
- **Raise Escalation:** Button on Candidate Detail page (visible only to HR owner) opening a modal to select HR Admin and add notes.
- **Dashboard:** 
  - **HR View:** "My Raised Requests" with status tracking.
  - **Admin/HRA View:** "Pending Reviews" with "Resolve" action.
- **Verification:** HR raises request -> HR Admin sees it -> HR Admin resolves -> HR sees resolution.

---

## 4. Phase 4: System Audit Log Module (#39)
### 4.1 Module Scaffolding
- **Action:** `/scaffold audit-logs client`
- **Structure:**
  - `lib/api/`: `getAuditLogs` (with pagination and filters).
  - `components/`: `AuditLogTable`, `AuditLogFilters`.

### 4.2 Features (Admin Only)
- **Audit Table:** Columnar view of Timestamp, Actor, Action, Target, and Metadata.
- **Filtering:** Search by Actor ID, Action Type, or Date Range.
- **URL State:** Use `nuqs` to keep filters/pagination in the URL.
- **Verification:** Perform a candidate deletion and verify the log appears in the table.

---

## Phase 5: UI/UX Refinements
- **Navigation:** Update sidebar to conditionally render "User Management" and "Audit Logs" only for Admin roles.
- **Candidate Actions:** Hide "Edit/Delete" buttons on the candidate list if the HR user does not own the candidate (complementing backend checks).
- **Error Handling:** Global Ant Design `notification` for 403 Forbidden responses.

---

## Technical Standards
- **Validation:** All forms must use `Ant Design Form` with `Zod` schemas.
- **Types:** Explicit interfaces for all API responses in `<module>/types/`.
- **Barrels:** Always export through `index.ts` barrels.
- **Styling:** Vanilla CSS or Ant Design tokens (No inline styles).

---
*Plan created on 2026-05-30*
