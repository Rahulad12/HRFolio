# Auth & Permission Management — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded role-based auth with a proper Identity model + configurable per-role permission matrix, fixing the Google OAuth user-linking bug and giving Admins a UI to toggle what each role can do.

**Architecture:** Separate `Identity` (how a user logs in) from `User` (who they are + their role). Add a `RolePermissions` document per role stored in MongoDB. A `hasPermission(key)` middleware replaces the hardcoded `authorize([...])` calls — it reads from an in-memory cache backed by the DB so toggles take effect without restart. The frontend gets a `PermissionContext` that fetches the current user's flat permission list on login and gates UI elements.

**Tech Stack:** Node.js/Express, Mongoose, Passport.js (Google OAuth), React, TanStack Query, Zustand, TypeScript (client), JavaScript (server legacy)

---

## File Map

### Server — New files
| File | Responsibility |
|---|---|
| `server/src/legacy/model/Identity.js` | Mongoose model — links a user to one OAuth provider identity |
| `server/src/legacy/model/RolePermissions.js` | Mongoose model — permission map per role, with `locked` flag |
| `server/src/legacy/Data/SeedPermissions.js` | Seed script — inserts default permission matrix for HR / HR Admin / Admin |
| `server/src/shared/middleware/hasPermission.ts` | Middleware — checks a permission key against cached RolePermissions |
| `server/src/legacy/controllers/permissionController.js` | Controller — getMyPermissions, getRolePermissions, updateRolePermissions |

### Server — Modified files
| File | Change |
|---|---|
| `server/src/legacy/model/User.js` | Remove `googleId` field (now lives in Identity) |
| `server/src/legacy/config/passport.js` | Domain check + email fallback + link Identity on first login |
| `server/src/legacy/routes/authRoutes.js` | Add permission endpoints |
| `server/src/legacy/routes/candidateRoutes.js` | Replace `authorize()` with `hasPermission()` |
| `server/src/modules/audit-logs/routes/audit-logs.routes.ts` | Replace `authorize()` with `hasPermission()` |
| `server/src/modules/escalations/routes/escalations.routes.ts` | Replace `authorize()` with `hasPermission()` |

### Client — New files
| File | Responsibility |
|---|---|
| `client/src/shared/context/PermissionContext.tsx` | React context — stores flat permission list, exposes `can()` |
| `client/src/shared/hooks/usePermissions.ts` | Hook — `can(key)` shortcut that reads from PermissionContext |
| `client/src/shared/lib/api/permission.api.ts` | API call — GET /api/auth/me/permissions |
| `client/src/modules/settings/components/RolePermissionsManager.tsx` | Admin UI — permission toggle table per role |

### Client — Modified files
| File | Change |
|---|---|
| `client/src/App.tsx` | Wrap app in PermissionProvider |
| `client/src/shared/components/DashboardSidebar.tsx` | Replace `user.role === 'Admin'` checks with `can()` |
| `client/src/shared/components/ProtectedRoute.tsx` | Support permission-based guard in addition to role guard |
| `client/src/modules/settings/page.tsx` (or existing settings route) | Add RolePermissionsManager for Admin |

---

## Permission Key Reference

Used everywhere — backend middleware and frontend `can()`.

```
candidates:create       candidates:read       candidates:update       candidates:delete
interviews:create       interviews:read       interviews:update       interviews:delete
assessments:create      assessments:read      assessments:update      assessments:delete
offers:create           offers:read           offers:update           offers:delete
interviewers:create     interviewers:read     interviewers:update     interviewers:delete
email-templates:create  email-templates:read  email-templates:update  email-templates:delete
escalations:create      escalations:read      escalations:update
audit-logs:read
settings:manage
users:manage            (Admin only, always locked true)
```

---

## Default Permission Matrix (seeded)

