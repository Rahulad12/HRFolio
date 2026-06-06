# Data Segregation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure HR users only see their own candidates/interviews/offers, HR Admins see team data, Admins see everything.

**Architecture:** Add `createdBy` ObjectId fields to Interview/Offer/AssessmentAssignment models → scope all GET queries by `req.user.id` for HR role → protect write operations with ownership checks → expose audit log and user management to Admin.

**Tech Stack:** Node.js/Express/Mongoose (legacy JS), TypeScript (new modules), React/TypeScript (client)

---

### Task 1: Add `createdBy` to Interview, Offer, AssessmentAssignment models

**Files:**
- Modify: `server/src/legacy/model/Interview.js`
- Modify: `server/src/legacy/model/Offer.js`
- Modify: `server/src/legacy/model/AssessmentAssignment.js` (if exists, else `server/src/legacy/model/Assessment.js`)
- Test: Manual verification after seeding

- [ ] **Step 1: Add `createdBy` to Interview model**

```js
// In Interview schema, add:
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'users',
},
```

- [ ] **Step 2: Add `createdBy` to Offer model**

```js
// In Offer schema, add:
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'users',
},
```

- [ ] **Step 3: Add `createdBy` to AssessmentAssignment**

```js
// In AssessmentAssignment schema, add:
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'users',
},
```

---

### Task 2: Centralized RBAC ownership helper

**Files:**
- Modify: `server/src/shared/middleware/authorize.ts`

- [ ] **Step 1: Add `authorizeOwnership` helper**

```typescript
import mongoose from 'mongoose'

// Existing authorize function... plus:

interface OwnershipConfig {
  model: mongoose.Model<any>
  idParam?: string      // route param name (default 'id')
  ownerField?: string   // field on the model (default 'createdBy')
  roleExceptions?: string[]  // roles that bypass ownership check (default ['Admin', 'HR Admin'])
}

export function authorizeOwnership(config: OwnershipConfig) {
  return async (req: any, res: any, next: any) => {
    const { model, idParam = 'id', ownerField = 'createdBy', roleExceptions = ['Admin', 'HR Admin'] } = config
    if (roleExceptions.includes(req.user.role)) return next()
    
    const doc = await model.findById(req.params[idParam])
    if (!doc) return res.status(404).json({ success: false, message: 'Not found' })
    if (doc[ownerField]?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    req.doc = doc
    next()
  }
}
```

---

### Task 3: Ownership filtering in InterviewController

**Files:**
- Modify: `server/src/legacy/controllers/InterviewController.js`

- [ ] **Step 1: Add `createdBy` to Interview creation**
```js
// In createInterview, add to the new Interview object:
createdBy: req.user.id,
```

- [ ] **Step 2: Filter GET list for HR role**
```js
// In getAllInterviews, before query:
if (req.user.role === 'HR') {
  query.createdBy = req.user.id
}
```

- [ ] **Step 3: Ownership check for update/delete**
```js
// In updateInterview and deleteInterview:
if (req.user.role === 'HR') {
  const interview = await Interview.findById(req.params.id)
  if (!interview || interview.createdBy?.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Forbidden' })
  }
}
```

---

### Task 4: Ownership filtering in offerController

**Files:**
- Modify: `server/src/legacy/controllers/offerController.js`

- [ ] **Step 1: Add `createdBy` to Offer creation**
- [ ] **Step 2: Filter GET list for HR role**
- [ ] **Step 3: Ownership check for update/delete** (same pattern as Task 3)

---

### Task 5: Ownership filtering in assessmentController (assignments)

**Files:**
- Modify: `server/src/legacy/controllers/assessmentController.js`

- [ ] **Step 1: Add `createdBy` to assignment creation**
- [ ] **Step 2: Filter assignment list for HR role**
- [ ] **Step 3: Ownership check for score submission/deletion**

---

### Task 6: Wire AuditLog into legacy controllers

