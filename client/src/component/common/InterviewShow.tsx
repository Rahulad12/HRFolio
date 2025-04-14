import {
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    DatePicker,
    Pagination,
    Row,
    Select,
    Skeleton,
    Typography
} from 'antd';
import { CalendarDays, Clock, Mail, MessageSquare, User } from 'lucide-react';
import { useAppSelector } from '../../Hooks/hook';
import { makeCapitilized } from '../../utils/TextAlter';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { storeSearch } from '../../action/StoreSearch';
import { useAppDispatch } from '../../Hooks/hook';
import { motion } from 'framer-motion';


interface Props {
    loading: boolean;
}

const PAGE_SIZE = 2; // Number of interviews per page

const InterviewShow = ({ loading }: Props) => {
    const dispatch = useAppDispatch();
    const interviews = useAppSelector(state => state.interview.interviews);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter interviews by selected date and status
    const filteredInterviews = interviews.filter(interview => {
        const matchesDate = selectedDate
            ? dayjs(interview.date).isSame(selectedDate, 'day')
            : true;
        const matchesStatus = selectedStatus
            ? interview.status === selectedStatus
            : true;
        return matchesDate && matchesStatus;
    });

    // Paginate the filtered interviews
    const paginatedInterviews = filteredInterviews.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    useEffect(() => {
        dispatch(storeSearch("", "", "", "", selectedDate, selectedStatus || ""));
    }, [selectedDate, selectedStatus]);

    const dateCellRender = (date: Dayjs) => {
        const listData = interviews.filter(interview =>
            dayjs(interview.date).isSame(date, 'day')
        );

        return (
            <ul className="events">
                {listData.map(interview => (
                    <li key={interview._id}>
                        <Badge
                            status={interview.status === 'scheduled'
                                ? 'processing'
                                : interview.status === 'cancelled'
                                    ? 'error'
                                    : 'success'}
                            text={interview.status}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date);
        setCurrentPage(1); // Reset to first page when date changes
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(1); // Reset to first page when status changes
    };

    return (
        <div className="p-4 space-y-6">
            {/* Calendar Section */}
            <Card title="Interview Calendar" className="shadow-sm mb-6">
                <motion.div initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }} className="flex items-center justify-center space-x-2 mb-4">
                    <Calendar
                        fullscreen={false}
                        cellRender={dateCellRender}
                        onSelect={handleDateChange}
                        value={selectedDate || dayjs()}
                    />
                </motion.div>
            </Card>

            {/* Filters Section */}
            <Card title="Filter Interviews" className="shadow-sm mb-6">
                <Row gutter={16}>
                    <Col xs={24} md={12}>
                        <DatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full"
                            allowClear
                            placeholder="Select date"
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Select
                            value={selectedStatus || undefined}
                            onChange={handleStatusChange}
                            allowClear
                            className="w-full"
                            placeholder="Filter by status"
                        >
                            <Select.Option value="scheduled">Scheduled</Select.Option>
                            <Select.Option value="cancelled">Cancelled</Select.Option>
                            <Select.Option value="completed">Completed</Select.Option>
                        </Select>
                    </Col>
                </Row>
            </Card>

            {/* Interviews List Section */}
            <Card
                title={`Upcoming Interviews (${filteredInterviews.length})`}
                className="shadow-sm"
                extra={
                    filteredInterviews.length > PAGE_SIZE && (
                        <Pagination
                            current={currentPage}
                            total={filteredInterviews.length}
                            pageSize={PAGE_SIZE}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                            className="mt-2"
                        />
                    )
                }
            >
                {loading ? (
                    Array(2).fill(null).map((_, index) => (
                        <Skeleton
                            key={index}
                            active
                            avatar
                            paragraph={{ rows: 4 }}
                            className="rounded-xl mb-4"
                        />
                    ))
                ) : (

                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {paginatedInterviews.length > 0 ? (
                                paginatedInterviews?.map((interview) => (
                                    <Card
                                        key={interview._id}
                                        className="mb-4 border border-blue-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Typography.Title level={5} className="mb-1">
                                                    {makeCapitilized(interview.candidate.name)}
                                                </Typography.Title>
                                                <Badge
                                                    status={
                                                        interview.status === 'scheduled'
                                                            ? 'processing'
                                                            : interview.status === 'cancelled'
                                                                ? 'error'
                                                                : 'success'
                                                    }
                                                    text={interview.status}
                                                />
                                            </div>
                                            <Button
                                                size="small"
                                                type="primary"
                                                icon={<MessageSquare className="w-4 h-4" />}
                                            >
                                                Send Reminder
                                            </Button>
                                        </div>

                                        <div className="mt-3">
                                            <span className="inline-block text-sm text-gray-800 bg-indigo-100 px-2 py-1 rounded-full mb-2">
                                                {makeCapitilized(interview.candidate.technology)}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span>{(interview.candidate.email)}</span>
                                            </div>
                                            <div className="text-gray-600 space-y-1 text-sm">
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
                                        </div>
                                    </Card>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No interviews found for the selected filters
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}

                {!loading && filteredInterviews.length > PAGE_SIZE && (
                    <div className="flex justify-center mt-4">
                        <Pagination
                            current={currentPage}
                            total={filteredInterviews.length}
                            pageSize={PAGE_SIZE}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                            showTotal={(total) => `Total ${total} interviews`}
                        />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default InterviewShow;