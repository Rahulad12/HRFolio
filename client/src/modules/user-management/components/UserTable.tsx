import { useState, useMemo } from 'react'
import { Table, Input, Select, Space, Tag, Button, Popconfirm, notification, Tooltip, Modal, Form } from 'antd'
import { Search, Ban, CheckCircle, UserCog, UserPlus } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserList, useToggleUserStatus, useUpdateUserRole, useCreateUser } from '../lib/queries/user.queries'
import { RoleChangeModal } from './RoleChangeModal'
import type { User, UserRole, UserStatus } from '../types/user.types'
import { createUserSchema, type CreateUserFormValues } from '../schemas/user.schema'

const { Option } = Select

const roleColors: Record<UserRole, string> = {
  HR: 'blue',
  'HR Admin': 'purple',
  Admin: 'red',
}

const statusColors: Record<UserStatus, string> = {
  active: 'green',
  inactive: 'red',
}

export function UserTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('')
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [api, contextHolder] = notification.useNotification()

  const { data, isLoading } = useUserList()
  const { mutateAsync: toggleStatus } = useToggleUserStatus()
  const { mutateAsync: updateRole } = useUpdateUserRole()
  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser()

  const createForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
  })

  const filteredData = useMemo(() => {
    const list = data?.data || []
    return list.filter((item) => {
      const matchesSearch = !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = !roleFilter || item.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [data, searchTerm, roleFilter])

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await toggleStatus(id)
      if (res.success) api.success({ message: res.message, placement: 'topRight', duration: 3 })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error updating status', placement: 'topRight', duration: 3 })
    }
  }

  const handleRoleUpdate = async (role: UserRole) => {
    if (!selectedUser) return
    try {
      const res = await updateRole({ id: selectedUser._id, role })
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        setRoleModalOpen(false)
        setSelectedUser(null)
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error updating role', placement: 'topRight', duration: 3 })
    }
  }

  const handleCreateUser = async (values: CreateUserFormValues) => {
    try {
      const res = await createUser(values)
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        setCreateModalOpen(false)
        createForm.reset()
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error creating user', placement: 'topRight', duration: 3 })
    }
  }

  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: unknown, record: User) => (
        <Space>
          {record.picture && (
            <img src={record.picture} alt="" className="h-8 w-8 rounded-full" />
          )}
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => (
        <Tag color={roleColors[role]}>{role}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <Tag color={statusColors[status]} className="capitalize">{status}</Tag>
      ),
    },
    {
      title: 'Logged In',
      dataIndex: 'isLoggedIn',
      key: 'isLoggedIn',
      render: (loggedIn: boolean) => (
        <Tag color={loggedIn ? 'green' : 'default'}>{loggedIn ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space>
          <Tooltip title="Change Role">
            <Button
              type="link"
              icon={<UserCog size={16} />}
              onClick={() => { setSelectedUser(record); setRoleModalOpen(true) }}
            />
          </Tooltip>
          <Popconfirm
            title={record.status === 'active' ? 'Deactivate this user?' : 'Activate this user?'}
            onConfirm={() => handleToggleStatus(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title={record.status === 'active' ? 'Deactivate' : 'Activate'}>
              <Button
                type="link"
                icon={record.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                danger={record.status === 'active'}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {contextHolder}
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Input
            placeholder="Search by name or email..."
            prefix={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by role"
            value={roleFilter || undefined}
            onChange={(val) => setRoleFilter(val || '')}
            allowClear
            style={{ width: 160 }}
          >
            <Option value="Admin">Admin</Option>
            <Option value="HR Admin">HR Admin</Option>
            <Option value="HR">HR</Option>
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<UserPlus size={16} />}
          onClick={() => setCreateModalOpen(true)}
        >
          Add User
        </Button>
      </div>

      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <RoleChangeModal
        user={selectedUser}
        open={roleModalOpen}
        onClose={() => { setRoleModalOpen(false); setSelectedUser(null) }}
        onConfirm={handleRoleUpdate}
      />

      <Modal
        title="Add New User"
        open={createModalOpen}
        onCancel={() => { setCreateModalOpen(false); createForm.reset() }}
        onOk={createForm.handleSubmit(handleCreateUser)}
        confirmLoading={isCreating}
        okText="Create User"
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Full Name" required>
            <Controller
              name="name"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Enter full name" status={fieldState.error ? 'error' : ''} />
                  {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Email Address" required>
            <Controller
              name="email"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <>
                  <Input {...field} placeholder="Enter email" status={fieldState.error ? 'error' : ''} />
                  {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </Form.Item>
          <Form.Item label="Role" required>
            <Controller
              name="role"
              control={createForm.control}
              render={({ field, fieldState }) => (
                <>
                  <Select {...field} placeholder="Select role" status={fieldState.error ? 'error' : ''} style={{ width: '100%' }}>
                    <Option value="HR">HR</Option>
                    <Option value="HR Admin">HR Admin</Option>
                    <Option value="Admin">Admin</Option>
                  </Select>
                  {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>}
                </>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
