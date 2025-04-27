import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Pencil, Trash2 } from 'lucide-react';
import { interviewerData } from '../../types';
import { motion } from 'framer-motion';
import { Button, Card, Input, message, Popconfirm, Select, Tooltip, Typography } from 'antd';
import CustomTable from '../../component/common/Table';
import { useGetInterviewerQuery, useDeleteInterviewerMutation } from '../../services/interviewServiceApi';
import ExportButton from '../../component/common/Export';

const InterviewerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const navigate = useNavigate();

  const { data: interviewers, isLoading: interviewerLoading, refetch } = useGetInterviewerQuery()
  const [deleteInterviewer] = useDeleteInterviewerMutation();

  const filteredInterviewers = interviewers?.data?.filter(interviewer => {
    const matchesSearch =
      interviewer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer?.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === '' || interviewer?.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const handleEditInterviewer = (interviewer: interviewerData) => {
    navigate(`/dashboard/interviewers/edit/${interviewer._id}`);
  };

  const handleDeleteInterviewer = async (interviewer: interviewerData) => {
    try {
      const result = await deleteInterviewer(interviewer._id);
      if (result?.data?.success) {
        message.success(result?.data?.message);
        refetch();
      }
    } catch (error: any) {
      console.error('Error deleting interviewer:', error);
      message.error(error?.data?.message);
    }
    finally {
      refetch();
    }
  };

  // Get unique departments for filter
  const departments = [...new Set(interviewers?.data?.map(interviewer => interviewer.department))];
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map(dept => ({ value: dept, label: dept }))
  ];

  const columns = [
    {
      title: 'NAME',
      dataIndex: 'name',
      render: (text: string, record: interviewerData) => (
        <div>
          <div className="font-medium ">{text}</div>
          <div className="text-xs text-gray-500">{record?.email}</div>
        </div>
      )
    },
    {
      title: 'DEPARTMENT',
      dataIndex: 'department'
    },
    {
      title: 'POSITION',
      dataIndex: 'position'
    },
    // {
    //   header: 'Availability',
    //   accessor: (interviewer: Interviewer) => (
    //     <div className="text-sm">
    //       {interviewer.availability.map((avail, index) => (
    //         <div key={index} className="mb-1">
    //           <span className="font-medium">{avail.day}:</span>{' '}
    //           <span className="text-gray-600">{avail.timeSlots.join(', ')}</span>
    //         </div>
    //       ))}
    //     </div>
    //   )
    // },
    {
      title: 'ACTIONS',
      render: (interviewer: interviewerData) => (
        <div className="flex space-x-2">
          <Tooltip
            title="Edit"
          >

            <Button
              type="text"
              className="p-1"
              onClick={() => handleEditInterviewer(interviewer)}
              aria-label="Edit interviewer"
              icon={<Pencil size={16} className="text-blue-600" />}
            />
          </Tooltip>
          <Tooltip title="Delete" >
            <Popconfirm
              title="Are you sure you want to Delete this interviewer?"
              onConfirm={() => handleDeleteInterviewer(interviewer)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                className="p-1"
                danger
                aria-label="Delete interviewer"
                icon={<Trash2 size={16} className="text-red-600" />}
              >
              </Button>
            </Popconfirm>
          </Tooltip>

        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title className="text-2xl font-bold text-gray-900">Interviewers</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-gray-500">
            Manage staff members who conduct interviews
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<UserPlus size={16} />}
          className="mt-4 sm:mt-0"
          onClick={() => navigate('/dashboard/interviewers/new')}
        >
          Add Interviewer
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <Input
              placeholder="Search assessments..."
              prefix={<Search size={18} className="text-gray-400" />}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={departmentOptions}
              value={departmentFilter}
              onChange={setDepartmentFilter}
              className="w-40"
              showSearch
            />

            <ExportButton data={filteredInterviewers} fileName="Interviewers" />
          </div>
        </div>

        <CustomTable
          data={filteredInterviewers || []}
          columns={columns}
          loading={interviewerLoading}
          pageSize={10}
        />
      </Card>
    </motion.div>
  );
};

export default InterviewerList;