# Graph Report - client/src + server/src  (2026-06-06)

## Corpus Check
- 265 files · ~344,050 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 992 nodes · 1634 edges · 108 communities (95 shown, 13 thin omitted)
- Extraction: 84% EXTRACTED · 16% INFERRED · 0% AMBIGUOUS · INFERRED: 259 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Dashboard Page|Dashboard Page]]
- [[_COMMUNITY_Candidate Model|Candidate Model]]
- [[_COMMUNITY_Server Src Legacy Routes Authroutes Js|Server Src Legacy Routes Authroutes Js]]
- [[_COMMUNITY_Theme Store|Theme Store]]
- [[_COMMUNITY_Client Src Modules Escalations Components Escalationstable Tsx|Client Src Modules Escalations Components Escalationstable Tsx]]
- [[_COMMUNITY_Client Src Modules Candidates Lib Queries Candidate Queries Ts|Client Src Modules Candidates Lib Queries Candidate Queries Ts]]
- [[_COMMUNITY_Client Src Modules Interviews Components Interviewlist Tsx|Client Src Modules Interviews Components Interviewlist Tsx]]
- [[_COMMUNITY_Auditlog Service|Auditlog Service]]
- [[_COMMUNITY_Client Src Modules Assessments Lib Queries Assessment Queries Ts|Client Src Modules Assessments Lib Queries Assessment Queries Ts]]
- [[_COMMUNITY_Emailtemplate Type|Emailtemplate Type]]
- [[_COMMUNITY_Authenticate Middleware|Authenticate Middleware]]
- [[_COMMUNITY_Client Src Modules Dashboard Page Tsx|Client Src Modules Dashboard Page Tsx]]
- [[_COMMUNITY_Lookup Queries|Lookup Queries]]
- [[_COMMUNITY_Server Src Legacy Controllers Interviewcontroller Js|Server Src Legacy Controllers Interviewcontroller Js]]
- [[_COMMUNITY_Client Src Modules Offers Lib Queries Offer Queries Ts|Client Src Modules Offers Lib Queries Offer Queries Ts]]
- [[_COMMUNITY_Client Src Modules Emails Components Emailtemplateform Tsx|Client Src Modules Emails Components Emailtemplateform Tsx]]
- [[_COMMUNITY_Lib Axios Get|Lib Axios Get]]
- [[_COMMUNITY_Server Src Legacy Utils Deleteallrelateddocs Js|Server Src Legacy Utils Deleteallrelateddocs Js]]
- [[_COMMUNITY_Server Src Legacy Middleware Auhtmiddleware Js|Server Src Legacy Middleware Auhtmiddleware Js]]
- [[_COMMUNITY_Offer Types|Offer Types]]
- [[_COMMUNITY_Server Src Legacy Controllers Candidatecontroller Js|Server Src Legacy Controllers Candidatecontroller Js]]
- [[_COMMUNITY_Server Src Legacy Controllers Assessmentcontroller Js|Server Src Legacy Controllers Assessmentcontroller Js]]
- [[_COMMUNITY_Client Src Modules User Management Components Usertable Tsx|Client Src Modules User Management Components Usertable Tsx]]
- [[_COMMUNITY_Candidatequickaction Component|Candidatequickaction Component]]
- [[_COMMUNITY_Client Src Modules Interviewers Lib Queries Interviewer Queries Ts|Client Src Modules Interviewers Lib Queries Interviewer Queries Ts]]
- [[_COMMUNITY_Client Src Modules Candidates Lib Api Candidate Api Ts|Client Src Modules Candidates Lib Api Candidate Api Ts]]
- [[_COMMUNITY_Lib Axios Post|Lib Axios Post]]
- [[_COMMUNITY_Server Src Index Ts|Server Src Index Ts]]
- [[_COMMUNITY_Client Src Modules Auth Context Authcontext Tsx|Client Src Modules Auth Context Authcontext Tsx]]
- [[_COMMUNITY_Lib Axios Delete|Lib Axios Delete]]
- [[_COMMUNITY_Client Src Modules User Management Lib Api User Api Ts|Client Src Modules User Management Lib Api User Api Ts]]
- [[_COMMUNITY_Client Src Modules Landing Page Tsx|Client Src Modules Landing Page Tsx]]
- [[_COMMUNITY_Server Src Legacy Controllers Offercontroller Js|Server Src Legacy Controllers Offercontroller Js]]
- [[_COMMUNITY_Landing Page|Landing Page]]
- [[_COMMUNITY_Client Src Modules Offers Lib Api Offer Api Ts|Client Src Modules Offers Lib Api Offer Api Ts]]
- [[_COMMUNITY_Server Src Legacy Routes Lookuproutes Js|Server Src Legacy Routes Lookuproutes Js]]
- [[_COMMUNITY_Client Src Modules Auth Page Tsx|Client Src Modules Auth Page Tsx]]
- [[_COMMUNITY_Server Src Legacy Routes Emailroutes Js|Server Src Legacy Routes Emailroutes Js]]
- [[_COMMUNITY_Client Src Modules Emails Lib Api Email Api Ts|Client Src Modules Emails Lib Api Email Api Ts]]
- [[_COMMUNITY_Client Src Modules Interviewers Lib Api Interviewer Api Ts|Client Src Modules Interviewers Lib Api Interviewer Api Ts]]
- [[_COMMUNITY_App App|App App]]
- [[_COMMUNITY_Root Constant|Root Constant]]
- [[_COMMUNITY_Lookup Module|Lookup Module]]
- [[_COMMUNITY_Authlayout Component|Authlayout Component]]
- [[_COMMUNITY_Upload Middleware|Upload Middleware]]
- [[_COMMUNITY_Dashboard Utils|Dashboard Utils]]
- [[_COMMUNITY_Emailtemplateformdata Type|Emailtemplateformdata Type]]
- [[_COMMUNITY_Candidate Formpage|Candidate Formpage]]
- [[_COMMUNITY_Shared Query Client|Shared Query Client]]
- [[_COMMUNITY_Pageheader Component|Pageheader Component]]
- [[_COMMUNITY_String Util|String Util]]
- [[_COMMUNITY_Interviewdata Data|Interviewdata Data]]
- [[_COMMUNITY_Tokenutils Util|Tokenutils Util]]
- [[_COMMUNITY_Generaterefreshtoken Fn|Generaterefreshtoken Fn]]
- [[_COMMUNITY_Hashtoken Fn|Hashtoken Fn]]
- [[_COMMUNITY_React Svg Asset|React Svg Asset]]
- [[_COMMUNITY_Hrfolio Client Assets|Hrfolio Client Assets]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 41 edges
2. `Candidate (Mongoose Model)` - 22 edges
3. `POST()` - 17 edges
4. `User (Mongoose Model)` - 15 edges
5. `authenticate()` - 14 edges
6. `DashboardPage component` - 13 edges
7. `assessmentController (Assessment CRUD + Assignment + Score)` - 13 edges
8. `updateCandidateCurrentStage()` - 12 edges
9. `candidateController (Candidate CRUD + Stage Management)` - 12 edges
10. `InterviewController (Interview CRUD + Rounds + Notifications)` - 12 edges
11. `checkUserExist()` - 11 edges
12. `ActivityLog (Mongoose Model)` - 11 edges
13. `authenticate (middleware)` - 11 edges
14. `DELETE()` - 10 edges
15. `Assessment / Assignment / AssessmentFormData / CandidateBasic / EmailTemplate types` - 10 edges

## Surprising Connections (you probably didn't know these)
- `handleSubmit()` --calls--> `sendEmail()`  [INFERRED]
  client/src/modules/candidates/components/CandidateSendEmail.tsx → server/src/legacy/utils/sendEmail.js
- `handleMenuClick()` --calls--> `logout()`  [INFERRED]
  client/src/shared/components/DashboardHeader.tsx → server/src/legacy/controllers/userController.js
- `fetchOffers()` --calls--> `GET()`  [INFERRED]
  client/src/modules/offers/lib/api/offer.api.ts → client/src/shared/lib/axios.ts
- `fetchOfferById()` --calls--> `GET()`  [INFERRED]
  client/src/modules/offers/lib/api/offer.api.ts → client/src/shared/lib/axios.ts
- `createOffer()` --calls--> `POST()`  [INFERRED]
  client/src/modules/offers/lib/api/offer.api.ts → client/src/shared/lib/axios.ts

## Communities (108 total, 13 thin omitted)

### Community 0 - "Dashboard Page"
Cohesion: 0.06
Nodes (59): assessment API (fetchAssessments, createAssignment, submitScore, fetchEmailTemplates, etc.), assessment.api (assessmentApi functions), AssessmentForm component (create/edit), assessments module index, AssessmentListPage / AssessmentFormPage / AssignmentListPage / AssignAssessmentPage, assessment.queries (React Query hooks), assessmentRoutes (route config), assessmentSchema (zod) (+51 more)

### Community 1 - "Candidate Model"
Cohesion: 0.07
Nodes (60): ActivityLog (Mongoose Model), Assessment (Mongoose Model), AssessmentAssignment (Mongoose Model), assessmentController (Assessment CRUD + Assignment + Score), AssessmentLog (Mongoose Model), auditLogService (Centralized Audit Log Service), authenticate / checkUserExist Middleware (JWT Auth), Candidate (Mongoose Model) (+52 more)

### Community 2 - "Server Src Legacy Routes Authroutes Js"
Cohesion: 0.06
Nodes (20): AuditLogController, EscalationController, getAllRolePermissions(), getMyPermissions(), updateRolePermission(), bannedUser(), createUser(), getAllUsers() (+12 more)

### Community 3 - "Theme Store"
Cohesion: 0.07
Nodes (33): auth.api (googleLogin, deleteUser, getCurrentUser), auth.queries (useGoogleLogin, useDeleteUser), authRoutes, authSchema, AuthContext, AuthProvider, AuthResponse, AuthState (+25 more)

### Community 4 - "Client Src Modules Escalations Components Escalationstable Tsx"
Cohesion: 0.07
Nodes (19): fetchAuditLogs(), fetchScopedAuditLogs(), AuditLogListPage(), handleSubmit(), handleSubmit(), submitWithStatus(), ProtectedRoute(), RaiseEscalationModal() (+11 more)

### Community 5 - "Client Src Modules Candidates Lib Queries Candidate Queries Ts"
Cohesion: 0.09
Nodes (16): sendGeneralEmail(), useButtonStore (Zustand), CandidateInfo(), canMoveToStatus(), updateStatusHandler(), handleSubmit(), useCandidateActivityLogs(), useCandidateById() (+8 more)

### Community 6 - "Client Src Modules Interviews Components Interviewlist Tsx"
Cohesion: 0.08
Nodes (8): getLookupColor(), useCreateInterview(), useDeleteInterview(), useEligibleCandidates(), useInterviewerList(), useInterviewList(), useUpdateInterview(), getLookupLabel()

### Community 7 - "Auditlog Service"
Cohesion: 0.1
Nodes (34): AuditLogController, AuditLog Module Index, AuditLog Mongoose Model, AuditLog Routes, AuditLogService, AuditLog Types (AuditActionType, IAuditLogDTO, IAuditLogQuery), AuditLog Immutability Invariant, Candidate Ownership (createdBy field for HR-scoped access) (+26 more)

### Community 8 - "Client Src Modules Assessments Lib Queries Assessment Queries Ts"
Cohesion: 0.11
Nodes (11): useAssessmentById(), useAssessmentList(), useAssignmentList(), useCandidateBasicList(), useCreateAssessment(), useCreateAssignment(), useDeleteAssessment(), useDeleteAssignment() (+3 more)

### Community 9 - "Emailtemplate Type"
Cohesion: 0.1
Nodes (31): ActivityLog (type), candidate.api (fetchCandidates, createCandidate, updateCandidate, updateCandidateStatus, fetchCandidateActivityLogs, uploadResume), CandidateDetailPage, sendGeneralEmail (candidate email dispatch), CandidateListPage, candidate.queries (useCandidateList, useCandidateById, useUpdateCandidateStatus, useCandidateActivityLogs, useUploadResume), candidateSchema (zod), CandidateSendEmailPage (+23 more)

### Community 10 - "Authenticate Middleware"
Cohesion: 0.09
Nodes (30): activityLogRouter (activity logs), assessmentController (createAssessment, assignAssessment, createScore, getAssessmentLogByCandidateId, etc.), assessmentRouter (assessment + assignment + score CRUD), authenticate (middleware), authorize (shared role middleware), authRouter (auth + user mgmt + permissions), canCandidateProgress (middleware), candidateController (createCandidate, getAllCandidates, changeCandidateStage, rejectCandidate, etc.) (+22 more)

### Community 11 - "Client Src Modules Dashboard Page Tsx"
Cohesion: 0.13
Nodes (9): HiredandRejectedCorelation(), LineChart(), MetricsCard(), PieChart(), useDashboardActivityLogs(), useDashboardAssignments(), useDashboardCandidates(), useDashboardInterviews() (+1 more)

### Community 12 - "Lookup Queries"
Cohesion: 0.17
Nodes (20): interview.api (fetchInterviews | createInterview | updateInterview | deleteInterview | fetchInterviewers | fetchEligibleCandidates | fetchInterviewLogsByCandidate), interview.queries (useInterviewList | useCreateInterview | useUpdateInterview | useDeleteInterview | useInterviewerList | useEligibleCandidates | useInterviewLogsByCandidate), interview.routes (interviews | interviews/schedule), interview.schema (interviewSchema / InterviewFormValues), interview.types (InterviewStatus | InterviewRound | InterviewType | Interview | Interviewer | InterviewLog | CandidateBasic), InterviewCalendar, InterviewDetailsModal component (status update | feedback | reschedule modal), InterviewList (+12 more)

### Community 13 - "Server Src Legacy Controllers Interviewcontroller Js"
Cohesion: 0.17
Nodes (15): createInterview(), deleteInterview(), getAllInterviews(), getAllInterviewsByCandidate(), getInterviewById(), getInterviewLog(), getInterviewLogByCandidate(), updateInterview() (+7 more)

### Community 14 - "Client Src Modules Offers Lib Queries Offer Queries Ts"
Cohesion: 0.15
Nodes (9): OfferDetailModal(), useCreateOffer(), useDeleteOffer(), useOfferById(), useOfferCandidates(), useOfferEmailTemplates(), useOfferList(), useSendOffer() (+1 more)

### Community 15 - "Client Src Modules Emails Components Emailtemplateform Tsx"
Cohesion: 0.14
Nodes (6): EmailTemplateTable(), useCreateEmailTemplate(), useDeleteEmailTemplate(), useEmailTemplateById(), useEmailTemplateList(), useUpdateEmailTemplate()

### Community 16 - "Lib Axios Get"
Cohesion: 0.16
Nodes (18): fetchAssessmentById(), fetchAssessmentLogsByCandidate(), fetchAssessments(), fetchAssignCandidates(), fetchAssignments(), fetchEmailTemplates(), fetchActivityLogs(), fetchAssignments() (+10 more)

### Community 17 - "Server Src Legacy Utils Deleteallrelateddocs Js"
Cohesion: 0.14
Nodes (4): createGeneralEmail(), canCandidateProgress(), canInterviewProgress(), deleteAllRelatedDocs()

### Community 18 - "Server Src Legacy Middleware Auhtmiddleware Js"
Cohesion: 0.18
Nodes (8): SearchCandidates(), createInterviewer(), deleteInterviewer(), getInterviewer(), getInterviewerById(), updateInterviewer(), authenticate(), checkUserExist()

### Community 19 - "Offer Types"
Cohesion: 0.21
Nodes (20): constant.ts (API URL constants), interviewer.api (fetchInterviewers, createInterviewer, etc.), InterviewerForm component, interviewers module index, InterviewerListPage / InterviewerFormPage, interviewer.queries (useInterviewerList, useCreateInterviewer, etc.), interviewerRoutes (lazy route config), interviewerSchema (zod) (+12 more)

### Community 20 - "Server Src Legacy Controllers Candidatecontroller Js"
Cohesion: 0.2
Nodes (13): changeCandidateStage(), createCandidate(), deleteCandidates(), getAllCandidates(), getCandidateById(), getCandidateLogsByCandidateId(), rejectCandidate(), updateCandidate() (+5 more)

### Community 21 - "Server Src Legacy Controllers Assessmentcontroller Js"
Cohesion: 0.23
Nodes (15): assignAssessment(), createAssessment(), createScore(), deleteAssessment(), deleteAssignment(), getAssessment(), getAssessmentById(), getAssessmentLogByCandidateId() (+7 more)

### Community 22 - "Client Src Modules User Management Components Usertable Tsx"
Cohesion: 0.18
Nodes (5): RoleChangeModal(), useCreateUser(), useToggleUserStatus(), useUpdateUserRole(), useUserList()

### Community 23 - "Candidatequickaction Component"
Cohesion: 0.16
Nodes (15): candidateRoutes, CandidateForm, CandidateHistory, CandidateInfo, CandidateProgress, CandidateQuickAction, CandidateSendEmail, CandidateTable (+7 more)

### Community 24 - "Client Src Modules Interviewers Lib Queries Interviewer Queries Ts"
Cohesion: 0.27
Nodes (7): InterviewerForm(), InterviewerTable(), useCreateInterviewer(), useDeleteInterviewer(), useInterviewerById(), useInterviewerList(), useUpdateInterviewer()

### Community 25 - "Client Src Modules Candidates Lib Api Candidate Api Ts"
Cohesion: 0.15
Nodes (13): updateAssessment(), createCandidate(), fetchCandidateActivityLogs(), fetchCandidateById(), fetchCandidates(), updateCandidate(), updateCandidateStatus(), uploadResume() (+5 more)

### Community 26 - "Lib Axios Post"
Cohesion: 0.15
Nodes (13): createAssessment(), createAssignment(), submitScore(), createInterview(), createInterviewer(), fetchEligibleCandidates(), fetchInterviewById(), fetchInterviewers() (+5 more)

### Community 27 - "Server Src Index Ts"
Cohesion: 0.22
Nodes (8): connectDB(), destroyData(), insertData(), run(), seed(), seedLookupValues(), seedPermissions(), start()

### Community 28 - "Client Src Modules Auth Context Authcontext Tsx"
Cohesion: 0.17
Nodes (3): deleteUser(), getCurrentUser(), googleLogin()

### Community 29 - "Lib Axios Delete"
Cohesion: 0.17
Nodes (9): deleteAssessment(), deleteAssignment(), deleteCandidate(), deleteInterview(), deactivateLookupValue(), deleteOffer(), handleBulkDelete(), ApiError (+1 more)

### Community 30 - "Client Src Modules User Management Lib Api User Api Ts"
Cohesion: 0.18
Nodes (9): fetchAllRolePermissions(), fetchMyPermissions(), updateRolePermission(), createUser(), fetchTeamByRole(), fetchUsers(), toggleUserStatus(), updateUserRole() (+1 more)

### Community 31 - "Client Src Modules Landing Page Tsx"
Cohesion: 0.22
Nodes (2): HeroSection(), NavHeader()

### Community 32 - "Server Src Legacy Controllers Offercontroller Js"
Cohesion: 0.36
Nodes (9): createOffer(), delteOffer(), getOffer(), getOfferByCandidates(), getOfferById(), getOfferLogsByCandidate(), sendOfferById(), updateOffer() (+1 more)

### Community 34 - "Landing Page"
Cohesion: 0.27
Nodes (10): BenefitsSection component (4 benefit cards: Save Time | Improve Quality | Increase Efficiency | Enhance Collaboration), FeaturesSection component (6-card feature grid with framer-motion stagger), HeroSection component (hero copy, feature list with motion, CTA to /login), landing/index.ts (public surface: LandingPage | landingRoutes), LandingPage (assembles NavHeader + HeroSection + FeaturesSection + ScreenshotsSection + BenefitsSection + TestimonialsSection + PageFooter), landing.routes (index route -> LandingPage), NavHeader component (sticky header with logo, anchors, responsive Drawer, dashboard CTA), PageFooter component (4-column footer: brand | Product | Resources | Company) (+2 more)

### Community 35 - "Client Src Modules Offers Lib Api Offer Api Ts"
Cohesion: 0.22
Nodes (8): createOffer(), fetchOfferById(), fetchOfferCandidates(), fetchOfferEmailTemplates(), fetchOfferLogsByCandidate(), fetchOffers(), sendOffer(), handleSend()

### Community 37 - "Client Src Modules Auth Page Tsx"
Cohesion: 0.32
Nodes (2): GoogleLoginButton(), WelcomeBackCard()

### Community 38 - "Server Src Legacy Routes Emailroutes Js"
Cohesion: 0.52
Nodes (5): createEmailTemplate(), deleteEmailTemplate(), getAllEmailTemplates(), getSingleEmailTemplate(), updateEmailTemplate()

### Community 39 - "Client Src Modules Emails Lib Api Email Api Ts"
Cohesion: 0.33
Nodes (5): createEmailTemplate(), deleteEmailTemplate(), fetchEmailTemplateById(), fetchEmailTemplates(), updateEmailTemplate()

### Community 40 - "Client Src Modules Interviewers Lib Api Interviewer Api Ts"
Cohesion: 0.33
Nodes (5): createInterviewer(), deleteInterviewer(), fetchInterviewerById(), fetchInterviewers(), updateInterviewer()

### Community 42 - "App App"
Cohesion: 0.67
Nodes (3): App (root component), AppContent (theme/router shell), main.tsx (React entry point)

### Community 51 - "Root Constant"
Cohesion: 1.0
Nodes (2): URL constants (src/constant), shared/constants/api.ts (URL re-exports)

### Community 52 - "Lookup Module"
Cohesion: 1.0
Nodes (2): LookupValue type (modules/lookup), getLookupLabel / getLookupColor (lookup util)

### Community 53 - "Authlayout Component"
Cohesion: 1.0
Nodes (2): AuthLayout, NotFound

### Community 54 - "Upload Middleware"
Cohesion: 1.0
Nodes (2): upload (multer middleware), uploadRouter (resume upload/download)

## Knowledge Gaps
- **80 isolated node(s):** `AppContent (theme/router shell)`, `main.tsx (React entry point)`, `interviewerSchema (zod)`, `audit-logs module index`, `AssessmentListPage / AssessmentFormPage / AssignmentListPage / AssignAssessmentPage` (+75 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<2 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `handleSubmit()` connect `Client Src Modules Candidates Lib Queries Candidate Queries Ts` to `Server Src Legacy Controllers Interviewcontroller Js`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **Why does `sendEmail()` connect `Server Src Legacy Controllers Interviewcontroller Js` to `Server Src Legacy Controllers Offercontroller Js`, `Server Src Legacy Utils Deleteallrelateddocs Js`, `Server Src Legacy Controllers Candidatecontroller Js`, `Client Src Modules Candidates Lib Queries Candidate Queries Ts`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **Why does `GET()` connect `Lib Axios Get` to `Client Src Modules Offers Lib Api Offer Api Ts`, `Client Src Modules Escalations Components Escalationstable Tsx`, `Client Src Modules Emails Lib Api Email Api Ts`, `Client Src Modules Interviewers Lib Api Interviewer Api Ts`, `Client Src Modules Candidates Lib Api Candidate Api Ts`, `Lib Axios Post`, `Client Src Modules Auth Context Authcontext Tsx`, `Lib Axios Delete`, `Client Src Modules User Management Lib Api User Api Ts`?**
  _High betweenness centrality (0.208) - this node is a cross-community bridge._
- **Are the 40 inferred relationships involving `GET()` (e.g. with `fetchOffers()` and `fetchOfferById()`) actually correct?**
  _`GET()` has 40 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `Candidate (Mongoose Model)` (e.g. with `ActivityLog (Mongoose Model)` and `Reference (Mongoose Model)`) actually correct?**
  _`Candidate (Mongoose Model)` has 3 INFERRED edges - model-reasoned connections that need verification._
- **Are the 16 inferred relationships involving `POST()` (e.g. with `createOffer()` and `sendOffer()`) actually correct?**
  _`POST()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AppContent (theme/router shell)`, `main.tsx (React entry point)`, `interviewerSchema (zod)` to the rest of the system?**
  _80 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Dashboard Page` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Candidate Model` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Server Src Legacy Routes Authroutes Js` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._