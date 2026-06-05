import { PageHeader } from '@/shared/components/PageHeader'
import { RolePermissionsManager } from './components/RolePermissionsManager'

export function PermissionsPage() {
  return (
    <div>
      <PageHeader title="Role Permissions" backPath="/dashboard/settings/lookup-values" />
      <RolePermissionsManager />
    </div>
  )
}
