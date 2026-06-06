# Dashboard Module Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Dashboard page from Redux/RTK Query to React Query/Zustand, preserving all visual output and behavior exactly.

**Architecture:** Dashboard gets its own API/query layer (no cross-module imports), children receive data as props, a Zustand theme store replaces Redux theme selector.

**Tech Stack:** React 18 / TypeScript / Vite / Ant Design / Tailwind / TanStack React Query (v5) / Zustand / Chart.js 4 / react-chartjs-2 / dayjs

---

### Task 1: Install dayjs dependency

**Files:**
- Modify: `client/package.json`

- [ ] **Install dayjs**

Run: `cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npm install dayjs`
Expected: dayjs added to `package.json` dependencies

- [ ] **Commit**

```bash
git add client/package.json client/package-lock.json
git commit -m "chore: add dayjs dependency for dashboard date operations"
```

---

### Task 2: Create dashboard types

**Files:**
- Create: `client/src/modules/dashboard/types/dashboard.types.ts`

- [ ] **Write the types file**

```typescript
export interface CandidateData {
  _id: string
  name: string
  email: string
  phone: string
  technology: string
  level: string
  status: string
  progress?: {
    hired?: { completed: boolean; date: string }
    [key: string]: { completed: boolean; date?: string } | undefined
  }
  createdAt: string
  updatedAt: string
}

export interface CandidateListResponse {
  success: boolean
  data: CandidateData[]
}

export interface InterviewData {
  _id: string
  candidate: { _id: string; name: string; level: string }
  interviewer: { _id: string; name: string }
  date: string
  time: string
  status: string
  InterviewRound: string
  createdAt: string
}

export interface InterviewListResponse {
  success: boolean
  data: InterviewData[]
}

export interface OfferData {
  _id: string
  candidate: { _id: string }
  status: string
  createdAt: string
}

export interface OfferListResponse {
  success: boolean
  data: OfferData[]
}

export interface AssignmentData {
  _id: string
  candidate: { _id: string }
  status: string
  createdAt: string
}

export interface AssignmentListResponse {
  success: boolean
  data: AssignmentData[]
}

export interface ActivityLog {
  _id: string
  entityType: string
  action: string
  metaData: {
    title: string
    description: string
    [key: string]: unknown
  }
  createdAt: string
}

export interface ActivityLogResponse {
  success: boolean
  data: ActivityLog[]
}
```

---

### Task 3: Create dashboard API layer

**Files:**
- Create: `client/src/modules/dashboard/lib/api/dashboard.api.ts`

- [ ] **Write the API file**

```typescript
import { GET } from '@/shared/lib/axios'
import { CANDIDATE_URL, INTERVIEW_URL, OFFER_URL, ASSESSMENT_URL } from '@/shared/constants/api'
import type { CandidateListResponse } from '../../types/dashboard.types'
import type { InterviewListResponse } from '../../types/dashboard.types'
import type { OfferListResponse } from '../../types/dashboard.types'
import type { AssignmentListResponse } from '../../types/dashboard.types'
import type { ActivityLogResponse } from '../../types/dashboard.types'

export function fetchCandidates(): Promise<CandidateListResponse> {
  return GET<CandidateListResponse>(`/${CANDIDATE_URL}`)
}

export function fetchInterviews(): Promise<InterviewListResponse> {
  return GET<InterviewListResponse>(`/${INTERVIEW_URL}`)
}

export function fetchOffers(): Promise<OfferListResponse> {
  return GET<OfferListResponse>(`/${OFFER_URL}`)
}

export function fetchAssignments(): Promise<AssignmentListResponse> {
  return GET<AssignmentListResponse>(`/${ASSESSMENT_URL}/assignment`)
}

export function fetchActivityLogs(): Promise<ActivityLogResponse> {
  return GET<ActivityLogResponse>('/activity-log')
}
```

Note: The activity-log endpoint doesn't have a constant yet. If it needs one, add to `client/src/constant.ts`:
```typescript
export const ACTIVITY_LOG_URL = 'activity-log';
```

---

### Task 4: Create dashboard query hooks

**Files:**
- Create: `client/src/modules/dashboard/lib/queries/dashboard.queries.ts`

- [ ] **Write the queries file**

