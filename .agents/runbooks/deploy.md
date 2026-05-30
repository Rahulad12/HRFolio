# Deployment Runbook

**CI/CD platform**: GitHub Actions
**Deployment target**: Frontend → Vercel, Backend → Render

---

## Pre-deploy checklist
- [ ] All tests pass on `develop`
- [ ] MR approved and merged into `develop`
- [ ] No open blocking issues on the milestone
- [ ] Notify team before deploying to production

## Deploy steps

### Frontend (Vercel)
Auto-deploys from GitHub on push to `main`. Manual trigger:
```bash
cd client && npm run build && vercel --prod
```

### Backend (Render)
Auto-deploys from GitHub on push to `main`. Manual trigger via Render dashboard.

## Post-deploy checklist
- [ ] Check error rate in Render dashboard for 10 minutes
- [ ] Verify key user flows manually (login, candidate CRUD, file upload)
- [ ] Update `.agents/sessions/current.md` with deploy notes

## Rollback trigger
If error rate spikes or a critical bug is found → run rollback runbook immediately.
