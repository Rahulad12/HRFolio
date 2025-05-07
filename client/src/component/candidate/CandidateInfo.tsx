import { useAppSelector } from '../../Hooks/hook'
import { Card, Descriptions, Tag } from 'antd'
import { makeCapitilized } from '../../utils/TextAlter'
import React from 'react'
const CandidateInfo: React.FC = () => {
    const { candidate } = useAppSelector((state) => state.candidate)
    const profile = candidate?.[0]
    return (
        <Card title="Candidate Profile">
            <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }}>
                <Descriptions.Item label="Technology">
                    <Tag color="blue">{makeCapitilized(profile?.technology)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Level">
                    <Tag color="green">{makeCapitilized(profile?.level)}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Experience">
                    <span className="flex items-center gap-2">
                        {profile?.experience} years
                    </span>
                </Descriptions.Item>
                <Descriptions.Item label="Expected Salary">
                    <span className="flex items-center gap-2">
                        {profile?.expectedsalary.toLocaleString()}
                    </span>
                </Descriptions.Item>
            </Descriptions>
        </Card>
    )
}

export default CandidateInfo
