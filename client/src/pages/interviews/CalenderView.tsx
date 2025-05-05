import { Badge, Calendar, Modal } from 'antd';
import dayjs from 'dayjs';
import { useAppSelector } from '../../Hooks/hook';
import { useState } from 'react';

const CalendarView = () => {
    const { interviews } = useAppSelector((state) => state.interview);

    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const getInterviewsForDate = (value: dayjs.Dayjs) => {
        return interviews.filter((interview) => {
            const interviewDate = dayjs(interview.date);
            return (
                interviewDate.date() === value.date() &&
                interviewDate.month() === value.month() &&
                interviewDate.year() === value.year()
            );
        });
    };

    const dateCellRender = (value: dayjs.Dayjs) => {
        const listData = getInterviewsForDate(value);

        return (
            <ul
                className="events p-0 m-0 max-h-12 overflow-hidden cursor-pointer"
                onClick={() => {
                    setSelectedDate(value);
                    setModalVisible(true);
                }}
            >
                {listData.slice(0, 2).map((interview) => (
                    <li key={interview._id} className="mb-1">
                        <Badge
                            status={
                                interview.status === 'scheduled'
                                    ? 'processing'
                                    : interview.status === 'completed'
                                        ? 'success'
                                        : interview.status === 'cancelled'
                                            ? 'error'
                                            : 'default'
                            }
                            text={
                                <span className="text-xs truncate block w-full">
                                    {dayjs(interview.time).format('HH:mm')} - {interview?.candidate?.name}
                                </span>
                            }
                        />
                    </li>
                ))}
                {listData.length > 2 && (
                    <li className="text-xs text-gray-400 italic">+ {listData.length - 2} more</li>
                )}
            </ul>
        );
    };

    return (
        <div>
            <Calendar cellRender={dateCellRender} className="interview-calendar" />

            <Modal
                title={`Interviews on ${selectedDate?.format('MMMM D, YYYY')}`}
                open={modalVisible}
                footer={null}
                onCancel={() => setModalVisible(false)}
            >
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedDate &&
                        getInterviewsForDate(selectedDate).map((interview) => (
                            <li key={interview._id} className="flex items-start gap-2">
                                <Badge
                                    status={
                                        interview.status === 'scheduled'
                                            ? 'processing'
                                            : interview.status === 'completed'
                                                ? 'success'
                                                : interview.status === 'cancelled'
                                                    ? 'error'
                                                    : 'default'
                                    }
                                />
                                <div>
                                    <div className="text-sm font-medium">
                                        {dayjs(interview.time).format('HH:mm')} - {interview?.candidate?.name}
                                    </div>
                                    <div className="text-xs text-gray-500 capitalize">
                                        Status: {interview.status}
                                    </div>
                                    <div className="text-xs text-gray-500 capitalize" >
                                        Interview Round: {interview.InterviewRound} interview
                                    </div>
                                </div>
                            </li>
                        ))}
                </ul>
            </Modal>
        </div>
    );
};

export default CalendarView;
