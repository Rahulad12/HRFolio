import { Button, Card } from 'antd'
import { Calendar, FileCheck, FileText, Mail } from 'lucide-react'

const CandidateQuickAction = () => {
    return (
        <Card title="Quick Actions" className="mb-6">
            <div className="space-y-3">
                <Button type="primary" block icon={<Calendar size={16} />} className="flex items-center justify-center">
                    Schedule Interview
                </Button>
                <Button block icon={<FileCheck size={16} />} className="flex items-center justify-center">
                    Assign Assessment
                </Button>
                <Button block icon={<Mail size={16} />} className="flex items-center justify-center">
                    Send Email
                </Button>
                <Button block icon={<FileText size={16} />} className="flex items-center justify-center">
                    Create Offer Letter
                </Button>
            </div>
        </Card>
    )
}

export default CandidateQuickAction
