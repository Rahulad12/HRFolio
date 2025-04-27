import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Input, Select, Form, message, Card, Typography } from 'antd';
const { TextArea } = Input;
import { useCreateEmailTemplateMutation, useGetEmailTemplateByIdQuery, useUpdateEmailTemplateMutation } from '../../services/emailService';
import { emailTemplateData } from '../../types';
import { useAppSelector } from '../../Hooks/hook';

const EmailTemplateForm: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const darkMode = useAppSelector(state => state.theme.mode === 'dark');

  const [createEmailTemplate, { isLoading: createemailTemplateLoading }] = useCreateEmailTemplateMutation();
  const { data: emailTemplates, isLoading: emailTemplateLoading } = useGetEmailTemplateByIdQuery(id || "", { skip: !id });
  const [updateEmailTemplate, { isLoading: updateEmailTemplateLoading }] = useUpdateEmailTemplateMutation();

  useEffect(() => {
    if (isEditing && emailTemplates?.data) {
      form.setFieldsValue({
        name: emailTemplates?.data?.name,
        subject: emailTemplates?.data?.subject,
        body: emailTemplates?.data?.body,
        type: emailTemplates?.data?.type
      });
    }
  }, [emailTemplates, isEditing]);

  const handleSubmit = async (value: emailTemplateData) => {
    try {
      if (isEditing) {
        const res = await updateEmailTemplate({ id: id || '', data: value }).unwrap();
        if (res.success) {
          message.success(res.message);
          navigate('/dashboard/email-templates');
          return;
        }
      }
      else {
        const res = await createEmailTemplate(value).unwrap();
        if (res?.success && res?.data) {
          message.success(res?.message);
          form.resetFields();
        }
      }

    } catch (error: any) {
      console.error('Submission failed', error);
      message.error(error?.data?.message);
    }
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
          type="text"
          size="small"
          className="mr-3"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/email-templates')}
          aria-label="Back"
        />
        <Typography.Title level={2} className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Email Template' : 'Create Email Template'}
        </Typography.Title>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <Form onFinish={handleSubmit} layout='vertical' form={form}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Form.Item
                      label="Template Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter a template name' }]}
                    >
                      <Input placeholder='e.g. Standard Offer Letter' />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label="Template Type"
                      name="type"
                      rules={[{ required: true, message: 'Please select a template type' }]}
                    >
                      <Select
                        options={typeOptions}
                      />

                    </Form.Item>

                  </div>
                </div>
                <div>
                  <Form.Item
                    label="Email Subject"
                    name="subject"
                    rules={[{ required: true, message: 'Please enter an email subject' }]}
                  >
                    <Input placeholder='e.g. Your Offer from {{companyName}}' />
                  </Form.Item>
                </div>
                <div>
                  <Form.Item
                    label="Email Body"
                    name="body"
                    rules={[{ required: true, message: 'Please enter an email body' }]}
                  >
                    <TextArea
                      rows={12}
                      placeholder="Add your email content here. Use {{variableName}} for dynamic content."
                    />
                  </Form.Item>

                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <Button
                  type="default"
                  icon={<X size={16} />}
                  onClick={() => navigate('/dashboard/email-templates')}
                  disabled={emailTemplateLoading || createemailTemplateLoading}
                >
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<Save size={16} />}
                  loading={updateEmailTemplateLoading || createemailTemplateLoading}
                  disabled={updateEmailTemplateLoading || createemailTemplateLoading}
                >
                  {isEditing ? 'Update Template' : 'Save Template'}
                </Button>
              </div>
            </Form>
          </Card>
        </div>

        <div>
          <Card title="Available Variables">
            <div className="space-y-4">
              <p className="text-sm ">
                Use these variables in your template by wrapping them in double curly braces:
                <code className={`${darkMode ? 'bg-gray-500' : 'bg-blue-50 text-blue-700'} px-1 py-0.5 rounded text-sm ml-1`}>{'{{variableName}}'}</code>
              </p>

              <ul className="space-y-2">
                {variableExamples.map((variable) => (
                  <li key={variable.name} className="text-sm">
                    <code className={`${darkMode ? 'bg-gray-500' : 'bg-blue-50 text-blue-700'}  px-1 py-0.5 rounded font-mono`}>
                      {'{{' + variable.name + '}}'}
                    </code>
                    <span className="ml-2 ">{variable.description}</span>
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