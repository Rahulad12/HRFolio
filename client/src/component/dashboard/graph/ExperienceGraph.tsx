// src/components/dashboard/ExperienceGraph.tsx
import LineChart from '../../charts/LineChart'
import { useAppSelector } from '../../../Hooks/hook';
import { Card } from 'antd';

const ExperienceGraph = () => {
    const candidates = useAppSelector(state => state.candidate.candidate);

    const experienceCounts: Record<string, number> = {};

    candidates.forEach(c => {
        const experience = c.level;
        experienceCounts[experience] = (experienceCounts[experience] || 0) + 1;
    })

    const labels = Object.keys(experienceCounts);
    const data = Object.values(experienceCounts);

    return (
        <Card className="w-full h-full max-w-2xl mx-auto">
            <LineChart
                labels={labels}
                data={data}
                label="Candidate Experience Distribution"
            />
        </Card>
    );
};

export default ExperienceGraph;
