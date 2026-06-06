import { Button, Row, Col, Skeleton, notification } from 'antd'
import { Edit } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/shared/components/PageHeader'
import { useCandidateById, useUpdateCandidateStatus } from './lib/queries/candidate.queries'
import { CandidateTable } from './components/CandidateTable'
import { CandidateInfo } from './components/CandidateInfo'
import { CandidateProgress } from './components/CandidateProgress'
import { CandidateQuickAction } from './components/CandidateQuickAction'
import { CandidateTimeline } from './components/CandidateTimeline'
import { CandidateHistory } from './components/CandidateHistory'
import { CandidateForm } from './components/CandidateForm'
import { CandidateSendEmail } from './components/CandidateSendEmail'


export function CandidateListPage() {
  return <CandidateTable />
}

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [api, contextHolder] = notification.useNotification()
  const { data, isLoading } = useCandidateById(id || '')
  const { mutateAsync: updateStatus, isPending: statusUpdating } = useUpdateCandidateStatus()
  const candidate = data?.data || null

  const handleReject = async () => {
    if (!id) return
    try {
      const res = await updateStatus({ id, status: 'rejected' })
      api.success({ message: res?.message || 'Candidate rejected', placement: 'topRight', duration: 3 })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error rejecting candidate', placement: 'topRight', duration: 3 })
    }
  }

  if (isLoading) return <Skeleton active />

  return (
    <div className="flex flex-col gap-3 space-y-6">
      {contextHolder}
      <PageHeader
        title="Candidate Details"
        backPath="/dashboard/candidates"
        rightContent={
          <Button
            type="primary"
            icon={<Edit size={16} />}
            onClick={() => navigate(`/dashboard/candidates/edit/${id}`)}
            disabled={statusUpdating}
          >
            Edit
          </Button>
        }
      />

      {/* Profile + Quick Actions */}
      <Row gutter={24}>
        <Col md={16} xs={24}>
          <CandidateInfo candidate={candidate} />
        </Col>
        <Col md={8} xs={24}>
          <CandidateQuickAction
            candidateId={candidate?._id}
            candidateName={candidate?.name}
            status={candidate?.status}
            onReject={handleReject}
            disableRejection={statusUpdating}
          />
        </Col>
      </Row>

      <CandidateProgress candidate={candidate} />

      <Row gutter={[16, 16]}>
        <Col md={16} xs={24} lg={16}>
          <CandidateHistory candidateId={candidate?._id} />
        </Col>
        <Col md={8} xs={24} lg={8}>
          <CandidateTimeline candidateId={candidate?._id} />
        </Col>
      </Row>
    </div>
  )
}

export function CandidateFormPage() {
  return <CandidateForm />
}

export function CandidateSendEmailPage() {
  return <CandidateSendEmail />
}
