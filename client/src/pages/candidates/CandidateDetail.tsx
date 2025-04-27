import { useEffect, useState } from 'react';
import { Steps, notification, Row, Space, Col, Card, Button, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCandidateByIdQuery, useUpdateCandidateMutation } from '../../services/candidateServiceApi';
import { candidateFormData } from '../../types/index';
import CandidateProfileLoading from '../../component/Loding/CandidateProfileLoading';
import { makeCapitilized } from '../../utils/TextAlter';
import { useGetInterviewByCandidateIdQuery } from '../../services/interviewServiceApi';
import { storeInterview } from '../../action/StoreInterview';
import { useAppDispatch } from '../../Hooks/hook';
import { storeCandidate, useCandidate } from '../../action/StoreCandidate';
import CandidateProfile from '../../component/candidate/CandidateProfile';
import { candidateStatus } from '../../types/index';
import CandidateQuickAction from '../../component/candidate/CandidateQuickAction';
import { ArrowLeft } from 'lucide-react';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    data: candidates
  } = useCandidate();

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


  const updateStatus = async (newStatus: candidateStatus) => {
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

  const interviewSteps = ['shortlisted', 'assessment', 'first', 'second', 'third', 'offered', 'hired', 'rejected'];
  const currentStep = interviewSteps.indexOf(candidate.status);

  if (isLoading) return <CandidateProfileLoading />;

  const candidateStatus = [...new Set(
    candidates?.data?.map((c: candidateFormData) => c.status) || []
  )]

  const candidatesStatusOptions = interviewSteps
    .filter((step) => candidateStatus.includes(step as candidateStatus))
    .map((status) => {
      const stepIndex = interviewSteps.indexOf(status);
      const isDisabled = stepIndex < currentStep;
      return {
        label: makeCapitilized(status),
        value: status,
        disabled: isDisabled
      };
    });


  return (
    <div className="space-y-6">
      {contextHolder}
      <div className="mb-6 flex items-center">
        <Button type="text" icon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard/candidates')} />
        <Typography.Title level={2}>Candidate Details</Typography.Title>
      </div>

      {/* Header Section */}
      <Space direction='vertical'>
        <Row gutter={[16, 16]}>
          <Col md={16} xs={24}>
            <CandidateProfile updateStatus={updateStatus} statusOptions={candidatesStatusOptions} />
          </Col>
          <Col md={8} xs={24}>
            <CandidateQuickAction />

          </Col>
        </Row>
      </Space>
      <Card className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Candidate Progress</h2>
        <Steps current={currentStep} responsive size="small">
          {interviewSteps.map((step) => (
            <Steps.Step key={step} title={makeCapitilized(step)} />
          ))}
        </Steps>
      </Card>
    </div>
  );

};

export default CandidateDetails;