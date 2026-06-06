import RolePermissions from '../model/RolePermissions.js'

const DEFAULT_PERMISSIONS = {
  HR: {
    'candidates:create': true,  'candidates:read': true,  'candidates:update': true,  'candidates:delete': false,
    'interviews:create': true,  'interviews:read': true,  'interviews:update': true,  'interviews:delete': false,
    'assessments:create': true, 'assessments:read': true, 'assessments:update': true, 'assessments:delete': false,
    'offers:create': false,     'offers:read': true,      'offers:update': false,     'offers:delete': false,
    'interviewers:create': false, 'interviewers:read': true, 'interviewers:update': false, 'interviewers:delete': false,
    'email-templates:create': false, 'email-templates:read': true, 'email-templates:update': false, 'email-templates:delete': false,
    'escalations:create': true, 'escalations:read': true, 'escalations:update': false,
    'audit-logs:read': false,
    'settings:manage': false,
    'users:manage': false,
  },
  'HR Admin': {
    'candidates:create': true,  'candidates:read': true,  'candidates:update': true,  'candidates:delete': true,
    'interviews:create': true,  'interviews:read': true,  'interviews:update': true,  'interviews:delete': true,
    'assessments:create': true, 'assessments:read': true, 'assessments:update': true, 'assessments:delete': true,
    'offers:create': true,      'offers:read': true,      'offers:update': true,      'offers:delete': true,
    'interviewers:create': true, 'interviewers:read': true, 'interviewers:update': true, 'interviewers:delete': true,
    'email-templates:create': true, 'email-templates:read': true, 'email-templates:update': true, 'email-templates:delete': true,
    'escalations:create': true, 'escalations:read': true, 'escalations:update': true,
    'audit-logs:read': true,
    'settings:manage': false,
    'users:manage': false,
  },
  Admin: {
    'candidates:create': false, 'candidates:read': false, 'candidates:update': false, 'candidates:delete': false,
    'interviews:create': false, 'interviews:read': false, 'interviews:update': false, 'interviews:delete': false,
    'assessments:create': false,'assessments:read': false,'assessments:update': false,'assessments:delete': false,
    'offers:create': false,     'offers:read': false,     'offers:update': false,     'offers:delete': false,
    'interviewers:create': false,'interviewers:read': false,'interviewers:update': false,'interviewers:delete': false,
    'email-templates:create': false,'email-templates:read': false,'email-templates:update': false,'email-templates:delete': false,
    'escalations:create': false,'escalations:read': false,'escalations:update': false,
    'audit-logs:read': true,
    'settings:manage': true,
    'users:manage': true,
  },
}

export async function seedPermissions() {
  for (const [role, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
    const existing = await RolePermissions.findOne({ role })
    if (!existing) {
      await RolePermissions.create({
        role,
        permissions,
        locked: role === 'Admin',
      })
      console.log(`Seeded permissions for ${role}`)
    } else {
      console.log(`Permissions for ${role} already exist — skipping`)
    }
  }
}
