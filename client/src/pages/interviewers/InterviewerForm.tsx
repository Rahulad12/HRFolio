import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import { interviewerData } from '../../types';
import { useCreateInterviewerMutation, useGetInterviewerByIdQuery, useUpdateInterviewerMutation } from '../../services/interviewServiceApi';
const { Title } = Typography;
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
  }, [id, isEditing, form, interviewerData]);

  const [createInterviewer, { isLoading: interviewerLoading }] = useCreateInterviewerMutation();
  const [updateInterviewer, { isLoading: interviewerUpdating }] = useUpdateInterviewerMutation();

  const handleSubmit = async (values: interviewerData) => {
    try {

      if (isEditing) {
        const res = await updateInterviewer({ id: id || '', data: values }).unwrap();
        if (res?.success && res?.data) {
          message.success(res?.message);
        }
      }
      else {
        const res = await createInterviewer(values).unwrap();
        if (res?.success && res?.data) {
          message.success(res?.message);
          form.resetFields();
        }
      }

    } catch (error: any) {
      console.error('Submission failed', error);
      message.error(error.data.message);
    }

  };

  return (
    <div>

      <div className="mb-6 flex items-center">
        <Button
          type='text'
          size="small"
          className="mr-3"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/interviewers')}
          aria-label="Back"
        />
        <Title level={2}>
          {isEditing ? 'Edit Interviewer' : 'Add Interviewer'}
        </Title>
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
              loading={interviewerLoading || interviewerUpdating}
              disabled={interviewerLoading || interviewerUpdating}
            >
              {isEditing ? 'Update Interviewer' : 'Save Interviewer'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>

  );
};

export default InterviewerForm;