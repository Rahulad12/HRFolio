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
