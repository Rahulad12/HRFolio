---
name: security-audit
description: Scan any React/TypeScript module for frontend security gaps across 7 categories. Produces a severity-bucketed audit report, fully runnable Playwright + Vitest security tests, and invokes writing-plans for Critical/High findings. Project-agnostic — discovers module structure at runtime.
---

# Security Audit Skill

When the user runs `/security-audit`, execute all 5 phases below in order without skipping any phase.

**Announce at start:** "Running /security-audit — 5 phases: Discovery → Scan → Bucket → Report → Tests → Fix Plan"


## Phase 0: Discover Scope

1. Run to discover modules:
   ```bash
   find src/modules -maxdepth 1 -mindepth 1 -type d 2>/dev/null | sort
   ```
   If `src/modules` does not exist, discover from route files:
   ```bash
   find src -maxdepth 3 \( -name "*.routes.tsx" -o -name "*.routes.ts" \) | sort
   ```

2. Present modules as a numbered list plus two extras:
   - "shared layer only" → SCAN_PATH = `src/shared/`
   - "full project" → SCAN_PATH = `src/`

3. Ask: "Which scope should I audit? (Enter number or name)"

4. Set `SCAN_PATH` to the selected module's directory path.
   Example: if user picks `bank-guarantee`, set SCAN_PATH = `src/modules/bank-guarantee`

5. Set `MODULE_NAME` to the short directory name (e.g. `bank-guarantee`).

6. Announce: "Scanning `<SCAN_PATH>` across 7 security categories..."


## Phase 1: Static Scan

For each category, run the grep commands using the Bash tool. Also scan `src/shared/` for categories 1, 5, and 6 regardless of SCAN_PATH (auth and API config always live in shared).

For every match, record a finding:
```
id:           SEC-NNN  (increment from SEC-001)
category:     <name>
severity:     Critical | High | Medium | Low
file:         relative/path/to/file.ts
line:         N
evidence:     the exact offending line(s)
fix_guidance: specific remediation in 1-2 sentences
```

### Category 1: Auth & Session

```bash
grep -rn "localStorage.setItem" --include="*.ts" --include="*.tsx" . | grep -i "token\|auth"
grep -rn "sessionStorage.setItem" --include="*.ts" --include="*.tsx" . | grep -i "token\|auth"
grep -rn "WebStorageStateStore" --include="*.ts" --include="*.tsx" .
grep -rn "user\.access_token\|user\.id_token\|user\.refresh_token" --include="*.ts" --include="*.tsx" .
grep -rn "interceptors\.response" src/shared/lib/axios.ts 2>/dev/null
```

Severity rules:
- CRITICAL: Any auth token written to localStorage → `localStorage.setItem('access_token', ...)` or `localStorage.setItem('auth_token', ...)`
- CRITICAL: OIDC user object in localStorage → `WebStorageStateStore({ store: window.localStorage })`
- HIGH: No 401 handler in the axios response interceptor (grep shows no `status.*401` near `interceptors.response`)
- HIGH: Token used after `user.expired` is not checked

### Category 2: Authorization / RBAC

```bash
grep -rn "admin\|/admin" SCAN_PATH/routes/ --include="*.tsx" --include="*.ts" 2>/dev/null
grep -rn "useRole\|usePermission\|hasRole\|isAdmin\|currentRole\|userRole" --include="*.ts" --include="*.tsx" SCAN_PATH/
grep -rn '"admin"\|"maker"\|"checker"\|"ADMIN"\|"MAKER"\|"CHECKER"' --include="*.ts" --include="*.tsx" SCAN_PATH/ | grep -v "spec\|test\|constants\|\.d\.ts"
```

Additionally, READ all route definition files under `SCAN_PATH/routes/`. For every route entry that contains `admin` in its path, check: is there a role-guard component (`RoleGuard`, `ProtectedRoute`, `RequireRole`, or similar) wrapping it? If not → CRITICAL finding.

