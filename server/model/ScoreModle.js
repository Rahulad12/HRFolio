import mongoose from "mongoose";
const scoreSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidates"
    },
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assessments"
    },
    score: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Passed", "Failed"],
        default: "pending",
        required: true
    },
}, {
    timestamps: true
});

const Score = mongoose.model("scores", scoreSchema);
export default Score;