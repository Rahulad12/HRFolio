import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Card from '../../component/ui/Card';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import Textarea from '../../component/ui/Textarea';
import Button from '../../component/ui/Button';
import { candidates } from '../../data/mockData';
import { CandidateStatus } from '../../types';
import { motion } from 'framer-motion';

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'screening', label: 'Screening' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'offered', label: 'Offered' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' }
];

const CandidateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'new' as CandidateStatus,
    resume: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const candidate = candidates.find(c => c.id === id);
      if (candidate) {
        setFormData({
          name: candidate.name,
          email: candidate.email,
          phone: candidate.phone,
          position: candidate.position,
          status: candidate.status,
          resume: candidate.resume,
          notes: candidate.notes
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, we would save the candidate here
      setIsSubmitting(false);
      navigate('/candidates');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="mr-3"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/candidates')}
          aria-label="Back"
        >
          Back
        </Button>

        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Candidate' : 'Add New Candidate'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                fullWidth
                required
              />
            </div>
            <div>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                fullWidth
                required
              />
            </div>
            <div>
              <Input
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                fullWidth
                required
              />
            </div>
            <div>
              <Input
                label="Position Applied For"
                name="position"
                value={formData.position}
                onChange={handleChange}
                error={errors.position}
                fullWidth
                required
              />
            </div>
            <div>
              <Select
                label="Status"
                name="status"
                options={statusOptions}
                value={formData.status}
                onChange={handleSelectChange('status')}
                error={errors.status}
                fullWidth
              />
            </div>
            <div>
              <Input
                label="Resume URL"
                name="resume"
                value={formData.resume}
                onChange={handleChange}
                helperText="Link to candidate's resume (Google Drive, Dropbox, etc.)"
                fullWidth
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={5}
                fullWidth
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              variant="outline"
              icon={<X size={16} />}
              onClick={() => navigate('/dashboard/candidates')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={16} />}
              isLoading={isSubmitting}
            >
              {isEditing ? 'Update Candidate' : 'Save Candidate'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default CandidateForm;