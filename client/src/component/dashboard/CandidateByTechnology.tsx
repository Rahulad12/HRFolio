import { Card, Skeleton } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import BarGraph from '../Charts/BarGraph';

interface Props {
    loading?: boolean
}
const CandidateByTechnology: React.FC<Props> = ({
    loading = true
}) => {
    const candidates = useAppSelector(state => state.candidate.candidate);

    // Group data: technology -> count
    const techCount: Record<string, number> = {};
    candidates.forEach(c => {
        const tech = c.technology?.trim().toLowerCase() || '';
        techCount[tech] = (techCount[tech] || 0) + 1;
    });

    const labels = Object.keys(techCount);
    const counts = Object.values(techCount);

    return (
        <Card title="Candidate By Technology"
        >
            {
                loading ? <Skeleton active
                    paragraph={{ rows: 4 }}
                    style={{ width: '100%' }}
                /> : <BarGraph
                    labels={labels}
                    datasets={[
                        {
                            label: 'Candidates',
                            data: counts,
                            backgroundColor: '#363062',
                        },
                    ]}
                />
            }


        </Card>

    );
};

export default CandidateByTechnology;