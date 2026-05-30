# Graph Report - HRFolio  (2026-05-30)

## Corpus Check
- 186 files · ~135,566 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 723 nodes · 1126 edges · 44 communities (42 shown, 2 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 39 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fb82b957`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]

## God Nodes (most connected - your core abstractions)
1. ``.agents/rules/module-structure.md`` - 18 edges
2. `[PACKAGE_1_NAME] — [type: frontend/backend/lib]` - 17 edges
3. `makeCapitilized()` - 15 edges
4. `Task List` - 15 edges
5. `authenticate()` - 13 edges
6. `updateCandidateCurrentStage()` - 12 edges
7. `[FILL IN — CLI or UI steps for your flag system]` - 12 edges
8. `checkUserExist()` - 10 edges
9. `Plan: GitHub Issue Creation for Hiring Management Enhancements (Modular Architecture)` - 10 edges
10. `Task 4: Candidates Module` - 10 edges

## Surprising Connections (you probably didn't know these)
- `handleSendDraftedInterview()` --calls--> `createInterview()`  [INFERRED]
  client/src/pages/interviews/InterviewListView.tsx → server/src/legacy/controllers/InterviewController.js
- `updateStatus()` --calls--> `changeCandidateStage()`  [INFERRED]
  client/src/pages/candidates/CandidateDetail.tsx → server/src/legacy/controllers/candidateController.js
- `handleInterviewDelete()` --calls--> `deleteInterview()`  [INFERRED]
  client/src/pages/interviews/InterviewListView.tsx → server/src/legacy/controllers/InterviewController.js
- `handleRescheduleSubmit()` --calls--> `updateInterview()`  [INFERRED]
  client/src/pages/interviews/InterviewListView.tsx → server/src/legacy/controllers/InterviewController.js
- `handleDeleteAssignment()` --calls--> `deleteAssignment()`  [INFERRED]
  client/src/pages/assessments/AssessmentAssignmentList.tsx → server/src/legacy/controllers/assessmentController.js

## Communities (44 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (51): handleDeleteAssignment(), assignAssessment(), createAssessment(), createScore(), deleteAssessment(), deleteAssignment(), getAssessment(), getAssessmentById() (+43 more)

### Community 1 - "Community 1"
Cohesion: 0.04
Nodes (47): `.agents/skills/adr/SKILL.md`, `.agents/skills/context-sync/SKILL.md`, `.agents/skills/prompt/SKILL.md`, `.agents/skills/review/SKILL.md`, `.agents/skills/scaffold/SKILL.md`, `.agents/skills/security-audit/SKILL.md`, `.agents/skills/taskboard/SKILL.md`, `.agents/skills/test-gen/SKILL.md` (+39 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (44): Active task, `.agents/context/dependencies.md`, `.agents/context/file-tree.md`, `.agents/context/symbols.md`, `.agents/decisions/ADR-000-template.md`, `.agents/decisions/README.md`, `.agents/runbooks/deploy.md`, `.agents/sessions/current.md` (+36 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (7): AuditLogController, EscalationController, bannedUser(), googleCallback(), authorize(), AuditLogService, EscalationService

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (28): 1. Refresh codebase context, 2. Check what was in progress, 3. Pull fresh task board, agents Agent Setup — Universal Bootstrap (AI-Native SDLC Edition), `.agents/runbooks/feature-flags.md`, `.agents/runbooks/incident-response.md`, `.agents/runbooks/rollback.md`, code:block1 (.agents/) (+20 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (29): `.agents/rules/api-conventions.md`, `.agents/rules/architectural.md`, `.agents/rules/code-style.md`, `.agents/rules/module-structure.md`, `.agents/rules/security.md`, `.agents/rules/testing.md`, code:markdown (---), code:markdown (---) (+21 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (25): 1.1 Purpose, 1.2 Scope, 1. Introduction, 2.1 Role Definitions, 2.2 Permission Matrix (Detailed), 2. User Roles & Permissions, 3.1 Role-Based Access Control (RBAC), 3.2 Candidate Ownership & Filtering (+17 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (7): storeInterview(), updateInterview(), handleFeedbackSubmit(), handleInterviewDelete(), handleRescheduleSubmit(), handleSendDraftedInterview(), handleStatusUpdate()

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (4): storeCandidate(), canMoveToStatus(), updateStatus(), makeCapitilized()

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (3): useInterview(), storeOffer(), useOffer()

### Community 13 - "Community 13"
Cohesion: 0.1
Nodes (20): 1. Goals, 2. Module Layout, 3. Data Flow, 4. Form Validation (Zod), 5. Route Structure, 6. Dependencies, 7. Files to Delete, 8. Migration Order (+12 more)

### Community 14 - "Community 14"
Cohesion: 0.19
Nodes (14): onFinish(), changeCandidateStage(), createCandidate(), deleteCandidates(), getAllCandidates(), getCandidateById(), getCandidateLogsByCandidateId(), rejectCandidate() (+6 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (16): 1.1 Shared Auth Logic, 1.2 Protected Route Component, 2.1 Module Scaffolding, 2.2 Features (Admin Only), 3.1 Module Scaffolding, 3.2 Features, 4.1 Module Scaffolding, 4.2 Features (Admin Only) (+8 more)

### Community 16 - "Community 16"
Cohesion: 0.19
Nodes (9): connectDB(), createInterviewer(), deleteInterviewer(), getInterviewer(), getInterviewerById(), updateInterviewer(), destroyData(), insertData() (+1 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (15): code:bash (git add -A && git commit -m "feat: add offers module with AP), code:bash (git add -A && git commit -m "feat: add emails module with AP), code:tsx (export const dashboardRoutes = [), code:bash (git add -A && git commit -m "feat: add dashboard module"), code:bash (git add -A && git commit -m "feat: add landing module"), code:tsx (// Before), code:bash (git add -A && git commit -m "feat: restructure shared compon), File Change Summary (+7 more)

### Community 19 - "Community 19"
Cohesion: 0.13
Nodes (14): Implementation Plan: Hiring Management Enhancements (Modular TS Architecture), Phase 1: Foundation (RBAC & Schema), Phase 2: Data Isolation, Phase 3: Modular Feature Implementation, Phase 4: Frontend Modular Migration, Phase 5: Finalization, Task 1: User Schema & Auth Extension (#32), Task 2: Authorization Middleware (#32) (+6 more)

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (3): useAssessment(), useAssignedAssessment(), AssessmentList()

### Community 22 - "Community 22"
Cohesion: 0.23
Nodes (5): useCandidate(), CandidateTableSearch(), buildPayload(), handleOfferSend(), handleSaveAsDraft()

### Community 23 - "Community 23"
Cohesion: 0.15
Nodes (12): API Overview, code:block1 (HRFolio/), code:bash (# Prerequisites: Node.js 18+, MongoDB, Google OAuth credenti), code:bash (cd client && npm run dev      # dev server), Dev Commands, Documentation, Environment Variables, Features (+4 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (10): 1. Backend: Core RBAC & Schema Updates, 2. Backend: Candidate Ownership & Isolation, 3. Backend: Escalation System (Level 1 & 2), 4. Backend: Centralized Audit Logging, 5. Frontend: RBAC UI Enforcement, 6. Frontend: User Management (Admin Only), 7. Frontend: Escalation & Notification UI, 8. Frontend: Audit Log Viewer (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.2
Nodes (9): code:bash (/context-sync), code:bash (cd client && npm run dev     # dev), Critical Rules, Dev Commands, Feature Workflow, HRFolio — Agent Instructions, Key Files, Skills (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.2
Nodes (10): code:ts (export type CandidateStatus = 'shortlisted' | 'assessment' |), code:ts (import { z } from 'zod'), code:ts (import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'), code:ts (import { queryOptions } from '@tanstack/react-query'), code:ts (import { mutationOptions } from '@tanstack/react-query'), code:tsx (import { lazy } from 'react'), code:tsx (import { useState } from 'react'), code:ts (export { candidateRoutes } from './routes/candidate.routes') (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.2
Nodes (10): code:ts (export type InterviewStatus = 'draft' | 'scheduled' | 'compl), code:ts (import { z } from 'zod'), code:ts (import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'), code:ts (import { GET, POST, PUT, DELETE } from '@/shared/lib/axios'), code:ts (import { queryOptions } from '@tanstack/react-query'), code:ts (import { mutationOptions } from '@tanstack/react-query'), code:tsx (import { lazy } from 'react'), code:ts (export { interviewRoutes } from './routes/interview.routes') (+2 more)

### Community 28 - "Community 28"
Cohesion: 0.36
Nodes (7): ApiError, DELETE(), GET(), handleError(), PATCH(), POST(), PUT()

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (8): code:bash (cd /home/rahul-adhikari/code/own-projects/HRFolio/client), code:ts (import { defineConfig } from 'vite'), code:json ({), code:ts (import axios, { AxiosError } from 'axios'), code:ts (import { QueryClient } from '@tanstack/react-query'), code:ts (import { AUTH_URL, CANDIDATE_URL, INTERVIEW_URL, INTERVIEWER), code:bash (git add -A && git commit -m "feat: add axios, react-query, z), Task 1: Foundation — Dependencies & Config

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (8): code:tsx (import { createContext, useContext, useState, useEffect, use), code:ts (export interface AuthUser {), code:ts (import { POST, DELETE } from '@/shared/lib/axios'), code:tsx (import { lazy } from 'react'), code:tsx (import { AuthLayout } from '../components/AuthLayout'), code:ts (export { authRoutes } from './routes/auth.routes'), code:bash (git add -A && git commit -m "feat: add AuthContext + auth mo), Task 3: Auth Context + Auth Module

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (6): code:ts (import { create } from 'zustand'), code:ts (import { create } from 'zustand'), code:bash (git add -A && git commit -m "feat: add Zustand stores for th), code:ts (import { create } from 'zustand'), code:ts (import { create } from 'zustand'), Task 2: Zustand UI Stores

### Community 32 - "Community 32"
Cohesion: 0.33
Nodes (6): code:tsx (import { lazy, Suspense } from 'react'), code:tsx (import { Navigate, Outlet } from 'react-router'), code:tsx (import MainRoutes from './routes/MainRoutes'), code:tsx (import { StrictMode } from 'react'), code:bash (git add -A && git commit -m "feat: update routes, App.tsx, m), Task 12: Routes + App.tsx + main.tsx Update

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (6): code:markdown (---), code:bash (cd /home/rahul-adhikari/code/own-projects/HRFolio/client && ), code:bash (cd /home/rahul-adhikari/code/own-projects/HRFolio/client && ), code:bash (cd /home/rahul-adhikari/code/own-projects/HRFolio/client && ), code:bash (git add -A && git commit -m "docs: update api-conventions ru), Task 14: Update api-conventions Rules + Run Lint + Build

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (4): code:js (export default tseslint.config({), code:js (// eslint.config.js), Expanding the ESLint configuration, React + TypeScript + Vite

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (5): code:bash (cd /home/rahul-adhikari/code/own-projects/HRFolio/client), code:bash (rm -rf src/store.ts src/Hooks/hook.ts), code:bash (npm uninstall @reduxjs/toolkit react-redux), code:bash (git add -A && git commit -m "chore: remove Redux (store, ser), Task 13: Delete Legacy Files

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (4): code:ts (import { z } from 'zod'), code:tsx (import { lazy } from 'react'), code:bash (git add -A && git commit -m "feat: add assessments module wi), Task 6: Assessments Module

## Knowledge Gaps
- **225 isolated node(s):** `code:block1 (.agents/)`, `code:bash (# Identify tech stack)`, `code:bash (for dir in packages/* apps/* services/* backend frontend 2>/)`, `code:bash (mkdir -p .agents/rules \)`, `code:markdown (# [PROJECT_NAME] — agents Instructions)` (+220 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `authenticate()` connect `Community 0` to `Community 16`, `Community 3`, `Community 14`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `[PACKAGE_1_NAME] — [type: frontend/backend/lib]` connect `Community 2` to `Community 4`, `Community 5`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `updateInterview()` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `code:block1 (.agents/)`, `code:bash (# Identify tech stack)`, `code:bash (for dir in packages/* apps/* services/* backend frontend 2>/)` to the rest of the system?**
  _225 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._