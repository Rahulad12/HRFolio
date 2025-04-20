import mongoose from "mongoose";

const assessmentAssignmentSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates"
    },
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assessments"
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Assigned", "pending", "completed"],
        default: "Assigned",
        required: true
    },
}, {
    timestamps: true
});

const AssessmentAssignment = mongoose.model("assessmentAssignments", assessmentAssignmentSchema);
export default AssessmentAssignment;
