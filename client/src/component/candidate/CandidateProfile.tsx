import { useState } from 'react';
import { useAppSelector } from '../../Hooks/hook';
import { Clock, CheckCircle, AlertCircle, XCircle, Star } from 'lucide-react';
import { Card, Tabs, Empty, Skeleton } from 'antd';
import { AssessmentLogData, interviewLogData, offerLog } from '../../types';
import { useGetInterviewLogByCanidateIdQuery } from '../../services/interviewServiceApi';
import { useGetAssessmentLogByCandidateIdQuery } from '../../services/assessmentServiceApi';
import dayjs from 'dayjs';
import { makeCapitilized } from '../../utils/TextAlter';
import { useGetOfferLogsByCandidateIdQuery } from '../../services/offerService';

const { TabPane } = Tabs;

const getColor = (status: string) => {
    switch (status) {
        case 'scheduled':
            return 'text-blue-600';
        case 'completed':
            return 'text-green-600';
        case 'cancelled':
            return 'text-orange-600';
        case "assigned":
            return 'text-amber-600';
        case 'Failed':
            return 'text-red-600';
        case 'Passed':
            return 'text-green-600';
        case 'sent':
            return 'text-blue-600';
        case 'draft':
            return 'text-yellow-600';
        case 'accepted':
            return 'text-green-600';
        case 'rejected':
            return 'text-red-600';
        default:
            return 'text-gray-600';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'scheduled':
            return <Clock size={18} className="text-blue-500" />;
        case 'completed':
            return <CheckCircle size={18} className="text-green-500" />;
        case 'cancelled':
            return <AlertCircle size={18} className="text-orange-500" />;
        case 'failed':
            return <XCircle size={18} className="text-red-500" />;
        default:
            return <Clock size={18} />;
    }
};

