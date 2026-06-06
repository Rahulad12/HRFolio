# Auth Hardening: Refresh Tokens & Token Revocation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 30-day JWT with a 1-day access token + 7-day httpOnly-cookie refresh token, enabling server-side revocation when an admin deactivates a user, without changing the Google OAuth redirect scheme.

**Architecture:** The access token stays short-lived in localStorage (1 day). A separate opaque refresh token is stored in an httpOnly cookie — XSS cannot read it. On 401, the axios interceptor silently POSTs `/api/auth/refresh` (cookie sent automatically), gets a fresh access token, and retries the original request. Deactivating a user revokes all their refresh tokens in the DB, so the next silent refresh fails and logs them out.

**Tech Stack:** Express.js, Mongoose (MongoDB), `crypto` (Node built-in), `cookie-parser` middleware, axios interceptors (frontend)

---

## File Map

**New files:**
- `server/src/legacy/model/RefreshToken.js` — Mongoose model: `{ userId, tokenHash, expiresAt, revokedAt }`
- `server/src/legacy/utils/tokenUtils.js` — `generateRefreshToken()`, `hashToken(raw)` helpers

**Modified files:**
- `server/src/app.ts` — add `cookie-parser` middleware
- `server/src/legacy/controllers/userController.js` — `googleCallback` issues refresh token cookie; `bannedUser` revokes all refresh tokens on deactivate; new `refreshToken` and `logout` handlers
- `server/src/legacy/routes/authRoutes.js` — add `POST /refresh` and `POST /logout` routes
- `client/src/shared/lib/axios.ts` — add 401 response interceptor for silent refresh
- `server/src/index.ts` — add JWT_SECRET strength warning on startup

---

## Task 1: Install cookie-parser and wire it up

**Files:**
- Modify: `server/src/app.ts`

- [ ] **Step 1: Install the package**

```bash
cd server && npm install cookie-parser && npm install --save-dev @types/cookie-parser
```

Expected output: `added X packages`

- [ ] **Step 2: Add cookie-parser to Express app**

Open `server/src/app.ts`. It already imports `cors`, `express`, etc. Add `cookie-parser` after the existing imports and before the first `app.use`:

```typescript
// add this import at the top
import cookieParser from 'cookie-parser';

// add this line right after: app.use(express.json())
app.use(cookieParser());
```

- [ ] **Step 3: Verify server still starts**

```bash
cd server && node --loader ts-node/esm src/index.ts 2>&1 | head -5
```

Expected: server starts, no errors about cookieParser.

- [ ] **Step 4: Commit**

```bash
git add server/src/app.ts server/package.json server/package-lock.json
git commit -m "feat(auth): add cookie-parser middleware for refresh token cookie"
```

---

## Task 2: Create RefreshToken model and helpers

**Files:**
- Create: `server/src/legacy/model/RefreshToken.js`
- Create: `server/src/legacy/utils/tokenUtils.js`

- [ ] **Step 1: Create tokenUtils.js**

```javascript
// server/src/legacy/utils/tokenUtils.js
import crypto from 'crypto';

export function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

export function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}
```

- [ ] **Step 2: Create RefreshToken.js**

```javascript
// server/src/legacy/model/RefreshToken.js
import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Auto-delete expired tokens after they expire (TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
```

- [ ] **Step 3: Commit**

```bash
git add server/src/legacy/model/RefreshToken.js server/src/legacy/utils/tokenUtils.js
git commit -m "feat(auth): add RefreshToken model and token hashing helpers"
```

---

## Task 3: Shorten JWT to 1 day and issue refresh token on login

**Files:**
- Modify: `server/src/legacy/controllers/userController.js` (the `googleCallback` function)

The current `googleCallback` does:
```javascript
const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });
res.redirect(`${frontendURL}/login/?token=${token}&...`);
```

- [ ] **Step 1: Add imports at the top of userController.js**