| Permission | HR | HR Admin | Admin |
|---|---|---|---|
| candidates:create | ✅ | ✅ | ✅ |
| candidates:read | ✅ | ✅ | ✅ |
| candidates:update | ✅ | ✅ | ✅ |
| candidates:delete | ❌ | ✅ | ✅ |
| interviews:create | ✅ | ✅ | ✅ |
| interviews:read | ✅ | ✅ | ✅ |
| interviews:update | ✅ | ✅ | ✅ |
| interviews:delete | ❌ | ✅ | ✅ |
| assessments:create | ✅ | ✅ | ✅ |
| assessments:read | ✅ | ✅ | ✅ |
| assessments:update | ✅ | ✅ | ✅ |
| assessments:delete | ❌ | ✅ | ✅ |
| offers:create | ❌ | ✅ | ✅ |
| offers:read | ✅ | ✅ | ✅ |
| offers:update | ❌ | ✅ | ✅ |
| offers:delete | ❌ | ✅ | ✅ |
| interviewers:create | ❌ | ✅ | ✅ |
| interviewers:read | ✅ | ✅ | ✅ |
| interviewers:update | ❌ | ✅ | ✅ |
| interviewers:delete | ❌ | ✅ | ✅ |
| email-templates:create | ❌ | ✅ | ✅ |
| email-templates:read | ✅ | ✅ | ✅ |
| email-templates:update | ❌ | ✅ | ✅ |
| email-templates:delete | ❌ | ✅ | ✅ |
| escalations:create | ✅ | ✅ | ✅ |
| escalations:read | ✅ | ✅ | ✅ |
| escalations:update | ❌ | ✅ | ✅ |
| audit-logs:read | ❌ | ✅ | ✅ |
| settings:manage | ❌ | ❌ | ✅ |
| users:manage | ❌ | ❌ | ✅ |

---

### Task 1: Identity Model

**Files:**
- Create: `server/src/legacy/model/Identity.js`

- [ ] **Step 1: Create the Identity model**

```js
// server/src/legacy/model/Identity.js
import mongoose from 'mongoose'

const identitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true,
  },
  provider: {
    type: String,
    enum: ['google', 'azure', 'saml'],
    required: true,
  },
  externalId: {
    type: String,
    required: true,
  },
  providerEmail: {
    type: String,
    required: true,
  },
  linkedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true })

identitySchema.index({ provider: 1, externalId: 1 }, { unique: true })

const Identity = mongoose.model('identities', identitySchema)
export default Identity
```

- [ ] **Step 2: Remove googleId from User model**

In `server/src/legacy/model/User.js`, remove the `googleId` field:

```js
// server/src/legacy/model/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  role: { type: String, enum: ['HR', 'HR Admin', 'Admin'] },
  isLoggedIn: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

const User = mongoose.model('users', userSchema)
export default User
```

- [ ] **Step 3: Commit**

```bash
git add server/src/legacy/model/Identity.js server/src/legacy/model/User.js
git commit -m "feat(auth): add Identity model and remove googleId from User"
```

---

### Task 2: RolePermissions Model

**Files:**
- Create: `server/src/legacy/model/RolePermissions.js`

- [ ] **Step 1: Create the model**

```js
// server/src/legacy/model/RolePermissions.js
import mongoose from 'mongoose'

const rolePermissionsSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['HR', 'HR Admin', 'Admin'],
    required: true,
    unique: true,
  },
  permissions: {
    type: Map,
    of: Boolean,
    required: true,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
}, { timestamps: true })

const RolePermissions = mongoose.model('role_permissions', rolePermissionsSchema)
export default RolePermissions
```

- [ ] **Step 2: Commit**

```bash
git add server/src/legacy/model/RolePermissions.js
git commit -m "feat(auth): add RolePermissions model"
```

---

### Task 3: Seed Default Permissions

**Files:**
- Create: `server/src/legacy/Data/SeedPermissions.js`

- [ ] **Step 1: Create seed file**

