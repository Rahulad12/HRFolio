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
        const Interview = mongoose.model("interviews");

        // Check for existing completed interviews for this candidate
        const interviews = await Interview.find({ candidate: candidateId });

        const stageCompleted = (stage) =>
            interviews.some(int => int.candidateInterviewStatus === stage && int.status === "completed");

        // Validate stage progression
        if (this.candidateInterviewStatus === "second" && !stageCompleted("first")) {
            return next(new Error("First round interview must be completed before scheduling second round."));
        }

        if (this.candidateInterviewStatus === "third" && !stageCompleted("second")) {
            return next(new Error("Second round interview must be completed before scheduling third round."));
        }

        // Update candidate status accordingly
        candidateInfo.status = this.candidateInterviewStatus;
        await candidateInfo.save();
    }

    next();
});


const Interview = mongoose.model("interviews", interviewSchema);


export default Interview;