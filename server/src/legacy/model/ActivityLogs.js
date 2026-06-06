import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'candidates' },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: {
        type: String,
    },
    entityType: {
        type: String,
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'entityType',
    },
    metaData: {
        type: Object,
    },
}, {
    timestamps: true
});

const ActivityLog = mongoose.model('activityLogs', activityLogSchema);
export default ActivityLog;