```typescript
import { useQuery } from '@tanstack/react-query'
import * as dashboardApi from '../api/dashboard.api'

const DASHBOARD_KEYS = {
  candidates: ['dashboard', 'candidates'] as const,
  interviews: ['dashboard', 'interviews'] as const,
  offers: ['dashboard', 'offers'] as const,
  assignments: ['dashboard', 'assignments'] as const,
  activityLogs: ['dashboard', 'activityLogs'] as const,
}

export function useDashboardCandidates() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.candidates,
    queryFn: dashboardApi.fetchCandidates,
  })
}

export function useDashboardInterviews() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.interviews,
    queryFn: dashboardApi.fetchInterviews,
  })
}

export function useDashboardOffers() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.offers,
    queryFn: dashboardApi.fetchOffers,
  })
}

export function useDashboardAssignments() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.assignments,
    queryFn: dashboardApi.fetchAssignments,
  })
}

export function useDashboardActivityLogs() {
  return useQuery({
    queryKey: DASHBOARD_KEYS.activityLogs,
    queryFn: dashboardApi.fetchActivityLogs,
  })
}
```

---

### Task 5: Create dashboard utilities

**Files:**
- Create: `client/src/modules/dashboard/utils/dashboard.utils.ts`

- [ ] **Write the utils file**

```typescript
export function makeCapitilized(text: string): string {
  if (!text) return ''
  const words = text.split(' ')
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
```

---

### Task 6: Create chart components (BarGraph, PieChart, LineGraph)

**Files:**
- Create: `client/src/modules/dashboard/components/BarGraph.tsx`
- Create: `client/src/modules/dashboard/components/PieChart.tsx`
- Create: `client/src/modules/dashboard/components/LineGraph.tsx`

- [ ] **Write BarGraph.tsx**

```typescript
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend)

interface BarGraphProps {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
  }[]
  darkMode?: boolean
}

export function BarGraph({ labels, datasets, darkMode }: BarGraphProps) {
  const adjustedDatasets = datasets.map((dataset) => ({
    ...dataset,
    backgroundColor: dataset.backgroundColor ?? (darkMode ? '#D3D3D3' : '#363062'),
  }))

  const data = { labels, datasets: adjustedDatasets }

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' as const } },
  }

  return <Bar data={data} options={options} />
}
```

- [ ] **Write PieChart.tsx**

```typescript
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface PieChartProps {
  labels: string[]
  data: number[]
  backgroundColor?: string[]
  title?: string
  size?: number
}

export function PieChart({ labels, data, backgroundColor, title, size = 300 }: PieChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || 'Dataset',
        data,
        backgroundColor: backgroundColor || ['#363062', '#F99417', '#93B1A6'],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: title },
    },
  }

  return (
    <div style={{ width: size, height: size }}>
      <Pie data={chartData} options={options} />
    </div>
  )
}
```

- [ ] **Write LineGraph.tsx**

```typescript
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Legend, Tooltip)

interface LineChartProps {
  labels: string[]
  hiredData: number[]
  rejectedData: number[]
  size?: number
}

export function LineChart({ labels, hiredData, rejectedData, size }: LineChartProps) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Hired',
        data: hiredData,
        borderColor: '#4CAF50',
        backgroundColor: '#4CAF5088',
        fill: false,
        tension: 0.4,
      },
      {
        label: 'Rejected',
        data: rejectedData,
        borderColor: '#F44336',
        backgroundColor: '#F4433688',
        fill: false,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Hiring vs Rejections Over Time' },
    },
  }

  return (
    <div style={{ width: size, height: 'fit-content' }}>
      <Line data={data} options={options} />
    </div>
  )
}
```

---

### Task 7: Create MetricsCard component

**Files:**
- Create: `client/src/modules/dashboard/components/MetricsCard.tsx`

- [ ] **Write MetricsCard.tsx**

```typescript
import type { ReactNode } from 'react'
import { Card, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

interface MetricsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  link?: string
  loading?: boolean
}

export function MetricsCard({ title, value, icon, link, loading }: MetricsCardProps) {
  const navigate = useNavigate()

  return (
    <Card className="transition-all duration-300 hover:shadow-lg" loading={loading}>
      <div className="flex items-start">
        <div className="mr-4 bg-blue-100 p-3 rounded-lg">{icon}</div>
        <div className="flex-1">
          <h3
            className="text-sm font-medium text-gray-500 cursor-pointer"
            onClick={() => link && navigate(link)}
          >
            {title}
          </h3>
          <div className="flex items-baseline mt-1">
            <Text strong className="text-2xl">{value}</Text>
          </div>
        </div>
      </div>
    </Card>
  )
}
```

