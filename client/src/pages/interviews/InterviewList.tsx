import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Search, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input, Select, TableColumnsType } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import Card from '../../component/ui/Card';
import { candidateData, interviewData, interviewer } from '../../types';
import CustomTable from '../../component/common/Table';
import { useInterview } from '../../action/StoreInterview';
import { useAppSelector } from '../../Hooks/hook';
import PrimaryButton from '../../component/ui/button/Primary';
import CustomCalendar from '../../component/ui/Calender'; // Fixed typo in component name

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

const InterviewList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredStatus, setFilteredStatus] = useState<string>('');

  const { isLoading } = useInterview(filteredStatus, selectedDate);
  const { interviews } = useAppSelector((state) => state.interview);

  const columns: TableColumnsType<interviewData> = [
    {
      title: 'CANDIDATE',
      dataIndex: 'candidate',
      key: 'name',
      render: (record: candidateData) => (
        <div>
          <div className="font-medium text-gray-900">{record?.name}</div>
          <div className="text-xs text-gray-500">{record?.email}</div>
        </div>
      )
    },
    {
      title: 'INTERVIEWER',
      dataIndex: 'interviewer',
      key: 'interviewer',
      render: (record: interviewer) => (
        <div>
          <div className="font-medium text-gray-900">{record?.name}</div>
          <div className="text-xs text-gray-500">{record?.email}</div>
        </div>
      )
    },
    {
      title: 'DATE & TIME',
      dataIndex: 'date',
      key: 'date',
      render: (text: string, record: interviewData) => (
        <div>
          <div className="font-medium text-gray-900">{dayjs(text).format('YYYY-MM-DD')}</div>
          <div className="text-xs text-gray-500">{record?.time}</div>
        </div>
      )
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <div className="font-medium text-gray-900 capitalize">{text}</div>
      )
    },
    {
      title: 'ACTION',
      key: 'action',
      render: (_, record) => (
        <div
          className="cursor-pointer hover:text-blue-800"
          onClick={() => navigate(`/dashboard/interviews/${record._id}`)}
        >
          <Eye size={16} className="text-blue-600" />
        </div>
      )
    }
  ];

  const handleDateChange = (value: Dayjs | null) => {
    setSelectedDate(value);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchClear = () => {
    setSearchTerm('');
  };

  const handleFilterChange = (value: string) => {
    setFilteredStatus(value);
  };

  const handleFilterClear = () => {
    setFilteredStatus('');
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      // Search term matching
      const matchesSearch = searchTerm === '' ||
        interview.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interview.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status matching
      const matchesStatus = filteredStatus === '' || interview.status === filteredStatus;

      // Date matching
      const matchesDate = !selectedDate || dayjs(interview.date).isSame(selectedDate, 'day');

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [interviews, searchTerm, filteredStatus, selectedDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-6"
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all scheduled and completed interviews
          </p>
        </div>
        <PrimaryButton
          text="Schedule New Interview"
          icon={<CalendarDays size={16} />}
          onClick={() => navigate('/dashboard/interviews/schedule')}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
        <div className="w-fit">
          <Card >
            <CustomCalendar
              onChange={handleDateChange}
            />
          </Card>
        </div>

        <div className="w-full">
          <Card>
            <div className="flex flex-col sm:flex-row gap-4 items-center p-4">
              <Input
                allowClear
                prefix={<Search size={16} className="text-gray-500" />}
                placeholder="Search by candidate name or email"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onPressEnter={(e) => handleSearch(e.currentTarget.value)}
                onClear={handleSearchClear}
                className="w-full sm:w-1/2"
              />

              <Select
                allowClear
                placeholder="Filter by status"
                className="w-full sm:w-48"
                value={filteredStatus}
                onChange={handleFilterChange}
                onClear={handleFilterClear}
                options={statusOptions}
              />
            </div>

            <div>
              <CustomTable
                loading={isLoading}
                data={filteredInterviews}
                columns={columns}
                pageSize={10}

              />
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewList;