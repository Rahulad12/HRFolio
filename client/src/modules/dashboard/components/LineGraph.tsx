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
