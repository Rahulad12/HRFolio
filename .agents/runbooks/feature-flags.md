# Feature Flags Runbook

**System**: None currently — manual feature toggling via environment variables.

---

## Creating a flag
Add a boolean env variable in:
- Frontend: `client/.env` (local) / Vercel environment variables (production)
- Backend: `server/.env` (local) / Render environment variables (production)

## Naming convention
`FEATURE_[PACKAGE]_[DESCRIPTION]` — e.g. `FEATURE_CLIENT_NEW_DASHBOARD`

## Flag lifecycle
1. **Create** — off by default
2. **Enable for testing** — set to `true` in non-production env only
3. **Full release** — set to `true` in all environments
4. **Retire** — remove flag and all conditional code within one sprint of full release

## Retirement checklist
- [ ] Flag is enabled in all environments for at least one full sprint
- [ ] All conditional blocks referencing the flag removed from code
- [ ] Flag removed from all environment configs
