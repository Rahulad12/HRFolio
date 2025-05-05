import React from 'react';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    Title,
    CategoryScale,
    Legend,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Legend,
    Tooltip
);

interface LineChartProps {
    labels: string[];
    hiredData: number[];
    rejectedData: number[];
    size?: number
}

const LineChart: React.FC<LineChartProps> = ({ labels, hiredData, rejectedData,size }) => {
    const data = {
        labels,
        datasets: [
            {
                label: 'Hired',
                data: hiredData,
                borderColor: '#4CAF50',
                backgroundColor: '#4CAF5088',
                fill: false,
                tension: 0.4,
            },
            {
                label: 'Rejected',
                data: rejectedData,
                borderColor: '#F44336',
                backgroundColor: '#F4433688',
                fill: false,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Hiring vs Rejections Over Time',
            },
        },
    };

    return (
        <div style={{ width: size, height: 'fit-content' }}>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
