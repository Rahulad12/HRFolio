import { Card } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import PieChart from '../Charts/PieChart';
const CandidateLevelDistribution = () => {
    const candidates = useAppSelector(state => state.candidate.candidate);

    const statusCounts: Record<string, number> = {};

    candidates.forEach(c => {
        const status = c.level;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    return (
        <Card title="Candidate Level Distribution">
            <PieChart
                labels={labels}
                data={data}
                title="Candidate Status"
            />

        </Card>

    );
};

export default CandidateLevelDistribution 