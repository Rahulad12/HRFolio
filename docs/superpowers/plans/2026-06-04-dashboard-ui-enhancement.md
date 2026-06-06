# Dashboard UI Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the HRFolio dashboard with a Dark Analytics style — enhanced KPI cards with sparklines, a Kanban pipeline board, and polished charts/activity panels — while preserving full light/dark mode compatibility.

**Architecture:** Pure UI-layer refactor across 11 files in `client/src/modules/dashboard/`. No API, query, type, or route changes. All components receive the same or extended props; only rendering logic and styles change. Theme compatibility is handled via Tailwind `dark:` variants and the existing Ant Design `ConfigProvider` driven by Zustand `theme.store`.

**Tech Stack:** React 18, TypeScript, Ant Design v5, Tailwind CSS v4, Framer Motion v12, Chart.js v4 / react-chartjs-2 v5, Lucide React, Zustand

---

## File Map

| File | Change |
|------|--------|
| `client/src/modules/dashboard/components/MetricsCard.tsx` | Refactor — add `accentColor`, `trend`, `sparklineData` props; inline SVG sparkline |
| `client/src/modules/dashboard/components/BarGraph.tsx` | Update — add `horizontal` prop; dark-theme Chart.js options |
| `client/src/modules/dashboard/components/PieChart.tsx` | Update — switch `Pie` → `Doughnut`; `cutout: '65%'`; CSS center-label overlay |
| `client/src/modules/dashboard/components/LineGraph.tsx` | Update — `fill: true` area; dark-theme options; remove built-in legend |
| `client/src/modules/dashboard/components/CandidateByTechnology.tsx` | Minor — pass `horizontal` + indigo color |
| `client/src/modules/dashboard/components/CandidateLevelDistribution.tsx` | Minor — custom legend beside donut |
| `client/src/modules/dashboard/components/HiredandRejectedCorelation.tsx` | Minor — legend pills; pass dark-theme config |
| `client/src/modules/dashboard/components/UpcomingInterviews.tsx` | Refactor — initials avatar; dark card rows; pill toggle |
| `client/src/modules/dashboard/components/RecentActivityLog.tsx` | Refactor — vertical timeline with connecting line |
| `client/src/modules/dashboard/components/ListOfCandidatesWithStatus.tsx` | Major refactor — Kanban columns (8 stages, no top border) |
| `client/src/modules/dashboard/page.tsx` | Update — 3-zone grid; derive sparkline data; pass new props |

---

## Task 1: MetricsCard — sparkline, trend badge, accent styling

**Files:**
- Modify: `client/src/modules/dashboard/components/MetricsCard.tsx`

- [ ] **Step 1: Replace the file with the new implementation**

```tsx
import type { ReactNode } from 'react'
import { Skeleton } from 'antd'
import { useNavigate } from 'react-router-dom'

interface TrendBadge {
  label: string
  type: 'up' | 'neutral' | 'down'
}

interface MetricsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  link?: string
  loading?: boolean
  accentColor: string
  trend?: TrendBadge
  sparklineData?: number[]
}

function Sparkline({ data, accentColor }: { data: number[]; accentColor: string }) {
  const max = Math.max(...data, 1)
  return (
    <svg width="56" height="24" viewBox="0 0 56 24" aria-hidden="true">
      {data.map((v, i) => {
        const h = Math.max(2, Math.round((v / max) * 22))
        const opacity = 0.3 + (i / (data.length - 1)) * 0.7
        return (
          <rect
            key={i}
            x={i * 8}
            y={24 - h}
            width="6"
            height={h}
            rx="2"
            fill={accentColor}
            fillOpacity={opacity}
          />
        )
      })}
    </svg>
  )
}

const trendStyles: Record<TrendBadge['type'], string> = {
  up: 'text-emerald-400 bg-emerald-400/10',
  neutral: 'text-amber-400 bg-amber-400/10',
  down: 'text-red-400 bg-red-400/10',
}

export function MetricsCard({
  title,
  value,
  icon,
  link,
  loading,
  accentColor,
  trend,
  sparklineData,
}: MetricsCardProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 dark:border-slate-700 dark:bg-slate-800">
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            {title}
          </p>
          <p
            className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-slate-100"
            style={{ lineHeight: 1 }}
          >
            {value}
          </p>
          {trend && (
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${trendStyles[trend.type]}`}
            >
              {trend.label}
            </span>
          )}
        </div>
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accentColor}26` }}
        >
          {icon}
        </div>
      </div>
      {sparklineData && sparklineData.length === 7 && (
        <div className="mt-3">
          <Sparkline data={sparklineData} accentColor={accentColor} />
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/MetricsCard.tsx
git commit -m "feat(dashboard): refactor MetricsCard with sparkline, trend badge, accent styling"
```

