import React from 'react';
import { Users, Calendar, ClipboardCheck, Award, UserPlus, FileText, Briefcase, Plus } from 'lucide-react';
import { metricsData } from '../data/mockData';
import MetricsCard from '../component/dashboard/MetricsCard';
import CandidatePipeline from '../component/dashboard/CandidatePipeline';
import RecentActivity from '../component/dashboard/RecentActivity';
import UpcomingInterviews from '../component/dashboard/UpcomingInterviews';
import Button from '../component/ui/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '../Hooks/hook';
import { useCandidate } from '../action/StoreCandidate';
import { useInterview } from '../action/StoreInterview';
import dayjs from 'dayjs';
import PrimaryButton from '../component/ui/button/Primary';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  //storeInterview is used to store the interview data in redux
  const { isLoading, isError } = useInterview(null, null);
  const { data } = useCandidate();
  const { user } = useAppSelector((state) => state.auth);

  // Fetching data from Redux store
  const { candidate } = useAppSelector((state) => state.candidate);
  const { interviews } = useAppSelector((state) => state.interview);

  // Pipeline stages
  const pipelineStages = [
    { id: '1', name: 'New Applications', count: 18, color: '#3B82F6' },
    { id: '2', name: 'Screening', count: 12, color: '#8B5CF6' },
    { id: '3', name: 'Interviewing', count: 8, color: '#10B981' },
    { id: '4', name: 'Assessment', count: 5, color: '#F59E0B' },
    { id: '5', name: 'Offered', count: 3, color: '#EC4899' },
  ];


  // Mock activities
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
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  const startWeek = dayjs().startOf('week').format('YYYY-MM-DD');
  const endWeek = dayjs().endOf('week').format('YYYY-MM-DD');
  const filteredInterviews = interviews.filter((interview) => {
    const interviewDate = dayjs(interview.date).format('YYYY-MM-DD');
    return interviewDate >= startWeek && interviewDate <= endWeek;
  }
  );

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Dashboard</h1>
          <p className="mt-1 text-sm text-blue-950">
            Welcome back!  <span className="font-bold text-blue-950">{user.username}</span>
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <PrimaryButton
            text='Add Candidate'
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/candidates/new')}
            disabled={false}
            loading={false}
          />
          <Button
            variant="outline"
            icon={<Calendar size={16} />}
            onClick={() => navigate('/dashboard/interviews/schedule')}
          >
            Schedule Interview
          </Button>
        </div>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <MetricsCard
            title="Open Positions"
            value={metricsData.openPositions}
            icon={<Briefcase size={20} className="text-blue-700" />}
            change={{ value: 12, trend: 'up' }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricsCard
            title="Active Candidates"
            value={candidate.length}
            icon={<Users size={20} className="text-purple-700" />}
            change={{ value: 8, trend: 'up' }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricsCard
            title="Scheduled Interviews"
            value={interviews.length}
            icon={<Calendar size={20} className="text-green-700" />}
            change={{ value: 5, trend: 'up' }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricsCard
            title="Time to Hire (days)"
            value={metricsData.timeToHire}
            icon={<Award size={20} className="text-amber-700" />}
            change={{ value: 10, trend: 'down' }}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CandidatePipeline stages={pipelineStages} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <UpcomingInterviews
            interviews={filteredInterviews}
            onViewAllClick={() => navigate('/dashboard/interviews')}
            loading={isLoading}
            error={isError ? 'Failed to load interviews' : ''}
          />
        </motion.div>
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <RecentActivity activities={recentActivities} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;