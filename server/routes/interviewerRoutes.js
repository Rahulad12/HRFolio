import express from "express";
import { getInterviewer, getInterviewerById, createInterviewer, updateInterviewer, deleteInterviewer } from "../controllers/interviewerController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const interviewerRouter = express.Router();


interviewerRouter.get("/", authenticate, checkUserExist, getInterviewer);
interviewerRouter.get("/:id", authenticate, checkUserExist, getInterviewerById)
interviewerRouter.post("/", authenticate, checkUserExist, createInterviewer)
interviewerRouter.put("/:id", authenticate, checkUserExist, updateInterviewer)
interviewerRouter.delete("/:id", authenticate, checkUserExist, deleteInterviewer)

export default interviewerRouter;