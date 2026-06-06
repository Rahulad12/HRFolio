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
