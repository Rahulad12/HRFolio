import express from 'express';
import { assignAssessment, createAssessment, getAssessment, getAssignment, deleteAssessment, deleteAssignment } from "../controllers/assessmentController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js"
const assessmentRouter = express.Router();

assessmentRouter.post("/", authenticate, checkUserExist, createAssessment);
assessmentRouter.post("/assign", authenticate, checkUserExist, assignAssessment);
assessmentRouter.get("/", authenticate, checkUserExist, getAssessment);
assessmentRouter.get("/assignment", authenticate, checkUserExist, getAssignment);
assessmentRouter.delete("/:id", authenticate, checkUserExist, deleteAssessment);
assessmentRouter.delete("/assignment/:id", authenticate, checkUserExist, deleteAssignment);

export default assessmentRouter;