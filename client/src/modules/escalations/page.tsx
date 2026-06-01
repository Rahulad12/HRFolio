import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, Spin, Empty, Statistic, Row, Col, Input, Tag, Typography } from 'antd';
import { Search } from 'lucide-react';
import { useGetMyEscalations } from '@/modules/escalations/lib/queries/escalations.queries';
import { EscalationsTable } from '@/modules/escalations/components/EscalationsTable';
import { useAuth } from '@/shared/hooks/useAuth';
import { useTeamByRole } from '@/modules/user-management';

export function EscalationsPage() {
  const { user } = useAuth();
  const { data: escalations = [], isLoading } = useGetMyEscalations();
  const { data: adminsData } = useTeamByRole('Admin');
  const [searchTerm, setSearchTerm] = useState('');

  const admins = (adminsData?.data || []).map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
  }));

  if (!user) {
    return <Empty description="No user found. Please log in." />;
  }

  // Filter escalations based on search
  const filteredEscalations = escalations.filter((esc: any) =>
    esc.candidateId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    esc.candidateId.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Calculate statistics
  const stats = {
    total: filteredEscalations.length,
    pending: filteredEscalations.filter((e: any) => e.status === 'Pending').length,
    inReview: filteredEscalations.filter((e: any) => e.status === 'In Review').length,
    resolved: filteredEscalations.filter((e: any) => e.status === 'Resolved').length,
  };

  // Role-based views
  const isHR = user.role === 'HR';
  const isHRAdmin = user.role === 'HR Admin';
  const isAdmin = user.role === 'Admin';

  const getRoleBasedView = () => {
    if (isHR) {
      return (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Escalations you have raised to HR Admins
          </p>
          <EscalationsTable escalations={filteredEscalations} isLoading={isLoading} hrAdmins={admins} />
        </>
      );
    }

    if (isHRAdmin || isAdmin) {
      return (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Escalations assigned to you for review and resolution
          </p>
          <EscalationsTable escalations={filteredEscalations} isLoading={isLoading} hrAdmins={admins} />
        </>
      );
    }

    return <Empty description="No access to escalations" />;
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <Typography.Title level={2}>Escalations</Typography.Title>
        <Typography.Text className="mt-1 text-sm text-gray-500">
          {isHR && 'Manage escalations you have raised'}
          {isHRAdmin && 'Review and resolve escalations assigned to you'}
          {isAdmin && 'Manage all escalations'}
        </Typography.Text>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Escalations"
              value={stats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              valueStyle={{ color: '#faad14' }}
              prefix={
                <Tag color="orange" style={{ marginRight: '8px' }}>
                  {stats.pending}
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Review"
              value={stats.inReview}
              valueStyle={{ color: '#1890ff' }}
              prefix={
                <Tag color="blue" style={{ marginRight: '8px' }}>
                  {stats.inReview}
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Resolved"
              value={stats.resolved}
              valueStyle={{ color: '#52c41a' }}
              prefix={
                <Tag color="green" style={{ marginRight: '8px' }}>
                  {stats.resolved}
                </Tag>
              }
            />
          </Card>
        </Col>
      </Row>

      {/* Search + Content */}
      <Card>
        <div className="mb-4">
          <Input
            placeholder="Search by candidate name or email..."
            prefix={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
          </div>
        ) : (
          getRoleBasedView()
        )}
      </Card>
    </motion.div>
  );
}

export default EscalationsPage;
