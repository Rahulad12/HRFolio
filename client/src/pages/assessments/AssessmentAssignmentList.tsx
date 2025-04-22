import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Download, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { assessmentAssignments, candidates, assessments } from '../../data/mockData';
import Card from '../../component/ui/Card';
import Button from '../../component/ui/Button';
import Table from '../../component/ui/Table';
import Badge from '../../component/ui/Badge';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import Modal from '../../component/ui/Modal';
import Textarea from '../../component/ui/Textarea';
import { AssessmentAssignment } from '../../types';
import { motion } from 'framer-motion';

const AssessmentAssignmentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedAssignment, setSelectedAssignment] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState('');
  const navigate = useNavigate();

  // Combine assignment data with candidate and assessment names
  const assignmentsWithDetails = assessmentAssignments.map(assignment => {
    const candidate = candidates.find(c => c.id === assignment.candidateId);
    const assessment = assessments.find(a => a.id === assignment.assessmentId);
    
    return {
      ...assignment,
      candidateName: candidate?.name || 'Unknown',
      assessmentTitle: assessment?.title || 'Unknown',
      assessmentType: assessment?.type || 'technical',
      position: candidate?.position || 'Unknown Position'
    };
  });

  const filteredAssignments = assignmentsWithDetails.filter(assignment => {
    const matchesSearch = 
      assignment.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewCandidate = (assignment: typeof assignmentsWithDetails[0]) => {
    navigate(`/candidates/${assignment.candidateId}`);
  };

  const handleAssignmentComplete = (assignment: typeof assignmentsWithDetails[0]) => {
    setSelectedAssignment(assignment);
    setFeedback(assignment.feedback || '');
    setScore(assignment.score?.toString() || '');
    setIsModalOpen(true);
  };

  const handleSaveFeedback = () => {
    // In a real app, we would save the feedback here
    console.log('Saving feedback:', {
      assignmentId: selectedAssignment?.id,
      feedback,
      score: parseInt(score) || 0
    });
    
    setIsModalOpen(false);
  };

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'completed', label: 'Completed' },
    { value: 'evaluated', label: 'Evaluated' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Clock size={16} className="text-blue-500" />;
      case 'completed':
        return <AlertCircle size={16} className="text-amber-500" />;
      case 'evaluated':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const columns = [
    {
      header: 'Candidate',
      accessor: (assignment: typeof assignmentsWithDetails[0]) => (
        <div>
          <div className="font-medium text-gray-900">{assignment.candidateName}</div>
          <div className="text-xs text-gray-500">{assignment.position}</div>
        </div>
      )
    },
    {
      header: 'Assessment',
      accessor: (assignment: typeof assignmentsWithDetails[0]) => (
        <div>
          <div className="font-medium text-gray-900">{assignment.assessmentTitle}</div>
          <div className="text-xs text-gray-500">
            {assignment.assessmentType.charAt(0).toUpperCase() + assignment.assessmentType.slice(1)}
          </div>
        </div>
      )
    },
    {
      header: 'Assigned Date',
      accessor: 'assignedDate'
    },
    {
      header: 'Due Date',
      accessor: 'dueDate'
    },
    {
      header: 'Status',
      accessor: (assignment: typeof assignmentsWithDetails[0]) => (
        <div className="flex items-center">
          {getStatusIcon(assignment.status)}
          <Badge 
            variant={
              assignment.status === 'assigned' ? 'primary' : 
              assignment.status === 'completed' ? 'warning' : 'success'
            }
            className="ml-2"
          >
            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
          </Badge>
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: (assignment: typeof assignmentsWithDetails[0]) => (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="p-1"
            onClick={(e) => {
              e.stopPropagation();
              handleViewCandidate(assignment);
            }}
            aria-label="View candidate"
          >
            <Eye size={16} className="text-blue-600" />
          </Button>
          {assignment.status === 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={(e) => {
                e.stopPropagation();
                handleAssignmentComplete(assignment);
              }}
              aria-label="Mark as evaluated"
            >
              <CheckCircle size={16} className="text-green-600" />
            </Button>
          )}
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
          <h1 className="text-2xl font-bold text-gray-900">Assessment Assignments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track candidate assessment assignments
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button
            variant="primary"
            onClick={() => navigate('/assessments')}
          >
            Manage Assessments
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
              placeholder="Search assignments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
          </div>
          <div className="flex space-x-2">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-40"
            />
            <Button
              variant="outline"
              icon={<Filter size={16} />}
              aria-label="More filters"
            >
              Filters
            </Button>
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
          data={filteredAssignments}
          keyExtractor={(assignment) => assignment.id}
          onRowClick={() => {}}
          emptyMessage="No assessment assignments found. Try adjusting your filters."
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Evaluate Assessment"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="mr-3"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveFeedback}
            >
              Save Evaluation
            </Button>
          </>
        }
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Candidate:</h3>
              <p className="text-sm text-gray-900">{selectedAssignment.candidateName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Assessment:</h3>
              <p className="text-sm text-gray-900">{selectedAssignment.assessmentTitle}</p>
            </div>
            <div>
              <Input
                label="Score (%)"
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                fullWidth
              />
            </div>
            <div>
              <Textarea
                label="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                placeholder="Provide detailed feedback on the candidate's performance..."
                fullWidth
              />
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default AssessmentAssignmentList;