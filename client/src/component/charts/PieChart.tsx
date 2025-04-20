import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
    labels: string[];
    data: number[];
    backgroundColor?: string[];
    title?: string;
}

const PieChart: React.FC<PieChartProps> = ({ labels, data, backgroundColor, title }) => {
    const { darkMode } = useTheme();

    const chartData = {
        labels,
        datasets: [
            {
                label: title || 'Dataset',
                data,
                backgroundColor: backgroundColor || [
                    '#363062',
                    '#F99417',
                    '#93B1A6',
                    '#BF3131',
                    '#60A5FA',
                ],
                borderWidth: 1,
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
                display: !!title,
                text: title,
                color: darkMode ? '#fff' : '#191D32',
            },
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default PieChart;
