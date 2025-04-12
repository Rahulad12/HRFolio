import express from "express";
import { createCandidate, getCandidateById, getAllCandidates, deleteCandidate } from "../controllers/candidateController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const candidateRouter = express.Router();

candidateRouter.post("/", authenticate, checkUserExist, createCandidate);
candidateRouter.get("/", authenticate, checkUserExist, getAllCandidates);
candidateRouter.get("/:id", authenticate, checkUserExist, getCandidateById);
candidateRouter.delete("/:id", authenticate, checkUserExist, deleteCandidate);

export default candidateRouter;