const CandidateProfile = () => {
    const [activeTab, setActiveTab] = useState('assessments');
    const { candidate } = useAppSelector((state) => state.candidate);
    const { data: interviewsLog, isLoading: interviewLogLoading } = useGetInterviewLogByCanidateIdQuery(candidate?.[0]?._id, {
        skip: !candidate?.[0]?._id,
    });
    const { data: assessmentLog, isLoading: assessmentLogLoading } = useGetAssessmentLogByCandidateIdQuery(candidate?.[0]?._id, {
        skip: !candidate?.[0]?._id,
    })
    const { data: offerLog, isLoading: offerLogLoading } = useGetOfferLogsByCandidateIdQuery(candidate?.[0]?._id, {
        skip: !candidate?.[0]?._id
    })

    return (
        <Card className="shadow-lg rounded-lg"
            title={`${makeCapitilized(candidate?.[0]?.name)} History Logs`}
        >
            <Tabs activeKey={activeTab} onChange={setActiveTab} centered>
                <TabPane tab="Assessments" key="assessments" />
                <TabPane tab="Interviews" key="interviews" />
                <TabPane tab="Offer" key="offers" />
            </Tabs>

            {activeTab === 'interviews' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {interviewLogLoading ? (
                        <Skeleton active className="mx-auto" />
                    ) : interviewsLog?.data?.length === 0 ? (
                        <Empty description="No interviews found." className="col-span-2" />
                    ) : (
                        interviewsLog?.data.map((log: interviewLogData) => (
                            <Card
                                key={log._id}
                                title={
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold flex gap-1">
                                            {dayjs(log.performedAt).format('MMM DD, YYYY')}
                                            <span className='text-gray-400'>({log?.action})</span>
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(log?.details?.status)}
                                            <span className={`capitalize text-sm font-medium ${getColor(log?.details?.status)}`}>
                                                {dayjs(log?.createdAt).format('h:mm A')}
                                            </span>
                                        </div>
                                    </div>
                                }
                                className="shadow-sm border"
                                loading={interviewLogLoading}
                            >
                                <p className="mb-1">
                                    <strong>Status:</strong>{' '}
                                    <span className={`capitalize ${getColor(log?.details?.status)}`}>
                                        {log?.details?.status}
                                    </span>
                                </p>
                                <p className="mb-1">
                                    <strong>Type:</strong> {log?.details?.type}
                                </p>
                                {log?.details?.feedback && (
                                    <p className="mb-1">
                                        <strong>Feedback:</strong>
                                        <span className='italic'> "{log?.details?.feedback}"</span>

                                    </p>
                                )}
                                {log?.details?.rating && (
                                    <p className="flex items-center mb-1">
                                        <strong className="mr-2">Rating:</strong>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={16}
                                                className={`mr-1 ${star <= log?.details?.rating
                                                    ? 'text-yellow-500'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </p>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            )}

            {
                activeTab === 'assessments' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {assessmentLogLoading ? (
                            <Skeleton active className="mx-auto" />
                        ) : assessmentLog?.data.length === 0 ? (
                            <Empty description="No assessments found." className="col-span-2" />
                        ) : (
                            assessmentLog?.data.map((log: AssessmentLogData) => (
                                <Card
                                    key={log._id}
                                    className="shadow-md border rounded-lg"
                                    title={
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                <span className="text-sm font-semibold">
                                                    {dayjs(log.performedAt).format('MMM DD, YYYY')}
                                                </span>
                                                <span className="text-xs text-gray-400">({log?.action})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(log?.details?.status)}
                                                <span className={`capitalize text-sm font-medium ${getColor(log?.details?.status)}`}>
                                                    {dayjs(log?.createdAt).format('h:mm A')}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <strong>Assessment:</strong>{' '}
                                            <span className="capitalize ">{log?.assessment?.title}</span>
                                        </p>
                                        <p>
                                            <strong>Type:</strong>{' '}
                                            <span className="capitalize">{log?.assessment?.type}</span>
                                        </p>
                                        <p>
                                            <strong>Link:</strong>{' '}
                                            <a
                                                href={log?.assessment?.assessmentLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Open Assessment
                                            </a>
                                        </p>
                                        <p>
                                            <strong>Status:</strong>{' '}
                                            <span className={`capitalize ${getColor(log?.details?.status)}`}>
                                                {log?.details?.status}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Due Date:</strong>{' '}
                                            <span>{dayjs(log?.details?.dueDate).format('MMM DD, YYYY')}</span>
                                        </p>
                                        {log?.details?.score && (
                                            <p>
                                                <strong>Score:</strong>{' '}
                                                <span className="text-green-600 font-semibold">{log?.details?.score}</span>
                                            </p>
                                        )}
                                        {log?.details?.feedback && (
                                            <p>
                                                <strong>Feedback:</strong>{' '}
                                                <span className=" italic">"{log?.details?.feedback}"</span>
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            ))

                        )}
                    </div>
                )
            }
            {
                activeTab === 'offers' && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                        {offerLogLoading ? (
                            <Skeleton active className="mx-auto" />
                        ) : offerLog?.data.length === 0 ? (
                            <Empty description="No offers found." className="col-span-2" />
                        ) : (
                            offerLog?.data.map((log: offerLog) => (
                                <Card
                                    key={log._id}
                                    className="shadow-md border rounded-lg"
                                    title={
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                <span className="text-sm font-semibold">
                                                    {dayjs(log.createdAt).format('MMM DD, YYYY')}
                                                </span>
                                                <span className="text-xs text-gray-400">({log?.action})</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(log?.offer?.status)}
                                                <span className={`capitalize text-sm font-medium ${getColor(log?.details?.status)}`}>
                                                    {dayjs(log?.createdAt).format('h:mm A')}
                                                </span>
                                            </div>
                                        </div>
                                    }
                                >
                                    <div className="space-y-2 text-sm">
                                        <p>
                                            <strong>Position:</strong>{' '}
                                            <span className="capitalize ">{log?.offer?.position}</span>
                                        </p>
                                        <p>
                                            <strong>Status:</strong>{' '}
                                            <span className={`capitalize ${getColor(log?.details?.status)}`}>
                                                {log?.details?.status}
                                            </span>
                                        </p>
                                        <p>
                                            <strong>Start Date</strong>{' '}
                                            <span>{dayjs(log?.offer?.startDate).format('MMM DD, YYYY')}</span>
                                        </p>
                                        <p>
                                            <strong>Response Deadline:</strong>{' '}
                                            <span>{dayjs(log?.offer?.responseDeadline).format('MMM DD, YYYY')}</span>
                                        </p>
                                    </div>
                                </Card>
                            ))
                        )}

                    </div>
                )
            }
        </Card>
    );
};

export default CandidateProfile;
