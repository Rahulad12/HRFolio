import { useState } from 'react'
import { Card, Tabs, Empty, Skeleton, Tag } from 'antd'
import { Clock, CheckCircle, AlertCircle, XCircle, Star } from 'lucide-react'
import dayjs from 'dayjs'
import { useAssessmentLogsByCandidate } from '@/modules/assessments/lib/queries/assessment.queries'
import { useInterviewLogsByCandidate } from '@/modules/interviews/lib/queries/interview.queries'
import { useOfferLogsByCandidate } from '@/modules/offers/lib/queries/offer.queries'
import type { AssessmentLog } from '@/modules/assessments/types/assessment.types'
import type { InterviewLog } from '@/modules/interviews/types/interview.types'
import type { OfferLog } from '@/modules/offers/types/offer.types'
import { useInterviewRounds, useInterviewStatuses } from '@/modules/lookup'
import { getLookupLabel, getLookupColor } from '@/shared/utils/lookup'

const getColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'text-blue-600'
    case 'completed':
      return 'text-green-600'
    case 'cancelled':
      return 'text-orange-600'
    case 'assigned':
      return 'text-amber-600'
    case 'failed':
      return 'text-red-600'
    case 'Passed':
      return 'text-green-600'
    case 'sent':
      return 'text-blue-600'
    case 'draft':
      return 'text-yellow-600'
    case 'accepted':
      return 'text-green-600'
    case 'rejected':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'scheduled':
      return <Clock size={18} className="text-blue-500" />
    case 'completed':
      return <CheckCircle size={18} className="text-green-500" />
    case 'cancelled':
      return <AlertCircle size={18} className="text-orange-500" />
    case 'failed':
      return <XCircle size={18} className="text-red-500" />
    default:
      return <Clock size={18} />
  }
}

interface Props {
  candidateId?: string
}