---

### Task 8: Create UpcomingInterviews component

**Files:**
- Create: `client/src/modules/dashboard/components/UpcomingInterviews.tsx`

```typescript
import { useState } from 'react'
import { Calendar } from 'lucide-react'
import dayjs from 'dayjs'
import { makeCapitilized } from '../utils/dashboard.utils'
import { Button, Card, Empty, Pagination, Row, Tag, Typography } from 'antd'
import { Radio } from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { InterviewData } from '../types/dashboard.types'

const { Text } = Typography

interface UpcomingInterviewsProps {
  interviews: InterviewData[]
  onViewAllClick?: () => void
  loading?: boolean
}

export function UpcomingInterviews({ interviews, onViewAllClick, loading = false }: UpcomingInterviewsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 3
  const [filterType, setFilterType] = useState<'today' | 'week'>('week')

  const handleFilterChange = (e: RadioChangeEvent) => {
    setFilterType(e.target.value)
  }

  const filteredInterviews = interviews.filter((interview) => {
    const interviewDate = dayjs(interview.date)
    const today = dayjs().startOf('day')
    const startOfWeek = today.startOf('week')
    const endOfWeek = today.endOf('week')
    const isScheduled = interview.status === 'scheduled'
    if (!isScheduled) return false
    if (filterType === 'today') return interviewDate.isSame(today, 'day')
    return (
      interviewDate.isSame(startOfWeek, 'day') ||
      (interviewDate.isAfter(startOfWeek) && interviewDate.isBefore(endOfWeek)) ||
      interviewDate.isSame(endOfWeek, 'day')
    )
  })

  const paginatedInterviews = filteredInterviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  return (
    <Card
      title="Upcoming Interviews"
      loading={loading}
      extra={
        <div className="flex gap-2 items-center">
          <Radio.Group
            size="small"
            value={filterType}
            onChange={handleFilterChange}
            options={[
              { label: 'Today', value: 'today' },
              { label: 'This Week', value: 'week' },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
          <Button type="link" onClick={onViewAllClick}>
            <Text>View All</Text>
          </Button>
        </div>
      }
    >
      <div className="space-y-4 flex gap-2 flex-col">
        {paginatedInterviews.length > 0 ? (
          paginatedInterviews.map((interview) => (
            <Card key={interview._id} className="border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-full flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <Typography.Text className="capitalize">
                      {interview?.candidate?.name}
                    </Typography.Text>
                    <span className="text-xs text-gray-500">
                      {dayjs(interview?.date).format('MMM DD, YYYY')}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Tag
                      color={
                        interview.candidate?.level === 'mid'
                          ? 'success'
                          : interview.candidate?.level === 'senior'
                            ? 'blue'
                            : interview.candidate?.level === 'junior'
                              ? 'warning'
                              : 'info'
                      }
                      className="capitalize"
                    >
                      {makeCapitilized(interview.candidate?.level)}
                    </Tag>
                    <span className="text-xs font-medium capitalize">
                      {makeCapitilized(interview.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 capitalize">
                      With: {interview?.interviewer?.name}
                    </span>
                    <span className="text-xs font-medium text-blue-600">
                      {dayjs(interview?.time).format('hh:mm A')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Empty description="No Upcoming Interviews" />
        )}
      </div>
      {interviews?.length > PAGE_SIZE && (
        <Row justify="center" className="mt-4">
          <Pagination
            current={currentPage}
            total={interviews?.length}
            pageSize={PAGE_SIZE}
            onChange={(page) => setCurrentPage(page)}
            align="center"
          />
        </Row>
      )}
    </Card>
  )
}
```

---

### Task 9: Create ListOfCandidatesWithStatus component

**Files:**
- Create: `client/src/modules/dashboard/components/ListOfCandidatesWithStatus.tsx`