---

## Task 2: BarGraph — horizontal bars + dark-theme Chart.js options

**Files:**
- Modify: `client/src/modules/dashboard/components/BarGraph.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

interface BarGraphProps {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
  }[]
  darkMode?: boolean
  horizontal?: boolean
}

export function BarGraph({ labels, datasets, darkMode, horizontal }: BarGraphProps) {
  const gridColor = darkMode ? '#1e293b' : '#e2e8f0'
  const tickColor = darkMode ? '#94a3b8' : '#6b7280'

  const adjustedDatasets = datasets.map((d) => ({
    ...d,
    backgroundColor: d.backgroundColor ?? (darkMode ? '#6366f1' : '#363062'),
    borderRadius: 4,
    borderSkipped: false,
  }))

  const options = {
    indexAxis: (horizontal ? 'y' : 'x') as 'x' | 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: tickColor },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: tickColor },
      },
    },
  }

  return <Bar data={{ labels, datasets: adjustedDatasets }} options={options} />
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/BarGraph.tsx
git commit -m "feat(dashboard): update BarGraph with horizontal support and dark-theme config"
```

---

## Task 3: PieChart — donut style + CSS center label + dark theme

**Files:**
- Modify: `client/src/modules/dashboard/components/PieChart.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'

ChartJS.register(ArcElement, Tooltip)

interface PieChartProps {
  labels: string[]
  data: number[]
  backgroundColor?: string[]
  darkMode?: boolean
}

export function PieChart({ labels, data, backgroundColor, darkMode }: PieChartProps) {
  const total = data.reduce((a, b) => a + b, 0)

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColor || ['#6366f1', '#f59e0b', '#22c55e'],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; raw: unknown }) =>
            `${ctx.label}: ${ctx.raw}`,
        },
      },
    },
  }

  return (
    <div className="relative" style={{ width: 120, height: 120 }}>
      <Doughnut data={chartData} options={options} />
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
          {total}
        </span>
        <span className="text-xs text-slate-400">total</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/PieChart.tsx
git commit -m "feat(dashboard): convert PieChart to donut with center total label"
```

---

## Task 4: LineGraph — area fill + dark theme + no built-in legend

**Files:**
- Modify: `client/src/modules/dashboard/components/LineGraph.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip)

interface LineChartProps {
  labels: string[]
  hiredData: number[]
  rejectedData: number[]
  darkMode?: boolean
}

export function LineChart({ labels, hiredData, rejectedData, darkMode }: LineChartProps) {
  const gridColor = darkMode ? '#1e293b' : '#e2e8f0'
  const tickColor = darkMode ? '#94a3b8' : '#6b7280'

  const data = {
    labels,
    datasets: [
      {
        label: 'Hired',
        data: hiredData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#22c55e',
      },
      {
        label: 'Rejected',
        data: rejectedData,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239,68,68,0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#ef4444',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: tickColor },
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: tickColor },
        beginAtZero: true,
      },
    },
  }

  return <Line data={data} options={options} />
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/LineGraph.tsx
git commit -m "feat(dashboard): update LineGraph with area fill and dark-theme options"
```

---

## Task 5: CandidateByTechnology — horizontal bars + indigo color

