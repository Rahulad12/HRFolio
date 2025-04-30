import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MinusCircle, PlusCircle, X } from 'lucide-react';
import { UploadOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Row, Select, Typography, Upload, Card } from 'antd';
import { candidateFormData } from '../../types';
import {
  useCreateCandidateMutation, useGetCandidateByIdQuery,
  useUpdateCandidateMutation,
} from '../../services/candidateServiceApi';
import { makeCapitilized } from '../../utils/TextAlter';
import Predefineddata from '../../data/PredefinedData';
import dayjs from 'dayjs';
import { useUploadResumeMutation } from '../../services/uploadFileService';
const { Title } = Typography;

const CandidateForm: React.FC = () => {
  const location = useLocation();
  console.log(location.state);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [createCandidate, { isLoading: createLoading }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: updateLoading }] = useUpdateCandidateMutation();
  const { data: candidate } = useGetCandidateByIdQuery(id, { skip: !id });
  const [uploadResume] = useUploadResumeMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [resumeUrl, setResumeUrl] = useState('');

  console.log(resumeUrl);
  useEffect(() => {
    if (id && candidate?.data) {
      setIsEditing(true);
      form.setFieldsValue({
        name: candidate.data.name,
        email: candidate.data.email,
        phone: candidate.data.phone,
        level: candidate.data.level,
        technology: candidate.data.technology,
        experience: candidate.data.experience,
        expectedsalary: candidate.data.expectedsalary,
        applieddate: dayjs(candidate.data.applieddate),
      });
    }
  }, [id, candidate, form]);

  const handleResumeUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;

    const formData = new FormData();
    formData.append('resume', file);


    try {
      const response = await uploadResume(formData).unwrap();
      console.log(response);
      if (response?.success) {
        setResumeUrl(response.url);
        onSuccess(response, file);
        message.success(response.message);
      } else {
        onError("Failed to upload resume");
        message.error(response.message);
      }
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      onError(error);
      message.error('Failed to upload resume');
    }
  }

  const onFinish = async (formData: candidateFormData) => {
    if (!resumeUrl) {
      message.error("Please upload a resume before submitting.");
      return;
    }

    const filterFormData = {
      ...formData,
      name: formData.name.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      experience: Number(formData.experience),
      expectedsalary: Number(formData.expectedsalary),
      applieddate: dayjs(formData.applieddate).format('YYYY-MM-DD'),
      resume: resumeUrl
    };
    try {
      if (isEditing) {
        const res = await updateCandidate({ id: id || '', data: filterFormData }).unwrap();
        if (res.success) {
          message.success(res.message);
          navigate('/dashboard/candidates');
          return;
        }
      } else {
        const res = await createCandidate(filterFormData).unwrap();
        if (res.success) {
          message.success(res.message);
          form.resetFields();
        }
      }
    } catch (err: any) {
      const resErr: string = err?.data?.message || 'Something went wrong';
      message.error(resErr);
    }
  };
  return (
    <div>
      <div className=" flex items-center">
        <div className="flex items-center">
          <Button
            type="text"
            icon={<ArrowLeft size={18} />}
            className="mr-3"
            onClick={() => navigate('/dashboard/candidates')}
          />
          <Title level={3}>{
            isEditing ? 'Edit Candidate' : 'Add New Candidate'}</Title>
        </div>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Please enter candidate name" }]}
                className="w-full"
              >
                <Input size="large" placeholder="John Doe" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
                className="w-full"
              >
                <Input size="large" placeholder="example@example.com" />
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item
                name="phone"
                label="Phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit phone number",
                  },
                ]}
              >
                <Input size="large" placeholder="9876543210" maxLength={10} className="w-full" />
              </Form.Item>
            </Col>

            <Col span={12}>

              <Form.Item
                name="technology"
                label="Technology"
                rules={[{ required: true, message: "Please select technology" }]}
              >
                <Select size="large" placeholder="Select technology" className="w-full">
                  {Predefineddata.Technology?.map((tech) => (
                    <Select.Option key={tech.key} value={tech.value}>
                      {makeCapitilized(tech.label)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="level"
                label="Level"
                rules={[{ required: true, message: "Please select level" }]}
              >
                <Select size="large" placeholder="Select level" className="w-full">
                  {Predefineddata.Level?.map((lvl) => (
                    <Select.Option key={lvl.key} value={lvl.value}>
                      {makeCapitilized(lvl.label)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="experience"
                label="Experience (years)"
                rules={[{ required: true, message: "Please enter experience" }]}
              >
                <InputNumber
                  min={0}
                  max={50}
                  size="large"
                  placeholder="Years of experience"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="expectedsalary"
                label="Expected Salary"
                rules={[{ required: true, message: "Please enter expected salary" }]}
              >
                <InputNumber
                  min={0}
                  size="large"
                  className="w-full"
                  placeholder="Expected salary"
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="applieddate"
                label="Applied Date"
                rules={[{ required: true, message: "Please select applied date" }]}
              >
                <DatePicker
                  size="large"
                  type="date"
                  placeholder="Applied date"
                  className="w-full"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="CV Upload"
              >
                <Upload
                  maxCount={1}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  customRequest={handleResumeUpload}
                  showUploadList={true}
                >
                  <Button
                    icon={<UploadOutlined />}
                    type='dashed'
                    size="large"
                  >
                    Click to Upload CV
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Form.List name="references">
            {(fields, { add, remove }) => (
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">References</h3>
                  <Button
                    type="dashed"
                    icon={<PlusCircle className="w-4 h-4" />}
                    onClick={() => add()}
                    className="text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white"
                  >
                    Add Reference
                  </Button>
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-lg relative"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        label="Name"
                        rules={[{ required: true, message: "Please enter name" }]}
                      >
                        <Input placeholder="Reference name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "contact"]}
                        label="Contact"
                        rules={[
                          {
                            pattern: /^[0-9]{10}$/,
                            message: "Enter a valid 10-digit phone number",
                          },
                        ]}
                      >
                        <Input placeholder="Contact info" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "relation"]}
                        label="Relation"
                      >
                        <Input placeholder="Relation" />
                      </Form.Item>
                    </div>

                    <Button
                      type="text"
                      danger
                      icon={<MinusCircle className="w-5 h-5" />}
                      onClick={() => remove(name)}
                      className="absolute top-4 right-4"
                    >
                      Remove
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </Form.List>

          <div className="mt-8 flex justify-end space-x-4">
            <Button icon={<X size={16} />} onClick={() => navigate('/dashboard/candidates')}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading || updateLoading}
              disabled={createLoading || updateLoading}
            >
              {isEditing ? 'Edit Candidate' : 'Submit Candidate'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CandidateForm;