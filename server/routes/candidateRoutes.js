import express from "express";
import { createCandidate, getCandidateById, getAllCandidates, deleteCandidates, updateCandidate, getCandidateLogsByCandidateId, changeCandidateStage, rejectCandidate } from "../controllers/candidateController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const candidateRouter = express.Router();

candidateRouter.post("/", authenticate, checkUserExist, createCandidate);

candidateRouter.get("/", authenticate, checkUserExist, getAllCandidates);

candidateRouter.get("/log/:id", authenticate, checkUserExist, getCandidateLogsByCandidateId);
candidateRouter.put("/reject/:id", authenticate, checkUserExist, rejectCandidate);

candidateRouter.get("/:id", authenticate, checkUserExist, getCandidateById);
candidateRouter.put("/:id", authenticate, checkUserExist, updateCandidate);
candidateRouter.put("/stage/:id", authenticate, checkUserExist, changeCandidateStage);
candidateRouter.delete("/", authenticate, checkUserExist, deleteCandidates);


export default candidateRouter;

