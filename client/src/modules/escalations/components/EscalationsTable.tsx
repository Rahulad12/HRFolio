import {
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Select,
  Tooltip,
  Empty,
} from 'antd';
import { DeleteOutlined, CheckOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import type { ColumnType } from 'antd/es/table';
import {
  useResolveEscalation,
  useEscalateToLevel2,
  useCancelEscalation,
} from '../lib/queries/escalations.queries';
import {
  resolveEscalationSchema,
  type ResolveEscalationFormData,
} from '../schemas/escalations.schema';
import type { Escalation, EscalationStatus } from '../types/escalations.types';
import { useAuth } from '@/shared/hooks/useAuth';

dayjs.extend(relativeTime);

interface EscalationsTableProps {
  escalations: Escalation[];
  isLoading: boolean;
  hrAdmins?: Array<{ id: string; name: string; email: string }>;
}

const statusColors: Record<EscalationStatus, string> = {
  Pending: 'orange',
  'In Review': 'blue',
  Resolved: 'green',
  Cancelled: 'red',
};

export function EscalationsTable({
  escalations,
  isLoading,
  hrAdmins = [],
}: EscalationsTableProps) {
  const { user } = useAuth();
  const { mutate: resolveEscalation, isPending: isResolving } = useResolveEscalation();
  const { mutate: escalateToLevel2, isPending: isEscalating } = useEscalateToLevel2();
  const { mutate: cancelEscalation, isPending: isCancelling } = useCancelEscalation();

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');

  const { control, handleSubmit, reset } = useForm<ResolveEscalationFormData>({
    resolver: zodResolver(resolveEscalationSchema),
  });

  const handleResolve = async (data: ResolveEscalationFormData) => {
    if (!selectedEscalation) return;

    resolveEscalation(
      {
        escalationId: selectedEscalation.id,
        payload: { resolutionComment: data.resolutionComment },
      },
      {
        onSuccess: () => {
          message.success('Escalation resolved successfully');
          setResolveModalOpen(false);
          reset();
          setSelectedEscalation(null);
        },
        onError: (error) => {
          message.error(`Failed to resolve: ${error.message}`);
        },
      }
    );
  };

  const handleEscalateClick = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setSelectedAdminId('');
    setEscalateModalOpen(true);
  };

  const handleEscalate = () => {
    if (!selectedEscalation || !selectedAdminId) {
      message.error('Please select an Admin');
      return;
    }

    escalateToLevel2(
      {
        escalationId: selectedEscalation.id,
        payload: {
          candidateId: selectedEscalation.candidateId.id,
          targetUserId: selectedAdminId,
          notes: selectedEscalation.notes,
        },
      },
      {
        onSuccess: () => {
          message.success('Escalation escalated to Level 2');
          setEscalateModalOpen(false);
          setSelectedEscalation(null);
          setSelectedAdminId('');
        },
        onError: (error) => {
          message.error(`Failed to escalate: ${error.message}`);
        },
      }
    );
  };

  const handleCancel = (escalationId: string) => {
    Modal.confirm({
      title: 'Cancel Escalation',
      content: 'Are you sure you want to cancel this escalation?',
      okText: 'Cancel Escalation',
      okType: 'danger',
      onOk: () => {
        cancelEscalation(escalationId, {
          onSuccess: () => {
            message.success('Escalation cancelled successfully');
          },
          onError: (error) => {
            message.error(`Failed to cancel: ${error.message}`);
          },
        });
      },
    });
  };

  const columns: ColumnType<Escalation>[] = [
    {
      title: 'Candidate',
      dataIndex: ['candidateId', 'name'],
      key: 'candidate',
      width: '15%',
      render: (text: string, record: Escalation) => (
        <Tooltip title={record.candidateId.email}>{text}</Tooltip>
      ),
    },
    {
      title: 'Raised By',
      dataIndex: ['raisedBy', 'name'],
      key: 'raisedBy',
      width: '12%',
    },
    {
      title: 'Assigned To',
      dataIndex: ['assignedTo', 'name'],
      key: 'assignedTo',
      width: '12%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (status: EscalationStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: '8%',
      render: (level: number) => `L${level}`,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '12%',
      render: (date: string) => dayjs(date).fromNow(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '20%',
      render: (_text: any, record: Escalation) => {
        const isRaiser = user?.Id === record.raisedBy.id;
        const isAssignee = user?.Id === record.assignedTo.id;
        const canResolve = isAssignee && record.status !== 'Resolved';
        const canEscalate =
          isAssignee && record.level === 1 && record.status === 'Pending';
        const canCancel = isRaiser && record.status === 'Pending';

        return (
          <Space size="small" wrap>
            {canResolve && (
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => {
                  setSelectedEscalation(record);
                  setResolveModalOpen(true);
                }}
                loading={isResolving}
              >
                Resolve
              </Button>
            )}
            {canEscalate && (
              <Button
                type="default"
                size="small"
                icon={<ArrowUpOutlined />}
                onClick={() => handleEscalateClick(record)}
                loading={isEscalating}
              >
                Escalate
              </Button>
            )}
            {canCancel && (
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleCancel(record.id)}
                loading={isCancelling}
              >
                Cancel
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  if (escalations.length === 0 && !isLoading) {
    return <Empty description="No escalations found" />;
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={escalations}
        loading={isLoading}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: 1200 }}
      />

      {/* Resolve Modal */}
      <Modal
        title={`Resolve Escalation: ${selectedEscalation?.candidateId.name}`}
        open={resolveModalOpen}
        onCancel={() => {
          setResolveModalOpen(false);
          reset();
          setSelectedEscalation(null);
        }}
        onOk={handleSubmit(handleResolve)}
        confirmLoading={isResolving}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Resolution Comment" required>
            <Controller
              name="resolutionComment"
              control={control}
              render={({ field, fieldState }: any) => (
                <>
                  <Input.TextArea
                    {...field}
                    placeholder="Provide resolution details..."
                    rows={4}
                    maxLength={500}
                    status={fieldState.error ? 'error' : ''}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Escalate Modal */}
      <Modal
        title={`Escalate to Admin: ${selectedEscalation?.candidateId.name}`}
        open={escalateModalOpen}
        onCancel={() => {
          setEscalateModalOpen(false);
          setSelectedEscalation(null);
          setSelectedAdminId('');
        }}
        onOk={handleEscalate}
        confirmLoading={isEscalating}
      >
        <Form layout="vertical" className="mt-4">
          <Form.Item label="Escalate To (Admin)" required>
            <Select
              placeholder="Select Admin to escalate to"
              value={selectedAdminId || undefined}
              onChange={(val) => setSelectedAdminId(val)}
              options={hrAdmins.map((admin) => ({
                value: admin.id,
                label: `${admin.name} (${admin.email})`,
              }))}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
