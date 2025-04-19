import { Col, Divider, Row, Typography } from "antd";
import DashboardHead from "../component/dashboard/DashboardHead";
import { useEffect } from "react";
import { storeCandidate } from "../action/SoreCandidate";
import { useAppDispatch, useAppSelector } from "../Hooks/hook";
import { useGetCandidateQuery } from "../services/candidateServiceApi";
import ExperienceMetrics from "../component/dashboard/ExperienceMetrics";
import RecentActivities from "../component/dashboard/RecentActivities";
import { useGetInterviewQuery } from "../services/interviewServiceApi";
import { storeInterview } from "../action/StoreInterview";
import UpComingInterviews from "../component/dashboard/UpComingInterviews";
import RecentAssessment from "../component/dashboard/RecentAssessment";
const Dashboard = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search);

  const { data: candidate } = useGetCandidateQuery({
    name: filters.name,
    technology: filters.technology,
    status: filters.status,
    level: filters.level
  });
  const { data: interview } = useGetInterviewQuery({
    date: "",
    status: ""
  });

  useEffect(() => {
    if (candidate?.data) {
      dispatch(storeCandidate(candidate.data));
    }
    if (interview?.data) {
      dispatch(storeInterview(interview.data));
    }
    return () => {
      dispatch(storeCandidate([]));
      dispatch(storeInterview([]));
    };
  }, [candidate, interview, dispatch]);



  return (
    <div className="p-4 flex flex-col flex-wrap">
      <div className="flex justify-between items-center">
        <Typography.Title level={2} className="text-blue-700 font-bold">Dashboard</Typography.Title>
      </div>

      <DashboardHead />
      <Divider />
      <Row gutter={[16, 16]} className="flex flex-wrap">
        <Col span={24} >
          <RecentActivities />
        </Col>
        <Col span={6}>
          <ExperienceMetrics />
        </Col>
        <Col span={8}>
          <UpComingInterviews />
        </Col>
        <Col span={10}>
          <RecentAssessment />
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;
