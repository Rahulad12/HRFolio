import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import Card from '../../component/ui/Card';
import { motion } from 'framer-motion';
import { useCreateInterviewMutation } from '../../services/interviewServiceApi';
import { Button, DatePicker, Form, Input, Select, TimePicker, Typography, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { interviewData } from '../../types';
import { useInterviewer } from '../../action/StoreInterview';
import { useCandidate } from '../../action/StoreCandidate';
import { makeCapitilized } from '../../utils/TextAlter';
const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const InterviewSchedule: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [createInterview, { isLoading: createInterviewLoading }] = useCreateInterviewMutation();
  const { interviewers } = useInterviewer();
  const { data: candidates } = useCandidate();
  // const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

  // const [interviewerId, setInterviewerId] = useState<string>('');

  // const handleInterviewerChange = (value: string) => {
  //   setInterviewerId(value);
  //   form.setFieldsValue({ time: undefined }); // reset time when interviewer changes
  // };

  const handleDateChange = (date: any) => {
    setSelectedDate(dayjs(date));
    form.setFieldsValue({ date: date });
  };

  // useEffect(() => {
  //   if (interviewerId && selectedDate) {
  //     const interviewer = interviewers?.data?.find((i) => i._id === interviewerId);
  //     if (interviewer) {
  //       const dayOfWeek = format(selectedDate.toDate(), 'EEEE').toLowerCase();
  //       const availability = interviewer?.availability.find((a) => a.day === dayOfWeek);
  //       setAvailableTimes(availability?.timeSlots || []);
  //     }
  //   } else {
  //     setAvailableTimes([]);
  //   }
  // }, [interviewerId, selectedDate, interviewers]);

  const onFinish = async (values: interviewData) => {
    const payload = {
      ...values,
      date: dayjs(values.date).format('YYYY-MM-DD'),
      time: dayjs(values.time).format('h:mm A'),

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
                {candidates?.data?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {makeCapitilized(c.name)} - {makeCapitilized(c.technology)} ({makeCapitilized(c.level)})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Interviewer"
              name="interviewer"
              rules={[{ required: true, message: 'Interviewer is required' }]}
            >
              <Select placeholder="Select Interviewer">
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
              rules={[{ required: true, message: 'Time slot is required' }]}
            >
              <TimePicker format={'h:mm A'} />
            </Form.Item>


            <Form.Item
              label="Interview Type"
              name="type"
              rules={[{ required: true, message: 'Interview type is required' }]}
            >
              <Select>
                <Option value="in-person">In-Person Interview</Option>
                <Option value="phone">Phone Interview</Option>
                <Option value="video">Video Interview</Option>
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
            <Button type="primary" htmlType="submit" icon={<Save size={16} />} loading={createInterviewLoading} disabled={createInterviewLoading}>
              Schedule Interview
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default InterviewSchedule;
