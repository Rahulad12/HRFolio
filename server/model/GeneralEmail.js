import mongoose from "mongoose"

const generalEmailSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'candidates', required: true },
    emailAddress: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    attachment: {
        type: String
    }
}, {
    timestamps: true
});

const GeneralEmail = mongoose.model('generalEmails', generalEmailSchema);
export default GeneralEmail;