```js
// server/src/legacy/Data/SeedPermissions.js
import RolePermissions from '../model/RolePermissions.js'

const DEFAULT_PERMISSIONS = {
  HR: {
    'candidates:create': true,  'candidates:read': true,  'candidates:update': true,  'candidates:delete': false,
    'interviews:create': true,  'interviews:read': true,  'interviews:update': true,  'interviews:delete': false,
    'assessments:create': true, 'assessments:read': true, 'assessments:update': true, 'assessments:delete': false,
    'offers:create': false,     'offers:read': true,      'offers:update': false,     'offers:delete': false,
    'interviewers:create': false, 'interviewers:read': true, 'interviewers:update': false, 'interviewers:delete': false,
    'email-templates:create': false, 'email-templates:read': true, 'email-templates:update': false, 'email-templates:delete': false,
    'escalations:create': true, 'escalations:read': true, 'escalations:update': false,
    'audit-logs:read': false,
    'settings:manage': false,
    'users:manage': false,
  },
  'HR Admin': {
    'candidates:create': true,  'candidates:read': true,  'candidates:update': true,  'candidates:delete': true,
    'interviews:create': true,  'interviews:read': true,  'interviews:update': true,  'interviews:delete': true,
    'assessments:create': true, 'assessments:read': true, 'assessments:update': true, 'assessments:delete': true,
    'offers:create': true,      'offers:read': true,      'offers:update': true,      'offers:delete': true,
    'interviewers:create': true, 'interviewers:read': true, 'interviewers:update': true, 'interviewers:delete': true,
    'email-templates:create': true, 'email-templates:read': true, 'email-templates:update': true, 'email-templates:delete': true,
    'escalations:create': true, 'escalations:read': true, 'escalations:update': true,
    'audit-logs:read': true,
    'settings:manage': false,
    'users:manage': false,
  },
  Admin: {
    'candidates:create': true,  'candidates:read': true,  'candidates:update': true,  'candidates:delete': true,
    'interviews:create': true,  'interviews:read': true,  'interviews:update': true,  'interviews:delete': true,
    'assessments:create': true, 'assessments:read': true, 'assessments:update': true, 'assessments:delete': true,
    'offers:create': true,      'offers:read': true,      'offers:update': true,      'offers:delete': true,
    'interviewers:create': true, 'interviewers:read': true, 'interviewers:update': true, 'interviewers:delete': true,
    'email-templates:create': true, 'email-templates:read': true, 'email-templates:update': true, 'email-templates:delete': true,
    'escalations:create': true, 'escalations:read': true, 'escalations:update': true,
    'audit-logs:read': true,
    'settings:manage': true,
    'users:manage': true,
  },
}

export async function seedPermissions() {
  for (const [role, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
    const existing = await RolePermissions.findOne({ role })
    if (!existing) {
      await RolePermissions.create({
        role,
        permissions,
        locked: role === 'Admin',
      })
      console.log(`Seeded permissions for ${role}`)
    } else {
      console.log(`Permissions for ${role} already exist — skipping`)
    }
  }
}
```

- [ ] **Step 2: Call seed from server startup**

In `server/src/legacy/index.js`, add after DB connection is established:

```js
import { seedPermissions } from './Data/SeedPermissions.js'

// After mongoose.connect succeeds:
await seedPermissions()
```

Find the DB connection in `server/src/legacy/config/db.js` and call it there, or call it in `server/src/index.ts` after the DB connects. Add to existing connect callback:

```js
// server/src/legacy/config/db.js — add at end of connectDB():
import { seedPermissions } from '../Data/SeedPermissions.js'
// inside the connect().then():
await seedPermissions()
```

- [ ] **Step 3: Commit**

```bash
git add server/src/legacy/Data/SeedPermissions.js server/src/legacy/config/db.js
git commit -m "feat(auth): seed default role permissions on startup"
```

---

### Task 4: hasPermission Middleware

**Files:**
- Create: `server/src/shared/middleware/hasPermission.ts`

- [ ] **Step 1: Create the middleware with in-memory cache**

