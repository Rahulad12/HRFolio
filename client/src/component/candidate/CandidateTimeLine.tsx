import { Timeline, Typography, Skeleton, Empty, Card } from "antd";
import { useAppSelector } from "../../Hooks/hook";
import { useGetActivityLogByCandidateIdQuery } from "../../services/activityLogs";
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

const { Text } = Typography;

const getStatusColor = (status: string) => {
    switch (status) {
        case "assigned":
            return "blue";
        case "completed":
            return "green";
        case "pending":
            return "orange";
        case "cancelled":
            return "red";
        default:
            return "gray";
    }
};

const CandidateTimeLine = () => {
    const { candidate } = useAppSelector((state) => state.candidate);

    const { data: candidateLogs, isLoading } = useGetActivityLogByCandidateIdQuery(candidate?.[0]?._id, {
        skip: !candidate?.[0]?._id,
    });
    console.log(candidateLogs);
    const logs = candidateLogs?.data || [];

    return (
        <Card
            title="Activity Timeline"
        >
            {isLoading ? (
                <Skeleton active />
            ) : logs.length === 0 ? (
                <Empty description="No activity logs found." />
            ) : (
                <Timeline
                    mode="left"
                    items={logs.map((log) => ({
                        dot: <ClockCircleOutlined style={{ fontSize: '16px', color: getStatusColor(log.metaData?.status) }} />,
                        label: dayjs(log.createdAt).format('MMM DD, YYYY h:mm A'),
                        children: (
                            <div>
                                <Text strong className="capitalize">
                                    {log.action} {log.entityType}
                                </Text>
                                <div>
                                </div>
                            </div>
                        ),
                    }))}
                />
            )}
        </Card>
    );
};

export default CandidateTimeLine;
