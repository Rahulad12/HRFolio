# Lookup Tables — Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create four Mongoose models, a generic CRUD controller, unified routes, seed data, and remove hardcoded enum constraints from Interview and Candidate schemas so enum values are managed via the database.

**Architecture:** Four identical-shape collections (`interview_rounds`, `candidate_statuses`, `interview_types`, `interview_statuses`). A factory function `createLookupController(Model)` generates CRUD handlers for each. Routes are registered under `/api/lookup`. Seed runs at server startup. Enum constraints are removed from `Interview.js` and `Candidate.js`; round-ordering logic in `InterviewController.js` and `CandidateProgress.js` is updated to read order from the lookup table dynamically.

**Tech Stack:** Node.js, Express, Mongoose, MongoDB

---

## File Map

| Action | File |
|--------|------|
| Create | `server/src/legacy/model/InterviewRound.js` |
| Create | `server/src/legacy/model/CandidateStatus.js` |
| Create | `server/src/legacy/model/InterviewType.js` |
| Create | `server/src/legacy/model/InterviewStatus.js` |
| Create | `server/src/legacy/controllers/lookupController.js` |
| Create | `server/src/legacy/routes/lookupRoutes.js` |
| Create | `server/src/legacy/Data/SeedLookupValues.js` |
| Modify | `server/src/legacy/index.js` |
| Modify | `server/src/index.ts` |
| Modify | `server/src/legacy/model/Interview.js` |
| Modify | `server/src/legacy/model/Candidate.js` |
| Modify | `server/src/legacy/controllers/InterviewController.js` |
| Modify | `server/src/legacy/middleware/CandidateProgress.js` |

---

## Task 1: Create the four lookup models

**Files:**
- Create: `server/src/legacy/model/InterviewRound.js`
- Create: `server/src/legacy/model/CandidateStatus.js`
- Create: `server/src/legacy/model/InterviewType.js`
- Create: `server/src/legacy/model/InterviewStatus.js`

- [ ] **Step 1: Create `InterviewRound.js`**

```js
import mongoose from "mongoose";

const interviewRoundSchema = new mongoose.Schema({
  systemName: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  order: { type: Number, required: true },
  color: { type: String, default: 'default' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const InterviewRound = mongoose.model("interview_rounds", interviewRoundSchema);
export default InterviewRound;
```

- [ ] **Step 2: Create `CandidateStatus.js`**

```js
import mongoose from "mongoose";

const candidateStatusSchema = new mongoose.Schema({
  systemName: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  order: { type: Number, required: true },
  color: { type: String, default: 'default' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const CandidateStatus = mongoose.model("candidate_statuses", candidateStatusSchema);
export default CandidateStatus;
```

- [ ] **Step 3: Create `InterviewType.js`**

```js
import mongoose from "mongoose";

const interviewTypeSchema = new mongoose.Schema({
  systemName: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  order: { type: Number, required: true },
  color: { type: String, default: 'default' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const InterviewType = mongoose.model("interview_types", interviewTypeSchema);
export default InterviewType;
```

- [ ] **Step 4: Create `InterviewStatus.js`**

```js
import mongoose from "mongoose";

const interviewStatusSchema = new mongoose.Schema({
  systemName: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  order: { type: Number, required: true },
  color: { type: String, default: 'default' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const InterviewStatus = mongoose.model("interview_statuses", interviewStatusSchema);
export default InterviewStatus;
```

- [ ] **Step 5: Commit**

```bash
git add server/src/legacy/model/InterviewRound.js \
        server/src/legacy/model/CandidateStatus.js \
        server/src/legacy/model/InterviewType.js \
        server/src/legacy/model/InterviewStatus.js
git commit -m "feat: add lookup table models for interview rounds, statuses, types, and candidate statuses"
```

---

## Task 2: Create the generic lookup controller

**Files:**
- Create: `server/src/legacy/controllers/lookupController.js`

- [ ] **Step 1: Create `lookupController.js`**

