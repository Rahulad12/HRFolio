import { Card, Skeleton, Empty } from 'antd'
import { Timeline, Typography } from 'antd'
import { Clock, ClockAlert, CheckCircle, XCircle, Ban, Send, FileEdit, Plus, ArrowRight, DraftingCompass } from 'lucide-react'
import dayjs from 'dayjs'
import { useCandidateActivityLogs } from '../lib/queries/candidate.queries'
import type { ActivityLog } from '../types/candidate.types'

const { Text } = Typography

function getActionIcon(action: string) {
  switch (action) {
    case 'created':
      return <Plus size={14} />
    case 'assigned':
      return <ArrowRight size={14} />
    case 'completed':
      return <CheckCircle size={14} />
    case 'passed':
      return <CheckCircle size={14} />
    case 'pending':
      return <ClockAlert size={14} />
    case 'cancelled':
      return <Ban size={14} />
    case 'failed':
      return <XCircle size={14} />
    case 'sent':
      return <Send size={14} />
    case 'draft':
      return <DraftingCompass size={14} />
    case 'accepted':
      return <CheckCircle size={14} />
    case 'rejected':
      return <XCircle size={14} />
    case 'updated':
      return <FileEdit size={14} />
    default:
      return <Clock size={14} />
  }
}

function getActionColor(action: string) {
  switch (action) {
    case 'assigned':
      return 'orange'
    case 'created':
      return '#193152'
    case 'completed':
      return 'green'
    case 'pending':
      return 'orange'
    case 'cancelled':
      return 'red'
    case 'failed':
      return 'red'
    case 'passed':
      return 'green'
    case 'sent':
      return 'blue'
    case 'draft':
      return '#F54A00'
    case 'accepted':
      return 'green'
    case 'rejected':
      return 'red'
    case 'updated':
      return '#F54A00'
    default:
      return 'gray'
  }
}

interface Props {
  candidateId?: string
}

export function CandidateTimeline({ candidateId }: Props) {
  const { data: candidateLogs, isLoading } = useCandidateActivityLogs(candidateId || '')
  const logs: ActivityLog[] = candidateLogs?.data || []

  return (
    <Card className="rounded-2xl shadow-sm" title="Activity Timeline">
      {isLoading ? (
        <Skeleton active />
      ) : logs.length === 0 ? (
        <Empty description="No activity logs found." />
      ) : (
        <Timeline
          mode="left"
          items={logs.map((log) => ({
            dot: (
              <span style={{ color: getActionColor(log.action), fontSize: 16 }}>
                {getActionIcon(log.action)}
              </span>
            ),
            label: (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(log.createdAt).format('MMM DD, YYYY h:mm A')}
              </Text>
            ),
            children: (
              <div className="flex flex-col">
                <Text strong className="capitalize">
                  {log.action} {log.entityType}
                </Text>
                {log?.metaData?.description && log.action === 'updated' ? (
                  <Text type="secondary">
                    Candidate is updated to{' '}
                    <span className="font-bold">{log?.metaData?.description}</span>
                  </Text>
                ) : (
                  <Text type="secondary" className="capitalize">
                    Candidate {log.action === 'deleted' ? 'was' : 'is'} in{' '}
                    <span className="font-bold">{log?.metaData?.description}</span> stage
                  </Text>
                )}
              </div>
            ),
          }))}
        />
      )}
    </Card>
  )
}
