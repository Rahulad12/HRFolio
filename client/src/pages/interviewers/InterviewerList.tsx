import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Download, Pencil, Trash2 } from 'lucide-react';
import { interviewers } from '../../data/mockData';
import Card from '../../component/ui/Card';
import Button from '../../component/ui/Button';
import Table from '../../component/ui/Table';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import { Interviewer } from '../../types';
import { motion } from 'framer-motion';

const InterviewerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const navigate = useNavigate();

  const filteredInterviewers = interviewers.filter(interviewer => {
    const matchesSearch =
      interviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = departmentFilter === '' || interviewer.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  const handleEditInterviewer = (interviewer: Interviewer, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/interviewers/edit/${interviewer.id}`);
  };

  const handleDeleteInterviewer = (interviewer: Interviewer, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, we would delete the interviewer here
    alert(`Delete interviewer: ${interviewer.name}`);
  };

  // Get unique departments for filter
  const departments = [...new Set(interviewers.map(interviewer => interviewer.department))];
  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map(dept => ({ value: dept, label: dept }))
  ];

  const columns = [
    {
      header: 'Name',
      accessor: (interviewer: Interviewer) => (
        <div>
          <div className="font-medium text-gray-900">{interviewer.name}</div>
          <div className="text-xs text-gray-500">{interviewer.email}</div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department'
    },
    {
      header: 'Position',
      accessor: 'position'
    },
    {
      header: 'Availability',
      accessor: (interviewer: Interviewer) => (
        <div className="text-sm">
          {interviewer.availability.map((avail, index) => (
            <div key={index} className="mb-1">
              <span className="font-medium">{avail.day}:</span>{' '}
              <span className="text-gray-600">{avail.timeSlots.join(', ')}</span>
            </div>
          ))}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (interviewer: Interviewer) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => handleEditInterviewer(interviewer, e)}
            aria-label="Edit interviewer"
          >
            <Pencil size={16} className="text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => handleDeleteInterviewer(interviewer, e)}
            aria-label="Delete interviewer"
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
          <h1 className="text-2xl font-bold text-gray-900">Interviewers</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage staff members who conduct interviews
          </p>
        </div>
        <Button
          variant="primary"
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
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              placeholder="Search interviewers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <div className="flex space-x-2">
            <Select
              options={departmentOptions}
              value={departmentFilter}
              onChange={setDepartmentFilter}
              className="w-48"
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
          data={filteredInterviewers}
          keyExtractor={(interviewer) => interviewer.id}
          emptyMessage="No interviewers found. Try adjusting your filters or add a new interviewer."
        />
      </Card>
    </motion.div>
  );
};

export default InterviewerList;