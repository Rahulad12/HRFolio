# User Invite Email & Permission Change Audit Log Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** (1) Send an invite email to a newly provisioned user so they know their account exists and can log in. (2) Write an audit log entry whenever an Admin changes a role's permissions, so all permission changes are traceable in the existing Audit Logs page.

**Architecture:** Both changes are small, self-contained additions to existing controller functions. The email uses the existing `sendEmail` utility (`server/src/legacy/utils/sendEmail.js`) with Gmail SMTP. The permission audit uses the existing `auditLogService` already imported in other controllers. No new models or routes required.

**Tech Stack:** Node.js, existing `sendEmail` utility (nodemailer/Gmail), existing `auditLogService` (Mongoose AuditLog model)

---

## File Map

**Modified files only:**
- `server/src/legacy/controllers/userController.js` — add `sendEmail` call inside `createUser`
- `server/src/legacy/controllers/permissionController.js` — add `auditLogService.log` call inside `updateRolePermission`

---

## Task 1: Send invite email when Admin creates a user

**Files:**
- Modify: `server/src/legacy/controllers/userController.js` — `createUser` function

The `createUser` function already saves the user and logs a `USER_CREATE` audit entry. We add one `sendEmail` call after the audit log.

- [ ] **Step 1: Verify sendEmail works with current env**

Check that `EMAIL_USER` and `EMAIL_PASS` are set:

```bash
grep -E "EMAIL_USER|EMAIL_PASS" server/.env
```

