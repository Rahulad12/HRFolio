import mongoose, { Schema, Document } from 'mongoose';
import { EscalationStatus, EscalationLevel } from '../types/escalations.types';

export interface IEscalation extends Document {
  candidateId: mongoose.Types.ObjectId;
  raisedBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  status: EscalationStatus;
  level: EscalationLevel;
  notes: string;
  resolutionComment?: string;
  parentEscalationId?: mongoose.Types.ObjectId;
}

const escalationSchema = new Schema<IEscalation>({
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'candidates',
    required: true
  },
  raisedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Review', 'Resolved', 'Cancelled'],
    default: 'Pending'
  },
  level: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  notes: {
    type: String,
    required: true
  },
  resolutionComment: {
    type: String
  },
  parentEscalationId: {
    type: Schema.Types.ObjectId,
    ref: 'escalations'
  }
}, {
  timestamps: true
});

export const Escalation = mongoose.model<IEscalation>('escalations', escalationSchema);
