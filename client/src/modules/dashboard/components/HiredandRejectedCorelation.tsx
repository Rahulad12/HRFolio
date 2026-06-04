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
