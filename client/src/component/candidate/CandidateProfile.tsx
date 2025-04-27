import { useAppSelector } from '../../Hooks/hook';
import { Mail, Phone, FileText, Clock, User, ExternalLink } from 'lucide-react';
import { Card, Descriptions, Select, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { useState } from 'react';
import { candidateStatus } from '../../types';

interface Props {
    updateStatus?: (newStatus: candidateStatus) => void;
    statusOptions: any;

}
const CandidateProfile = ({
    updateStatus,
    statusOptions,

}: Props) => {
    const [activeTab, setActiveTab] = useState('profile');
    const { candidate } = useAppSelector((state) => state.candidate);
    const profile = candidate?.[0];

    return (
        <Card 
        title="Candidate Profile"
        extra={
            <Select
                placeholder="Update Status"
                className="w-full cursor-pointer"
                onChange={updateStatus}
                options={statusOptions}
                value={profile?.status}
                showSearch
                style={{
                    width: '100%',
                }}
                
            />
        }>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Profile" key="profile" />
                <TabPane tab="Interviews" key="interviews" />
                <TabPane tab="Assessments" key="assessments" />
                <TabPane tab="Timeline" key="timeline" />
            </Tabs>
            {
                activeTab === 'profile' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <div className="h-16 w-16 rounded-full bg-blue-950 flex items-center justify-center text-white text-2xl mr-4 capitalize">
                                    {profile?.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-xl font-medium capitalize">{profile?.name}</div>
                                    <div className="text-gray-500 capitalize">{profile?.technology}</div>
                                </div>
                            </div>

                            <Descriptions column={1} className="mb-4">
                                <Descriptions.Item
                                    label={<div className="flex items-center"><Mail size={16} className="mr-2" /> Email</div>}
                                >
                                    <a href={`mailto:${profile?.email}`}>{profile?.email}</a>
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={<div className="flex items-center"><Phone size={16} className="mr-2" /> Phone</div>}
                                >
                                    <a href={`tel:${profile?.phone}`}>{profile?.phone}</a>
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={<div className="flex items-center"><Clock size={16} className="mr-2" /> Experience</div>}
                                >
                                    {profile?.experience} {profile?.experience === 1 ? 'year' : 'years'}
                                </Descriptions.Item>
                                <Descriptions.Item
                                    label={<div className="flex items-center"><User size={16} className="mr-2" /> References</div>}
                                >
                                    {profile?.references?.map((reference) => (
                                        <p >{reference?.name}</p>
                                    ))}
                                </Descriptions.Item>

                                <Descriptions.Item
                                    label={<div className="flex items-center"><FileText size={16} className="mr-2" /> Resume</div>}
                                >
                                    {profile?.resume ? (
                                        <a href={profile?.resume} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                            View Resume <ExternalLink size={14} className="ml-1" />
                                        </a>
                                    ) : (
                                        'Not provided'
                                    )}
                                </Descriptions.Item>
                            </Descriptions>


                        </div>
                    </div>
                )
            }


        </Card >

    );
};

export default CandidateProfile;