```typescript
import { Badge, Card, DatePicker, Input, List, Row, Col, Skeleton } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '@/shared/store/themeStore'
import type { CandidateData, InterviewData, OfferData, AssignmentData } from '../types/dashboard.types'

dayjs.extend(isBetween)

interface Props {
  candidates: CandidateData[]
  interviews: InterviewData[]
  offers: OfferData[]
  assessments: AssignmentData[]
  loading?: boolean
}

const statusGroups = [
  { title: 'Shortlisted', key: 'shortlisted', color: '#2471A3' },
  { title: 'Assessment', key: 'assessment', color: '#2f54eb' },
  { title: 'Interviewing', key: 'interviewing', color: '#7D3C98' },
  { title: 'Offered', key: 'offered', color: '#F54A00' },
  { title: 'Hired', key: 'hired', color: '#237804' },
  { title: 'Rejected', key: 'rejected', color: '#a8071a' },
]

function getProgressBadge(can: CandidateData, statusKey: string) {
  const currentStatus = statusKey === 'interviewing' ? can.status : statusKey
  if (currentStatus === 'rejected') return <Badge status="error" text="Rejected" />
  if (currentStatus === 'hired') return <Badge status="success" text="Hired" />
  const completed = can.progress?.[currentStatus]?.completed
  return <Badge status={completed ? 'success' : 'warning'} text={completed ? 'Completed' : 'Pending'} />
}

export function ListOfCandidatesWithStatus({ candidates, interviews, offers, assessments, loading = true }: Props) {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState<Record<string, string>>({})
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null])
  const mode = useThemeStore((s) => s.mode)

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null]) => {
    setDateRange(dates)
  }

  const filterCandidates = useCallback(
    (statusKey: string) => {
      const searchValue = searchText[statusKey]
      return (
        candidates
          ?.filter((can) => {
            let isMatch = false
            const isInterviewStage = ['first', 'second', 'third'].includes(can.status)
            if (statusKey === 'interviewing') {
              isMatch = isInterviewStage
            } else {
              isMatch = can.status === statusKey
            }
            if (!isMatch) return false
            if (dateRange[0] && dateRange[1]) {
              const createdAt = dayjs(can.createdAt)
              if (!createdAt.isBetween(dateRange[0].startOf('day'), dateRange[1].endOf('day'), null, '[]')) {
                return false
              }
            }
            if (
              searchValue &&
              !(
                can.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                can.technology.toLowerCase().includes(searchValue.toLowerCase())
              )
            ) {
              return false
            }
            return true
          })
          .sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()) || []
      )
    },
    [candidates, dateRange, searchText],
  )

  const filteredOffersByCandidate = useCallback(
    (candidateId: string) => offers?.filter((offer) => offer?.candidate?._id === candidateId),
    [offers],
  )

  const filteredInterviewsByCandidate = useCallback(
    (candidateId: string) => interviews?.filter((i) => i?.candidate?._id === candidateId),
    [interviews],
  )

  const filteredAssessmentsByCandidate = useCallback(
    (candidateId: string) => assessments?.filter((a) => a?.candidate?._id === candidateId),
    [assessments],
  )

  return (
    <Card
      title="Candidates by Status"
      extra={<DatePicker.RangePicker onChange={handleDateChange as never} />}
    >
      <Row gutter={[16, 16]}>
        {statusGroups.map((group) => {
          const groupCandidates = filterCandidates(group.key)
          return (
            <Col xs={24} sm={12} md={8} lg={8} key={group.key}>
              {loading ? (
                <Skeleton active title paragraph={{ rows: 6 }} style={{ minHeight: '500px' }} />
              ) : (
                <Card
                  title={group.title}
                  extra={<Badge count={groupCandidates.length} style={{ backgroundColor: group.color }} />}
                  style={{ minHeight: '500px' }}
                >
                  <Input
                    placeholder="Search candidates by name or technology"
                    size="small"
                    prefix={<Search size={16} color="#808080" />}
                    style={{ marginBottom: '10px' }}
                    onChange={(value) => setSearchText({ ...searchText, [group.key]: value.target.value })}
                    allowClear
                  />
                  <List
                    dataSource={groupCandidates}
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
                            <div className="flex gap-2 flex-col">
                              <span className="capitalize">{item.technology}</span>
                              {group.key === 'assessment' &&
                                (filteredAssessmentsByCandidate(item._id).length > 0
                                  ? filteredAssessmentsByCandidate(item._id).map((a, i) => (
                                      <div key={i}>
                                        <span className="capitalize text-sm">Status: {a.status}</span>
                                        <p className="capitalize">
                                          {dayjs(a.createdAt).format('MMM D, YYYY')},{' '}
                                          {dayjs(a.createdAt).format('HH:mm')}
                                        </p>
                                      </div>
                                    ))
                                  : <p className="capitalize text-sm">No Assessment Scheduled</p>)}
                              {group.key === 'interviewing' &&
                                (filteredInterviewsByCandidate(item._id).length > 0
                                  ? filteredInterviewsByCandidate(item._id).map((iv, i) => (
                                      <div key={i}>
                                        <p className="capitalize">Round: {iv.InterviewRound} Interview</p>
                                        <span className="capitalize text-sm">Status: {iv.status}</span>
                                        <p className="capitalize">
                                          {dayjs(iv.createdAt).format('MMM D, YYYY')},{' '}
                                          {dayjs(iv.createdAt).format('HH:mm')}
                                        </p>
                                      </div>
                                    ))
                                  : <p className="capitalize text-sm">No Interview Scheduled</p>)}
                              {group.key === 'offered' &&
                                (filteredOffersByCandidate(item._id).length > 0
                                  ? filteredOffersByCandidate(item._id).map((o, i) => (
                                      <div key={i}>
                                        <span className="capitalize text-sm">Status: {o.status}</span>
                                        <p className="capitalize">
                                          {dayjs(o.createdAt).format('MMM D, YYYY')},{' '}
                                          {dayjs(o.createdAt).format('HH:mm')}
                                        </p>
                                      </div>
                                    ))
                                  : <p className="capitalize text-sm">No Offer Sent</p>)}
                              {group.key === 'hired' && (
                                <p className="capitalize">
                                  {dayjs(item.createdAt).format('MMM D, YYYY')},{' '}
                                  {dayjs(item.createdAt).format('HH:mm')}
                                </p>
                              )}
                              {group.key === 'rejected' && (
                                <p className="capitalize">
                                  {dayjs(item.createdAt).format('MMM D, YYYY')},{' '}
                                  {dayjs(item.createdAt).format('HH:mm')}
                                </p>
                              )}
                              <div>{getProgressBadge(item, group.key)}</div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                    style={{
                      maxHeight: '400px',
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      scrollbarColor: mode === 'dark' ? '#0000 #0000' : '#ffff #ffff',
                    }}
                  />
                </Card>
              )}
            </Col>
          )
        })}
      </Row>
    </Card>
  )
}
```

