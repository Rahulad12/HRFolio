import { Card } from 'antd';
import { useAppSelector } from '../../../Hooks/hook';
import BarGraph from '../../charts/BarGraph';

const CandidateByTechnology = () => {
    const candidates = useAppSelector(state => state.candidate.candidate);

    // Group data: technology -> count
    const techCount: Record<string, number> = {};
    candidates.forEach(c => {
        const tech = c.technology;
        techCount[tech] = (techCount[tech] || 0) + 1;
    });

    const labels = Object.keys(techCount);
    const counts = Object.values(techCount);

    return (

        <BarGraph
            labels={labels}
            datasets={[
                {
                    label: 'Candidates',
                    data: counts,
                    backgroundColor: '#363062',
                },
            ]}
        />
    );
};

export default CandidateByTechnology;
