import { useEffect, useState } from 'react';
import { Tabs, Steps, Button, Descriptions, Tag, Card, Timeline, Divider, Select } from 'antd';
import { useParams } from 'react-router-dom';
import {
  UserCircle,
  FileText,
  ClipboardList,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { useGetCandidateByIdQuery, useUpdateCandidateMutation } from '../services/candidateServiceApi';
import { candidateData } from '../types';
import CandidateProfileLoading from '../component/Loding/CandidateProfileLoading';
import { toast } from 'react-toastify';

const { TabPane } = Tabs;
const { Option } = Select;
const CandidateProfile = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetCandidateByIdQuery(id);
  const [updateCandidate] = useUpdateCandidateMutation();


  const [candidate, setCandidate] = useState<candidateData>({
    phone: '',
    email: '',
    name: '',
    technology: '',
    level: '',
    experience: 0,
    expectedsalary: 0,
    references: [],
    status: 'shortlisted',
    _id: '',
  });

  useEffect(() => {
    if (data?.data) {
      setCandidate(data.data);
    }
  }, [data]);


  const updateStatus = async (newStatus: string) => {
    setCandidate({ ...candidate, status: newStatus });

    try {
      const res = await updateCandidate({ id: candidate._id, data: { status: newStatus } }).unwrap();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update candidate status");
    }
  };

  const interviewSteps = ['shortlisted', 'first interview', 'second interview', 'hired', 'rejected'];
  const currentStep = interviewSteps.indexOf(candidate.status);

  if (isLoading) return <CandidateProfileLoading />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-6">{candidate.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
              <span className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {candidate.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {candidate.phone}
              </span>
            </div>
          </div>
          <Select
            placeholder="Update Status"
            className="min-w-[200px] shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md"
            value={candidate.status}
            size="large"
            onChange={updateStatus}
          >
            <Option value="shortlisted">Shortlisted</Option>
            <Option value="first interview">First Interview</Option>
            <Option value="second interview">Second Interview</Option>
            <Option value="hired">Hired</Option>
            <Option value="rejected">Rejected</Option>
          </Select>
        </div>

        <Divider className="my-6" />

        {/* Steps */}
        <Steps current={currentStep} responsive>
          {interviewSteps.map((step) => (
            <Steps.Step key={step} title={step.charAt(0).toUpperCase() + step.slice(1)} />
          ))}
        </Steps>

        {/* Details */}
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 2 }} className="mt-6">
          <Descriptions.Item label="Technology">
            <Tag color="blue">{candidate.technology}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Level">
            <Tag color="green">{candidate.level}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Experience">
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              {candidate.experience} years
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Expected Salary">
            <span className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              ${candidate.expectedsalary.toLocaleString()}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="1" className="bg-white rounded-xl shadow-sm p-6">
        {/* Tab 1: CV & Docs */}
        <TabPane
          key="1"
          tab={
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              CV & Documents
            </span>
          }
        >
          <Card title="CV" size="small">
            <p className="text-gray-500">No CV uploaded.</p>
            {/* Uncomment when CV is available */}
            {/* <Button type="link" href={candidate.cv} target="_blank">Download CV</Button> */}
          </Card>
        </TabPane>

        {/* Tab 2: Assessments */}
        <TabPane
          key="2"
          tab={
            <span className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Assessments
            </span>
          }
        >
          <Timeline>
            <Timeline.Item color="green">
              <p className="font-medium">Technical Assessment</p>
              <p>Score: 85/100</p>
              <p className="text-gray-500 text-sm">Completed on March 15, 2024</p>
            </Timeline.Item>
            <Timeline.Item color="blue">
              <p className="font-medium">Behavioral Assessment</p>
              <p>Score: 90/100</p>
              <p className="text-gray-500 text-sm">Completed on March 16, 2024</p>
            </Timeline.Item>
          </Timeline>
        </TabPane>

        {/* Tab 3: Interviews */}
        <TabPane
          key="3"
          tab={
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Interviews
            </span>
          }
        >
          <Timeline>
            <Timeline.Item color="green">
              <p className="font-medium">First Technical Interview</p>
              <p>Interviewer: Jane Smith</p>
              <p className="text-gray-500 text-sm">March 20, 2024 at 10:00 AM</p>
            </Timeline.Item>
            <Timeline.Item color="blue">
              <p className="font-medium">HR Interview</p>
              <p>Interviewer: Mike Johnson</p>
              <p className="text-gray-500 text-sm">March 22, 2024 at 2:00 PM</p>
            </Timeline.Item>
          </Timeline>
        </TabPane>

        {/* Tab 4: References */}
        <TabPane
          key="4"
          tab={
            <span className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              References
            </span>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {candidate.references?.length > 0 ? (
              candidate.references.map((ref, index) => (
                <Card key={index} size="small" title={ref.name}>
                  <Descriptions column={1}>
                    <Descriptions.Item label="Contact">{ref.contact}</Descriptions.Item>
                    <Descriptions.Item label="Relation">{ref.relation}</Descriptions.Item>
                  </Descriptions>
                </Card>
              ))
            ) : (
              <p className="text-gray-500">No references available.</p>
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CandidateProfile;
