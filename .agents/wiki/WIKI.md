# HRFolio / CV Manager — Project Wiki

**Last updated:** 2026-05-30 (updated for server/src/ restructuring)
**Author:** Rahul Adhikari
**Repo:** https://github.com/Rahulad12/HRFolio
**Confidence key:** [High] = read from source, [Medium] = inferred from patterns, [Low] = guess/assumption

---

## 1. Executive Summary

HRFolio is a fullstack web application for managing candidate CVs through the complete hiring pipeline. [High] Users can add candidates, assign technical/behavioural assessments, schedule interviews, manage interviewers, send offer letters, and track every stage of the recruitment process with full audit logging. [High]

The frontend is a React 18 + TypeScript SPA with Ant Design UI and Redux Toolkit state management. [High] The backend is an Express 5 API connected to MongoDB via Mongoose. [High] Auth uses JWT tokens with optional Google OAuth login. [High]

Deployed to Vercel (frontend) and Render (backend). [Medium] (inferred from env file URLs and deployment config)

---

## 2. Business Overview

### Purpose
Replace manual/spreadsheet-based CV tracking with a centralized digital pipeline. [Medium] (inferred from feature set)

### Core workflow
```
Add Candidate → Assign Assessment → Schedule Interview → Track Progress → Send Offer → Hire
```
Each candidate progresses through a strict stage pipeline. [High] (server/middleware/CandidateProgress.js)

### User model
Single-role system with one type of authenticated user. [High] No RBAC — all authenticated users have the same permissions. [High] (server/middleware/auhtMiddleware.js — no role check exists)

User accounts created via Google OAuth on first login. [High] (server/config/passport.js)

### Key metrics tracked per candidate
- Technology expertise and seniority level [High]
- Years of experience [High]
- Expected salary [High]
- Current pipeline stage [High]
- Interview feedback and ratings [High]
- Assessment scores (pass threshold: 40/100) [High]
- Reference contacts [High]

---

## 3. System Architecture

### High-level
```
┌──────────────────────────────────────────────┐
│ Browser                                      │
│  React 18 + TypeScript + Ant Design + Tailwind│
│  Redux Toolkit + RTK Query                   │
└──────────────┬───────────────────────────────┘
               │ HTTPS / REST JSON
               ▼
┌──────────────────────────────────────────────┐
│ Express 5 API Server                         │
│  authenticate → checkUserExist → controller  │
│  → service → model → MongoDB                 │
│  Winston Logger (daily rotate)               │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│ MongoDB Atlas (cloud)                        │
│  Database: cv-manager                        │
│  16 collections, Mongoose ODM               │
└──────────────────────────────────────────────┘
```
[High] (from reading all server/ and client/ source files)

### External integrations
- **Google OAuth 2.0** — social login via Passport.js [High]
- **Gmail SMTP** — send emails via Nodemailer (app password auth) [High]
- **MongoDB Atlas** — cloud database [High]
- **Vercel** — frontend hosting [Medium]
- **Render** — backend hosting [Medium]

### Request lifecycle
1. User authenticates → JWT stored in localStorage [High]
2. Every API request attaches `Authorization: Bearer <token>` via RTK Query baseQuery [High]
3. Server middleware: `authenticate` verifies JWT → `checkUserExist` verifies user in DB [High]
4. Controller parses request, calls Mongoose model, sends response [High]
5. On 401/403: frontend baseQuery auto-logouts user [High] (client/src/services/api.ts)

---

## 4. Repository Structure

