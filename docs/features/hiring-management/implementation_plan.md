# Implementation Plan: Hiring Management Enhancements (Modular TS Architecture)

**Target Issues:** #32 - #40 (Updated)
**Status:** In Planning
**Base Branch:** `develop`

---

## Phase 1: Foundation (RBAC & Schema)
### Task 1: User Schema & Auth Extension (#32)
- **Goal:** Add roles to the system.
- **Action:**
  - Modify `server/src/legacy/model/User.js` to add `role`.
  - Update `server/src/legacy/controllers/userController.js` to include `role` in JWT.
- **Verification:** Login returns JWT with role.

### Task 2: Authorization Middleware (#32)
- **Goal:** Server-side access control.
- **Action:**
  - Create `server/src/shared/middleware/authorize.ts` (TypeScript).
  - Apply to legacy routes in `server/src/legacy/routes/`.
- **Verification:** 403 Forbidden for unauthorized roles.

---

## Phase 2: Data Isolation
### Task 3: Candidate Ownership (#33)
- **Goal:** Isolate data for HR users.
- **Action:**
  - Add `createdBy` to `server/src/legacy/model/Candidate.js`.
  - Update `server/src/legacy/controllers/candidateController.js` with ownership logic.
  - *Optionally* scaffold NEW `Candidate` module in `server/src/modules/` for any new logic.
- **Verification:** HR users only see their own candidates.

---

## Phase 3: Modular Feature Implementation
### Task 4: Escalation System Module (#34)
- **Goal:** Two-level review workflow using the NEW modular structure.
- **Action:**
  - `/scaffold escalations server`
  - Implement Service -> Controller -> Routes.
- **Verification:** Unit tests for escalation flow.

### Task 5: Audit Logging Module (#35)
- **Goal:** Immutable activity tracking.
- **Action:**
  - `/scaffold audit-logs server`
  - Implement immutable logging service.
  - Hook into other modules/legacy controllers.
- **Verification:** Logs captured for all major actions.

---

## Phase 4: Frontend Modular Migration
### Task 6: Role Protection & Shared Components (#36)
- **Goal:** UI-side role enforcement.
- **Action:**
  - Implement `ProtectedRoute` in `client/src/shared/components/`.
  - Update React router with new modular routes.
- **Verification:** Admin pages inaccessible to HR.

### Task 7: Admin & Feature Modules (#37, #38, #39)
- **Goal:** New functional modules on the frontend.
- **Action:**
  - `/scaffold user-management client`
  - `/scaffold escalations client`
  - `/scaffold audit-logs client`
- **Verification:** Complete UI coverage for new features.

---

## Phase 5: Finalization
### Task 8: Data Migration (#40)
- **Goal:** Cleanup existing data.
- **Action:**
  - Script to assign roles and default ownership.
- **Verification:** System functional with existing data.

---
*Plan updated on 2026-05-30*
