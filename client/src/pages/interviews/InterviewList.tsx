import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Search, Filter, Download, Eye } from 'lucide-react';
import Card from '../../component/ui/Card';
import { interviewData } from '../../types';
import { motion } from 'framer-motion';
import CustomTable from '../../component/common/Table';
import { Input, Select, TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { useInterview } from '../../action/StoreInterview';
import { useAppSelector } from '../../Hooks/hook';
import PrimaryButton from '../../component/ui/button/Primary';
import CustomCalender from '../../component/ui/Calender';

const InterviewList: React.FC = () => {
  const navigate = useNavigate();

  const { isLoading } = useInterview();
  const { interviews } = useAppSelector((state) => state.interview);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const columns: TableColumnsType<interviewData> = [
    {
      title: 'CANDIDATE',
      dataIndex: "candidate",
      key: 'name',
      render: (text: string, record: interviewData) => (
        <div>
          <div className="font-medium text-gray-900">{record?.candidate?.name}</div>
          <div className="text-xs text-gray-500">{record?.candidate?.email}</div>
        </div>
      )
    },
    {
      title: 'INTERVIEWER',
      dataIndex: "interviewer",
      key: 'interviewer',
      render: (text: string, record: interviewData) => (
        <div>
          <div className="font-medium text-gray-900">{record?.interviewer?.name}</div>
          <div className="text-xs text-gray-500">{record?.interviewer?.email}</div>
        </div>
      )
    },
    {
      title: "DATE & TIME",
      dataIndex: "interview",
      key: "date",
      render: (text: string, record: interviewData) => (
        <div>
          <div className="font-medium text-gray-900">{dayjs(record?.date).format('YYYY-MM-DD')}</div>
          <div className="text-xs text-gray-500">{dayjs(record?.time).format('HH:mm')}</div>
        </div>
      )
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (text: string, record: interviewData) => (
        <div>
          <div className="font-medium text-gray-900">{record?.status}</div>
        </div>
      )
    }, {
      title: "ACTION",
      dataIndex: "action",
      key: "action",
      render: (text: string, record: interviewData) => (
        <div>
          <Eye size={16} className="text-blue-600" />
        </div>
      )
    }
  ]
  const handleDateChange = (date: dayjs.Dayjs, dateString: string) => {
    console.log(dateString);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between overflow-auto">
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
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <Card className="p-2" >
            <CustomCalender fullscreen={true} width={300} onChange={handleDateChange} />
          </Card>
        </div>

        <div className="w-full md:w-3/4">
          <Card>
            <div className="flex flex-wrap gap-4 items-center p-2 w-full">
              <div className="flex items-center gap-2 w-full md:w-1/2">
                <Input
                  placeholder="Search by name or email"
                  allowClear
                  prefix={<Search size={16} className="text-gray-500" />}
                  size="large"
                  style={{ padding: "8px 12px" }}
                />
              </div>

              <Select
                allowClear
                placeholder="Filter by status"
                size="large"
                className="w-48"
                showSearch
              >
                {statusOptions.map((option) => (
                  <Select.Option
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>

            <CustomTable
              loading={isLoading}
              data={interviews}
              columns={columns}
              pageSize={10}
              scroll={{ x: 55 * 5, y: 55 * 5 }}
            />
          </Card>
        </div>
      </div>

    </motion.div>
  );
};

export default InterviewList;