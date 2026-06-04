import { useNavigate } from 'react-router-dom'
import { Save, X } from 'lucide-react'
import { Button, DatePicker, Form, Input, Select, TimePicker, message, Card } from 'antd'
import { PageHeader } from '@/shared/components/PageHeader'
import dayjs from 'dayjs'
import { useCreateInterview, useInterviewerList, useEligibleCandidates } from '../lib/queries/interview.queries'
import { makeCapitilized } from '@/shared/utils/string'

const { TextArea } = Input

export function InterviewSchedule() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const interviewType = Form.useWatch('type', form)

  const { mutateAsync: createInterview, isPending: createLoading } = useCreateInterview()
  const { data: candidatesData } = useEligibleCandidates()
  const { data: interviewersData } = useInterviewerList()

  const handleDraft = async () => {
    const payload = form.getFieldsValue()
    try {
      const res = await createInterview({
        ...payload,
        date: dayjs(payload.date),
        time: payload.time,
        status: 'draft',
      })
      if (res.success) {
        message.success('Interview saved as draft')
        navigate('/dashboard/interviews')
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      message.error(e?.data?.message || 'Failed to save draft')
    }
  }

  const onFinish = async (values: { candidate: string; interviewer: string; date: string; time: string; type: string; InterviewRound: string; meetingLink?: string; notes?: string }) => {
    try {
      const res = await createInterview({
        ...values,
        date: dayjs(values.date),
        time: values.time,
        status: 'scheduled',
      })
      if (res.success) {
        message.success('Interview scheduled successfully')
        navigate('/dashboard/interviews')
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      message.error(e?.data?.message || 'Failed to schedule interview')
    }
  }

  const candidateOptions = candidatesData?.data
    ?.filter(
      (c) =>
        c.progress?.assessment?.completed &&
        c.status !== 'rejected' &&
        c.status !== 'hired'
    )
    .map((c) => ({
      value: c._id,
      label: `${makeCapitilized(c.name)} - ${makeCapitilized(c.technology)} (${makeCapitilized(c.level)})`,
    }))

  return (
    <div>
      <PageHeader
        title="Schedule Interview"
        backPath="/dashboard/interviews"
      />

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Form.Item
              label="Candidate"
              name="candidate"
              rules={[{ required: true, message: 'Candidate is required' }]}
            >
              <Select
                placeholder="Select Candidate"
                showSearch
                options={candidateOptions}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              name="InterviewRound"
              label="Interview Round"
              rules={[{ required: true, message: 'Interview round is required' }]}
            >
              <Select placeholder="Select Interview Round" allowClear showSearch>
                <Select.Option value="first">First Interview</Select.Option>
                <Select.Option value="second">Second Interview</Select.Option>
                <Select.Option value="third">Third Interview</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Interviewer"
              name="interviewer"
              rules={[{ required: true, message: 'Interviewer is required' }]}
            >
              <Select
                placeholder="Select Interviewer"
                showSearch
                options={interviewersData?.data?.map((i) => ({ value: i._id, label: i.name }))}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[
                { required: true, message: 'Date is required' },
                {
                  validator: (_, value) => {
                    if (value && dayjs(value).isBefore(dayjs().startOf('day'))) {
                      return Promise.reject(new Error('Please select a future date'))
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <DatePicker
                className="w-full"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>

            <Form.Item
              label="Time Slot"
              name="time"
              rules={[
                { required: true, message: 'Time slot is required' },
                {
                  validator: (_, value) => {
                    const selectedDate = form.getFieldValue('date')
                    if (selectedDate && value && dayjs(dayjs(selectedDate).format('YYYY-MM-DD') + ' ' + dayjs(value).format('HH:mm')).isBefore(dayjs())) {
                      return Promise.reject(new Error('Please select a future time'))
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <TimePicker use12Hours showNow={false} className="w-full" />
            </Form.Item>

            <Form.Item
              label="Interview Type"
              name="type"
              rules={[{ required: true, message: 'Interview type is required' }]}
            >
              <Select placeholder="Select Interview Type" allowClear showSearch>
                <Select.Option value="in-person">In-Person Interview</Select.Option>
                <Select.Option value="video">Video Interview</Select.Option>
              </Select>
            </Form.Item>

            {interviewType === 'video' && (
              <Form.Item
                label="Meeting Link"
                name="meetingLink"
                rules={[
                  { required: true, message: 'Video link is required' },
                  { type: 'url', message: 'Please enter a valid URL' },
                ]}
              >
                <Input placeholder="Enter video link" />
              </Form.Item>
            )}

            <Form.Item label="Notes" name="notes">
              <TextArea rows={4} placeholder="Add any special instructions or topics to cover" />
            </Form.Item>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button icon={<X size={16} />} onClick={() => navigate('/dashboard/interviews')}>
              Cancel
            </Button>
            <Button icon={<Save size={16} />} onClick={handleDraft}>
              Draft
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<Save size={16} />}
              loading={createLoading}
              disabled={createLoading}
            >
              Schedule Interview
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}
