import React from 'react';
import { Card, List, Avatar, Button, Typography } from 'antd';
import {
    UserPlus,
    UserCheck,
    CalendarClock,
    FileCheck,
    File,
    Check,
} from 'lucide-react';

const { Text } = Typography;

interface Activity {
    id: string;
    type: 'new_candidate' | 'interview_scheduled' | 'assessment_completed' | 'offer_sent' | 'offer_accepted' | 'interview_completed';
    description: string;
    timestamp: string;
}

const RecentActivityLog: React.FC = () => {
    const activities: Activity[] = [
        {
            id: '1',
            type: 'offer_accepted',
            description: 'John Doe accepted the Frontend Developer offer',
            timestamp: '2 hours ago',
        },
        {
            id: '2',
            type: 'interview_completed',
            description: 'Jane Smith completed second interview for Backend Developer',
            timestamp: '5 hours ago',
        },
        {
            id: '3',
            type: 'assessment_completed',
            description: 'Technical assessment completed by Mike Johnson',
            timestamp: 'Yesterday',
        },
        {
            id: '4',
            type: 'new_candidate',
            description: 'Sarah Williams applied for UX Designer position',
            timestamp: '2 days ago',
        },
        {
            id: '5',
            type: 'offer_sent',
            description: 'Offer sent to Tom Harris for Product Manager position',
            timestamp: '3 days ago',
        },
    ];

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_candidate':
                return <UserPlus size={20} />;
            case 'interview_scheduled':
            case 'interview_completed':
                return <CalendarClock size={20} />;
            case 'assessment_completed':
                return <FileCheck size={20} />;
            case 'offer_sent':
                return <File size={20} />;
            case 'offer_accepted':
                return <Check size={20} />;
            default:
                return <UserCheck size={20} />;
        }
    };

    const getIconBgColor = (type: string) => {
        switch (type) {
            case 'new_candidate':
                return 'bg-blue-500';
            case 'interview_scheduled':
                return 'bg-purple-500';
            case 'interview_completed':
                return 'bg-indigo-500';
            case 'assessment_completed':
                return 'bg-orange-500';
            case 'offer_sent':
                return 'bg-yellow-500';
            case 'offer_accepted':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card
            title="Recent Activities"
            extra={<Button type="link">View All</Button>}
            className="h-full"
        >
            <List
                itemLayout="horizontal"
                dataSource={activities}
                renderItem={(item) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    icon={getIcon(item.type)}
                                    className={`${getIconBgColor(item.type)} text-white flex items-center justify-center`}
                                />
                            }
                            title={item.description}
                            description={<Text type="secondary">{item.timestamp}</Text>}
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default RecentActivityLog;