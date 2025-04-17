import express from 'express';
import { assignAssessment, createAssessment, getAssessment, getAssignment, deleteAssessment, deleteAssignment, updateAssessment, updateAssignmnet, getAssessmentById, getAssignmentById } from "../controllers/assessmentController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js"
const assessmentRouter = express.Router();

assessmentRouter.post("/", authenticate, checkUserExist, createAssessment);
assessmentRouter.post("/assign", authenticate, checkUserExist, assignAssessment);
assessmentRouter.get("/", authenticate, checkUserExist, getAssessment);
assessmentRouter.get("/assignment", authenticate, checkUserExist, getAssignment);
assessmentRouter.delete("/:id", authenticate, checkUserExist, deleteAssessment);
assessmentRouter.delete("/assignment/:id", authenticate, checkUserExist, deleteAssignment);
assessmentRouter.put("/:id", authenticate, checkUserExist, updateAssessment);
assessmentRouter.put("/assignment/:id", authenticate, checkUserExist, updateAssignmnet);
assessmentRouter.get("/:id", authenticate, checkUserExist, getAssessmentById);
assessmentRouter.get("/assignment/:id", authenticate, checkUserExist, getAssignmentById);

export default assessmentRouter;