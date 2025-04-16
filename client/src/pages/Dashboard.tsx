import { Col, Divider, Row } from "antd";
import DashboardHead from "../component/dashboard/DashboardHead";
import { useEffect } from "react";
import { storeCandidate } from "../action/SoreCandidate";
import { useAppDispatch, useAppSelector } from "../Hooks/hook";
import { useGetCandidateQuery } from "../services/candidateServiceApi";
import HiringMetric from "../component/dashboard/HiringMetric";
import RecentActivities from "../component/dashboard/RecentActivities";
const Dashboard = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.search);

  const { data: candidate } = useGetCandidateQuery({
    name: filters.name,
    technology: filters.technology,
    status: filters.status,
    level: filters.level
  });

  useEffect(() => {
    if (candidate?.data) {
      dispatch(storeCandidate(candidate.data));
    }
    return () => {
      dispatch(storeCandidate([]));
    };
  }, [candidate]);



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <DashboardHead />
      <Divider />
      <div className="border border-gray-200 p-4 ">
        <Row gutter={16} className="flex justify-around">
          <Col>
            <RecentActivities />
          </Col>
          <Col>
            <HiringMetric />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
