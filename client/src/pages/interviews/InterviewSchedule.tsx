import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreateInterviewMutation } from '../../services/interviewServiceApi';
import { Button, DatePicker, Form, Input, Select, TimePicker, Typography, message, Card } from 'antd';
import dayjs from 'dayjs';
import { interviewData, interviewStatus } from '../../types';
import { useInterview, useInterviewer } from '../../action/StoreInterview';
import { useCandidate } from '../../action/StoreCandidate';
import { makeCapitilized } from '../../utils/TextAlter';
import SecondaryButton from '../../component/ui/button/Secondary';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const InterviewSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const interviewType = Form.useWatch('type', form);

  const [createInterview, { isLoading: createInterviewLoading }] = useCreateInterviewMutation();
  const { interviewers } = useInterviewer();
  const { data: candidates } = useCandidate();
  const { interview: interviews } = useInterview();

  const handleDraftInterview = async () => {
    const payload = form.getFieldsValue();
    try {
      const response = await createInterview({
        ...payload,
        date: dayjs(payload.date),
        time: payload.time,
        status: 'draft' as interviewStatus
      }).unwrap();

      if (response?.success && response?.data) {
        message.success('Interview saved as draft');
        navigate('/dashboard/interviews');
      }
    } catch (error: any) {
      message.error(`Failed to save draft: ${error.data.message}`);
      console.error('Error saving draft:', error);
    }
  };

  const onFinish = async (values: interviewData) => {
    const payload = {
      ...values,
      date: dayjs(values.date),
      time: values.time,
      status: 'scheduled' as interviewStatus
    };
    try {
      const response = await createInterview(payload).unwrap();
      if (response?.success && response?.data) {
        message.success('Interview scheduled successfully');
        navigate('/dashboard/interviews');
      }
    } catch (error: any) {
      message.error(`Failed to schedule interview: ${error.data.message}`);
      console.error('Error scheduling interview:', error);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-6 flex items-center">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          className="mr-3"
          onClick={() => navigate('/dashboard/interviews')}
          aria-label="Go back to interviews list"
        />
        <Title level={3}>Schedule Interview</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          aria-label="Interview scheduling form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Form.Item
              label="Candidate"
              name="candidate"
              rules={[{ required: true, message: 'Candidate is required' }]}
            >
              <Select
                placeholder="Select Candidate"
                showSearch
                aria-label="Candidate selection"
              >
                {candidates?.data?.filter((c) => c?.status !== 'rejected' && c?.status !== 'hired')
                  ?.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {makeCapitilized(c.name)} - {makeCapitilized(c.technology)} ({makeCapitilized(c.level)})
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="InterviewRound"
              label="Interview Round"
              rules={[
                { required: true, message: 'Interview round is required' },
                {
                  validator: (_, value) => {
                    const candidateId = form.getFieldValue('candidate');
                    const interview = interviews?.data?.find((i) => i?.candidate?._id === candidateId);
                    if (!candidateId || !value) return Promise.resolve();
                    if (interview?.InterviewRound?.includes(value)) {
                      return Promise.reject(new Error('Candidate is already scheduled for this round'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Select
                placeholder="Select Interview Round"
                allowClear
                aria-label="Interview round selection"
              >
                <Option value="first">First Interview</Option>
                <Option value="second">Second Interview</Option>
                <Option value="third">Third Interview</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Interviewer"
              name="interviewer"
              rules={[{ required: true, message: 'Interviewer is required' }]}
            >
              <Select placeholder="Select Interviewer" aria-label="Interviewer selection">
                {interviewers?.data?.map((i) => (
                  <Option key={i._id} value={i._id}>
                    {i.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[
                { required: true, message: 'Date is required' },
                {
                  validator: (_, value) => {
                    if (dayjs(value).isBefore(dayjs().startOf('day'))) {
                      return Promise.reject(new Error('Please select a future date'));
                    }
                    return Promise.resolve();
                  },
                }
              ]}
            >
              <DatePicker className="w-full" aria-label="Select interview date" />
            </Form.Item>

            <Form.Item
              label="Time Slot"
              name="time"
              rules={[
                { required: true, message: 'Time slot is required' },
                {
                  validator: (_, value) => {
                    const selectedDate = form.getFieldValue('date');
                    if (selectedDate && dayjs(selectedDate).hour(value.hour()).minute(value.minute()).isBefore(dayjs())) {
                      return Promise.reject(new Error('Please select a future time'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <TimePicker
                format="h:mm A"
                showNow={false}
                className="w-full"
                aria-label="Select interview time"
              />
            </Form.Item>

            <Form.Item
              label="Interview Type"
              name="type"
              rules={[{ required: true, message: 'Interview type is required' }]}
            >
              <Select
                placeholder="Select Interview Type"
                allowClear
                aria-label="Interview type selection"
              >
                <Option value="in-person">In-Person Interview</Option>
                <Option value="video">Video Interview</Option>
              </Select>
            </Form.Item>

            {interviewType === 'video' && (
              <Form.Item
                label="Meeting Link"
                name="meetingLink"
                rules={[{ required: true, message: 'Video link is required' },
                { type: 'url', message: 'Please enter a valid URL' }]}
              >
                <Input placeholder="Enter video link" aria-label="Video interview link" />
              </Form.Item>
            )}

            <Form.Item label="Notes" name="notes">
              <TextArea
                rows={4}
                placeholder="Add any special instructions or topics to cover"
                aria-label="Interview notes"
              />
            </Form.Item>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              icon={<X size={16} />}
              onClick={() => navigate('/dashboard/interviews')}
              aria-label="Cancel scheduling interview"
            >
              Cancel
            </Button>

            <SecondaryButton
              text="Draft"
              icon={<Save size={16} />}
              onClick={handleDraftInterview}
              aria-label="Save interview as draft"
            />

            <Button
              type="primary"
              htmlType="submit"
              icon={<Save size={16} />}
              loading={createInterviewLoading}
              disabled={createInterviewLoading}
              aria-label="Schedule interview"
            >
              Schedule Interview
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default InterviewSchedule;
