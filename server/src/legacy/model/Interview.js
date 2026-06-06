import mongoose from "mongoose";
import Candidate from "./Candidate.js";
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
        required: true
    },
    type: {
        type: String,
        default: "in-person",
        required: true
    },
    InterviewRound: {
        type: String,
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
    },
    meetingLink: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
}, {
    timestamps: true
});

const Interview = mongoose.model("interviews", interviewSchema);
export default Interview;