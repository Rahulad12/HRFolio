import { useAppSelector } from '../../../Hooks/hook';
import PieChart from '../../charts/PieChart';
const CandidateByStatus = () => {
    const candidates = useAppSelector(state => state.candidate.candidate);

    const statusCounts: Record<string, number> = {};

    candidates.forEach(c => {
        const status = c.status.toLowerCase();
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    return (
        <div className="w-full h-full flex items-center justify-center">
        <PieChart
            labels={labels}
            data={data}
            title="Candidate Status"
            width={400}
            height={400}
        />
        </div>
    );
};

export default CandidateByStatus