```js
export const createLookupController = (Model) => {
  const getAll = async (req, res) => {
    try {
      const values = await Model.find({ isActive: true }).sort({ order: 1 });
      res.json({ success: true, data: values });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const create = async (req, res) => {
    try {
      const { systemName, displayName, order, color } = req.body;
      if (!systemName || !displayName || order == null) {
        return res.status(400).json({ success: false, message: "systemName, displayName and order are required" });
      }
      const existing = await Model.findOne({ systemName });
      if (existing) {
        return res.status(400).json({ success: false, message: "systemName already exists" });
      }
      const value = await Model.create({ systemName, displayName, order, color, isActive: true });
      res.status(201).json({ success: true, data: value, message: "Created successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const update = async (req, res) => {
    try {
      const { id } = req.params;
      const { displayName, order, color } = req.body;
      const value = await Model.findByIdAndUpdate(
        id,
        { displayName, order, color },
        { new: true, runValidators: true }
      );
      if (!value) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: value, message: "Updated successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  const deactivate = async (req, res) => {
    try {
      const { id } = req.params;
      const value = await Model.findByIdAndUpdate(id, { isActive: false }, { new: true });
      if (!value) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, message: "Deactivated successfully" });
    } catch {
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  return { getAll, create, update, deactivate };
};
```

- [ ] **Step 2: Commit**

```bash
git add server/src/legacy/controllers/lookupController.js
git commit -m "feat: add generic lookup CRUD controller factory"
```

---

## Task 3: Create routes + seed data + register in server

**Files:**
- Create: `server/src/legacy/routes/lookupRoutes.js`
- Create: `server/src/legacy/Data/SeedLookupValues.js`
- Modify: `server/src/legacy/index.js`
- Modify: `server/src/index.ts`

- [ ] **Step 1: Create `lookupRoutes.js`**

```js
import express from "express";
import { createLookupController } from "../controllers/lookupController.js";
import InterviewRound from "../model/InterviewRound.js";
import CandidateStatus from "../model/CandidateStatus.js";
import InterviewType from "../model/InterviewType.js";
import InterviewStatus from "../model/InterviewStatus.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const lookupRouter = express.Router();
const auth = [authenticate, checkUserExist];

const roundH = createLookupController(InterviewRound);
const statusH = createLookupController(CandidateStatus);
const typeH = createLookupController(InterviewType);
const iStatusH = createLookupController(InterviewStatus);

lookupRouter.get("/interview-rounds",    ...auth, roundH.getAll);
lookupRouter.post("/interview-rounds",   ...auth, roundH.create);
lookupRouter.put("/interview-rounds/:id",...auth, roundH.update);
lookupRouter.delete("/interview-rounds/:id",...auth, roundH.deactivate);

lookupRouter.get("/candidate-statuses",    ...auth, statusH.getAll);
lookupRouter.post("/candidate-statuses",   ...auth, statusH.create);
lookupRouter.put("/candidate-statuses/:id",...auth, statusH.update);
lookupRouter.delete("/candidate-statuses/:id",...auth, statusH.deactivate);

lookupRouter.get("/interview-types",    ...auth, typeH.getAll);
lookupRouter.post("/interview-types",   ...auth, typeH.create);
lookupRouter.put("/interview-types/:id",...auth, typeH.update);
lookupRouter.delete("/interview-types/:id",...auth, typeH.deactivate);

lookupRouter.get("/interview-statuses",    ...auth, iStatusH.getAll);
lookupRouter.post("/interview-statuses",   ...auth, iStatusH.create);
lookupRouter.put("/interview-statuses/:id",...auth, iStatusH.update);
lookupRouter.delete("/interview-statuses/:id",...auth, iStatusH.deactivate);

export default lookupRouter;
```

- [ ] **Step 2: Create `SeedLookupValues.js`**

