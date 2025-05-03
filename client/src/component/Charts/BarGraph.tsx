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
import { useAppSelector } from '../../Hooks/hook';
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

const BarGraph: React.FC<BarGraphProps> = ({ labels, datasets }) => {
    const { mode: darkMode } = useAppSelector(state => state.theme);

    const adjustedDatasets = datasets.map(dataset => ({
        ...dataset,
        backgroundColor: dataset.backgroundColor ?? (darkMode ? '#D3D3D3' : '#363062'),
    }));

    const data = {
        labels,
        datasets: adjustedDatasets,
    };

   const option = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    return <Bar data={data}  options={option}/>;
};

export default BarGraph;