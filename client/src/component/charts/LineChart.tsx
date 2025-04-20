import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title
);

interface LineChartProps {
    labels: string[];
    data: number[];
    label?: string;
    borderColor?: string;
    backgroundColor?: string;
}

const LineChart: React.FC<LineChartProps> = ({
    labels,
    data,
    label = 'Experience',
    borderColor = '#363062',
    backgroundColor = 'rgba(54, 48, 98, 0.2)',
}) => {
    const { darkMode } = useTheme();

    const chartData = {
        labels,
        datasets: [
            {
                label,
                data,
                fill: true,
                backgroundColor,
                borderColor,
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: darkMode ? '#fff' : '#191D32',
                },
            },
            title: {
                display: true,
                text: label,
                color: darkMode ? '#fff' : '#191D32',
            },
        },
        scales: {
            x: {
                ticks: {
                    color: darkMode ? '#fff' : '#191D32',
                },
                grid: {
                    color: darkMode ? '#444' : '#e0e0e0',
                },
            },
            y: {
                ticks: {
                    color: darkMode ? '#fff' : '#191D32',
                },
                grid: {
                    color: darkMode ? '#444' : '#e0e0e0',
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default LineChart;
