import { useAppSelector } from '../../Hooks/hook';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Card, Timeline, Typography, Empty } from 'antd';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

dayjs.extend(isBetween);
const { Title, Text } = Typography;

const UpComingInterviews = () => {
    const navigate = useNavigate();
    const { interviews } = useAppSelector(state => state.interview);

    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');

    const filteredInterviews = interviews
        ?.filter(i => dayjs(i.date).isBetween(startOfWeek, endOfWeek, null, '[]'))
        .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());

    return (
        <Card title="Upcoming Interviews" className="h-full w-full" extra={<Text onClick={() => navigate('/dashboard/interviews')} className='cursor-pointer'>View All</Text>} >
            {filteredInterviews && filteredInterviews.length > 0 ? (
                <Timeline>
                    {filteredInterviews.slice(0, 5)?.map((interview, index) => (
                        <Timeline.Item key={index}>
                            <div className="space-y-1">
                                <Title level={5} className="!mb-0" key={index}>
                                    <Link to={`/dashboard/candidate/${interview?.candidate?._id}`}>{interview?.candidate?.name}</Link>
                                </Title>
                                <Text type="secondary">
                                    Role: <strong>{interview?.candidate?.technology}</strong>
                                </Text>
                                <br />
                                <Text>
                                    Date: <strong>{dayjs(interview?.date).format('dddd, MMM D • h:mm A')}</strong>
                                </Text>
                                {interview?.candidate?.status && (
                                    <>
                                        <br />
                                        <Text>Stage: {interview?.candidate?.status}</Text>
                                    </>
                                )}
                            </div>
                        </Timeline.Item>
                    ))}
                </Timeline>
            ) : (
                <Empty description="No interviews scheduled this week" />
            )}
        </Card>
    );
};

export default UpComingInterviews;
