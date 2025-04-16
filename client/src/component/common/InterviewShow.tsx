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
    Tooltip,
    Typography,
    Modal,
    notification
} from 'antd';
import {
    CalendarDays, Clock, Mail, MessageSquare, User, Edit
} from 'lucide-react';
import { useAppSelector } from '../../Hooks/hook';
import { makeCapitilized } from '../../utils/TextAlter';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { storeSearch } from '../../action/StoreSearch';
import { useAppDispatch } from '../../Hooks/hook';
import { AnimatePresence, motion } from 'framer-motion';
import EditInterview from '../Form/EditInterview';

interface Props {
    loading: boolean;
}

const PAGE_SIZE = 2;

const InterviewShow = ({ loading }: Props) => {
    const dispatch = useAppDispatch();
    const interviews = useAppSelector(state => state.interview.interviews);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs().startOf('day'));
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [interviewId, setInterviewId] = useState<string>('');
    const [api, contextHolder] = notification.useNotification();

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
        dispatch(storeSearch("", "", "", "", selectedDate, selectedStatus));
    }, [selectedDate, selectedStatus, dispatch]);

    const handleDateChange = (date: Dayjs | null) => {
        setSelectedDate(date ? date.startOf('day') : null);
        setCurrentPage(1);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatus(status);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEdit = (id: string) => {
        setIsModalOpen(true);
        setInterviewId(id);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const handleSendReminder = (interviewerId: string, interviewerName: string, interviewerEmail: string) => {
        console.log(interviewerId, interviewerName, interviewerEmail);
        api.success({
            message: `Reminder Sent to Interviewer ${makeCapitilized(interviewerName)}`,
            description: 'Interviewer has been notified',
            placement: 'top',
            duration: 3000
        })
    }

    // Corrected cellRender function
    const dateCellRender = (date: Dayjs) => {
        const listData = interviews.filter(interview =>
            dayjs(interview.date).isSame(date, 'day')
        );

        return (
            <ul className="events">
                {listData.map(interview => (
                    <motion.li
                        key={interview._id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Badge
                            status={interview.status === 'scheduled'
                                ? 'processing'
                                : interview.status === 'cancelled'
                                    ? 'error'
                                    : 'success'}
                            text={interview.status}
                        />
                    </motion.li>
                ))}
            </ul>
        );
    };

    return (
        <>
            {contextHolder}
            {/* Calendar Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Card title="Interview Calendar" className="shadow-sm mb-6">
                    <Calendar
                        fullscreen={false}
                        cellRender={dateCellRender}
                        onSelect={handleDateChange}
                        value={selectedDate || dayjs()}
                    />
                </Card>
            </motion.div>

            {/* Filters Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Card title="Filter Interviews" className="shadow-sm mb-6">
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <DatePicker
                                value={dayjs(selectedDate) || dayjs()}
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
            </motion.div>

            {/* Interviews List Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <Card
                    title={`Upcoming Interviews (${filteredInterviews.length})`}
                    className="shadow-sm"
                    extra={
                        filteredInterviews.length > PAGE_SIZE && (
                            <Pagination
                                current={currentPage}
                                total={filteredInterviews.length}
                                pageSize={PAGE_SIZE}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                className="mt-2"
                            />
                        )
                    }
                >
                    {loading ? (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {Array(2).fill(null).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        active
                                        avatar
                                        paragraph={{ rows: 4 }}
                                        className="rounded-xl mb-4"
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`page-${currentPage}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-4"
                            >
                                {paginatedInterviews.length > 0 ? (
                                    paginatedInterviews?.map((interview) => (
                                        <motion.div
                                            key={interview._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            whileHover={{ scale: 1.01 }}
                                        >
                                            <Card className="mb-4 border border-blue-100 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <Typography.Title level={5} className="mb-1">
                                                            {makeCapitilized(interview?.candidate?.name)}
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
                                                        <span>
                                                            <Tooltip title="Edit">
                                                                <Button
                                                                    type="text"
                                                                    icon={<Edit className="w-4 h-4" />}
                                                                    onClick={() => handleEdit(interview._id)}
                                                                    className="text-green-500 hover:bg-green-50"
                                                                />
                                                            </Tooltip>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <Typography.Title level={5} className="mb-1">
                                                            {makeCapitilized("Interview Type")}
                                                        </Typography.Title>
                                                        <Badge
                                                            status={
                                                                interview.status === 'scheduled'
                                                                    ? 'processing'
                                                                    : interview.status === 'cancelled'
                                                                        ? 'error'
                                                                        : 'success'
                                                            }
                                                            text={interview?.candidate?.status}
                                                        />
                                                    </div>
                                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            size="small"
                                                            type="primary"
                                                            icon={<MessageSquare className="w-4 h-4" />}
                                                            onClick={() => handleSendReminder(interview?.interviewer?._id, interview?.interviewer?.name, interview?.interviewer?.email)}
                                                        >
                                                            Send Reminder
                                                        </Button>
                                                    </motion.div>
                                                </div>

                                                <div className="mt-3">
                                                    <span className="inline-block text-sm text-gray-800 bg-indigo-100 px-2 py-1 rounded-full mb-2">
                                                        {makeCapitilized(interview?.candidate?.technology)}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4" />
                                                        <span>{interview?.candidate?.email}</span>
                                                    </div>
                                                    <div className="text-gray-600 space-y-1 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarDays className="w-4 h-4" />
                                                            <span>{dayjs(interview?.date).format('MMMM D, YYYY')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{dayjs(interview?.date).format('h:mm A')}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4" />
                                                            <span>{makeCapitilized(interview?.interviewer?.name)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No interviews found for the selected filters
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {!loading && filteredInterviews.length > PAGE_SIZE && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex justify-center mt-4"
                        >
                            <Pagination
                                current={currentPage}
                                total={filteredInterviews.length}
                                pageSize={PAGE_SIZE}
                                onChange={handlePageChange}
                                showSizeChanger={false}
                                showTotal={(total) => `Total ${total} interviews`}
                            />
                        </motion.div>
                    )}
                </Card>
            </motion.div>

            <Modal
                open={isModalOpen}
                onCancel={closeModal}
                footer={null}
                width={600}
            >
                <EditInterview id={interviewId} />
            </Modal>
        </>
    );
};

export default InterviewShow;