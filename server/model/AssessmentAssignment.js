import mongoose from "mongoose";
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
    const now = new Date();
    if (this, this.status === "assigned" && this.date < now) {
        this.status = "pending";
    };

    if (this.status === "assigned") {
        const candidate = await Candidate.findById(this.candidate);
        if (candidate && candidate.status !== 'assessment') {
            candidate.status = 'assessment';
            await candidate.save();
        }
        candidate.status = "assessment";
        await candidate.save();
    }
    next();
}
)

const AssessmentAssignment = mongoose.model("assessmentAssignments", assessmentAssignmentSchema);
export default AssessmentAssignment;
