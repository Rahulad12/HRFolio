import { useEffect, useState } from 'react';
import { Steps, notification, Row, Col, Card, Button, Typography, Select, Descriptions } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCandidateByIdQuery, useUpdateCandidateMutation, useChangeCandidateStageMutation } from '../../services/candidateServiceApi';
import { candidateData, candidateFormData } from '../../types/index';
import CandidateProfileLoading from '../../component/Loding/CandidateProfileLoading';
import { makeCapitilized } from '../../utils/TextAlter';
import { useAppDispatch } from '../../Hooks/hook';
import { storeCandidate } from '../../action/StoreCandidate';
import CandidateHistory from '../../component/candidate/CandidateHistory';
import { candidateStatus } from '../../types/index';
import CandidateQuickAction from '../../component/candidate/CandidateQuickAction';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Predefineddata from '../../data/PredefinedData';
import CandidateTimeLine from '../../component/candidate/CandidateTimeLine';
const { Title, Text } = Typography;
const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading, refetch } = useGetCandidateByIdQuery(id, {
    skip: !id
  });

  const [changeCandidateStage, { isLoading: changeCandidateStageLoading }] = useChangeCandidateStageMutation();

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
    progress: {
      shortlisted: { completed: false, date: "" },
      first: { completed: false, date: "" },
      second: { completed: false, date: "" },
      third: { completed: false, date: "" },
      assessment: { completed: false, date: "" },
      offered: { completed: false, date: "" },
      hired: { completed: false, date: "" },
      rejected: { completed: false, date: "" },
    }
  })
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    if (data?.data) {
      setCandidate(data.data);
      const candidateList = Array.isArray(data.data) ? data.data : [data.data];
      dispatch(storeCandidate(candidateList));
    }

  }, [data]);

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

  const canMoveToStatus = (targetStatus: candidateStatus) => {
    const currentStatus = candidate.status;

    // Always allow staying on the same status
    if (targetStatus === currentStatus) return true;

    // Allow moving to rejected at any point
    if (targetStatus === "rejected") return true;

    // Allow "offered" from any stage
    if (targetStatus === "offered") return true;

    const stageOrder = StatusFlow;
    const currentIndex = stageOrder.indexOf(currentStatus);
    const targetIndex = stageOrder.indexOf(targetStatus);

    // Disallow skipping stages (e.g., from first to third directly)
    if (targetIndex > currentIndex + 1) return false;

    // If moving to a next stage, check if the previous one is marked completed
    const prevIndex = targetIndex - 1;
    if (prevIndex >= 0) {
      const prevStage = stageOrder[prevIndex];
      const isCompleted = candidate?.progress?.[prevStage]?.completed;

      return isCompleted === true;
    }

    return true;
  };


  const updateStatus = async (newStatus: candidateStatus) => {
    if (!canMoveToStatus(newStatus)) {
      api.error({
        message: "You cannot skip steps! Complete the current stage first.",
        placement: "topRight",
        duration: 3000,
      });
      return;
    }

    setCandidate({ ...candidate, status: newStatus });

    try {
      const res = await changeCandidateStage({ id: id || '', data: { status: newStatus } }).unwrap();
      console.log("res", res);
      if (res.success) {
        api.success({
          message: res?.message,
          placement: "topRight",
          duration: 3000,
          pauseOnHover: true
        });
        dispatch(storeCandidate([res.data]));
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'An unknown error occurred.';
      console.error("errorMessage", errorMessage);
      api.error({
        message: `Error updating candidate status: ${errorMessage}`,
        placement: "topRight",
        duration: 3000,
        pauseOnHover: true
      });
    } finally {
      refetch();
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
      disabled: !canMoveToStatus(step as candidateStatus)
    }));


  return (
    <div className="space-y-6 flex flex-col gap-3">
      {contextHolder}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button type="text" icon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard/candidates')} />
          <Title level={3} className="!mb-0">Candidate Details</Title>
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
              <div className="h-20 w-20 rounded-full bg-blue-950 text-white flex items-center justify-center text-3xl capitalize">
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
                    <a href={`mailto:${candidate?.email}`}>
                      <Text>
                        {candidate?.email}
                      </Text>
                    </a>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <a href={`tel:${candidate?.phone}`}><Text>{candidate?.phone}</Text></a>
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
                        <Text className='flex items-center gap-0.5'>
                          View Resume <ExternalLink size={14} />
                        </Text>
                      </a>
                    ) : 'Not provided'}
                  </Descriptions.Item>
                  <Descriptions.Item label="References">
                    {candidate?.references?.length ? candidate?.references.map((r, i) => (
                      <div key={i}>{r.name} - {r.contact} - {r.relation} </div>
                    )) : 'No references'}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Col>


          <Col md={8} xs={16}>
            <CandidateQuickAction />
          </Col>

        </Row>
      </Card>

      {/* Progress Steps */}
      <Card className="rounded-2xl shadow-sm">
        <Typography.Title level={5}>Candidate Progress</Typography.Title>
        <Steps current={currentStep} responsive size="default">
          {StatusFlow.map((step, index) => {
            const stepStatus = index < currentStep ? "finish" : index === currentStep ? "process" : "wait";
            return (
              <Steps.Step key={step} title={makeCapitilized(step)} status={stepStatus} disabled={!canMoveToStatus(step as candidateStatus)} />
            );
          })}
        </Steps>

      </Card>

      {/* Full Profile Section */}

      <Row gutter={[16, 16]}>
        <Col md={16} xs={24} lg={16}>

          <CandidateHistory />
        </Col>
        <Col md={8} xs={24} lg={8}>
          <CandidateTimeLine />
        </Col>
      </Row>
    </div>
  );


};

export default CandidateDetails;