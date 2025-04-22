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
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["scheduled", "cancelled", "completed"],
        default: "scheduled",
        required: true
    },
    type: {
        type: String,
        enum: ["in-person", "phone", "video"],
        default: "in-person",
        required: true
    },
    notes: {
        type: String,
    },
    feedback: {
        type: String,
    },
}, {
    timestamps: true
});


const Interview = mongoose.model("interview", interviewSchema);


export default Interview;