Find the existing imports block (top of the file) and add:

```javascript
import RefreshToken from '../model/RefreshToken.js';
import { generateRefreshToken, hashToken } from '../utils/tokenUtils.js';
```

- [ ] **Step 2: Replace the token-signing block in googleCallback**

Find this block (around line 25-35 of the function):

```javascript
const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "30d" }
);
```

Replace it with:

```javascript
const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' }
);

const rawRefresh = generateRefreshToken();
await RefreshToken.create({
  userId: user._id,
  tokenHash: hashToken(rawRefresh),
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});
res.cookie('refreshToken', rawRefresh, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
});
```

- [ ] **Step 3: Log in with Google and confirm cookie is set**

Open DevTools → Application → Cookies → `http://localhost:5000`. After login you should see `refreshToken` with HttpOnly checked.

Also confirm the token in the URL redirect is shorter — paste it at `jwt.io` and the `exp` should be 1 day from now.

- [ ] **Step 4: Commit**

```bash
git add server/src/legacy/controllers/userController.js
git commit -m "feat(auth): shorten JWT to 1d and issue 7d refresh token as httpOnly cookie on Google login"
```

---

## Task 4: Add POST /api/auth/refresh endpoint

**Files:**
- Modify: `server/src/legacy/controllers/userController.js` — add `refreshToken` handler
- Modify: `server/src/legacy/routes/authRoutes.js` — add route

- [ ] **Step 1: Write the refreshToken controller function**

Add this function at the bottom of `userController.js` (before module.exports or after the last export):

```javascript
export const refreshToken = async (req, res) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (!raw) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const hashed = hashToken(raw);
    const stored = await RefreshToken.findOne({ tokenHash: hashed });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      res.clearCookie('refreshToken', { path: '/' });
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(stored.userId);
    if (!user || user.status === 'inactive') {
      await RefreshToken.updateMany({ userId: stored.userId }, { revokedAt: new Date() });
      res.clearCookie('refreshToken', { path: '/' });
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }

    // Rotate: revoke old, issue new
    stored.revokedAt = new Date();
    await stored.save();

    const newRaw = generateRefreshToken();
    await RefreshToken.create({
      userId: user._id,
      tokenHash: hashToken(newRaw),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie('refreshToken', newRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token: newToken,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    logger.error('Error refreshing token', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
```

- [ ] **Step 2: Add POST /api/auth/logout handler**

Add this function after `refreshToken` in `userController.js`:

```javascript
export const logout = async (req, res) => {
  try {
    const raw = req.cookies?.refreshToken;
    if (raw) {
      const hashed = hashToken(raw);
      await RefreshToken.updateOne({ tokenHash: hashed }, { revokedAt: new Date() });
    }
    res.clearCookie('refreshToken', { path: '/' });
    return res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
```

- [ ] **Step 3: Register the routes in authRoutes.js**

Open `server/src/legacy/routes/authRoutes.js`. Find the existing imports and add `refreshToken` and `logout`:

```javascript
import { ..., refreshToken, logout } from '../controllers/userController.js';
```

Then add the routes (no auth middleware needed — the cookie IS the auth):

```javascript
router.post('/auth/refresh', refreshToken);
router.post('/auth/logout', logout);
```

- [ ] **Step 4: Manual test the refresh endpoint**

First, log in via Google to get a refreshToken cookie. Then:

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Cookie: refreshToken=<paste-raw-value-from-devtools>" \
  -v
