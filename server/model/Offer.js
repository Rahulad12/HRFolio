import mongoose from 'mongoose';
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

const Offer = mongoose.model('offers', offerSchema);
export default Offer;