```ts
// server/src/shared/middleware/hasPermission.ts
import { Request, Response, NextFunction } from 'express'
import RolePermissions from '../../legacy/model/RolePermissions.js'

// In-memory cache: role → permissions map
const cache = new Map<string, Record<string, boolean>>()
let cacheLoadedAt = 0
const CACHE_TTL_MS = 60_000 // 60 seconds

async function loadPermissions(role: string): Promise<Record<string, boolean>> {
  const now = Date.now()
  if (cache.has(role) && now - cacheLoadedAt < CACHE_TTL_MS) {
    return cache.get(role)!
  }
  const doc = await RolePermissions.findOne({ role })
  if (!doc) return {}
  const perms = Object.fromEntries(doc.permissions)
  cache.set(role, perms)
  cacheLoadedAt = now
  return perms
}

export function invalidatePermissionCache() {
  cache.clear()
  cacheLoadedAt = 0
}

export function hasPermission(key: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = (req as any).user
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }
    // Admin with locked=true always passes
    if (user.role === 'Admin') {
      next()
      return
    }
    const perms = await loadPermissions(user.role)
    if (!perms[key]) {
      res.status(403).json({ success: false, message: `Forbidden: missing permission '${key}'` })
      return
    }
    next()
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add server/src/shared/middleware/hasPermission.ts
git commit -m "feat(auth): add hasPermission middleware with TTL cache"
```

---

### Task 5: Fix Passport.js — Email Fallback + Identity Linking

**Files:**
- Modify: `server/src/legacy/config/passport.js`

- [ ] **Step 1: Rewrite passport strategy**

Replace the entire file content:

```js
// server/src/legacy/config/passport.js
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import User from '../model/User.js'
import Identity from '../model/Identity.js'
import dotenv from 'dotenv'
dotenv.config()

const ALLOWED_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN // e.g. "amniltech.com"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value

        // Rule 1: Domain restriction (skip if env var not set — dev mode)
        if (ALLOWED_DOMAIN && !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
          return done(null, false, { message: 'Only company emails are allowed' })
        }

        // Rule 2: Find by existing identity (returning user)
        const existingIdentity = await Identity.findOne({
          provider: 'google',
          externalId: profile.id,
        }).populate('userId')

        if (existingIdentity) {
          return done(null, existingIdentity.userId)
        }

        // Rule 3: First-time login — find pre-created User by email
        const user = await User.findOne({ email })
        if (!user) {
          return done(null, false, { message: 'Account not found. Contact your administrator.' })
        }

        // Link this Google identity to the existing User
        await Identity.create({
          userId: user._id,
          provider: 'google',
          externalId: profile.id,
          providerEmail: email,
        })

        // Update picture from Google profile if not set
        if (!user.picture) {
          user.picture = profile.photos[0]?.value || ''
          await user.save()
        }

        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)
```

- [ ] **Step 2: Add ALLOWED_EMAIL_DOMAIN to .env.example**

In `server/.env` (and any `.env.example` file), add:
```
ALLOWED_EMAIL_DOMAIN=amniltech.com
```
Leave it blank/commented for local dev to allow any Google account.

- [ ] **Step 3: Commit**

```bash
git add server/src/legacy/config/passport.js server/.env
git commit -m "fix(auth): email fallback + identity linking in passport strategy"
```

---

### Task 6: Permissions API Endpoints

**Files:**
- Create: `server/src/legacy/controllers/permissionController.js`
- Modify: `server/src/legacy/routes/authRoutes.js`

- [ ] **Step 1: Create permission controller**

```js
// server/src/legacy/controllers/permissionController.js
import RolePermissions from '../model/RolePermissions.js'
import { invalidatePermissionCache } from '../../shared/middleware/hasPermission.ts'

// GET /api/auth/me/permissions
// Returns flat array of permitted keys for the logged-in user's role
export const getMyPermissions = async (req, res) => {
  try {
    const doc = await RolePermissions.findOne({ role: req.user.role })
    if (!doc) {
      return res.status(200).json({ success: true, data: [] })
    }
    const permitted = []
    for (const [key, value] of doc.permissions.entries()) {
      if (value) permitted.push(key)
    }
    return res.status(200).json({ success: true, data: permitted })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/auth/role-permissions  — Admin only
// Returns all three role permission documents
export const getAllRolePermissions = async (req, res) => {
  try {
    const docs = await RolePermissions.find({}).sort({ role: 1 })
    const result = docs.map((doc) => ({
      role: doc.role,
      locked: doc.locked,
      permissions: Object.fromEntries(doc.permissions),
    }))
    return res.status(200).json({ success: true, data: result })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// PATCH /api/auth/role-permissions  — Admin only
// Body: { role: "HR", key: "candidates:delete", value: true }
export const updateRolePermission = async (req, res) => {
  try {
    const { role, key, value } = req.body
    if (!role || !key || typeof value !== 'boolean') {
      return res.status(400).json({ success: false, message: 'role, key, and value (boolean) are required' })
    }

    const doc = await RolePermissions.findOne({ role })
    if (!doc) {
      return res.status(404).json({ success: false, message: `Role '${role}' not found` })
    }
    if (doc.locked) {
      return res.status(403).json({ success: false, message: `Permissions for '${role}' are locked` })
    }

    doc.permissions.set(key, value)
    doc.updatedBy = req.user.id
    await doc.save()

    // Invalidate cache so change takes effect immediately
    invalidatePermissionCache()

    return res.status(200).json({ success: true, message: 'Permission updated', data: Object.fromEntries(doc.permissions) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
```

