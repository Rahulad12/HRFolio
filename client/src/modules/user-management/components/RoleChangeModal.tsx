import { useEffect } from 'react'
import { Modal, Form, Select } from 'antd'
import { updateRoleSchema } from '../schemas/user.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import type { User, UserRole } from '../types/user.types'

const { Option } = Select

const roles: UserRole[] = ['HR', 'HR Admin', 'Admin']

interface Props {
  user: User | null
  open: boolean
  onClose: () => void
  onConfirm: (role: UserRole) => Promise<void>
}

export function RoleChangeModal({ user, open, onClose, onConfirm }: Props) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (user) {
      form.setFieldsValue({ role: user.role })
    } else {
      form.resetFields()
    }
  }, [user, form])

  const handleOk = async () => {
    try {
      const values = await zodResolver(updateRoleSchema, form.getFieldsValue())
      await onConfirm(values.role)
    } catch (err: unknown) {
      if (err instanceof Error) {
        form.setFields([{ name: 'role', errors: [err.message] }])
      }
    }
  }

  return (
    <Modal
      title={`Change Role — ${user?.name || ''}`}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Role is required' }]}>
          <Select>
            {roles.map((r) => (
              <Option key={r} value={r}>{r}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
