import { useState } from 'react'
import { Card, Empty } from 'antd'
import dayjs from 'dayjs'
import type { InterviewData } from '../types/dashboard.types'

interface Props {
  interviews: InterviewData[]
  onViewAllClick?: () => void
  loading?: boolean
}

const levelColors: Record<string, string> = {
  senior: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  mid: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  junior: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
}

const avatarColors: Record<string, string> = {
  senior: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  mid: 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300',
  junior: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-400',
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
    return (
      d.isSame(today.startOf('week'), 'day') ||
      (d.isAfter(today.startOf('week')) && d.isBefore(today.endOf('week'))) ||
      d.isSame(today.endOf('week'), 'day')
    )
  })

  return (
    <Card
      title="Upcoming Interviews"
      loading={loading}
      extra={
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(['today', 'week'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterType(v)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                filterType === v
                  ? 'bg-white text-slate-800 shadow-sm dark:bg-slate-600 dark:text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
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
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              >
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${avatarColors[level] ?? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}
                >
                  {getInitials(iv.candidate?.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold capitalize text-slate-800 dark:text-slate-100">
                    {iv.candidate?.name}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    with {iv.interviewer?.name}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
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
            className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View all interviews →
          </button>
        </div>
      )}
    </Card>
  )
}
