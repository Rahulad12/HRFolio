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
    progress: {
        shortlisted: {
            completed: { type: Boolean, default: false },
            date: Date
        },
        assessment: {
            completed: { type: Boolean, default: false },
            date: Date
        },
        first: {
            completed: { type: Boolean, default: false },
            date: Date
        },
        second: {
            completed: { type: Boolean, default: false },
            date: Date
        },
        third: {
            completed: { type: Boolean, default: false },
            date: Date
        },
        offered: {
            completed: { type: Boolean, default: false },
            date: Date
        },
        hired: {
            completed: { type: Boolean, default: false },
            date: Date
        }
    },
    status: {
        type: String,
        enum: ["shortlisted", "assessment", "first", "second", "third", "offered", "hired", "rejected"],
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
