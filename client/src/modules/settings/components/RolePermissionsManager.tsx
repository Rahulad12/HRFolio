import { Card, Switch, Tabs, Typography, message } from 'antd'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchAllRolePermissions, updateRolePermission, type RolePermsDoc } from '@/shared/lib/api/permission.api'

const RESOURCE_GROUPS = [
  { label: 'Candidates',      keys: ['candidates:create', 'candidates:read', 'candidates:update', 'candidates:delete'] },
  { label: 'Interviews',      keys: ['interviews:create', 'interviews:read', 'interviews:update', 'interviews:delete'] },
  { label: 'Assessments',     keys: ['assessments:create', 'assessments:read', 'assessments:update', 'assessments:delete'] },
  { label: 'Offers',          keys: ['offers:create', 'offers:read', 'offers:update', 'offers:delete'] },
  { label: 'Interviewers',    keys: ['interviewers:create', 'interviewers:read', 'interviewers:update', 'interviewers:delete'] },
  { label: 'Email Templates', keys: ['email-templates:create', 'email-templates:read', 'email-templates:update', 'email-templates:delete'] },
  { label: 'Escalations',     keys: ['escalations:create', 'escalations:read', 'escalations:update'] },
  { label: 'Audit Logs',      keys: ['audit-logs:read'] },
  { label: 'Settings',        keys: ['settings:manage'] },
  { label: 'Users',           keys: ['users:manage'] },
]

function PermissionTable({ roleData }: { roleData: RolePermsDoc }) {
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: ({ key, value }: { key: string; value: boolean }) =>
      updateRolePermission(roleData.role, key, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] })
      message.success('Permission updated')
    },
    onError: () => message.error('Failed to update permission'),
  })

  return (
    <div className="space-y-4">
      {RESOURCE_GROUPS.map((group) => (
        <div key={group.label}>
          <Typography.Text strong className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {group.label}
          </Typography.Text>
          <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
            {group.keys.map((key) => {
              const action = key.split(':')[1]
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 dark:border-slate-700"
                >
                  <span className="text-xs capitalize text-slate-600 dark:text-slate-300">{action}</span>
                  <Switch
                    size="small"
                    checked={roleData.permissions[key] ?? false}
                    disabled={roleData.locked}
                    onChange={(checked) => mutate({ key, value: checked })}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
      {roleData.locked && (
        <Typography.Text type="secondary" className="text-xs">
          Permissions for this role are locked and cannot be modified.
        </Typography.Text>
      )}
    </div>
  )
}

export function RolePermissionsManager() {
  const { data, isLoading } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: fetchAllRolePermissions,
    select: (res) => res.data,
  })

  const roles = data ?? []

  return (
    <Card title="Role Permissions" loading={isLoading}>
      <Tabs
        items={['HR', 'HR Admin', 'Admin'].map((roleName) => {
          const roleData = roles.find((r) => r.role === roleName)
          return {
            key: roleName,
            label: roleName,
            children: roleData ? <PermissionTable roleData={roleData} /> : null,
          }
        })}
      />
    </Card>
  )
}
