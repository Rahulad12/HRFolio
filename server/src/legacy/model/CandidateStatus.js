import mongoose from "mongoose";

const candidateStatusSchema = new mongoose.Schema({
  systemName: { type: String, required: true, unique: true, trim: true, lowercase: true },
  displayName: { type: String, required: true },
  order: { type: Number, required: true, index: true },
  color: { type: String, default: 'default' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const CandidateStatus = mongoose.model("candidate_statuses", candidateStatusSchema);
export default CandidateStatus;