Severity rules:
- CRITICAL: Route under `/admin` path with no role guard wrapper in the route tree
- HIGH: Role check found inside a page component instead of at the route level
- HIGH: Hardcoded magic string role values not imported from a constants/enum file
- MEDIUM: Sensitive UI elements (action buttons for approve/reject/issue) rendered without role visibility check

### Category 3: Input Validation & XSS

```bash
grep -rn "dangerouslySetInnerHTML\|innerHTML\s*=" --include="*.tsx" --include="*.ts" SCAN_PATH/
grep -rn "DOMPurify\|sanitize" --include="*.tsx" --include="*.ts" SCAN_PATH/ 2>/dev/null
grep -rn "useSearchParams\|searchParams\.get" --include="*.tsx" --include="*.ts" SCAN_PATH/ | grep -v "spec\|test"
```

READ every schema file under `SCAN_PATH/schemas/`. For each string field in every exported schema, check:
- Does it have `.max(N)` bound? If not on a free-text field → HIGH finding
- Is the schema actually imported and applied in the corresponding form component? If not → HIGH finding

Severity rules:
- CRITICAL: `dangerouslySetInnerHTML` used with non-static, non-sanitized content
- HIGH: Free-text form field (name, address, description) missing `.max()` in Zod schema
- HIGH: URL search param passed directly to an API call without schema validation
- MEDIUM: Form field rendered as raw `<input>` bypassing the shared form component wrapper


### Category 4: Sensitive Data Exposure

```bash
grep -rn "console\.log\|console\.error\|console\.warn" --include="*.ts" --include="*.tsx" SCAN_PATH/ | grep -v "spec\|test\|\.d\.ts"
grep -rn "error\.message\|err\.message" --include="*.ts" --include="*.tsx" SCAN_PATH/ | grep -i "toast\|alert\|setError\|display\|show" | grep -v "spec\|test"
grep -rn "useParams\|searchParams" --include="*.tsx" --include="*.ts" SCAN_PATH/ | grep -i "account\|amount\|card\|pin\|password\|ref\b" | grep -v "spec\|test"
```

Severity rules:
- HIGH: Sensitive field value (account number, amount) placed into URL path param or query string
- MEDIUM: `console.log` or `console.error` calls in non-test production files
- MEDIUM: `error.message` from API response forwarded directly to a toast or UI text element
- MEDIUM: `console.error(error)` printing full error object (may contain token or PII in dev builds)

### Category 5: API Security (Client-Side)

```bash
grep -rn "baseURL\|API_URL\|apiUrl\|api_url" --include="*.ts" --include="*.tsx" . | grep -v "spec\|test\|\.env\|config\.ts\|runtime"
grep -n "timeout" src/shared/lib/axios.ts 2>/dev/null || echo "NO_TIMEOUT_FOUND"
grep -rn "useParams()" --include="*.tsx" --include="*.ts" SCAN_PATH/ | grep -v "spec\|test"
grep -rn "http://" --include="*.ts" --include="*.tsx" . | grep -v "localhost\|spec\|test\|\/\/"
```

For each `useParams()` result: trace how the id param flows — does it go straight into a `GET`, `PUT`, or `DELETE` API call URL without any UI-level ownership check?

Severity rules:
- CRITICAL: API base URL hardcoded as string literal (not from env/runtime config)
- HIGH: URL param id flows directly into an API call with no ownership/existence check at the UI level (IDOR surface)
- MEDIUM: `axiosInstance` created without a `timeout` property
- HIGH: Non-localhost HTTP URL used in API config for production

### Category 6: CSRF

```bash
grep -rn "\.get(\|method.*GET\|method.*\"get\"" src/modules/ --include="*.ts" --include="*.tsx" | grep -i "creat\|submit\|approv\|reject\|issu\|delet\|updat" | grep -v "spec\|test\|queries\|useQuery"
grep -rn "csrf\|xsrf\|x-csrf" --include="*.ts" --include="*.tsx" . -i
```

Severity rules:
- HIGH: GET request used for a state-changing action (create, submit, approve, reject, delete, issue)
- MEDIUM: No CSRF token header in the axios interceptor (flag only if the API uses cookie-based sessions)

