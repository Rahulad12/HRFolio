import React, { useMemo } from 'react';
import { Users, Calendar, FileCheck, FileText } from 'lucide-react';
import MetricsCard from '../component/dashboard/MetricsCard';
import UpcomingInterviews from '../component/dashboard/UpComingInterviews';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '../Hooks/hook';
import { useCandidate } from '../action/StoreCandidate';
import { useInterview } from '../action/StoreInterview';
import dayjs from 'dayjs';
import { Col, Row, Space, Typography } from 'antd';
import RecentActivityLog from '../component/dashboard/RecentActivitiesLog';
import ListOfCandidatesWithStatus from '../component/dashboard/ListOfCandidatesWithStatus';
import CandidateByTechnology from '../component/dashboard/CandidateByTechnology';
import CandidateLevelDistribution from '../component/dashboard/CandidateLevelDistribution';
import HiredandRejectedCorelation from '../component/dashboard/HiredandRejectedCorelation';
import { useOffer } from '../action/storeOffer';
import { useAssignedAssessment } from '../action/StoreAssessment';



const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const { isLoading: interviewLoading } = useInterview(); // Fetch Interviews and that will store in redux
  const { isLoading: candidateLoading } = useCandidate(); // Fetch candidates and that will store in redux 
  const { offers, offerLoading } = useOffer() // Fetch offers and that will store in redux
  const {

    assignedAssessment,
    assignmentLoading

  } = useAssignedAssessment();


  const { user } = useAppSelector((state) => state.auth);

  const { candidate } = useAppSelector((state) => state.candidate);
  const { interviews } = useAppSelector((state) => state.interview)

  const scheduledInterview = useMemo(
    () => interviews?.filter((item) => item.status === 'scheduled'),
    [interviews]
  );

  const assessment = useMemo(
    () => assignedAssessment?.data?.filter((item) => item.status === 'assigned'),
    [assignedAssessment]
  );

  const offered = useMemo(
    () => offers?.filter((item) => item.status === 'sent'),
    [offers]
  );


  /**
   * Framer motion variants 
   */
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
                title="Active Assignment"
                value={assessment?.length || 0}
                icon={<FileCheck size={20} className="mr-2 text-orange-500" />}
                link="/dashboard/assessments/assignments"
                loading={assignmentLoading}

              />
            </motion.div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Scheduled Interviews"
                value={scheduledInterview?.length}
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
                value={offered?.length || 0}
                icon={<FileText size={20} className="mr-2 text-green-500" />}
                link="/dashboard/offers"
                loading={offerLoading}
              />
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      {/* Main Section */}
      <Row gutter={[24, 24]}>
        {/* Left Side */}
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <ListOfCandidatesWithStatus
            candidateLoading={candidateLoading}
          />
        </Space>
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CandidateByTechnology
                loading={candidateLoading}

              />
            </motion.div>
          </Space>
        </Col>

        {/* Right Side */}
        <Col xs={24} lg={12}>
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


        <Col xs={24} lg={12} md={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <RecentActivityLog />
          </motion.div>
        </Col>
        <Col xs={24} lg={12} md={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>

            <CandidateLevelDistribution
              loading={candidateLoading}
            />
            <HiredandRejectedCorelation
              loading={candidateLoading}
            />

          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
