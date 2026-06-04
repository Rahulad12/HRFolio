import express from "express";
import { createLookupController } from "../controllers/lookupController.js";
import InterviewRound from "../model/InterviewRound.js";
import CandidateStatus from "../model/CandidateStatus.js";
import InterviewType from "../model/InterviewType.js";
import InterviewStatus from "../model/InterviewStatus.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const lookupRouter = express.Router();
const auth = [authenticate, checkUserExist];

const requireAdmin = (req, res, next) => {
    if (!['Admin', 'HR Admin'].includes(req.user?.role)) {
        return res.status(403).json({ success: false, message: "Admin or HR Admin role required" });
    }
    next();
};

const roundH = createLookupController(InterviewRound);
const statusH = createLookupController(CandidateStatus);
const typeH = createLookupController(InterviewType);
const iStatusH = createLookupController(InterviewStatus);

lookupRouter.get("/interview-rounds",       ...auth, roundH.getAll);
lookupRouter.post("/interview-rounds",      ...auth, requireAdmin, roundH.create);
lookupRouter.put("/interview-rounds/:id",   ...auth, requireAdmin, roundH.update);
lookupRouter.delete("/interview-rounds/:id",...auth, requireAdmin, roundH.deactivate);

lookupRouter.get("/candidate-statuses",       ...auth, statusH.getAll);
lookupRouter.post("/candidate-statuses",      ...auth, requireAdmin, statusH.create);
lookupRouter.put("/candidate-statuses/:id",   ...auth, requireAdmin, statusH.update);
lookupRouter.delete("/candidate-statuses/:id",...auth, requireAdmin, statusH.deactivate);

lookupRouter.get("/interview-types",       ...auth, typeH.getAll);
lookupRouter.post("/interview-types",      ...auth, requireAdmin, typeH.create);
lookupRouter.put("/interview-types/:id",   ...auth, requireAdmin, typeH.update);
lookupRouter.delete("/interview-types/:id",...auth, requireAdmin, typeH.deactivate);

lookupRouter.get("/interview-statuses",       ...auth, iStatusH.getAll);
lookupRouter.post("/interview-statuses",      ...auth, requireAdmin, iStatusH.create);
lookupRouter.put("/interview-statuses/:id",   ...auth, requireAdmin, iStatusH.update);
lookupRouter.delete("/interview-statuses/:id",...auth, requireAdmin, iStatusH.deactivate);

export default lookupRouter;