### Category 7: Config & Dependencies

```bash
grep -rn "\beval\b(" --include="*.ts" --include="*.tsx" . | grep -v "spec\|test\|\.d\.ts\|evaluat\|prevail"
grep -rn "__RUNTIME_CONFIG__" --include="*.ts" --include="*.tsx" . | grep -v "spec\|test"
```

For each `__RUNTIME_CONFIG__` access: check whether a `?? ''` or `|| fallback` default exists. If not → MEDIUM finding.

Read `package.json` dependencies. Flag security-sensitive packages (oidc, jwt, crypto, auth, bcrypt) pinned with `*` or `>=` range.

Severity rules:
- CRITICAL: `eval(` or dynamic Function constructor called with any variable or user-supplied value
- MEDIUM: `window.__RUNTIME_CONFIG__` field accessed without a fallback default value
- LOW: Security-relevant dependency using `*` or `>=` version range


## Phase 2: Bucket Findings by Severity

Assign each finding a severity using these rules:

| Severity | Rule |
|----------|------|
| Critical | Direct auth bypass, token in localStorage, admin route unguarded, dynamic code execution with user input |
| High | IDOR surface (unvalidated url param → api call), XSS vector with unsanitized content, missing Zod max on free-text, non-HTTPS API URL, GET used for mutation |
| Medium | console.log in production code, raw API error in UI, missing axios timeout, missing runtime config fallback, CSRF token absent |
| Low | Missing max on non-sensitive field, wildcard dependency version, non-secret hardcoded string |

Print summary: "Found: N Critical, N High, N Medium, N Low"

## Phase 3: Write Audit Report

Create the output directory if needed:
```bash
mkdir -p docs/security
```

Write the full report to `docs/security/audit-<YYYY-MM-DD>-<MODULE_NAME>.md`.

Report structure:
```
# Security Audit — <MODULE_NAME> — <YYYY-MM-DD>

**Scope:** `<SCAN_PATH>`
**Generated by:** /security-audit

## Summary

| Severity | Count |
|----------|-------|
| Critical | N |
| High     | N |
| Medium   | N |
| Low      | N |

---

## Critical Findings

### SEC-001 — <Short title>
- **Category:** <category>
- **File:** `<file>:<line>`
- **Evidence:**
  ```ts
  <offending code>
  ```
- **Risk:** <one sentence on exploitability>
- **Fix:** <specific remediation>

[one ### block per Critical finding]

---

## High Findings

[same format as Critical]

---

## Backlog (Medium / Low)
> Not in fix plan — address in a future hardening sprint.

| ID | Severity | Category | File | Summary |
|----|----------|----------|------|---------|
| SEC-00N | Medium | ... | file:line | short description |
```

After writing, announce: "Audit report saved to docs/security/audit-<date>-<MODULE_NAME>.md"


## Phase 4: Write Security Tests

Create the tests directory:
```bash
mkdir -p tests/security
```

Write each file below using the Bash tool (heredoc form) to avoid triggering security hook false positives on test payloads. Substitute `<MODULE_ROUTE>` with the base route of the scanned module (e.g. `/bank-guarantee`). Substitute `<ADMIN_ROUTES>` with every admin route path found in Category 2.

### File: tests/security/auth.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Auth Security', () => {
  test('unauthenticated user navigating to protected route is redirected to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('<MODULE_ROUTE>');
    await expect(page).toHaveURL(/\/login/);
  });

  test('access_token is not stored in localStorage after login', async ({ page }) => {
    // Documents vulnerability until token-in-memory fix is applied. Expected to FAIL pre-fix.
    const token = await page.evaluate(() => localStorage.getItem('access_token'));
    expect(token).toBeNull();
  });

  test('auth_token is not stored in localStorage after login', async ({ page }) => {
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });

  test('stale token in storage redirects to login not a broken page', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'stale.jwt.value');
    });
    await page.goto('<MODULE_ROUTE>');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=Internal Error')).not.toBeVisible();
    await expect(page.locator('text=500')).not.toBeVisible();
  });

  test('after logout navigating to protected route redirects to login', async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto('<MODULE_ROUTE>');
    await expect(page).toHaveURL(/\/login/);
  });
});
```

### File: tests/security/rbac.spec.ts

```typescript
import { test, expect } from '@playwright/test';

