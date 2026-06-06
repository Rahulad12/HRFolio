import { useMemo, useState } from 'react'
import { Button, Card, Divider, Popconfirm, Space, Tag, Tooltip, Typography, notification, message } from 'antd'
import { Calendar, Check, Clock, Eye, Send, Trash2, Users, Phone, MapPin, Video } from 'lucide-react'
import dayjs from 'dayjs'
import { useInterviewList, useUpdateInterview, useDeleteInterview, useCreateInterview } from '../lib/queries/interview.queries'
import { InterviewDetailsModal } from './InterviewDetailsModal'
import type { Interview } from '../types/interview.types'
import type { Dayjs } from 'dayjs'
import { useInterviewRounds, useInterviewStatuses } from '@/modules/lookup'
import { getLookupLabel, getLookupColor } from '@/shared/utils/lookup'

const { Text } = Typography

interface InterviewListProps {
  searchTerm?: string
  interviewStatus?: string
  selectedDate?: Dayjs | null
}

export function InterviewList({ searchTerm = '', interviewStatus = '', selectedDate }: InterviewListProps) {
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)
  const [api, contextHolder] = notification.useNotification()

  const { data: interviewRounds } = useInterviewRounds()
  const { data: interviewStatuses } = useInterviewStatuses()

  const { data } = useInterviewList()
  const { mutateAsync: updateInterview } = useUpdateInterview()
  const { mutateAsync: deleteInterview } = useDeleteInterview()
  const { mutateAsync: createInterview } = useCreateInterview()

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone size={16} />
      case 'video': return <Video size={16} />
      case 'in-person': return <MapPin size={16} />
      default: return <Calendar size={16} />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'phone': return 'blue'
      case 'video': return 'purple'
      case 'in-person': return 'green'
      default: return 'default'
    }
  }

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview)
    setIsDetailsModalVisible(true)
  }

  const handleStatusUpdate = async (id: string, status: Interview['status']) => {
    try {
      const res = await updateInterview({ id, data: { status } })
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error updating status', placement: 'topRight', duration: 3 })
    }
  }

  const handleFeedbackSubmit = async (id: string, feedback: string, rating: number) => {
    try {
      const res = await updateInterview({ id, data: { feedback, rating } })
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        setIsDetailsModalVisible(false)
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error submitting feedback', placement: 'topRight', duration: 3 })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteInterview(id)
      if (res.success) {
        message.success(res.message)
      }
    } catch {
      message.error('Error deleting interview')
    }
  }

  const handleSendDraft = async (interview: Interview) => {
    try {
      const res = await createInterview({ ...interview, status: 'scheduled' })
      if (res.success) {
        message.success(res.message)
      }
    } catch {
      message.error('Error sending interview')
    }
  }

  const handleReschedule = async (interviewId: string, newDate: Dayjs, newTime: Dayjs) => {
    try {
      const res = await updateInterview({ id: interviewId, data: { date: newDate, time: newTime } })
      if (res.success) {
        message.success(res.message)
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      message.error(e?.data?.message || 'Error rescheduling interview')
    }
  }

  const filteredInterviews = useMemo(() => {
    const list = data?.data || []
    return list.filter((interview) => {
      const matchesSearch =
        searchTerm === '' ||
        interview.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !interviewStatus || interview.status === interviewStatus
      const matchesDate = !selectedDate || dayjs(interview.date).isSame(selectedDate, 'day')
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [data, searchTerm, interviewStatus, selectedDate])

  return (
    <div className="flex flex-col gap-3">
      {contextHolder}
      {filteredInterviews.map((interview) => (
        <Card
          key={interview._id}
          className="cursor-pointer transition-shadow hover:shadow-md"
          extra={
            <Space>
              <Tooltip title="View Interview">
                <Button type="link" onClick={() => handleViewDetails(interview)} icon={<Eye size={16} color="blue" />} />
              </Tooltip>
              {interview.status === 'scheduled' && (
                <Tooltip title="Mark as completed">
                  <Button
                    type="link"
                    onClick={() => handleStatusUpdate(interview._id, 'completed')}
                    icon={<Check size={16} color="green" />}
                  />
                </Tooltip>
              )}
              {interview.status === 'draft' && (
                <Tooltip title="Mark as scheduled">
                  <Button
                    type="link"
                    onClick={() => handleSendDraft(interview)}
                    icon={<Send size={16} color="green" />}
                  />
                </Tooltip>
              )}
              <Tooltip title="Delete">
                <Popconfirm
                  title="Delete this interview?"
                  onConfirm={() => handleDelete(interview._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<Trash2 size={16} />} danger />
                </Popconfirm>
              </Tooltip>
            </Space>
          }
        >
          <div className="flex justify-between">
            <div className="flex">
              <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-950 text-white">
                {getTypeIcon(interview.type)}
              </div>
              <div>
                <div className="flex items-center">
                  <Typography.Title
                    level={5}
                    className="m-0 mr-2 capitalize"
                    onClick={() => handleViewDetails(interview)}
                  >
                    {interview.candidate?.name}
                  </Typography.Title>
                  <Tag color={getTypeColor(interview.type)} className="capitalize">
                    {interview.type}
                  </Tag>
                  <Tag color={getLookupColor(interviewStatuses, interview.status)}>
                    {getLookupLabel(interviewStatuses, interview.status)}
                  </Tag>
                  <Tag color={getLookupColor(interviewRounds, interview.InterviewRound)}>
                    {getLookupLabel(interviewRounds, interview.InterviewRound)}
                  </Tag>
                </div>
                <Text type="secondary" className="capitalize">{interview.candidate?.level}</Text>
                <div className="mt-2 flex flex-wrap gap-3">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1 text-gray-500" />
                    <Text type="secondary">{dayjs(interview.date).format('MMM D, YYYY')}</Text>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-500" />
                    <Text type="secondary">{dayjs(interview.time).format('h:mm A')} (60 min)</Text>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1 text-gray-500" />
                    <Text type="secondary" className="capitalize">{interview.interviewer?.name}</Text>
                  </div>
                </div>
                {interview.meetingLink && (
                  <div className="mt-2">
                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Join Interview
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {interview.notes && (
            <div className="mt-3">
              <Divider plain>Scheduled Notes</Divider>
              <Text type="secondary">{interview.notes}</Text>
            </div>
          )}

          {interview.feedback && (
            <div className="mt-3">
              <Divider plain>Feedback</Divider>
              <Card className="p-3">
                <Text strong>Interview Feedback</Text>
                <Text type="secondary" className="block">{interview.feedback}</Text>
              </Card>
            </div>
          )}
        </Card>
      ))}

      <InterviewDetailsModal
        interview={selectedInterview}
        visible={isDetailsModalVisible}
        onClose={() => {
          setIsDetailsModalVisible(false)
          setSelectedInterview(null)
        }}
        onStatusUpdate={handleStatusUpdate}
        onFeedbackSubmit={handleFeedbackSubmit}
        onReschedule={handleReschedule}
      />
    </div>
  )
}
