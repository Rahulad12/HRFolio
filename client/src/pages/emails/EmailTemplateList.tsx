import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Pencil, Trash2, Copy } from 'lucide-react';
import { emailTemplates } from '../../data/mockData';
import Card from '../../component/ui/Card';
import Button from '../../component/ui/Button';
import Table from '../../component/ui/Table';
import Badge from '../../component/ui/Badge';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import { EmailTemplate } from '../../types';
import { motion } from 'framer-motion';

const EmailTemplateList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const navigate = useNavigate();

  const filteredTemplates = emailTemplates.filter(template => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === '' || template.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleEditTemplate = (template: EmailTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/email-templates/edit/${template.id}`);
  };

  const handleDeleteTemplate = (template: EmailTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, we would delete the template here
    alert(`Delete template: ${template.name}`);
  };

  const handleDuplicateTemplate = (template: EmailTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, we would duplicate the template here
    alert(`Duplicate template: ${template.name}`);
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'offer', label: 'Offer Letter' },
    { value: 'interview', label: 'Interview' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'rejection', label: 'Rejection' },
    { value: 'other', label: 'Other' }
  ];

  const getTypeBadge = (type: EmailTemplate['type']) => {
    switch (type) {
      case 'offer':
        return <Badge variant="success">Offer Letter</Badge>;
      case 'interview':
        return <Badge variant="primary">Interview</Badge>;
      case 'assessment':
        return <Badge variant="secondary">Assessment</Badge>;
      case 'rejection':
        return <Badge variant="error">Rejection</Badge>;
      case 'other':
        return <Badge variant="info">Other</Badge>;
      default:
        return null;
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: (template: EmailTemplate) => (
        <div className="font-medium text-gray-900">{template.name}</div>
      )
    },
    {
      header: 'Subject',
      accessor: (template: EmailTemplate) => (
        <div className="text-sm text-gray-500 truncate max-w-md" title={template.subject}>
          {template.subject}
        </div>
      )
    },
    {
      header: 'Type',
      accessor: (template: EmailTemplate) => getTypeBadge(template.type)
    },
    {
      header: 'Actions',
      accessor: (template: EmailTemplate) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => handleEditTemplate(template, e)}
            aria-label="Edit template"
          >
            <Pencil size={16} className="text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => handleDuplicateTemplate(template, e)}
            aria-label="Duplicate template"
          >
            <Copy size={16} className="text-purple-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => handleDeleteTemplate(template, e)}
            aria-label="Delete template"
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
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
        <Button
          variant="primary"
          icon={<FileText size={16} />}
          className="mt-4 sm:mt-0"
          onClick={() => navigate('/email-templates/new')}
        >
          Create Template
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
            className="w-40"
          />
        </div>

        <Table
          columns={columns}
          data={filteredTemplates}
          keyExtractor={(template) => template.id}
          emptyMessage="No templates found. Try adjusting your filters or create a new template."
        />
      </Card>
    </motion.div>
  );
};

export default EmailTemplateList;