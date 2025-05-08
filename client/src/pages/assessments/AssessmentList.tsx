import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Search, Pencil, Trash2 } from 'lucide-react';
import { AssessmentDataResponse } from '../../types';
import { motion } from 'framer-motion';
import { useAssessment } from '../../action/StoreAssessment';
import { useAppSelector } from '../../Hooks/hook';
import CustomTable from '../../component/common/Table';
import { Button, Popconfirm, Tooltip, Input, Select, message, Card, Typography, Tag } from 'antd';
import { makeCapitilized } from '../../utils/TextAlter';
import PrimaryButton from '../../component/ui/button/Primary';
import ExportButton from '../../component/common/Export';
import { useDeleteAssessmentMutation } from '../../services/assessmentServiceApi';
import dayjs from 'dayjs';

const AssessmentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const navigate = useNavigate();


  const { assessmentLoading, refetch } = useAssessment()
  const { assessments } = useAppSelector((state) => state.assessments);
  const [deleteAssessment, { isLoading: deleteLoading }] = useDeleteAssessmentMutation();

  const filteredAssessments: AssessmentDataResponse[] = useMemo(() => {
    return (
      assessments
        ?.filter((assessment) => {
          const matchesSearch = assessment?.title.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesType = typeFilter === '' || assessment?.type === typeFilter;
          return matchesSearch && matchesType;
        })
        .sort((a, b) => dayjs(b?.createdAt).valueOf() - dayjs(a?.createdAt).valueOf()) || []
    );
  }, [assessments, searchTerm, typeFilter]);



  const handleEditAssessment = (id: string) => {
    navigate(`/dashboard/assessments/edit/${id}`);
  };

  const handleDeleteAssessment = async (id: string) => {
    try {
      const res = await deleteAssessment(id).unwrap();
      if (res?.success) {
        message.success(res.message);
      }
    } catch (error: any) {
      console.error('Failed to delete assessment', error);
      message.error(error?.data?.message);
    }
    finally {
      refetch();
    }

  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'technical', label: 'Technical' },
    { value: 'behavioral', label: 'Behavioral' },
  ];

  const columns = [
    {
      title: "TITLE",
      dataIndex: "title",
      key: "title",
      render: (title: string) => (
        <div className=' cursor-pointer' >
          <span className=' font-medium capitalize'>{title}</span>
        </div>
      )
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag color={type === 'technical' ? 'blue' : 'orange'}>{makeCapitilized(type)}</Tag>
    },
    {
      title: "DURATION",
      dataIndex: "duration",
      key: "duration",
      render: (duration: string) => <span className='text-gray-500'>{duration}</span>
    },
    {
      title: "LEVEL",
      dataIndex: "level",
      key: "level",
      render: (level: string) => <span className='text-gray-500'>{makeCapitilized(level)}</span>
    },
    {
      title: "TECHNOLOGY",
      dataIndex: "technology",
      key: "technology",
      render: (technology: string) => <span className='text-gray-500'>{makeCapitilized(technology)}</span>
    },
    {
      title: "ASSESSMENT LINK",
      dataIndex: "assessmentLink",
      key: "assessmentLink",
      render: (assessmentLink: string) => (
        <a href={assessmentLink} target="_blank" rel="noopener noreferrer" className='text-gray-500'>
          <Button type="link" icon={<ClipboardCheck size={14} />} > View Assessment</Button>
        </a>
      )
    },
    {
      title: "ACTION",
      key: "action",
      render: (_: any, record: AssessmentDataResponse) => (
        <div className="flex space-x-2">
          <Tooltip title="Edit">
            <Button type="text" icon={<Pencil size={14} />} onClick={() => handleEditAssessment(record._id)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this assessment?"
              onConfirm={() => handleDeleteAssessment(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" icon={<Trash2 size={14} />} danger loading={deleteLoading} />
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
          <Typography.Title level={2} className="text-2xl font-bold text-gray-900">Assessments</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-gray-500">
            Manage assessment templates for candidate evaluation
          </Typography.Text>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <PrimaryButton
            text='Create Assessment'
            icon={<ClipboardCheck size={16} />}
            onClick={() => navigate('/dashboard/assessments/new')}
          />

        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
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
              options={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
              className="w-40"
              showSearch
            />

            <ExportButton data={filteredAssessments} fileName="Assessments" />
          </div>
        </div>
        <CustomTable
          data={filteredAssessments}
          columns={columns}
          loading={assessmentLoading}
          pageSize={10}
        />

      </Card>
    </motion.div>
  );
};

export default AssessmentList;