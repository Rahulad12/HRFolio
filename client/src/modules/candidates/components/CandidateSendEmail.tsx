import { useState } from 'react'
import { Button, Card, Col, Form, Input, Row, Typography, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'
import { useCandidateById } from '../lib/queries/candidate.queries'
import { useSendGeneralEmail } from '../lib/queries/email.queries'

const { Text } = Typography

export function CandidateSendEmail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [emailForm] = Form.useForm()
  const { data: candidateData } = useCandidateById(id || '')
  const { mutateAsync: sendEmail, isPending } = useSendGeneralEmail()
  const candidate = candidateData?.data

  const [preview, setPreview] = useState({ subject: '', body: '' })

  const handleSubmit = async (values: { subject: string; body: string }) => {
    if (!candidate?._id || !candidate?.email) return
    try {
      const res = await sendEmail({
        candidate: candidate._id,
        emailAddress: candidate.email,
        subject: values.subject,
        body: values.body,
      })
      if (res.success) {
        message.success(res.message || 'Email sent successfully')
        navigate('/dashboard/candidates')
      }
    } catch {
      message.error('Failed to send email')
    }
  }

  return (
    <div>
      <PageHeader
        title={`Send Email${candidate ? ` to ${candidate.name}` : ''}`}
        backPath="/dashboard/candidates"
      />

      <Row gutter={[16, 16]}>
        <Col md={12} xs={24}>
          <Card>
            <div className="mb-4 space-y-1">
              <Text strong>To: </Text>
              <Text>{candidate?.email || 'Loading...'}</Text>
            </div>
            <Form form={emailForm} layout="vertical" autoComplete="off" onFinish={handleSubmit} onValuesChange={(_, v) => setPreview({ subject: v.subject || '', body: v.body || '' })}>
              <Form.Item label="Subject" name="subject" rules={[{ required: true, message: 'Please enter a subject' }]}>
                <Input placeholder="Email subject" />
              </Form.Item>
              <Form.Item label="Body" name="body" rules={[{ required: true, message: 'Please enter the email body' }]}>
                <Input.TextArea rows={6} placeholder="Write your email here..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isPending} disabled={isPending}>
                  Send Email
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col md={12} xs={24}>
          <Card title="Live Preview">
            {preview.subject || preview.body ? (
              <div className="space-y-4">
                <div><Text strong>To: </Text><span>{candidate?.email || '[Candidate Email]'}</span></div>
                <div><Text strong>Subject: </Text><span>{preview.subject || '[No Subject]'}</span></div>
                <div>
                  <Text strong>Body:</Text>
                  <div className="mt-1 whitespace-pre-wrap rounded border bg-gray-50 p-2 text-sm text-gray-700">
                    {preview.body || '[No Body]'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">Fill out the form to preview the email.</div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
