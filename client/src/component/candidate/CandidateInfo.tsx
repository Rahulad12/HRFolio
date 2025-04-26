import { useAppSelector } from '../../Hooks/hook'
import { Descriptions, Tag } from 'antd'
import { Briefcase, DollarSign } from 'lucide-react'
import { makeCapitilized } from '../../utils/TextAlter'
const CandidateInfo = () => {
    const { candidate } = useAppSelector((state) => state.candidate)
    const profile = candidate?.[0]
    return (
        <div>
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
                <Descriptions.Item label="Technology">
                    <Tag color="blue">{makeCapitilized(profile?.technology)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Level">
                    <Tag color="green">{makeCapitilized(profile?.level)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Experience">
                    <span className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {profile?.experience} years
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="Expected Salary">
                    <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        ${profile?.expectedsalary.toLocaleString()}
                    </span>
                </Descriptions.Item>
            </Descriptions>
        </div>
    )
}

export default CandidateInfo
