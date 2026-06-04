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
