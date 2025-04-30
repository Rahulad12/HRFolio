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
    candidateInterviewStatus: {
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

interviewSchema.pre("save", async function (next) {
    if (this.status === "scheduled") {
        const candidateId = this.candidate;
        const candidateInfo = await candidate.findById(candidateId);

        if (this.candidateInterviewStatus === "first") {
            candidateInfo.status = "first";
            await candidateInfo.save();
        }
        else if (this.candidateInterviewStatus === "second") {
            candidateInfo.status = "second";
            await candidateInfo.save();
        }
        else if (this.candidateInterviewStatus === "third") {
            candidateInfo.status = "third";
            await candidateInfo.save();
        }
    }
    next();
});

const Interview = mongoose.model("interviews", interviewSchema);


export default Interview;