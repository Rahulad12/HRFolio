import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Select, Transfer, DatePicker, Typography, Button, message, notification, Space } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useAssessmentList, useCreateAssignment, useCandidateBasicList, useEmailTemplateList } from '../lib/queries/assessment.queries'
import type { CandidateBasic, EmailTemplate } from '../types/assessment.types'
const { TextArea } = Input
const { Option } = Select

interface TransferItem {
  key: string
  title: string
  description: string
}

export function AssignAssessmentForm() {
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate()
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [previewText, setPreviewText] = useState('')

  const { data: assessmentData } = useAssessmentList()
  const { data: candidateData } = useCandidateBasicList()
  const { data: templateData } = useEmailTemplateList()
  const { mutateAsync: createAssignment, isPending } = useCreateAssignment()

  const assessments = assessmentData?.data || []
  const candidatesList: CandidateBasic[] = useMemo(() => candidateData?.data || [], [candidateData])
  const templates: EmailTemplate[] = useMemo(() => templateData?.data || [], [templateData])

  const transferData: TransferItem[] = candidatesList.map((c) => ({
    key: c._id,
    title: `${c.name} (${c.email})`,
    description: `${c.technology} - ${c.level}`,
  }))

  const assessmentId = Form.useWatch('assessment', form)

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t._id === templateId) || null
    setSelectedTemplate(template)
    if (!template) {
      setPreviewText('')
      return
    }
    const candidates = selectedCandidates
      .map((id) => candidatesList.find((c) => c._id === id))
      .filter((c): c is CandidateBasic => !!c)
    const preview = template.body
      .replace(/\{candidateName\}/g, candidates.map((c) => c.name).join(', '))
      .replace(/\{position\}/g, assessmentId || 'Assessment')
    setPreviewText(preview)
  }

  useEffect(() => {
    if (!selectedTemplate) {
      setPreviewText('')
      return
    }
    const candidates = selectedCandidates
      .map((id) => candidatesList.find((c) => c._id === id))
      .filter((c): c is CandidateBasic => !!c)
    const preview = selectedTemplate.body
      .replace(/\{candidateName\}/g, candidates.map((c) => c.name).join(', '))
      .replace(/\{position\}/g, assessmentId || 'Assessment')
    setPreviewText(preview)
  }, [selectedCandidates, assessmentId, selectedTemplate, candidatesList])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (selectedCandidates.length === 0) {
        message.error('Please select at least one candidate')
        return
      }
      const res = await createAssignment({
        candidate: selectedCandidates,
        assessment: values.assessment,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        emailTemplate: values.emailTemplate,
      })
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        form.resetFields()
        setSelectedCandidates([])
        setSelectedTemplate(null)
        setPreviewText('')
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error creating assignment', placement: 'topRight', duration: 3 })
    }
  }

  const handleReset = () => {
    form.resetFields()
    setSelectedCandidates([])
    setSelectedTemplate(null)
    setPreviewText('')
  }

  return (
    <>
      {contextHolder}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex items-center">
          <Button
            type="text"
            icon={<ArrowLeft size={18} />}
            onClick={() => navigate('/dashboard/assessments/assignments')}
          />
          <Typography.Title level={3} className="!mb-0 ml-2">Assign Assessment</Typography.Title>
        </div>

        <Card>
        <Form form={form} layout="vertical" style={{ maxWidth: 800 }}>
          <Form.Item
            name="assessment"
            label="Assessment"
            rules={[{ required: true, message: 'Please select an assessment' }]}
          >
            <Select placeholder="Select assessment" showSearch filterOption={(input, option) =>
              (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
            }>
              {assessments.map((a) => (
                <Option key={a._id} value={a._id}>{a.title}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Select Candidates">
            <Transfer
              dataSource={transferData}
              titles={['Available Candidates', 'Selected Candidates']}
              targetKeys={selectedCandidates}
              onChange={(targetKeys) => setSelectedCandidates(targetKeys as string[])}
              render={(item) => item.title}
              showSearch
              filterOption={(inputValue, item) => item.title.toLowerCase().includes(inputValue.toLowerCase())}
              listStyle={{ width: 300, height: 300 }}
            />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select a due date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="emailTemplate"
            label="Email Template"
            rules={[{ required: true, message: 'Please select an email template' }]}
          >
            <Select placeholder="Select email template" onChange={handleTemplateChange}>
              {templates.map((t) => (
                <Option key={t._id} value={t._id}>{t.name}</Option>
              ))}
            </Select>
          </Form.Item>

          {previewText && (
            <Form.Item label="Preview">
              <TextArea rows={6} value={previewText} readOnly style={{ background: '#f5f5f5' }} />
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmit} loading={isPending}>
                Assign Assessment
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
        </Card>
      </motion.div>
    </>
  )
}
