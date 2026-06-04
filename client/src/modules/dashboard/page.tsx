import { useMemo } from 'react'
import { Typography } from 'antd'
import { Users, Calendar, FileCheck, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import {
  useDashboardCandidates,
  useDashboardInterviews,
  useDashboardOffers,
  useDashboardAssignments,
  useDashboardActivityLogs,
} from './lib/queries/dashboard.queries'
import { MetricsCard } from './components/MetricsCard'
import { UpcomingInterviews } from './components/UpcomingInterviews'
import { ListOfCandidatesWithStatus } from './components/ListOfCandidatesWithStatus'
import { CandidateByTechnology } from './components/CandidateByTechnology'
import { CandidateLevelDistribution } from './components/CandidateLevelDistribution'
import { HiredandRejectedCorelation } from './components/HiredandRejectedCorelation'
import { RecentActivityLog } from './components/RecentActivityLog'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
}

function last7DayCounts<T extends { createdAt: string }>(items: T[]): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = dayjs().subtract(6 - i, 'day').format('YYYY-MM-DD')
    return items.filter((x) => dayjs(x.createdAt).format('YYYY-MM-DD') === day).length
  })
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: candidateData, isLoading: candidateLoading } = useDashboardCandidates()
  const { data: interviewData, isLoading: interviewLoading } = useDashboardInterviews()
  const { data: offerData, isLoading: offerLoading } = useDashboardOffers()
  const { data: assignmentData, isLoading: assignmentLoading } = useDashboardAssignments()
  const { data: activityLogData, isLoading: logsLoading } = useDashboardActivityLogs()

  const candidates = useMemo(() => candidateData?.data ?? [], [candidateData])
  const interviews = useMemo(() => interviewData?.data ?? [], [interviewData])
  const offers = useMemo(() => offerData?.data ?? [], [offerData])
  const assignments = useMemo(() => assignmentData?.data ?? [], [assignmentData])
  const activityLogs = useMemo(() => activityLogData?.data ?? [], [activityLogData])

  const scheduledInterviews = useMemo(
    () => interviews.filter((i) => i.status === 'scheduled'),
    [interviews],
  )
  const activeAssignments = useMemo(
    () => assignments.filter((a) => a.status === 'assigned'),
    [assignments],
  )
  const sentOffers = useMemo(
    () => offers.filter((o) => o.status === 'sent'),
    [offers],
  )

  const weekStart = dayjs().startOf('week').format('YYYY-MM-DD')
  const weekEnd = dayjs().endOf('week').format('YYYY-MM-DD')
  const weekInterviews = interviews.filter((iv) => {
    const d = dayjs(iv.date).format('YYYY-MM-DD')
    return d >= weekStart && d <= weekEnd
  })

  const candidateSparkline = useMemo(() => last7DayCounts(candidates), [candidates])
  const interviewSparkline = useMemo(() => last7DayCounts(interviews), [interviews])
  const offerSparkline = useMemo(() => last7DayCounts(offers), [offers])
  const assignmentSparkline = useMemo(() => last7DayCounts(assignments), [assignments])

  const todayInterviewCount = scheduledInterviews.filter((iv) =>
    dayjs(iv.date).isSame(dayjs(), 'day'),
  ).length

  const thisWeekCandidates = candidates.filter((c) =>
    dayjs(c.createdAt).isAfter(dayjs().startOf('week')),
  ).length

  const recentOffers = offers.filter((o) =>
    dayjs(o.createdAt).isAfter(dayjs().subtract(7, 'day')),
  ).length

  return (
    <div className="space-y-6">
      <div>
        <Typography.Title level={2} className="!mb-0 text-2xl font-bold">
          Dashboard
        </Typography.Title>
        <Typography.Text className="text-sm text-slate-400">
          Welcome back,{' '}
          <span className="font-semibold text-slate-200">{user?.username}</span>
        </Typography.Text>
      </div>

      {/* Zone 1 — KPI Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <MetricsCard
            title="Active Candidates"
            value={candidates.length}
            icon={<Users size={18} color="#6366f1" />}
            link="/dashboard/candidates"
            loading={candidateLoading}
            accentColor="#6366f1"
            trend={{ label: `↑ ${thisWeekCandidates} this week`, type: 'up' }}
            sparklineData={candidateSparkline}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricsCard
            title="Active Assignments"
            value={activeAssignments.length}
            icon={<FileCheck size={18} color="#f59e0b" />}
            link="/dashboard/assessments/assignments"
            loading={assignmentLoading}
            accentColor="#f59e0b"
            trend={{ label: `● ${activeAssignments.length} pending`, type: 'neutral' }}
            sparklineData={assignmentSparkline}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricsCard
            title="Scheduled Interviews"
            value={scheduledInterviews.length}
            icon={<Calendar size={18} color="#3b82f6" />}
            link="/dashboard/interviews"
            loading={interviewLoading}
            accentColor="#3b82f6"
            trend={{ label: `${todayInterviewCount} today`, type: 'neutral' }}
            sparklineData={interviewSparkline}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricsCard
            title="Offers Sent"
            value={sentOffers.length}
            icon={<FileText size={18} color="#22c55e" />}
            link="/dashboard/offers"
            loading={offerLoading}
            accentColor="#22c55e"
            trend={{ label: `↑ ${recentOffers} new`, type: 'up' }}
            sparklineData={offerSparkline}
          />
        </motion.div>
      </motion.div>

      {/* Zone 2 — Kanban Pipeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <ListOfCandidatesWithStatus
          candidates={candidates}
          interviews={interviews}
          offers={offers}
          assessments={assignments}
          loading={candidateLoading}
        />
      </motion.div>

      {/* Zone 3 — Analytics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CandidateByTechnology candidates={candidates} loading={candidateLoading} />
          <CandidateLevelDistribution candidates={candidates} loading={candidateLoading} />
          <HiredandRejectedCorelation candidates={candidates} loading={candidateLoading} />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <UpcomingInterviews
              interviews={weekInterviews}
              onViewAllClick={() => navigate('/dashboard/interviews')}
              loading={interviewLoading}
            />
          </div>
          <RecentActivityLog activityLogs={activityLogs} loading={logsLoading} />
        </div>
      </motion.div>
    </div>
  )
}
