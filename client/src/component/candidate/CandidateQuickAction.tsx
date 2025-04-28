import { Button, Card } from 'antd'
import { Calendar, FileCheck, FileText, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
const CandidateQuickAction = () => {
    const navigate = useNavigate();
    return (
        <Card title="Quick Actions" className="mb-6">
            <div className="space-y-3">
                <Button type="primary" block icon={<Calendar size={16} />} className="flex items-center justify-center" onClick={() => navigate('/dashboard/interviews/schedule')}>
                    Schedule Interview
                </Button>
                <Button block icon={<FileCheck size={16} />} className="flex items-center justify-center" onClick={() => navigate('/dashboard/assessments/assign')}>
                    Assign Assessment
                </Button>
                <Button block icon={<Mail size={16} />} className="flex items-center justify-center">
                    Send Email
                </Button>
                <Button block icon={<FileText size={16} />} className="flex items-center justify-center" onClick={() => navigate('/dashboard/offers/new')}>
                    Create Offer Letter
                </Button>
            </div>
        </Card>
    )
}

export default CandidateQuickAction
