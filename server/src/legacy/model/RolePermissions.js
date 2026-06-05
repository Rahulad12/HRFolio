import mongoose from 'mongoose'

const rolePermissionsSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['HR', 'HR Admin', 'Admin'],
    required: true,
    unique: true,
  },
  permissions: {
    type: Map,
    of: Boolean,
    required: true,
  },
  locked: {
    type: Boolean,
    default: false,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
}, { timestamps: true })

const RolePermissions = mongoose.model('role_permissions', rolePermissionsSchema)
export default RolePermissions
