import React from 'react';
import { Card, Timeline, Avatar, Typography, Spin, Empty } from 'antd';
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

    const getIcon = (type: string) => {
        const iconProps = { size: 16 };
        switch (type) {
            case 'new_candidate': return <UserPlus {...iconProps} />;
            case 'interview_scheduled': return <CalendarClock {...iconProps} />;
            case 'interview_completed': return <FileCheck {...iconProps} />;
            case 'assessment_completed': return <File {...iconProps} />;
            case 'offer_sent': return <Check {...iconProps} />;
            case 'offer_accepted': return <UserCheck {...iconProps} />;
            default: return <UserCheck {...iconProps} />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'new_candidate': return 'blue';
            case 'interview_scheduled': return 'purple';
            case 'interview_completed': return 'green';
            case 'assessment_completed': return 'orange';
            case 'offer_sent': return 'gold';
            case 'offer_accepted': return 'green';
            default: return 'gray';
        }
    };

    const sortedLog = [...(activityLog?.data || [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <Card
            title="Recent Activities"
            bodyStyle={{ padding: 16 }}
        >
            {logsLoading ? (
                <div className="flex justify-center items-center h-32">
                    <Spin size="large" />
                </div>
            ) : sortedLog.length === 0 ? (
                <Empty description="No recent activities" />
            ) : (
                <Timeline>
                    {sortedLog.map((item, index) => (
                        <Timeline.Item
                            key={index}
                            color={getColor(item?.action)}
                            dot={
                                <Avatar
                                    size={28}
                                    className="bg-white shadow-sm text-black flex items-center justify-center"
                                >
                                    {getIcon(item?.action)}
                                </Avatar>
                            }
                        >
                            <div className="flex flex-col gap-1">
                                <Text strong className="text-md">
                                    {item?.metaData?.candidate || 'Unknown Candidate'}
                                </Text>
                                <Text type="secondary">
                                    {makeCapitilized(item?.entityType)} was <b>{item?.action.replace('_', ' ')}</b>
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {dayjs(item?.createdAt).format('DD MMM YYYY, hh:mm A')}
                                </Text>
                            </div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            )}
        </Card>
    );
};

export default RecentActivityLog;
