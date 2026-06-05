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
import { hasPermission } from "../../shared/middleware/hasPermission.ts";

const candidateRouter = express.Router();

candidateRouter.get("/", authenticate, checkUserExist, hasPermission("candidates:read"), getAllCandidates);
candidateRouter.get("/log/:id", authenticate, checkUserExist, hasPermission("candidates:read"), getCandidateLogsByCandidateId);
candidateRouter.get("/:id", authenticate, checkUserExist, hasPermission("candidates:read"), getCandidateById);

candidateRouter.post("/", authenticate, checkUserExist, hasPermission("candidates:create"), createCandidate);
candidateRouter.put("/reject/:id", authenticate, checkUserExist, hasPermission("candidates:update"), rejectCandidate);
candidateRouter.put("/stage/:id", authenticate, checkUserExist, hasPermission("candidates:update"), changeCandidateStage);
candidateRouter.put("/:id", authenticate, checkUserExist, hasPermission("candidates:update"), updateCandidate);
candidateRouter.delete("/", authenticate, checkUserExist, hasPermission("candidates:delete"), deleteCandidates);

export default candidateRouter;
