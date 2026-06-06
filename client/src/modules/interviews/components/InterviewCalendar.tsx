import { useState } from 'react'
import { Badge, Calendar, Modal } from 'antd'
import dayjs from 'dayjs'
import { useInterviewList } from '../lib/queries/interview.queries'
import type { Dayjs } from 'dayjs'
import { useInterviewRounds, useInterviewStatuses } from '@/modules/lookup'
import { getLookupLabel } from '@/shared/utils/lookup'

export function InterviewCalendar() {
  const { data } = useInterviewList()
  const { data: interviewRounds } = useInterviewRounds()
  const { data: interviewStatuses } = useInterviewStatuses()
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [modalVisible, setModalVisible] = useState(false)

  const interviews = data?.data || []

  const getInterviewsForDate = (value: Dayjs) => {
    return interviews.filter((interview) => {
      const interviewDate = dayjs(interview.date)
      return (
        interviewDate.date() === value.date() &&
        interviewDate.month() === value.month() &&
        interviewDate.year() === value.year()
      )
    })
  }

  const dateCellRender = (value: Dayjs) => {
    const listData = getInterviewsForDate(value)
    return (
      <ul
        className="m-0 max-h-12 cursor-pointer overflow-hidden p-0"
        onClick={() => {
          setSelectedDate(value)
          setModalVisible(true)
        }}
      >
        {listData.slice(0, 2).map((interview) => (
          <li key={interview._id} className="mb-1">
            <Badge
              status={
                interview.status === 'scheduled'
                  ? 'processing'
                  : interview.status === 'completed'
                    ? 'success'
                    : interview.status === 'cancelled'
                      ? 'error'
                      : 'default'
              }
              text={
                <span className="block w-full truncate text-xs">
                  {dayjs(interview.time).format('HH:mm')} - {interview.candidate?.name}
                </span>
              }
            />
          </li>
        ))}
        {listData.length > 2 && (
          <li className="text-xs italic text-gray-400">+ {listData.length - 2} more</li>
        )}
      </ul>
    )
  }

  return (
    <div>
      <Calendar cellRender={dateCellRender} className="interview-calendar" />

      <Modal
        title={`Interviews on ${selectedDate?.format('MMMM D, YYYY')}`}
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <ul className="max-h-96 space-y-3 overflow-y-auto">
          {selectedDate &&
            getInterviewsForDate(selectedDate).map((interview) => (
              <li key={interview._id} className="flex items-start gap-2">
                <Badge
                  status={
                    interview.status === 'scheduled'
                      ? 'processing'
                      : interview.status === 'completed'
                        ? 'success'
                        : interview.status === 'cancelled'
                          ? 'error'
                          : 'default'
                  }
                />
                <div>
                  <div className="text-sm font-medium">
                    {dayjs(interview.time).format('HH:mm')} - {interview.candidate?.name}
                  </div>
                  <div className="text-xs capitalize text-gray-500">
                    Status: {getLookupLabel(interviewStatuses, interview.status)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Interview Round: {getLookupLabel(interviewRounds, interview.InterviewRound)}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </Modal>
    </div>
  )
}
