import express from "express";
import { getInterviewer, getInterviewerById, createInterviewer } from "../controllers/interviewerController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const interviewerRouter = express.Router();


interviewerRouter.get("/", authenticate, checkUserExist, getInterviewer);
interviewerRouter.get("/:id", authenticate, checkUserExist, getInterviewerById)
interviewerRouter.post("/", authenticate, checkUserExist, createInterviewer)

export default interviewerRouter;