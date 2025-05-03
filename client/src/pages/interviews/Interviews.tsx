import { useState } from 'react'
import { useInterview } from '../../action/StoreInterview'
import InterviewListView from './InterviewListView';
import CalenderView from './CalenderView';
import { CalendarIcon, ListIcon, Plus, Search } from 'lucide-react';
import { Card, Typography, Button, Tabs, Select, Input, Skeleton } from 'antd'
import { useNavigate } from 'react-router-dom';
import TabPane from 'antd/es/tabs/TabPane';
const { Title, Text } = Typography

interface StatusOption {
    value: string;
    label: string;
}

const statusOptions: StatusOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
];

const Interviews = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStatus, setFilteredStatus] = useState<string>('');

    const { isLoading: interviewLoading } = useInterview(null, null);


    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const handleSearchClear = () => {
        setSearchTerm('');
    };

    const handleFilterChange = (value: string) => {
        setFilteredStatus(value || '');
    };

    const handleFilterClear = () => {
        setFilteredStatus('');
    };

    if (interviewLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Skeleton active paragraph={{ rows: 4 }} />
            </div>
        );
    }
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <Title level={2} className="m-0">Interviews</Title>
                    <Text>Schedule and manage candidate interviews</Text>
                </div>
                <Button
                    type="primary"
                    icon={<Plus size={16} />}
                    onClick={() => navigate('/dashboard/interviews/schedule')}
                    className="flex items-center"
                >
                    Schedule Interview
                </Button>
            </div>

            <Card>
                <Tabs>
                    <TabPane tab={
                        <span className="flex items-center">
                            <CalendarIcon size={16} className="mr-2" />
                            Calendar View
                        </span>
                    } key="1">
                        <CalenderView />

                    </TabPane>
                    <TabPane tab={
                        <span className="flex items-center">
                            <ListIcon size={16} className="mr-2" />
                            List View
                        </span>
                    } key="2">
                        <div className="mb-4 flex justify-between items-center">
                            <div className="w-1/3">
                                <Input
                                    allowClear
                                    prefix={<Search size={16} className="text-gray-400" />}
                                    placeholder="Search by candidate name or email"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onPressEnter={(e) => handleSearch(e.currentTarget.value)}
                                    onClear={handleSearchClear}
                                    className="w-full sm:w-1/2"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    allowClear
                                    placeholder="Filter by status"
                                    className="w-full sm:w-48"
                                    value={filteredStatus || undefined}
                                    onChange={handleFilterChange}
                                    onClear={handleFilterClear}
                                    options={statusOptions}
                                />
                            </div>

                        </div>
                        <InterviewListView
                            searchTerm={searchTerm}
                            interviewStatus={filteredStatus}
                        // selectedDate={selectedDate}
                        />
                    </TabPane>
                </Tabs>

            </Card>

        </div>
    )
}

export default Interviews
