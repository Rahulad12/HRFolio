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

// This works only on .save()
offerSchema.pre('save', async function (next) {
    try {
        if (this.status === 'sent') {
            const candidate = await Candidate.findById(this.candidate);
            if (candidate && candidate.status !== 'offered') {
                candidate.status = 'offered';
                await candidate.save();
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

// This works on .findOneAndUpdate()
offerSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const update = this.getUpdate();
        const status = update?.status;

        if (status === 'sent') {
            const offer = await this.model.findOne(this.getQuery()).lean();
            const candidateId = offer?.candidate;

            if (candidateId) {
                const candidate = await Candidate.findById(candidateId);
                if (candidate && candidate.status !== 'offered') {
                    candidate.status = 'offered';
                    await candidate.save();
                }
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

const Offer = mongoose.model('offers', offerSchema);
export default Offer;
