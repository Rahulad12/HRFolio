import { useEffect, useState } from 'react';
import { Steps, notification, Row, Space, Col, Card, Button, Typography, Select } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCandidateByIdQuery, useUpdateCandidateMutation } from '../../services/candidateServiceApi';
import { candidateFormData } from '../../types/index';
import CandidateProfileLoading from '../../component/Loding/CandidateProfileLoading';
import { makeCapitilized } from '../../utils/TextAlter';
import { useGetInterviewByCandidateIdQuery } from '../../services/interviewServiceApi';
import { storeInterview } from '../../action/StoreInterview';
import { useAppDispatch } from '../../Hooks/hook';
import { storeCandidate } from '../../action/StoreCandidate';
import CandidateProfile from '../../component/candidate/CandidateProfile';
import { candidateStatus } from '../../types/index';
import CandidateQuickAction from '../../component/candidate/CandidateQuickAction';
import { ArrowLeft } from 'lucide-react';
import Predefineddata from '../../data/PredefinedData';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetCandidateByIdQuery(id);
  const [updateCandidate] = useUpdateCandidateMutation();
  const { data: interviewData } = useGetInterviewByCandidateIdQuery(id, {
    refetchOnMountOrArgChange: true,
  });


  const [candidate, setCandidate] = useState<candidateFormData>({
    name: "",
    email: "",
    phone: 0,
    status: "shortlisted",
    applieddate: "",
    technology: "",
    level: "",
    experience: 0,
    expectedsalary: 0,
    references: [],
    resume: "",
  })
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    if (data?.data) {
      setCandidate(data.data);
      const candidateList = Array.isArray(data.data) ? data.data : [data.data];
      dispatch(storeCandidate(candidateList));
    }
    if (interviewData?.success && interviewData?.data) {
      const interviewList = Array.isArray(interviewData.data) ? interviewData.data : [interviewData.data];
      dispatch(storeInterview(interviewList));
    }
  }, [data, interviewData]);

  const StatusFlow = [
    'shortlisted',
    'assessment',
    'first',
    'second',
    'third',
    'offered',
    'hired',
    'rejected'
  ] as const;

  type CandidateStatusFlow = typeof StatusFlow[number];
  const canMoveToNextStatus = (currentStatus: CandidateStatusFlow, nextStatus: CandidateStatusFlow) => {
    if (nextStatus === 'rejected') return true; // special case: rejection allowed anytime

    const currentIndex = StatusFlow.indexOf(currentStatus);
    const nextIndex = StatusFlow.indexOf(nextStatus);

    if (currentIndex === -1 || nextIndex === -1) return false;

    return nextIndex === currentIndex + 1; // Only next step allowed
  };

  const updateStatus = async (newStatus: candidateStatus) => {
    if (!canMoveToNextStatus(candidate.status as CandidateStatusFlow, newStatus as CandidateStatusFlow)) {
      api.error({
        message: "You cannot skip steps! Complete the current stage first.",
        placement: "topRight",
        duration: 3000,
      });
      return;
    }
    setCandidate({ ...candidate, status: newStatus });

    try {
      const res = await updateCandidate({ id: id || '', data: { ...candidate, status: newStatus } }).unwrap();
      if (res.success) {
        api.success({
          message: res.message,
          placement: "topRight",
          duration: 3000,
        })
      }
    } catch (err) {
      console.error(err);
      api.error({
        message: "Error updating status",
        placement: "topRight",
        duration: 3000,
      })
    }
  };



  const currentStep = StatusFlow.indexOf(candidate.status);

  if (isLoading) return <CandidateProfileLoading />;


  const candidatesStatusOptions = StatusFlow
    .filter(step => Predefineddata?.Status.map((status) => status.value).includes(step))
    .map((step, index) => ({
      key: index,
      label: makeCapitilized(step),
      value: step,
      disabled: !canMoveToNextStatus(candidate.status as CandidateStatusFlow, step as CandidateStatusFlow)
    }));




  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="mb-6 flex items-center justify-between">
        <div className='flex items-center space-x-2'>
          <Button type="text" icon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard/candidates')} />
          <Typography.Title level={2}>Candidate Details</Typography.Title>
        </div>
        <Select
          placeholder="Update Status"
          className="w-40 cursor-pointer"
          onChange={updateStatus}
          options={candidatesStatusOptions}
          value={candidate?.status}
          showSearch
        />
      </div>

      {/* Header Section */}
      <Space direction='vertical'>
        <Row gutter={[16, 16]}>
          <Col md={16} xs={24}>
            <CandidateProfile />
          </Col>
          <Col md={8} xs={24}>
            <CandidateQuickAction />

          </Col>
        </Row>
      </Space>
      <Card className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Candidate Progress</h2>
        <Steps current={currentStep} responsive size="small">
          {StatusFlow.map((step) => (
            <Steps.Step key={step} title={makeCapitilized(step)} />
          ))}
        </Steps>
      </Card>
    </div>
  );

};

export default CandidateDetails;