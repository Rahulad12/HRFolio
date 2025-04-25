import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Send } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Form,
  Button,
  Select,
  Input,
  Card,
  DatePicker,
  message,
  Row,
  Col
} from 'antd';
import dayjs from 'dayjs';

import SecondaryButton from '../../component/ui/button/Secondary';
import { useGetAllEmailTemplateQuery } from '../../services/emailService';
import {
  useCreateOfferLetterMutation,
  useGetOfferByIdQuery,
  useUpdateOfferLetterMutation
} from '../../services/offerService';
import { useCandidate } from '../../action/StoreCandidate';
import { makeCapitilized } from '../../utils/TextAlter';
import { offerLetter } from '../../types';

const OfferForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createOfferLetter, { isLoading: offerSending }] = useCreateOfferLetterMutation();
  const [updateOfferLetter, { isLoading: offerUpdating }] = useUpdateOfferLetterMutation();
  const { data: offerLetterData } = useGetOfferByIdQuery(id || '', { skip: !id });
  const { data: emailTemplatesData } = useGetAllEmailTemplateQuery();
  const { data: candidatesData } = useCandidate();

  useEffect(() => {
    if (isEditing && offerLetterData?.data) {
      form.setFieldsValue({
        candidate: offerLetterData.data.candidate,
        email: offerLetterData.data.email,
        position: offerLetterData.data.position,
        salary: offerLetterData.data.salary,
        startDate: dayjs(offerLetterData.data.startDate),
        responseDeadline: dayjs(offerLetterData.data.responseDeadline),
      });
    }
  }, [isEditing, offerLetterData, form]);

  const buildPayload = (values: offerLetter, status: offerLetter['status']) => ({
    ...values,
    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
    responseDeadline: dayjs(values.responseDeadline).format('YYYY-MM-DD'),
    status
  });

  const handleSaveAsDraft = async () => {
    try {
      const values = await form.validateFields();
      const payload = buildPayload(values, 'draft');

      const res = isEditing
        ? await updateOfferLetter({ id: id || '', data: payload }).unwrap()
        : await createOfferLetter(payload).unwrap();

      if (res?.success) {
        message.success('Offer saved as draft');
        navigate('/dashboard/offers');
        form.resetFields();
      }
    } catch (err) {
      message.error('Failed to save draft');
    }
  };

  const handleOfferSend = async (values: offerLetter) => {
    setIsSubmitting(true);
    const payload = buildPayload(values, 'sent');

    try {
      const res = isEditing
        ? await updateOfferLetter({ id: id || '', data: payload }).unwrap()
        : await createOfferLetter(payload).unwrap();

      if (res?.success) {
        message.success(res.message);
        navigate('/dashboard/offers');
        form.resetFields();
      }
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to send offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviewUpdate = () => {
    const values = form.getFieldsValue();
    const template = emailTemplatesData?.data?.find(t => t._id === values.email);
    const candidate = candidatesData?.data?.find(c => c._id === values.candidate);

    if (template && candidate) {
      const preview = template.body
        .replace(/{{candidateName}}/g, candidate.name)
        .replace(/{{position}}/g, values.position || candidate.level)
        .replace(/{{salary}}/g, values.salary)
        .replace(/{{startDate}}/g, values.startDate ? format(dayjs(values.startDate).toDate(), 'MMMM d, yyyy') : '')
        .replace(/{{responseDeadline}}/g, values.responseDeadline ? format(dayjs(values.responseDeadline).toDate(), 'MMMM d, yyyy') : '');

      setPreview(preview);
    } else {
      setPreview('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
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
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleOfferSend}
            onValuesChange={handlePreviewUpdate}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item label="Candidate" name="candidate" rules={[{ required: true, message: 'Candidate is required' }]}>
                  <Select
                    options={candidatesData?.data?.map(c => ({ value: c._id, label: makeCapitilized(c.name) }))}
                    placeholder="Select a candidate"
                    showSearch
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Email Template" name="email" rules={[{ required: true, message: 'Email template is required' }]}>
                  <Select
                    options={emailTemplatesData?.data?.map(t => ({ value: t._id, label: t.name }))}
                    placeholder="Select email template"
                    showSearch
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Position" name="position" rules={[{ required: true, message: 'Position is required' }]}>
                  <Input placeholder="e.g. Software Engineer" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Salary" name="salary" rules={[{ required: true, message: 'Salary is required' }]}>
                  <Input placeholder="e.g. $80,000" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Start date is required' }]}>
                  <DatePicker className="w-full" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Response Deadline" name="responseDeadline" rules={[{ required: true, message: 'Response deadline is required' }]}>
                  <DatePicker className="w-full" />
                </Form.Item>
              </Col>
            </Row>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <Button
                type="default"
                icon={<X size={16} />}
                onClick={() => navigate('/dashboard/offers')}
                disabled={offerSending}
              >
                Cancel
              </Button>
              <SecondaryButton
                htmlType="button"
                text="Save as Draft"
                icon={<Save size={16} />}
                loading={offerSending}
                onClick={handleSaveAsDraft}
                disabled={offerSending}
              />
              <Button
                htmlType="submit"
                type="primary"
                icon={<Send size={16} />}
                loading={isSubmitting || offerSending || offerUpdating}
              >
                Send Offer
              </Button>
            </div>
          </Form>
        </Card>

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
    </motion.div>
  );
};

export default OfferForm;
