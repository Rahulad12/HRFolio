import express from "express";
import { createCandidate, getCandidateById, getAllCandidates, deleteCandidate, updateCandidate, getCandidateLogsByCandidateId, changeCandidateStage } from "../controllers/candidateController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const candidateRouter = express.Router();

candidateRouter.post("/", authenticate, checkUserExist, createCandidate);

candidateRouter.get("/", authenticate, checkUserExist, getAllCandidates);

candidateRouter.get("/log/:id", authenticate, checkUserExist, getCandidateLogsByCandidateId);

candidateRouter.get("/:id", authenticate, checkUserExist, getCandidateById);
candidateRouter.put("/:id", authenticate, checkUserExist, updateCandidate);
candidateRouter.put("/stage/:id", authenticate, checkUserExist, changeCandidateStage);
candidateRouter.delete("/:id", authenticate, checkUserExist, deleteCandidate);


export default candidateRouter;

