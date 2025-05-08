import React, { useEffect, useState } from 'react';
import { Steps, notification, Row, Col, Card, Button, Typography, Select, Descriptions, Skeleton, message, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCandidateByIdQuery, useRejectCandidateMutation, useChangeCandidateStageMutation } from '../../services/candidateServiceApi';
import { candidateFormData } from '../../types/index';
import { makeCapitilized } from '../../utils/TextAlter';
import { useAppDispatch } from '../../Hooks/hook';
import { storeCandidate } from '../../action/StoreCandidate';
import CandidateHistory from '../../component/candidate/CandidateHistory';
import { candidateStatus } from '../../types/index';
import CandidateQuickAction from '../../component/candidate/CandidateQuickAction';
import { ArrowLeft, Edit, ExternalLink } from 'lucide-react';
import CandidateTimeLine from '../../component/candidate/CandidateTimeLine';
import dayjs from "dayjs";
const { Title, Text } = Typography;

const CandidateStatusStage = [
  { key: 1, label: "Shortlisted", value: "shortlisted" },
  { key: 2, label: "First Interview", value: "first" },
  { key: 3, label: "Second Interview", value: "second" },
  { key: 4, label: "Third Interview", value: "third" },
  { key: 5, label: "Assessment", value: "assessment" },
  { key: 6, label: "Offered", value: "offered" },
  { key: 7, label: "Hired", value: "hired" },
]
const CandidateDetails: React.FC = () => {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading: candidateLoading, refetch } = useGetCandidateByIdQuery(id, {
    skip: !id
  });

  const [changeCandidateStage, { isLoading: changeCandidateStageLoading }] = useChangeCandidateStageMutation();
  const [rejectCandidate, { isLoading: rejectCandidateLoading }] = useRejectCandidateMutation();

  const [candidate, setCandidate] = useState<candidateFormData>({
    name: "",
    email: "",
    phone: "",
    status: "shortlisted",
    applieddate: "",
    technology: "",
    level: "",
    experience: 0,
    expectedsalary: 0,
    references: [],
    resume: "",
    progress: {
      shortlisted: { completed: false, date: dayjs() },
      first: { completed: false, date: dayjs() },
      second: { completed: false, date: dayjs() },
      third: { completed: false, date: dayjs() },
      assessment: { completed: false, date: dayjs() },
      offered: { completed: false, date: dayjs() },
      hired: { completed: false, date: dayjs() },
      rejected: { completed: false, date: dayjs() },
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

  const labelMap: Record<candidateStatus, string> = {
    shortlisted: 'Shortlisted',
    first: 'First Interview',
    second: 'Second Interview',
    third: 'Third Interview',
    assessment: 'Assessment',
    offered: 'Offered',
    hired: 'Hired',
    rejected: 'Rejected',
  };


  const StatusFlow: candidateStatus[] = [
    'shortlisted',
    'assessment',
    'first',
    'second',
    'third',
    'offered',
    'hired',
  ] as const;

  const canMoveToStatus = (targetStatus: candidateStatus) => {
    const currentStatus = candidate.status;

    if (targetStatus === currentStatus) return true;

    const stageOrder = StatusFlow;
    const currentIndex = stageOrder.indexOf(currentStatus);
    const targetIndex = stageOrder.indexOf(targetStatus);

    // Disallow skipping more than one stage ahead, unless it's "offered"
    if (targetStatus !== "offered" && targetIndex > currentIndex + 1) return false;

    //Special case for "offered"
    if (targetStatus === "offered") {
      const previousState = stageOrder.slice(1, targetIndex);
      const hasAnyCompleted = previousState.some(
        stage => candidate.progress?.[stage]?.completed === true
      );
      return hasAnyCompleted;
    }

    // Default case: check if previous stage is completed
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
        duration: 3,
        showProgress: true
      });
      return;
    }


    try {
      const res = await changeCandidateStage({ id: id || '', data: { status: newStatus } }).unwrap();
      if (res.success) {
        setCandidate({ ...candidate, status: newStatus });
        api.success({
          message: res?.message,
          placement: "topRight",
          duration: 3,
          pauseOnHover: true,
          showProgress: true
        });
        dispatch(storeCandidate([res.data]));
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'An unknown error occurred.';
      console.error("errorMessage", errorMessage);
      api.error({
        message: `Error updating candidate status: ${errorMessage}`,
        placement: "topRight",
        duration: 3,
        pauseOnHover: true,
        showProgress: true
      });
    } finally {
      refetch();
    }
  };

  const rejectCandidateHandler = () => {
    Modal.confirm({
      title: 'Are you sure you want to reject this candidate?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          if (!id) return
          const res = await rejectCandidate(id).unwrap();
          if (res.success) {
            api.success({
              message: res?.message,
              placement: "topRight",
              duration: 3,
              pauseOnHover: true,
              showProgress: true
            });
          }
        } catch (error: any) {
          console.log(error);
          api.error({
            message: `Error updating candidate status: ${error?.data?.message}`,
            placement: "topRight",
            duration: 3,
            pauseOnHover: true,
            showProgress: true

          })
        } finally {
          if (id) {
            navigate(`/dashboard/candidates/${id}`);
          }
        }
      }
    })

  }

  const currentStep = StatusFlow.indexOf(candidate.status);


  const candidatesStatusOptions = StatusFlow
    .filter(step => CandidateStatusStage?.map((status) => status.value).includes(step))
    .map((step, index) => ({
      key: index,
      label: makeCapitilized(labelMap[step]),
      value: step,
      disabled: !canMoveToStatus(step as candidateStatus)
    }));

  if (candidateLoading || changeCandidateStageLoading) {
    return <Skeleton active />;
  }
  if (rejectCandidateLoading) {
    message.loading('Rejecting candidate...');
  }


  return (
    <div className="space-y-6 flex flex-col gap-3">
      {contextHolder}
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-2">
          <Button type="text" icon={<ArrowLeft size={18} />} onClick={() => navigate('/dashboard/candidates')} />
          <Title level={3} className="!mb-0">Candidate Details</Title>
        </div>

        <div className='flex items-center gap-2 flex-wrap'>
          <Button
            type="primary"
            onClick={() => navigate(`/dashboard/candidates/edit/${id}`)}
            icon={<Edit size={16} />}
            disabled={changeCandidateStageLoading || rejectCandidateLoading}
          >
            Edit
          </Button>
          <Select
            placeholder="Update Status"
            className="w-40"
            onChange={updateStatus}
            options={candidatesStatusOptions}
            value={candidate?.status}
            loading={changeCandidateStageLoading}
            disabled={changeCandidateStageLoading || rejectCandidateLoading}
          />
        </div>

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
            <CandidateQuickAction rejectCandidateHandlers={rejectCandidateHandler} disableRejectionButton={data?.data?.status === 'hired' || rejectCandidateLoading || data?.data?.status === 'rejected'} />
          </Col>

        </Row>
      </Card>

      {/* Progress Steps */}
      <Card className="rounded-2xl shadow-sm">
        <Typography.Title level={5}>Candidate Progress</Typography.Title>
        <Steps
          current={currentStep}
          responsive
          labelPlacement="vertical"
          size="small"
          onChange={(current) => {
            if (changeCandidateStageLoading || rejectCandidateLoading) return;
            const newStatus = StatusFlow[current];
            if (canMoveToStatus(newStatus)) {
              updateStatus(newStatus);
            } else {
              api.error({
                message: "You cannot skip steps! Complete the current stage first.",
                placement: "topRight",
                duration: 3000,
              });
            }
          }}
        >
          {StatusFlow.map((step, index) => {
            const stepStatus = index < currentStep ? "finish" : index === currentStep ? "process" : "wait";
            return (
              <Steps.Step
                key={step}
                title={makeCapitilized(labelMap[step])}
                status={stepStatus}
                disabled={!canMoveToStatus(step as candidateStatus)}
              />
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