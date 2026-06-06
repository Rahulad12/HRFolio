# Functional Requirements Specification (FRS): Hiring Management System Enhancements

**Project Name:** HRFolio
**Document Version:** 2.0 (Updated for Modular TS Architecture)
**Date:** 2026-05-30
**Status:** Draft
**Features:** RBAC, Escalation System, Audit Logs, User-Based Filtering

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional requirements for enhancing the HRFolio system with Role-Based Access Control (RBAC), a structured Escalation System, and comprehensive Audit Logging. It serves as the definitive guide for developers, testers, and stakeholders, adhering to the new modular TypeScript architecture.

### 1.2 Scope
The scope includes:
- Implementation of three distinct user roles: HR, HR Admin, and Admin.
- Data isolation based on candidate ownership for HR users.
- A two-level escalation workflow (HR → HR Admin → Admin).
- A centralized audit logging system to track all critical activities.
- User management interface for Admin users.

---

## 2. User Roles & Permissions

### 2.1 Role Definitions
- **HR:** Primary users responsible for managing their assigned candidates through the recruitment pipeline.
- **HR Admin:** Supervisory users with oversight of all candidates and responsibility for Level 1 escalations.
- **Admin:** System administrators responsible for user management and Level 2 escalations.

### 2.2 Permission Matrix (Detailed)

| Module | Feature | Action | HR | HR Admin | Admin |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Candidates** | Visibility | View Own | ✅ | ✅ | ✅ |
| | | View All | ❌ | ✅ | ✅ |
| | Operations | Create | ✅ | ✅ | ❌ |
| | | Edit Own | ✅ | ✅ | ❌ |
| | | Edit Any | ❌ | ✅ | ❌ |
| | | Delete Own | ✅ | ✅ | ❌ |
| | | Delete Any | ❌ | ✅ | ❌ |
| | Pipeline | Move Stage | ✅ (Own) | ✅ (Any) | ❌ |
| **Communication** | Email | Send to Candidate | ✅ (Own) | ✅ (Any) | ✅ (Any) |
| **Escalations** | Level 1 (HR->HRA) | Raise | ✅ | ❌ | ❌ |
| | | Receive/View | ❌ | ✅ (Targeted) | ❌ |
| | | Resolve | ❌ | ✅ | ❌ |
| | Level 2 (HRA->Adm) | Escalate | ❌ | ✅ | ❌ |
| | | Receive/View | ❌ | ❌ | ✅ (Targeted) |
| | | Resolve | ❌ | ❌ | ✅ |
| **Users** | Management | Create/Edit/Roles | ❌ | ❌ | ✅ |
| **Audit Logs** | Logging | System-wide View | ❌ | ❌ | ✅ |
| | | Scoped View | ✅ (Own) | ✅ (All Cand) | ✅ |

---

## 3. Functional Requirements

### 3.1 Role-Based Access Control (RBAC)
- **FR-1.1:** The system shall enforce role-based access to all API endpoints and UI components.
- **FR-1.2:** Every user must have exactly one role assigned.
- **FR-1.3:** Unauthorized access attempts to restricted features shall be blocked and logged as a "Security Event" in audit logs.

### 3.2 Candidate Ownership & Filtering
- **FR-2.1:** Every candidate record shall have a `createdBy` field storing the User ID of the creator (Owner).
- **FR-2.2:** For HR users, the candidate list view shall automatically filter records where `createdBy == currentUserId`.
- **FR-2.3:** HR Admin and Admin users shall see all candidates by default, with optional filters for "Owner".

### 3.3 Escalation System
#### Level 1: HR to HR Admin
- **FR-3.1:** HR users shall have a "Raise Escalation" button on the Candidate Detail page.
- **FR-3.2:** Raising an escalation requires selecting a specific HR Admin and providing a "Reason for Review".
- **FR-3.3:** Status Flow: `Pending` -> `In Review` (when opened by HRA) -> `Resolved`.
- **FR-3.4:** HR can cancel a `Pending` escalation.

#### Level 2: HR Admin to Admin
- **FR-3.5:** HR Admin can escalate an existing Level 1 request to a specific Admin.
- **FR-3.6:** This action transitions the request to Level 2 status, notifying the selected Admin.
- **FR-3.7:** HR shall be notified that the request has reached "Senior Management Review" (Admin level).

#### Resolution
- **FR-3.8:** Resolvers (HRA or Admin) must provide a "Resolution Comment" before closing.
- **FR-3.9:** Upon resolution, the owner (HR) receives a notification with the comment.
- **FR-3.10:** The system shall NOT automatically move the candidate stage; this remains a manual action for the HR owner.

### 3.4 Audit Logging
- **FR-4.1:** The system shall log the following attributes for every tracked event: `Timestamp`, `Actor (ID/Name/Role)`, `Action Type`, `Entity (Target ID/Type)`, `Metadata (Before/After values)`, and `Client IP`.
- **FR-4.2:** Tracked Events:
    - Candidate: Create, Update (field-level), Delete, Stage Change, Email Sent.
    - Escalation: Raised, Cancelled, Escalated, Resolved.
    - User: Created, Modified, Role Changed, Status Changed (Deactivated/Reactivated).
    - Auth: Login, Logout, Failed Attempt.
- **FR-4.3:** Audit logs shall be immutable and never deleted through the application interface.

### 3.5 User Management (Admin Only)
- **FR-5.1:** Admin interface to list all users with their roles and status.
- **FR-5.2:** Ability to create users, update their details, and toggle "Active/Deactive" status.
- **FR-5.3:** Ability to reassign candidate ownership.

---

## 4. Non-Functional Requirements (Architecture-Specific)

### 4.1 Modular Structure
- **NFR-1.1:** New backend features MUST be implemented in `server/src/modules/`.
- **NFR-1.2:** New frontend features MUST be implemented in `client/src/modules/`.
- **NFR-1.3:** Cross-module imports are strictly prohibited. Use `src/shared/` for shared logic.

### 4.2 TypeScript & Type Safety
- **NFR-2.1:** Strict TypeScript mode is mandatory (`"strict": true`).
- **NFR-2.2:** Explicit return types for all exported functions.
- **NFR-2.3:** No `any` type usage. Use `unknown` + type guards where necessary.

### 4.3 Validation
- **NFR-3.1:** Use Zod for all data validation (Frontend forms and Backend API requests).
- **NFR-3.2:** Frontend forms must use Ant Design Form components validated by Zod schemas.

---

## 5. Acceptance Criteria

### AC-1: HR Isolation
- Given I am logged in as an HR user
- When I view the candidate list
- Then I should only see candidates I created
- And I should not be able to access other candidates via direct URL manipulation.

### AC-2: Escalation Workflow
- Given a candidate owned by HR1 is escalated to HRAdmin1
- When HRAdmin1 views their "Incoming Requests"
- Then they should see the request from HR1
- And other HR Admins should NOT see this request.

### AC-3: Audit Integrity
- Given any user performs a "Stage Move" action
- When an Admin views the Audit Logs
- Then there must be an entry showing the exact timestamp, actor, and the "From" and "To" stages.

---

## 6. Technical Constraints / Assumptions
- **Backend:** Node.js (Express 5) / Mongoose 8. New modules in `server/src/modules/`.
- **Frontend:** React 18 / TypeScript / Vite / Ant Design. New modules in `client/src/modules/`.
- **Authentication:** Passport/JWT based (legacy auth exists, needs extension for roles).
- **Database:** MongoDB.

---
*End of FRS v2.0*
