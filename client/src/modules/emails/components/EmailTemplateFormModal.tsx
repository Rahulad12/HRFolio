import { useEffect } from 'react'
import { Modal, Form, Input, Select, notification } from 'antd'
import { useCreateEmailTemplate, useUpdateEmailTemplate } from '../lib/queries/email.queries'
import { emailTemplateSchema } from '../schemas/email.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import { TemplateEditor } from './editor/TemplateEditor'
import type { EmailTemplate, EmailTemplateFormData, EmailTemplateType } from '../types/email.types'

const { Option } = Select

const templateTypes: EmailTemplateType[] = [
  'offer', 'interview', 'assessment', 'rejection', 'hired', 'other',
]

interface Props {
  open: boolean
  template: EmailTemplate | null
  onClose: () => void
}

export function EmailTemplateFormModal({ open, template, onClose }: Props) {
  const [form] = Form.useForm<EmailTemplateFormData>()
  const [api, contextHolder] = notification.useNotification()
  const { mutateAsync: createTemplate, isPending: isCreating } = useCreateEmailTemplate()
  const { mutateAsync: updateTemplate, isPending: isUpdating } = useUpdateEmailTemplate()

  const isEditing = !!template

  useEffect(() => {
    if (template) {
      form.setFieldsValue({
        name: template.name,
        subject: template.subject,
        body: template.body,
        type: template.type,
        variables: template.variables,
      })
    } else {
      form.resetFields()
    }
  }, [template, form])

  const handleSubmit = async () => {
    try {
      const values = await zodResolver(emailTemplateSchema, form.getFieldsValue())
      let res: { success: boolean; message: string }
      if (isEditing) {
        res = await updateTemplate({ id: template!._id, data: values })
      } else {
        res = await createTemplate(values)
      }
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        onClose()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        api.error({ message: err.message, placement: 'topRight', duration: 3 })
      }
    }
  }

  return (
    <Modal
      title={isEditing ? 'Edit Email Template' : 'New Email Template'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isCreating || isUpdating}
      destroyOnClose
      width={1100}
    >
      {contextHolder}
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Template Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="e.g. Offer Letter Template" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: 'Type is required' }]}
          >
            <Select placeholder="Select type">
              {templateTypes.map((t) => (
                <Option key={t} value={t} className="capitalize">{t}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Subject is required' }]}
          >
            <Input placeholder="e.g. Your offer from Acme Co." />
          </Form.Item>
        </div>

        <Form.Item
          name="body"
          label="Body"
          rules={[{ required: true, message: 'Body is required' }]}
        >
          <TemplateEditor
            value={form.getFieldValue('body') || ''}
            onChange={(v) => form.setFieldValue('body', v)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
