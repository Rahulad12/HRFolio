import mongoose from "mongoose";

const assessmentLogSchema = new mongoose.Schema({
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'assessments', required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'candidates', required: true },
    action: { type: String, enum: ['created', 'updated', 'deleted'], required: true },
    details: { type: Object },
    performedAt: { type: Date, default: Date.now },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
}, {
    timestamps: true
});

const AssessmentLog = mongoose.model('assessmentLogs', assessmentLogSchema);
export default AssessmentLog;