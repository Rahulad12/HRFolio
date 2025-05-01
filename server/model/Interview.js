import mongoose from "mongoose";
import Candidate from "./Candidate.js";
import { updateCandidateProgress } from "../utils/updateCandidateProgress.js";
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
    InterviewRound: {
        type: String,
        enum: ["first", "second", "third"],
        default: "first",
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
//     try {
//         if (this.status === "completed") {
//             await updateCandidateProgress(this.candidate, this.InterviewRound);
//         }
//         next();
//     } catch (err) {
//         next(err);
//     }
// })

const Interview = mongoose.model("interviews", interviewSchema);
export default Interview;