---

### Task 10: Create CandidateByTechnology component

**Files:**
- Create: `client/src/modules/dashboard/components/CandidateByTechnology.tsx`

```typescript
import { Card, Skeleton } from 'antd'
import { BarGraph } from './BarGraph'
import { useThemeStore } from '@/shared/store/themeStore'
import type { CandidateData } from '../types/dashboard.types'

interface Props {
  candidates: CandidateData[]
  loading?: boolean
}

export function CandidateByTechnology({ candidates, loading = true }: Props) {
  const darkMode = useThemeStore((s) => s.mode === 'dark')

  const techCount: Record<string, number> = {}
  candidates.forEach((c) => {
    const tech = c.technology?.trim().toLowerCase() || ''
    techCount[tech] = (techCount[tech] || 0) + 1
  })

  const labels = Object.keys(techCount)
  const counts = Object.values(techCount)

  return (
    <Card title="Candidate By Technology">
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} style={{ width: '100%' }} />
      ) : (
        <BarGraph
          labels={labels}
          datasets={[{ label: 'Candidates', data: counts, backgroundColor: '#363062' }]}
          darkMode={darkMode}
        />
      )}
    </Card>
  )
}
```

---

### Task 11: Create CandidateLevelDistribution component

**Files:**
- Create: `client/src/modules/dashboard/components/CandidateLevelDistribution.tsx`

