import mongoose, { Schema, Document } from 'mongoose';
import { AuditActionType } from '../types/audit-logs.types';

export interface IAuditLog extends Document {
  timestamp: Date;
  actor: {
    id: mongoose.Types.ObjectId;
    name: string;
    role: string;
  };
  action: AuditActionType;
  target: {
    id: mongoose.Types.ObjectId;
    type: string;
    name?: string;
  };
  metadata?: {
    before?: any;
    after?: any;
    comment?: string;
  };
  ipAddress?: string;
}

const auditLogSchema = new Schema<IAuditLog>({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  actor: {
    id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    name: { type: String, required: true },
    role: { type: String, required: true }
  },
  action: {
    type: String,
    required: true
  },
  target: {
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, required: true },
    name: { type: String }
  },
  metadata: {
    before: { type: Schema.Types.Mixed },
    after: { type: Schema.Types.Mixed },
    comment: { type: String }
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: false, // We use our own timestamp
  versionKey: false
});

// Ensure immutability via Mongoose middleware (prevent updates/deletes)
auditLogSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next(new Error('Audit logs are immutable and cannot be updated.'));
  }
  next();
});

export const AuditLog = mongoose.model<IAuditLog>('audit_logs', auditLogSchema);
