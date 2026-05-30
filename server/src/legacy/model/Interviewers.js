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
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    availability: [{
        id: {
            type: String,
            required: true
        },
        day: {
            type: String,
            required: true
        },
        timeSlots: [{
            type: String,
            required: true
        }]
    }]
}, {
    timestamps: true
});

const Interviewers = mongoose.model("interviewers", interviewerSchema);
export default Interviewers;