- [ ] **Step 2: Add routes to authRoutes.js**

```js
// server/src/legacy/routes/authRoutes.js — add these imports at top
import { getMyPermissions, getAllRolePermissions, updateRolePermission } from '../controllers/permissionController.js'
import { hasPermission } from '../../shared/middleware/hasPermission.ts'

// Add these routes (after existing routes):
authRouter.get('/me/permissions', authenticate, getMyPermissions)
authRouter.get('/role-permissions', authenticate, authorize(['Admin']), getAllRolePermissions)
authRouter.patch('/role-permissions', authenticate, authorize(['Admin']), updateRolePermission)
```

- [ ] **Step 3: Commit**

```bash
git add server/src/legacy/controllers/permissionController.js server/src/legacy/routes/authRoutes.js
git commit -m "feat(auth): add permission API endpoints"
```

---

### Task 7: Replace authorize() with hasPermission() in Routes

**Files:**
- Modify: `server/src/legacy/routes/candidateRoutes.js`
- Modify: `server/src/modules/audit-logs/routes/audit-logs.routes.ts`
- Modify: `server/src/modules/escalations/routes/escalations.routes.ts`

- [ ] **Step 1: Update candidateRoutes.js**

```js
// server/src/legacy/routes/candidateRoutes.js
import express from 'express'
import { createCandidate, getCandidateById, getAllCandidates, deleteCandidates, updateCandidate, getCandidateLogsByCandidateId, changeCandidateStage, rejectCandidate } from '../controllers/candidateController.js'
import { authenticate, checkUserExist } from '../middleware/auhtMiddleware.js'
import { hasPermission } from '../../shared/middleware/hasPermission.ts'

const candidateRouter = express.Router()

candidateRouter.get('/', authenticate, checkUserExist, hasPermission('candidates:read'), getAllCandidates)
candidateRouter.get('/log/:id', authenticate, checkUserExist, hasPermission('candidates:read'), getCandidateLogsByCandidateId)
candidateRouter.get('/:id', authenticate, checkUserExist, hasPermission('candidates:read'), getCandidateById)
candidateRouter.post('/', authenticate, checkUserExist, hasPermission('candidates:create'), createCandidate)
candidateRouter.put('/reject/:id', authenticate, checkUserExist, hasPermission('candidates:update'), rejectCandidate)
candidateRouter.put('/stage/:id', authenticate, checkUserExist, hasPermission('candidates:update'), changeCandidateStage)
candidateRouter.put('/:id', authenticate, checkUserExist, hasPermission('candidates:update'), updateCandidate)
candidateRouter.delete('/', authenticate, checkUserExist, hasPermission('candidates:delete'), deleteCandidates)

export default candidateRouter
```

- [ ] **Step 2: Update audit-logs routes**

```ts
// server/src/modules/audit-logs/routes/audit-logs.routes.ts
import { hasPermission } from '../../../shared/middleware/hasPermission'
// replace:
//   authorize(['Admin'])       → hasPermission('audit-logs:read')
//   authorize(['HR Admin','HR']) → hasPermission('audit-logs:read')

router.get('/', authenticate, hasPermission('audit-logs:read'), auditLogController.getLogs)
router.get('/my-scope', authenticate, hasPermission('audit-logs:read'), auditLogController.getScopedLogs)
```

