# RBAC Gap Fill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close four correctness gaps in the FRS-specified permission model: block Admin from candidate CRUD, enforce HR ownership on mail, prevent duplicate escalations, and expose scoped audit-log views to HR Admin and HR.

**Architecture:** All four gaps are pure backend additions (middleware, service guards, a new route) plus a thin frontend layer to wire the new scoped audit-log endpoint into the existing `AuditLogTable`. No new modules are created — changes slot into the existing `legacy/` controllers and the `modules/` pattern already established.

**Tech Stack:** Node.js / Express 5 / Mongoose 8 / TypeScript · React 18 / TanStack Query v5 / Ant Design

---

## File Map

| File | Change |
|------|--------|
| `server/src/legacy/routes/candidateRoutes.js` | Add `authorize(['HR', 'HR Admin'])` to create, update, delete, stage, reject routes |
| `server/src/legacy/controllers/GeneralEmailController.js` | Add HR ownership guard before sending mail |
| `server/src/modules/escalations/services/escalations.service.ts` | Add duplicate-active-escalation check in `raiseLevel1` |
| `server/src/modules/audit-logs/services/audit-logs.service.ts` | Add `getScopedLogs(userId, role)` method |
| `server/src/modules/audit-logs/types/audit-logs.types.ts` | Add `IScopedAuditLogQuery` type |
| `server/src/modules/audit-logs/controller/audit-logs.controller.ts` | Add `getScopedLogs` handler |
| `server/src/modules/audit-logs/routes/audit-logs.routes.ts` | Add `GET /my-scope` route (HR + HR Admin) |
| `client/src/modules/audit-logs/lib/api/audit-log.api.ts` | Add `fetchScopedAuditLogs()` |
| `client/src/modules/audit-logs/lib/queries/audit-log.queries.ts` | Add `useScopedAuditLogList()` hook |
| `client/src/modules/audit-logs/page.tsx` | Use scoped vs full query based on user role |
| `client/src/shared/components/DashboardSidebar.tsx` | Show Audit Logs link to HR Admin too |
| `client/src/routes/index.tsx` | Split ProtectedRoute: user-mgmt Admin-only, audit-logs Admin+HR Admin |

---

## Task 1: Block Admin from candidate CRUD routes

**Files:**
- Modify: `server/src/legacy/routes/candidateRoutes.js`
- Modify: `server/src/shared/middleware/authorize.ts` (import path check only)

The candidate routes currently have zero role enforcement — any authenticated user including Admin can create, edit, delete, and move stages. The FRS permission matrix explicitly forbids Admin from all of these operations. The ownership checks that exist inside the controllers (HR vs HR Admin) are not enough — Admin bypasses them entirely.

- [ ] **Step 1: Open `server/src/legacy/routes/candidateRoutes.js` and verify the current state**

```bash
cat server/src/legacy/routes/candidateRoutes.js
```

Expected: five mutating routes (`POST /`, `PUT /:id`, `PUT /stage/:id`, `DELETE /`, `PUT /reject/:id`) with only `authenticate, checkUserExist` — no `authorize` call.

- [ ] **Step 2: Add the `authorize` import and apply it to all mutating routes**

Replace the entire file content:

```js
import express from "express";
import {
  createCandidate,
  getCandidateById,
  getAllCandidates,
  deleteCandidates,
  updateCandidate,
  getCandidateLogsByCandidateId,
  changeCandidateStage,
  rejectCandidate,
} from "../controllers/candidateController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";
import { authorize } from "../../shared/middleware/authorize.ts";

const candidateRouter = express.Router();

// Read — all authenticated users can read (HR sees own via controller-level filter)
candidateRouter.get("/", authenticate, checkUserExist, getAllCandidates);
candidateRouter.get("/log/:id", authenticate, checkUserExist, getCandidateLogsByCandidateId);
candidateRouter.get("/:id", authenticate, checkUserExist, getCandidateById);

// Write — Admin is explicitly forbidden by FRS (§4.1–4.4)
candidateRouter.post("/", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), createCandidate);
candidateRouter.put("/reject/:id", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), rejectCandidate);
candidateRouter.put("/stage/:id", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), changeCandidateStage);
candidateRouter.put("/:id", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), updateCandidate);
candidateRouter.delete("/", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), deleteCandidates);

export default candidateRouter;
```

- [ ] **Step 3: Verify Admin is blocked — start the server and test with curl**

