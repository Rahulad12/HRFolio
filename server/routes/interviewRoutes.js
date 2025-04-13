import express from "express";
import { createInterview, getAllInterviews, filterInterviews } from "../controllers/InterviewController.js"
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";
const interviewRouter = express.Router();


//routes
interviewRouter.post("/", authenticate, checkUserExist, createInterview);
interviewRouter.get("/", authenticate, checkUserExist, getAllInterviews);
interviewRouter.get("/filter", authenticate, checkUserExist, filterInterviews);

export default interviewRouter;