import { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, Button, Typography, notification } from 'antd'
import { useCreateOffer, useUpdateOffer, useOfferCandidates, useOfferEmailTemplates } from '../lib/queries/offer.queries'
import { offerSchema } from '../schemas/offer.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import dayjs from 'dayjs'
import type { Offer, OfferFormData } from '../types/offer.types'

const { Option } = Select

interface Props {
  open: boolean
  offer: Offer | null
  onClose: () => void
}

export function OfferFormModal({ open, offer, onClose }: Props) {
  const [form] = Form.useForm<OfferFormData>()
  const [api, contextHolder] = notification.useNotification()
  const [preview, setPreview] = useState('')
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [isSendingOffer, setIsSendingOffer] = useState(false)

  const { mutateAsync: createOffer } = useCreateOffer()
  const { mutateAsync: updateOffer } = useUpdateOffer()
  const { data: candidateData } = useOfferCandidates()
  const { data: templateData } = useOfferEmailTemplates({ type: 'offer' })

  const isEditing = !!offer
  const candidates = candidateData?.data || []
  const templates = templateData?.data || []

  useEffect(() => {
    if (offer) {
      form.setFieldsValue({
        candidate: offer.candidate?._id || '',
        email: offer.email,
        position: offer.position,
        salary: offer.salary,
        startDate: offer.startDate,
        responseDeadline: offer.responseDeadline,
        status: offer.status,
      })
      buildPreview(form.getFieldsValue())
    } else {
      form.resetFields()
      setPreview('')
    }
  }, [offer, form])

  const buildPreview = (values: Partial<OfferFormData>) => {
    const tmpl = templates.find((t) => t._id === values.email)
    const candidate = candidates.find((c) => c._id === values.candidate)
    if (!tmpl || !candidate) { setPreview(''); return }
    const result = tmpl.body
      .replace(/{{candidateName}}/g, candidate.name)
      .replace(/{{position}}/g, values.position || '')
      .replace(/{{salary}}/g, values.salary || '')
      .replace(/{{startDate}}/g, values.startDate ? dayjs(values.startDate).format('MMMM D, YYYY') : '')
      .replace(/{{responseDeadline}}/g, values.responseDeadline ? dayjs(values.responseDeadline).format('MMMM D, YYYY') : '')
      .replace(/{{offerDate}}/g, dayjs().format('MMMM D, YYYY'))
    setPreview(result)
  }

  const submitWithStatus = async (status: 'draft' | 'sent') => {
    const setLoading = status === 'draft' ? setIsSavingDraft : setIsSendingOffer
    setLoading(true)
    try {
      const raw = form.getFieldsValue()
      const payload = {
        ...raw,
        status,
        startDate: raw.startDate ? dayjs(raw.startDate).format('YYYY-MM-DD') : '',
        responseDeadline: raw.responseDeadline ? dayjs(raw.responseDeadline).format('YYYY-MM-DD') : '',
      }
      const values = await zodResolver(offerSchema, payload)
      let res: { success: boolean; message: string }
      if (isEditing) {
        res = await updateOffer({ id: offer!._id, data: values })
      } else {
        res = await createOffer(values)
      }
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        onClose()
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        api.error({ message: err.message, placement: 'topRight', duration: 3 })
      }
    } finally {
      setLoading(false)
    }
  }

  const isBusy = isSavingDraft || isSendingOffer

  return (
    <Modal
      title={isEditing ? 'Edit Offer' : 'New Offer'}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} disabled={isBusy}>
          Cancel
        </Button>,
        <Button key="draft" onClick={() => submitWithStatus('draft')} loading={isSavingDraft} disabled={isSendingOffer}>
          Save as Draft
        </Button>,
        <Button key="send" type="primary" onClick={() => submitWithStatus('sent')} loading={isSendingOffer} disabled={isSavingDraft}>
          Send Offer
        </Button>,
      ]}
      destroyOnClose
      width={900}
    >
      {contextHolder}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left — form */}
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(_, all) => buildPreview(all)}
        >
          <Form.Item name="candidate" label="Candidate" rules={[{ required: true, message: 'Candidate is required' }]}>
            <Select placeholder="Select candidate" showSearch filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }>
              {candidates.map((c) => (
                <Option key={c._id} value={c._id}>{c.name} ({c.email})</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="email" label="Email Template" rules={[{ required: true, message: 'Email template is required' }]}>
            <Select placeholder="Select email template">
              {templates.map((t) => (
                <Option key={t._id} value={t._id}>{t.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Position is required' }]}>
            <Input placeholder="e.g. Senior React Developer" />
          </Form.Item>

          <Form.Item name="salary" label="Salary" rules={[{ required: true, message: 'Salary is required' }]}>
            <Input placeholder="e.g. $120,000" />
          </Form.Item>

          <Form.Item name="startDate" label="Start Date" rules={[{ required: true, message: 'Start date is required' }]}>
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(d) => d && d < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item name="responseDeadline" label="Response Deadline" rules={[{ required: true, message: 'Response deadline is required' }]}>
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(d) => d && d < dayjs().startOf('day')}
            />
          </Form.Item>
        </Form>

        {/* Right — live email preview */}
        <div>
          <Typography.Text strong className="block mb-2">Email Preview</Typography.Text>
          {preview ? (
            <div
              className="overflow-auto rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 whitespace-pre-wrap"
              style={{ minHeight: 320, maxHeight: 480 }}
            >
              {preview}
            </div>
          ) : (
            <div
              className="flex items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-400"
              style={{ minHeight: 320 }}
            >
              Select a candidate and email template to see the preview
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}
