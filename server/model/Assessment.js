import mongoose from 'mongoose'

const assessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        lowercase: true
    },
    type: {
        type: String,
        enum: ["behavioural", "technical"],
        required: true,
        lowercase: true
    },
    technology: {
        type: String,
        required: true,
        lowercase: true
    },
    level: {
        type: String,
        required: true,
        lowercase: true
    },
},{
    timestamps: true
})

const Assessment = mongoose.model("assessments", assessmentSchema);
export default Assessment;