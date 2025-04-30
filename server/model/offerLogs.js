import mongoose from "mongoose";

const offerLogSchema = new mongoose.Schema({
    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'offers', required: true },
    action: { type: String, enum: ['created', 'updated', 'deleted'], required: true },
    details: { type: Object },
    performedAt: { type: Date, default: Date.now },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

const OfferLog = mongoose.model('offerLogs', offerLogSchema);
export default OfferLog;