- [ ] **Step 3: Update escalations routes**

```ts
// server/src/modules/escalations/routes/escalations.routes.ts
import { hasPermission } from '../../../shared/middleware/hasPermission'

router.post('/raise', authenticate, hasPermission('escalations:create'), escalationController.raiseLevel1)
router.post('/:id/escalate', authenticate, hasPermission('escalations:update'), escalationController.escalateToLevel2)
router.post('/:id/resolve', authenticate, hasPermission('escalations:update'), escalationController.resolve)
router.post('/:id/cancel', authenticate, hasPermission('escalations:create'), escalationController.cancel)
```

- [ ] **Step 4: Commit**

```bash
git add server/src/legacy/routes/candidateRoutes.js \
        server/src/modules/audit-logs/routes/audit-logs.routes.ts \
        server/src/modules/escalations/routes/escalations.routes.ts
git commit -m "feat(auth): replace authorize() with hasPermission() in routes"
```

---

### Task 8: Frontend — PermissionContext

**Files:**
- Create: `client/src/shared/lib/api/permission.api.ts`
- Create: `client/src/shared/context/PermissionContext.tsx`
- Create: `client/src/shared/hooks/usePermissions.ts`

- [ ] **Step 1: Create permission API call**

```ts
// client/src/shared/lib/api/permission.api.ts
import { GET } from '@/shared/lib/axios'

export function fetchMyPermissions(): Promise<{ success: boolean; data: string[] }> {
  return GET<{ success: boolean; data: string[] }>('/auth/me/permissions')
}
```

- [ ] **Step 2: Create PermissionContext**

```tsx
// client/src/shared/context/PermissionContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchMyPermissions } from '@/shared/lib/api/permission.api'
import { useAuth } from '@/shared/hooks/useAuth'

interface PermissionContextValue {
  permissions: string[]
  can: (key: string) => boolean
  isLoaded: boolean
}

const PermissionContext = createContext<PermissionContextValue>({
  permissions: [],
  can: () => false,
  isLoaded: false,
})

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      setPermissions([])
      setIsLoaded(false)
      return
    }
    fetchMyPermissions()
      .then((res) => setPermissions(res.data))
      .catch(() => setPermissions([]))
      .finally(() => setIsLoaded(true))
  }, [isAuthenticated])

  const can = (key: string) => permissions.includes(key)

  return (
    <PermissionContext.Provider value={{ permissions, can, isLoaded }}>
      {children}
    </PermissionContext.Provider>
  )
}

export function usePermissionContext() {
  return useContext(PermissionContext)
}
```

- [ ] **Step 3: Create usePermissions hook**

```ts
// client/src/shared/hooks/usePermissions.ts
import { usePermissionContext } from '@/shared/context/PermissionContext'

export function usePermissions() {
  const { can, permissions, isLoaded } = usePermissionContext()
  return { can, permissions, isLoaded }
}
```

- [ ] **Step 4: Wrap app with PermissionProvider in App.tsx**

In `client/src/App.tsx`, add `PermissionProvider` inside `AuthProvider`:

```tsx
import { PermissionProvider } from '@/shared/context/PermissionContext'

// Inside AppContent return:
<ConfigProvider theme={antTheme}>
  <AntApp>
    <PermissionProvider>
      <RouterProvider router={router} />
    </PermissionProvider>
  </AntApp>
</ConfigProvider>
```

- [ ] **Step 5: Commit**

```bash
git add client/src/shared/lib/api/permission.api.ts \
        client/src/shared/context/PermissionContext.tsx \
        client/src/shared/hooks/usePermissions.ts \
        client/src/App.tsx
git commit -m "feat(auth): add PermissionContext and usePermissions hook"
```

---

### Task 9: Update Sidebar and ProtectedRoute with Permission Guards

**Files:**
- Modify: `client/src/shared/components/DashboardSidebar.tsx`
- Modify: `client/src/shared/components/ProtectedRoute.tsx`

- [ ] **Step 1: Update DashboardSidebar to use can()**

Replace the `user.role === 'Admin'` checks:

