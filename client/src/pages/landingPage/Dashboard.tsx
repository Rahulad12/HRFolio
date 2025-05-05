import React, { useState } from 'react';
import { Image, Tabs, Typography } from 'antd';
const { Title,Text } = Typography;

interface DashboardImage {
    url: string;
    title: string;
    description: string;
}

const dashboardImages: Record<string, DashboardImage[]> = {
    candidates: [
        {
            url: "/landingpage/candidatelist1.png",
            title: "Candidate Pipeline View",
            description: "Track candidates through each stage of your recruitment process with customizable pipelines."
        },
        {
            url: "/landingpage/candidatepipeline.png",
            title: "Candidate Profile",
            description: "Comprehensive profiles with all relevant information in a single view."
        }
    ],
    analytics: [
        {
            url: "/landingpage/dashboard.png",
            title: "Recruitment Analytics",
            description: "Visualize your recruitment performance with customizable dashboards and metrics."
        },
        {
            url:"/landingpage/dashboard2.png",
            title: "Performance Metrics",
            description: "Track key metrics like time-to-hire, cost-per-hire, and source effectiveness."
        }
    ],
    interviews: [
        {
            url: "/landingpage/interviewlist.png",
            title: "Interview Scheduler",
            description: "Streamline the scheduling process with automated calendar integration."
        },
        {
            url: "/landingpage/feedback.png",
            title: "Interview Feedback",
            description: "Receive instant feedback on interviews in real-time."
        }
    ]
};

const Dashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('candidates');

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    return (
        <section className="py-16 md:py-24" id="screenshots">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Title level={1} className="mb-4">
                        Intuitive Dashboard Experience
                    </Title>
                    <Text type="secondary" strong className="mb-8 mx-auto">
                        Designed for HR professionals, our dashboard provides powerful insights and tools in a user-friendly interface.
                    </Text>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    tabPosition="top"
                    centered
                    items={[
                        {
                            key: 'candidates',
                            label: 'Candidate Management',
                            children: (
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {dashboardImages.candidates.map((image, index) => (
                                        <div key={index} className="group">
                                            <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                                                <Image
                                                    src={image.url}
                                                    alt={image.title}
                                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                    <h3 className="text-white text-xl font-semibold mb-2">{image.title}</h3>
                                                    <p className="text-white/90">{image.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ),
                        },
                        {
                            key: 'analytics',
                            label: 'Analytics & Reporting',
                            children: (
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {dashboardImages.analytics.map((image, index) => (
                                        <div key={index} className="group">
                                            <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                                                <img
                                                    src={image.url}
                                                    alt={image.title}
                                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                    <h3 className="text-white text-xl font-semibold mb-2">{image.title}</h3>
                                                    <p className="text-white/90">{image.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ),
                        },
                        {
                            key: 'interviews',
                            label: 'Interview Management',
                            children: (
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {dashboardImages.interviews.map((image, index) => (
                                        <div key={index} className="group">
                                            <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
                                                <img
                                                    src={image.url}
                                                    alt={image.title}
                                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                                    <h3 className="text-white text-xl font-semibold mb-2">{image.title}</h3>
                                                    <p className="text-white/90">{image.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </section>
    );
};

export default Dashboard;