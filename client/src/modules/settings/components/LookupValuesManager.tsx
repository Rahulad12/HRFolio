import { useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Table, Tag, message } from 'antd'
import { Plus } from 'lucide-react'
import { useCreateLookupValue, useDeactivateLookupValue, useUpdateLookupValue, useLookupValues } from '@/modules/lookup'
import type { LookupValue, CreateLookupPayload, UpdateLookupPayload, LookupEndpoint } from '@/modules/lookup'

interface Props {
  label: string
  endpoint: LookupEndpoint
  queryKey: readonly string[]
}

export function LookupValuesManager({ label, endpoint, queryKey }: Props) {
  const [addOpen, setAddOpen] = useState(false)
  const [editItem, setEditItem] = useState<LookupValue | null>(null)
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data: values = [], isLoading } = useLookupValues(endpoint, queryKey)

  const { mutateAsync: createValue, isPending: creating } = useCreateLookupValue(endpoint, queryKey)
  const { mutateAsync: updateValue, isPending: updating } = useUpdateLookupValue(endpoint, queryKey)
  const { mutateAsync: deactivate, isPending: deactivating } = useDeactivateLookupValue(endpoint, queryKey)

  const handleAdd = async () => {
    try {
      const vals = await form.validateFields() as CreateLookupPayload
      await createValue(vals)
      message.success('Added successfully')
      form.resetFields()
      setAddOpen(false)
    } catch {
      message.error('Failed to add')
    }
  }

  const handleEdit = async () => {
    if (!editItem) return
    try {
      const vals = await editForm.validateFields() as UpdateLookupPayload
      await updateValue({ id: editItem._id, data: vals })
      message.success('Updated successfully')
      setEditItem(null)
    } catch {
      message.error('Failed to update')
    }
  }

  const columns = [
    {
      title: 'System Name',
      dataIndex: 'systemName',
      key: 'systemName',
      render: (v: string) => <code>{v}</code>,
    },
    { title: 'Display Name', dataIndex: 'displayName', key: 'displayName' },
    { title: 'Order', dataIndex: 'order', key: 'order', width: 80 },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (v: string) => v ? <Tag color={v}>{v}</Tag> : '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: LookupValue) => (
        <div className="flex gap-2">
          <Button
            size="small"
            onClick={() => {
              setEditItem(record)
              editForm.setFieldsValue({
                displayName: record.displayName,
                order: record.order,
                color: record.color,
              })
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Deactivate this value?"
            description="It will be hidden from dropdowns but old records remain valid."
            onConfirm={() => deactivate(record._id)}
          >
            <Button size="small" danger loading={deactivating}>
              Deactivate
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button type="primary" icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
          Add {label}
        </Button>
      </div>

      <Table
        dataSource={values}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        size="small"
        pagination={false}
      />

      <Modal
        title={`Add ${label}`}
        open={addOpen}
        onOk={handleAdd}
        onCancel={() => { setAddOpen(false); form.resetFields() }}
        confirmLoading={creating}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="systemName" label="System Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g. fourth" />
          </Form.Item>
          <Form.Item name="displayName" label="Display Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g. Fourth Interview" />
          </Form.Item>
          <Form.Item name="order" label="Order" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="color" label="Color (Ant Design token)">
            <Input placeholder="e.g. blue, purple, green, gold" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`Edit ${label}`}
        open={!!editItem}
        onOk={handleEdit}
        onCancel={() => setEditItem(null)}
        confirmLoading={updating}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="displayName" label="Display Name" rules={[{ required: true, message: 'Required' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="order" label="Order" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="color" label="Color (Ant Design token)">
            <Input placeholder="e.g. blue, purple, green, gold" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
