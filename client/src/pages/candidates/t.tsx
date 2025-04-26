import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MinusCircle, PlusCircle, X } from 'lucide-react';
import { UploadOutlined } from "@ant-design/icons";
import Card from '../../component/ui/Card';
import { motion } from 'framer-motion';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Typography,
  Upload,
} from 'antd';
import { candidateFormData } from '../../types';
import {
  useCreateCandidateMutation,
  useGetCandidateByIdQuery,
  useUpdateCandidateMutation,
} from '../../services/candidateServiceApi';
import { makeCapitilized } from '../../utils/TextAlter';
import Predefineddata from '../../data/PredefinedData';
import dayjs from 'dayjs';

const { Title } = Typography;

const CandidateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const [createCandidate, { isLoading: createLoading }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: updateLoading }] = useUpdateCandidateMutation();
  const { data: candidate } = useGetCandidateByIdQuery(id, { skip: !id });
  console.log(candidate);
  console.log('Raw Applied Date:', candidate?.data?.applieddate);
  console.log('Parsed Applied Date:', dayjs(candidate?.data?.applieddate));


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

  console.log(isEditing);
  console.log(candidate);
  console.log(id);
  console.log(form);

  const onFinish = async (formData: candidateFormData) => {
    const filterFormData = {
      ...formData,
      name: formData.name.trim().toLowerCase(),
      email: formData.email.trim().toLowerCase(),
      experience: Number(formData.experience),
      expectedsalary: Number(formData.expectedsalary),
      applieddate: formData.applieddate
    };
    console.log(filterFormData);

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

  const normFile = (e: any) => Array.isArray(e) ? e : e?.fileList;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-6 flex items-center">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          className="mr-3"
          onClick={() => navigate('/dashboard/candidates')}
        />
        <Title level={3}>{isEditing ? 'Edit Candidate' : 'Create Candidate'}</Title>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off" onFinishFailed={(err) => {
          console.log('Validation Failed:', err);
          message.error("Please check required fields and fix validation errors.");
        }}>
          <Row gutter={12}>
            <Col span={24}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true, message: "Please enter candidate name" }]}> <Input size="large" placeholder="John Doe" /> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please enter email" }, { type: "email", message: "Please enter a valid email" }]}> <Input size="large" placeholder="example@example.com" /> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Please enter phone number" }, { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" }]}> <Input size="large" placeholder="9876543210" maxLength={10} /> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="technology" label="Technology" rules={[{ required: true, message: "Please select technology" }]}> <Select size="large" placeholder="Select technology"> {Predefineddata.Technology?.map(tech => <Select.Option key={tech.key} value={tech.value}>{makeCapitilized(tech.label)}</Select.Option>)} </Select> </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="level" label="Level" rules={[{ required: true, message: "Please select level" }]}> <Select size="large" placeholder="Select level"> {Predefineddata.Level?.map(lvl => <Select.Option key={lvl.key} value={lvl.value}>{makeCapitilized(lvl.label)}</Select.Option>)} </Select> </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="experience" label="Experience (years)" rules={[{ required: true, message: "Please enter experience" }]}> <InputNumber min={0} max={50} size="large" placeholder="Years of experience" style={{ width: '100%' }} /> </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expectedsalary" label="Expected Salary" rules={[{ required: true, message: "Please enter expected salary" }]}> <InputNumber min={0} size="large" placeholder="Expected salary" formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} style={{ width: '100%' }} /> </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="applieddate" label="Applied Date" rules={[{ required: true, message: "Please select applied date" }]}> <DatePicker size="large" placeholder="Applied date" style={{ width: '100%' }} /> </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="resume" label="CV Upload" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: "Please upload CV" }]}> <Upload maxCount={1} beforeUpload={() => false} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"> <Button icon={<UploadOutlined />} type="dashed" size="large"> Click to Upload CV </Button> </Upload> </Form.Item>
            </Col>
          </Row>

          <Form.List name="references">
            {(fields, { add, remove }) => (
              <div className="mt-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">References</h3>
                  <Button type="dashed" icon={<PlusCircle className="w-4 h-4" />} onClick={() => add()} className="text-indigo-600 border-indigo-600 hover:bg-indigo-600 hover:text-white"> Add Reference </Button>
                </div>

                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="bg-gray-50 border border-gray-200 p-4 rounded-lg relative">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Form.Item {...restField} name={[name, "name"]} label="Name" rules={[{ required: true, message: "Please enter name" }]}> <Input placeholder="Reference name" /> </Form.Item>
                      <Form.Item {...restField} name={[name, "contact"]} label="Contact" rules={[{ pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" }]}> <Input placeholder="Contact info" /> </Form.Item>
                      <Form.Item {...restField} name={[name, "relation"]} label="Relation"> <Input placeholder="Relation" /> </Form.Item>
                    </div>
                    <Button type="text" danger icon={<MinusCircle className="w-5 h-5" />} onClick={() => remove(name)} className="absolute top-4 right-4"> Remove </Button>
                  </div>
                ))}
              </div>
            )}
          </Form.List>
          <Form.Item>
            <div className="mt-8 flex justify-end space-x-4">
              <Button icon={<X size={16} />} onClick={() => navigate('/dashboard/candidates')}> Cancel </Button>
              <Button type="primary" htmlType="submit" loading={createLoading || updateLoading} disabled={createLoading || updateLoading}> {isEditing ? 'Update Candidate' : 'Create Candidate'} </Button>
            </div>
          </Form.Item>

        </Form>
      </Card>
    </motion.div>
  );
};

export default CandidateForm;