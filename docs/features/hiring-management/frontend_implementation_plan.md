# Technical Frontend Implementation Plan: Hiring Management Enhancements

**Target Issues:** #36 - #39
**Architecture:** Modular TypeScript (React 18 / Vite / Ant Design / Zustand + Context)

---

## 1. Authentication & Role Propagation (#36)

### 1.1 Type Updates
- **File:** `client/src/modules/auth/types/auth.types.ts`
- **Action:** Add `role: 'HR' | 'HR Admin' | 'Admin'` to `AuthUser` and `GoogleLoginPayload`.

### 1.2 Context & Persistence
- **File:** `client/src/modules/auth/context/AuthContext.tsx`
- **Action:** 
  - Update `loadUser()` to retrieve `role` from `localStorage`.
  - Update `persistUser()` to save `role` to `localStorage`.
  - Update `clearPersistedUser()` to remove `role`.

### 1.3 Login Redirect Handling
- **File:** `client/src/modules/auth/page.tsx`
- **Action:** 
  - Extract `role` from `searchParams`.
  - Pass `role` to `setCredentials()`.

---

## 2. Role-Based Access Control (UI)

### 2.1 Enhanced Protected Route
- **File:** `client/src/shared/components/ProtectedRoute.tsx`
- **Action:**
  - Update component to accept `allowedRoles?: string[]`.
  - Logic:
    ```tsx
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />; // Or an "Access Denied" page
    }
    ```

### 2.2 Dynamic Sidebar Navigation
- **File:** `client/src/shared/components/DashboardSidebar.tsx`
- **Action:** 
  - Access `user` from `useAuth()`.
  - Filter the `links` array based on the current user's role.
  - "User Management" and "Audit Logs" should only be visible to `Admin`.

---

## 3. Modular Feature Implementation

### 3.1 User Management Module (#37)
- **Scaffold:** `/scaffold user-management client`
- **Endpoints:**
  - `GET /api/auth/users` (Need to verify backend endpoint for listing users)
  - `DELETE /api/auth/:id` (Toggles status)
  - `PATCH /api/auth/:id/role` (New endpoint to be added to backend)
- **Component:** `UserTable` using Ant Design `Table`.

### 3.2 Escalation Workflow Module (#38)
- **Scaffold:** `/scaffold escalations client`
- **Endpoints:**
  - `POST /api/escalations/raise`
  - `POST /api/escalations/:id/resolve`
  - `GET /api/escalations/my`
- **Integration:** Add "Raise Escalation" button to `CandidateDetailPage`.

### 3.3 System Audit Log Module (#39)
- **Scaffold:** `/scaffold audit-logs client`
- **Endpoints:**
  - `GET /api/audit-logs`
- **Component:** `AuditLogTable` with column rendering for `metadata` (JSON view).

---

## 4. Routing Registration
- **File:** `client/src/routes/index.tsx`
- **Action:**
  - Import new modular routes.
  - Wrap Admin-only routes with `<ProtectedRoute allowedRoles={['Admin']} />`.

---

## 5. Technical Constraints
- **Validation:** Use `Zod` with `Ant Design Form`.
- **API Calls:** Use the established pattern in `lib/queries/` (likely TanStack Query based on `package.json`).
- **Icons:** Use `lucide-react`.

---
*Updated on 2026-05-30*
