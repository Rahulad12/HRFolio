import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Send } from 'lucide-react';
import { candidates, offerLetters, emailTemplates } from '../../data/mockData';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Form, Button, Select, Input, Card, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import SecondaryButton from '../../component/ui/button/Secondary';
import { useGetAllEmailTemplateQuery } from '../../services/emailService';


const OfferForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState('');
  const handleSaveAsDraft = () => {
    message.success('Draft saved successfully!');
    navigate('/dashboard/offers');
  }
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



  const handleSubmit = (value: any) => {
    console.log(value);
    message.success('Offer letter send successfully');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center">
        <Button
          type="text"
          size="small"
          className="mr-3"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/offers')}
          aria-label="Back"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Offer Letter' : 'Create Offer Letter'}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <Form onFinish={handleSubmit} form={form} layout='vertical'>
              <div className="space-y-6">
                <div>
                  <Form.Item
                    label="Candidate"
                    name="candidateId"
                    rules={[{ required: true, message: 'Candidate is required' }]}
                  >
                    <Select
                      options={candidateOptions}
                      value={formData.candidateId}
                    />
                  </Form.Item>

                </div>
                <div>
                  <Form.Item
                    label="Position"
                    name="position"
                    rules={[{ required: true, message: 'Position is required' }]}
                  >
                    <Input placeholder='e.g. Software Engineer' />
                  </Form.Item>

                </div>
                <div>
                  <Form.Item
                    label="Salary"
                    name="salary"
                    rules={[{ required: true, message: 'Salary is required' }]}
                  >
                    <Input
                      placeholder="e.g. $80,000"
                    />
                  </Form.Item>

                </div>
                <div>
                  <Form.Item
                    label="Start Date"
                    name="startDate"
                    rules={[{ required: true, message: 'Start date is required' }]}
                  >
                    <DatePicker width={'100%'} />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    label="Email Template"
                    name="emailTemplateId"
                    rules={[{ required: true, message: 'Email template is required' }]}
                  >
                    <Select
                      options={templateOptions}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <Button
                  type="default"
                  icon={<X size={16} />}
                  onClick={() => navigate('/dashboard/offers')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <SecondaryButton
                  htmlType='button'
                  text='Save as Draft'
                  icon={<Save size={16} />}
                  loading={isSubmitting}
                  onClick={handleSaveAsDraft}
                />
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<Send size={16} />}
                >
                  Send Offer
                </Button>
              </div>
            </Form>
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