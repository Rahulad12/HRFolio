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
  candidates:           { icon: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',  text: 'text-indigo-600 dark:text-indigo-400' },
  interviews:           { icon: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',        text: 'text-blue-600 dark:text-blue-400' },
  interview_completed:  { icon: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',        text: 'text-blue-600 dark:text-blue-400' },
  assessments:          { icon: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',     text: 'text-amber-600 dark:text-amber-400' },
  offers:               { icon: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', text: 'text-emerald-600 dark:text-emerald-400' },
  offer_accepted:       { icon: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', text: 'text-emerald-600 dark:text-emerald-400' },
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
                  {!isLast && <div className="my-1 w-px flex-1 bg-slate-200 dark:bg-slate-700" />}
                </div>
                {/* Content */}
                <div className={`min-w-0 flex-1 ${!isLast ? 'pb-4' : ''}`}>
                  <p className="text-sm leading-snug text-slate-700 dark:text-slate-200">
                    <span className={`font-semibold capitalize ${accent.text}`}>
                      {item.metaData?.title ?? 'Unknown'}
                    </span>{' '}
                    {item.action === 'updated'
                      ? `moved to ${item.metaData?.description ?? ''} stage`
                      : `was ${item.action.replace('_', ' ')}`}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
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
