import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { Button, Card, Form, Input, message } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
import { useInterviewerById, useCreateInterviewer, useUpdateInterviewer } from '../lib/queries/interviewer.queries'


export function InterviewerForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const isEditing = !!id
  const { data: interviewerData } = useInterviewerById(id || '')
  const { mutateAsync: createInterviewer, isPending: createLoading } = useCreateInterviewer()
  const { mutateAsync: updateInterviewer, isPending: updateLoading } = useUpdateInterviewer()

  useEffect(() => {
    if (isEditing && interviewerData?.data) {
      form.setFieldsValue({
        name: interviewerData.data.name,
        email: interviewerData.data.email,
        department: interviewerData.data.department,
        position: interviewerData.data.position,
      })
    }
  }, [id, isEditing, form, interviewerData])

  const handleSubmit = async (values: { name: string; email: string; department: string; position: string }) => {
    try {
      if (isEditing && id) {
        const res = await updateInterviewer({ id, data: values })
        if (res.success) {
          message.success(res.message)
          navigate('/dashboard/interviewers')
        }
      } else {
        const res = await createInterviewer(values)
        if (res.success) {
          message.success(res.message)
          form.resetFields()
        }
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      message.error(e?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div>
      <PageHeader
        title={isEditing ? 'Edit Interviewer' : 'Add Interviewer'}
        backPath="/dashboard/interviewers"
      />

      <Card>
        <Form onFinish={handleSubmit} layout="vertical" form={form}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input interviewer name!' }]}
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input interviewer email!' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please input interviewer department!' }]}
            >
              <Input placeholder="Department" />
            </Form.Item>
            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: 'Please input interviewer position!' }]}
            >
              <Input placeholder="Position" />
            </Form.Item>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button icon={<X size={16} />} onClick={() => navigate('/dashboard/interviewers')}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<Save size={16} />}
              loading={createLoading || updateLoading}
              disabled={createLoading || updateLoading}
            >
              {isEditing ? 'Update Interviewer' : 'Save Interviewer'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
