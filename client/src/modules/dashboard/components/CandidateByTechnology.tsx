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
