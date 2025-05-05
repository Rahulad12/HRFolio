import mongoose from 'mongoose';

const candidateLogSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'candidates', required: true },
    action: { type: String, enum: ['created', 'updated', 'deleted','rejected'], required: true },
    details: { type: Object },
    performedAt: { type: Date, default: Date.now },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

const CandidateLog = mongoose.model('canidateLogs', candidateLogSchema);
export default CandidateLog;