**Files:**
- Modify: `client/src/modules/dashboard/components/CandidateByTechnology.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { Card, Skeleton } from 'antd'
import { BarGraph } from './BarGraph'
import { useThemeStore } from '@/shared/store/theme.store'
import type { CandidateData } from '../types/dashboard.types'

interface Props {
  candidates: CandidateData[]
  loading?: boolean
}

export function CandidateByTechnology({ candidates, loading = true }: Props) {
  const darkMode = useThemeStore((s) => s.mode === 'dark')

  const techCount: Record<string, number> = {}
  candidates.forEach((c) => {
    const tech = c.technology?.trim().toLowerCase() || 'unknown'
    techCount[tech] = (techCount[tech] || 0) + 1
  })

  const sorted = Object.entries(techCount).sort((a, b) => b[1] - a[1])
  const labels = sorted.map(([k]) => k)
  const counts = sorted.map(([, v]) => v)

  return (
    <Card title="Tech Distribution">
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <BarGraph
          labels={labels}
          datasets={[{ label: 'Candidates', data: counts, backgroundColor: '#6366f1' }]}
          darkMode={darkMode}
          horizontal
        />
      )}
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/CandidateByTechnology.tsx
git commit -m "feat(dashboard): update CandidateByTechnology with horizontal bars and indigo color"
```

---

## Task 6: CandidateLevelDistribution — donut + custom side legend

**Files:**
- Modify: `client/src/modules/dashboard/components/CandidateLevelDistribution.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { Card, Skeleton } from 'antd'
import { PieChart } from './PieChart'
import { useThemeStore } from '@/shared/store/theme.store'
import type { CandidateData } from '../types/dashboard.types'

interface Props {
  candidates: CandidateData[]
  loading?: boolean
}

const LEVEL_COLORS: Record<string, string> = {
  senior: '#6366f1',
  mid: '#f59e0b',
  junior: '#22c55e',
}

export function CandidateLevelDistribution({ candidates, loading = true }: Props) {
  const darkMode = useThemeStore((s) => s.mode === 'dark')

  const levelCount: Record<string, number> = {}
  candidates.forEach((c) => {
    const lvl = c.level?.toLowerCase() || 'unknown'
    levelCount[lvl] = (levelCount[lvl] || 0) + 1
  })

  const labels = Object.keys(levelCount)
  const data = Object.values(levelCount)
  const total = data.reduce((a, b) => a + b, 0)
  const backgroundColor = labels.map((l) => LEVEL_COLORS[l] ?? '#94a3b8')

  return (
    <Card title="Level Distribution">
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <div className="flex items-center gap-6">
          <PieChart labels={labels} data={data} backgroundColor={backgroundColor} darkMode={darkMode} />
          <div className="flex flex-col gap-2">
            {labels.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 flex-shrink-0 rounded-sm"
                  style={{ backgroundColor: backgroundColor[i] }}
                />
                <span className="text-xs capitalize text-slate-400">{label}</span>
                <span className="ml-auto text-xs font-semibold text-slate-200 dark:text-slate-200">
                  {total > 0 ? `${Math.round((data[i] / total) * 100)}%` : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/CandidateLevelDistribution.tsx
git commit -m "feat(dashboard): update CandidateLevelDistribution with donut and custom legend"
```

---

## Task 7: HiredandRejectedCorelation — area fill + inline legend pills

