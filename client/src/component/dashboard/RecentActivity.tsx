import { Card, Tag } from 'antd';
import React from 'react';

interface Activity {
  id: string;
  type: 'interview' | 'assessment' | 'offer' | 'candidate';
  title: string;
  description: string;
  date: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'interview':
      return 'bg-blue-100 text-blue-700';
    case 'assessment':
      return 'bg-purple-100 text-purple-700';
    case 'offer':
      return 'bg-green-100 text-green-700';
    case 'candidate':
      return 'bg-amber-100 text-amber-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getActivityLabel = (type: Activity['type']) => {
  switch (type) {
    case 'interview':
      return 'Interview';
    case 'assessment':
      return 'Assessment';
    case 'offer':
      return 'Offer';
    case 'candidate':
      return 'Candidate';
    default:
      return 'Activity';
  }
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  className = '',
}) => {
  return (
    <Card
      title="Recent Activity"
      className={className}
    >
      <div className="space-y-6">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex">
              <div className={`relative px-2 py-2 flex items-center justify-center rounded-md ${getActivityIcon(activity.type)}`}>
                <span className="h-2 w-2"></span>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <Tag color={
                    activity.type === 'interview' ? 'blue' :
                      activity.type === 'assessment' ? 'orange' :
                        activity.type === 'offer' ? 'success' : 'warning'
                  }>
                    {getActivityLabel(activity.type)}
                  </Tag>
                </div>
                <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.date} • {activity.time}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No recent activities</p>
        )}
      </div>
    </Card>
  );
};

export default RecentActivity;