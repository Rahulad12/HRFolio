import mongoose from 'mongoose';
import Candidate from './Candidate.js';

const offerSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'candidates',
        required: true,
    },
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'emailtemplates',
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    salary: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    responseDeadline: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected'],
        required: true,
    },
}, {
    timestamps: true,
});

offerSchema.pre('save', async function (next) {
    try {
        if (this.status === 'sent') {
            const candidate = await Candidate.findById(this.candidate);
            if (!candidate) {
                return next(new Error('Candidate not found'));
            }

            if (candidate.status !== 'offered') {
                candidate.status = 'offered';
                await candidate.save();
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Offer = mongoose.model('offers', offerSchema);
export default Offer;
