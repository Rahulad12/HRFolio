import express from 'express';
import { assignAssessment, createAssessment, getAssessment, getAssignment } from "../controllers/assessmentController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js"
const assessmentRouter = express.Router();

assessmentRouter.post("/", authenticate, checkUserExist, createAssessment);
assessmentRouter.post("/assign", authenticate, checkUserExist, assignAssessment);
assessmentRouter.get("/", authenticate, checkUserExist, getAssessment);
assessmentRouter.get("/assignment", authenticate, checkUserExist, getAssignment);

export default assessmentRouter;