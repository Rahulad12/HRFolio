import React from 'react';
import { Card, Avatar, Typography, Spin, Empty, Space } from 'antd';
import {
    UserPlus,
    CalendarClock,
    FileCheck,
    File,
    Check,
    UserCheck,
} from 'lucide-react';
import { useGetActivityLogsQuery } from '../../services/activityLogs';
import { makeCapitilized } from '../../utils/TextAlter';
import dayjs from 'dayjs';

const { Text } = Typography;

const RecentActivityLog: React.FC = () => {
    const { data: activityLog, isLoading: logsLoading } = useGetActivityLogsQuery();
    console.log(activityLog);

    const getIcon = (type: string) => {
        const iconProps = { size: 18 };
        switch (type) {
            case 'candidates': return <UserPlus {...iconProps} />;
            case 'interviews': return <CalendarClock {...iconProps} />;
            case 'interview_completed': return <FileCheck {...iconProps} />;
            case 'assessments': return <File {...iconProps} />;
            case 'offers': return <Check {...iconProps} />;
            case 'offer_accepted': return <UserCheck {...iconProps} />;
            default: return <UserCheck {...iconProps} />;
        }
    };

    const getColor = (type: string) => {
        console.log(type);
        switch (type) {
            case 'candidates': return '#1890ff'; // blue
            case 'interviews': return '#722ed1'; // purple
            case 'assessments': return '#fa8c16'; // orange
            case 'offers': return '#faad14'; // gold
            default: return '#d9d9d9'; // gray
        }
    };

    const sortedLog = [...(activityLog?.data || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <Card title="Recent Activities" bodyStyle={{ padding: 16 }}>
            {logsLoading ? (
                <div className="flex justify-center items-center h-32">
                    <Spin size="large" />
                </div>
            ) : sortedLog.length === 0 ? (
                <Empty description="No recent activities" />
            ) : (
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    {sortedLog.map((item, index) => (
                        <Card
                            key={index}
                            size="small"
                            style={{ borderLeft: `4px solid ${getColor(item?.entityType)}` }}
                        >
                            <div className="flex items-start gap-3">
                                <Avatar
                                    size={32}
                                    className="bg-white text-black flex items-center justify-center shadow-sm border"
                                >
                                    {getIcon(item?.entityType)}
                                </Avatar>
                                <div className="flex flex-col">
                                    <Text strong className="text-md">
                                        {item?.metaData?.title || 'Unknown Candidate'}
                                    </Text>
                                    <Text type="secondary">
                                        {makeCapitilized(item?.entityType)} was <b>{item?.action.replace('_', ' ')}</b>
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {dayjs(item?.createdAt).format('DD MMM YYYY, hh:mm A')}
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    ))}
                </Space>
            )}
        </Card>
    );
};

export default RecentActivityLog;