```tsx
// client/src/shared/components/DashboardSidebar.tsx
import { usePermissions } from '@/shared/hooks/usePermissions'

// Inside DashboardSidebar():
const { can } = usePermissions()

const links = [
  { key: '/dashboard', icon: <LayoutDashboard size={18} />, label: <Link to="/dashboard">Dashboard</Link> },
  { key: '/dashboard/candidates', icon: <Users size={18} />, label: <Link to="/dashboard/candidates">Candidates</Link> },
  {
    key: 'assessments', icon: <UserRound size={18} />, label: 'Assessments',
    children: [
      { key: '/dashboard/assessments', label: <Link to="/dashboard/assessments">Assessments</Link> },
      { key: '/dashboard/assessments/assignments', label: <Link to="/dashboard/assessments/assignments">Manage Assessment</Link> },
    ],
  },
  { key: '/dashboard/interviews', icon: <CalendarClock size={18} />, label: <Link to="/dashboard/interviews">Interviews</Link> },
  { key: '/dashboard/interviewers', icon: <UserPlus size={20} />, label: <Link to="/dashboard/interviewers">Interviewers</Link> },
  { key: '/dashboard/offers', icon: <FileSignature size={20} />, label: <Link to="/dashboard/offers">Offer</Link> },
  { key: '/dashboard/email-templates', icon: <InboxIcon size={20} />, label: <Link to="/dashboard/email-templates">Email Templates</Link> },
  { key: '/dashboard/escalations', icon: <AlertCircle size={20} />, label: <Link to="/dashboard/escalations">Escalations</Link> },
  ...(can('audit-logs:read') ? [
    { key: '/dashboard/audit-logs', icon: <ClipboardList size={20} />, label: <Link to="/dashboard/audit-logs">Audit Logs</Link> },
  ] : []),
  ...(can('users:manage') ? [
    { key: '/dashboard/user-management', icon: <ShieldCheck size={20} />, label: <Link to="/dashboard/user-management">User Management</Link> },
  ] : []),
  ...(can('settings:manage') ? [
    { key: '/dashboard/settings/lookup-values', icon: <Settings size={20} />, label: <Link to="/dashboard/settings/lookup-values">Settings</Link> },
  ] : []),
]
```

- [ ] **Step 2: Update ProtectedRoute to support permission guard**

```tsx
// client/src/shared/components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router'
import { Spin } from 'antd'
import { useAuth } from '@/shared/hooks/useAuth'
import { usePermissions } from '@/shared/hooks/usePermissions'

interface Props {
  allowedRoles?: string[]
  requiredPermission?: string
}

export function ProtectedRoute({ allowedRoles, requiredPermission }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { can, isLoaded } = usePermissions()

  if (isLoading || (isAuthenticated && !isLoaded)) {
    return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/shared/components/DashboardSidebar.tsx \
        client/src/shared/components/ProtectedRoute.tsx
git commit -m "feat(auth): wire permission guards into sidebar and ProtectedRoute"
```

---

### Task 10: Admin Permission Toggle UI

**Files:**
- Create: `client/src/modules/settings/components/RolePermissionsManager.tsx`

- [ ] **Step 1: Create the toggle UI component**

