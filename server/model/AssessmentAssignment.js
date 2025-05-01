import mongoose from "mongoose";
import { updateCandidateProgress } from "../utils/updateCandidateProgress.js";
import Candidate from "./Candidate.js";
const assessmentAssignmentSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates"
    },
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assessments"
    },
    emailTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "emailtemplates"
    },
    dueDate: {
        type: String,
        required: true
    },
    score: {
        type: Number

    },
    status: {
        type: String,
        enum: ["assigned", "pending", "completed"],
        default: "assigned",
        required: true
    },

}, {
    timestamps: true
});

assessmentAssignmentSchema.pre('save', async function (next) {
    try {
        if (this.status === "assigned") {
            const candidateInfo = await Candidate.findById(this.candidate);
            candidateInfo.status = "assessment";
            await candidateInfo.save();
        }
        if (this.status === "completed") {
            await updateCandidateProgress(this.candidate, 'assessment');
        }
        next();
    } catch (err) {
        next(err);
    }
})

const AssessmentAssignment = mongoose.model("assessmentAssignments", assessmentAssignmentSchema);
export default AssessmentAssignment;