```

Expected: 200 with `{ success: true, token: "...", email: "...", role: "..." }`

Second call with same cookie (should get a new token, old cookie is rotated):
```bash
# same command — expect 401 because first call rotated the token
```

- [ ] **Step 5: Commit**

```bash
git add server/src/legacy/controllers/userController.js server/src/legacy/routes/authRoutes.js
git commit -m "feat(auth): add POST /auth/refresh (token rotation) and POST /auth/logout endpoints"
```

---

## Task 5: Revoke refresh tokens on user deactivation

**Files:**
- Modify: `server/src/legacy/controllers/userController.js` — update `bannedUser` handler

- [ ] **Step 1: Find the bannedUser function**

It looks like this:

```javascript
export const bannedUser = async (req, res) => {
  ...
  user.status = user.status === "active" ? "inactive" : "active";
  await user.save();
  ...
};
```

- [ ] **Step 2: Add revocation when setting to inactive**

After `const beforeStatus = user.status;` and before `user.status = ...`, add:

```javascript
const newStatus = user.status === 'active' ? 'inactive' : 'active';

if (newStatus === 'inactive') {
  await RefreshToken.updateMany(
    { userId: user._id, revokedAt: null },
    { revokedAt: new Date() }
  );
  logger.info(`Revoked all refresh tokens for deactivated user ${user.email}`);
}

user.status = newStatus;
```

Remove the old `user.status = user.status === "active" ? "inactive" : "active";` line.

- [ ] **Step 3: Test revocation flow**

1. Log in as an HR user (Google login). Confirm the refreshToken cookie is set.
2. In User Management (Admin role), deactivate that HR user.
3. Wait for the 1-day JWT to expire (or manually clear the `token` from localStorage in DevTools).
4. Reload the page — the axios interceptor should call `/auth/refresh`, which should return 401 (tokens revoked).
5. The user should be redirected to `/login`.

For a quicker test without waiting 1 day: temporarily change `expiresIn: '1d'` to `expiresIn: '5s'` in `googleCallback`, log in, wait 5 seconds, then reload. Confirm redirect to login.

- [ ] **Step 4: Commit**

```bash
git add server/src/legacy/controllers/userController.js
git commit -m "feat(auth): revoke all refresh tokens when admin deactivates a user"
```

---

## Task 6: Frontend — silent token refresh in axios interceptor

**Files:**
- Modify: `client/src/shared/lib/axios.ts`

Current `handleError` clears localStorage and redirects only on 401. We need to try `/auth/refresh` first.

- [ ] **Step 1: Add a refresh flag to prevent infinite loops**

The risk: if `/auth/refresh` itself returns 401, we'd loop. Track retries with a flag on the config.

Replace the entire `client/src/shared/lib/axios.ts` with:

```typescript
import axios, { AxiosError } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const client = axios.create({
  baseURL: API_BASE_URL + '/api/',
  withCredentials: true,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

function onRefreshSuccess(token: string) {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !original?._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            if (original) {
              original.headers = original.headers ?? {}
              original.headers.Authorization = `Bearer ${token}`
              resolve(client(original))
            }
          })
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newToken: string = data.token
        localStorage.setItem('token', newToken)
        onRefreshSuccess(newToken)
        if (original) {
          original.headers = original.headers ?? {}
          original.headers.Authorization = `Bearer ${newToken}`
          return client(original)
        }
      } catch {
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    const data = error.response?.data as Record<string, unknown> | undefined
    throw new ApiError(
      error.response?.status || 500,
      (data?.message as string) || error.message || 'Unknown error',
      data?.errors as Record<string, string[]> | undefined,
    )
  }
)

export async function GET<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await client.get<T>(url, { params })
  return data
}

export async function POST<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await client.post<T>(url, body)
  return data
}

export async function PUT<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await client.put<T>(url, body)
  return data
}

export async function PATCH<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await client.patch<T>(url, body)
  return data
}

