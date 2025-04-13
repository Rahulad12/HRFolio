import {
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    DatePicker,
    Divider,
    Row,
    Select,
    Skeleton,
    Typography
} from 'antd';
import type { Dayjs } from 'dayjs';
import { CalendarDays, Clock, MessageSquare, User } from 'lucide-react';
import { useAppSelector } from '../../Hooks/hook';
import { makeCapitilized } from '../../utils/TextAlter';
import dayjs from 'dayjs';
import { useState } from 'react';


const { Title } = Typography;

interface Props {
    loading: boolean
}
const InterviewShow = ({ loading }: Props) => {

    const interviews = useAppSelector(state => state.interview.interviews);

    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const dateCellRender = (date: Dayjs) => {
        const listData = interviews.filter(interview => dayjs(interview.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD'));

        return (
            <ul className="events">
                {listData.map(interview => (
                    <li key={interview._id}>
                        <Badge
                            status={interview.status === 'scheduled'
                                ? 'processing' : interview.status === 'cancelled'
                                    ? 'error'
                                    : 'success'}
                            text={interview.status}
                        />
                    </li>
                ))}
            </ul>
        );
    }

    const FilterInterviews = ({
        selectedDate,
        setSelectedDate,
        selectedStatus,
        setSelectedStatus,
    }: {
        selectedDate: Dayjs | null;
        setSelectedDate: (date: Dayjs | null) => void;
        selectedStatus: string | null;
        setSelectedStatus: (status: string | null) => void;
    }) => {
        return (
            <div className="space-y-4">
                <Card className="shadow-sm">
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <DatePicker
                                value={selectedDate}
                                onChange={setSelectedDate}
                                className="w-full"
                            />
                        </Col>
                        <Col xs={24} md={12}>
                            <Select
                                value={selectedStatus || undefined}
                                onChange={setSelectedStatus}
                                allowClear
                                className="w-full"
                            >
                                <Select.Option value="scheduled">Scheduled</Select.Option>
                                <Select.Option value="cancelled">Cancelled</Select.Option>
                                <Select.Option value="completed">Completed</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    };

    const filteredInterviews = interviews.filter((interview) => {
        const isMatchingDate = selectedDate
            ? dayjs(interview.date).isSame(selectedDate, 'day')
            : true;
        const isMatchingStatus = selectedStatus ? interview.status === selectedStatus : true;
        return isMatchingDate && isMatchingStatus;
    });

    return (
        <div className="p-4 space-y-6">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <div className="bg-white p-4 rounded-xl shadow-sm">
                        <Title level={5}>Calendar View</Title>
                        <Divider />
                        {loading ? (
                            <Skeleton active paragraph={{ rows: 6 }} />
                        ) : (
                            <Calendar fullscreen={true} cellRender={dateCellRender} />
                        )}
                    </div>
                </Col>

                <Col xs={24} md={12}>
                    <div className="bg-white p-4 rounded-xl shadow-sm h-full">
                        <Title level={5}>Upcoming Interviews</Title>
                        <FilterInterviews
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            selectedStatus={selectedStatus}
                            setSelectedStatus={setSelectedStatus}
                        />
                        <Divider />
                        <div className="space-y-4">
                            {loading
                                ? Array(2).fill(null).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        active
                                        avatar
                                        paragraph={{ rows: 4 }}
                                        className="rounded-xl"
                                    />
                                ))
                                : filteredInterviews.map((interview, index) => (
                                    <div
                                        key={index}
                                        className="bg-white p-4 rounded-xl shadow-blue-300-100 border border-blue-100"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-lg text-gray-800">
                                                {makeCapitilized(interview.candidate.name)}
                                            </span>

                                            <Badge
                                                status={
                                                    interview.status === 'scheduled'
                                                        ? 'processing' : interview.status === 'cancelled'
                                                            ? 'error'
                                                            : 'success'
                                                }
                                                text={interview.status}
                                            />
                                        </div>
                                        <span className=" text-sm text-gray-800 bg-indigo-100 px-2 py-1 rounded-full">
                                            {makeCapitilized(interview.candidate.technology)}
                                        </span>
                                        <div className="mt-2 text-gray-600 space-y-1 text-sm">
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="w-4 h-4" />
                                                <span>{dayjs(interview.date).format('MMMM D, YYYY')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{dayjs(interview.date).format('h:mm A')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{makeCapitilized(interview.interviewer)}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-4">
                                            <Button
                                                size="small"
                                                type="primary"
                                                icon={<MessageSquare className="w-4 h-4" />}
                                            >
                                                Send Reminder
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default InterviewShow;