export function CandidateHistory({ candidateId }: Props) {
  const [activeTab, setActiveTab] = useState('assessments')

  const { data: interviewRounds } = useInterviewRounds()
  const { data: interviewStatuses } = useInterviewStatuses()

  const { data: assessmentLogRes, isLoading: assessmentLogLoading, isError: assessmentLogError } =
    useAssessmentLogsByCandidate(candidateId || '')
  const { data: interviewLogRes, isLoading: interviewLogLoading, isError: interviewLogError } =
    useInterviewLogsByCandidate(candidateId || '')
  const { data: offerLogRes, isLoading: offerLogLoading, isError: offerLogError } =
    useOfferLogsByCandidate(candidateId || '')

  const assessmentLogs: AssessmentLog[] = assessmentLogRes?.data || []
  const interviewLogs: InterviewLog[] = interviewLogRes?.data || []
  const offerLogs: OfferLog[] = offerLogRes?.data || []

  return (
    <Card className="rounded-2xl shadow-sm" title="Candidate History Logs">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={[
          {
            key: 'assessments',
            label: 'Assessments',
            children: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {assessmentLogLoading ? (
                  <Skeleton active className="mx-auto" />
                ) : assessmentLogError || assessmentLogs.length === 0 ? (
                  <Empty description="No assessments found." className="col-span-2" />
                ) : (
                  assessmentLogs.map((log) => (
                    <Card
                      key={log._id}
                      className="shadow-sm border rounded-lg"
                      size="small"
                      title={
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <span className="text-sm font-semibold">
                              {dayjs(log.performedAt).format('MMM DD, YYYY')}
                            </span>
                            <span className="text-xs text-gray-400">({log.action})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log?.details?.status)}
                            <span className={`capitalize text-sm font-medium ${getColor(log?.details?.status)}`}>
                              {dayjs(log.createdAt).format('h:mm A')}
                            </span>
                          </div>
                        </div>
                      }
                    >
                      <div className="space-y-1.5 text-sm">
                        <p>
                          <strong>Assessment:</strong>{' '}
                          <span className="capitalize">{log.assessment?.title}</span>
                        </p>
                        <p>
                          <strong>Type:</strong>{' '}
                          <span className="capitalize">{log.assessment?.type}</span>
                        </p>
                        <p>
                          <strong>Link:</strong>{' '}
                          <a href={log.assessment?.assessmentLink} target="_blank" rel="noopener noreferrer">
                            Open Assessment
                          </a>
                        </p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <span className={`capitalize ${getColor(log?.details?.status)}`}>
                            {log?.details?.status}
                          </span>
                        </p>
                        <p>
                          <strong>Due Date:</strong>{' '}
                          <span>{dayjs(log?.details?.dueDate).format('MMM DD, YYYY')}</span>
                        </p>
                        {log?.details?.score && (
                          <p>
                            <strong>Score:</strong>{' '}
                            <span className="text-green-600 font-semibold">{log?.details?.score}</span>
                          </p>
                        )}
                        {log?.details?.feedback && (
                          <p>
                            <strong>Feedback:</strong>{' '}
                            <span className="italic">"{log?.details?.feedback}"</span>
                          </p>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ),
          },
          {
            key: 'interviews',
            label: 'Interviews',
            children: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {interviewLogLoading ? (
                  <Skeleton active className="mx-auto" />
                ) : interviewLogError || interviewLogs.length === 0 ? (
                  <Empty description="No interviews found." className="col-span-2" />
                ) : (
                  interviewLogs.map((log) => (
                    <Card
                      key={log._id}
                      className="shadow-sm border rounded-lg"
                      size="small"
                      title={
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold flex gap-1">
                            {dayjs(log.performedAt).format('MMM DD, YYYY')}
                            <span className="text-gray-400">({log.action})</span>
                          </span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log?.details?.status)}
                            <span className={`capitalize text-sm font-medium ${getColor(log?.details?.status)}`}>
                              {dayjs(log.createdAt).format('h:mm A')}
                            </span>
                          </div>
                        </div>
                      }
                    >
                      <p className="mb-1">
                        <strong>Status:</strong>{' '}
                        <span className={`capitalize ${getColor(log?.details?.status)}`}>
                          {getLookupLabel(interviewStatuses, log?.details?.status ?? '')}
                        </span>
                      </p>
                      <p className="mb-1">
                        <strong>Type:</strong> {log?.details?.type}
                      </p>
                      {log?.details?.interviewRound && (
                        <p className="mb-1">
                          <strong>Round: </strong>
                          <Tag color={getLookupColor(interviewRounds, log?.details?.interviewRound ?? '')}>
                            {getLookupLabel(interviewRounds, log?.details?.interviewRound ?? '')}
                          </Tag>
                        </p>
                      )}
                      {log?.details?.feedback && (
                        <p className="mb-1">
                          <strong>Feedback:</strong>
                          <span className="italic"> "{log?.details?.feedback}"</span>
                        </p>
                      )}
                      {log?.details?.rating && (
                        <p className="flex items-center mb-1">
                          <strong className="mr-2">Rating:</strong>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={`mr-1 ${star <= log.details.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </p>
                      )}
                    </Card>
                  ))
                )}
              </div>
            ),
          },
          {
            key: 'offers',
            label: 'Offer',
            children: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {offerLogLoading ? (
                  <Skeleton active className="mx-auto" />
                ) : offerLogError || offerLogs.length === 0 ? (
                  <Empty description="No offers found." className="col-span-2" />
                ) : (
                  offerLogs.map((log) => (
                    <Card
                      key={log._id}
                      className="shadow-sm border rounded-lg"
                      size="small"
                      title={
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            <span className="text-sm font-semibold">
                              {dayjs(log.createdAt).format('MMM DD, YYYY')}
                            </span>
                            <span className="text-xs text-gray-400">({log.action})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log?.offer?.status)}
                            <span className={`capitalize text-sm font-medium ${getColor(log?.details?.status)}`}>
                              {dayjs(log.createdAt).format('h:mm A')}
                            </span>
                          </div>
                        </div>
                      }
                    >
                      <div className="space-y-1.5 text-sm">
                        <p>
                          <strong>Position:</strong>{' '}
                          <span className="capitalize">{log.offer?.position}</span>
                        </p>
                        <p>
                          <strong>Status:</strong>{' '}
                          <span className={`capitalize ${getColor(log?.details?.status)}`}>
                            {log?.details?.status}
                          </span>
                        </p>
                        <p>
                          <strong>Start Date:</strong>{' '}
                          <span>{dayjs(log?.offer?.startDate).format('MMM DD, YYYY')}</span>
                        </p>
                        <p>
                          <strong>Response Deadline:</strong>{' '}
                          <span>{dayjs(log?.offer?.responseDeadline).format('MMM DD, YYYY')}</span>
                        </p>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            ),
          },
        ]}
      />
    </Card>
  )
}
