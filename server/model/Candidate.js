import mongoose from "mongoose";
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
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
        emnum: ["junior", "mid", "senior"]
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
        type: String,
    },
    references: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "references"
    }],
    status: {
        type: String,
        enum: ["shortlisted", "first", "second", "third","assessment", "offered", "hired", "rejected", ],
        default: "shortlisted"
    }
},
    {
        timestamps: true
    });

const Candidate = mongoose.model("candidates", candidateSchema);
export default Candidate;