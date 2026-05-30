import express from "express";
import {
  createCandidate,
  getCandidateById,
  getAllCandidates,
  deleteCandidates,
  updateCandidate,
  getCandidateLogsByCandidateId,
  changeCandidateStage,
  rejectCandidate,
} from "../controllers/candidateController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";
import { authorize } from "../../shared/middleware/authorize.ts";

const candidateRouter = express.Router();

// Read — all authenticated users can read (HR sees own via controller-level filter)
candidateRouter.get("/", authenticate, checkUserExist, getAllCandidates);
candidateRouter.get("/log/:id", authenticate, checkUserExist, getCandidateLogsByCandidateId);
candidateRouter.get("/:id", authenticate, checkUserExist, getCandidateById);

// Write — Admin is explicitly forbidden by FRS (§4.1–4.4)
candidateRouter.post("/", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), createCandidate);
candidateRouter.put("/reject/:id", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), rejectCandidate);
candidateRouter.put("/stage/:id", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), changeCandidateStage);
candidateRouter.put("/:id", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), updateCandidate);
candidateRouter.delete("/", authenticate, checkUserExist, authorize(["HR", "HR Admin"]), deleteCandidates);

export default candidateRouter;
