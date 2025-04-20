import { Card, Col, Divider, Row, Typography, Space } from "antd";
import DashboardHead from "../component/dashboard/DashboardHead";
import { useEffect } from "react";
import { storeCandidate } from "../action/StoreCandidate";
import { useAppDispatch, useAppSelector } from "../Hooks/hook";
import { useGetCandidateQuery } from "../services/candidateServiceApi";
import RecentActivities from "../component/dashboard/RecentActivities";
import { useGetInterviewQuery } from "../services/interviewServiceApi";
import { storeInterview } from "../action/StoreInterview";
import UpComingInterviews from "../component/dashboard/UpComingInterviews";
import RecentAssessment from "../component/dashboard/RecentAssessment";
import CandidateByTechnology from "../component/dashboard/graph/CandidateByTechnology";
import CandidateByStatus from "../component/dashboard/graph/CandidateByStatus";
import ExperienceGraph from "../component/dashboard/graph/ExperienceGraph";

const Dashboard = () => {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector(state => state.auth);

  const { data: candidate } = useGetCandidateQuery({
    searchText: "",
    status: "",
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
  }, [candidate, interview, dispatch]);

  return (
    <div className="dashboard-container  p-4">
      {/* Welcome Header */}
      <Space direction="vertical" size="middle">
        <div className="flex justify-between items-center">
          <Typography.Title level={3} style={{ margin: 0 }}>
            Welcome back, {user?.username}
          </Typography.Title>
        </div>

        {/* Dashboard Head/Summary Cards */}
        <DashboardHead />

        <Divider />

        {/* Main Content Area */}
        <Row gutter={[24, 24]}>
          {/* Left Column */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="middle" >
              <RecentActivities />
              <Card
                title="Candidates Statistics"
                className="shadow-sm border"
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24}>
                    <CandidateByTechnology />
                  </Col>
                  <Col xs={24}>
                    <CandidateByStatus />
                  </Col>
                </Row>
              </Card>
            </Space>
          </Col>

          {/* Right Column */}
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="middle" >

              <RecentAssessment />

              <Row gutter={[24, 24]}>
                <Col xs={24}>
                  <Card
                    title="Experience Distribution"
                    className="shadow-sm"
                  >
                    <ExperienceGraph />
                  </Card>
                </Col>
                <Col xs={24}>
                  <UpComingInterviews />
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default Dashboard;