```
HRFolio/
├── AGENTS.md                    Agent instructions (self-contained)
├── agents.setup.md              Agent workspace setup instructions
├── cv_manager.env               Environment variable reference (⚠️ contains live secrets)
├── client/                      React / Vite frontend
│   ├── src/
│   │   ├── action/              Redux action creators (legacy)
│   │   ├── asset/               Static assets (images, etc.)
│   │   ├── component/           Shared UI components (Ant Design wrappers)
│   │   ├── data/                Static/dummy data files
│   │   ├── Hooks/               Custom React hooks
│   │   ├── pages/               Page-level components
│   │   ├── routes/              Route definitions
│   │   │   ├── MainRoutes.tsx   Top-level router (public vs protected)
│   │   │   ├── Public.tsx       Unauthenticated routes
│   │   │   └── Protected.tsx    Authenticated routes (wrapped in Layout)
│   │   ├── services/            RTK Query API service definitions (9 files)
│   │   ├── slices/              Redux Toolkit slices (10 files)
│   │   ├── types/               TypeScript type definitions
│   │   │   └── index.ts         ~40 exported types/interfaces
│   │   ├── utils/               Utility/helper functions
│   │   ├── App.tsx              Root component (Ant Design ConfigProvider)
│   │   ├── constant.ts          App-wide constants
│   │   ├── main.tsx             Entry point
│   │   └── store.ts             Redux store configuration
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
├── server/                      Express / Node.js backend
│   ├── src/
│   │   ├── index.ts                  Entry point (TypeScript — starts server)
│   │   ├── app.ts                    Express app (mounts legacy + new modules)
│   │   ├── legacy/                   Legacy JS code (migrated from root)
│   │   │   ├── config/
│   │   │   │   ├── db.js                MongoDB connection
│   │   │   │   └── passport.js          Google OAuth strategy
│   │   │   ├── controllers/
│   │   │   │   ├── userController.js         Auth (login, callback, ban)
│   │   │   │   ├── candidateController.js    Candidate CRUD + stage mgmt
│   │   │   │   ├── InterviewController.js    Interview CRUD + scheduling
│   │   │   │   ├── interviewerController.js  Interviewer CRUD
│   │   │   │   ├── assessmentController.js   Assessment CRUD + assign + score
│   │   │   │   ├── offerController.js        Offer CRUD
│   │   │   │   ├── emailController.js        Email template CRUD
│   │   │   │   ├── GeneralEmailController.js Send general emails
│   │   │   │   └── globalSearch.js           Full-text search
│   │   │   ├── middleware/
│   │   │   │   ├── auhtMiddleware.js         JWT verify + user check
│   │   │   │   └── CandidateProgress.js      Stage progression gate
│   │   │   ├── model/                    16 Mongoose model files
│   │   │   ├── routes/                   11 route files
│   │   │   ├── utils/
│   │   │   │   ├── logger.js             Winston logger (daily rotate)
│   │   │   │   ├── upload.js             Multer upload configuration
│   │   │   │   └── ...                   email, delete helpers
│   │   │   ├── Data/
│   │   │   │   └── Seeder.js             Seed + destroy scripts
│   │   │   └── index.js                  Legacy sub-app (wrapped as Express app)
│   │   └── modules/                  NEW TypeScript modules (empty scaffold)
│   │       └── <module-name>/
│   │           ├── index.ts
│   │           ├── types/
│   │           ├── routes/
│   │           ├── controller/
│   │           └── services/
│   ├── uploads/                  Uploaded resume files (runtime)
│   ├── logs/                     Winston log output (runtime, gitignored)
│   ├── tsconfig.json             TypeScript config
│   └── package.json
├── .agents/                      Agent workspace
│   ├── context/                  Auto-generated codebase maps
│   ├── decisions/                ADRs
│   ├── rules/                    6 rule files
│   ├── sessions/                 Task handoff
│   ├── skills/                   8 skills
│   ├── taskboard/                GitLab board mirror
│   ├── wiki/                     This wiki
│   └── raw/                      Source docs for ingestion
└── .gitignore
```
[High] (from reading filesystem and every source file)

---

## 5. Feature Inventory

### 5.1 Dashboard
- **Route:** `/dashboard`
- **Component:** `<Dashboard />` [High]
- **Description:** Main landing page with metrics and charts (Chart.js). [High] Shows candidate counts, pipeline status, recent activity. [Medium]
- **API:** None specific to dashboard page [Low]
- **Slice:** N/A

### 5.2 Candidates
- **Routes:** `/dashboard/candidates` (list), `/dashboard/candidates/new` (create), `/dashboard/candidates/:id` (detail), `/dashboard/candidates/edit/:id` (edit), `/dashboard/candidates/email/:id` (send email) [High]
- **Components:** `<CandidateList />`, `<CandidateDetail />`, `<CandidateForm />`, `<GeneralEmailForm />` [High]
- **API Endpoints:**
  - `POST /api/candidate` — create [High]
  - `GET /api/candidate` — list (with `searchText` and `status` filters) [High]
  - `GET /api/candidate/:id` — get by ID [High]
  - `PUT /api/candidate/:id` — update [High]
  - `PUT /api/candidate/stage/:id` — change stage [High]
  - `PUT /api/candidate/reject/:id` — reject with email [High]
  - `DELETE /api/candidate` — bulk delete [High]
- **Slice:** `candidate` [High]
- **Service:** `candidateServiceApi.ts` (RTK Query) [High]

### 5.3 Interviews
- **Routes:** `/dashboard/interviews` (list), `/dashboard/interviews/schedule` (schedule) [High]
- **Components:** `<Interviews />`, `<InterviewSchedule />` [High]
- **API:**
  - `POST /api/interview` — create [High]
  - `GET /api/interview` — list all [High]
  - `GET /api/interview/:id` — get by ID [High]
  - `GET /api/interview/candidate/:id` — get by candidate [High]
  - `PUT /api/interview/:id` — update [High]
  - `DELETE /api/interview/:id` — delete [High]
- **Slice:** `interview` [High]
- **Service:** `interviewServiceApi.ts` [High]

### 5.4 Interviewers
- **Routes:** `/dashboard/interviewers` (list), `/dashboard/interviewers/new` (create), `/dashboard/interviewers/edit/:id` (edit) [High]
- **Components:** `<InterviewerList />`, `<InterviewerForm />` [High]
- **API:**
  - `POST /api/interviewer` — create [High]
  - `GET /api/interviewer` — list all [High]
  - `GET /api/interviewer/:id` — get by ID [High]
  - `PUT /api/interviewer/:id` — update [High]
  - `DELETE /api/interviewer/:id` — delete [High]
- **Slice:** Shared in `interview` slice [High]

