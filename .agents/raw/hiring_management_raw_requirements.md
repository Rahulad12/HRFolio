# Hiring Management System — Raw Requirements
## Feature Enhancement: RBAC, Escalation System & Audit Logs

**Document Type:** Raw Requirements (Pre-FRS)
**Version:** 1.0
**Date:** 2026-05-30
**Status:** Draft

---

## Table of Contents

1. [Overview](#1-overview)
2. [User Roles](#2-user-roles)
3. [Candidate Visibility & Ownership](#3-candidate-visibility--ownership)
4. [Candidate Operations & Permissions](#4-candidate-operations--permissions)
5. [User Management](#5-user-management)
6. [Escalation System — HR to HR Admin](#6-escalation-system--hr-to-hr-admin)
7. [Escalation System — HR Admin to Admin](#7-escalation-system--hr-admin-to-admin)
8. [Escalation Resolution](#8-escalation-resolution)
9. [Escalation Visibility Rules](#9-escalation-visibility-rules)
10. [Notifications](#10-notifications)
11. [Audit Logs](#11-audit-logs)
12. [Permission Matrix Summary](#12-permission-matrix-summary)

---

## 1. Overview

The Hiring Management System currently operates without user-based filtering or role-based access control — all enrolled users can view all data. This document defines raw requirements for three major feature enhancements:

- **Role Based Access Control (RBAC)** — restrict what each user can see and do
- **User-Based Filtering** — HR users see only their own candidates
- **Escalation System** — structured request flow between HR → HR Admin → Admin
- **Audit Logs** — system-wide activity tracking for accountability and compliance

The hiring pipeline follows a fixed stage order:
```
Assessment → Interview → Offer
```

---

## 2. User Roles

- The system shall support exactly three user roles: **HR**, **HR Admin**, and **Admin**
- Each user shall be assigned exactly one role at all times
- Only Admin shall have the ability to create users and assign roles
- Role assignment shall be done at user creation time and can be changed by Admin later
- A user with no role shall not be able to access the system

---

## 3. Candidate Visibility & Ownership

- Every candidate created in the system shall have an **owner** — the HR user who created them
- Ownership shall be assigned automatically at the time of candidate creation
- **HR** shall only see candidates they personally own
- **HR Admin** shall see all candidates across all HR users
- **Admin** shall see all candidates across all HR users (read-only)
- Candidate ownership shall not change unless explicitly reassigned by HR Admin

---

## 4. Candidate Operations & Permissions

### 4.1 Create
- HR shall be able to create new candidates (auto-assigned as owner)
- HR Admin shall be able to create new candidates
- Admin shall NOT be able to create candidates

### 4.2 Edit
- HR shall be able to edit their own candidates only
- HR Admin shall be able to edit any candidate regardless of ownership
- Admin shall NOT be able to edit any candidate

### 4.3 Delete
- HR shall be able to delete their own candidates only
- HR Admin shall be able to delete any candidate
- Admin shall NOT be able to delete any candidate

### 4.4 Stage Movement
- HR shall be able to move their own candidates to the next stage in the pipeline
- HR Admin shall be able to move any candidate to the next stage
- Admin shall NOT be able to move candidate stages
- Stage progression shall always follow fixed pipeline order: Assessment → Interview → Offer
- Skipping stages shall NOT be allowed

### 4.5 Send Mail
- HR shall be able to send mail to their own candidates
- HR Admin shall be able to send mail to any candidate
- Admin shall be able to send mail to any candidate

---

## 5. User Management

- Admin shall be able to create new user accounts
- Admin shall be able to edit existing user accounts
- Admin shall be able to deactivate user accounts
- Admin shall be able to assign and change roles of any user
- HR and HR Admin shall have NO access to user management
- Deactivated users shall not be able to log in or access the system

---

## 6. Escalation System — HR to HR Admin

### 6.1 Raising a Request
- HR shall be able to raise a **Review Request** on any of their own candidates
- HR shall manually select a specific HR Admin as the target of the request
- HR shall attach a reason or note when raising the request
- A Review Request shall be created with an initial status of **Pending**

### 6.2 Visibility
- Only the selected HR Admin shall be able to see the escalation request
- Other HR Admin users shall have NO visibility into that request
- Admin shall have NO visibility into HR → HR Admin escalation requests

### 6.3 Multiple Requests
- HR shall be allowed to raise multiple escalation requests to the same HR Admin for different candidates
- HR shall NOT raise duplicate escalation requests for the same candidate to the same HR Admin while one is already active

### 6.4 Cancellation & Reassignment
- HR shall be able to cancel a pending escalation request before it is resolved
- After cancellation HR shall be able to raise a new request for the same candidate to a different HR Admin
- Cancelled requests shall be preserved in history with status **Cancelled**

### 6.5 Status Flow
```
Pending → In Review → Resolved
              ↑
         (cancelled at any point before resolved)
```

---

## 7. Escalation System — HR Admin to Admin

### 7.1 Raising a Request
- HR Admin shall be able to escalate a candidate review request to a specific Admin
- HR Admin shall manually select the target Admin
- HR Admin shall attach a reason or note when escalating
- This escalation shall be linked to the original HR → HR Admin request

### 7.2 Visibility
- Only the selected Admin shall see the escalation request
- Other Admin users shall have NO visibility into that request
- HR shall be notified that their original request has been escalated to Admin level
- HR shall NOT be able to directly raise an escalation request to Admin

### 7.3 HR Admin Cannot Directly Bypass
- HR shall not be able to skip HR Admin and escalate directly to Admin
- All escalations from HR must go through HR Admin first

---

## 8. Escalation Resolution

### 8.1 Who Can Resolve
- HR Admin shall resolve Level 1 escalations (HR → HR Admin)
- Admin shall resolve Level 2 escalations (HR Admin → Admin)

### 8.2 Resolution Process
- Resolver shall add a **resolution comment** explaining how the matter was resolved
- Upon marking resolved, the escalation shall be **automatically closed** for all parties
- No separate manual close action shall be required

### 8.3 Post Resolution — Candidate Stage
- The system shall NOT automatically move the candidate to the next stage upon resolution
- The HR who owns the candidate shall manually move the candidate to the next stage
- HR shall use the resolution comment as guidance for their decision
- HR is fully responsible for acting on the resolution — no system reminders or nudges

### 8.4 Notification on Resolution
- Only the HR who originally raised the request shall be notified upon resolution
- Notification shall include the resolution comment and candidate reference
- Other HR users shall NOT be notified

### 8.5 History & Audit
- All resolved and cancelled escalation requests shall be preserved in history
- HR shall be able to view their own escalation history
- HR Admin shall be able to view escalation history of requests targeted to them
- Admin shall be able to view escalation history of requests escalated to them

---

## 9. Escalation Visibility Rules

| Party | Can See |
|-------|---------|
| HR | Own raised requests + resolution notifications |
| HR Admin | Only requests specifically targeted to them |
| Admin | Only requests specifically escalated to them |
| Other HR Admins | Nothing — zero visibility |
| Other Admins | Nothing — zero visibility |
| HR (Level 2 awareness) | Notified that request was escalated further, no details |

---

## 10. Notifications

### 10.1 Escalation Notifications
- HR Admin shall receive a notification when HR raises a review request targeting them
- Admin shall receive a notification when HR Admin escalates a request targeting them
- HR shall receive a notification when their escalation request is resolved
- HR shall receive a notification informing them their request was escalated to Admin level (no details of Level 2 request)

### 10.2 Notification Content
- All notifications shall include: candidate name, candidate reference ID, relevant comment, timestamp
- Resolution notifications shall include the resolution comment

### 10.3 Notification Delivery
- Notification delivery method (in-app, email, or both) to be defined in FRS based on system capability

---

## 11. Audit Logs

### 11.1 Purpose
- The system shall maintain a complete, immutable audit trail of all significant actions
- Audit logs shall support accountability, debugging, and future compliance requirements

### 11.2 Events to be Logged
The following events shall be captured in audit logs:

**Candidate Events**
- Candidate created
- Candidate edited (field level — what changed, old value, new value)
- Candidate deleted
- Candidate stage moved (from stage, to stage)
- Mail sent to candidate

**Escalation Events**
- Escalation request raised
- Escalation request cancelled
- Escalation request escalated to Admin
- Escalation request resolved (with resolution comment reference)

**User Management Events**
- User created
- User edited
- User deactivated / reactivated
- User role changed (old role, new role)

**Authentication Events**
- User login
- User logout
- Failed login attempt

### 11.3 Log Entry Structure
Each audit log entry shall capture:
- **Timestamp** — exact date and time of the action
- **Actor** — user who performed the action (name + role)
- **Action** — what was done
- **Target** — what entity was affected (candidate name/ID, user name/ID, etc.)
- **Before State** — previous value (for edit actions)
- **After State** — new value (for edit actions)
- **IP Address** — where the action originated (optional, for FRS decision)

### 11.4 Log Visibility
- Admin shall have full access to all audit logs across the entire system
- HR Admin shall be able to view audit logs related to candidates they can access
- HR shall be able to view audit logs related to their own candidates only
- No user shall be able to delete or modify audit log entries

### 11.5 Immutability
- Audit log entries shall be immutable — no user including Admin shall be able to edit or delete them
- The system shall not expose any API or interface to modify log entries

### 11.6 Retention
- Retention policy (duration of log storage) to be defined in FRS
- Recommended minimum: 1 year for candidate logs, 2 years for user management logs

---

## 12. Permission Matrix Summary

| Action | HR | HR Admin | Admin |
|--------|:--:|:--------:|:-----:|
| See own candidates | ✅ | ✅ | ✅ |
| See all candidates | ❌ | ✅ | ✅ |
| Create candidate | ✅ | ✅ | ❌ |
| Edit own candidate | ✅ | ✅ | ❌ |
| Edit any candidate | ❌ | ✅ | ❌ |
| Delete own candidate | ✅ | ✅ | ❌ |
| Delete any candidate | ❌ | ✅ | ❌ |
| Move candidate stage | ✅ own | ✅ all | ❌ |
| Send mail to candidate | ✅ own | ✅ all | ✅ all |
| Raise escalation to HR Admin | ✅ | ❌ | ❌ |
| Receive escalation from HR | ❌ | ✅ targeted | ❌ |
| Escalate to Admin | ❌ | ✅ | ❌ |
| Receive escalation from HR Admin | ❌ | ❌ | ✅ targeted |
| Resolve escalation | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Assign roles | ❌ | ❌ | ✅ |
| View all audit logs | ❌ | ❌ | ✅ |
| View own candidate audit logs | ✅ | ✅ | ✅ |

---

*End of Raw Requirements Document*
*Next Step: Convert to Formal FRS with acceptance criteria, wireframe references, and technical constraints*
