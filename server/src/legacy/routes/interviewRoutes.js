import express from "express";
import {
    createInterview,
    getAllInterviews,
    updateInterview,
    getInterviewById,
    getAllInterviewsByCandidate,
    deleteInterview,
    getInterviewLog,
    getInterviewLogByCandidate,
} from "../controllers/InterviewController.js";

import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";
import { canCandidateProgress, canInterviewProgress } from "../middleware/CandidateProgress.js";

const interviewRouter = express.Router();

// Static routes 
interviewRouter.get("/log", authenticate, checkUserExist, getInterviewLog);
interviewRouter.get("/log/candidate/:id", authenticate, checkUserExist, getInterviewLogByCandidate);

//Create and list routes
interviewRouter.post("/", authenticate, checkUserExist, canInterviewProgress(), createInterview);
interviewRouter.get("/", authenticate, checkUserExist, getAllInterviews);

//  Candidate-specific route (static segment first)
interviewRouter.get("/candidate/:id", authenticate, checkUserExist, getAllInterviewsByCandidate);

//  Dynamic routes 
interviewRouter.get("/:id", authenticate, checkUserExist, getInterviewById);
interviewRouter.put("/:id", authenticate, checkUserExist, updateInterview);
interviewRouter.delete("/:id", authenticate, checkUserExist, deleteInterview);

export default interviewRouter;
