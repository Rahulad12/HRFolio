import { Card, Col, DatePicker, List, Row } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

const statusGroups = [
    { title: 'Shortlisted', key: 'shortlisted', color: '#2471A3' },
    { title: 'Assessment', key: 'assessment', color: '#2f54eb' },
    { title: 'First Interview', key: 'first', color: '#D35400' },
    { title: 'Second Interview', key: 'second', color: '#7D3C98' },
    { title: 'Third Interview', key: 'third', color: '#3498DB' },
    { title: 'Offered', key: 'offered', color: '#7F8C8D ' },
    { title: 'Hired', key: 'hired', color: '#237804' },
    { title: 'Rejected', key: 'rejected', color: '#a8071a' },
];

const ListOfCandidatesWithStatus = () => {
    const navigate = useNavigate();
    const { candidate } = useAppSelector((state) => state.candidate);

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null]) => {
        setDateRange(dates as [Dayjs | null, Dayjs | null]);
    };

    const getCandidatesByStatus = (status: string) => {
        return (
            candidate
                ?.filter((can) => can?.status === status)
                .filter((can) => {
                    if (dateRange?.[0] && dateRange?.[1]) {
                        const createdAt = dayjs(can?.createdAt);
                        return createdAt.isAfter(dateRange[0].startOf('day')) && createdAt.isBefore(dateRange[1].endOf('day'));
                    }
                    return true;
                }) || []
        );
    };

    return (
        <Card
            title="Candidates List by Status"
            extra={<DatePicker.RangePicker onChange={handleDateChange as any} />}
        >
            <Row gutter={[16, 16]}>
                {statusGroups.map((group) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={group.key}>
                        <Card
                            title={group.title}
                            style={{ height: '100%' }}
                            headStyle={{
                                backgroundColor: group.color,
                                color: '#fff',
                                fontWeight: 600,
                                textAlign: 'center',
                            }}

                        >
                            <List
                                dataSource={getCandidatesByStatus(group.key)}
                                locale={{ emptyText: 'No candidates' }}
                                pagination={
                                    {
                                        style: {
                                            textAlign: 'center',
                                            fontSize: '.8rem',
                                        },
                                        pageSize: 5,
                                    }
                                }
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
                                                <span className="capitalize">{item.technology}</span>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default ListOfCandidatesWithStatus;