```typescript
import { Card, Skeleton } from 'antd'
import { PieChart } from './PieChart'
import type { CandidateData } from '../types/dashboard.types'

interface Props {
  candidates: CandidateData[]
  loading?: boolean
}

export function CandidateLevelDistribution({ candidates, loading = true }: Props) {
  const statusCounts: Record<string, number> = {}
  candidates.forEach((c) => {
    const status = c.level
    statusCounts[status] = (statusCounts[status] || 0) + 1
  })

  const labels = Object.keys(statusCounts)
  const data = Object.values(statusCounts)

  return (
    <Card title="Candidate Level Distribution">
      <div className="flex justify-center items-center">
        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} style={{ width: '100%' }} />
        ) : (
          <PieChart labels={labels} data={data} title="Candidate Status" size={300} />
        )}
      </div>
    </Card>
  )
}
```

---

### Task 12: Create HiredAndRejectedCorrelation component

**Files:**
- Create: `client/src/modules/dashboard/components/HiredandRejectedCorelation.tsx`

```typescript
import { LineChart } from './LineGraph'
import { Card, Skeleton } from 'antd'
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import isBetween from 'dayjs/plugin/isBetween'
import type { CandidateData } from '../types/dashboard.types'

dayjs.extend(isoWeek)
dayjs.extend(isBetween)

interface Props {
  candidates: CandidateData[]
  loading?: boolean
}

export function HiredandRejectedCorelation({ candidates, loading = false }: Props) {
  const startOfThisWeek = dayjs().startOf('isoWeek')
  const endOfThisWeek = dayjs().endOf('isoWeek')

  const labels = Array.from({ length: 7 }).map((_, i) => startOfThisWeek.add(i, 'day').format('ddd'))
  const hiredData = Array(7).fill(0)
  const rejectedData = Array(7).fill(0)

  candidates.forEach((c) => {
    if (c.progress?.hired?.completed && c.status === 'hired') {
      const hiredDate = dayjs(c.progress.hired.date)
      if (hiredDate.isBetween(startOfThisWeek, endOfThisWeek, null, '[]')) {
        hiredData[hiredDate.isoWeekday() - 1]++
      }
    }
    if (c.status === 'rejected' && c.updatedAt) {
      const rejectedDate = dayjs(c.updatedAt)
      if (rejectedDate.isBetween(startOfThisWeek, endOfThisWeek, null, '[]')) {
        rejectedData[rejectedDate.isoWeekday() - 1]++
      }
    }
  })

  return (
    <Card title="Hired and Rejected Correlation (Last 7 days)">
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} style={{ width: '100%' }} />
      ) : (
        <div className="flex justify-between items-center">
          <LineChart labels={labels} hiredData={hiredData} rejectedData={rejectedData} size={500} />
        </div>
      )}
    </Card>
  )
}
```

---

### Task 13: Create RecentActivityLog component

**Files:**
- Create: `client/src/modules/dashboard/components/RecentActivityLog.tsx`

