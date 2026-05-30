import mongoose from "mongoose";

const referenceSchema = new mongoose.Schema({
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "candidate" },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    relation: {
        type: String,
        required: true
    },

}, {
    timestamps: true
});

const Reference = mongoose.model("references", referenceSchema);
export default Reference;
