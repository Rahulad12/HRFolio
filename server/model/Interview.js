import mongoose from "mongoose";
import candidate from "./Candidate.js";

const interviewSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates"
    },
    interviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "interviewers"
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "scheduled", "cancelled", "completed", "failed"],
        required: true
    },
    type: {
        type: String,
        enum: ["in-person", "phone", "video"],
        default: "in-person",
        required: true
    },
    candidateStatus: {
        type: String,
        enum: ["First", "Second", "Third"],
        default: "First",
        required: true
    },
    notes: {
        type: String,
    },
    feedback: {
        type: String,
    },
    rating: {
        type: Number
    }
}, {
    timestamps: true
});

// interviewSchema.pre("save", async function (next) {
//     if (this.status === "scheduled") {
//         const candidateId = this.candidate;
//         const candidate = await candidate.findById(candidateId);

//         if (candidate) {
//             candidate.status = "First";
//             await candidate.save();
//         }
//     }
//     next();
// });

const Interview = mongoose.model("interviews", interviewSchema);


export default Interview;