# Auth Architecture — User & Role Management

## 1. Data Model

```
┌─────────────────────────────┐        ┌──────────────────────────────────────┐
│           User              │        │             Identity                  │
│─────────────────────────────│        │──────────────────────────────────────│
│ _id                         │◄───────│ userId          (FK → User)          │
│ email    (canonical)        │  1:N   │ provider        google|azure|saml    │
│ name                        │        │ externalId      googleId / OID / etc │
│ role     HR|HR Admin|Admin  │        │ providerEmail   email from provider  │
│ status   active|inactive    │        │ linkedAt                             │
│ createdAt                   │        └──────────────────────────────────────┘
└─────────────────────────────┘

One User → many Identities (one per login provider)
```

---

## 2. Admin Provisions a User

```
Admin (in app)
     │
     ▼
Fill form: name + email + role
     │
     ▼
POST /api/auth/users
     │
     ▼
Does email already exist?
     ├── YES ──► 400 "User already exists"
     │
     └── NO
          │
          ▼
     Create User record
     { email, name, role, status: active }
     (no Identity yet — user hasn't logged in)
          │
          ▼
     201 Created ✅
     (user is now in the system, waiting for first login)
```

---

## 3. First-Time Login (Google OAuth)

```
User clicks "Sign in with Google"
          │
          ▼
Redirect → Google OAuth consent
          │
          ▼
Google returns profile
{ googleId, email, name, picture }
          │
          ▼
Domain check: email ends with @company.com?
          ├── NO ──► Redirect /error "Only company emails allowed"
          │
          └── YES
               │
               ▼
          Identity.findOne({ provider: "google", externalId: googleId })
               │
               ├── FOUND ──────────────────────────────────┐
               │                                           │
               └── NOT FOUND                               │
                    │                                      │
                    ▼                                      │
               User.findOne({ email })                     │
                    │                                      │
                    ├── NOT FOUND                          │
                    │      │                               │
                    │      ▼                               │
                    │   Redirect /error                    │
                    │   "Not registered. Contact Admin"    │
                    │                                      │
                    └── FOUND (admin pre-created)          │
                         │                                 │
                         ▼                                 │
                    Create Identity record                  │
                    { userId, provider: "google",          │
                      externalId: googleId,                │
                      providerEmail: email }               │
                         │                                 │
                         ▼                                 │
                    Update User.picture, User.name ◄───────┘
                         │
                         ▼
                    User.status === active?
                         ├── NO ──► Redirect /error "Account banned"
                         │
                         └── YES
                              │
                              ▼
                         Sign JWT { userId, role, email }
                              │
                              ▼
                         Redirect frontend with token ✅
                         User logs in with pre-assigned role
```

---

## 4. Returning User Login

```
User clicks "Sign in with Google"
          │
          ▼
Google returns { googleId, email }
          │
          ▼
Domain check ✅
          │
          ▼
Identity.findOne({ provider: "google", externalId: googleId })
          │
          └── FOUND
               │
               ▼
          Load User via identity.userId
               │
               ▼
          status check → active? ✅
               │
               ▼
          Sign JWT with current role
               │
               ▼
          Login ✅  (role reflects latest admin assignment)
```

---

## 5. Future SSO Login (OIDC — Azure AD / Okta / Google Workspace)

```
User clicks "Sign in with SSO"
          │
          ▼
App redirects → Company IdP (Azure AD / Okta / Google Workspace)
          │
          ▼
Company IdP authenticates user
(MFA, device trust, session policy all handled by company)
          │
          ▼
IdP returns OIDC token
{ sub: "azure-oid-xxx", email: "ram@amniltech.com", name: "Ram" }
          │
          ▼
Domain check ✅
          │
          ▼
Identity.findOne({ provider: "azure", externalId: "azure-oid-xxx" })
          │
          ├── FOUND ──► load User → sign JWT ✅
          │
          └── NOT FOUND
               │
               ▼
          User.findOne({ email: "ram@amniltech.com" })
               │
               ├── NOT FOUND ──► "Contact Admin"
               │
               └── FOUND
                    │
                    ▼
               Create Identity { provider: "azure", externalId, ... }
                    │
                    ▼
               Sign JWT ✅  (same User record, new identity linked)

NOTE: Same User record works for both Google and Azure login.
      Admin only manages Users — not which provider they use.
```

---

## 6. Role Management Flow

```
Admin opens Users page
          │
          ▼
     ┌────────────────────────────────────┐
     │  User list                         │
     │  ram@amniltech.com   HR Admin  ✏️  │
     │  sita@amniltech.com  HR       ✏️  │
     │  hari@amniltech.com  Admin    ✏️  │
     └────────────────────────────────────┘
          │
          ▼ (clicks edit on a user)
     PATCH /api/auth/:id/role  { role: "HR Admin" }
          │
          ▼
     authorize(["Admin"]) middleware
          │
          ├── NOT Admin ──► 403 Forbidden
          │
          └── Admin ✅
               │
               ▼
          Validate role ∈ { HR, HR Admin, Admin }
               │
               ▼
          Update User.role
               │
               ▼
          Audit log: WHO changed WHOSE role FROM → TO
               │
               ▼
          200 OK ✅

EFFECT: Next time that user logs in,
        JWT is signed with the NEW role automatically.
        No re-registration needed.
```

---

## 7. User Offboarding

```
Admin deactivates user
          │
          ▼
DELETE /api/auth/:id  (toggles status active ↔ inactive)
          │
          ▼
User.status = "inactive"
          │
          ▼
          ┌───────────────────────────────┐
          │  What happens to active JWTs? │
          │                               │
          │  Current: nothing (JWT still  │
          │  valid until 30d expiry) ⚠️   │
          │                               │
          │  Proper: token blocklist OR   │
          │  short expiry + refresh tokens│
          └───────────────────────────────┘
          │
          ▼
Next login attempt:
googleCallback checks user.status → "inactive"
→ Redirect /error "Account banned" ✅
```

---

## 8. Full System Overview

```
                    ┌─────────────────────────────────────────┐
                    │              HRFolio App                │
                    │                                         │
  Google OAuth ────►│                                         │
                    │   ┌──────────┐      ┌──────────────┐   │
  Azure AD   ──────►│   │ Identity │─────►│    User      │   │
  (future)          │   │ (HOW)    │ N:1  │    (WHO)     │   │
                    │   └──────────┘      └──────┬───────┘   │
  SAML / Okta ─────►│                            │           │
  (future)          │                       role │           │
                    │                            ▼           │
                    │                    ┌───────────────┐   │
                    │                    │  Permissions  │   │
                    │                    │  HR           │   │
                    │                    │  HR Admin     │   │
                    │                    │  Admin        │   │
                    │                    └───────────────┘   │
                    └─────────────────────────────────────────┘

Admin manages:  Users (email + role)
System manages: Identities (how each user logs in)
Providers:      Any OIDC/SAML — pluggable, no User model change needed
```

---

## 9. DB Migration Plan

```
Phase 1 — Now
  User model: keep as-is, add index on email
  New: Identity model { userId, provider, externalId, providerEmail, linkedAt }
  Migrate: existing users with googleId
    → create Identity { provider:"google", externalId: user.googleId }
    → remove googleId from User model

Phase 2 — SSO
  Add oidcConfig collection { domain, clientId, clientSecret, discoveryUrl }
  One row per company deployment
  Passport dynamically registers strategy from this config

Phase 3 — Enterprise
  Add sessions collection (for revocation)
  Shorten JWT to 15min, add refreshToken (7d)
  Session revocation on deactivate
```
