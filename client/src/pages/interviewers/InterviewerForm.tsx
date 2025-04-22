import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import Card from '../../component/ui/Card';
import Input from '../../component/ui/Input';
import Select from '../../component/ui/Select';
import Button from '../../component/ui/Button';
import { interviewers } from '../../data/mockData';
import { nanoid } from 'nanoid';
import { motion } from 'framer-motion';

const InterviewerForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    availability: [
      { id: nanoid(), day: 'Monday', timeSlots: ['9:00 AM', '2:00 PM'] }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, we would save the interviewer here
      setIsSubmitting(false);
      navigate('/interviewers');
    }, 1000);
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
          variant="ghost"
          size="sm"
          className="mr-3"
          icon={<ArrowLeft size={18} />}
          onClick={() => navigate('/interviewers')}
          aria-label="Back"
        />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Interviewer' : 'Add Interviewer'}
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                fullWidth
                required
              />
            </div>
            <div>
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                fullWidth
                required
              />
            </div>
            <div>
              <Input
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                error={errors.department}
                fullWidth
                required
              />
            </div>
            <div>
              <Input
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                error={errors.position}
                fullWidth
                required
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>

            {formData.availability.map((avail, index) => (
              <div key={avail.id} className="mb-6 p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-48">
                    <Select
                      label="Day"
                      options={dayOptions}
                      value={avail.day}
                      onChange={(value) => handleAvailabilityDayChange(avail.id, value)}
                      fullWidth
                    />
                  </div>
                  {formData.availability.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
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
                        fullWidth
                      />
                    </div>
                    {avail.timeSlots.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-red-600"
                        onClick={() => handleRemoveTimeSlot(avail.id, timeIndex)}
                        aria-label="Remove time slot"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleAddTimeSlot(avail.id)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Time Slot
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddAvailabilityDay}
              className="mt-2"
            >
              <Plus size={16} className="mr-1" />
              Add Day
            </Button>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              variant="outline"
              icon={<X size={16} />}
              onClick={() => navigate('/interviewers')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Save size={16} />}
              isLoading={isSubmitting}
            >
              {isEditing ? 'Update Interviewer' : 'Save Interviewer'}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default InterviewerForm;