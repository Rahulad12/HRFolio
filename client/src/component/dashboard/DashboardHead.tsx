import { Card, Col, Row, Space, Statistic } from "antd";
import {
    CalendarOutlined,
    TeamOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import { useAppSelector } from "../../Hooks/hook";
import { motion } from "framer-motion";
import dayjs from "dayjs";
const DashboardHead = () => {
    const candidates = useAppSelector(state => state.candidate.candidate);
    const { interviews } = useAppSelector(state => state.interview);

    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');

    const filterInterviews = interviews?.filter(i => dayjs(i.date).isBetween(startOfWeek, endOfWeek, null, '[]'));
    const filterStatusByHired = candidates?.filter(c => c.status === 'hired');

    const stats = [
        {
            title: 'Total Candidates',
            value: candidates?.length,
            icon: <TeamOutlined />,
            color: '#1890ff',
            prefix: '',
            suffix: '',
        },
        {
            title: 'Interviews This Week',
            value: filterInterviews?.length,
            icon: <CalendarOutlined />,
            color: '#52c41a',
            prefix: '',
            suffix: '',
        },
        {
            title: 'Pending Reviews',
            value: 12,
            icon: <ClockCircleOutlined />,
            color: '#faad14',
            prefix: '',
            suffix: '',
        },
        {
            title: 'Hired This Month',
            value: filterStatusByHired?.length,
            icon: <TrophyOutlined />,
            color: '#722ed1',
            prefix: '',
            suffix: '',
        },
    ];

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8">
            <Row gutter={[16, 16]}>
                {stats.map((stat, index) => (
                    <Col xs={24} sm={12} md={12} lg={6} key={index}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card
                                className={`rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ${stat.color}`}
                            >
                                <Statistic
                                    title={<Space>
                                        {stat.icon}
                                        <span>{stat.title}</span>
                                    </Space>}
                                    value={stat.value}
                                    prefix={stat.icon}
                                    suffix={stat.suffix}
                                    valueStyle={{ color: stat.color }}
                                />
                            </Card>
                        </motion.div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DashboardHead;