```tsx
// client/src/modules/settings/components/RolePermissionsManager.tsx
import { useState } from 'react'
import { Card, Switch, Tabs, Typography, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GET, PATCH } from '@/shared/lib/axios'

interface RolePerms { role: string; locked: boolean; permissions: Record<string, boolean> }

const RESOURCE_GROUPS = [
  { label: 'Candidates',       keys: ['candidates:create', 'candidates:read', 'candidates:update', 'candidates:delete'] },
  { label: 'Interviews',       keys: ['interviews:create', 'interviews:read', 'interviews:update', 'interviews:delete'] },
  { label: 'Assessments',      keys: ['assessments:create', 'assessments:read', 'assessments:update', 'assessments:delete'] },
  { label: 'Offers',           keys: ['offers:create', 'offers:read', 'offers:update', 'offers:delete'] },
  { label: 'Interviewers',     keys: ['interviewers:create', 'interviewers:read', 'interviewers:update', 'interviewers:delete'] },
  { label: 'Email Templates',  keys: ['email-templates:create', 'email-templates:read', 'email-templates:update', 'email-templates:delete'] },
  { label: 'Escalations',      keys: ['escalations:create', 'escalations:read', 'escalations:update'] },
  { label: 'Audit Logs',       keys: ['audit-logs:read'] },
  { label: 'Settings',         keys: ['settings:manage'] },
  { label: 'Users',            keys: ['users:manage'] },
]

function PermissionTable({ roleData }: { roleData: RolePerms }) {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: ({ key, value }: { key: string; value: boolean }) =>
      PATCH('/auth/role-permissions', { role: roleData.role, key, value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] })
      message.success('Permission updated')
    },
    onError: () => message.error('Failed to update permission'),
  })

  return (
    <div className="space-y-4">
      {RESOURCE_GROUPS.map((group) => (
        <div key={group.label}>
          <Typography.Text strong className="text-sm uppercase tracking-wide text-slate-500">
            {group.label}
          </Typography.Text>
          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            {group.keys.map((key) => {
              const action = key.split(':')[1]
              return (
                <div key={key} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700">
                  <span className="text-xs capitalize text-slate-600 dark:text-slate-300">{action}</span>
                  <Switch
                    size="small"
                    checked={roleData.permissions[key] ?? false}
                    disabled={roleData.locked}
                    onChange={(checked) => mutate({ key, value: checked })}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {roleData.locked && (
        <Typography.Text type="secondary" className="text-xs">
          🔒 Admin permissions are locked and cannot be modified.
        </Typography.Text>
      )}
    </div>
  )
}

export function RolePermissionsManager() {
  const [activeRole, setActiveRole] = useState('HR')

  const { data, isLoading } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: () => GET<{ success: boolean; data: RolePerms[] }>('/auth/role-permissions'),
  })

  const roles = data?.data ?? []
  const active = roles.find((r) => r.role === activeRole)

  return (
    <Card title="Role Permissions" loading={isLoading}>
      <Tabs
        activeKey={activeRole}
        onChange={setActiveRole}
        items={['HR', 'HR Admin', 'Admin'].map((role) => ({
          key: role,
          label: role,
          children: active && active.role === role
            ? <PermissionTable roleData={active} />
            : null,
        }))}
      />
    </Card>
  )
}
```

- [ ] **Step 2: Add to settings page**

Find or create `client/src/modules/settings/page.tsx`. Import and render `RolePermissionsManager` below existing settings content:

```tsx
import { RolePermissionsManager } from './components/RolePermissionsManager'

// In the settings page render:
<div className="space-y-6">
  <LookupValuesManager />     {/* existing */}
  <RolePermissionsManager />  {/* new */}
</div>
```

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/settings/components/RolePermissionsManager.tsx \
        client/src/modules/settings/page.tsx
git commit -m "feat(auth): add role permissions toggle UI for Admin"
```

---

## Self-Review

**Spec coverage:**
- ✅ Identity model — Task 1
- ✅ RolePermissions model — Task 2
- ✅ Seed default permissions — Task 3
- ✅ hasPermission middleware with cache — Task 4
- ✅ Passport.js fix (domain + email fallback + identity link) — Task 5
- ✅ Permission API endpoints (me/permissions, role-permissions CRUD) — Task 6
- ✅ Routes updated to hasPermission — Task 7
- ✅ Frontend PermissionContext + usePermissions hook — Task 8
- ✅ Sidebar + ProtectedRoute use can() — Task 9
- ✅ Admin toggle UI — Task 10
- ✅ Admin is locked (cannot reduce Admin permissions) — Task 2 + Task 6 controller
- ✅ Cache invalidated on permission update — Task 4 + Task 6

**Placeholder scan:** No TBDs. All code blocks are complete.

**Type consistency:**
- `hasPermission('candidates:read')` — matches key format used in SeedPermissions
- `can('candidates:read')` — calls `permissions.includes(key)` where permissions is `string[]` from `/me/permissions`
- `fetchMyPermissions()` returns `{ success, data: string[] }` — matches what PermissionContext reads
- `invalidatePermissionCache()` exported from hasPermission.ts — imported in permissionController.js
