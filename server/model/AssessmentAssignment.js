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

assessmentAssignmentSchema.pre('save', function (next) {
    const now = new Date();
    if (this, this.status === "assigned" && this.date < now) {
        this.status = "pending";
    };
    next();
}
)

const AssessmentAssignment = mongoose.model("assessmentAssignments", assessmentAssignmentSchema);
export default AssessmentAssignment;
