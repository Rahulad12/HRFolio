import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Card from '../../component/ui/Card';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import Textarea from '../../component/ui/Textarea';
import Button from '../../component/ui/Button';
import { emailTemplates } from '../../data/mockData';
import { motion } from 'framer-motion';

const EmailTemplateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    body: '',
    type: 'offer'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const template = emailTemplates.find(t => t.id === id);
      if (template) {
        setFormData({
          name: template.name,
          subject: template.subject,
          body: template.body,
          type: template.type
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
      newErrors.name = 'Template name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Email subject is required';
    }

    if (!formData.body.trim()) {
      newErrors.body = 'Email body is required';
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
      // In a real app, we would save the template here
      setIsSubmitting(false);
      navigate('/email-templates');
    }, 1000);
  };

  const typeOptions = [
    { value: 'offer', label: 'Offer Letter' },
    { value: 'interview', label: 'Interview' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'rejection', label: 'Rejection' },
    { value: 'other', label: 'Other' }
  ];

  const variableExamples = [
    { name: 'candidateName', description: 'Full name of the candidate' },
    { name: 'position', description: 'Job position title' },
    { name: 'salary', description: 'Offered salary' },
    { name: 'startDate', description: 'Expected start date' },
    { name: 'interviewDate', description: 'Scheduled interview date' },
    { name: 'interviewTime', description: 'Scheduled interview time' },
    { name: 'interviewType', description: 'Type of interview (video, phone, onsite)' },
    { name: 'duration', description: 'Duration of interview or assessment' },
    { name: 'responseDeadline', description: 'Deadline for offer response' }
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
          onClick={() => navigate('/email-templates')}
          aria-label="Back"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Email Template' : 'Create Email Template'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Template Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      placeholder="e.g. Standard Offer Letter"
                      fullWidth
                      required
                    />
                  </div>
                  <div>
                    <Select
                      label="Template Type"
                      name="type"
                      options={typeOptions}
                      value={formData.type}
                      onChange={handleSelectChange('type')}
                      error={errors.type}
                      fullWidth
                      required
                    />
                  </div>
                </div>
                <div>
                  <Input
                    label="Email Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    placeholder="e.g. Your Offer from {{companyName}}"
                    fullWidth
                    required
                  />
                </div>
                <div>
                  <Textarea
                    label="Email Body"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    error={errors.body}
                    rows={12}
                    placeholder="Add your email content here. Use {{variableName}} for dynamic content."
                    fullWidth
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  icon={<X size={16} />}
                  onClick={() => navigate('/email-templates')}
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
                  {isEditing ? 'Update Template' : 'Save Template'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div>
          <Card title="Available Variables">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Use these variables in your template by wrapping them in double curly braces:
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm ml-1">{'{{variableName}}'}</code>
              </p>

              <ul className="space-y-2">
                {variableExamples.map((variable) => (
                  <li key={variable.name} className="text-sm">
                    <code className="bg-blue-50 text-blue-700 px-1 py-0.5 rounded font-mono">
                      {'{{' + variable.name + '}}'}
                    </code>
                    <span className="ml-2 text-gray-600">{variable.description}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-amber-50 p-3 rounded-md mt-4">
                <h4 className="text-sm font-medium text-amber-800">Example Usage</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Dear {'{{candidateName}}'},<br /><br />
                  We are pleased to offer you the position of {'{{position}}'} with a starting salary of {'{{salary}}'}.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailTemplateForm;