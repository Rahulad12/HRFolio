import { Card, Dropdown, MenuProps, Progress, Tag } from 'antd';
import { useAppSelector } from '../../Hooks/hook';
import { candidateData } from '../../types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useNavigate } from 'react-router-dom';
import { makeCapitilized } from '../../utils/TextAlter';
import { Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import CustomTable from '../common/Table';
dayjs.extend(isBetween);

const statusProgressMap: Record<string, number> = {
    shortlisted: 50,
    'first interview': 75,
    'second interview': 90,
    hired: 100,
    rejected: 0,
};

const statusColors: Record<string, string> = {
    shortlisted: 'blue',
    'first interview': 'orange',
    'second interview': 'purple',
    hired: 'green',
    rejected: 'red',
};

const STATUS_OPTIONS = ['All', 'Shortlisted', 'First Interview', 'Second Interview', 'Hired', 'Rejected'];

const RecentActivities = () => {
    const candidates = useAppSelector(state => state.candidate.candidate);
    const navigate = useNavigate();

    const [selectedStatus, setSelectedStatus] = useState('All');

    const startOfWeek = dayjs().startOf('week');
    const endOfWeek = dayjs().endOf('week');

    const filteredCandidates = useMemo(() => {
        return candidates
            .filter((candidate: candidateData) => {
                const createdAt = dayjs(candidate.createdAt);
                const isInWeek = createdAt.isBetween(startOfWeek, endOfWeek, null, '[]');
                const matchesStatus = selectedStatus === 'All' || candidate.status.toLowerCase() === selectedStatus.toLowerCase();
                return isInWeek && matchesStatus;
            })
            .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix())
            .slice(0, 5)
            .map(candidate => ({
                ...candidate,
                progress: statusProgressMap[candidate.status.toLowerCase()] || 0,
                key: candidate._id,
            }));
    }, [candidates, selectedStatus]);

    const columns = [
        {
            title: 'Candidate',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: candidateData) => (
                <span className="font-semibold hover:text-blue-600 cursor-pointer"
                    onClick={() => navigate(`/dashboard/candidate/${record._id}`)}>
                    {makeCapitilized(text)}
                </span>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'technology',
            key: 'technology',
            render: (text: string) => <span>{makeCapitilized(text)}</span>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={statusColors[status.toLowerCase()] || 'default'}>
                    {makeCapitilized(status)}
                </Tag>
            ),
        },
        {
            title: 'Progress',
            dataIndex: 'progress',
            key: 'progress',
            render: (progress: number) => <Progress percent={progress} size="small" />,
        },
    ];

    const dropdownItems: MenuProps['items'] = STATUS_OPTIONS.map(status => ({
        key: status,
        label: <span onClick={() => setSelectedStatus(status)}>{status}</span>,
    }));

    const FilterDropdown = () => (
        <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
            <div className="flex items-center gap-1 cursor-pointer">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedStatus}</span>
            </div>
        </Dropdown>
    );

    return (
        <Card className="h-fit w-full" extra={<FilterDropdown />}>
            <CustomTable loading={false} data={filteredCandidates} columns={columns} pageSize={5} />
        </Card>
    );
};

export default RecentActivities;
