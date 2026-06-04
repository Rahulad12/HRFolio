import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MinusCircle, PlusCircle, X } from 'lucide-react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Upload, Card } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
import dayjs from 'dayjs'
import { useCandidateById, useCreateCandidate, useUpdateCandidate, useUploadResume } from '../lib/queries/candidate.queries'
import type { CandidateFormData } from '../types/candidate.types'


const technologyOptions = [
  { value: 'react', label: 'React' },
  { value: 'dot net', label: 'Dot Net' },
  { value: 'devops', label: 'DevOps' },
  { value: 'qa', label: 'QA' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'others', label: 'Others' },
]

const levelOptions = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
]

export function CandidateForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [resumeUrl, setResumeUrl] = useState('')

  const isEditing = !!id
  const { data: candidate, isLoading: candidateLoading } = useCandidateById(id || '')
  const { mutateAsync: createCandidate, isPending: createLoading } = useCreateCandidate()
  const { mutateAsync: updateCandidate, isPending: updateLoading } = useUpdateCandidate()
  const { mutateAsync: uploadResume, isPending: uploadLoading } = useUploadResume()

  useEffect(() => {
    if (id && candidate?.data) {
      form.setFieldsValue({
        name: candidate.data.name,
        email: candidate.data.email,
        phone: candidate.data.phone,
        level: candidate.data.level,
        technology: candidate.data.technology,
        experience: candidate.data.experience,
        expectedsalary: candidate.data.expectedsalary,
        applieddate: candidate.data.applieddate ? dayjs(candidate.data.applieddate) : null,
        references: candidate.data.references,
      })
      setResumeUrl(candidate.data.resume)
    }
  }, [id, candidate, form])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResumeUpload = async (options: any) => {
    const { onSuccess, onError, file } = options
    const formData = new FormData()
    if (file) formData.append('resume', file as Blob)

    try {
      const response = await uploadResume(formData)
      if (response?.success) {
        setResumeUrl(response.url)
        onSuccess(response, file)
        message.success(response.message)
      } else {
        onError('Failed to upload resume')
        message.error(response.message)
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      onError(err)
      message.error(e?.message || 'Failed to upload resume')
    }
  }

  const onFinish = async (formData: CandidateFormData) => {
    if (!resumeUrl) {
      message.error('Please upload a resume before submitting.')
      return
    }
    const payload = {
      ...formData,
      name: formData.name.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      experience: Number(formData.experience),
      expectedsalary: Number(formData.expectedsalary),
      applieddate: formData.applieddate ? dayjs(formData.applieddate).format('YYYY-MM-DD') : null,
      resume: resumeUrl,
    }
    try {
      if (isEditing && id) {
        const res = await updateCandidate({ id, data: payload })
        if (res.success) {
          message.success(res.message)
          navigate('/dashboard/candidates')
        }
      } else {
        const res = await createCandidate(payload)
        if (res.success) {
          message.success(res.message)
          form.resetFields()
          setResumeUrl('')
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
        title={isEditing ? 'Edit Candidate' : 'Add New Candidate'}
        backPath="/dashboard/candidates"
      />

      <Card loading={candidateLoading && isEditing}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter candidate name' }]}
              >
                <Input size="large" placeholder="John Doe" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input size="large" placeholder="example@example.com" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { pattern: /^[0-9]{10}$/, message: 'Enter a valid 10-digit phone number' },
                ]}
              >
                <Input size="large" placeholder="9876543210" maxLength={10} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="technology"
                label="Technology"
                rules={[{ required: true, message: 'Please select technology' }]}
              >
                <Select
                  size="large"
                  placeholder="Select technology"
                  showSearch
                  allowClear
                  options={technologyOptions}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: 'Please select level' }]}
              >
                <Select
                  size="large"
                  placeholder="Select level"
                  showSearch
                  allowClear
                  options={levelOptions}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="experience"
                label="Experience (years)"
                rules={[{ required: true, message: 'Please enter experience' }]}
              >
                <InputNumber min={0} max={50} size="large" placeholder="Years of experience" style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="expectedsalary"
                label="Expected Salary"
                rules={[{ required: true, message: 'Please enter expected salary' }]}
              >
                <InputNumber
                  min={0}
                  size="large"
                  placeholder="Expected salary"
                  formatter={(value) =>
                    `$ ${value || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value: string | undefined) => Number(String(value ?? '').replace(/[$\s,]/g, '') || 0)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="applieddate"
                label="Applied Date"
                rules={[{ required: true, message: 'Please select applied date' }]}
              >
                <DatePicker
                  size="large"
                  placeholder="Applied date"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="CV Upload">
                <Upload
                  maxCount={1}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  customRequest={handleResumeUpload}
                  showUploadList
                  fileList={
                    resumeUrl
                      ? [
                          {
                            uid: '-1',
                            name: resumeUrl.split('/').pop() || 'Resume',
                            status: 'done',
                            url: resumeUrl,
                          },
                        ]
                      : []
                  }
                  onRemove={() => setResumeUrl('')}
                >
                  <Button icon={<UploadOutlined />} type="dashed" size="large" loading={uploadLoading}>
                    Click to Upload CV
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="references">
            {(fields, { add, remove }) => (
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">References</h3>
                  <Button
                    type="dashed"
                    icon={<PlusCircle className="h-4 w-4" />}
                    onClick={() => add()}
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                  >
                    Add Reference
                  </Button>
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    className="relative rounded-lg border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <Form.Item {...restField} name={[name, 'name']} label="Name">
                        <Input placeholder="Reference name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'contact']}
                        label="Contact"
                        rules={[
                          { pattern: /^[0-9]{10}$/, message: 'Enter a valid 10-digit phone number' },
                        ]}
                      >
                        <Input placeholder="Contact info" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'relation']} label="Relation">
                        <Input placeholder="Relation" />
                      </Form.Item>
                    </div>

                    <Button
                      type="text"
                      danger
                      icon={<MinusCircle className="h-5 w-5" />}
                      onClick={() => remove(name)}
                      className="absolute right-4 top-4"
                    >
                      Remove
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </Form.List>

          <div className="mt-8 flex justify-end space-x-4">
            <Button icon={<X size={16} />} onClick={() => navigate('/dashboard/candidates')}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading || updateLoading}
              disabled={createLoading || updateLoading}
            >
              {isEditing ? 'Edit Candidate' : 'Submit Candidate'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
