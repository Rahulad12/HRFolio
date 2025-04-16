import express from "express";
import { getInterviewer } from "../controllers/interviewerController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const interviewerRouter = express.Router();


interviewerRouter.get("/", authenticate, checkUserExist, getInterviewer);

export default interviewerRouter;