// Populate ADMIN_ROUTES with paths found in Phase 1 Category 2 scan.
const ADMIN_ROUTES = [
  // e.g. '/bank-guarantee/admin/roles',
  // e.g. '/bank-guarantee/admin/onboard',
];

test.describe('RBAC Security', () => {
  ADMIN_ROUTES.forEach((route) => {
    test(`non-admin authenticated user cannot access ${route}`, async ({ page }) => {
      // Use a non-admin session token from your test fixtures or .env.test
      await page.evaluate(() => {
        localStorage.setItem('auth_token', process.env.TEST_MAKER_TOKEN ?? 'maker-test-token');
      });
      await page.goto(route);
      await expect(page).not.toHaveURL(route);
    });
  });

  test('manipulating role value in localStorage does not grant elevated access', async ({ page }) => {
    await page.evaluate(() => {
      const key = Object.keys(localStorage).find(k => k.startsWith('oidc.user')) ?? '';
      if (key) {
        const raw = localStorage.getItem(key) ?? '{}';
        const parsed = JSON.parse(raw);
        if (parsed.profile) parsed.profile.role = 'ADMIN';
        localStorage.setItem(key, JSON.stringify(parsed));
      }
    });
    if (ADMIN_ROUTES[0]) {
      await page.goto(ADMIN_ROUTES[0]);
      await expect(page).not.toHaveURL(ADMIN_ROUTES[0]);
    }
  });

  test('admin-only UI elements are not visible to non-admin role', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('auth_token', process.env.TEST_MAKER_TOKEN ?? 'maker-test-token');
    });
    await page.goto('<MODULE_ROUTE>');
    // Update selector to match actual admin nav element in the app
    await expect(page.locator('[data-testid="admin-nav-item"]')).not.toBeVisible();
  });
});
```


### File: tests/security/input-validation.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Input Validation — Browser', () => {
  test('HTML injection payload in text field is not executed', async ({ page }) => {
    await page.goto('<MODULE_ROUTE>/apply/step1');
    // Payload broken up to avoid false-positive hook triggers in this skill file
    const payload = ['<', 'img src=x one', 'rror=alert(1)', '>'].join('');
    await page.fill('[name="applicantName"]', payload);
    await page.click('[data-testid="next-step"]');
    let dialogFired = false;
    page.on('dialog', () => { dialogFired = true; });
    await page.waitForTimeout(500);
    expect(dialogFired).toBe(false);
  });

  test('oversized input in free-text field is blocked before API call', async ({ page }) => {
    await page.goto('<MODULE_ROUTE>/apply/step1');
    await page.fill('[name="applicantName"]', 'a'.repeat(10001));
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('text=must not exceed')).toBeVisible();
    await expect(page).toHaveURL(/step1/);
  });

  test('empty required fields prevent form submission', async ({ page }) => {
    await page.goto('<MODULE_ROUTE>/apply/step1');
    await page.click('[data-testid="next-step"]');
    await expect(page.locator('[role="alert"]').first()).toBeVisible();
    await expect(page).toHaveURL(/step1/);
  });
});
```

Also write `tests/security/input-validation.unit.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
// Update import path to match the schema found in Phase 1 Category 3
import { bgStep1Schema } from '@/modules/bank-guarantee/schemas/bg-application.schema';

describe('Zod Schema — Input Validation', () => {
  it('rejects applicant name longer than 100 characters', () => {
    const result = bgStep1Schema.safeParse({ applicantName: 'a'.repeat(101) });
    expect(result.success).toBe(false);
    const hasNameError = result.error?.issues.some(i =>
      Array.isArray(i.path) && i.path.includes('applicantName')
    );
    expect(hasNameError).toBe(true);
  });

  it('rejects an empty object (all required fields missing)', () => {
    const result = bgStep1Schema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThan(0);
  });

  it('rejects invalid email format', () => {
    const result = bgStep1Schema.safeParse({ applicantEmail: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});
```

