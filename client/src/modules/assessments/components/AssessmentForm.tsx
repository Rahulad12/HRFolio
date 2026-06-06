import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Form, Input, InputNumber, Select, message } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
import { useCreateAssessment, useUpdateAssessment, useAssessmentById } from '../lib/queries/assessment.queries'
import { assessmentSchema } from '../schemas/assessment.schema'
import { zodResolver } from '@/shared/lib/zod-resolver'
import type { AssessmentFormData, AssessmentType } from '../types/assessment.types'


const assessmentTypes: AssessmentType[] = ["behavioural","technical"]
const technologies = ['React', 'Node.js', 'Angular', 'Vue.js', 'Python', 'Java', '.NET', 'DevOps', 'Database', 'Other']
const levels = ['Beginner', 'Intermediate', 'Advanced']

export function AssessmentForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm<AssessmentFormData>()

  const isEditing = !!id
  const { data: assessmentData } = useAssessmentById(id || '')
  const { mutateAsync: createAssessment, isPending: isCreating } = useCreateAssessment()
  const { mutateAsync: updateAssessment, isPending: isUpdating } = useUpdateAssessment()

  useEffect(() => {
    if (isEditing && assessmentData?.data) {
      form.setFieldsValue({
        title: assessmentData.data.title,
        type: assessmentData.data.type,
        technology: assessmentData.data.technology,
        level: assessmentData.data.level,
        assessmentLink: assessmentData.data.assessmentLink,
        duration: assessmentData.data.duration,
      })
    } else if (!isEditing) {
      form.resetFields()
    }
  }, [id, isEditing, form, assessmentData])

  const handleSubmit = async () => {
    try {
      const values = await zodResolver(assessmentSchema, form.getFieldsValue())
      let res: { success: boolean; message: string }
      if (isEditing) {
        res = await updateAssessment({ id: id!, data: values })
      } else {
        res = await createAssessment(values)
      }
      if (res.success) {
        message.success(res.message)
        navigate('/dashboard/assessments')
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
        title={isEditing ? 'Edit Assessment' : 'New Assessment'}
        backPath="/dashboard/assessments"
      />

      <Card>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Assessment name is required' }]}>
            <Input placeholder="Enter assessment title" />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: 'Type is required' }]}>
            <Select placeholder="Select type">
              {assessmentTypes.map((t) => (
                <Select.Option key={t} value={t} className="capitalize">{t}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="technology" label="Technology" rules={[{ required: true, message: 'Technology is required' }]}>
            <Select placeholder="Select technology" showSearch>
              {technologies.map((t) => (
                <Select.Option key={t} value={t}>{t}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="level" label="Level" rules={[{ required: true, message: 'Level is required' }]}>
            <Select placeholder="Select level">
              {levels.map((l) => (
                <Select.Option key={l} value={l}>{l}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="assessmentLink" label="Assessment Link" rules={[{ required: true, message: 'Link is required' }, { type: 'url', message: 'Enter a valid URL' }]}>
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true, message: 'Duration is required' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter duration in minutes" />
          </Form.Item>

          <div className="mt-6 flex justify-end space-x-3">
            <Button onClick={() => navigate('/dashboard/assessments')}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreating || isUpdating}
              disabled={isCreating || isUpdating}
            >
              {isEditing ? 'Update Assessment' : 'Create Assessment'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
