import { Button, Card, Divider, Popconfirm, Space, Tag, Typography, message, notification } from 'antd'
import { Calendar, CalendarIcon, Check, Clock, Eye, MapPin, Phone, Send, Trash2, Users, Video } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../Hooks/hook'
import dayjs, { Dayjs } from 'dayjs'
import InterviewDetailsModal from './InterviewDetailsModal'
import { interviewData, interviewStatus } from '../../types'
import { useMemo, useState } from 'react'
const { Title, Text } = Typography
import { useUpdateInterviewMutation, useDeleteInterviewMutation, useCreateInterviewMutation } from '../../services/interviewServiceApi';
import { storeInterview } from '../../action/StoreInterview'
interface interviewSearchTerms {
    searchTerm?: string;
    interviewStatus?: string | null;
    selectedDate?: Dayjs | null
}

const InterviewListView = ({
    searchTerm,
    interviewStatus,
    selectedDate
}: interviewSearchTerms
) => {

    const [selectedInterview, setSelectedInterview] = useState<interviewData | null>(null);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const [selectedInterviews, setSelectedInterviews] = useState<interviewData[]>([]);
    const [updateInterview] = useUpdateInterviewMutation();
    const [deleteInterview] = useDeleteInterviewMutation();
    const [createInterview] = useCreateInterviewMutation();

    const dispatch = useAppDispatch();
    //selected Interview
    const { interviews } = useAppSelector(state => state.interview);

    const getInterviewTypeIcon = (type: string) => {
        switch (type) {
            case 'phone':
                return <Phone size={16} />;
            case 'video':
                return <Video size={16} />;
            case 'in-person':
                return <MapPin size={16} />;
            default:
                return <Calendar size={16} />;
        }
    };

    const getInterviewTypeColor = (type: string) => {
        switch (type) {
            case 'phone':
                return 'blue';
            case 'video':
                return 'purple';
            case 'in-person':
                return 'green';
            default:
                return 'default';
        }
    };

    const getInterviewStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled':
                return 'blue';
            case 'completed':
                return 'green';
            case 'canceled':
                return 'red';
            case 'rescheduled':
                return 'orange';
            case 'failed':
                return 'red';
            default:
                return 'default';
        }
    };

    const getInterviewRoundColor = (round: string) => {
        switch (round) {
            case 'first':
                return 'blue';
            case 'second':
                return 'purple';
            case 'third':
                return 'volcano';
        }
    }


    const handleViewDetails = (interview: interviewData) => {
        setSelectedInterview(interview);
        setIsDetailsModalVisible(true);
    }
    const handleStatusUpdate = async (id: string, status: interviewStatus) => {
        // setSelectedInterviews(selectedInterviews.filter((interview) => interview._id == id));
        const interviewData = interviews?.find((i) => i._id === id);
        if (!interviewData) {
            api.error({
                message: "Interview data not found.",
                placement: "topRight",
                duration: 3000
            });
            return;
        }

        try {
            const res = await updateInterview({
                id,
                data: {
                    ...interviewData,
                    status
                }
            }).unwrap();
            if (res?.success) {
                api.success({
                    message: res?.message,
                    placement: "topRight",
                    duration: 3000,
                })
                const interviewData = Array.isArray(res.data) ? res.data : [res.data];
                dispatch(storeInterview(interviewData as interviewData[]));
            }

        } catch (error: any) {
            api.error({
                message: `Error updating candidate status: ${error?.data?.message || error?.message || 'An unknown error occurred.'}`,
                placement: "topRight",
                duration: 3000
            })
        }
        finally {
            setSelectedInterviews(selectedInterviews.filter((interview) => interview._id !== id));
        }
    }

    //feedback for particular interview
    const handleFeedbackSubmit = async (id: string, feedback: string, rating: number) => {
        const interviewData = interviews?.find((i) => i._id === id);
        if (!interviewData) {
            api.error({
                message: "Interview data not found.",
                placement: "topRight",
                duration: 3000
            });
            return;
        }
        try {
            const res = await updateInterview({
                id,
                data: {
                    ...interviewData,
                    feedback,
                    rating
                }
            }).unwrap();

            if (res?.success) {
                api.success({
                    message: res?.message,
                    placement: "topRight",
                    duration: 3000,
                })

                const interviewData = Array.isArray(res.data) ? res.data : [res.data];
                dispatch(storeInterview(interviewData as interviewData[]));
            }

        } catch (error: any) {
            console.log(error);
            api.error({
                message: `Error updating candidate status: ${error?.data?.message || error?.message || 'An unknown error occurred.'}`,
                placement: "topRight",
                duration: 3000
            })
        }
    }
    const handleInterviewDelete = async (id: string) => {
        try {
            const res = await deleteInterview(id);
            if (res?.data?.success) {
                message.success(res?.data?.message);
            }

        } catch (error: any) {
            console.log(error);
            console.log(error.data.message)
            message.error("Error deleting interview");
        }
    }
    const handleSendDraftedInterview = async (interview: interviewData) => {
        try {
            const res = await createInterview({
                ...interview,
                status: 'scheduled'
            });
            if (res?.data?.success) {
                message.success(res?.data?.message);
            }
        } catch (error: any) {
            console.log(error);
            console.log(error.data.message)
            message.error("Error sending interview");
        }
    }
    const filteredInterviews = useMemo(() => {
        return interviews.filter((interview) => {

            const matchesSearch = searchTerm !== undefined && (
                searchTerm === '' ||
                interview?.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                interview?.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            // Status matching
            const matchesStatus = interviewStatus === '' || interview?.status === interviewStatus;

            // Date matching
            const matchesDate = !selectedDate || dayjs(interview?.date).isSame(selectedDate, 'day');

            return matchesSearch && matchesStatus && matchesDate;
        });
    }, [interviews, searchTerm, interviewStatus, selectedDate]);


    return (
        <div className='flex flex-wrap gap-3 flex-col justify-center'>
            {contextHolder}
            {filteredInterviews.map((interview) => (
                <Card
                    key={interview?._id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    extra={
                        <Space>
                            <Button type="link" onClick={() => handleViewDetails(interview)} icon={<Eye size={16} color='blue' />} />
                            {
                                interview?.status === 'scheduled' && (
                                    <Button type="link" onClick={() => handleStatusUpdate(interview?._id, 'completed')} icon={<Check size={16} color='green' />} />
                                )
                            }
                            {
                                interview?.status === 'draft' && (
                                    <Button type="link" onClick={() => handleSendDraftedInterview(interview)} icon={<Send size={16} color='green' />} />
                                )
                            }
                            {/* <Button type="link" onClick={() => handleViewDetails(interview)} icon={<PencilIcon size={16} />} /> */}
                            <Popconfirm title="Are you sure you want to delete this interview?" onConfirm={() => handleInterviewDelete(interview?._id)} okText="Yes" cancelText="No">
                                <Button type="link" icon={<Trash2 size={16} />} danger />
                            </Popconfirm>
                        </Space>
                    }
                >
                    <div className="flex justify-between">

                        <div className="flex">
                            <div className="w-12 h-12 rounded-lg bg-blue-950 flex items-center justify-center text-white mr-3">
                                {getInterviewTypeIcon(interview?.type)}
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <Title level={5} className="m-0 mr-2 capitalize" onClick={() => handleViewDetails(interview)}>{interview?.candidate?.name}</Title>
                                    <Tag color={getInterviewTypeColor(interview?.type)} className='capitalize'>
                                        {interview?.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                                    </Tag>
                                    <Tag color={getInterviewStatusColor(interview?.status || '')} className='capitalize'>
                                        {interview?.status || ''}
                                    </Tag>
                                    <Tag color={getInterviewRoundColor(interview?.InterviewRound || '')} className='capitalize'>{interview?.InterviewRound} Interview</Tag>
                                </div>
                                <Text type="secondary" className='capitalize'>{interview?.candidate?.level}</Text>
                                <div className="mt-2 flex flex-wrap gap-3">
                                    <div className="flex items-center">
                                        <CalendarIcon size={14} className="mr-1 text-gray-500" />
                                        <Text type="secondary">{dayjs(interview?.date).format('MMM D, YYYY')}</Text>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock size={14} className="mr-1 text-gray-500" />
                                        <Text type="secondary">
                                            {dayjs(interview?.time).format('h:mm A')} ({60} min)
                                        </Text>
                                    </div>
                                    <div className="flex items-center">
                                        <Users size={14} className="mr-1 text-gray-500" />
                                        <Text type="secondary" className='capitalize'>{interview?.interviewer?.name}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {interview.notes && (
                        <div className="mt-3 p-3 rounded-lg">
                            <Divider plain>Scheduled Notes</Divider>
                            <Text type="secondary">{interview?.notes}</Text>
                        </div>
                    )}

                    {interview.feedback && (
                        <div className="mt-3">
                            <Divider plain>Feedback</Divider>
                            <Card className="p-3">
                                <div className="flex justify-between">
                                    <Text strong>Interview Feedback</Text>
                                    {/* <Text>{interview.rating}/5</Text> */}
                                </div>
                                <Text type="secondary">{interview?.feedback}</Text>
                            </Card>
                        </div>
                    )}
                </Card>
            ))}
            <InterviewDetailsModal
                interview={selectedInterview}
                visible={isDetailsModalVisible}
                onClose={() => {
                    setIsDetailsModalVisible(false);
                    setSelectedInterview(null);
                }}

                onStatusUpdate={handleStatusUpdate}
                onFeedbackSubmit={handleFeedbackSubmit}
            />
        </div>
    )
}

export default InterviewListView
