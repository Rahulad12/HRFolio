import React from 'react';
import { Card, Typography, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { Clock, Shield, TrendingUp, Users } from 'lucide-react';

const { Title, Text } = Typography;

const benefits = [
    {
        icon: <Clock size={32} className="text-blue-500" />,
        title: 'Save Time',
        description: 'Reduce time-to-hire by up to 40% with streamlined workflows and automation tools.',
    },
    {
        icon: <Shield size={32} className="text-blue-500" />,
        title: 'Improve Quality',
        description: 'Find better candidates with AI-powered matching and comprehensive assessment tools.',
    },
    {
        icon: <TrendingUp size={32} className="text-blue-500" />,
        title: 'Increase Efficiency',
        description: 'Eliminate manual tasks and reduce administrative overhead across your recruitment process.',
    },
    {
        icon: <Users size={32} className="text-blue-500" />,
        title: 'Enhance Collaboration',
        description: 'Enable seamless teamwork with shared dashboards and collaborative hiring workflows.',
    },
];


const Benefits: React.FC = () => {
    return (
        <section style={{ padding: '5rem 0', backgroundColor: '#ffffff' }} id='benefits'>
            <div className="container mx-auto px-4">
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <Title level={2}>Why Choose <span className='inline-block bg-gradient-to-r from-blue-900 via-orange-600 to-blue-800 bg-clip-text text-transparent relative'>HRFolio</span></Title>
                    <Text type="secondary">
                        Our platform delivers tangible benefits that transform your recruitment operations and drive better results.
                    </Text>
                </div>

                <Row gutter={[24, 24]} justify="center">
                    {benefits.map((benefit, index) => (
                        <Col xs={24} sm={12} md={12} lg={6} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div
                                            style={{
                                                display: 'inline-flex',
                                                padding: '0.75rem',
                                                backgroundColor: '#e6f4ff',
                                                borderRadius: '50%',
                                            }}
                                        >
                                            {benefit.icon}
                                        </div>
                                    </div>
                                    <Title level={4}>{benefit.title}</Title>
                                    <Text type="secondary">{benefit.description}</Text>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
};

export default Benefits;
