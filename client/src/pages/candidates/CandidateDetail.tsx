import { useEffect, useState } from 'react';
import { Steps, Select, notification } from 'antd';
import { useParams } from 'react-router-dom';
import { useGetCandidateByIdQuery, useUpdateCandidateMutation } from '../../services/candidateServiceApi';
import {  candidateFormData } from '../../types/index';
import CandidateProfileLoading from '../../component/Loding/CandidateProfileLoading';
import { makeCapitilized } from '../../utils/TextAlter';
import Predefineddata from '../../data/PredefinedData';
import { useGetInterviewByCandidateIdQuery } from '../../services/interviewServiceApi';
import { storeInterview } from '../../action/StoreInterview';
import { useAppDispatch } from '../../Hooks/hook';
import { storeCandidate } from '../../action/StoreCandidate';
import CandidateProfile from '../../component/candidate/CandidateProfile';
import { candidateStatus } from '../../types/index';
import CandidateInfo from '../../component/candidate/CandidateInfo';
import CandidateDetailsFooter from '../../component/candidate/CandidateDetailsFooter';
const { Option } = Select;



const CandidateDetails = () => {
  const { id } = useParams();
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

  const interviewSteps = ['shortlisted', 'first', 'second', 'third', 'assessment', 'offered', 'hired', 'rejected'];
  const currentStep = interviewSteps.indexOf(candidate.status);

  if (isLoading) return <CandidateProfileLoading />;

  return (
    <div className="space-y-6">
      {contextHolder}

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex">
          <div className="flex-1">
            <CandidateProfile />
          </div>
          <div className="min-w-[200px]">
            <Select
              placeholder="Update Status"
              className="w-full shadow-sm"
              value={candidate.status}
              size="large"
              onChange={updateStatus}
            >
              {Predefineddata.Status?.map((status) => (
                <Option key={status.key} value={status.value}>
                  {makeCapitilized(status.label)}
                </Option>
              ))}
            </Select>
          </div>
        </div>

      </div>
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Candidate Progress</h2>
        <Steps current={currentStep} responsive size="small">
          {interviewSteps.map((step) => (
            <Steps.Step key={step} title={makeCapitilized(step)} />
          ))}
        </Steps>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Candidate Details</h2>

        <CandidateInfo />
      </div>
      {/* Candidate Details Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Candidate Information</h2>
        <CandidateDetailsFooter />
      </div>
    </div>
  );

};

export default CandidateDetails;