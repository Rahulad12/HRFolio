import mongoose from "mongoose";

// Define the candidate pipeline stages
const STAGES = [
    "shortlisted",
    "assessment",
    "first",
    "second",
    "third",
    "offered",
    "hired"
];

// Dynamically generate the progress schema for each stage
const progressSchema = {};
STAGES.forEach(stage => {
    progressSchema[stage] = {
        completed: { type: Boolean, default: stage === "shortlisted" },
        date: Date
    };
});


const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    phone: {
        type: Number,
        required: true
    },
    technology: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ["junior", "mid", "senior"]
    },
    experience: {
        type: Number,
        required: true
    },
    expectedsalary: {
        type: Number,
        required: true
    },
    resume: {
        type: String
    },
    references: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "references"
    }],
    progress: progressSchema, // ← Dynamic progress structure
    status: {
        type: String,
        enum: [...STAGES, "rejected"],
        default: "shortlisted"
    },
    applieddate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Candidate = mongoose.model("candidates", candidateSchema);
export default Candidate;
