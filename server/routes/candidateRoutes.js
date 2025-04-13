import express from "express";
import { createCandidate, getCandidateById, getAllCandidates, filterCandidate, deleteCandidate, updateCandidate } from "../controllers/candidateController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const candidateRouter = express.Router();

candidateRouter.post("/", authenticate, checkUserExist, createCandidate);
candidateRouter.get("/", authenticate, checkUserExist, getAllCandidates);
candidateRouter.get("/filter", authenticate, checkUserExist, filterCandidate);
candidateRouter.get("/:id", authenticate, checkUserExist, getCandidateById);
candidateRouter.put("/:id", authenticate, checkUserExist, updateCandidate);
candidateRouter.delete("/:id", authenticate, checkUserExist, deleteCandidate);

export default candidateRouter;