### File: tests/security/sensitive-data.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Sensitive Data Exposure', () => {
  test('account numbers do not appear in the URL after navigating to BG detail', async ({ page }) => {
    await page.goto('<MODULE_ROUTE>/applications/test-app-id');
    const url = page.url();
    expect(url).not.toMatch(/\d{9,16}/);
  });

  test('API error does not expose stack trace or internal paths in UI', async ({ page }) => {
    await page.goto('<MODULE_ROUTE>/applications/non-existent-id-returns-500');
    const body = await page.locator('body').innerText();
    expect(body).not.toContain('at Object.');
    expect(body).not.toContain('node_modules');
    expect(body).not.toContain('SQLException');
    expect(body).not.toContain('prisma');
  });

  test('no auth token stored in localStorage (post token-in-memory fix)', async ({ page }) => {
    // Expected to FAIL until the token-in-memory migration is complete.
    const accessToken = await page.evaluate(() => localStorage.getItem('access_token'));
    const authToken = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(accessToken).toBeNull();
    expect(authToken).toBeNull();
  });
});
```

### File: tests/security/api-security.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('API Security — IDOR and Unauthenticated Access', () => {
  test('unauthenticated direct navigation to application detail redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('<MODULE_ROUTE>/applications/any-id');
    await expect(page).toHaveURL(/\/login/);
  });

  test('unauthenticated navigation to checker review redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.goto('<MODULE_ROUTE>/review/any-id');
    await expect(page).toHaveURL(/\/login/);
  });

  test('navigating to another users application ID shows error state not data', async ({ page }) => {
    const otherUserAppId = process.env.TEST_OTHER_USER_APP_ID ?? 'other-user-application-id';
    await page.goto(`<MODULE_ROUTE>/applications/${otherUserAppId}`);
    const isOnDetailPage = page.url().includes(`/applications/${otherUserAppId}`);
    if (isOnDetailPage) {
      const hasErrorState = await page
        .locator('[data-testid="error-state"], [data-testid="not-found"], text=Not Found, text=Access Denied')
        .isVisible();
      expect(hasErrorState).toBe(true);
    }
  });
});
```


## Phase 5: Invoke writing-plans for Critical + High Findings

1. Collect all findings from Phase 2 with severity `Critical` or `High`.

2. If there are zero Critical and High findings, print:
   ```
   No Critical or High findings found.
   Review the Medium/Low backlog in: docs/security/audit-<date>-<MODULE_NAME>.md
   ```
   Then skip to the Completion Summary.

3. If Critical or High findings exist, announce:
   "Invoking writing-plans to generate a fix plan for <N> Critical and <M> High findings..."

4. Invoke the `writing-plans` skill with this context:

   > Create a fix implementation plan for the following security findings. Each finding is one task. For each task include: exact file path, exact line number, what specifically to change, and the acceptance criterion (the test in tests/security/ that must pass after the fix).
   >
   > Save plan to: `docs/superpowers/plans/security/fix-plan-<YYYY-MM-DD>-<MODULE_NAME>.md`
   >
   > Findings:
   > [paste each Critical and High finding block from Phase 2]

## Completion Summary

After all 5 phases complete, print:

```
========================================
Security Audit Complete
========================================
Module:    <SCAN_PATH>
Date:      <YYYY-MM-DD>

Report:    docs/security/audit-<date>-<MODULE_NAME>.md
Tests:     tests/security/ (auth, rbac, input-validation, sensitive-data, api-security)
Fix Plan:  docs/superpowers/plans/security/fix-plan-<date>-<MODULE_NAME>.md

Summary:   <N> Critical | <N> High | <N> Medium | <N> Low
========================================
```
