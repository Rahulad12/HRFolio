import { Card, Timeline } from 'antd'
import React from 'react'

const RecentActivities = () => {
    const activities = [
        {
            color: "green",
            children: "New candidate John Doe submitted CV",
            timestamp: "2 hours ago",
        },
        {
            color: "blue",
            children: "Technical assessment completed for Jane Smith",
            timestamp: "4 hours ago",
        },
        {
            color: "purple",
            children: "Interview scheduled with Mike Johnson",
            timestamp: "5 hours ago",
        },
    ];
    return (
        <div>
            <Card title="Recent Activity" className="bg-white rounded-lg shadow">
                <Timeline
                    items={activities.map((item) => ({
                        color: item.color,
                        children: (
                            <div className="flex justify-between items-center">
                                <span>{item.children}</span>
                                <span className="text-gray-500 text-sm">{item.timestamp}</span>
                            </div>
                        ),
                    }))}
                />
            </Card>
        </div>
    )
}

export default RecentActivities
