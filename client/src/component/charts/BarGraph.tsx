import React from 'react';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarGraphProps {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor?: string;
    }[];
    title?: string;
}

const BarGraph: React.FC<BarGraphProps> = ({ labels, datasets, title }) => {
    const { darkMode } = useTheme();

    const adjustedDatasets = datasets.map(dataset => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor ?? (darkMode ? '#D3D3D3' : '#363062'),
    }));

    const data = {
        labels,
        datasets: adjustedDatasets,
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
        scales: {
            x: {
                ticks: {
                    color: darkMode ? '#fff' : '#191D32',
                },
                grid: {
                    color: darkMode ? '#444' : '#ccc',
                },
            },
            y: {
                ticks: {
                    color: darkMode ? '#fff' : '#191D32',
                },
                grid: {
                    color: darkMode ? '#444' : '#ccc',
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default BarGraph;