```js
import InterviewRound from "../model/InterviewRound.js";
import CandidateStatus from "../model/CandidateStatus.js";
import InterviewType from "../model/InterviewType.js";
import InterviewStatus from "../model/InterviewStatus.js";

const seed = async (Model, items) => {
  for (const item of items) {
    const exists = await Model.findOne({ systemName: item.systemName });
    if (!exists) await Model.create(item);
  }
};

export const seedLookupValues = async () => {
  await seed(InterviewRound, [
    { systemName: 'first',  displayName: 'First Interview',  order: 1, color: 'blue',    isActive: true },
    { systemName: 'second', displayName: 'Second Interview', order: 2, color: 'purple',  isActive: true },
    { systemName: 'third',  displayName: 'Third Interview',  order: 3, color: 'volcano', isActive: true },
  ]);

  await seed(CandidateStatus, [
    { systemName: 'shortlisted', displayName: 'Shortlisted',       order: 1, color: 'default', isActive: true },
    { systemName: 'assessment',  displayName: 'Assessment',         order: 2, color: 'orange',  isActive: true },
    { systemName: 'first',       displayName: 'First Interview',   order: 3, color: 'blue',    isActive: true },
    { systemName: 'second',      displayName: 'Second Interview',  order: 4, color: 'purple',  isActive: true },
    { systemName: 'third',       displayName: 'Third Interview',   order: 5, color: 'volcano', isActive: true },
    { systemName: 'offered',     displayName: 'Offered',           order: 6, color: 'gold',    isActive: true },
    { systemName: 'hired',       displayName: 'Hired',             order: 7, color: 'green',   isActive: true },
    { systemName: 'rejected',    displayName: 'Rejected',          order: 8, color: 'red',     isActive: true },
  ]);

  await seed(InterviewType, [
    { systemName: 'video',      displayName: 'Video Call', order: 1, isActive: true },
    { systemName: 'in-person',  displayName: 'In Person',  order: 2, isActive: true },
  ]);

  await seed(InterviewStatus, [
    { systemName: 'draft',      displayName: 'Draft',      order: 1, color: 'default', isActive: true },
    { systemName: 'scheduled',  displayName: 'Scheduled',  order: 2, color: 'blue',    isActive: true },
    { systemName: 'completed',  displayName: 'Completed',  order: 3, color: 'green',   isActive: true },
    { systemName: 'cancelled',  displayName: 'Cancelled',  order: 4, color: 'orange',  isActive: true },
    { systemName: 'failed',     displayName: 'Failed',     order: 5, color: 'red',     isActive: true },
  ]);

  console.log('✓ Lookup values seeded');
};
```

- [ ] **Step 3: Register the router in `server/src/legacy/index.js`**

Add after the existing imports at the top:
```js
import lookupRouter from './routes/lookupRoutes.js';
```

Add after the last `app.use` route line (before the `app.get('/')` line):
```js
app.use('/api/lookup', lookupRouter);
```

- [ ] **Step 4: Call seed in `server/src/index.ts`**

Old:
```ts
connectDB();
```

New:
```ts
import { seedLookupValues } from './legacy/Data/SeedLookupValues.js';

connectDB().then(() => seedLookupValues());
```

Wait — `connectDB` returns `void`. Change to call seed after connect:

```ts
import app from './app.js';
import connectDB from './legacy/config/db.js';
import { seedLookupValues } from './legacy/Data/SeedLookupValues.js';

const start = async () => {
  await connectDB();
  await seedLookupValues();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
```

- [ ] **Step 5: Verify server starts and seeds**

Run: `cd server && node --loader ts-node/esm src/index.ts` (or however the project starts — check `package.json` scripts)

Expected in console:
```
MongoDB Connected: ...
✓ Lookup values seeded
Server running on port 5000
```

- [ ] **Step 6: Verify GET endpoint returns seeded data**

```bash
# First get a token by logging in, then:
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/lookup/interview-rounds
```

Expected:
```json
{ "success": true, "data": [
  { "systemName": "first", "displayName": "First Interview", "order": 1, "color": "blue", "isActive": true },
  { "systemName": "second", "displayName": "Second Interview", "order": 2, "color": "purple", "isActive": true },
  { "systemName": "third", "displayName": "Third Interview", "order": 3, "color": "volcano", "isActive": true }
]}
```

- [ ] **Step 7: Commit**

```bash
git add server/src/legacy/routes/lookupRoutes.js \
        server/src/legacy/Data/SeedLookupValues.js \
        server/src/legacy/index.js \
        server/src/index.ts
git commit -m "feat: add lookup routes, seed data, and register in server"
```

---

## Task 4: Remove enum constraints from Interview and Candidate models

**Files:**
- Modify: `server/src/legacy/model/Interview.js`
- Modify: `server/src/legacy/model/Candidate.js`

- [ ] **Step 1: Update `Interview.js` — remove three enum constraints**

Old:
```js
status: {
    type: String,
    enum: ["draft", "scheduled", "cancelled", "completed", "failed"],
    required: true
},
type: {
    type: String,
    enum: ["in-person", "video"],
    default: "in-person",
    required: true
},
InterviewRound: {
    type: String,
    enum: ["first", "second", "third"],
    default: "first",
    required: true
},
```

New:
```js
status: {
    type: String,
    required: true
},
type: {
    type: String,
    default: "in-person",
    required: true
},
InterviewRound: {
    type: String,
    default: "first",
    required: true
},
```

- [ ] **Step 2: Update `Candidate.js` — remove enum from `status` field**

