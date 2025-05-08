import { Badge, Card, Col, DatePicker, Input, List, Row, Skeleton } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import { Fragment, useCallback, useState } from 'react';
import { Search } from 'lucide-react';

interface Props {
    candidateLoading?: boolean
}
const statusGroups = [
    { title: 'Shortlisted', key: 'shortlisted', color: '#2471A3' },
    { title: 'Assessment', key: 'assessment', color: '#2f54eb' },
    { title: 'Interviewing', key: 'interviewing', color: '#7D3C98' },
    { title: 'Offered', key: 'offered', color: '#F54A00' },
    { title: 'Hired', key: 'hired', color: '#237804' },
    { title: 'Rejected', key: 'rejected', color: '#a8071a' },
];

const ListOfCandidatesWithStatus: React.FC<Props> = ({
    candidateLoading = true
}) => {
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState<Record<string, string>>({});

    const { candidate } = useAppSelector((state) => state.candidate);
    const { interviews } = useAppSelector((state) => state.interview);
    const { offerLetters } = useAppSelector((state) => state.offer);
    const { assignedAssessments } = useAppSelector((state) => state.assessments);
    const { mode } = useAppSelector(state => state.theme);

    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);

    const handleDateChange = (dates: [Dayjs | null, Dayjs | null]) => {
        setDateRange(dates);
    };

    const filterCandidates = useCallback((statusKey: string) => {
        const searchValue = searchText[statusKey];

        return (
            candidate?.filter((can) => {
                let isMatch = false;
                const isInterviewStage = ['first', 'second', 'third'].includes(can.status);

                if (statusKey === 'interviewing') {
                    isMatch = isInterviewStage;
                } else {
                    isMatch = can.status === statusKey;
                }

                if (!isMatch) return false;

                if (dateRange && dateRange[0] && dateRange[1]) {
                    const createdAt = dayjs(can.createdAt);
                    if (
                        !createdAt.isBetween(
                            dateRange[0].startOf('day'),
                            dateRange[1].endOf('day'),
                            null,
                            '[]'
                        )
                    ) {
                        return false;
                    }
                }

                if (
                    searchValue &&
                    !(
                        can.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                        can.technology.toLowerCase().includes(searchValue.toLowerCase())
                    )
                ) {
                    return false;
                }

                return true;
            })
                // Sort from most recent to oldest based on createdAt
                ?.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf())
            || []
        );
    }, [candidate, dateRange, searchText]);


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

    const filteredOffersByCandidate = useCallback((candidateId: string) => {
        return offerLetters?.filter((offer) => offer?.candidate?._id === candidateId);
    }, [offerLetters]);

    const filteredInterviewsByCandidate = useCallback((candidateId: string) => {
        return interviews?.filter((interview) => interview?.candidate?._id === candidateId);
    }, [interviews]);

    const filteredAssessmentsByCandidate = useCallback((candidateId: string) => {
        return assignedAssessments?.filter((assessment) => assessment?.candidate?._id === candidateId);
    }, [assignedAssessments]);


    return (
        <Card
            title="Candidates by Status"
            extra={<DatePicker.RangePicker onChange={handleDateChange as any} />}
        >
            <Row gutter={[16, 16]}>
                {statusGroups.map((group) => {
                    const candidates = filterCandidates(group.key);
                    return (
                        <Col xs={24} sm={12} md={8} lg={8} key={group.key}>
                            {
                                candidateLoading ? (
                                    <Skeleton active
                                        title
                                        paragraph={{ rows: 6 }}
                                        style={{ minHeight: '500px' }}
                                    />
                                ) :
                                    <Card
                                        title={group.title}
                                        extra={<Badge count={candidates.length} style={{ backgroundColor: group.color }} />}
                                        style={{ minHeight: '500px' }}
                                    >
                                        <Input placeholder="Search candidates by name or technology"
                                            size='small'
                                            prefix={<Search size={16} color='#808080' />}
                                            style={{ marginBottom: '10px' }}
                                            onChange={(value) => {
                                                setSearchText({ ...searchText, [group.key]: value.target.value });
                                            }}
                                            allowClear
                                        />
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
                                                            <div
                                                                className='flex  gap-2 flex-col'
                                                            >
                                                                <span className="capitalize">{item.technology}</span>
                                                                {
                                                                    group.key === 'assessment' && (
                                                                        filteredAssessmentsByCandidate(item?._id).length > 0 ? (
                                                                            filteredAssessmentsByCandidate(item?._id)?.map((assessment, index) => (
                                                                                <div key={index}>
                                                                                    <span key={index} className="capitalize text-sm">  Status: {assessment.status}</span>
                                                                                    <p className='capitalize'> {dayjs(assessment.createdAt).format('MMM D, YYYY')}, {dayjs(assessment.createdAt).format('HH:mm')}</p>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <p className="capitalize text-sm"> No Assessment Scheduled</p>
                                                                        )

                                                                    )
                                                                }

                                                                {group.key === 'interviewing' && (
                                                                    filteredInterviewsByCandidate(item?._id).length > 0 ? (
                                                                        filteredInterviewsByCandidate(item?._id)?.map((interview, index) => (
                                                                            <Fragment key={index}>
                                                                                <p className='capitalize'>Round: {interview.InterviewRound} Interview</p>
                                                                                <span className="capitalize text-sm"> Status: {interview.status}</span>
                                                                                <p className='capitalize'> {dayjs(interview.createdAt).format('MMM D, YYYY')}, {dayjs(interview.createdAt).format('HH:mm')}</p>
                                                                            </Fragment>

                                                                        ))
                                                                    ) : (
                                                                        <p className="capitalize text-sm"> No Interview Scheduled</p>
                                                                    )
                                                                )
                                                                }

                                                                {group.key === 'offered' && (
                                                                    filteredOffersByCandidate(item?._id).length > 0 ? (
                                                                        filteredOffersByCandidate(item?._id)?.map((offer, index) => (
                                                                            <Fragment key={index}>
                                                                                <span key={index} className="capitalize text-sm">  Status: {offer.status}</span>
                                                                                <p className='capitalize'> {dayjs(offer.createdAt).format('MMM D, YYYY')}, {dayjs(offer.createdAt).format('HH:mm')}</p>
                                                                            </Fragment>
                                                                        ))
                                                                    ) : (
                                                                        <p className="capitalize text-sm"> No Offer Sent</p>
                                                                    )
                                                                )}
                                                                {
                                                                    group.key === 'hired' && (
                                                                        <p className='capitalize' key={item._id}> {dayjs(item.createdAt).format('MMM D, YYYY')}, {dayjs(item.createdAt).format('HH:mm')}</p>
                                                                    )
                                                                }
                                                                {group.key === 'rejected' && (
                                                                    <p className='capitalize' key={item._id}> {dayjs(item.createdAt).format('MMM D, YYYY')}, {dayjs(item.createdAt).format('HH:mm')}</p>
                                                                )}
                                                                <div>{getProgressBadge(item, group.key)}</div>
                                                            </div>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                            style={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: mode === 'dark' ? '#0000 #0000' : '#ffff #ffff' }}
                                        />
                                    </Card>
                            }
                        </Col>
                    );
                })}
            </Row>
        </Card>
    );
};

export default ListOfCandidatesWithStatus;
