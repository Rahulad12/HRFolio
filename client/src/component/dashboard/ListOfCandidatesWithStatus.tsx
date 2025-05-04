import { Badge, Card, Col, DatePicker, List, Row } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { useState } from 'react';


const statusGroups = [
    { title: 'Shortlisted', key: 'shortlisted', color: '#2471A3' },
    { title: 'Assessment', key: 'assessment', color: '#2f54eb' },
    { title: 'Interviewing', key: 'interviewing', color: '#7D3C98' },
    { title: 'Offered', key: 'offered', color: '#F54A00' },
    { title: 'Hired', key: 'hired', color: '#237804' },
    { title: 'Rejected', key: 'rejected', color: '#a8071a' },
];

const ListOfCandidatesWithStatus = () => {
    const navigate = useNavigate();

    const { candidate } = useAppSelector((state) => state.candidate);
    const { mode } = useAppSelector(state => state.theme);

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null]) => {
        setDateRange(dates);
    };

    const filterCandidates = (statusKey: string) => {
        return candidate?.filter((can) => {

            let isMatch = false;
            const isInterviewStage = ['first', 'second', 'third'].includes(can.status);

            if (statusKey === 'interviewing') {
                isMatch = isInterviewStage;
            } else {
                isMatch = can.status === statusKey;
            }

            if (!isMatch) return false;

            if (dateRange[0] && dateRange[1]) {
                const createdAt = dayjs(can.createdAt);
                if (!createdAt.isBetween(dateRange[0].startOf('day'), dateRange[1].endOf('day'), null, '[]')) {
                    return false;
                }
            }

            return true;
        }) || [];
    };

    const getProgressBadge = (can: any, statusKey: string) => {
        const currentStatus = statusKey === 'interviewing' ? can.status : statusKey;
        if (currentStatus === 'rejected') {
            return <Badge status="error" text="Rejected" />;
        }
        if (currentStatus === 'hired') {
            return <Badge status="success" text="Hired" />;
        }
        const completed = can?.progress[currentStatus]?.completed;

        return (
            <Badge
                status={completed ? 'success' : 'warning'}
                text={completed ? 'Completed' : 'Pending'}
            />
        );
    };
    return (
        <Card
            title="Candidates by Status"
            extra={<DatePicker.RangePicker onChange={handleDateChange as any} />}
        >
            <Row gutter={[16, 16]}>
                {statusGroups.map((group) => {
                    const candidates = filterCandidates(group.key);
                    return (
                        <Col xs={24} sm={12} md={8} lg={4} key={group.key}>
                            <Card
                                title={group.title}
                                extra={<Badge count={candidates.length} style={{ backgroundColor: group.color }} />}
                                style={{ minHeight: '500px' }}
                            >
                                <List
                                    dataSource={candidates}
                                    locale={{ emptyText: 'No candidates found' }}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <span className="bg-blue-950 text-white h-6 w-6 rounded-full flex items-center justify-center capitalize">
                                                        {item.name.charAt(0)}
                                                    </span>
                                                }
                                                title={
                                                    <span
                                                        onClick={() => navigate(`/dashboard/candidates/${item._id}`)}
                                                        className="cursor-pointer capitalize"
                                                    >
                                                        {item.name}
                                                    </span>
                                                }
                                                description={
                                                    <>
                                                        <span className="capitalize">{item.technology}</span>
                                                        {group.key === 'interviewing' && (
                                                            <span className="capitalize"> - {item.status} Interview</span>
                                                        )}

                                                        <div>{getProgressBadge(item, group.key)}</div>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                    style={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: mode === 'dark' ? '#0000 #0000' : '#ffff #ffff' }}
                                />
                            </Card>

                        </Col>

                    );
                })}
            </Row>
        </Card>
    );
};

export default ListOfCandidatesWithStatus;