Expected: both are set. If not, add them (see `.env` file — they're in the root `.env` as `EMAIL_USER=st.rahul07@gmail.com`).

- [ ] **Step 2: Find the sendEmail import at the top of userController.js**

Check if `sendEmail` is already imported:

```bash
grep "sendEmail" server/src/legacy/controllers/userController.js
```

If not present, add this import at the top of the file:

```javascript
import sendEmail from '../utils/sendEmail.js';
```

- [ ] **Step 3: Add the invite email call inside createUser**

Find the `createUser` function. It ends with something like:

```javascript
    return res.status(201).json({
      success: true,
      ...
    });
```

Insert the email call **after** the `auditLogService.log(...)` call and **before** the `return res.status(201)` line:

```javascript
    // Send invite email — fire-and-forget; don't block the response on email delivery
    sendEmail({
      to: user.email,
      subject: 'Welcome to HRFolio — Your Account Is Ready',
      html: `
        <p>Hi ${user.name},</p>
        <p>Your HRFolio account has been created with the role <strong>${user.role}</strong>.</p>
        <p>Log in with your company Google account (${user.email}):</p>
        <p><a href="${process.env.FRONTEND_URL?.split(',')[0]}/login">Sign in to HRFolio</a></p>
        <p>If you have questions, contact your system administrator.</p>
      `,
    }).catch((err) => {
      logger.error(`Failed to send invite email to ${user.email}: ${err.message}`);
    });
```

Note the `.catch()` — email failure must not break user creation. The user record is already saved; we log the error and move on.

- [ ] **Step 4: Test it end-to-end**

1. Log in as Admin.
2. Go to User Management → Add a new user with a real email address you can check.
3. Submit the form.
4. Check: the API returns 201 and the user appears in the list.
5. Check: the invite email arrives at that address within ~1 minute.
6. Check server logs — no email errors.

If the email doesn't arrive, check:
```bash
grep "Failed to send invite" server/logs/application-*.log | tail -5
```

- [ ] **Step 5: Commit**

```bash
git add server/src/legacy/controllers/userController.js
git commit -m "feat(auth): send invite email when admin provisions a new user"
```

---

## Task 2: Audit log every permission change

**Files:**
- Modify: `server/src/legacy/controllers/permissionController.js` — `updateRolePermission` function

The `updateRolePermission` function currently saves the permission change and invalidates the cache but does not write an audit log. We add one call after `doc.save()`.

- [ ] **Step 1: Find the auditLogService import**

Check if `auditLogService` is already imported:

```bash
grep "auditLogService" server/src/legacy/controllers/permissionController.js
```

If not present, add it at the top of `permissionController.js`. The service is instantiated as a singleton elsewhere; import it the same way it's done in `userController.js`:

```javascript
import { auditLogService } from '../../modules/audit-logs/services/audit-logs.service.js';
```

Check where `userController.js` imports it to confirm the path:

```bash
grep "auditLogService" server/src/legacy/controllers/userController.js | head -1
```

Use exactly that import path.

- [ ] **Step 2: Capture the before-value for the audit metadata**

In `updateRolePermission`, before `doc.permissions.set(key, value)`, read the current value:

```javascript
    const previousValue = doc.permissions.get(key) ?? false;
```

- [ ] **Step 3: Add the audit log call after doc.save()**

Find this block:

```javascript
    doc.permissions.set(key, value)
    doc.updatedBy = req.user.id
    await doc.save()

    invalidatePermissionCache()
```

Replace with:

```javascript
    const previousValue = doc.permissions.get(key) ?? false;
    doc.permissions.set(key, value);
    doc.updatedBy = req.user.id;
    await doc.save();

    invalidatePermissionCache();

    await auditLogService.log({
      actor: { id: req.user.id, name: req.user.name || 'Admin', role: req.user.role },
      action: 'PERMISSION_UPDATE',
      target: { id: doc._id.toString(), type: 'role-permissions', name: role },
      metadata: {
        before: { [key]: previousValue },
        after:  { [key]: value },
      },
    });
```

- [ ] **Step 4: Test it**

1. Log in as Admin.
2. Go to Settings → Role Permissions.
3. Toggle any permission for HR (e.g., turn off `candidates:delete`).
4. Go to Audit Logs.
5. You should see a new entry with action `PERMISSION_UPDATE`, actor = the Admin user, target name = `HR`, metadata showing before/after values.

- [ ] **Step 5: Commit**

```bash
git add server/src/legacy/controllers/permissionController.js
git commit -m "feat(auth): log audit entry for every permission toggle via PERMISSION_UPDATE action"
```

---

## Task 3: Surface PERMISSION_UPDATE in the Audit Logs page filter

**Files:**
- Modify: `client/src/modules/audit-logs/` — check if the action filter dropdown includes `PERMISSION_UPDATE`

The Audit Logs page has a filter by action. If `PERMISSION_UPDATE` is not in the list, users can't filter for permission changes specifically.

- [ ] **Step 1: Check the current action filter options**

```bash
grep -rn "PERMISSION_UPDATE\|action.*filter\|actionOptions" client/src/modules/audit-logs/ --include="*.tsx" --include="*.ts"
```

- [ ] **Step 2: Add PERMISSION_UPDATE to the action filter if missing**

If the audit log page has a hardcoded list of action values (e.g., a Select with options), find that list and add:

```tsx
{ value: 'PERMISSION_UPDATE', label: 'Permission Change' }
```

If actions come dynamically from the API, no change is needed — it will appear automatically.

- [ ] **Step 3: Commit if a change was needed**

```bash
git add client/src/modules/audit-logs/
git commit -m "feat(audit-logs): add PERMISSION_UPDATE to action filter options"
```

---

## Self-Review

**Spec coverage:**
- [x] Email invite on user creation — Task 1
- [x] Fire-and-forget email (doesn't break creation on failure) — Task 1, Step 3 `.catch()`
- [x] Permission change audit trail — Task 2
- [x] Before/after metadata captured — Task 2, Step 3
- [x] Audit Logs page surfacing the new action — Task 3

**Placeholder scan:** None — all code blocks show complete implementations.

**Type consistency:** `auditLogService.log()` shape matches usage in `userController.js` (`actor`, `action`, `target`, `metadata.before`, `metadata.after`).
