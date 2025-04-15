import express from "express";
import { createInterview, getAllInterviews, updateInterview, getInterviewById, getAllInterviewsByCandidate } from "../controllers/InterviewController.js"
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const interviewRouter = express.Router();
//routes
interviewRouter.post("/", authenticate, checkUserExist, createInterview);
interviewRouter.get("/", authenticate, checkUserExist, getAllInterviews);
interviewRouter.get("/:id", authenticate, checkUserExist, getInterviewById);
interviewRouter.put("/:id", authenticate, checkUserExist, updateInterview);
interviewRouter.get("/candidate/:id", authenticate, checkUserExist, getAllInterviewsByCandidate);

export default interviewRouter;