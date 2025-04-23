import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Card from '../../component/ui/Card';
import { UploadOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { Col, Form, Row, Button, Input, Select, Upload, message, InputNumber } from 'antd';
import Predefineddata from '../../data/PredefinedData';
import { useCreateAssessmentMutation } from '../../services/assessmentServiceApi';
import { assessmentFormData } from '../../types';

const AssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [createAssessment, { isLoading }] = useCreateAssessmentMutation();
  const onFinish = async (value: assessmentFormData) => {
    try {
      const res = await createAssessment(value).unwrap();
      if (res.success) {
        message.success(res.message);
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

      </div>

      <Card>
        <Form
          onFinish={onFinish}
          layout='vertical'
          autoComplete='off'
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Form.Item
                  name="title"
                  label="Assessment"
                  rules={[{ required: true, message: "Assessment Name is Required" }]}
                >
                  <Input size='large' placeholder='Assessment' />
                </Form.Item>
              </motion.div>
            </Col>

            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>
            </Col>

            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>
            </Col>

            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
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
              </motion.div>
            </Col>

            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Form.Item
                  name="file"
                  label="Assessment File"
                  rules={[{ required: true, message: "Assessment File is Required" }]}
                >
                  <Upload maxCount={1} beforeUpload={() => false}>
                    <Button icon={<UploadOutlined />}>Upload File</Button>
                  </Upload>
                </Form.Item>
              </motion.div>
            </Col>
            <Col xs={24} md={12}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Form.Item
                  name="duration"
                  label="Duration"
                  initialValue={60}
                  rules={[{ required: true, message: "Level is Required" }]}
                >
                  <InputNumber size='large' placeholder='Duration' className="w-full" />
                </Form.Item>
              </motion.div>
            </Col>
          </Row>
          <Form.Item>
            <Col className=' mt-8 flex justify-end gap-3'>
              <Button type='default' icon={<X />} onClick={() => navigate('/dashboard/assessments')}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading} icon={<Save size={16} />}>
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