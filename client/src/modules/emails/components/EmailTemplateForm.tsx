import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Form, Input, Select, message } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
import { useCreateEmailTemplate, useUpdateEmailTemplate, useEmailTemplateById } from '../lib/queries/email.queries'
import { emailTemplateSchema } from '../schemas/email.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import { TemplateEditor } from './editor/TemplateEditor'
import type { EmailTemplateFormData, EmailTemplateType } from '../types/email.types'

const { Option } = Select

const templateTypes: EmailTemplateType[] = [
  'offer', 'interview', 'assessment', 'rejection', 'hired', 'other',
]

export function EmailTemplateForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm<EmailTemplateFormData>()

  const isEditing = !!id
  const { data: templateData } = useEmailTemplateById(id || '')
  const { mutateAsync: createTemplate, isPending: isCreating } = useCreateEmailTemplate()
  const { mutateAsync: updateTemplate, isPending: isUpdating } = useUpdateEmailTemplate()

  useEffect(() => {
    if (isEditing && templateData?.data) {
      form.setFieldsValue({
        name: templateData.data.name,
        subject: templateData.data.subject,
        body: templateData.data.body,
        type: templateData.data.type,
        variables: templateData.data.variables,
      })
    } else if (!isEditing) {
      form.resetFields()
    }
  }, [id, isEditing, form, templateData])

  const handleSubmit = async () => {
    try {
      const values = await zodResolver(emailTemplateSchema, form.getFieldsValue())
      let res: { success: boolean; message: string }
      if (isEditing) {
        res = await updateTemplate({ id: id!, data: values })
      } else {
        res = await createTemplate(values)
      }
      if (res.success) {
        message.success(res.message)
        navigate('/dashboard/email-templates')
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        message.error(err.message)
      }
    }
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Email Template' : 'New Email Template'}
        backPath="/dashboard/email-templates"
      />

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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

          <div className="mt-6 flex justify-end space-x-3">
            <Button onClick={() => navigate('/dashboard/email-templates')}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            >
              {isEditing ? 'Update Template' : 'Create Template'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
