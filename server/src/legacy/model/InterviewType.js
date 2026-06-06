import mongoose from "mongoose";

const interviewTypeSchema = new mongoose.Schema({
  systemName: { type: String, required: true, unique: true, trim: true, lowercase: true },
  displayName: { type: String, required: true },
  order: { type: Number, required: true, index: true },
  color: { type: String, default: 'default' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const InterviewType = mongoose.model("interview_types", interviewTypeSchema);
export default InterviewType;