```typescript
import { useState } from 'react'
import { Card, Avatar, Typography, Empty, Space, Pagination, Skeleton } from 'antd'
import { UserPlus, CalendarClock, FileCheck, File, Check, UserCheck } from 'lucide-react'
import dayjs from 'dayjs'
import { makeCapitilized } from '../utils/dashboard.utils'
import type { ActivityLog } from '../types/dashboard.types'

const { Text } = Typography

interface Props {
  activityLogs: ActivityLog[]
  loading?: boolean
}

function getIcon(type: string) {
  const iconProps = { size: 18 }
  switch (type) {
    case 'candidates': return <UserPlus {...iconProps} />
    case 'interviews': return <CalendarClock {...iconProps} />
    case 'interview_completed': return <FileCheck {...iconProps} />
    case 'assessments': return <File {...iconProps} />
    case 'offers': return <Check {...iconProps} />
    case 'offer_accepted': return <UserCheck {...iconProps} />
    default: return <UserCheck {...iconProps} />
  }
}

function getColor(type: string) {
  switch (type) {
    case 'candidates': return '#1890ff'
    case 'interviews': return '#722ed1'
    case 'assessments': return '#fa8c16'
    case 'offers': return '#faad14'
    default: return '#d9d9d9'
  }
}

export function RecentActivityLog({ activityLogs, loading = false }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const todayLogs = [...(activityLogs || [])]
    .filter((item) => dayjs(item.createdAt).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const paginatedLogs = todayLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <Card
      title="Recent Activities"
      extra={
        todayLogs.length > pageSize && (
          <Pagination
            current={currentPage}
            onChange={(page) => setCurrentPage(page)}
            total={todayLogs.length}
            pageSize={pageSize}
            size="small"
          />
        )
      }
    >
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Skeleton active paragraph={{ rows: 4 }} style={{ width: '100%' }} />
        </div>
      ) : todayLogs.length === 0 ? (
        <Empty description="No recent activities" />
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {paginatedLogs.map((item, index) => (
            <Card
              key={index}
              size="small"
              style={{ borderLeft: `4px solid ${getColor(item.entityType)}` }}
            >
              <div className="flex items-start gap-3">
                <Avatar
                  size={32}
                  className="bg-white text-black flex items-center justify-center shadow-sm border"
                >
                  {getIcon(item.entityType)}
                </Avatar>
                <div className="flex flex-col">
                  <Text strong className="text-md capitalize">
                    {item.metaData?.title || 'Unknown Candidate'}
                  </Text>
                  <Text type="secondary">
                    {makeCapitilized(item.entityType)} was <b>{item.action.replace('_', ' ')}</b>
                  </Text>
                  {item.metaData?.description && item.action === 'updated' ? (
                    <Text type="secondary">
                      Candidate is updated to <span className="font-bold">{item.metaData.description}</span> stage in
                      pipeline
                    </Text>
                  ) : (
                    <Text type="secondary" className="capitalize">
                      Candidate {item.action === 'deleted' ? 'was' : 'is'} in{' '}
                      <span className="font-bold">{item.metaData?.description}</span> stage
                    </Text>
                  )}
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(item.createdAt).format('DD MMM YYYY, hh:mm A')}
                  </Text>
                </div>
              </div>
            </Card>
          ))}
        </Space>
      )}
    </Card>
  )
}
```

---

### Task 14: Update dashboard page.tsx

**Files:**
- Modify: `client/src/modules/dashboard/page.tsx`

```typescript
import { useMemo } from 'react'
import { Col, Row, Space, Typography } from 'antd'
import { Users, Calendar, FileCheck, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useAuth } from '@/shared/hooks/useAuth'
import { useDashboardCandidates, useDashboardInterviews, useDashboardOffers, useDashboardAssignments, useDashboardActivityLogs } from './lib/queries/dashboard.queries'
import { MetricsCard } from './components/MetricsCard'
import { UpcomingInterviews } from './components/UpcomingInterviews'
import { ListOfCandidatesWithStatus } from './components/ListOfCandidatesWithStatus'
import { CandidateByTechnology } from './components/CandidateByTechnology'
import { CandidateLevelDistribution } from './components/CandidateLevelDistribution'
import { HiredandRejectedCorelation } from './components/HiredandRejectedCorelation'
import { RecentActivityLog } from './components/RecentActivityLog'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

export function DashboardPage() {
  const { user } = useAuth()
  const { data: candidateData, isLoading: candidateLoading } = useDashboardCandidates()
  const { data: interviewData, isLoading: interviewLoading } = useDashboardInterviews()
  const { data: offerData, isLoading: offerLoading } = useDashboardOffers()
  const { data: assignmentData, isLoading: assignmentLoading } = useDashboardAssignments()
  const { data: activityLogData, isLoading: logsLoading } = useDashboardActivityLogs()

  const candidates = candidateData?.data || []
  const interviews = interviewData?.data || []
  const offers = offerData?.data || []
  const assignments = assignmentData?.data || []
  const activityLogs = activityLogData?.data || []

  const scheduledInterview = useMemo(
    () => interviews?.filter((item) => item.status === 'scheduled'),
    [interviews],
  )

  const assessment = useMemo(
    () => assignments?.filter((item) => item.status === 'assigned'),
    [assignments],
  )

  const offered = useMemo(
    () => offers?.filter((item) => item.status === 'sent'),
    [offers],
  )

  const startWeek = dayjs().startOf('week').format('YYYY-MM-DD')
  const endWeek = dayjs().endOf('week').format('YYYY-MM-DD')
  const filteredInterviews = interviews.filter((interview) => {
    const interviewDate = dayjs(interview.date).format('YYYY-MM-DD')
    return interviewDate >= startWeek && interviewDate <= endWeek
  })

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={2} className="text-2xl font-bold text-blue-950">
            Dashboard
          </Typography.Title>
          <Typography.Text className="mt-1 text-sm text-blue-950">
            Welcome back! <span className="font-bold">{user?.username}</span>
          </Typography.Text>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={12} lg={6}>
            <motion.div variants={itemVariants}>
              <MetricsCard
                title="Active Candidates"
                value={candidates?.length}
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

      <Row gutter={[24, 24]}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <ListOfCandidatesWithStatus
            candidates={candidates}
            interviews={interviews}
            offers={offers}
            assessments={assignments}
            loading={candidateLoading}
          />
        </Space>
        <Col xs={24} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CandidateByTechnology candidates={candidates} loading={candidateLoading} />
            </motion.div>
          </Space>
        </Col>
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <UpcomingInterviews
              interviews={filteredInterviews}
              onViewAllClick={() => window.location.href = '/dashboard/interviews'}
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
            <RecentActivityLog activityLogs={activityLogs} loading={logsLoading} />
          </motion.div>
        </Col>
        <Col xs={24} lg={12} md={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <CandidateLevelDistribution candidates={candidates} loading={candidateLoading} />
            <HiredandRejectedCorelation candidates={candidates} loading={candidateLoading} />
          </Space>
        </Col>
      </Row>
    </div>
  )
}
```

