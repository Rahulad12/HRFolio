import mongoose from "mongoose";
const interviewerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
}, {
    timestamps: true
});

const Interviewers = mongoose.model("interviewers", interviewerSchema);
export default Interviewers;