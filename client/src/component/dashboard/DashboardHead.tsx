import { Card, Col, Row } from "antd";
import {
    Users,
    ClipboardCheck,
    FileCheck,
    Calendar
} from "lucide-react";
import { useAppSelector } from "../../Hooks/hook";

const DashboardHead = () => {
    const candidates = useAppSelector(sate => sate.candidate.canditate)
    const stats = [
        {
            title: "Total Candidates",
            value: candidates.length,
            icon: <Users className="w-6 h-6 text-blue-500" />,
            color: "bg-blue-100",
        },
        {
            title: "Interviews Today",
            value: 8,
            icon: <Calendar className="w-6 h-6 text-purple-500" />,
            color: "bg-purple-100",
        },
        {
            title: "Pending Assessments",
            value: 12,
            icon: <ClipboardCheck className="w-6 h-6 text-orange-500" />,
            color: "bg-orange-100",
        },
        {
            title: "Documents Pending",
            value: 5,
            icon: <FileCheck className="w-6 h-6 text-red-500" />,
            color: "bg-red-100",
        },
    ];

    return (
        <div className="space-y-6">
            <Row gutter={[16, 16]}>
                {stats.map((stat, index) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={index}>
                        <Card className="hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">{stat.title}</p>
                                    <p className="text-2xl font-semibold">{stat.value}</p>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DashboardHead;
