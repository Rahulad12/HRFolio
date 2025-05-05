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
    size?: number; // optional prop to control size
}

const PieChart: React.FC<PieChartProps> = ({ labels, data, backgroundColor, title, size = 300 }) => {
    const chartData = {
        labels,
        datasets: [
            {
                label: title || 'Dataset',
                data,
                backgroundColor: backgroundColor || ['#363062', '#F99417', '#93B1A6'],
                borderWidth: 1,
            },
        ],
    };

    const option = {
        responsive: true,
        maintainAspectRatio: false, // required to control size via container
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

    return (
        <div style={{ width: size, height: size }}
        >
            <Pie data={chartData} options={option} />
        </div>
    );
};

export default PieChart;
