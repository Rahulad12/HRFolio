# Rollback Runbook

Use this when a production deployment must be reverted.

---

## Decision criteria
Roll back if any of the following:
- Error rate exceeds baseline by 50% for more than 5 minutes
- P0 / critical bug confirmed in production
- Data integrity risk identified

## Rollback steps

### Frontend (Vercel)
```bash
vercel rollback
```
Or use Vercel dashboard → Deployments → select previous deployment → Promote to Production.

### Backend (Render)
Use Render dashboard → Deploy → Rollback to previous deployment.

## Post-rollback
- [ ] Confirm error rate has returned to baseline
- [ ] Open a GitHub issue with root cause analysis
- [ ] Append to `.agents/wiki/mistakes.md`
- [ ] Schedule post-mortem within 48 hours
