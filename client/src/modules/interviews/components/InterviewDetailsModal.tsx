import { useState } from 'react'
import {
  Modal, Descriptions, Tag, Timeline, Button, Form, Input, Rate, Divider,
  Typography, Popconfirm, TimePicker, DatePicker, message,
} from 'antd'
import { Calendar, Clock, Users, Phone, MapPin, FileText } from 'lucide-react'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { makeCapitilized } from '@/shared/utils/string'
import type { Interview } from '../types/interview.types'

const { TextArea } = Input
const { Title } = Typography

interface InterviewDetailsModalProps {
  interview: Interview | null
  visible: boolean
  onClose: () => void
  onStatusUpdate: (id: string, status: Interview['status']) => void
  onFeedbackSubmit: (id: string, feedback: string, rating: number) => void
  onReschedule: (id: string, date: Dayjs, time: Dayjs) => void
}

export function InterviewDetailsModal({
  interview,
  visible,
  onClose,
  onStatusUpdate,
  onFeedbackSubmit,
  onReschedule,
}: InterviewDetailsModalProps) {
  const [feedbackForm] = Form.useForm()
  const [rescheduleForm] = Form.useForm()
  const [isRescheduledModalOpen, setIsRescheduledModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const getTypeIcon = (type: string | undefined) => {
    switch (type) {
      case 'phone': return <Phone size={16} />
      case 'video': return null
      case 'in-person': return <MapPin size={16} />
      default: return null
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'scheduled': return 'blue'
      case 'completed': return 'green'
      case 'cancelled': return 'red'
      case 'failed': return 'orange'
      default: return 'default'
    }
  }

  const handleFeedbackSubmit = () => {
    feedbackForm.validateFields().then((values) => {
      onFeedbackSubmit(interview?._id || '', values.feedback, values.rating)
      feedbackForm.resetFields()
    })
  }

  const handleRescheduleSubmit = async () => {
    setLoading(true)
    try {
      const values = await rescheduleForm.validateFields()
      onReschedule(interview?._id || '', values.date, values.time)
      setIsRescheduledModalOpen(false)
      rescheduleForm.resetFields()
    } catch {
      message.error('Please fill both fields correctly')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Modal
        title={
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-center">
                <Title className="m-0 font-semibold capitalize" level={4}>
                  {interview?.candidate?.name}
                </Title>
              </div>
              <p className="mt-1 text-sm capitalize text-gray-500">{interview?.candidate?.level}</p>
            </div>
            <Tag color={getStatusColor(interview?.status)} className="uppercase">
              {interview?.status}
            </Tag>
          </div>
        }
        open={visible}
        onCancel={onClose}
        width={800}
        footer={null}
      >
        <div
          className="space-y-6"
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item
              label={
                <div className="flex items-center">
                  <Calendar size={14} className="mr-2" />
                  Date
                </div>
              }
            >
              {dayjs(interview?.date).format('MMMM D, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <div className="flex items-center">
                  <Clock size={14} className="mr-2" />
                  Time
                </div>
              }
            >
              {dayjs(interview?.time).format('h:mm A')} (60 minutes)
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <div className="flex items-center">
                  <Users size={14} className="mr-2" />
                  Interviewers
                </div>
              }
              span={2}
            >
              {interview?.interviewer?.name}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <div className="flex items-center">
                  {getTypeIcon(interview?.type)}
                  Type
                </div>
              }
              span={2}
            >
              {makeCapitilized(interview?.type || '')} Interview
            </Descriptions.Item>
            {interview?.notes && (
              <Descriptions.Item
                label={
                  <div className="flex items-center">
                    <FileText size={14} className="mr-2" />
                    Notes
                  </div>
                }
                span={2}
              >
                {interview?.notes}
              </Descriptions.Item>
            )}
          </Descriptions>

          {interview?.status === 'scheduled' && (
            <div>
              <Divider>Update Status</Divider>
              <div className="flex flex-wrap justify-center gap-2">
                <Button
                  type="primary"
                  style={{ backgroundColor: '#1E8449' }}
                  onClick={() => onStatusUpdate(interview._id, 'completed')}
                >
                  Mark as Completed
                </Button>
                <Popconfirm
                  title="Cancel this interview?"
                  onConfirm={() => onStatusUpdate(interview._id, 'cancelled')}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" style={{ backgroundColor: '#D68910' }}>
                    Cancel Interview
                  </Button>
                </Popconfirm>
                <Button danger onClick={() => onStatusUpdate(interview._id, 'failed')}>
                  Failed
                </Button>
                <Popconfirm
                  title="Reschedule this interview?"
                  onConfirm={() => setIsRescheduledModalOpen(true)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary" loading={loading}>
                    Reschedule
                  </Button>
                </Popconfirm>
              </div>
            </div>
          )}

          {interview?.status === 'completed' &&
            (interview?.feedback ? (
              <div>
                <Divider>Feedback</Divider>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="m-0 text-gray-600">{interview.feedback}</p>
                </div>
              </div>
            ) : (
              <div>
                <Divider>Add Feedback</Divider>
                <Form form={feedbackForm} layout="vertical">
                  <Form.Item
                    name="rating"
                    label="Rating"
                    rules={[{ required: true, message: 'Please rate the interview' }]}
                  >
                    <Rate />
                  </Form.Item>
                  <Form.Item
                    name="feedback"
                    label="Feedback"
                    rules={[{ required: true, message: 'Please provide feedback' }]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Provide detailed feedback about the candidate's performance..."
                    />
                  </Form.Item>
                  <div className="flex justify-end">
                    <Button type="primary" onClick={handleFeedbackSubmit}>
                      Submit Feedback
                    </Button>
                  </div>
                </Form>
              </div>
            ))}

          <div>
            <Divider>Interview Timeline</Divider>
            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <div>
                      Interview Scheduled
                      <p className="text-sm text-gray-500">
                        {dayjs(interview?.createdAt).format('MMMM D, YYYY h:mm A')}
                      </p>
                    </div>
                  ),
                },
                ...(interview?.status !== 'scheduled'
                  ? [
                      {
                        color:
                          interview?.status === 'completed'
                            ? 'green'
                            : interview?.status === 'cancelled'
                              ? 'red'
                              : 'blue',
                        children: (
                          <div>
                            Interview {makeCapitilized(interview?.status || '')}
                            <p className="text-sm text-gray-500">
                              {dayjs(interview?.updatedAt).format('MMMM D, YYYY h:mm A')}
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
                ...(interview?.feedback
                  ? [
                      {
                        color: 'blue',
                        children: (
                          <div>
                            Feedback Added
                            <p className="text-sm text-gray-500">
                              {dayjs(interview?.updatedAt).format('MMMM D, YYYY h:mm A')}
                            </p>
                          </div>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Reschedule Interview"
        open={isRescheduledModalOpen}
        onCancel={() => setIsRescheduledModalOpen(false)}
        footer={null}
      >
        <Form form={rescheduleForm} layout="vertical">
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
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            label="Time Slot"
            name="time"
            rules={[
              { required: true, message: 'Time slot is required' },
              {
                validator: (_, value) => {
                  const selectedDate = rescheduleForm.getFieldValue('date')
                  if (selectedDate && value && dayjs(selectedDate).hour(value.hour()).minute(value.minute()).isBefore(dayjs())) {
                    return Promise.reject(new Error('Please select a future time'))
                  }
                  return Promise.resolve()
                },
              },
            ]}
          >
            <TimePicker format="h:mm A" showNow={false} className="w-full" />
          </Form.Item>
          <div className="flex justify-end">
            <Button type="primary" onClick={handleRescheduleSubmit}>
              Reschedule
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}