**Files:**
- Modify: `client/src/modules/dashboard/components/HiredandRejectedCorelation.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { LineChart } from './LineGraph'
import { Card, Skeleton } from 'antd'
import { useThemeStore } from '@/shared/store/theme.store'
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
  const darkMode = useThemeStore((s) => s.mode === 'dark')

  const startOfThisWeek = dayjs().startOf('isoWeek')
  const endOfThisWeek = dayjs().endOf('isoWeek')

  const labels = Array.from({ length: 7 }, (_, i) =>
    startOfThisWeek.add(i, 'day').format('ddd'),
  )
  const hiredData = Array(7).fill(0)
  const rejectedData = Array(7).fill(0)

  candidates.forEach((c) => {
    if (c.progress?.hired?.completed && c.status === 'hired') {
      const d = dayjs(c.progress.hired.date)
      if (d.isBetween(startOfThisWeek, endOfThisWeek, null, '[]')) {
        hiredData[d.isoWeekday() - 1]++
      }
    }
    if (c.status === 'rejected' && c.updatedAt) {
      const d = dayjs(c.updatedAt)
      if (d.isBetween(startOfThisWeek, endOfThisWeek, null, '[]')) {
        rejectedData[d.isoWeekday() - 1]++
      }
    }
  })

  return (
    <Card
      title="Hired vs Rejected"
      extra={
        <div className="flex gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="inline-block h-0.5 w-3 rounded bg-emerald-400" />
            Hired
          </span>
          <span className="flex items-center gap-1.5 text-xs text-red-400">
            <span className="inline-block h-0.5 w-3 rounded bg-red-400" />
            Rejected
          </span>
        </div>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <LineChart labels={labels} hiredData={hiredData} rejectedData={rejectedData} darkMode={darkMode} />
      )}
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/HiredandRejectedCorelation.tsx
git commit -m "feat(dashboard): update HiredandRejectedCorelation with inline legend pills"
```

---

## Task 8: UpcomingInterviews — initials avatar, dark rows, pill toggle

