import { Steps, notification, Card, Typography, Select, Skeleton } from 'antd'
import { useUpdateCandidateStatus } from '../lib/queries/candidate.queries'
import type { Candidate, CandidateStatus } from '../types/candidate.types'
import { useCandidateStatuses } from '@/modules/lookup'

interface CandidateProgressProps {
  candidate: Candidate | null
  loading?: boolean
}

export function CandidateProgress({ candidate }: CandidateProgressProps) {
  const [api, contextHolder] = notification.useNotification()
  const { mutateAsync: updateStatus, isPending: statusUpdating } = useUpdateCandidateStatus()
  const { data: statusList = [], isLoading: statusLoading } = useCandidateStatuses()
  const StatusFlow = statusList
    .filter(s => s.isActive && s.systemName !== 'rejected')
    .sort((a, b) => a.order - b.order)
    .map(s => s.systemName as CandidateStatus)

  if (!candidate || statusLoading) return <Skeleton active />

  const currentStep = StatusFlow.indexOf(candidate.status)

  const canMoveToStatus = (targetStatus: CandidateStatus) => {
    if (targetStatus === candidate.status) return true
    const currentIndex = StatusFlow.indexOf(candidate.status)
    const targetIndex = StatusFlow.indexOf(targetStatus)
    if (targetStatus !== 'offered' && targetIndex > currentIndex + 1) return false
    if (targetStatus === 'offered') {
      const previousState = StatusFlow.slice(1, targetIndex)
      return previousState.some((stage) => candidate.progress?.[stage]?.completed === true)
    }
    const prevIndex = targetIndex - 1
    if (prevIndex >= 0) {
      return candidate.progress?.[StatusFlow[prevIndex]]?.completed === true
    }
    return true
  }

  const updateStatusHandler = async (newStatus: CandidateStatus) => {
    if (!canMoveToStatus(newStatus)) {
      api.error({
        message: 'You cannot skip steps! Complete the current stage first.',
        placement: 'topRight',
        duration: 3,
        showProgress: true,
      })
      return
    }
    try {
      const res = await updateStatus({ id: candidate._id, status: newStatus })
      api.success({
        message: res?.message || 'Status updated',
        placement: 'topRight',
        duration: 3,
        showProgress: true,
      })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({
        message: e?.data?.message || 'Error updating status',
        placement: 'topRight',
        duration: 3,
      })
    }
  }

  const statusOptions = StatusFlow.map((step) => ({
    value: step,
    label: statusList.find(s => s.systemName === step)?.displayName ?? step,
    disabled: !canMoveToStatus(step),
  }))

  return (
    <>
      {contextHolder}
      <Card className="rounded-2xl shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <Typography.Title level={5} className="!mb-0">
            Candidate Progress
          </Typography.Title>
          <Select
            placeholder="Update Status"
            className="w-40"
            onChange={(val) => updateStatusHandler(val as CandidateStatus)}
            options={statusOptions}
            value={candidate.status}
            loading={statusUpdating}
            disabled={statusUpdating}
          />
        </div>
        <Steps
          current={currentStep}
          responsive
          labelPlacement="vertical"
          size="small"
          onChange={(step) => {
            if (statusUpdating) return
            const newStatus = StatusFlow[step]
            if (canMoveToStatus(newStatus)) {
              updateStatusHandler(newStatus)
            } else {
              api.error({
                message: 'You cannot skip steps! Complete the current stage first.',
                placement: 'topRight',
                duration: 3,
              })
            }
          }}
        >
          {StatusFlow.map((step, index) => {
            const stepStatus =
              index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait'
            return (
              <Steps.Step
                key={step}
                title={statusList.find(s => s.systemName === step)?.displayName ?? step}
                status={stepStatus}
                disabled={!canMoveToStatus(step)}
              />
            )
          })}
        </Steps>
      </Card>
    </>
  )
}
