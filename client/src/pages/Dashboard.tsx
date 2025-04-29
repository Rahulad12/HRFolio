import React from 'react';
import { Users, Calendar, FileCheck, FileText } from 'lucide-react';
import MetricsCard from '../component/dashboard/MetricsCard';
import CandidateByStatus from '../component/dashboard/CandidateByStatus';
import RecentActivity from '../component/dashboard/RecentActivity';
import UpcomingInterviews from '../component/dashboard/UpComingInterviews';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '../Hooks/hook';
import { useCandidate } from '../action/StoreCandidate';
import { useInterview } from '../action/StoreInterview';
import dayjs from 'dayjs';
import { Card, Col, Row, Space, Typography } from 'antd';
import RecentActivityLog from '../component/dashboard/RecentActivitiesLog';
import ListOfCandidatesWithStatus from '../component/dashboard/ListOfCandidatesWithStatus';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { isLoading: interviewLoading } = useInterview(null, null);

  const { isLoading: candidateLoading } = useCandidate(); // Fetch candidates and that will store in redux also 

  const { user } = useAppSelector((state) => state.auth);

  const { candidate } = useAppSelector((state) => state.candidate);
  const { interviews } = useAppSelector((state) => state.interview);

  const shortListed = candidate.filter((item) => item.status === 'shortlisted');

  const assessment = candidate.filter((item) => item.status === 'assessment');
  const offered = candidate.filter((item) => item.status === 'offered');
  const rejected = candidate.filter((item) => item.status === 'rejected');
  const hired = candidate.filter((item) => item.status === 'hired');

  const pipelineStages = [
    { id: '1', name: 'New Applications', count: shortListed.length, color: '#3B82F6' },
    { id: '2', name: 'Assessment', count: assessment.length, color: '#8B5CF6' },
    { id: '3', name: 'Interviewing', count: interviews.length, color: '#10B981' },
    { id: '4', name: 'Offered', count: offered.length, color: '#F59E0B' },
    { id: '5', name: 'Hired', count: hired.length, color: '#EC4899' },
    { id: '6', name: 'Rejected', count: rejected.length, color: '#EF4444' },
  ];

  const recentActivities = [
    {
      id: '1',
      type: 'interview' as const,
      title: 'Interview with Michael Chen',
      description: 'Technical interview for Data Scientist position',
      date: 'Today',
      time: '10:30 AM',
    },
    {
      id: '2',
      type: 'assessment' as const,
      title: 'Frontend Coding Challenge',
      description: 'John Doe completed the assessment',
      date: 'Yesterday',
      time: '4:45 PM',
    },
    {
      id: '3',
      type: 'offer' as const,
      title: 'Offer Extended',
      description: 'Offer letter sent to Emily Davis for Product Manager',
      date: 'May 5, 2025',
      time: '2:15 PM',
    },
    {
      id: '4',
      type: 'candidate' as const,
      title: 'New Application',
      description: 'Robert Johnson applied for Backend Developer',
      date: 'May 4, 2025',
      time: '9:30 AM',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const startWeek = dayjs().startOf('week').format('YYYY-MM-DD');
  const endWeek = dayjs().endOf('week').format('YYYY-MM-DD');
  const filteredInterviews = interviews.filter((interview) => {
    const interviewDate = dayjs(interview.date).format('YYYY-MM-DD');
    return interviewDate >= startWeek && interviewDate <= endWeek;
  });

  return (
    <div>
      {/* Top Section */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={2} className="text-2xl font-bold text-blue-950">Dashboard</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-blue-950">
            Welcome back! <span className="font-bold">{user.username}</span>
          </Typography.Text>
        </div>
      </div>

      {/* Metrics Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Active Candidates"
                value={candidate?.length}
                icon={<Users size={20} className="text-purple-700" />}
                link="/dashboard/candidates"
                loading={candidateLoading}
              />
            </motion.div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Active Assessment"
                value={assessment?.length}
                icon={<FileCheck size={20} className="mr-2 text-orange-500" />}
                link="/dashboard/assessments"
                loading={candidateLoading}

              />
            </motion.div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Scheduled Interviews"
                value={interviews?.length}
                icon={<Calendar size={20} className="text-green-700" />}
                link="/dashboard/interviews"
                loading={interviewLoading}
              />
            </motion.div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Offer Sent"
                value={offered?.length}
                icon={<FileText size={20} className="mr-2 text-green-500" />}
                link="/dashboard/offers"
                loading={candidateLoading}
              />
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      {/* Main Section */}
      <Row gutter={[24, 24]}>
        {/* Left Side */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <ListOfCandidatesWithStatus />
        </Space>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CandidateByStatus stages={pipelineStages} loading={candidateLoading} />
            </motion.div>
          </Space>
        </Col>

        {/* Right Side */}
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <UpcomingInterviews
              interviews={filteredInterviews}
              onViewAllClick={() => navigate('/dashboard/interviews')}
              loading={interviewLoading}
            />
          </motion.div>
        </Col>

        {/* Bottom Full Width */}
        {/* <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <RecentActivity activities={recentActivities} />
          </motion.div>
        </Col> */}

        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <RecentActivityLog />
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
