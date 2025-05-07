import React,{ useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Send } from 'lucide-react';
import { format } from 'date-fns';
import {
  Form,
  Button,
  Select,
  Input,
  Card,
  DatePicker,
  message,
  Row,
  Col,
  Typography
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
import { offerLetter, offerLetterPostData } from '../../types';

const { Title } = Typography;

const OfferForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [preview, setPreview] = useState('');
  const [isSendingOffer, setIsSendingOffer] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const [createOfferLetter] = useCreateOfferLetterMutation();
  const [updateOfferLetter] = useUpdateOfferLetterMutation();
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

  const buildPayload = (values: offerLetterPostData, status: offerLetter['status']) => ({
    ...values,
    startDate: dayjs(values.startDate).format('YYYY-MM-DD'),
    responseDeadline: dayjs(values.responseDeadline).format('YYYY-MM-DD'),
    status
  });

  const handleSaveAsDraft = async () => {
    setIsSavingDraft(true);
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
    finally {
      setIsSavingDraft(false);
    }
  };

  const handleOfferSend = async (values: offerLetterPostData) => {
    setIsSendingOffer(true);
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
      setIsSendingOffer(false);
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

  const candidateOptions = candidatesData?.data?.filter((c) => c.progress.assessment.completed && c.status !== 'rejected' && c.status !== 'hired').map((c) => (
    {
      value: c._id,
      label: `${makeCapitilized(c.name)} - ${makeCapitilized(c.technology)} (${makeCapitilized(c.level)})`,
      key: c._id.toString()
    }
  ))

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button
          type="text"
          size="small"
          className="mr-3"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/offers')}
          aria-label="Back"
        />
        <Title level={3}>
          {isEditing ? 'Edit Offer Letter' : 'Create Offer Letter'}
        </Title>
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
                    options={candidateOptions}
                    placeholder="Select a candidate"
                    showSearch
                    allowClear
                    filterOption={(inputValue, option) => (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase())}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Email Template" name="email" rules={[{ required: true, message: 'Email template is required' }]}>
                  <Select
                    options={emailTemplatesData?.data?.filter(t => t.type === 'offer').map(t => ({ value: t._id, label: t.name }))}
                    placeholder="Select email template"
                    showSearch
                    allowClear
                    filterOption={(inputValue, option) => (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase())}
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
                <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Start date is required' }, {
                  validator: (_, value) => {
                    if (value && dayjs(value).isBefore(dayjs().startOf('day'))) {
                      return Promise.reject(new Error('Start date must be in the future'));
                    }
                    return Promise.resolve();
                  }
                }]}>
                  <DatePicker className="w-full" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Response Deadline" name="responseDeadline" rules={[{ required: true, message: 'Response deadline is required' }, {
                  validator: (_, value) => {
                    const startDate = form.getFieldValue('startDate');
                    if (value && startDate && dayjs(value).isAfter(dayjs(startDate).startOf('day'))) {
                      return Promise.reject(new Error('Response deadline must be before start date'));
                    }
                    return Promise.resolve();
                  }
                }]}>
                  <DatePicker className="w-full" />
                </Form.Item>
              </Col>
            </Row>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <Button
                type="default"
                icon={<X size={16} />}
                onClick={() => navigate('/dashboard/offers')}
                disabled={isSendingOffer || isSavingDraft}
              >
                Cancel
              </Button>
              <SecondaryButton
                htmlType="button"
                text="Save as Draft"
                icon={<Save size={16} />}
                loading={isSavingDraft}
                onClick={handleSaveAsDraft}
                disabled={isSavingDraft}
              />
              <Button
                htmlType="submit"
                type="primary"
                icon={<Send size={16} />}
                loading={isSendingOffer}
                disabled={isSendingOffer}
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
    </div>
  );
};

export default OfferForm;
