import { Card} from 'antd'
import { Award, Clock, UserCheck, UserX } from 'lucide-react';
import { useAppSelector } from '../../Hooks/hook';

const HiringMetric = () => {
    const candidate = useAppSelector(state => state.candidate.canditate);

    const hired = candidate.filter(c => c.status === 'hired');
    const rejected = candidate.filter(c => c.status === 'rejected');
    const firstInterview = candidate.filter(c => c.status === 'first interview');
    const secondInterview = candidate.filter(c => c.status === 'second interview');
    const shortListed = candidate.filter(c => c.status === "shortlisted");

    const process = firstInterview.length + secondInterview.length + shortListed.length

    const hiringMetrics = [
        {
            title: "Hired This Month",
            value: hired.length,
            icon: <UserCheck className="w-5 h-5 text-green-500" />,
        },
        {
            title: "Rejected",
            value: rejected.length,
            icon: <UserX className="w-5 h-5 text-red-500" />,
        },
        {
            title: "In Process",
            value: process,
            icon: <Clock className="w-5 h-5 text-blue-500" />,
        },
        {
            title: "Offers Sent",
            value: shortListed.length,
            icon: <Award className="w-5 h-5 text-purple-500" />,
        },
    ];
    return (
        <div>
            <Card title="Hiring Pipeline">
                <div className="grid grid-cols-2 gap-4">
                    {hiringMetrics.map((metric, index) => (
                        <div key={index} className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                            {metric.icon}
                            <div>
                                <p className="text-gray-600 text-sm">{metric.title}</p>
                                <p className="text-xl font-semibold">{metric.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default HiringMetric;
