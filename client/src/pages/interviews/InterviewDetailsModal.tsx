import React from 'react';
import { Modal, Descriptions, Tag, Timeline, Button, Form, Input, Rate, Divider, Typography, Popconfirm } from 'antd';
import { Calendar, Clock, Users, Video, Phone, MapPin, FileText, } from 'lucide-react';
import dayjs from 'dayjs';
import { interviewData } from '../../types';
import { useNavigate } from 'react-router-dom';
import { makeCapitilized } from '../../utils/TextAlter';

const { TextArea } = Input;
const { Title } = Typography;

interface InterviewDetailsModalProps {
  interview: interviewData | null;
  visible: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: interviewData['status']) => void;
  onFeedbackSubmit: (id: string, feedback: string, rating: number) => void;
}

const InterviewDetailsModal: React.FC<InterviewDetailsModalProps> = ({
  interview,
  visible,
  onClose,
  onStatusUpdate,
  onFeedbackSubmit,
}) => {

  const navigate = useNavigate();
  const [feedbackForm] = Form.useForm();
  // const [interviewData, setInterviewData] = React.useState<interviewData | null>(null);
  // const { data: interviewById } = useGetInterviewByIdQuery(interview?._id || '');
 
  // useEffect(() => {
  //   if (interviewById?.success && interviewById?.data) {
  //     setInterviewData(interviewById.data);
  //   }
  // }, [interviewById]);

  const getInterviewTypeIcon = (type: string | undefined) => {
    switch (type) {
      case 'phone':
        return <Phone size={16} />;
      case 'video':
        return <Video size={16} />;
      case 'onsite':
        return <MapPin size={16} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const handleFeedbackSubmit = () => {
    feedbackForm.validateFields().then(values => {
      onFeedbackSubmit(interview?._id || '', values.feedback, values.rating);
      feedbackForm.resetFields();
    });
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className='flex  item-center justify-center'>
              <Title className=" font-semibold m-0 capitalize" level={4}>{interview?.candidate?.name}</Title>
              <Button className='ml-2' type='link' size='small' onClick={() => navigate(`/dashboard/candidates/${interview?.candidate?._id}`)}>View</Button>
            </span>
            <p className="text-sm text-gray-500 mt-1 capitalize">{interview?.candidate?.level}</p>
          </div>
          <Tag color={getStatusColor(interview?.status)} className="uppercase">
            {interview?.status}
          </Tag>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      <div className="space-y-6">
        <Descriptions column={2} bordered>
          <Descriptions.Item
            label={<div className="flex items-center"><Calendar size={14} className="mr-2" />Date</div>}
            span={1}
          >
            {dayjs(interview?.date).format('MMMM D, YYYY')}
          </Descriptions.Item>
          <Descriptions.Item
            label={<div className="flex items-center"><Clock size={14} className="mr-2" />Time</div>}
            span={1}
          >
            {(dayjs(interview?.time).format('h:mm A'))} ({60} minutes)
          </Descriptions.Item>
          <Descriptions.Item
            label={<div className="flex items-center"><Users size={14} className="mr-2" />Interviewers</div>}
            span={2}
          >
            {interview?.interviewer?.name}
          </Descriptions.Item>
          <Descriptions.Item
            label={<div className="flex items-center">{getInterviewTypeIcon(interview?.type)} Type</div>}
            span={2}
          >
            {makeCapitilized(interview?.type || '')} Interview
          </Descriptions.Item>
          {interview?.notes && (
            <Descriptions.Item
              label={<div className="flex items-center"><FileText size={14} className="mr-2" />Notes</div>}
              span={2}
            >
              {interview?.notes}
            </Descriptions.Item>
          )}
        </Descriptions>

        {interview?.status === 'scheduled' && (
          <div>
            <Divider>Update Status</Divider>
            <div className="flex gap-2 justify-center">
              <Button
                type="primary"
                style={{
                  backgroundColor: '#1E8449',
                }}
                onClick={() => onStatusUpdate(interview?._id, 'completed')}
              >
                Mark as Completed
              </Button>
              <Popconfirm title="Are you sure to cancel this interview?" onConfirm={() => onStatusUpdate(interview?._id, 'cancelled')} okText="Yes" cancelText="No">
                <Button
                  type='primary'
                  style={{
                    backgroundColor: '#D68910',
                  }}
                >
                  Cancel Interview
                </Button>
              </Popconfirm>
              <Button
                danger
                onClick={() => onStatusUpdate(interview?._id, 'failed')}
              >
                Failed
              </Button>
            </div>
          </div>
        )}

        {interview?.status === 'completed' ? (
          interview?.feedback ? (
            <div>
              <Divider>Feedback</Divider>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium m-0">Interview Feedback</h4>
                  {/* <Rate disabled value={interview.rating} /> */}
                </div>
                <p className="text-gray-600 font-medium m-0">{interview?.feedback}</p>
              </div>
            </div>
          ) : (
            <div>
              <Divider>Add Feedback</Divider>
              <Form form={feedbackForm} layout="vertical">
                <Form.Item
                  name="rating"
                  label="Rating"
                  rules={[{ required: true, message: 'Please rate the interview' }]}
                >
                  <Rate />
                </Form.Item>
                <Form.Item
                  name="feedback"
                  label="Feedback"
                  rules={[{ required: true, message: 'Please provide feedback' }]}
                >
                  <TextArea
                    rows={4}
                    placeholder="Provide detailed feedback about the candidate's performance..."
                  />
                </Form.Item>
                <div className="flex justify-end">
                  <Button type="primary" onClick={handleFeedbackSubmit}>
                    Submit Feedback
                  </Button>
                </div>
              </Form>
            </div>
          )
        ) : null}

        <div>
          <Divider>Interview Timeline</Divider>
          <Timeline>
            <Timeline.Item color="green">
              Interview Scheduled
              <p className="text-sm text-gray-500">
                {dayjs(interview?.createdAt).format('MMMM D, YYYY h:mm A')}
              </p>
            </Timeline.Item>
            {interview?.status !== 'scheduled' && (
              <Timeline.Item
                color={
                  interview?.status === 'completed' ? 'green' :
                    interview?.status === 'cancelled' ? 'red' :
                      'blue'
                }
              >
                Interview {makeCapitilized(interview?.status || '')}

                <p className="text-sm text-gray-500">
                  {dayjs(interview?.updatedAt).format('MMMM D, YYYY h:mm A')}
                </p>
              </Timeline.Item>
            )}
            {interview?.feedback && (
              <Timeline.Item color="blue">
                Feedback Added
                <p className="text-sm text-gray-500">
                  {dayjs(interview?.updatedAt).format('MMMM D, YYYY h:mm A')}
                </p>
              </Timeline.Item>
            )}
          </Timeline>
        </div>
      </div>
    </Modal>
  );
};

export default InterviewDetailsModal;