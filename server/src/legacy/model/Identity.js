import mongoose from 'mongoose'

const identitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    index: true,
  },
  provider: {
    type: String,
    enum: ['google', 'azure', 'saml'],
    required: true,
  },
  externalId: {
    type: String,
    required: true,
  },
  providerEmail: {
    type: String,
    required: true,
  },
  linkedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true })

identitySchema.index({ provider: 1, externalId: 1 }, { unique: true })

const Identity = mongoose.model('identities', identitySchema)
export default Identity
