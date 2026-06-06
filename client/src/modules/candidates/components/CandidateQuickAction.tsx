import { useState } from 'react'
import { Button, Card, Modal } from 'antd'
import { Calendar, FileCheck, FileText, Mail, Ban, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { RaiseEscalationModal } from '../../escalations'
import { useAuth } from '@/shared/hooks/useAuth'
import { useTeamByRole } from '@/modules/user-management'

interface CandidateQuickActionProps {
  candidateId?: string
  candidateName?: string
  status?: string
  onReject?: () => void
  disableRejection?: boolean
}

export function CandidateQuickAction({
  candidateId,
  candidateName = 'Unknown',
  status,
  onReject,
  disableRejection,
}: CandidateQuickActionProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [escalationModalOpen, setEscalationModalOpen] = useState(false)
  const { data: hrAdminsData } = useTeamByRole('HR Admin')

  const isHR = user?.role === 'HR'
  const hrAdmins = (hrAdminsData?.data || []).map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
  }))

  const rejectHandler = () => {
    Modal.confirm({
      title: 'Are you sure you want to reject this candidate?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: onReject,
    })
  }

  return (
    <>
      <Card title="Quick Actions" className="mb-6">
        <div className="space-y-3">
          <Button
            block
            icon={<FileCheck size={16} />}
            className="flex items-center justify-center"
            onClick={() => navigate('/dashboard/assessments/assign')}
          >
            Assign Assessment
          </Button>
          <Button
            type="primary"
            block
            icon={<Calendar size={16} />}
            className="flex items-center justify-center"
            onClick={() => navigate('/dashboard/interviews/schedule')}
          >
            Schedule Interview
          </Button>
          <Button
            block
            icon={<FileText size={16} />}
            className="flex items-center justify-center"
            onClick={() => navigate('/dashboard/offers/new')}
          >
            Create Offer Letter
          </Button>
          <Button
            block
            icon={<Mail size={16} />}
            className="flex items-center justify-center"
            onClick={() => navigate(`/dashboard/candidates/email/${candidateId}`)}
          >
            Send Email
          </Button>
          {isHR && (
            <Button
              block
              icon={<AlertCircle size={16} />}
              className="flex items-center justify-center"
              onClick={() => setEscalationModalOpen(true)}
            >
              Raise Escalation
            </Button>
          )}
          <Button
            danger
            block
            icon={<Ban size={16} />}
            className="flex items-center justify-center"
            onClick={rejectHandler}
            disabled={disableRejection || status === 'rejected'}
          >
            Reject Candidate
          </Button>
        </div>
      </Card>

      {/* Escalation Modal */}
      <RaiseEscalationModal
        open={escalationModalOpen}
        onClose={() => setEscalationModalOpen(false)}
        candidateId={candidateId || ''}
        candidateName={candidateName}
        hrAdmins={hrAdmins}
        onSuccess={() => setEscalationModalOpen(false)}
      />
    </>
  )
}
