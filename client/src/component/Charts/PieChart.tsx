import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
    labels: string[];
    data: number[];
    backgroundColor?: string[];
    title?: string;
}
const PieChart: React.FC<PieChartProps> = ({ labels, data, backgroundColor, title }) => {

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
                ],
                borderWidth: 1,
            },
        ],
    };
    const option = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: title,
            },
        },
    };

    return <Pie data={chartData} options={option} />;
};

export default PieChart;