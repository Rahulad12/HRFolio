import { Card, Skeleton } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import PieChart from '../Charts/PieChart';
interface Props {
    loading?: boolean
}
const CandidateLevelDistribution: React.FC<Props> = ({
    loading = true
}) => {
    const candidates = useAppSelector(state => state.candidate.candidate);

    const statusCounts: Record<string, number> = {};

    candidates.forEach(c => {
        const status = c.level;
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);

    return (
        <Card title="Candidate Level Distribution"
        >

            <div className='flex justify-center items-center'>
                {
                    loading ? <Skeleton active
                        paragraph={{ rows: 4 }}
                        style={{ width: '100%' }}
                    /> :
                        <PieChart
                            labels={labels}
                            data={data}
                            title="Candidate Status"
                            size={300}
                        />

                }

            </div>


        </Card>

    );
};

export default CandidateLevelDistribution 