export async function DELETE<T>(url: string): Promise<T> {
  const { data } = await client.delete<T>(url)
  return data
}
```

Note: removed try/catch wrappers per-method — errors bubble up as `AxiosError` which the response interceptor converts to `ApiError`. The interceptor is the single error gate.

- [ ] **Step 2: Verify API calls still work**

```bash
cd client && npm run build 2>&1 | tail -5
```

Expected: build succeeds, no TypeScript errors.

- [ ] **Step 3: Test silent refresh manually**

1. Log in (you get a 1d JWT in localStorage).
2. Open DevTools → Application → Local Storage → delete the `token` key.
3. Set it to an obviously expired JWT (any random string).
4. Navigate to a protected page (e.g., `/dashboard/candidates`).
5. The 401 response interceptor should call `/api/auth/refresh`, get a new token, store it, and retry the original request.
6. The page should load normally without redirecting to login.

- [ ] **Step 4: Commit**

```bash
git add client/src/shared/lib/axios.ts
git commit -m "feat(auth): silent token refresh — 401 interceptor calls /auth/refresh before logging out"
```

---

## Task 7: JWT_SECRET strength warning on startup

**Files:**
- Modify: `server/src/index.ts`

- [ ] **Step 1: Add the warning after imports**

Find the startup section of `server/src/index.ts`. Add this block before `connectDB()` or wherever the server starts:

```typescript
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn(
    '\x1b[33m⚠ WARNING: JWT_SECRET is missing or too short (< 32 chars). ' +
    'Generate a strong secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))" \x1b[0m'
  );
}
```

- [ ] **Step 2: Generate a real secret and update .env**

Run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output. Open `.env` (root) and `server/.env`. Replace:
```
JWT_SECRET=mail@au185
```
with:
```
JWT_SECRET=<your-64-char-hex-string>
```

Update both files. Then restart the server to verify the warning is gone.

**Note:** Changing JWT_SECRET invalidates all existing JWTs. All currently-logged-in users will be logged out. The refresh token flow will re-authenticate them automatically if their refresh cookie is still valid. If not, they'll go through Google OAuth again. This is expected behavior.

- [ ] **Step 3: Commit**

```bash
git add server/src/index.ts server/.env .env
git commit -m "feat(auth): add startup warning for weak JWT_SECRET + generate strong secret"
```

---

## Task 8: Cleanup — remove TTL-expired refresh tokens index (production note)

MongoDB TTL indexes fire once per minute. In a high-volume deployment you may want a cron job to purge old tokens. For this project's scale (< 50 users), the TTL index is sufficient.

- [ ] **Step 1: Verify TTL index was created**

```bash
mongosh hrfolio --eval "db.refreshtokens.getIndexes()" 2>/dev/null
```

Expected: an index entry with `{ expiresAt: 1 }` and `expireAfterSeconds: 0`.

If not present (e.g., the model was defined before the collection existed), force creation:

```bash
mongosh hrfolio --eval "db.refreshtokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })"
```

- [ ] **Step 2: Final smoke test checklist**

Run these manually:
1. [ ] Google login works → refreshToken cookie set + 1d JWT in localStorage
2. [ ] Navigating the app works (API calls succeed)
3. [ ] Manual JWT expiry simulation (delete/corrupt token in localStorage) → silent refresh → page loads
4. [ ] Admin deactivates a user → that user's refresh tokens are revoked → their next refresh attempt returns 401 → they are redirected to login
5. [ ] `POST /api/auth/logout` clears cookie and revokes token
6. [ ] Startup shows no JWT_SECRET warning

- [ ] **Step 3: Commit any final adjustments**

```bash
git add -A
git commit -m "chore(auth): verify TTL index on refreshtokens collection"
```

---

## Self-Review

**Spec coverage:**
- [x] JWT shortened from 30d to 1d — Task 3
- [x] Refresh token as httpOnly cookie — Tasks 2, 3
- [x] Token rotation on each refresh — Task 4
- [x] Revocation when user deactivated — Task 5
- [x] Silent frontend refresh — Task 6
- [x] Weak JWT_SECRET addressed — Task 7

**Placeholder scan:** None found — all code blocks are complete.

**Type consistency:** `tokenHash`, `userId`, `expiresAt`, `revokedAt` used consistently across model, controller, and test steps.
