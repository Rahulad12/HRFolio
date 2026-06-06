import express from 'express';
import {
    assignAssessment,
    createAssessment,
    getAssessment,
    getAssignment,
    deleteAssessment,
    deleteAssignment,
    updateAssessment,
    updateAssignmnet,
    getAssessmentById,
    getAssignmentById,
    createScore,
    getScoreById,
    getScore,
    getAssignmentByCandidateId,
    getAssessmentLogByCandidateId
} from "../controllers/assessmentController.js";
import { authenticate, checkUserExist } from "../middleware/auhtMiddleware.js";

const assessmentRouter = express.Router();

// Create & Assign
assessmentRouter.post("/", authenticate, checkUserExist, createAssessment);
assessmentRouter.post("/assign", authenticate, checkUserExist, assignAssessment);
assessmentRouter.post("/score", authenticate, checkUserExist, createScore);

// Get All
assessmentRouter.get("/", authenticate, checkUserExist, getAssessment);
assessmentRouter.get("/assignment", authenticate, checkUserExist, getAssignment);
assessmentRouter.get("/score", authenticate, checkUserExist, getScore);

// Get by Candidate
assessmentRouter.get("/assignment/candidate/:id", authenticate, checkUserExist, getAssignmentByCandidateId);
assessmentRouter.get("/logs/candidate/:id", authenticate, checkUserExist, getAssessmentLogByCandidateId);

// Get by ID (specific before generic)
assessmentRouter.get("/assignment/:id", authenticate, checkUserExist, getAssignmentById);
assessmentRouter.get("/score/:id", authenticate, checkUserExist, getScoreById);
assessmentRouter.get("/:id", authenticate, checkUserExist, getAssessmentById);

// Update (specific before generic)
assessmentRouter.put("/assignment/:id", authenticate, checkUserExist, updateAssignmnet);
assessmentRouter.put("/:id", authenticate, checkUserExist, updateAssessment);

// Delete (specific before generic)
assessmentRouter.delete("/assignment/:id", authenticate, checkUserExist, deleteAssignment);
assessmentRouter.delete("/:id", authenticate, checkUserExist, deleteAssessment);

export default assessmentRouter;
