import { Card, Timeline } from 'antd'

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
                    mode="left"
                    items={activities.map((item) => ({
                        color: item.color,
                        children: item.children,
                        timestamp: item.timestamp,
                    }))}
                />
            </Card>
        </div>
    )
}

export default RecentActivities
