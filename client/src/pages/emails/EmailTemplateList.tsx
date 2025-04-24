import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Pencil, Trash2, Copy } from 'lucide-react';
import { emailTemplateData } from '../../types';
import { motion } from 'framer-motion';
import { Button, Card, Select, Input, Tag, message, Popconfirm, Tooltip } from 'antd';
import PrimaryButton from '../../component/ui/button/Primary';
import CustomTable from '../../component/common/Table';
import { useDeleteEmailTemplateMutation, useGetAllEmailTemplateQuery } from '../../services/emailService';
const EmailTemplateList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const navigate = useNavigate();
  const { data: emailTemplates, refetch, isLoading } = useGetAllEmailTemplateQuery()
  const [deleteEmailTemplate, { isLoading: deleteEmailTemplateLoading }] = useDeleteEmailTemplateMutation();

  const filteredTemplates = emailTemplates?.data?.filter(template => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === '' || template.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleEditTemplate = (template: emailTemplateData) => {
    navigate(`/dashboard/email-templates/edit/${template._id}`);
  };

  const handleDeleteTemplate = async (template: emailTemplateData) => {
    try {
      const res = await deleteEmailTemplate(template._id).unwrap();
      if (res?.success) {
        message.success(res?.message);
        refetch();
      }
    } catch (error: any) {
      console.error('Failed to delete template', error);
      message.error(error?.data?.message);
    }
  };

  const handleDuplicateTemplate = (template: emailTemplateData) => {

    // In a real app, we would duplicate the template here
    alert(`Duplicate template: ${template._id}`);
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'offer', label: 'Offer Letter' },
    { value: 'interview', label: 'Interview' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'rejection', label: 'Rejection' },
    { value: 'other', label: 'Other' }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'offer':
        return <Tag color='blue'>Offer Letter</Tag>;
      case 'interview':
        return <Tag color='orange'>Interview</Tag>;
      case 'assessment':
        return <Tag color='green'>Assessment</Tag>;
      case 'rejection':
        return <Tag color='red'>Rejection</Tag>;
      case 'other':
        return <Tag color='gray'>Other</Tag>;
      default:
        return null;
    }
  };


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string) => (
        <div className="font-medium text-gray-900 capitalize">{text}</div>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      render: (text: string) => (
        <div className="text-sm text-gray-500 truncate max-w-md">
          {text}
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (text: string) => (
        <div>
          {getTypeBadge(text)}
        </div>
      )
    },
    {
      title: 'Actions',
      render: (_: any, record: emailTemplateData) => (
        <div className="flex space-x-2">
          <Tooltip
            title="Edit"
          >
            <Button
              type="text"
              size="small"
              className="p-1"
              onClick={() => handleEditTemplate(record)}
              aria-label="Edit template"
              icon={<Pencil size={16} />}
            />
          </Tooltip>

          <Tooltip
            title="Duplicate"
          >
            <Button
              type="text"
              size="small"
              className="p-1"
              onClick={() => handleDuplicateTemplate(record)}
              aria-label="Duplicate template"
              icon={<Copy size={16} />}
            />

          </Tooltip>

          <Tooltip
            title="Delete"
          >
            <Popconfirm
              title="Delete this template?"
              description="Are you sure you want to delete this template?"
              onConfirm={() => handleDeleteTemplate(record)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: deleteEmailTemplateLoading }}
            >
              <Button
                type="text"
                size="small"
                className="p-1"
                danger
                aria-label="Delete template"
                icon={<Trash2 size={16} />}
              />
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
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage email templates for various recruitment communications
          </p>
        </div>
        <PrimaryButton
          text="Create Template"
          icon={<FileText size={16} />}
          onClick={() => navigate('/dashboard/email-templates/new')}
          loading={false}
        />


      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            </div>
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search size={18} className='text-gray-400' />}
            />
          </div>
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            className="w-40"
          />
        </div>

        <CustomTable
          data={filteredTemplates || []}
          columns={columns}
          loading={isLoading}
          pageSize={10}
        />
      </Card>
    </motion.div>
  );
};

export default EmailTemplateList;