import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Card from '../../component/ui/Card';
import { candidates, interviewers } from '../../data/mockData';
import { motion } from 'framer-motion';
import { useCreateInterviewMutation } from '../../services/interviewServiceApi';
import { Button, DatePicker, Form, Input, Select, Typography, message } from 'antd';
import { format } from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import { interviewData } from '../../types';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const InterviewSchedule: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [createInterview] = useCreateInterviewMutation();
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  const [interviewerId, setInterviewerId] = useState<string>('');

  const handleInterviewerChange = (value: string) => {
    setInterviewerId(value);
    form.setFieldsValue({ time: undefined }); // reset time when interviewer changes
  };

  const handleDateChange = (date: any) => {
    setSelectedDate(dayjs(date));
    form.setFieldsValue({ date: date });
  };

  // update available time slots
  useEffect(() => {
    if (interviewerId && selectedDate) {
      const interviewer = interviewers.find((i) => i.id === interviewerId);
      if (interviewer) {
        const dayOfWeek = format(selectedDate.toDate(), 'EEEE').toLowerCase();
        const availability = interviewer.availability.find((a) => a.day === dayOfWeek);
        setAvailableTimes(availability?.timeSlots || []);
      }
    } else {
      setAvailableTimes([]);
    }
  }, [interviewerId, selectedDate]);

  const onFinish = (values: interviewData) => {
    const payload = {
      ...values,
      date: format(values.date.toDate(), 'yyyy-MM-dd'),

    };
    console.log('Interview Payload:', payload);

    // Simulate API call
    message.loading('Scheduling...', 1);
    setTimeout(() => {
      // Normally you'd call createInterview(payload)
      message.success('Interview scheduled successfully');
      navigate('/dashboard/interviews');
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-6 flex items-center">
        <Button
          type="text"
          icon={<ArrowLeft size={18} />}
          className="mr-3"
          onClick={() => navigate('/dashboard/interviews')}
        />
        <Title level={3}>Schedule Interview</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            type: 'video',
            date: selectedDate,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Candidate"
              name="candidate"
              rules={[{ required: true, message: 'Candidate is required' }]}
            >
              <Select placeholder="Select Candidate">
                {candidates.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name} ({c.position})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Interviewer"
              name="interviewer"
              rules={[{ required: true, message: 'Interviewer is required' }]}
            >
              <Select placeholder="Select Interviewer" onChange={handleInterviewerChange}>
                {interviewers.map((i) => (
                  <Option key={i.id} value={i.id}>
                    {i.name} ({i.position})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Date is required' }]}
            >
              <DatePicker
                className="w-full"
                onChange={handleDateChange}
              />
            </Form.Item>

            <Form.Item
              label="Time Slot"
              name="time"
            >
              <Select
                placeholder="Select Time Slot"
                disabled={!interviewerId || availableTimes.length === 0}
              >
                {availableTimes.map((time) => (
                  <Option key={time} value={time}>
                    {time}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Interview Type"
              name="type"
              rules={[{ required: true, message: 'Interview type is required' }]}
            >
              <Select>
                <Option value="video">Video Interview</Option>
                <Option value="phone">Phone Interview</Option>
                <Option value="onsite">Onsite Interview</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Notes" name="notes">
              <TextArea rows={4} placeholder="Add any special instructions or topics to cover" />
            </Form.Item>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button icon={<X size={16} />} onClick={() => navigate('/dashboard/interviews')}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" icon={<Save size={16} />}>
              Schedule Interview
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default InterviewSchedule;
