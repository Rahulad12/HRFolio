import mongoose from 'mongoose'

const assessmentSchema = new mongoose.Schema({
    assessment: {
        type: String,
        required: true,
        lowercase: true
    },
    type: {
        type: String,
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