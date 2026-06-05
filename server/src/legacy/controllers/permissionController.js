import RolePermissions from '../model/RolePermissions.js'
import { invalidatePermissionCache } from '../../shared/middleware/hasPermission.ts'

// GET /api/auth/me/permissions
export const getMyPermissions = async (req, res) => {
  try {
    const doc = await RolePermissions.findOne({ role: req.user.role })
    if (!doc) {
      return res.status(200).json({ success: true, data: [] })
    }
    const permitted = []
    for (const [key, value] of doc.permissions.entries()) {
      if (value) permitted.push(key)
    }
    return res.status(200).json({ success: true, data: permitted })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/auth/role-permissions  — Admin only
export const getAllRolePermissions = async (req, res) => {
  try {
    const docs = await RolePermissions.find({}).sort({ role: 1 })
    const result = docs.map((doc) => ({
      role: doc.role,
      locked: doc.locked,
      permissions: Object.fromEntries(doc.permissions),
    }))
    return res.status(200).json({ success: true, data: result })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// PATCH /api/auth/role-permissions  — Admin only
// Body: { role: "HR", key: "candidates:delete", value: true }
export const updateRolePermission = async (req, res) => {
  try {
    const { role, key, value } = req.body
    if (!role || !key || typeof value !== 'boolean') {
      return res.status(400).json({ success: false, message: 'role, key, and value (boolean) are required' })
    }

    const doc = await RolePermissions.findOne({ role })
    if (!doc) {
      return res.status(404).json({ success: false, message: `Role '${role}' not found` })
    }
    if (doc.locked) {
      return res.status(403).json({ success: false, message: `Permissions for '${role}' are locked` })
    }

    doc.permissions.set(key, value)
    doc.updatedBy = req.user.id
    await doc.save()

    invalidatePermissionCache()

    return res.status(200).json({ success: true, message: 'Permission updated', data: Object.fromEntries(doc.permissions) })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
