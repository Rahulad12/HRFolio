import DOMPurify from 'dompurify'
import { Modal, Tag, Typography } from 'antd'
import type { EmailTemplate } from '../types/email.types'

const { Text } = Typography

interface Props {
  template: EmailTemplate | null
  open: boolean
  onClose: () => void
}

export function EmailTemplatePreviewModal({ template, open, onClose }: Props) {
  if (!template) return null

  return (
    <Modal
      title={template.name}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <div className="mb-4">
        <Text strong>Subject: </Text>
        <Text>{template.subject}</Text>
      </div>
      <div className="mb-4">
        <Text strong>Type: </Text>
        <Tag className="capitalize">{template.type}</Tag>
      </div>
      {template.variables.length > 0 && (
        <div className="mb-4">
          <Text strong>Variables: </Text>
          <div className="mt-1 flex flex-wrap gap-1">
            {template.variables.map((v) => (
              <Tag key={v} className="font-mono text-xs">{`{{${v}}}`}</Tag>
            ))}
          </div>
        </div>
      )}
      <div
        className="rounded border p-4"
        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(template.body) }}
      />
    </Modal>
  )
}
