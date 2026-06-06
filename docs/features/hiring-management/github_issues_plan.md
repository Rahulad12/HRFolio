# Plan: GitHub Issue Creation for Hiring Management Enhancements (Modular Architecture)

**Objective:** Break down the Hiring Management FRS into actionable GitHub issues for tracking and implementation, adhering to the new modular TypeScript standards.

---

## 1. Backend: Core RBAC & Schema Updates
**Title:** [BE] Implement User Roles and RBAC Middleware (TS Modular)
**Description:**
- Update User schema (legacy model) to include `role` (enum: 'HR', 'HR Admin', 'Admin').
- Modify auth controllers (legacy) to include `role` in the JWT payload.
- Create `authorize(['role'])` middleware in `server/src/shared/middleware/` (if shared) or `server/src/modules/auth/` (if modular).
- **Labels:** `backend`, `security`, `typescript`, `to-do`

---

## 2. Backend: Candidate Ownership & Isolation
**Title:** [BE] Candidate Ownership and Filtering Logic (Modular)
**Description:**
- Add `createdBy` field to the Candidate model (legacy).
- Create a new `Candidate` module in `server/src/modules/candidates/` to handle NEW logic, or update legacy controllers with ownership checks.
- Implement server-side filtering in the `getCandidates` controller based on user role (HR sees only their own).
- **Labels:** `backend`, `data-privacy`, `typescript`, `to-do`

---

## 3. Backend: Escalation System (Level 1 & 2)
**Title:** [BE] Escalation System API (New Module)
**Description:**
- Create NEW module `server/src/modules/escalations/`.
- Implement `Escalation` model, routes, controller, and service.
- Features: Raise, Escalate, Resolve, Cancel.
- **Labels:** `backend`, `feature`, `typescript`, `to-do`

---

## 4. Backend: Centralized Audit Logging
**Title:** [BE] Centralized Audit Logging System (New Module)
**Description:**
- Create NEW module `server/src/modules/audit-logs/`.
- Implement immutable `AuditLog` model and service.
- Create a global `logger` utility or middleware to capture events.
- **Labels:** `backend`, `compliance`, `typescript`, `to-do`

---

## 5. Frontend: RBAC UI Enforcement
**Title:** [FE] Role-Based UI and Route Protection (Modular)
**Description:**
- Create NEW module `client/src/modules/auth/` if needed for protection logic.
- Implement `ProtectedRoute` in `client/src/shared/components/`.
- Conditionally render UI elements based on user role from Redux state.
- **Labels:** `frontend`, `ui/ux`, `typescript`, `to-do`

---

## 6. Frontend: User Management (Admin Only)
**Title:** [FE] Admin User Management Module
**Description:**
- Create NEW module `client/src/modules/user-management/`.
- Features: List users, edit roles, toggle active/inactive status.
- Use Ant Design and Zod for validation.
- **Labels:** `frontend`, `admin`, `typescript`, `to-do`

---

## 7. Frontend: Escalation & Notification UI
**Title:** [FE] Escalation Workflow Module
**Description:**
- Create NEW module `client/src/modules/escalations/`.
- Features: Raise escalation modal, Escalations dashboard.
- Integrate with in-app notifications.
- **Labels:** `frontend`, `feature`, `typescript`, `to-do`

---

## 8. Frontend: Audit Log Viewer
**Title:** [FE] System Audit Log Viewer Module
**Description:**
- Create NEW module `client/src/modules/audit-logs/`.
- Features: Table view for Admins, filters for Timestamp, Actor, Action.
- Ensure pagination via URL state (nuqs).
- **Labels:** `frontend`, `admin`, `typescript`, `to-do`

---

## 9. Database: Data Migration
**Title:** [DB] Migration: Candidate Ownership & Roles
**Description:**
- Write and execute a script to:
  - Assign default roles to existing users.
  - Populate `createdBy` for existing candidates.
- **Labels:** `database`, `migration`, `to-do`
