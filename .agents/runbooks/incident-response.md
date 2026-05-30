# Incident Response Runbook

---

## Severity levels

| Level | Definition | Response time |
|---|---|---|
| P0 | Production down / data loss | Immediate |
| P1 | Major feature broken | < 1 hour |
| P2 | Degraded performance | < 4 hours |
| P3 | Minor issue | Next sprint |

## Triage steps
1. Confirm the issue in Render dashboard logs
2. Check recent deployments in GitHub / Render
3. Check server logs: `server/logs/`
4. Determine severity level
5. If P0/P1: notify the team immediately

## Escalation
- P0: page the developer (Rahul Adhikari) immediately
- P1: notify the team channel

## Resolution
- Fix forward if safe, otherwise → rollback runbook
- Write incident summary and append to `.agents/wiki/log.md`
