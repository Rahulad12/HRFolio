import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, DatePicker, Form, Row, Select, Transfer, message, notification, Space } from 'antd'
import { X } from 'lucide-react'
import { PageHeader } from '@/shared/components/PageHeader'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import { useAssessmentList, useCreateAssignment, useCandidateBasicList, useEmailTemplateList } from '../lib/queries/assessment.queries'
import type { CandidateBasic, EmailTemplate } from '../types/assessment.types'

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

  const handlePreview = () => {
    const values = form.getFieldsValue()
    const selectedTemplate = templates.find((t) => t._id === values.emailTemplate)
    const selectedAssessment = assessments.find((a) => a._id === values.assessment)
    const candidateInfo = candidatesList.find((c) => selectedCandidates.includes(c._id))

    if (!selectedTemplate || !selectedAssessment || !candidateInfo) {
      setPreviewText('')
      return
    }

    const html = selectedTemplate.body
      .replace(/{{candidateName}}/g, candidateInfo.name)
      .replace(/{{technology}}/g, selectedAssessment.technology || '')
      .replace(/{{duration}}/g, selectedAssessment.duration?.toString() || '')
      .replace(/{{assessmentDate}}/g, selectedAssessment.createdAt ? dayjs(selectedAssessment.createdAt).format('MMMM D, YYYY') : '')
      .replace(/{{assessmentTime}}/g, selectedAssessment.createdAt ? dayjs(selectedAssessment.createdAt).format('hh:mm A') : '')
      .replace(/{{level}}/g, selectedAssessment.level || '')
      .replace(/{{assessmentLink}}/g, selectedAssessment.assessmentLink || '')

    setPreviewText(html)
  }

  useEffect(() => {
    if (selectedCandidates.length > 0) {
      handlePreview()
    } else {
      setPreviewText('')
    }
  }, [selectedCandidates])

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
        status: "assigned"
      })
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        form.resetFields()
        setSelectedCandidates([])
        setPreviewText('')
        navigate('/dashboard/assessments/assignments')
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error creating assignment', placement: 'topRight', duration: 3 })
    }
  }

  const handleReset = () => {
    form.resetFields()
    setSelectedCandidates([])
    setPreviewText('')
  }

  return (
    <>
      {contextHolder}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <PageHeader
          title="Assign Assessment"
          backPath="/dashboard/assessments/assignments"
        />

        <Row gutter={16}>
          <Col xs={24} md={12} lg={14}>
            <Card>
              <Form form={form} layout="vertical" onFinish={handleSubmit} onValuesChange={handlePreview}>
                <Form.Item
                  name="assessment"
                  label="Select Assessment"
                  rules={[{ required: true, message: 'Please select an assessment' }]}
                >
                  <Select placeholder="Select assessment" allowClear showSearch
                    options={assessments.map((a) => ({
                      value: a._id,
                      label: a.title,
                    }))}
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                  />
                </Form.Item>

                <Form.Item label="Select Candidates" required>
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

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="dueDate"
                      label="Due Date"
                      rules={[
                        { required: true, message: 'Please select a due date' },
                        {
                          validator: (_, value) =>
                            value && dayjs(value).isBefore(dayjs().startOf('day'))
                              ? Promise.reject(new Error('Due date cannot be in the past'))
                              : Promise.resolve(),
                        },
                      ]}
                    >
                      <DatePicker
                        style={{ width: '100%' }}
                        disabledDate={(current) => current && current < dayjs().startOf('day')}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="emailTemplate"
                      label="Email Template"
                      rules={[{ required: true, message: 'Please select an email template' }]}
                    >
                      <Select placeholder="Select email template" allowClear showSearch
                        options={templates
                          .filter((t) => t.type === 'assessment')
                          .map((t) => ({
                            value: t._id,
                            label: t.name,
                          }))}
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" loading={isPending}>
                      Assign
                    </Button>
                    <Button icon={<X size={16} />} onClick={handleReset}>
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={10}>
            <Card title="Email Preview">
              {previewText ? (
                <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(previewText) }} />
              ) : (
                <div className="text-center text-gray-500 py-6">
                  <p>Select a candidate, assessment, and email template to preview</p>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </motion.div>
    </>
  )
}
