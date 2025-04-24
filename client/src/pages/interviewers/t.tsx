import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { interviewers } from '../../data/mockData';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';
import { Button, Card, Form, Input, message, Select } from 'antd';
import { interviewerData } from '../../types';
import { useCreateInterviewerMutation, useGetInterviewerByIdQuery } from '../../services/interviewServiceApi';

const InterviewerForm: React.FC = () => {
  const { interviewerform } = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;
  // const { data: interviewerData } = useGetInterviewerByIdQuery(id);



  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    availability: [
      { id: nanoid(), day: 'Monday', timeSlots: ['9:00 AM', '2:00 PM'] }
    ]
  });


  useEffect(() => {
    if (isEditing) {
      const interviewer = interviewers.find(i => i.id === id);
      if (interviewer) {
        setFormData({
          name: interviewer.name,
          email: interviewer.email,
          department: interviewer.department,
          position: interviewer.position,
          availability: interviewer.availability.map(avail => ({
            id: nanoid(),
            day: avail.day,
            timeSlots: [...avail.timeSlots]
          }))
        });
      }
    }
  }, [id, isEditing]);
  const [createInterviewer, { isLoading: interviewerLoading }] = useCreateInterviewerMutation();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvailabilityDayChange = (availId: string, day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.map(avail =>
        avail.id === availId ? { ...avail, day } : avail
      )
    }));
  };

  const handleAddTimeSlot = (availId: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.map(avail => {
        if (avail.id === availId) {
          return {
            ...avail,
            timeSlots: [...avail.timeSlots, '']
          };
        }
        return avail;
      })
    }));
  };

  const handleTimeSlotChange = (availId: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.map(avail => {
        if (avail.id === availId) {
          const newTimeSlots = [...avail.timeSlots];
          newTimeSlots[index] = value;
          return {
            ...avail,
            timeSlots: newTimeSlots
          };
        }
        return avail;
      })
    }));
  };

  const handleRemoveTimeSlot = (availId: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.map(avail => {
        if (avail.id === availId) {
          const newTimeSlots = [...avail.timeSlots];
          newTimeSlots.splice(index, 1);
          return {
            ...avail,
            timeSlots: newTimeSlots
          };
        }
        return avail;
      })
    }));
  };

  const handleAddAvailabilityDay = () => {
    setFormData(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        { id: nanoid(), day: 'Monday', timeSlots: ['9:00 AM'] }
      ]
    }));
  };

  const handleRemoveAvailabilityDay = (availId: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter(avail => avail.id !== availId)
    }));
  };



  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        availability: formData.availability
      };
      const res = await createInterviewer(payload).unwrap();
      if (res?.success && res?.data) {
        message.success(res?.message)
      }
    } catch (error: any) {
      console.error('Submission failed', error);
      message.error(error.message)
    }
  };


  const dayOptions = [
    { value: 'Monday', label: 'Monday' },
    { value: 'Tuesday', label: 'Tuesday' },
    { value: 'Wednesday', label: 'Wednesday' },
    { value: 'Thursday', label: 'Thursday' },
    { value: 'Friday', label: 'Friday' }
  ];

  const timeOptions = [
    { value: '9:00 AM', label: '9:00 AM' },
    { value: '10:00 AM', label: '10:00 AM' },
    { value: '11:00 AM', label: '11:00 AM' },
    { value: '12:00 PM', label: '12:00 PM' },
    { value: '1:00 PM', label: '1:00 PM' },
    { value: '2:00 PM', label: '2:00 PM' },
    { value: '3:00 PM', label: '3:00 PM' },
    { value: '4:00 PM', label: '4:00 PM' },
    { value: '5:00 PM', label: '5:00 PM' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6 flex items-center">
        <Button
          type='text'
          size="small"
          className="mr-3"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/dashboard/interviewers')}
          aria-label="Back"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Interviewer' : 'Add Interviewer'}
        </h1>
      </div>

      <Card>
        <Form onFinish={handleSubmit} layout='vertical' form={interviewerform}>
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
            >
              <Input
                placeholder='Position'
              />
            </Form.Item>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>

            {formData.availability.map((avail, index) => (
              <div key={avail.id} className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-48">
                    <Form.Item
                      name={`availability[${index}].day`}
                      label="Day"
                      rules={[{ required: true, message: 'Please select day!' }]}
                    >
                      <Select
                        options={dayOptions}
                        value={avail.day}
                        onChange={(value) => handleAvailabilityDayChange(avail.id, value)}
                      />
                    </Form.Item>
                  </div>
                  {formData.availability.length > 1 && (
                    <Button
                      type='text'
                      danger
                      onClick={() => handleRemoveAvailabilityDay(avail.id)}
                    >
                      <Trash2 size={16} />
                      <span className="ml-1">Remove Day</span>
                    </Button>
                  )}
                </div>

                <h4 className="text-sm font-medium text-gray-700 mb-2">Time Slots</h4>
                {avail.timeSlots.map((timeSlot, timeIndex) => (
                  <div key={timeIndex} className="flex items-center mb-2">
                    <div className="w-48 mr-2">
                      <Select
                        options={timeOptions}
                        value={timeSlot}
                        onChange={(value) => handleTimeSlotChange(avail.id, timeIndex, value)}
                      />
                    </div>
                    {avail.timeSlots.length > 1 && (
                      <Button
                        type="text"
                        danger
                        onClick={() => handleRemoveTimeSlot(avail.id, timeIndex)}
                        aria-label="Remove time slot"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  htmlType="submit"
                  className="mt-2"
                  onClick={() => handleAddTimeSlot(avail.id)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Time Slot
                </Button>
              </div>
            ))}

            <Button
              onClick={handleAddAvailabilityDay}
              className="mt-2"
            >
              <Plus size={16} className="mr-1" />
              Add Day
            </Button>
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
            >
              {isEditing ? 'Update Interviewer' : 'Save Interviewer'}
            </Button>
          </div>
        </Form>
      </Card>
    </motion.div>
  );
};

export default InterviewerForm;