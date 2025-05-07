import { Timeline, Typography, Skeleton, Empty, Card } from "antd";
import { useAppSelector } from "../../Hooks/hook";
import { useGetActivityLogByCandidateIdQuery } from "../../services/activityLogs";
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import React from "react";

const { Text } = Typography;

const getStatusColor = (status: string) => {
    console.log(status);
    switch (status) {
        case "assigned":
            return "orange";
        case "created":
            return "#193152";
        case "completed":
            return "green";
        case "pending":
            return "orange";
        case "cancelled":
            return "red";
        case "failed":
            return "red";
        case "passed":
            return "green";
        case "sent":
            return "blue";
        case "draft":
            return "#F54A00";
        case "accepted":
            return "green";
        case "rejected":
            return "red";
        case "updated":
            return "#F54A00";
        default:
            return "gray";
    }
};

const CandidateTimeLine: React.FC = () => {
    const { candidate } = useAppSelector((state) => state.candidate);

    const { data: candidateLogs, isLoading } = useGetActivityLogByCandidateIdQuery(candidate?.[0]?._id, {
        skip: !candidate?.[0]?._id,
    });
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
                        dot: <ClockCircleOutlined style={{ fontSize: '16px', color: getStatusColor(log?.action) }} />,
                        label: dayjs(log.createdAt).format('MMM DD, YYYY h:mm A'),
                        children: (
                            <div className="flex flex-col">
                                <Text strong className="capitalize">
                                    {log.action} {log.entityType}
                                </Text>

                                {
                                    log?.metaData?.description && log?.action === 'updated' ? (
                                        <Text type="secondary">
                                            Candidate is updated to <span className="font-bold">{log?.metaData?.description}</span>
                                        </Text>
                                    ) : (


                                        <Text type="secondary" className='capitalize'>Candidate {
                                            log?.action === 'deleted' ? 'was' : 'is'
                                        } in <span className="font-bold">{log?.metaData?.description}</span> stage </Text>
                                    )
                                }

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
