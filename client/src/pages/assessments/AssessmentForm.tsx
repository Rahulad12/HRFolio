import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Card from '../../component/ui/Card';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import Textarea from '../../component/ui/Textarea';
import Button from '../../component/ui/Button';
import { assessments } from '../../data/mockData';
import { motion } from 'framer-motion';

const AssessmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'technical',
    duration: 60
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const assessment = assessments.find(a => a.id === id);
      if (assessment) {
        setFormData({
          title: assessment.title,
          description: assessment.description,
          type: assessment.type,
          duration: assessment.duration
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
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
      // In a real app, we would save the assessment here
      setIsSubmitting(false);
      navigate('/assessments');
    }, 1000);
  };

  const typeOptions = [
    { value: 'technical', label: 'Technical' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'case-study', label: 'Case Study' }
  ];

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
          onClick={() => navigate('/assessments')}
          aria-label="Back"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Assessment' : 'Create Assessment'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                fullWidth
                required
              />
            </div>
            <div>
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
                rows={4}
                fullWidth
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Type"
                  name="type"
                  options={typeOptions}
                  value={formData.type}
                  onChange={handleSelectChange('type')}
                  error={errors.type}
                  fullWidth
                />
              </div>
              <div>
                <Input
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration.toString()}
                  onChange={handleChange}
                  error={errors.duration}
                  min={1}
                  fullWidth
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              variant="outline"
              icon={<X size={16} />}
              onClick={() => navigate('/assessments')}
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
              {isEditing ? 'Update Assessment' : 'Create Assessment'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default AssessmentForm;