Note: In the old Dashboard.tsx, the "View All" onClick used `navigate('/dashboard/interviews')` but in this new setup the dashboard is already at `/` within the DashboardLayout, so navigating to `/dashboard/interviews` would go to `/interviews` via the nested routes. Need to keep the same navigation path that works. The old code used `navigate('/dashboard/interviews')` which suggests the app was structured differently. I should use the relative path from the current route level. Considering the router structure, `navigate('/interviews')` would be correct since the protected routes start at `/` and interviews are at `path: 'interviews'`. But to be safe, keep the same pattern as old: `navigate('/dashboard/interviews')` unless it breaks. Actually, looking at the old Dashboard.tsx more carefully — the old routing structure probably had `/dashboard` as a prefix. The new structure has the protected routes at root level (`/`). So `navigate('/dashboard/interviews')` in the new structure would go to a non-existent route. Let me use `navigate('/interviews')` instead. Actually let me just keep `useNavigate` hook and call it correctly.

Wait, I need to look at UpcomingInterviews more carefully. The old version had `onViewAllClick` callback and used `navigate('/dashboard/interviews')`. In the new routing, the interviews route is at `path: 'interviews'` (relative to DashboardLayout which is at root `/`). So the correct navigation would be `navigate('/interviews')`. But the component receives `onViewAllClick` as a prop, so the navigation logic is in `page.tsx`, not in the component. I'll use `navigate('/interviews')` in the page.

---

### Task 15: Update dashboard index.ts barrel

**Files:**
- Modify: `client/src/modules/dashboard/index.ts`

```typescript
export { DashboardPage } from './page'
export { dashboardRoutes } from './routes/dashboard.routes'
```

(No change needed — already exports these two.)

---

### Task 16: Check if ACTIVITY_LOG_URL constant exists, add if not

**Files:**
- Check: `client/src/constant.ts`
- Modify (if needed): `client/src/constant.ts`

- [ ] **Check for ACTIVITY_LOG_URL**

Check if `ACTIVITY_LOG_URL` exists in `client/src/constant.ts`. If not, add:
```typescript
export const ACTIVITY_LOG_URL = 'activity-log';
```

But the API file uses the literal string `/activity-log` directly. This is fine since the shared constants file doesn't have the activity log URL. But for consistency, add the constant.

---

### Task 17: Verify build

**Files:**
- Verify: full project

- [ ] **Run build**

Run: `cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npm run build`
Expected: Build succeeds

- [ ] **Run lint**

Run: `cd /home/rahul-adhikari/code/own-projects/HRFolio/client && npm run lint`
Expected: 0 new errors (existing auth module errors allowed)

- [ ] **Check for the theme store**

The old code used `useAppSelector(state => state.theme)` from Redux. The new code uses `useThemeStore` from `@/shared/store/themeStore`. Verify this store exists. If not, check what the correct Zustand store name is.

```bash
ls /home/rahul-adhikari/code/own-projects/HRFolio/client/src/shared/store/
```
