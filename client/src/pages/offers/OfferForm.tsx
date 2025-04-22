import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Send } from 'lucide-react';
import Card from '../../component/ui/Card';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import Button from '../../component/ui/Button';
import { candidates, offerLetters, emailTemplates } from '../../data/mockData';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const OfferForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    candidateId: '',
    position: '',
    salary: '',
    startDate: new Date(),
    emailTemplateId: '',
    status: 'draft'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState('');

  const candidateOptions = candidates
    .filter(candidate => candidate.status === 'interviewing' || candidate.status === 'assessment')
    .map(candidate => ({
      value: candidate.id,
      label: `${candidate.name} (${candidate.position})`
    }));

  const templateOptions = emailTemplates
    .filter(template => template.type === 'offer')
    .map(template => ({
      value: template.id,
      label: template.name
    }));

  useEffect(() => {
    if (isEditing) {
      const offer = offerLetters.find(o => o.id === id);
      if (offer) {
        setFormData({
          candidateId: offer.candidateId,
          position: offer.position,
          salary: offer.salary,
          startDate: new Date(offer.startDate),
          emailTemplateId: '',
          status: offer.status
        });
      }
    }
  }, [id, isEditing]);

  useEffect(() => {
    // Generate preview when template and candidate are selected
    if (formData.candidateId && formData.emailTemplateId) {
      const template = emailTemplates.find(t => t.id === formData.emailTemplateId);
      const candidate = candidates.find(c => c.id === formData.candidateId);
      
      if (template && candidate) {
        // Simple template variable replacement
        let previewText = template.body
          .replace(/{{candidateName}}/g, candidate.name)
          .replace(/{{position}}/g, formData.position || candidate.position)
          .replace(/{{salary}}/g, formData.salary)
          .replace(/{{startDate}}/g, format(formData.startDate, 'MMMM d, yyyy'))
          .replace(/{{responseDeadline}}/g, format(new Date(formData.startDate.getTime() - 7 * 24 * 60 * 60 * 1000), 'MMMM d, yyyy'));
        
        setPreview(previewText);
      } else {
        setPreview('');
      }
    } else {
      setPreview('');
    }
  }, [formData]);

  const handleDateChange = (date: Date) => {
    setFormData(prev => ({ ...prev, startDate: date }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // If candidate changes, update position
      if (name === 'candidateId') {
        const candidate = candidates.find(c => c.id === value);
        if (candidate) {
          newData.position = candidate.position;
        }
      }
      
      return newData;
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.candidateId) {
      newErrors.candidateId = 'Candidate is required';
    }
    
    if (!formData.position) {
      newErrors.position = 'Position is required';
    }
    
    if (!formData.salary) {
      newErrors.salary = 'Salary is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent, shouldSend = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, we would save the offer here
      setIsSubmitting(false);
      navigate('/offers');
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
          onClick={() => navigate('/offers')}
          aria-label="Back"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Offer Letter' : 'Create Offer Letter'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <form onSubmit={(e) => handleSubmit(e, false)}>
              <div className="space-y-6">
                <div>
                  <Select
                    label="Candidate"
                    name="candidateId"
                    options={candidateOptions}
                    value={formData.candidateId}
                    onChange={handleSelectChange('candidateId')}
                    error={errors.candidateId}
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    error={errors.position}
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <Input
                    label="Salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    error={errors.salary}
                    placeholder="e.g. $80,000"
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    className={`
                      appearance-none block w-full px-3 py-2 border rounded-md shadow-sm 
                      placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm
                      ${errors.startDate ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                    `}
                  />
                  {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
                </div>
                <div>
                  <Select
                    label="Email Template"
                    name="emailTemplateId"
                    options={templateOptions}
                    value={formData.emailTemplateId}
                    onChange={handleSelectChange('emailTemplateId')}
                    fullWidth
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  icon={<X size={16} />}
                  onClick={() => navigate('/offers')}
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
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  variant="success"
                  icon={<Send size={16} />}
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting || !formData.emailTemplateId}
                >
                  Send Offer
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card title="Email Preview">
            {preview ? (
              <div className="whitespace-pre-line">{preview}</div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Select a candidate and email template to see the preview</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default OfferForm;