**Files:**
- Modify: `server/src/legacy/controllers/candidateController.js`
- Modify: `server/src/legacy/controllers/offerController.js`

- [ ] **Step 1: Import auditLogService**
```js
import { auditLogService } from '../../modules/audit-logs/services/audit-logs.service.js'
```

- [ ] **Step 2: Replace ActivityLog.create calls with auditLogService.log()**
```js
await auditLogService.log({
  actor: { id: req.user.id, name: req.user.name, role: req.user.role },
  action: 'CANDIDATE_CREATE',
  target: { id: candidate._id, type: 'candidate', name: candidate.name },
  metadata: { comment: 'Candidate created' },
  ipAddress: req.ip,
})
```

---

### Task 7: Frontend route protection

**Files:**
- Modify: `client/src/shared/components/ProtectedRoute.tsx`
- Modify: `client/src/routes/index.tsx`

- [ ] **Step 1: Add `allowedRoles` prop to ProtectedRoute**
```tsx
interface ProtectedRouteProps {
  allowedRoles?: string[]
  children?: React.ReactNode
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children ? <>{children}</> : <Outlet />
}
```

- [ ] **Step 2: Protect admin routes**
```tsx
// In routes/index.tsx:
{
  element: <ProtectedRoute allowedRoles={['Admin']} />,
  children: [
    { path: 'user-management', element: lazyRoute(UserManagement) },
    { path: 'audit-logs', element: lazyRoute(AuditLogs) },
  ],
}
```

---

### Task 8: Audit Log Viewer FE module

**Files:**
- Create: `client/src/modules/audit-logs/types/audit-log.types.ts`
- Create: `client/src/modules/audit-logs/lib/api/audit-log.api.ts`
- Create: `client/src/modules/audit-logs/lib/queries/audit-log.queries.ts`
- Create: `client/src/modules/audit-logs/components/AuditLogTable.tsx`
- Create: `client/src/modules/audit-logs/page.tsx`
- Create: `client/src/modules/audit-logs/index.ts`
- Create: `client/src/modules/audit-logs/routes/audit-log.routes.tsx`
- Modify: `client/src/routes/index.tsx`

- [ ] **Step 1: Create types**
```typescript
export interface AuditLog {
  _id: string
  timestamp: string
  actor: { id: string; name: string; role: string }
  action: string
  target: { id: string; type: string; name: string }
  metadata: { before?: any; after?: any; comment?: string }
  ipAddress: string
}

export interface AuditLogListResponse {
  success: boolean
  message: string
  data: AuditLog[]
}
```

- [ ] **Step 2: Create API + queries** (GET to `/audit-logs` with params)
- [ ] **Step 3: Create AuditLogTable component** (Ant Design Table with filters)
- [ ] **Step 4: Create page/index/routes**
- [ ] **Step 5: Register routes in main router**

---

### Task 9: User create endpoint

**Files:**
- Modify: `server/src/legacy/controllers/userController.js`
- Modify: `server/src/legacy/routes/authRoutes.js`

- [ ] **Step 1: Add createUser function**
```js
export const createUser = async (req, res) => {
  const { name, email, role } = req.body
  try {
    const user = await User.create({ name, email, role, status: 'active' })
    if (!user) return res.status(400).json({ success: false, message: 'User not created' })
    await auditLogService.log({
      actor: { id: req.user.id, name: req.user.name, role: req.user.role },
      action: 'USER_CREATE',
      target: { id: user._id, type: 'user', name: user.name },
      ipAddress: req.ip,
    })
    res.status(201).json({ success: true, message: 'User created successfully', data: user })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}
```

- [ ] **Step 2: Add route** `POST /api/auth/create` with Admin authorize middleware

---

### Task 10: Verification

- [ ] Create two HR users via seeding
- [ ] Each creates candidates, interviews, offers
- [ ] Verify HR user A sees only their own data
- [ ] Verify HR Admin sees all data
- [ ] Verify Admin sees all data + user management + audit logs
