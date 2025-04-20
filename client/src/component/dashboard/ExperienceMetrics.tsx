import { Card, Col, Row, Space, Typography } from 'antd';
import { useAppSelector } from '../../Hooks/hook';

const { Text } = Typography;

const ExperienceMetrics = () => {
    const candidates = useAppSelector(state => state.candidate.candidate);

    const Junior = candidates.filter(c => c.level === 'junior').length;
    const Mid = candidates.filter(c => c.level === 'mid').length;
    const Senior = candidates.filter(c => c.level === 'senior').length;

    return (
        <Card title="Experience Distribution" className="h-full w-full">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Row align="middle">
                    <Col span={12}>
                        <Text>Junior (&lt;3 years)</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Text strong>{Junior}</Text>
                    </Col>
                </Row>
                <Row align="middle">
                    <Col span={12}>
                        <Text>Mid-Level (3-7 years)</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Text strong>{Mid}</Text>
                    </Col>
                </Row>
                <Row align="middle">
                    <Col span={12}>
                        <Text>Senior (&gt;7 years)</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Text strong>{Senior}</Text>
                    </Col>
                </Row>
            </Space>
        </Card>
    );
};

export default ExperienceMetrics;
