import { useEffect, useState } from 'react';
import { Steps, notification, Row, Col, Card, Button, Typography, Select, Descriptions } from 'antd';
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
import { ArrowLeft, ExternalLink } from 'lucide-react';
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
        dispatch(storeCandidate([res.data]));
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
      // disabled: !canMoveToNextStatus(candidate.status as CandidateStatusFlow, step as CandidateStatusFlow)
    }));

  return (
    <div className="space-y-6 flex flex-col gap-3">
      {contextHolder}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button type="text" icon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard/candidates')} />
          <Typography.Title level={3} className="!mb-0">Candidate Details</Typography.Title>
        </div>
        <Select
          placeholder="Update Status"
          className="w-40"
          onChange={updateStatus}
          options={candidatesStatusOptions}
          value={candidate?.status}
          showSearch
        />
      </div>

      {/* Profile Summary */}
      <Card className="rounded-2xl shadow-sm">
        <Row gutter={24}>
          <Col md={16} xs={24}>
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-blue-900 text-white flex items-center justify-center text-3xl capitalize">
                {candidate?.name?.charAt(0)}
              </div>
              <div>
                <Typography.Title level={4} className="capitalize">{candidate?.name}</Typography.Title>
                <Typography.Text type="secondary" className="capitalize">{candidate?.technology}</Typography.Text>
              </div>
            </div>

            <Row gutter={16} className="mt-6">
              <Col span={12}>
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Email">
                    <a href={`mailto:${candidate?.email}`}>{candidate?.email}</a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <a href={`tel:${candidate?.phone}`}>{candidate?.phone}</a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Experience">
                    {candidate?.experience} {candidate?.experience === 1 ? 'year' : 'years'}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Resume">
                    {candidate?.resume ? (
                      <a href={candidate?.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        View Resume <ExternalLink size={14} />
                      </a>
                    ) : 'Not provided'}
                  </Descriptions.Item>
                  <Descriptions.Item label="References">
                    {candidate?.references?.length ? candidate?.references.map((r, i) => (
                      <div key={i}>{r.name}</div>
                    )) : 'No references'}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Col>

          <Col md={8} xs={24}>
            <CandidateQuickAction />
          </Col>
        </Row>
      </Card>

      {/* Progress Steps */}
      <Card className="rounded-2xl shadow-sm">
        <Typography.Title level={5}>Candidate Progress</Typography.Title>
        <Steps current={currentStep} responsive size="small">
          {StatusFlow.map((step) => (
            <Steps.Step key={step} title={makeCapitilized(step)} />
          ))}
        </Steps>
      </Card>

      {/* Full Profile Section */}
      <CandidateProfile />
    </div>
  );


};

export default CandidateDetails;