**Files:**
- Modify: `client/src/modules/dashboard/components/UpcomingInterviews.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { useState } from 'react'
import { Card, Empty } from 'antd'
import dayjs from 'dayjs'
import type { RadioChangeEvent } from 'antd'
import type { InterviewData } from '../types/dashboard.types'

interface Props {
  interviews: InterviewData[]
  onViewAllClick?: () => void
  loading?: boolean
}

const levelColors: Record<string, string> = {
  senior: 'bg-indigo-900 text-indigo-300',
  mid: 'bg-amber-900/60 text-amber-300',
  junior: 'bg-emerald-900/60 text-emerald-300',
}

const avatarColors: Record<string, string> = {
  senior: 'bg-indigo-900 text-indigo-300',
  mid: 'bg-amber-900/60 text-amber-300',
  junior: 'bg-emerald-900/60 text-emerald-400',
}

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function UpcomingInterviews({ interviews, onViewAllClick, loading = false }: Props) {
  const [filterType, setFilterType] = useState<'today' | 'week'>('today')

  const filtered = interviews.filter((iv) => {
    const d = dayjs(iv.date)
    const today = dayjs().startOf('day')
    if (iv.status !== 'scheduled') return false
    if (filterType === 'today') return d.isSame(today, 'day')
    return d.isSame(today.startOf('week'), 'day') || (d.isAfter(today.startOf('week')) && d.isBefore(today.endOf('week'))) || d.isSame(today.endOf('week'), 'day')
  })

  return (
    <Card
      title="Upcoming Interviews"
      loading={loading}
      extra={
        <div className="flex gap-1 rounded-lg bg-slate-800 p-1">
          {(['today', 'week'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterType(v)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filterType === v
                  ? 'bg-slate-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {v === 'today' ? 'Today' : 'This Week'}
            </button>
          ))}
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Empty description="No upcoming interviews" />
        ) : (
          filtered.slice(0, 5).map((iv) => {
            const level = iv.candidate?.level?.toLowerCase() ?? 'junior'
            return (
              <div
                key={iv._id}
                className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${avatarColors[level] ?? 'bg-slate-700 text-slate-200'}`}
                >
                  {getInitials(iv.candidate?.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold capitalize text-slate-100">
                    {iv.candidate?.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    with {iv.interviewer?.name}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold text-amber-400">
                    {dayjs(iv.time).format('hh:mm A')}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs font-semibold capitalize ${levelColors[level] ?? 'bg-slate-700 text-slate-300'}`}
                  >
                    {level}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
      {filtered.length > 0 && (
        <div className="mt-3 text-right">
          <button
            onClick={onViewAllClick}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
          >
            View all interviews →
          </button>
        </div>
      )}
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/UpcomingInterviews.tsx
git commit -m "feat(dashboard): refactor UpcomingInterviews with initials avatar and pill toggle"
```

---

## Task 9: RecentActivityLog — vertical timeline with connecting line

**Files:**
- Modify: `client/src/modules/dashboard/components/RecentActivityLog.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { Card, Empty, Skeleton } from 'antd'
import { UserPlus, CalendarClock, FileCheck, File, Check, UserCheck } from 'lucide-react'
import dayjs from 'dayjs'
import { makeCapitilized } from '../utils/dashboard.utils'
import type { ActivityLog } from '../types/dashboard.types'

interface Props {
  activityLogs: ActivityLog[]
  loading?: boolean
}

function getIcon(type: string) {
  const cls = 'h-4 w-4'
  switch (type) {
    case 'candidates': return <UserPlus className={cls} />
    case 'interviews': return <CalendarClock className={cls} />
    case 'interview_completed': return <FileCheck className={cls} />
    case 'assessments': return <File className={cls} />
    case 'offers': return <Check className={cls} />
    case 'offer_accepted': return <UserCheck className={cls} />
    default: return <UserCheck className={cls} />
  }
}

const entityAccent: Record<string, { icon: string; text: string }> = {
  candidates: { icon: 'bg-indigo-500/20 text-indigo-400', text: 'text-indigo-400' },
  interviews: { icon: 'bg-blue-500/20 text-blue-400', text: 'text-blue-400' },
  interview_completed: { icon: 'bg-blue-500/20 text-blue-400', text: 'text-blue-400' },
  assessments: { icon: 'bg-amber-500/20 text-amber-400', text: 'text-amber-400' },
  offers: { icon: 'bg-emerald-500/20 text-emerald-400', text: 'text-emerald-400' },
  offer_accepted: { icon: 'bg-emerald-500/20 text-emerald-400', text: 'text-emerald-400' },
}

export function RecentActivityLog({ activityLogs, loading = false }: Props) {
  const todayLogs = [...(activityLogs || [])]
    .filter((item) => dayjs(item.createdAt).isSame(dayjs(), 'day'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card title="Recent Activity">
      {loading ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : todayLogs.length === 0 ? (
        <Empty description="No activity today" />
      ) : (
        <div className="flex flex-col">
          {todayLogs.map((item, index) => {
            const accent = entityAccent[item.entityType] ?? { icon: 'bg-slate-700 text-slate-400', text: 'text-slate-400' }
            const isLast = index === todayLogs.length - 1
            return (
              <div key={index} className="flex gap-3">
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${accent.icon}`}>
                    {getIcon(item.entityType)}
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-slate-700 my-1" />}
                </div>
                {/* Content */}
                <div className={`flex-1 min-w-0 ${!isLast ? 'pb-4' : ''}`}>
                  <p className="text-sm text-slate-200 leading-snug">
                    <span className={`font-semibold capitalize ${accent.text}`}>
                      {item.metaData?.title ?? 'Unknown'}
                    </span>{' '}
                    {item.action === 'updated'
                      ? `moved to ${item.metaData?.description ?? ''} stage`
                      : `was ${item.action.replace('_', ' ')}`}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {dayjs(item.createdAt).format('hh:mm A')}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/RecentActivityLog.tsx
git commit -m "feat(dashboard): refactor RecentActivityLog with vertical timeline"
```

---

## Task 10: ListOfCandidatesWithStatus — Kanban columns

**Files:**
- Modify: `client/src/modules/dashboard/components/ListOfCandidatesWithStatus.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import { Card, DatePicker, Input, Skeleton } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { CandidateData, InterviewData, OfferData, AssignmentData } from '../types/dashboard.types'

dayjs.extend(isBetween)

interface Props {
  candidates: CandidateData[]
  interviews: InterviewData[]
  offers: OfferData[]
  assessments: AssignmentData[]
  loading?: boolean
}

interface KanbanColumn {
  title: string
  key: string
  statusKeys: string[]
  headerColor: string
  badgeBg: string
  badgeText: string
  tagBg: string
  tagText: string
  dimmed?: boolean
}

const COLUMNS: KanbanColumn[] = [
  { title: 'Shortlisted', key: 'shortlisted', statusKeys: ['shortlisted'], headerColor: 'text-indigo-400', badgeBg: 'bg-indigo-900', badgeText: 'text-indigo-300', tagBg: 'bg-indigo-900', tagText: 'text-indigo-300' },
  { title: 'Assessment', key: 'assessment', statusKeys: ['assessment'], headerColor: 'text-amber-400', badgeBg: 'bg-amber-900/60', badgeText: 'text-amber-300', tagBg: 'bg-amber-900/60', tagText: 'text-amber-300' },
  { title: '1st Interview', key: 'first', statusKeys: ['first'], headerColor: 'text-blue-400', badgeBg: 'bg-blue-900/60', badgeText: 'text-blue-300', tagBg: 'bg-blue-900/60', tagText: 'text-blue-300' },
  { title: '2nd Interview', key: 'second', statusKeys: ['second'], headerColor: 'text-sky-400', badgeBg: 'bg-sky-900/60', badgeText: 'text-sky-300', tagBg: 'bg-sky-900/60', tagText: 'text-sky-300' },
  { title: '3rd Interview', key: 'third', statusKeys: ['third'], headerColor: 'text-cyan-400', badgeBg: 'bg-cyan-900/60', badgeText: 'text-cyan-300', tagBg: 'bg-cyan-900/60', tagText: 'text-cyan-300' },
  { title: 'Offered', key: 'offered', statusKeys: ['offered'], headerColor: 'text-orange-400', badgeBg: 'bg-orange-900/60', badgeText: 'text-orange-300', tagBg: 'bg-orange-900/60', tagText: 'text-orange-300' },
  { title: 'Hired', key: 'hired', statusKeys: ['hired'], headerColor: 'text-emerald-400', badgeBg: 'bg-emerald-900/60', badgeText: 'text-emerald-300', tagBg: 'bg-emerald-900/60', tagText: 'text-emerald-300' },
  { title: 'Rejected', key: 'rejected', statusKeys: ['rejected'], headerColor: 'text-red-400', badgeBg: 'bg-red-900/60', badgeText: 'text-red-300', tagBg: 'bg-red-900/60', tagText: 'text-red-300', dimmed: true },
]

export function ListOfCandidatesWithStatus({ candidates, loading = true }: Props) {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null])

  const filterForColumn = useCallback(
    (col: KanbanColumn) =>
      candidates.filter((c) => {
        if (!col.statusKeys.includes(c.status)) return false
        if (dateRange[0] && dateRange[1]) {
          const created = dayjs(c.createdAt)
          if (!created.isBetween(dateRange[0].startOf('day'), dateRange[1].endOf('day'), null, '[]')) return false
        }
        if (searchText && !(
          c.name.toLowerCase().includes(searchText.toLowerCase()) ||
          c.technology.toLowerCase().includes(searchText.toLowerCase())
        )) return false
        return true
      }),
    [candidates, dateRange, searchText],
  )

  return (
    <Card
      title="Hiring Pipeline"
      extra={
        <div className="flex gap-2">
          <Input
            placeholder="Search name or tech…"
            size="small"
            prefix={<Search size={14} />}
            style={{ width: 180 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <DatePicker.RangePicker
            size="small"
            onChange={(dates) => setDateRange((dates as [Dayjs | null, Dayjs | null]) ?? [null, null])}
          />
        </div>
      }
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3" style={{ minWidth: `${COLUMNS.length * 180}px` }}>
            {COLUMNS.map((col) => {
              const items = filterForColumn(col)
              const visible = items.slice(0, 3)
              const overflow = items.length - visible.length
              return (
                <div
                  key={col.key}
                  className={`flex-1 min-w-[160px] rounded-lg border border-slate-800 bg-slate-950 p-2 dark:border-slate-800 dark:bg-slate-950 ${col.dimmed ? 'opacity-70' : ''}`}
                >
                  {/* Column header */}
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`text-xs font-bold uppercase tracking-wide ${col.headerColor}`}>
                      {col.title}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${col.badgeBg} ${col.badgeText}`}>
                      {items.length}
                    </span>
                  </div>
                  {/* Candidate cards */}
                  <div className="flex flex-col gap-1.5">
                    {visible.map((c) => (
                      <div
                        key={c._id}
                        className="cursor-pointer rounded-md bg-slate-800 p-2 transition-colors hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                        onClick={() => navigate(`/dashboard/candidates/${c._id}`)}
                      >
                        <p className="truncate text-xs font-semibold capitalize text-slate-100">
                          {c.name}
                        </p>
                        <div className="mt-1.5 flex gap-1">
                          <span className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${col.tagBg} ${col.tagText}`}>
                            {c.technology}
                          </span>
                          <span className="rounded border border-slate-600 px-1.5 py-0.5 text-xs capitalize text-slate-400">
                            {c.level}
                          </span>
                        </div>
                      </div>
                    ))}
                    {overflow > 0 && (
                      <p className="text-center text-xs text-slate-500">+{overflow} more</p>
                    )}
                    {items.length === 0 && (
                      <p className="py-3 text-center text-xs text-slate-600">—</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/modules/dashboard/components/ListOfCandidatesWithStatus.tsx
git commit -m "feat(dashboard): replace status list with Kanban pipeline columns"
```

---

## Task 11: dashboard/page.tsx — 3-zone layout + sparkline data

**Files:**
- Modify: `client/src/modules/dashboard/page.tsx`

- [ ] **Step 1: Replace the file**

```tsx
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

  // Sparklines — last 7 days counts
  const candidateSparkline = useMemo(() => last7DayCounts(candidates), [candidates])
  const interviewSparkline = useMemo(() => last7DayCounts(interviews), [interviews])
  const offerSparkline = useMemo(() => last7DayCounts(offers), [offers])
  const assignmentSparkline = useMemo(() => last7DayCounts(assignments), [assignments])

  // Trends
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
      {/* Page header */}
      <div>
        <Typography.Title level={2} className="!mb-0 text-2xl font-bold">
          Dashboard
        </Typography.Title>
        <Typography.Text className="text-sm text-slate-400">
          Welcome back, <span className="font-semibold text-slate-200">{user?.username}</span>
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
        {/* Row 1: Charts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CandidateByTechnology candidates={candidates} loading={candidateLoading} />
          <CandidateLevelDistribution candidates={candidates} loading={candidateLoading} />
          <HiredandRejectedCorelation candidates={candidates} loading={candidateLoading} />
        </div>

        {/* Row 2: Interviews + Activity */}
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
```

- [ ] **Step 2: Start the dev server and verify visually**

```bash
cd client && npm run dev
```

Open `http://localhost:5173/dashboard` and check:
- 4 KPI cards with sparklines render in a 2×2 grid on mobile and 4-column on desktop
- Each card shows the correct number, trend badge, and sparkline bars
- Kanban board renders 8 columns, horizontally scrollable on small screens
- Search input and date picker in Kanban header are functional
- 3 charts render side-by-side below the Kanban
- Upcoming Interviews shows initials avatar and pill toggle (Today / This Week)
- Activity feed shows the timeline with connecting line
- Toggle the theme (dark ↔ light) — all panels adapt cleanly

- [ ] **Step 3: Commit**

```bash
git add client/src/modules/dashboard/page.tsx
git commit -m "feat(dashboard): implement 3-zone layout with sparkline data and trend badges"
```

---

## Self-Review Checklist

After completing all tasks, run through these checks before marking done:

- [ ] `npm run build` (or `tsc --noEmit`) passes with no TypeScript errors
- [ ] Dark mode toggle visually switches all dashboard panels cleanly
- [ ] Kanban board is horizontally scrollable on viewport < 1280px
- [ ] Clicking a candidate card in the Kanban navigates to `/dashboard/candidates/:id`
- [ ] Clicking a KPI card navigates to its linked module page
- [ ] No regressions in sidebar, header, or non-dashboard pages
