import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Search, Download, Pencil, Trash2 } from 'lucide-react';
import { assessments } from '../../data/mockData';
import Card from '../../component/ui/Card';
import Button from '../../component/ui/Button';
import Table from '../../component/ui/Table';
import Badge from '../../component/ui/Badge';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import { Assessment } from '../../types';
import { motion } from 'framer-motion';

const AssessmentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const navigate = useNavigate();

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === '' || assessment.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const handleEditAssessment = (assessment: Assessment, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/assessments/edit/${assessment.id}`);
  };

  const handleDeleteAssessment = (assessment: Assessment, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, we would delete the assessment here
    alert(`Delete assessment: ${assessment.title}`);
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'technical', label: 'Technical' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'case-study', label: 'Case Study' }
  ];

  const columns = [
    {
      header: 'Title',
      accessor: (assessment: Assessment) => (
        <div className="font-medium text-gray-900">{assessment.title}</div>
      )
    },
    {
      header: 'Description',
      accessor: (assessment: Assessment) => (
        <div className="text-sm text-gray-500 truncate max-w-md" title={assessment.description}>
          {assessment.description}
        </div>
      )
    },
    {
      header: 'Type',
      accessor: (assessment: Assessment) => (
        <Badge 
          variant={
            assessment.type === 'technical' ? 'primary' : 
            assessment.type === 'behavioral' ? 'success' : 'warning'
          }
        >
          {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
        </Badge>
      )
    },
    {
      header: 'Duration',
      accessor: (assessment: Assessment) => (
        <span>{assessment.duration} minutes</span>
      )
    },
    {
      header: 'Actions',
      accessor: (assessment: Assessment) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => handleEditAssessment(assessment, e)}
            aria-label="Edit assessment"
          >
            <Pencil size={16} className="text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => handleDeleteAssessment(assessment, e)}
            aria-label="Delete assessment"
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
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage assessment templates for candidate evaluation
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="primary"
            icon={<ClipboardCheck size={16} />}
            onClick={() => navigate('/assessments/new')}
          >
            Create Assessment
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/assessments/assignments')}
          >
            Manage Assignments
          </Button>
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
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <div className="flex space-x-2">
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
              className="w-40"
            />
            <Button
              variant="outline"
              icon={<Download size={16} />}
              aria-label="Export"
            >
              Export
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredAssessments}
          keyExtractor={(assessment) => assessment.id}
          emptyMessage="No assessments found. Try adjusting your filters or create a new assessment."
        />
      </Card>
    </motion.div>
  );
};

export default AssessmentList;