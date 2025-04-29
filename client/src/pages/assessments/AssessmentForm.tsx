import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Col, Form, Row, Button, Card, Input, Select, message, InputNumber, Typography } from 'antd';
import Predefineddata from '../../data/PredefinedData';
import { useCreateAssessmentMutation, useGetAssessmentByIdQuery, useUpdateAssessmentMutation } from '../../services/assessmentServiceApi';
import { assessmentFormData } from '../../types';
const { Title } = Typography;

const AssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const isEditing = !!id;

  const [createAssessment, { isLoading }] = useCreateAssessmentMutation();
  const { data: assessmentData } = useGetAssessmentByIdQuery(id || "", {
    skip: !id
  });

  console.log(assessmentData, "assessmentData");

  const [updateAssessment, { isLoading: updatingAssessment }] = useUpdateAssessmentMutation();

  useEffect(() => {
    if (isEditing) {
      if (assessmentData) {
        form.setFieldsValue({
          title: assessmentData?.data?.title,
          type: assessmentData?.data?.type,
          technology: assessmentData?.data?.technology,
          level: assessmentData?.data?.level,
          duration: assessmentData?.data?.duration,
          assessmentLink: assessmentData?.data?.assessmentLink
        });
      }
    }
  }, [isEditing, form, assessmentData, id]);

  const onFinish = async (value: assessmentFormData) => {
    try {
      if (isEditing) {
        const res = await updateAssessment({ id: id || '', data: value }).unwrap();
        if (res.success) {
          message.success(res.message);
          navigate('/dashboard/assessments');
        }
      }
      else {
        const res = await createAssessment(value).unwrap();
        if (res.success) {
          message.success(res.message);
          navigate('/dashboard/assessments');
        }
      }
    } catch (error: any) {
      console.error(error);
      message.error(error.message);
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
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/assessments')}
          aria-label="Back"
        />
        <Title level={3}>
          {isEditing ? 'Edit Assessment' : 'Create Assessment'}
        </Title>

      </div>

      <Card>
        <Form
          onFinish={onFinish}
          layout='vertical'
          autoComplete='off'
          form={form}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>

              <Form.Item
                name="title"
                label="Assessment"
                rules={[{ required: true, message: "Assessment Name is Required" }]}
              >
                <Input size='large' placeholder='Assessment' />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>

              <Form.Item
                name="type"
                label="Type"
                rules={[{ required: true, message: "Type is Required" }]}
              >
                <Select size='large' placeholder='Select Type' allowClear>
                  {
                    Predefineddata.Type?.map((type) => (
                      <Select.Option value={type.value} key={type.key}>{type.label} </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>

              <Form.Item
                name="technology"
                label="Technology"
                rules={[{ required: true, message: "Technology is Required" }]}
              >
                <Select size='large' placeholder='Select Technology' allowClear>
                  {
                    Predefineddata.Technology?.map((tech) => (
                      <Select.Option value={tech.value} key={tech.key}>{tech.label}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>

              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: "Level is Required" }]}
              >
                <Select size='large' placeholder='Select Level' allowClear>
                  {
                    Predefineddata.Level?.map((level) => (
                      <Select.Option value={level.value} key={level.key}>{level.label}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>

              <Form.Item
                name="assessmentLink"
                label="Assessment Link"
                rules={[
                  { required: true, message: 'Please enter Google Form URL' },
                  { type: 'url', message: 'Please enter a valid URL' }
                ]}
              >
                <Input placeholder="https://docs.google.com/forms/..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>

              <Form.Item
                name="duration"
                label="Duration"
                initialValue={60}
                rules={[{ required: true, message: "Level is Required" }]}
              >
                <InputNumber size='large' placeholder='Duration' className="w-full" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Col className=' mt-8 flex justify-end gap-3'>
              <Button type='default' icon={<X />} onClick={() => navigate('/dashboard/assessments')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading || updatingAssessment} disabled={isLoading || updatingAssessment} icon={<Save size={16} />}>
                Save Assessment
              </Button>
            </Col>
          </Form.Item>
        </Form>
      </Card>
    </motion.div>
  );
};

export default AssessmentForm;