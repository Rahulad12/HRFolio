import React, { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import {
  Button, Input, Select, Form, message,
  Card, Typography, Divider, Table, Tooltip
} from 'antd';

import {
  useCreateEmailTemplateMutation,
  useGetEmailTemplateByIdQuery,
  useUpdateEmailTemplateMutation
} from '../../services/emailService';
import { emailTemplateData } from '../../types';
import { useAppSelector } from '../../Hooks/hook';

const { TextArea } = Input;

const EmailTemplateForm: React.FC = () => {
  const [form] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  const darkMode = useAppSelector(state => state.theme.mode === 'dark');

  const [createEmailTemplate, { isLoading: createLoading }] = useCreateEmailTemplateMutation();
  const { data: emailTemplates } = useGetEmailTemplateByIdQuery(id || '', { skip: !id });
  const [updateEmailTemplate, { isLoading: updateLoading }] = useUpdateEmailTemplateMutation();

  useEffect(() => {
    if (isEditing && emailTemplates?.data) {
      form.setFieldsValue(emailTemplates.data);
    }
  }, [emailTemplates, isEditing, form]);

  const handleBack = useCallback(() => navigate('/dashboard/email-templates'), [navigate]);

  const handleSubmit = useCallback(async (value: emailTemplateData) => {
    try {
      const action = isEditing
        ? updateEmailTemplate({ id: id || '', data: value }).unwrap()
        : createEmailTemplate(value).unwrap();

      const res = await action;
      if (res.success) {
        message.success(res.message);
        if (!isEditing) form.resetFields();
        handleBack();
      }
    } catch (error: any) {
      message.error(error?.data?.message || 'An error occurred');
    }
  }, [isEditing, id, updateEmailTemplate, createEmailTemplate, form, handleBack]);

  const typeOptions = useMemo(() => [
    { value: 'offer', label: 'Offer Letter' },
    { value: 'interview', label: 'Interview' },
    { value: 'assessment', label: 'Assessment' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejection', label: 'Rejection' },
  ], []);

  const variableExamples = useMemo(() => [
    { name: 'candidateName', description: 'Full name of the candidate' },
    { name: 'position', description: 'Job position title' },
    { name: 'salary', description: 'Offered salary' },
    { name: 'startDate', description: 'Expected joining date' },
    { name: 'interviewDate', description: 'Interview date' },
    { name: 'interviewTime', description: 'Interview time' },
    { name: 'interviewerName', description: 'Interviewer name' },
    { name: 'interviewerEmail', description: 'Interviewer email' },
    { name: 'interviewLink', description: 'Virtual interview link' },
    { name: 'assessmentDate', description: 'Assessment date' },
    { name: 'assessmentTime', description: 'Assessment time' },
    { name: 'rejectionReason', description: 'Rejection reason' },
    { name: 'rejectionDate', description: 'Rejection date' },
    { name: 'rejectionTime', description: 'Rejection time' },
    { name: 'offerDate', description: 'Offer date' },
    { name: 'offerTime', description: 'Offer time' },
    { name: 'duration', description: 'Interview/Assessment duration' },
    { name: 'technology', description: 'Technology stack' },
    { name: 'benefits', description: 'Job benefits' },
    { name: 'stockOptions', description: 'Stock options' },
    { name: 'responseDeadline', description: 'Response deadline for offer' },
    { name: 'assessmentLink', description: 'Assessment access link' },
  ], []);

  const columns = useMemo(() => [
    { title: 'Line Break', dataIndex: 'lineBreak', key: 'lineBreak' },
    { title: 'Bold Text', dataIndex: 'bold', key: 'bold' },
    { title: 'Italic Text', dataIndex: 'italic', key: 'italic' },
    { title: 'Underline Text', dataIndex: 'underline', key: 'underline' },
  ], []);

  const formattingGuide = useMemo(() => [{
    key: '1',
    lineBreak: '<br>',
    bold: '<b>Bold</b>',
    italic: '<i>Italic</i>',
    underline: '<u>Underline</u>',
  }], []);

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button type="text" icon={<ArrowLeft size={18} />} onClick={handleBack} />
        <Typography.Title level={2} className="ml-3 text-2xl">
          {isEditing ? 'Edit Email Template' : 'Create Email Template'}
        </Typography.Title>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Template Details">
            <Form onFinish={handleSubmit} layout="vertical" form={form}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    label="Template Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter a template name' }]}
                  >
                    <Input placeholder="e.g. Standard Offer Letter" />
                  </Form.Item>

                  <Form.Item
                    label="Template Type"
                    name="type"
                    rules={[{ required: true, message: 'Please select a template type' }]}
                  >
                    <Select options={typeOptions} />
                  </Form.Item>
                </div>

                <Form.Item
                  label="Email Subject"
                  name="subject"
                  rules={[{ required: true, message: 'Please enter an email subject' }]}
                >
                  <Input placeholder="e.g. Your Offer from {{companyName}}" />
                </Form.Item>

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

              <div className="mt-8 flex justify-end space-x-3">
                <Button type="default" icon={<X size={16} />} onClick={handleBack}>
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  type="primary"
                  icon={<Save size={16} />}
                  loading={createLoading || updateLoading}
                >
                  {isEditing ? 'Update Template' : 'Save Template'}
                </Button>
              </div>
            </Form>
          </Card>

          <Divider orientation="left">Formatting Guide</Divider>
          <Table
            columns={columns}
            dataSource={formattingGuide}
            pagination={false}
            size="small"
          />
        </div>

        <Card title="Available Template Variables">
          <Typography.Paragraph type="secondary">
            Use the following variables inside your email body. Wrap them with{' '}
            <code>{'{{variableName}}'}</code>.
          </Typography.Paragraph>
          <ul className="space-y-2">
            {variableExamples.map(variable => (
              <li key={variable.name} className="text-sm">
                <Tooltip title={variable.description}>
                  <code className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-white' : 'bg-gray-100 text-blue-700'}`}>
                    {`{{${variable.name}}}`}
                  </code>
                  <span className="ml-2 text-gray-600">{variable.description}</span>
                </Tooltip>
              </li>
            ))}
          </ul>

          <Divider />
          <Typography.Text strong>Example Usage</Typography.Text>
          <pre className={`bg-amber-100 p-3 rounded mt-2 text-sm whitespace-pre-wrap ${darkMode ? 'text-black' : ''}`}>
            {`Dear {{candidateName}},\nWe are pleased to offer you the position of {{position}} with a starting salary of {{salary}}. Please confirm your acceptance by {{responseDeadline}}.`}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default EmailTemplateForm;