Old (around line 71):
```js
status: {
    type: String,
    enum: [...STAGES, "rejected"],
    default: "shortlisted"
},
```

New:
```js
status: {
    type: String,
    default: "shortlisted"
},
```

- [ ] **Step 3: Commit**

```bash
git add server/src/legacy/model/Interview.js server/src/legacy/model/Candidate.js
git commit -m "refactor: remove hardcoded enum constraints from Interview and Candidate models"
```

---

## Task 5: Update InterviewController — dynamic round ordering

**Files:**
- Modify: `server/src/legacy/controllers/InterviewController.js`

The `createInterview` function currently uses a hardcoded `roundDependencies` object to enforce that `second` requires `first` to be completed, etc. Replace it with a dynamic lookup using the `InterviewRound` collection's `order` field.

- [ ] **Step 1: Add `InterviewRound` model import at top of file**

Add after the existing imports:
```js
import InterviewRoundModel from "../model/InterviewRound.js";
```

- [ ] **Step 2: Replace the hardcoded `roundDependencies` block in `createInterview`**

Old (around lines 30–45):
```js
const hasCompleted = (round) =>
    interviews.some(int => int.InterviewRound === round && int.status === "completed");

const roundDependencies = {
    second: "first",
    third: "second"
};

const requiredPrevRound = roundDependencies[InterviewRound];
if (requiredPrevRound && !hasCompleted(requiredPrevRound)) {
    return res.status(400).json({
        success: false,
        message: `${requiredPrevRound} round must be completed before scheduling ${InterviewRound} round.`
    });
}
```

New:
```js
const hasCompleted = (round) =>
    interviews.some(int => int.InterviewRound === round && int.status === "completed");

const rounds = await InterviewRoundModel.find({ isActive: true }).sort({ order: 1 });
const roundOrder = rounds.map(r => r.systemName);
const roundIndex = roundOrder.indexOf(InterviewRound);
if (roundIndex > 0) {
    const prevRound = roundOrder[roundIndex - 1];
    if (!hasCompleted(prevRound)) {
        return res.status(400).json({
            success: false,
            message: `"${prevRound}" round must be completed before scheduling "${InterviewRound}" round.`
        });
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add server/src/legacy/controllers/InterviewController.js
git commit -m "refactor: replace hardcoded roundDependencies with dynamic lookup table order"
```

---

## Task 6: Update CandidateProgress middleware — dynamic pipeline stages

**Files:**
- Modify: `server/src/legacy/middleware/CandidateProgress.js`

The `canCandidateProgress` middleware uses a hardcoded `pipelineStages` array. Replace with a dynamic fetch from `CandidateStatus` collection.

- [ ] **Step 1: Add `CandidateStatus` model import**

Add at top of `CandidateProgress.js`:
```js
import CandidateStatusModel from "../model/CandidateStatus.js";
```

- [ ] **Step 2: Replace the hardcoded `pipelineStages` array**

Old (inside `canCandidateProgress`):
```js
const pipelineStages = ["shortlisted", "assessment", "first", "second", "third", "offered", "hired"];
const currentIndex = pipelineStages.indexOf(currentStage);
```

New:
```js
const statuses = await CandidateStatusModel
    .find({ isActive: true, systemName: { $ne: 'rejected' } })
    .sort({ order: 1 });
const pipelineStages = statuses.map(s => s.systemName);
const currentIndex = pipelineStages.indexOf(currentStage);
```

- [ ] **Step 3: Commit**

```bash
git add server/src/legacy/middleware/CandidateProgress.js
git commit -m "refactor: replace hardcoded pipeline stages with dynamic lookup table in CandidateProgress middleware"
```

---

## Final Verification

- [ ] Restart the server — confirm no startup errors and `✓ Lookup values seeded` appears
- [ ] `GET /api/lookup/interview-rounds` — returns 3 active rounds sorted by order
- [ ] `GET /api/lookup/candidate-statuses` — returns 8 active statuses sorted by order
- [ ] `POST /api/lookup/interview-rounds` with `{ systemName: "fourth", displayName: "Final Round", order: 4, color: "gold" }` — returns 201, new round appears in GET
- [ ] `DELETE /api/lookup/interview-rounds/:id` on the fourth round — GET no longer returns it
- [ ] Schedule a second interview without completing the first — confirm 400 error with dynamic message
- [ ] Existing interview and candidate records still load correctly (no enum rejection)