### 5.5 Assessments
- **Routes:** `/dashboard/assessments` (list), `/dashboard/assessments/new` (create), `/dashboard/assessments/edit/:id` (edit) [High]
- **Components:** `<AssessmentList />`, `<AssessmentForm />` [High]
- **API:**
  - `POST /api/assessment` — create assessment [High]
  - `GET /api/assessment` — list all [High]
  - `GET /api/assessment/:id` — get by ID [High]
  - `PUT /api/assessment/:id` — update [High]
  - `DELETE /api/assessment/:id` — delete [High]
- **Slice:** `assessments` [High]
- **Service:** `assessmentServiceApi.ts` [High]

### 5.6 Assessment Assignments
- **Routes:** `/dashboard/assessments/assign` (assign), `/dashboard/assessments/assignments` (list), `/dashboard/assessments/assign/edit/:id` (edit) [High]
- **Components:** `<AssignAssessment />`, `<AssessmentAssignmentList />` [High]
- **API:**
  - `POST /api/assessment/assign` — assign to candidates [High]
  - `GET /api/assessment/assignment` — list assignments [High]
  - `GET /api/assessment/assignment/:id` — get by ID [High]
  - `PUT /api/assessment/assignment/:id` — update [High]
  - `DELETE /api/assessment/assignment/:id` — delete [High]
  - `POST /api/assessment/score` — submit score [High]
- **Slice:** `assessments` (shared with assessments) [High]

### 5.7 Offers
- **Routes:** `/dashboard/offers` (list), `/dashboard/offers/new` (create), `/dashboard/offers/edit/:id` (edit) [High]
- **Components:** `<OfferList />`, `<OfferForm />` [High]
- **API:**
  - `POST /api/offer` — create offer [High]
  - `GET /api/offer` — list all [High]
  - `GET /api/offer/:id` — get by ID [High]
  - `GET /api/offer/candidate/:id` — get by candidate [High]
  - `PUT /api/offer/:id` — update [High]
  - `DELETE /api/offer/:id` — delete [High]
- **Slice:** `offer` [High]
- **Service:** `offerService.ts` [High]

### 5.8 Email Templates
- **Routes:** `/dashboard/email-templates` (list), `/dashboard/email-templates/new` (create), `/dashboard/email-templates/edit/:id` (edit) [High]
- **Components:** `<EmailTemplateList />`, `<EmailTemplateForm />` [High]
- **API:**
  - `POST /api/email` — create template [High]
  - `GET /api/email` — list all [High]
  - `GET /api/email/:id` — get by ID [High]
  - `PUT /api/email/:id` — update [High]
  - `DELETE /api/email/:id` — delete [High]
  - `POST /api/email/general/send` — send manual email [High]
- **Slice:** N/A (fetched via RTK Query only) [High]

### 5.9 Activity Logs
- **Route:** No dedicated page component found [Low]
- **API:**
  - `GET /api/activity-log` — list all [High]
  - `GET /api/activity-log/candidate/:id` — by candidate [High]
- **Slice:** N/A [High]
- **Note:** ⚠️ Activity log data is fetched in the app but no dedicated page identified. May be displayed within candidate detail. [Assumption]

### 5.10 Search
- **Route:** Global search (driven by `searchTerms` slice) [High]
- **API:** `GET /api/search?searchText=...` — regex search on name, technology, level [High]
- **Slice:** `searchTerms` [High]

### 5.11 File Uploads
- **Route:** Triggered inline from candidate form [Medium]
- **API:**
  - `POST /api/uploads/resume` — upload resume file [High]
  - `GET /api/uploads/resume/:filename/download` — download resume [High]
- **Storage:** Local filesystem (`server/uploads/`) — see `server/src/legacy/upload.js` [High]
- **Note:** ⚠️ File uploads to local filesystem don't scale horizontally. If deployed to Render, uploaded files are lost on each deploy. [Medium]

---

## 6. API Reference

