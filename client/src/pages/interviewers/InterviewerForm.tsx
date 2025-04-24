import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Form, Input, message } from 'antd';
import { interviewerData } from '../../types';
import { useCreateInterviewerMutation, useGetInterviewerByIdQuery } from '../../services/interviewServiceApi';

const InterviewerForm: React.FC = () => {
  const [form] = Form.useForm();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEditing = !!id;

  const { data: interviewerData } = useGetInterviewerByIdQuery(id || "");
  useEffect(() => {
    if (isEditing) {
      if (interviewerData) {
        form.setFieldsValue({
          name: interviewerData?.data?.name,
          email: interviewerData?.data?.email,
          position: interviewerData?.data?.position,
          department: interviewerData?.data?.department
        });

      }
    }
  }, [id, isEditing, form]);

  const [createInterviewer, { isLoading: interviewerLoading }] = useCreateInterviewerMutation();
  const handleSubmit = async (values: interviewerData) => {
    try {
      const res = await createInterviewer(values).unwrap();

      if (res?.success && res?.data) {
        message.success(res?.message);
        form.resetFields();
      }
    } catch (error: any) {
      console.error('Submission failed', error);
      message.error(error.data.message);
    }

  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center">
        <Button
          type='text'
          size="small"
          className="mr-3"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/interviewers')}
          aria-label="Back"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Interviewer' : 'Add Interviewer'}
        </h1>
      </div>

      <Card>
        <Form onFinish={handleSubmit} layout='vertical' form={form}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please input interviewer name!' }]}
            >
              <Input
                placeholder='Name'
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Please input interviewer email!' }]}
            >
              <Input
                placeholder='Email'
              />
            </Form.Item>

            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please input interviewer department!' }]}
            >
              <Input
                placeholder='Department'
              />
            </Form.Item>

            <Form.Item
              name="position"
              label="Position"
              rules={[{ required: true, message: 'Please input interviewer position!' }]}
            >
              <Input
                placeholder='Position'
              />
            </Form.Item>
          </div>



          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="default"
              icon={<X size={16} />}
              onClick={() => navigate('/dashboard/interviewers')}
            >
              Cancel
            </Button>

            <Button
              type='primary'
              htmlType="submit"
              icon={<Save size={16} />}
              loading={interviewerLoading}
              disabled={interviewerLoading}
            >
              {isEditing ? 'Update Interviewer' : 'Save Interviewer'}
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default InterviewerForm;