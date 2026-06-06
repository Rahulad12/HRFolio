import { Request, Response, NextFunction } from 'express'
import RolePermissions from '../../legacy/model/RolePermissions.js'

const cache = new Map<string, Record<string, boolean>>()
let cacheLoadedAt = 0
const CACHE_TTL_MS = 60_000

async function loadPermissions(role: string): Promise<Record<string, boolean>> {
  const now = Date.now()
  if (cache.has(role) && now - cacheLoadedAt < CACHE_TTL_MS) {
    return cache.get(role)!
  }
  const doc = await RolePermissions.findOne({ role })
  if (!doc) return {}
  const perms = Object.fromEntries(doc.permissions as Map<string, boolean>)
  cache.set(role, perms)
  cacheLoadedAt = now
  return perms
}

export function invalidatePermissionCache() {
  cache.clear()
  cacheLoadedAt = 0
}

export function hasPermission(key: string) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = (req as any).user
    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized' })
      return
    }
    const perms = await loadPermissions(user.role)
    if (!perms[key]) {
      res.status(403).json({ success: false, message: `Forbidden: missing permission '${key}'` })
      return
    }
    next()
  }
}
