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
  accentColor?: string
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
  accentColor = '#6366f1',
  trend,
  sparklineData,
}: MetricsCardProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    )
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 ${link ? 'cursor-pointer' : ''}`}
      onClick={() => link && navigate(link)}
    >
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
