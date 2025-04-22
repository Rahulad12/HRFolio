import React, { useState } from 'react'
import { useAppSelector } from '../../Hooks/hook'
import { Badge, Button, Card, Tabs } from 'antd'
import { Clock, Phone, CheckCircle } from 'lucide-react'
import { makeCapitilized } from '../../utils/TextAlter'
import { interviewData } from '../../types'
import dayjs from 'dayjs'
const { TabPane } = Tabs

const CandidateDetailsFooter = () => {
    const { interviews } = useAppSelector((state) => state.interview)
    const [activeTab, setActiveTab] = useState('details')

    // Mocked or destructured values — replace with actual data
    const candidate = {
        notes: 'Great communication skills\nNeeds improvement on algorithms.',
        appliedDate: '2025-03-01',
        position: 'Frontend Developer',
        status: 'interviewing',
    }

    const candidateInterviews: interviewData = interviews || []
    const candidateAssessments: any[] = []

    return (
        <div className="md:col-span-2">
            <Card>
                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane tab="Details" key="details" />
                    <TabPane tab="Interviews" key="interviews" />
                    <TabPane tab="Assessments" key="assessments" />
                    <TabPane tab="Timeline" key="timeline" />
                </Tabs>

                <div className="mt-6">
                    {activeTab === 'details' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Notes</h3>
                            <p className="text-gray-700 whitespace-pre-line">{candidate.notes}</p>
                        </div>
                    )}

                    {activeTab === 'interviews' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Interview History</h3>
                            {candidateInterviews.length > 0 ? (
                                <div className="space-y-4">
                                    {candidateInterviews?.map((interview: interviewData) => (
                                        <div key={interview._id} className="border rounded-lg p-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {makeCapitilized(interview?.candidate?.status)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {dayjs(interview?.date).format('MMMM D, YYYY')} at {dayjs(interview?.time).format('h:mm A')}
                                                    </div>
                                                </div>
                                                <Badge status={
                                                    interview?.status === 'scheduled' ? 'processing' :
                                                        interview?.status === 'completed' ? 'success' : 'error'
                                                } text={makeCapitilized(interview?.status)} />
                                            </div>

                                            {/* {interview.feedback && (
                                                <div className="mt-3">
                                                    <h4 className="text-xs font-medium text-gray-700">Feedback:</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{interview.feedback}</p>
                                                </div>
                                            )}

                                            {interview.rating && (
                                                <div className="mt-2 flex">
                                                    <span className="text-xs text-gray-700 mr-2">Rating:</span>
                                                    <div className="flex">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} className={`text-sm ${i < interview.rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )} */}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No interviews scheduled yet</p>
                                    <Button type="primary" className="mt-3" onClick={() => window.location.href = '/interviews/schedule'}>
                                        Schedule Interview
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'assessments' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Assessment History</h3>
                            {candidateAssessments.length > 0 ? (
                                <div className="space-y-4">
                                    {candidateAssessments.map((assessment: any) => (
                                        <div key={assessment.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{assessment.title}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {makeCapitilized(assessment.type)} • {assessment.duration} min
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Assigned on {assessment.assignedDate} • Due {assessment.dueDate}
                                                    </div>
                                                </div>
                                                <Badge status={
                                                    assessment.status === 'assigned' ? 'processing' :
                                                        assessment.status === 'completed' ? 'warning' : 'success'
                                                } text={makeCapitilized(assessment.status)} />
                                            </div>

                                            {assessment.score && (
                                                <div className="mt-3">
                                                    <div className="flex items-center">
                                                        <span className="text-xs font-medium text-gray-700 mr-2">Score:</span>
                                                        <span className="text-sm font-semibold text-gray-900">{assessment.score}%</span>
                                                    </div>
                                                </div>
                                            )}

                                            {assessment.feedback && (
                                                <div className="mt-2">
                                                    <h4 className="text-xs font-medium text-gray-700">Feedback:</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{assessment.feedback}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">No assessments assigned yet</p>
                                    <Button type="primary" className="mt-3" onClick={() => window.location.href = '/assessments/assignments'}>
                                        Assign Assessment
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Candidate Timeline</h3>
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                                <div className="space-y-6 relative">
                                    <div className="relative pl-10">
                                        <div className="absolute left-0 rounded-full bg-blue-500 p-1">
                                            <Clock size={16} className="text-white" />
                                        </div>
                                        <div className="bg-white p-3 border rounded-lg">
                                            <div className="text-xs text-gray-500">{candidate.appliedDate}</div>
                                            <div className="text-sm font-medium text-gray-900 mt-1">Application Received</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                Candidate applied for {candidate.position}
                                            </div>
                                        </div>
                                    </div>

                                    {candidate.status !== 'new' && (
                                        <div className="relative pl-10">
                                            <div className="absolute left-0 rounded-full bg-purple-500 p-1">
                                                <CheckCircle size={16} className="text-white" />
                                            </div>
                                            <div className="bg-white p-3 border rounded-lg">
                                                <div className="text-xs text-gray-500">2 days after application</div>
                                                <div className="text-sm font-medium text-gray-900 mt-1">Resume Screening Completed</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Candidate moved to screening stage
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {['interviewing', 'assessment', 'offered', 'hired'].includes(candidate.status) && (
                                        <div className="relative pl-10">
                                            <div className="absolute left-0 rounded-full bg-green-500 p-1">
                                                <Phone size={16} className="text-white" />
                                            </div>
                                            <div className="bg-white p-3 border rounded-lg">
                                                <div className="text-xs text-gray-500">5 days after application</div>
                                                <div className="text-sm font-medium text-gray-900 mt-1">Phone Screening Completed</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Candidate passed initial phone screening
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default CandidateDetailsFooter
