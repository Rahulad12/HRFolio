// models/InterviewLog.js
import mongoose from 'mongoose';

const interviewLogSchema = new mongoose.Schema({
    interviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'interviews', required: false },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'candidates', required: true },
    interviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'interviewers', required: true },
    action: { type: String, enum: ['created', 'updated', 'deleted', 'scheduled', 'cancelled', 'completed', 'failed', 'rescheduled'], required: true },
    details: { type: Object },
    performedAt: { type: Date, default: Date.now },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

const InterviewLog = mongoose.model('InterviewLog', interviewLogSchema);
export default InterviewLog;
