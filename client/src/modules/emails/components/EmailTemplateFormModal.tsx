import { useEffect } from 'react'
import { Modal, Form, Input, Select, Divider, Tooltip, Typography, notification } from 'antd'
import { useCreateEmailTemplate, useUpdateEmailTemplate } from '../lib/queries/email.queries'
import { emailTemplateSchema } from '../schemas/email.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import type { EmailTemplate, EmailTemplateFormData, EmailTemplateType } from '../types/email.types'

const { TextArea } = Input
const { Option } = Select

const templateTypes: EmailTemplateType[] = ['offer', 'interview', 'assessment', 'rejection', 'hired', 'other']

const variableExamples = [
  { name: 'candidateName', description: 'Full name of the candidate' },
  { name: 'position', description: 'Job position title' },
  { name: 'salary', description: 'Offered salary' },
  { name: 'startDate', description: 'Expected joining date' },
  { name: 'interviewDate', description: 'Interview date' },
  { name: 'interviewTime', description: 'Interview time' },
  { name: 'interviewerName', description: 'Interviewer name' },
  { name: 'interviewerEmail', description: 'Interviewer email' },
  { name: 'interviewLink', description: 'Virtual interview link' },
  { name: 'assessmentDate', description: 'Assessment date' },
  { name: 'assessmentTime', description: 'Assessment time' },
  { name: 'rejectionReason', description: 'Rejection reason' },
  { name: 'offerDate', description: 'Offer date' },
  { name: 'offerTime', description: 'Offer time' },
  { name: 'duration', description: 'Duration (minutes)' },
  { name: 'technology', description: 'Technology stack' },
  { name: 'responseDeadline', description: 'Response deadline' },
  { name: 'assessmentLink', description: 'Assessment access link' },
]

const formattingGuide = [
  { key: '1', tag: '<br>', effect: 'Line break' },
  { key: '2', tag: '<b>text</b>', effect: 'Bold' },
  { key: '3', tag: '<i>text</i>', effect: 'Italic' },
  { key: '4', tag: '<u>text</u>', effect: 'Underline' },
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
      width={1000}
    >
      {contextHolder}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Left — form */}
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Template Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="e.g. Offer Letter Template" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Type is required' }]}>
            <Select placeholder="Select type">
              {templateTypes.map((t) => (
                <Option key={t} value={t} className="capitalize">{t}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="subject" label="Subject" rules={[{ required: true, message: 'Subject is required' }]}>
            <Input placeholder="e.g. Offer Letter for {{candidateName}}" />
          </Form.Item>
          <Form.Item
            name="body"
            label="Body"
            rules={[{ required: true, message: 'Body is required' }]}
            extra="Use {{variableName}} for dynamic content"
          >
            <TextArea rows={10} placeholder="Enter email body..." />
          </Form.Item>
        </Form>

        {/* Right — variables reference sidebar */}
        <div>
          <Typography.Text strong className="block mb-1">Available Variables</Typography.Text>
          <Typography.Text type="secondary" className="block mb-3 text-xs">
            Wrap with <code>{'{{variableName}}'}</code>
          </Typography.Text>
          <div className="space-y-1.5 overflow-auto" style={{ maxHeight: 300 }}>
            {variableExamples.map((v) => (
              <div key={v.name} className="flex items-start gap-2">
                <Tooltip title={v.description}>
                  <code className="shrink-0 cursor-help rounded bg-gray-100 px-1.5 py-0.5 text-xs text-blue-700">
                    {`{{${v.name}}}`}
                  </code>
                </Tooltip>
                <span className="text-xs text-gray-500">{v.description}</span>
              </div>
            ))}
          </div>

          <Divider className="my-3" />
          <Typography.Text strong className="block mb-2 text-sm">Formatting</Typography.Text>
          <div className="space-y-1.5">
            {formattingGuide.map((f) => (
              <div key={f.key} className="flex items-center gap-2">
                <code className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-purple-700">
                  {f.tag}
                </code>
                <span className="text-xs text-gray-500">{f.effect}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