All endpoints prefixed with `/api`. All protected routes require `Authorization: Bearer <token>` header. [High] (server/routes/* + server/middleware/auhtMiddleware.js)

### 6.1 Auth (`/api/auth`)
| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| GET | `/api/auth/google` | passport.authenticate("google") | googleLoginRedirect | Initiate Google OAuth [High] |
| GET | `/api/auth/google/callback` | passport.authenticate("google") | googleCallback | OAuth callback — sets JWT, redirects [High] |
| DELETE | `/api/auth/:id` | authenticate, checkUserExist | bannedUser | Toggle user active/inactive status [High] |

### 6.2 Candidates (`/api/candidate`)
| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| POST | `/` | authenticate, checkUserExist | createCandidate | Create candidate with references [High] |
| GET | `/` | authenticate, checkUserExist | getAllCandidates | List with searchText + status filters [High] |
| GET | `/:id` | authenticate, checkUserExist | getCandidateById | Single candidate [High] |
| PUT | `/:id` | authenticate, checkUserExist | updateCandidate | Update fields [High] |
| PUT | `/stage/:id` | authenticate, checkUserExist | changeCandidateStage | Advance to next pipeline stage [High] |
| PUT | `/reject/:id` | authenticate, checkUserExist | rejectCandidate | Reject + send rejection email [High] |
| DELETE | `/` | authenticate, checkUserExist | deleteCandidates | Bulk delete (IDs in body) [High] |
| GET | `/log/:id` | authenticate, checkUserExist | getCandidateLogsByCandidateId | Candidate audit log [High] |

### 6.3 Interviews (`/api/interview`)
| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| POST | `/` | authenticate, checkUserExist, canInterviewProgress() | createInterview | Schedule interview [High] |
| GET | `/` | authenticate, checkUserExist | getAllInterviews | List all [High] |
| GET | `/:id` | authenticate, checkUserExist | getInterviewById | Single interview [High] |
| GET | `/candidate/:id` | authenticate, checkUserExist | getAllInterviewsByCandidate | By candidate [High] |
| PUT | `/:id` | authenticate, checkUserExist | updateInterview | Update (detects reschedules) [High] |
| DELETE | `/:id` | authenticate, checkUserExist | deleteInterview | Delete [High] |
| GET | `/log` | authenticate, checkUserExist | getInterviewLog | All logs [High] |
| GET | `/log/candidate/:id` | authenticate, checkUserExist | getInterviewLogByCandidate | Logs by candidate [High] |

### 6.4 Interviewers (`/api/interviewer`)
| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| POST | `/` | authenticate, checkUserExist | createInterviewer | Create [High] |
| GET | `/` | authenticate, checkUserExist | getInterviewer | List all [High] |
| GET | `/:id` | authenticate, checkUserExist | getInterviewerById | Single [High] |
| PUT | `/:id` | authenticate, checkUserExist | updateInterviewer | Update [High] |
| DELETE | `/:id` | authenticate, checkUserExist | deleteInterviewer | Delete [High] |

### 6.5 Assessments (`/api/assessment`)
| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| POST | `/` | authenticate, checkUserExist | createAssessment | Create assessment [High] |
| GET | `/` | authenticate, checkUserExist | getAssessment | List all [High] |
| GET | `/:id` | authenticate, checkUserExist | getAssessmentById | Single [High] |
| PUT | `/:id` | authenticate, checkUserExist | updateAssessment | Update [High] |
| DELETE | `/:id` | authenticate, checkUserExist | deleteAssessment | Delete [High] |
| POST | `/assign` | authenticate, checkUserExist | assignAssessment | Assign to candidate(s) [High] |
| GET | `/assignment` | authenticate, checkUserExist | getAssignment | List assignments [High] |
| GET | `/assignment/:id` | authenticate, checkUserExist | getAssignmentById | Single assignment [High] |
| GET | `/assignment/candidate/:id` | authenticate, checkUserExist | getAssignmentByCandidateId | By candidate [High] |
| PUT | `/assignment/:id` | authenticate, checkUserExist | updateAssignmnet | Update assignment [High] |
| DELETE | `/assignment/:id` | authenticate, checkUserExist | deleteAssignment | Delete assignment [High] |
| POST | `/score` | authenticate, checkUserExist | createScore | Submit score [High] |
| GET | `/score` | authenticate, checkUserExist | getScore | List scores [High] |
| GET | `/score/:id` | authenticate, checkUserExist | getScoreById | Scores by candidate [High] |
| GET | `/logs/candidate/:id` | authenticate, checkUserExist | getAssessmentLogByCandidateId | Assessment audit log [High] |

### 6.6 Offers (`/api/offer`)
| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| POST | `/` | authenticate, checkUserExist, canCandidateProgress("offered") | createOffer | Create offer [High] |
| GET | `/` | authenticate, checkUserExist | getOffer | List all [High] |
| GET | `/:id` | authenticate, checkUserExist | getOfferById | Single [High] |
| GET | `/candidate/:id` | authenticate, checkUserExist | getOfferByCandidates | By candidate [High] |
| PUT | `/:id` | authenticate, checkUserExist | updateOffer | Update status [High] |
| DELETE | `/:id` | authenticate, checkUserExist | delteOffer | Delete [High] |
| GET | `/log/candidate/:id` | authenticate, checkUserExist | getOfferLogsByCandidate | Offer audit log [High] |

### 6.7 Email Templates (`/api/email`)
| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| POST | `/` | authenticate, checkUserExist | createEmailTemplate | Create template [High] |
| GET | `/` | authenticate, checkUserExist | getAllEmailTemplates | List all [High] |
| GET | `/:id` | authenticate, checkUserExist | getSingleEmailTemplate | Single [High] |
| PUT | `/:id` | authenticate, checkUserExist | updateEmailTemplate | Update [High] |
| DELETE | `/:id` | authenticate, checkUserExist | deleteEmailTemplate | Delete [High] |
| POST | `/general/send` | authenticate, checkUserExist | createGeneralEmail | Send manual email to candidate [High] |

### 6.8 Uploads (`/api/uploads`)
| Method | Path | Middleware | Handler | Description |
|---|---|---|---|---|
| POST | `/resume` | multer single("resume") | Inline: save file → return URL | Upload resume [High] |
| GET | `/resume/:filename/download` | none | Inline: serve static file | Download resume [High] |

### 6.9 Activity Logs (`/api/activity-log`)
| Method | Path | Middleware | Handler | Description |
|---|---|---|---|---|
| GET | `/` | authenticate, checkUserExist | Inline: ActivityLog.find() | List all [High] |
| GET | `/candidate/:id` | authenticate, checkUserExist | Inline: ActivityLog.find({candidate:id}) | By candidate [High] |

### 6.10 Search (`/api/search`)
| Method | Path | Middleware | Controller | Description |
|---|---|---|---|---|
| GET | `/` | authenticate, checkUserExist | SearchCandidates | Regex search name/technology/level [High] |

### 6.11 Hired (`/api/hired`)
| Method | Path | Middleware | Handler | Description |
|---|---|---|---|---|
| POST | `/` | authenticate, checkUserExist, canCandidateProgress("hired") | Inline: send email → update status → log | Mark candidate as hired [High] |

---

## 7. Database Documentation

Database: MongoDB Atlas (`cv-manager` collection). [High] 16 collections via Mongoose. [High]

### 7.1 Entity Relationships

```
User ──┐
       ├──< CandidateLog (performedBy)
       ├──< InterviewLog (performedBy)
       ├──< AssessmentLog (performedBy)
       ├──< OfferLog (performedBy)
       ├──< ActivityLog (userID)
       └──< CandidateLogs (performedBy)

Candidate ──┐
            ├──< Interview (candidate)
            ├──< AssessmentAssignment (candidate)
            ├──< Score (candidate)
            ├──< Reference (candidate)
            ├──< Offer (candidate)
            ├──< GeneralEmail (candidate)
            ├──< ActivityLog (candidate)
            ├──< CandidateLog (candidate)
            ├──< InterviewLog (candidate)
            ├──< AssessmentLog (candidate)
            ├──< OfferLog (candidate)
            └──< CandidateLogs (candidate)

Interviewer ──┐
              ├──< Interview (interviewer)
              └──< InterviewLog (interviewer)

Assessment ──┐
             ├──< AssessmentAssignment (assessment)
             ├──< Score (assessment)
             └──< AssessmentLog (assessment)

EmailTemplate ──┐
                └──< Offer (email)

Offer ──┐
        └──< OfferLog (offer)
```
[High] (from all model files)

### 7.2 Models

#### User (`User.js`)
| Field | Type | Constraints |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique |
| `googleId` | String | optional |
| `picture` | String | optional |
| `isLoggedIn` | Boolean | default: false |
| `status` | String | enum: `active`, `inactive`; default: `active` |
| `createdAt` | Date | auto (timestamps) |
| `updatedAt` | Date | auto (timestamps) |

#### Candidate (`Candidate.js`)
| Field | Type | Constraints |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique, regex validated |
| `phone` | String | required |
| `technology` | String | required |
| `level` | String | enum: `junior`, `mid`, `senior`; required |
| `experience` | Number | required |
| `expectedsalary` | Number | required |
| `resume` | String | file URL |
| `references` | [{name, contact, relation}] | subdocument array |
| `progress` | Object | dynamic keys per stage with `{completed: Boolean, date: Date}` |
| `status` | String | enum: `shortlisted`, `assessment`, `first`, `second`, `third`, `offered`, `hired`, `rejected`; default: `shortlisted` |
| `applieddate` | Date | required |
| `createdAt` | Date | auto |
| `updatedAt` | Date | auto |

#### Interview (`Interview.js`)
| Field | Type | Constraints / Ref |
|---|---|---|
| `candidate` | ObjectId | ref: `candidates`; required |
| `interviewer` | ObjectId | ref: `interviewers`; required |
| `date` | Date | required |
| `time` | Date | required |
| `status` | String | enum: `draft`, `scheduled`, `cancelled`, `completed`, `failed`; required |
| `type` | String | enum: `in-person`, `video`; default: `in-person` |
| `InterviewRound` | String | enum: `first`, `second`, `third`; default: `first` |
| `notes` | String | optional |
| `feedback` | String | optional |
| `rating` | Number | optional |
| `meetingLink` | String | optional |

#### Assessment (`Assessment.js`)
| Field | Type | Constraints |
|---|---|---|
| `title` | String | required, lowercase |
| `type` | String | enum: `behavioural`, `technical`; required, lowercase |
| `technology` | String | required, lowercase |
| `level` | String | required, lowercase |
| `duration` | Number | required (minutes) |
| `assessmentLink` | String | required (URL to test) |

#### AssessmentAssignment (`AssessmentAssignment.js`)
| Field | Type | Constraints / Ref |
|---|---|---|
| `candidate` | ObjectId | ref: `candidates`; required |
| `assessment` | ObjectId | ref: `assessments`; required |
| `emailTemplate` | ObjectId | ref: `emailtemplates` |
| `dueDate` | String | required |
| `score` | Number | optional |
| `status` | String | enum: `assigned`, `pending`, `completed`; default: `assigned` |

Pre-save hook: auto-updates candidate status to `assessment` on assign, and calls `updateCandidateCurrentStage` on completion. [High]

#### Score (`ScoreModle.js`) ⚠️ **Typo in filename**
| Field | Type | Constraints / Ref |
|---|---|---|
| `candidate` | ObjectId | ref: `candidates` |
| `assessment` | ObjectId | ref: `assessments` |
| `score` | Number | required (0-100) |
| `status` | String | enum: `Passed`, `Failed`; default: `pending` |
| `note` | String | optional |

#### Interviewers (`Interviewers.js`)
| Field | Type | Constraints |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique |
| `department` | String | required |
| `position` | String | required |
| `availability` | [{id, day, timeSlots: [String]}] | array of availability slots |

#### Reference (`Reference.js`)
| Field | Type | Constraints / Ref |
|---|---|---|
| `candidate` | ObjectId | ref: `candidate`; required |
| `name` | String | required |
| `contact` | String | required |
| `relation` | String | required |

#### EmailTemplate (`EmailTemplate.js`)
| Field | Type | Constraints |
|---|---|---|
| `name` | String | required, lowercase |
| `type` | String | enum: `offer`, `interview`, `assessment`, `rejection`, `hired`, `other`; required, lowercase |
| `subject` | String | required |
| `body` | String | required (with `{{variable}}` placeholders) |
| `variables` | [String] | auto-extracted from body; validated against 29 allowed values |

Pre-save hook: extracts `{{variable}}` from body, validates each against allowed list. [High]

#### Offer (`Offer.js`)
| Field | Type | Constraints / Ref |
|---|---|---|
| `candidate` | ObjectId | ref: `candidates`; required |
| `email` | ObjectId | ref: `emailtemplates`; required |
| `position` | String | required |
| `salary` | String | required |
| `startDate` | String | required |
| `responseDeadline` | String | required |
| `status` | String | enum: `draft`, `sent`, `accepted`, `rejected`; required |

#### Audit Log Models

**ActivityLog** — polymorphic audit trail with `entityType` dynamic ref. [High]
**CandidateLogs** — candidate-specific actions: `created`, `updated`, `deleted`, `rejected`. [High]
**AssessmentLog** — assessment actions: `created`, `updated`, `deleted`. [High]
**interviewLog** — interview actions: `created`, `updated`, `deleted`, `scheduled`, `cancelled`, `completed`, `failed`, `rescheduled`. [High]
**offerLogs** — offer actions: `created`, `updated`, `deleted`. [High]
**GeneralEmail** — sent email log with candidate ref. [High]

---

## 8. Authentication & Authorization

### 8.1 Authentication methods

**Google OAuth** (primary): [High]
1. User clicks "Login with Google" → redirects to `/api/auth/google` [High]
2. Passport GoogleStrategy redirects to Google consent screen [High]
3. Google calls back at `/api/auth/google/callback` [High]
4. Server looks up or creates user by `googleId` [High]
5. Server generates JWT (30-day expiry, `jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "30d"})`) [High]
6. Server redirects to `FRONTEND_URL?token=<jwt>&user=<userInfo>` [High]
7. Frontend stores token + user info in `localStorage` [High]

**JWT session:** [High]
- Token attached to every request via `Authorization: Bearer <token>` header [High]
- Verified in `authenticate` middleware → decoded payload attached to `req.user` [High]
- `checkUserExist` middleware then verifies user still exists in DB [High]
- On 401/403: RTK Query baseQuery auto-dispatchs `logout` action [High]
- ⚠️ Token stored in localStorage — vulnerable to XSS. [High]

### 8.2 Authorization model

**None.** Every authenticated user has the same access. [High] No role checks, no permission flags, no admin/user distinction. [High]

### 8.3 Auth middleware chain

```
authenticate (JWT verify)
  └── checkUserExist (DB lookup)
       └── canCandidateProgress(stage) [optional, for stage-sensitive endpoints]
```
[High] (server/middleware/auhtMiddleware.js, server/middleware/CandidateProgress.js)

---

## 9. Third-Party Integrations

| Service | Purpose | Auth method | Confidence |
|---|---|---|---|
| Google OAuth 2.0 | Social login | OAuth 2.0 + Passport.js | [High] |
| Gmail SMTP | Send emails | App password (`EMAIL_PASS`) | [High] |
| MongoDB Atlas | Database | Connection string + IP whitelist | [High] |
| Vercel | Frontend hosting | GitHub auto-deploy | [Medium] |
| Render | Backend hosting | GitHub auto-deploy | [Medium] |

---

## 10. Development Setup

### Prerequisites
- Node.js 18+ [High]
- MongoDB (Atlas or local) [High]
- Google OAuth credentials (client ID + secret) [High]
- Gmail account with app password [High]

### Environment variables

| Variable | Description | Required by |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | server |
| `JWT_SECRET` | Secret key for JWT signing | server |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | server |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | server |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL (switches based on NODE_ENV) | server |
| `FRONTEND_URL` | Frontend URL for OAuth redirect | server |
| `EMAIL_USER` | Gmail address for sending emails | server |
| `EMAIL_PASS` | Gmail app password | server |
| `VITE_API_URL` | Backend API URL for frontend HTTP client | client |

### Local dev steps
```bash
# Server
cd server
cp ../cv_manager.env .env    # ⚠️ contains live secrets — use your own
npm install
npm run data:seed
npm run dev                  # tsx watch src/index.ts

# Client (separate terminal)
cd client
cp .env.example .env         # create with VITE_API_URL=http://localhost:5000
npm install
npm run dev                  # vite
```
[High] (from package.json scripts)

### Seed & Destroy
```bash
cd server
npm run data:seed      # node src/legacy/Data/Seeder.js seed
npm run data:destroy   # node src/legacy/Data/Seeder.js destroy
```
[High]

---

## 11. Deployment Guide

### Frontend — Vercel
- Auto-deploys from GitHub [Medium]
- Build command: `cd client && npm run build` (tsc -b && vite build) [High]
- Env var: `VITE_API_URL` must point to production backend URL [Medium]

### Backend — Render
- Auto-deploys from GitHub [Medium]
- Build command: `npm run build` (tsc) [High]
- Start command: `npm start` (node dist/index.js) [High]
- All env vars from Section 10 must be configured in Render dashboard [Medium]
- ⚠️ Uploaded resumes stored on local filesystem — lost on redeploy. Render uses ephemeral storage. [High] (server/src/legacy/upload.js)

---

## 12. Operational Runbook

### Common tasks

| Task | Command | Notes |
|---|---|---|
| View server logs | `cat server/logs/*.log` | Winston daily rotate files [High] |
| Seed database | `cd server && npm run data:seed` | Inserts sample data [High] |
| Destroy database | `cd server && npm run data:destroy` | Drops all collections [High] |
| Restart server | Render dashboard → manual deploy OR `kill -9 <pid> && npm start` | [Medium] |
| Check MongoDB connection | `server/logs/` — look for connection errors | [High] |

### Common failure modes

| Symptom | Likely cause | Fix |
|---|---|---|
| 401 on all requests | JWT expired (30d) or missing | Re-login via Google OAuth [High] |
| Emails not sending | Gmail app password expired or changed | Update `EMAIL_PASS` env var [High] |
| Uploaded files missing on production | Render ephemeral storage cleared on deploy | Use external file storage (S3) [Medium] |
| Google OAuth redirect error | `GOOGLE_CALLBACK_URL` doesn't match Google Cloud Console | Update both to match [High] |

---

## 13. Data Flows

### 13.1 Candidate Lifecycle (Finite State Machine)

```
                    ┌──────────┐
                    │shortlisted│
                    └────┬─────┘
                         │ assessment assigned / stage changed
                    ┌────▼─────┐
                    │assessment │
                    └────┬─────┘
                         │ interview scheduled (first round)
                    ┌────▼─────┐
                    │  first   │
                    └────┬─────┘
                         │ interview scheduled (second round)
                    ┌────▼─────┐
                    │  second  │
                    └────┬─────┘
                         │ interview scheduled (third round)
                    ┌────▼─────┐
                    │  third   │
                    └────┬─────┘
                         │ offer created (status: sent)
                    ┌────▼─────┐
                    │ offered  │
                    └────┬─────┘
                         │ hired endpoint called
                    ┌────▼─────┐
                    │  hired   │ (terminal)
                    └──────────┘

                    ┌──────────┐
                    │ rejected │ (exit from any non-terminal stage)
                    └──────────┘
```
[High] (server/middleware/CandidateProgress.js + server/controllers/)

**Transition rules:**
- Stages must progress sequentially — cannot skip [High]
- Each interview round unlocks the next (first → second → third) [High]
- `offered` requires any of `assessment`, `first`, `second`, or `third` to be completed (not just `third`) [High] — this is a deliberate business rule, see middleware
- `hired` requires `offered` stage [High]
- `rejected` is an exit from any non-terminal stage [High]

### 13.2 Interview Flow
1. Create interview → status `draft` or `scheduled` [High]
2. Update → can change status to `completed`, `cancelled`, `failed` [High]
3. If `completed`: candidate stage auto-advances to next round [High]
4. On reschedule: creates log entry (`rescheduled` action) [High]
5. Past dates cannot be set [High]
6. Cannot mark as completed if date/time is in the future [High]

### 13.3 Assessment Flow
1. Create assessment (title, type, technology, level, duration, link) [High]
2. Assign to one or more candidates → triggers email, candidate status → `assessment` [High]
3. Candidate completes → score submitted (0-100) [High]
4. Score ≥ 40 → status `Passed`. Score < 40 → status `Failed`. [High]
5. Score submission triggers `updateCandidateCurrentStage` — advances candidate to next stage automatically [High]

### 13.4 Email Trigger Matrix

| Action | Email sent | Condition |
|---|---|---|
| Interview created | Candidate + Interviewer | Production only (NODE_ENV check) [High] |
| Interview rescheduled | Candidate + Interviewer | Production only [High] |
| Assessment assigned | Candidate | Production only [High] |
| Offer created (status=sent) | Candidate | Production only [High] |
| Candidate rejected | Candidate | Production only [High] |
| Candidate hired | Candidate | Production only [High] |
| Manual email | Candidate | Always [High] |

⚠️ Emails are sent synchronously — no queue, no retry. [High]
⚠️ No email sending in development mode — emails are "silent" when NODE_ENV is not production. [High]

---

## 14. Business Rules

1. **Stage progression is sequential:** Each stage gate checks that the previous stage (or one of the required prior stages) is completed before allowing transition. [High] (middleware/CandidateProgress.js)
2. **Interview rounds must be sequential:** First → second → third. Cannot schedule second round before first is completed. [High] (InterviewController.js)
3. **Cannot schedule interview in the past:** Date validation in createInterview. [High]
4. **Cannot complete interview in the future:** Status cannot be set to `completed` if date/time is future. [High]
5. **Assessment pass threshold:** Score ≥ 40 out of 100. Hardcoded in controller. [High] (assessmentController.js: `scoreData.score < 40 ? "Failed" : "Passed"`)
6. **Duplicate prevention:** Cannot assign same assessment twice to same candidate. Cannot create duplicate offer for same candidate. [High]
7. **Response deadline must be before start date:** On offer creation. [High]
8. **Applied date cannot be in the future:** On candidate creation. [High]
9. **Email templates validate variables:** Only 29 predefined variable names allowed (e.g., `{{candidateName}}`, `{{interviewDate}}`, `{{offerSalary}}`). [High] (EmailTemplate.js:51-80)
10. **Email is production-only:** All trigger-based emails check `process.env.NODE_ENV === "production"` before sending. [High]

---

## 15. Technical Debt Register

| # | Item | Severity | Location | Evidence |
|---|---|---|---|---|
| 1 | ⚠️ **Auth token in localStorage** | Critical | client/src/slices/authSlices.ts | `localStorage.setItem("token", ...)` [High] |
| 2 | ⚠️ **Live secrets in env file committed to repo** | Critical | cv_manager.env | Contains DB URI, JWT secret, OAuth credentials [High] |
| 3 | ⚠️ **`.catch(err => console.log(err))` patterns** | Medium | Multiple controllers | Grep shows many `.catch` blocks with only console.log [High] |
| 4 | ⚠️ **Catch-all `*` routes returning component instead of 404** | Medium | client/src/routes/Protected.tsx, Public.tsx | `path: "*"` renders `<NotFound />` but server may still get invoked [High] |
| 5 | ⚠️ **Server is plain JavaScript (`.js`), not TypeScript** | Medium | server/src/legacy/ | Legacy files are `.js` — new modules should be `.ts`. tsconfig.json + tsx added [High] |
| 6 | ⚠️ **Filename typo: `ScoreModle.js`** | Low | server/model/ScoreModle.js | Should be `ScoreModel.js` [High] |
| 7 | ⚠️ **Filename typo: `auhtMiddleware.js`** | Low | server/middleware/auhtMiddleware.js | Should be `authMiddleware.js` [High] |
| 8 | ⚠️ **No request validation middleware on most endpoints** | Medium | server/controllers/ | `express-validator` is a dependency but not consistently used [Medium] |
| 9 | ⚠️ **Synchronous email sending (no queue)** | Medium | server/controllers/ | All emails sent inline — blocks response [High] |
| 10 | ⚠️ **Filesystem-based file storage** | Medium | server/upload.js | Not suitable for horizontal scaling; data lost on Render redeploy [High] |
| 11 | ⚠️ **`console.log` in production code** | Low | Throughout | Not all logging goes through Winston [High] (grep shows multiple instances) |

---

## 16. Known Risks

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Token theft via XSS | Full account compromise | Low | Migrate to httpOnly cookies [Medium] |
| Secrets in source control | Credential leak | High (already in repo) | Rotate all secrets, add to .gitignore, use env vars [High] |
| No rate limiting on API | Brute force / DoS | Medium | Add express-rate-limit [Medium] |
| Email delivery failure | Candidate never notified | Medium | Add email queue with retry [Medium] |
| File loss on deploy | Lost resumes | High (Render) | Migrate to S3/Cloudinary [High] |
| No database migrations | Schema drift | Medium | Add migration system (e.g., migrate-mongoose) [Medium] |
| No integration tests | Regression on deploy | High | Add API-level tests [Medium] |
| Single user model | No audit trail per user action | Low | Currently by design for single-tenant [Medium] |

---

## 17. Open Questions

These require human input to resolve:

1. **Is the application actively used in production?** The env file references both Vercel and Render URLs, but it's unclear if real HR teams are using it. [Low]

2. **Which features are most used?** No analytics or usage tracking. Would help prioritize technical debt paydown. [Low]

3. **What is `VITE_API_URL` for the frontend?** Not tracked in version control. A `.env.example` file should be created. [Assumption]

4. **Are seed data scripts up to date?** The seeder imports model files — if models changed but seeder wasn't updated, seed data may not populate correctly. [Low]

5. **Is the `/api/hired` endpoint redundant with the stage change endpoint?** `PUT /api/candidate/stage/:id` can also advance to `hired`. Two paths to the same state. Intentional? [Medium]

6. **What happens to interview and assessment data when a candidate is rejected?** The rejection controller clears candidate progress but does not clean up related interviews or assessments. Orphaned data? [Medium]

7. **Who maintains deployments to Vercel and Render?** Credentials and access not documented. [Low]

---

## 18. Change Log

| Date | Author | Description |
|---|---|---|
| 2026-05-30 | Rahul Adhikari | Initial wiki — full project analysis across 17 sections |
| 2026-05-30 | Rahul Adhikari | Restructured server/ into src/ — legacy code → src/legacy/, new TS modules → src/modules/, added app.ts + index.ts + tsconfig.json |
