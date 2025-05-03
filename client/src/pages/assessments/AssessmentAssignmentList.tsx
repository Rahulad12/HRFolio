import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, CheckCircle, Clock, AlertCircle, X, Check, MoreVertical } from 'lucide-react';
import { AssessmentDataResponse, AssignmentDataResponse, candidateData, AssignmentScoreFromData } from '../../types';
import { motion } from 'framer-motion';
import { useAssignedAssessment } from '../../action/StoreAssessment';
import { useAppSelector } from '../../Hooks/hook';
import { makeCapitilized } from '../../utils/TextAlter';
import CustomTable from '../../component/common/Table';
import { Button, Input, Card, Select, Modal, Form, InputNumber, message, Typography, Tag, Dropdown, Skeleton } from 'antd';
import dayjs from 'dayjs';
import { useCreateAssignmentScoreMutation, useDeleteAssignmentMutation } from '../../services/assessmentServiceApi';
import PrimaryButton from '../../component/ui/button/Primary';
import ExportButton from '../../component/common/Export';
const { TextArea } = Input;
const AssessmentAssignmentList: React.FC = () => {
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentDataResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const { isLoading: assessmentLoading } = useAssignedAssessment();

  const [createAssignmentScore, { isLoading: scoreLoading }] = useCreateAssignmentScoreMutation();
  const [deleteAssignment, { isLoading: deleteLoading }] = useDeleteAssignmentMutation();

  const { assignedAssessments } = useAppSelector((state) => state.assessments);

  const filteredAssignments = assignedAssessments?.filter(assignment => {
    const matchesSearch =
      assignment?.candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment?.assessment?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment?.assessment.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === '' || assignment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewCandidate = (record: AssignmentDataResponse) => {
    setSelectedAssignment({ ...record });
    setIsModalOpen(true);
  }


  const handleSaveFeedback = async (value: AssignmentScoreFromData) => {
    if (!selectedAssignment) return;
    const payload = {
      ...value,
      candidate: selectedAssignment?.candidate?._id,
      assessment: selectedAssignment?.assessment?._id
    };
    try {
      const res = await createAssignmentScore(payload).unwrap();
      if (res?.success && res.data) {
        message.success(res.message);
        setIsModalOpen(false);
        form.resetFields()
      }
    } catch (error: any) {
      console.error("Failed to submit feedback", error);
      message.error(error.data.message);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    try {
      const res = await deleteAssignment(id).unwrap();
      if (res?.success) {
        message.success(res.message);
      }
    } catch (error: any) {
      console.error('Failed to delete assignment', error);
      message.error(error?.data?.message);
    }
  };

  const handleUpdateAssignment = async (id: string) => {
    navigate(`/dashboard/assessments/assign/edit/${id}`);
  }
  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Clock size={16} className="text-blue-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-amber-500" />;
      case 'completed':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'CANDIDATE',
      dataIndex: "candidate",
      render: (candidate: candidateData) => (
        <div className='flex flex-col cursor-pointer' onClick={() => navigate(`/dashboard/candidates/${candidate?._id}`)}>
          <span className='tfont-medium' >{makeCapitilized(candidate?.name)}</span>
          <span className='text-xs text-gray-500'>{makeCapitilized(candidate?.email)}</span>
        </div>
      )
    },
    {
      title: 'ASSESSMENT',
      dataIndex: "assessment",
      render: (assessment: AssessmentDataResponse) => (
        <div>
          <div className="font-medium capitalize">{assessment?.title}</div>
          <div className="text-xs text-gray-500">
            {makeCapitilized(assessment?.type)}
          </div>
        </div>
      )
    },
    {
      title: 'ASSIGNED DATE',
      dataIndex: 'date',
      render: (date: string) => (
        <span>
          {dayjs(date).format('MM-DD-YYYY')}
        </span>
      )
    },
    {
      title: 'STATUS',
      dataIndex: "status",
      render: (status: string) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(status)}
          <Tag
            color={
              status === 'assigned' ? 'blue' :
                status === 'pending' ? 'warning' : 'success'
            }
            className="ml-2"
          >
            {makeCapitilized(status)}
          </Tag>
        </div>
      )
    },
    {
      title: 'ACTIONS',
      render: (_: any, record: AssignmentDataResponse) => (
        <div className="flex items-center justify-center">
          <Button type='text' onClick={() => handleViewCandidate(record)} disabled={record.status === 'completed'}>
            <Eye size={16} className="text-blue-600" />
          </Button>
          {record.status === 'completed' ? (
            <CheckCircle size={16} className="text-green-600" />
          ) : (
            <AlertCircle size={16} className="text-amber-500" />
          )}
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Delete',
                  onClick: () => handleDeleteAssignment(record?._id),
                  danger: true,
                  disabled: record.status === 'completed'
                },
                {
                  key: '2',
                  label: 'Update',
                  onClick: () => handleUpdateAssignment(record?._id),
                  disabled: record.status === 'completed'
                }
              ]
            }}
          >
            <Button type='text'>
              <MoreVertical size={16} className="text-gray-600" />
            </Button>
          </Dropdown>

        </div>
      )
    }
  ];

  if (deleteLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Skeleton children />
    </div>
  )


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={2} className="text-2xl font-bold text-gray-900">Assessment Assignments</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-gray-500">Manage and track candidate assessment assignments</Typography.Text>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <PrimaryButton text='Assing Assessment' onClick={() => navigate('/dashboard/assessments/assign')} />
        </div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search assignments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search size={18} className="text-gray-400" />}
            />
          </div>
          <div className="flex space-x-2 gap-2">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              className="w-40"
            />
            <ExportButton data={filteredAssignments} fileName="Assessignments" />
          </div>
        </div>

        <CustomTable data={filteredAssignments} columns={columns} loading={assessmentLoading} pageSize={10} />
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedAssignment(null);
          form.resetFields(); // reset here
        }}
        title="Evaluate Assessment"
        width={600}
        afterClose={() => {
          setSelectedAssignment(null);
          form.resetFields();
        }}
        footer={null}
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium ">Candidate:</h3>
            <p className="text-sm capitalize text-gray-400">{selectedAssignment?.candidate?.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Assessment:</h3>
            <p className="text-sm capitalize text-gray-400">{selectedAssignment?.assessment?.title}</p>
          </div>

          <Form
            onFinish={handleSaveFeedback}
            layout='vertical'
            form={form}
          >
            <Form.Item label="Score" name="score" rules={[{ required: true, message: 'Please enter a score' }]}>
              <InputNumber
                min={0}
                max={100}
                className="w-full"
                style={{ width: '100%' }}

              />
            </Form.Item>
            <Form.Item
              label="Feedback"
              name="note"
            >
              <TextArea
                rows={5}
                placeholder="Provide detailed feedback on the candidate's performance..."
              />
            </Form.Item>

            <Form.Item
              className='flex justify-end'
            >
              <Button type="default" onClick={() => setIsModalOpen(false)} className="mr-3" icon={<X size={16} />}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={scoreLoading} icon={<Check size={16} />} disabled={scoreLoading}>Save Evaluation</Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AssessmentAssignmentList;