```bash
# Start server (in a separate terminal)
cd server && npm run dev

# Get a valid Admin JWT first (log in via Google OAuth and copy the token from the redirect URL)
# Then test with that token:
TOKEN="<admin-jwt-here>"

curl -s -X POST http://localhost:5000/api/candidate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}' | jq .
```

Expected output:
```json
{ "success": false, "message": "Forbidden: Insufficient permissions" }
```

- [ ] **Step 4: Verify HR Admin can still create (ownership filters don't block them)**

```bash
TOKEN="<hr-admin-jwt>"
curl -s -X POST http://localhost:5000/api/candidate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"t@t.com","phone":"1234567890","technology":"React","level":"junior","experience":1,"expectedsalary":50000,"applieddate":"2026-01-01","resume":"test.pdf"}' | jq .message
```

Expected: `"Candidate created successfully"` (or a validation error about missing fields — NOT a 403).

- [ ] **Step 5: Commit**

```bash
git add server/src/legacy/routes/candidateRoutes.js
git commit -m "fix: block Admin role from candidate CRUD and stage routes (FRS §4.1-4.4)"
```

---

## Task 2: HR ownership guard on mail sending

**Files:**
- Modify: `server/src/legacy/controllers/GeneralEmailController.js`

The FRS permission matrix says HR can only send mail to **their own** candidates (§4.5). Currently `createGeneralEmail` has no ownership check — any HR user can send mail to any candidate. The fix is a single DB lookup + ownership check before dispatching the email.

- [ ] **Step 1: Open the controller and read the current send-mail flow**

```bash
cat server/src/legacy/controllers/GeneralEmailController.js
```

Note: `candidate` (an ObjectId string) comes in from `req.body`. There is no ownership check at all.

- [ ] **Step 2: Add ownership guard after finding the candidate**

Replace the entire file:

```js
import GeneralEmail from "../model/GeneralEmail.js";
import ActivityLog from "../model/ActivityLogs.js";
import sendEmail from "../utils/sendEmail.js";
import Candidate from "../model/Candidate.js";
import { auditLogService } from "../../modules/audit-logs/index.js";

const createGeneralEmail = async (req, res) => {
  const { candidate: candidateId, emailAddress, subject, body, attachment } = req.body;
  try {
    const candidateDoc = await Candidate.findById(candidateId);
    if (!candidateDoc) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    // HR may only send to their own candidates (FRS §4.5)
    if (
      req.user.role === "HR" &&
      candidateDoc.createdBy?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only send mail to your own candidates",
      });
    }

    const generalEmail = await GeneralEmail.create({
      candidate: candidateId,
      emailAddress,
      subject,
      body,
      attachment,
    });

    await sendEmail({ to: emailAddress, subject, html: body });

    await auditLogService.log({
      actor: { id: req.user.id, name: req.user.name || "Unknown", role: req.user.role },
      action: "EMAIL_SENT",
      target: { id: candidateDoc._id, type: "candidates", name: candidateDoc.name },
      metadata: { after: { subject, emailAddress } },
    });

    await ActivityLog.create({
      candidate: candidateId,
      userID: req.user._id,
      action: "created",
      entityType: "generalEmails",
      relatedId: generalEmail._id,
      metaData: { title: candidateDoc.name },
    });

    return res.status(201).json({
      success: true,
      message: "General email created successfully",
      data: generalEmail,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { createGeneralEmail };
```

Note: this also adds the missing `EMAIL_SENT` audit log entry (Gap 7 from the FRS, FR-4.2).

- [ ] **Step 3: Verify HR is blocked from mailing another HR's candidate**

```bash
HR_TOKEN="<hr-jwt-for-user-A>"
OTHER_CANDIDATE_ID="<candidate-owned-by-user-B>"

curl -s -X POST http://localhost:5000/api/email/general/send \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"candidate\":\"$OTHER_CANDIDATE_ID\",\"emailAddress\":\"x@x.com\",\"subject\":\"Hi\",\"body\":\"<p>Hi</p>\"}" | jq .
```

Expected:
```json
{ "success": false, "message": "Forbidden: You can only send mail to your own candidates" }
```

- [ ] **Step 4: Verify HR Admin can mail any candidate**

```bash
HR_ADMIN_TOKEN="<hr-admin-jwt>"
curl -s -X POST http://localhost:5000/api/email/general/send \
  -H "Authorization: Bearer $HR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"candidate\":\"$OTHER_CANDIDATE_ID\",\"emailAddress\":\"x@x.com\",\"subject\":\"Hi\",\"body\":\"<p>Hi</p>\"}" | jq .message
```

Expected: `"General email created successfully"` (not 403).

- [ ] **Step 5: Commit**

```bash
git add server/src/legacy/controllers/GeneralEmailController.js
git commit -m "fix: enforce HR ownership on mail send + log EMAIL_SENT audit event (FRS §4.5, FR-4.2)"
```

---

## Task 3: Prevent duplicate active escalations

**Files:**
- Modify: `server/src/modules/escalations/services/escalations.service.ts`

The FRS raw requirement §6.3 says HR cannot raise a duplicate escalation for the same candidate to the same HR Admin while one is still active (Pending or In Review). The current `raiseLevel1` skips this check entirely.

- [ ] **Step 1: Open the escalation service and locate `raiseLevel1`**

```bash
head -45 server/src/modules/escalations/services/escalations.service.ts
```

Note: after the candidate ownership check, there is no duplicate guard.

- [ ] **Step 2: Add the duplicate check in `raiseLevel1` — insert after the ownership check**

Find this block in the service (lines ~19–31):

```ts
    const candidate = await Candidate.findById(dto.candidateId);
    if (!candidate) throw new Error("Candidate not found");
    
    // Ownership check (only owner can raise escalation)
    if (candidate.createdBy?.toString() !== actor.id) {
      throw new Error("Only the candidate owner can raise an escalation");
    }

    const targetUser = await User.findById(dto.targetUserId);
    if (!targetUser || targetUser.role !== 'HR Admin') {
      throw new Error("Target user must be an HR Admin");
    }

    const escalation = await Escalation.create({
```

Replace with:

```ts
    const candidate = await Candidate.findById(dto.candidateId);
    if (!candidate) throw new Error("Candidate not found");

    // Ownership check (only owner can raise escalation)
    if (candidate.createdBy?.toString() !== actor.id) {
      throw new Error("Only the candidate owner can raise an escalation");
    }

    // Duplicate guard: one active escalation per (candidate, targetHRAdmin) pair
    const existing = await Escalation.findOne({
      candidateId: dto.candidateId,
      assignedTo: dto.targetUserId,
      status: { $in: ['Pending', 'In Review'] },
    });
    if (existing) {
      throw new Error(
        "An active escalation already exists for this candidate with the selected HR Admin"
      );
    }

    const targetUser = await User.findById(dto.targetUserId);
    if (!targetUser || targetUser.role !== 'HR Admin') {
      throw new Error("Target user must be an HR Admin");
    }

    const escalation = await Escalation.create({
```

- [ ] **Step 3: Verify duplicate is rejected — two calls with the same candidateId + targetUserId**

```bash
HR_TOKEN="<hr-jwt>"
CANDIDATE_ID="<candidate-owned-by-hr>"
HR_ADMIN_ID="<hr-admin-user-id>"

PAYLOAD="{\"candidateId\":\"$CANDIDATE_ID\",\"targetUserId\":\"$HR_ADMIN_ID\",\"notes\":\"Need review\"}"

# First raise — should succeed
curl -s -X POST http://localhost:5000/api/escalations/raise \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" | jq .success

# Second raise — should be blocked
curl -s -X POST http://localhost:5000/api/escalations/raise \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" | jq .
```

Expected second response:
```json
{
  "success": false,
  "message": "An active escalation already exists for this candidate with the selected HR Admin"
}
```

- [ ] **Step 4: Verify a different HR Admin target is allowed for the same candidate**

```bash
OTHER_HR_ADMIN_ID="<different-hr-admin-id>"
curl -s -X POST http://localhost:5000/api/escalations/raise \
  -H "Authorization: Bearer $HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"candidateId\":\"$CANDIDATE_ID\",\"targetUserId\":\"$OTHER_HR_ADMIN_ID\",\"notes\":\"Need review\"}" | jq .success
```

Expected: `true` (different target HR Admin — no duplicate).

- [ ] **Step 5: Commit**

```bash
git add server/src/modules/escalations/services/escalations.service.ts
git commit -m "fix: prevent duplicate active escalations for same candidate+HR Admin pair (FRS §6.3)"
```

---

## Task 4: Scoped audit log — backend

**Files:**
- Modify: `server/src/modules/audit-logs/types/audit-logs.types.ts`
- Modify: `server/src/modules/audit-logs/services/audit-logs.service.ts`
- Modify: `server/src/modules/audit-logs/controller/audit-logs.controller.ts`
- Modify: `server/src/modules/audit-logs/routes/audit-logs.routes.ts`

The FRS table shows HR Admin needs all candidate-related audit logs, and HR needs logs for their own candidates only. A new `GET /api/audit-logs/my-scope` endpoint handles this — the service computes the scope from the caller's role and ID.

- [ ] **Step 1: Add `IScopedAuditLogQuery` to the types file**

Open `server/src/modules/audit-logs/types/audit-logs.types.ts` and append:

```ts
export interface IScopedAuditLogQuery {
  page?: number;
  limit?: number;
}
```

- [ ] **Step 2: Add `getScopedLogs` to the audit log service**

Open `server/src/modules/audit-logs/services/audit-logs.service.ts`.

Add this import at the top (after the existing AuditLog import):

```ts
import mongoose from 'mongoose';
```

Then append `getScopedLogs` inside the `AuditLogService` class, after the existing `getLogs` method:

```ts
  /**
   * Returns audit logs scoped by the caller's role:
   *   HR Admin → all candidate + escalation logs
   *   HR       → logs where target.id is one of their own candidates
   */
  async getScopedLogs(
    userId: string,
    role: string,
    query: { page?: number; limit?: number }
  ): Promise<{ logs: any[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    let mongoQuery: any = {};

    if (role === 'HR Admin') {
      // HR Admin sees all candidate and escalation logs
      mongoQuery = { 'target.type': { $in: ['candidates', 'escalations'] } };
    } else if (role === 'HR') {
      // HR sees only logs targeting their own candidates
      // Import Candidate model dynamically to avoid circular dep
      const Candidate = mongoose.model('candidates');
      const ownCandidateIds = await Candidate.find(
        { createdBy: new mongoose.Types.ObjectId(userId) },
        '_id'
      ).lean();
      const ids = ownCandidateIds.map((c: any) => c._id);
      mongoQuery = { 'target.id': { $in: ids }, 'target.type': 'candidates' };
    } else {
      // Should not reach here (route is gated), but return empty to be safe
      return { logs: [], total: 0 };
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(mongoQuery).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(mongoQuery),
    ]);

    return { logs, total };
  }
```

- [ ] **Step 3: Add `getScopedLogs` handler to the controller**

Open `server/src/modules/audit-logs/controller/audit-logs.controller.ts` and append inside the `AuditLogController` class, after `getLogs`:

```ts
  async getScopedLogs(req: Request, res: Response): Promise<void> {
    try {
      const { id: userId, role } = (req as any).user;
      const query = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      };
      const result = await auditLogService.getScopedLogs(userId, role, query);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
```

Also update the last line to re-export the updated singleton:

```ts
export const auditLogController = new AuditLogController();
```

(This line already exists — no change needed.)

- [ ] **Step 4: Add the new route to `audit-logs.routes.ts`**

Replace the full file content:

```ts
import express from 'express';
import { auditLogController } from '../controller/audit-logs.controller';
import { authenticate } from '../../legacy/middleware/auhtMiddleware.js';
import { authorize } from '../../shared/middleware/authorize';

const router = express.Router();

// Admin only — full system-wide log
router.get('/', authenticate, authorize(['Admin']), auditLogController.getLogs);

// HR Admin and HR — scoped to candidates they can access
router.get('/my-scope', authenticate, authorize(['HR Admin', 'HR']), auditLogController.getScopedLogs);

export default router;
```

- [ ] **Step 5: Verify the scoped endpoint works for HR Admin**

```bash
HR_ADMIN_TOKEN="<hr-admin-jwt>"
curl -s "http://localhost:5000/api/audit-logs/my-scope?page=1&limit=10" \
  -H "Authorization: Bearer $HR_ADMIN_TOKEN" | jq '{success: .success, total: .data.total, first_action: .data.logs[0].action}'
```

Expected: `success: true`, logs contain only `target.type` of `candidates` or `escalations`.

- [ ] **Step 6: Verify HR sees only their own candidates' logs**

```bash
HR_TOKEN="<hr-jwt>"
curl -s "http://localhost:5000/api/audit-logs/my-scope" \
  -H "Authorization: Bearer $HR_TOKEN" | jq '[.data.logs[].target.type] | unique'
```

Expected: `["candidates"]` — only candidate-type targets.

- [ ] **Step 7: Verify Admin is rejected from `/my-scope`**

```bash
ADMIN_TOKEN="<admin-jwt>"
curl -s "http://localhost:5000/api/audit-logs/my-scope" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq .
```

Expected: `{ "success": false, "message": "Forbidden: Insufficient permissions" }` — Admin uses the full `/` endpoint instead.

- [ ] **Step 8: Commit**

```bash
git add \
  server/src/modules/audit-logs/types/audit-logs.types.ts \
  server/src/modules/audit-logs/services/audit-logs.service.ts \
  server/src/modules/audit-logs/controller/audit-logs.controller.ts \
  server/src/modules/audit-logs/routes/audit-logs.routes.ts
git commit -m "feat: add scoped audit log endpoint for HR and HR Admin roles (FRS §11.4)"
```

---

## Task 5: Scoped audit log — frontend

**Files:**
- Modify: `client/src/modules/audit-logs/lib/api/audit-log.api.ts`
- Modify: `client/src/modules/audit-logs/lib/queries/audit-log.queries.ts`
- Modify: `client/src/modules/audit-logs/page.tsx`
- Modify: `client/src/shared/components/DashboardSidebar.tsx`
- Modify: `client/src/routes/index.tsx`

HR Admin and HR cannot access the existing `/dashboard/audit-logs` page because the route is wrapped in `<ProtectedRoute allowedRoles={['Admin']}>`. We need to:
1. Add a `fetchScopedAuditLogs` API call and query hook
2. Update the page to pick the right data source based on the user's role
3. Widen route access to include HR Admin
4. Show the sidebar link to HR Admin

HR users will not get a sidebar link (their access comes from the candidate detail page history, which is a separate feature). They are blocked by `authorize` on the backend even if they somehow reach the URL.

- [ ] **Step 1: Add `fetchScopedAuditLogs` to the API layer**

Replace `client/src/modules/audit-logs/lib/api/audit-log.api.ts`:

```ts
import { GET } from '@/shared/lib/axios'
import type { AuditLogListResponse } from '../../types/audit-log.types'

const AUDIT_LOG_URL = 'audit-logs'

export async function fetchAuditLogs(params?: Record<string, unknown>): Promise<AuditLogListResponse> {
  return GET<AuditLogListResponse>(`/${AUDIT_LOG_URL}`, params)
}

export async function fetchScopedAuditLogs(params?: Record<string, unknown>): Promise<AuditLogListResponse> {
  return GET<AuditLogListResponse>(`/${AUDIT_LOG_URL}/my-scope`, params)
}
```

- [ ] **Step 2: Add `useScopedAuditLogList` query hook**

Replace `client/src/modules/audit-logs/lib/queries/audit-log.queries.ts`:

```ts
import { useQuery } from '@tanstack/react-query'
import * as auditLogApi from '../api/audit-log.api'

const AUDIT_LOGS_KEY = ['audit-logs'] as const

export function useAuditLogList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_KEY, 'full', params],
    queryFn: () => auditLogApi.fetchAuditLogs(params),
  })
}

export function useScopedAuditLogList(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...AUDIT_LOGS_KEY, 'scoped', params],
    queryFn: () => auditLogApi.fetchScopedAuditLogs(params),
  })
}
```

- [ ] **Step 3: Update the page to pick the right query based on role**

Replace `client/src/modules/audit-logs/page.tsx`:

```tsx
import { useAuth } from '@/shared/hooks/useAuth'
import { AuditLogTable } from './components/AuditLogTable'

export function AuditLogListPage() {
  const { user } = useAuth()
  const isScoped = user?.role === 'HR Admin' || user?.role === 'HR'
  return <AuditLogTable scoped={isScoped} />
}
```

- [ ] **Step 4: Update `AuditLogTable` to accept and use the `scoped` prop**

Open `client/src/modules/audit-logs/components/AuditLogTable.tsx`.

Add the prop type after the existing imports:

```tsx
interface AuditLogTableProps {
  scoped?: boolean
}
```

Change the function signature from:

```tsx
export function AuditLogTable() {
```

to:

```tsx
export function AuditLogTable({ scoped = false }: AuditLogTableProps) {
```

Add the new import at the top of the file alongside the existing query import:

```tsx
import { useAuditLogList, useScopedAuditLogList } from '../lib/queries/audit-log.queries'
```

Replace the existing single query line:

```tsx
  const { data, isLoading } = useAuditLogList()
```

with:

```tsx
  const fullQuery = useAuditLogList()
  const scopedQuery = useScopedAuditLogList()
  const { data, isLoading } = scoped ? scopedQuery : fullQuery
```

- [ ] **Step 5: Widen the route guard so HR Admin can reach `/dashboard/audit-logs`**

Open `client/src/routes/index.tsx`. The current structure wraps both `userManagementRoutes` and `auditLogRoutes` inside a single `<ProtectedRoute allowedRoles={['Admin']}>`. Split them:

Replace:

```tsx
            {
              element: <ProtectedRoute allowedRoles={['Admin']} />,
              children: [
                ...userManagementRoutes,
                ...auditLogRoutes,
              ],
            },
```

with:

```tsx
            {
              element: <ProtectedRoute allowedRoles={['Admin']} />,
              children: [...userManagementRoutes],
            },
            {
              element: <ProtectedRoute allowedRoles={['Admin', 'HR Admin']} />,
              children: [...auditLogRoutes],
            },
```

- [ ] **Step 6: Show the Audit Logs sidebar link to HR Admin**

Open `client/src/shared/components/DashboardSidebar.tsx`. Find the conditional Admin section:

```tsx
    // Admin Only Sections
    ...(user?.role === 'Admin' ? [
      {
        key: '/dashboard/user-management',
        ...
      },
      {
        key: '/dashboard/audit-logs',
        ...
      }
    ] : []),
```

Replace with:

```tsx
    // Admin only
    ...(user?.role === 'Admin' ? [
      {
        key: '/dashboard/user-management',
        icon: <ShieldCheck size={20} />,
        label: <Link to="/dashboard/user-management">User Management</Link>,
      },
    ] : []),
    // Admin + HR Admin
    ...(user?.role === 'Admin' || user?.role === 'HR Admin' ? [
      {
        key: '/dashboard/audit-logs',
        icon: <ClipboardList size={20} />,
        label: <Link to="/dashboard/audit-logs">Audit Logs</Link>,
      },
    ] : []),
```

- [ ] **Step 7: Build and verify no TypeScript errors in changed files**

```bash
cd client && npm run build 2>&1 | grep -E "audit-log|AuditLog|routes/index"
```

Expected: no output (no errors in our changed files).

- [ ] **Step 8: Manual browser verification**

1. Log in as HR Admin → sidebar should show "Audit Logs" link.
2. Navigate to `/dashboard/audit-logs` → should load with candidate and escalation logs only.
3. Log in as Admin → full log should load (existing behavior).
4. Log in as HR → navigating to `/dashboard/audit-logs` should redirect to `/dashboard` (ProtectedRoute blocks them).

- [ ] **Step 9: Commit**

```bash
git add \
  client/src/modules/audit-logs/lib/api/audit-log.api.ts \
  client/src/modules/audit-logs/lib/queries/audit-log.queries.ts \
  client/src/modules/audit-logs/page.tsx \
  client/src/modules/audit-logs/components/AuditLogTable.tsx \
  client/src/shared/components/DashboardSidebar.tsx \
  client/src/routes/index.tsx
git commit -m "feat: expose scoped audit log view for HR Admin in sidebar and page (FRS §11.4)"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] FRS §4.1–4.4 Admin blocked from CRUD → Task 1
- [x] FRS §4.5 HR mail ownership → Task 2
- [x] Raw req §6.3 No duplicate escalation → Task 3
- [x] FRS §11.4 Scoped audit log (HR Admin "All Cand") → Tasks 4 + 5
- [x] FR-4.2 EMAIL_SENT audit event → Task 2 (bonus, slotted in naturally)
- [ ] FRS §11.4 HR "Own" scoped view — backend supports it (Task 4) but no sidebar link or dedicated HR page. HR users are blocked at the route level and have no navigation entry. **This is acceptable for this plan** — HR audit access via candidate detail history is a separate FRS item (see `CandidateHistory` component).

**Placeholder scan:** None found. All steps contain exact file paths, complete code blocks, and exact curl commands.

**Type consistency:**
- `getScopedLogs(userId, role, query)` defined in service Task 4 Step 2, called from controller Task 4 Step 3 — parameter names match.
- `useScopedAuditLogList` defined in queries Task 5 Step 2, imported in `AuditLogTable` Task 5 Step 4 — name matches.
- `scoped?: boolean` prop defined and consumed in same task (Task 5 Steps 3–4) — consistent.
