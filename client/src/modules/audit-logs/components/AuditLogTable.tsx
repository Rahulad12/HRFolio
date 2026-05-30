import { useState, useMemo } from 'react'
import { Table, Input, Select, Space, Tag, Typography } from 'antd'
import { Search } from 'lucide-react'
import { useAuditLogList, useScopedAuditLogList } from '../lib/queries/audit-log.queries'
import dayjs from 'dayjs'
import type { AuditLog } from '../types/audit-log.types'

interface AuditLogTableProps {
  scoped?: boolean
}

const { Text } = Typography
const { Option } = Select

const actionColors: Record<string, string> = {
  CANDIDATE_CREATE: 'green',
  CANDIDATE_UPDATE: 'blue',
  CANDIDATE_DELETE: 'red',
  CANDIDATE_STAGE_CHANGE: 'orange',
  EMAIL_SENT: 'cyan',
  ESCALATION_RAISED: 'volcano',
  ESCALATION_RESOLVED: 'green',
  USER_CREATE: 'purple',
  USER_DEACTIVATE: 'red',
  USER_REACTIVATE: 'green',
  USER_ROLE_CHANGE: 'gold',
  AUTH_LOGIN: 'lime',
  AUTH_LOGOUT: 'default',
  AUTH_FAILED_LOGIN: 'red',
}

export function AuditLogTable({ scoped = false }: AuditLogTableProps) {
  const [actionFilter, setActionFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  const fullQuery = useAuditLogList()
  const scopedQuery = useScopedAuditLogList()
  const { data, isLoading } = scoped ? scopedQuery : fullQuery

  const filteredLogs = useMemo(() => {
    const logs = data?.data?.logs || []
    return logs.filter((log) => {
      const matchesAction = !actionFilter || log.action === actionFilter
      const matchesSearch = !searchTerm ||
        log.actor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesAction && matchesSearch
    })
  }, [data, actionFilter, searchTerm])

  const actions = useMemo(() => {
    const logs = data?.data?.logs || []
    return [...new Set(logs.map((l) => l.action))].sort()
  }, [data])

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (ts: string) => dayjs(ts).format('MMM D, YYYY h:mm A'),
    },
    {
      title: 'Actor',
      key: 'actor',
      render: (_: unknown, record: AuditLog) => (
        <Space direction="vertical" size={0}>
          <Text>{record.actor?.name || '-'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.actor?.role || '-'}</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Tag color={actionColors[action] || 'default'}>{action}</Tag>
      ),
    },
    {
      title: 'Target',
      key: 'target',
      render: (_: unknown, record: AuditLog) => (
        <Space direction="vertical" size={0}>
          <Text>{record.target?.name || '-'}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.target?.type}</Text>
        </Space>
      ),
    },
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 140,
      render: (ip: string) => ip || '-',
    },
  ]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Input
            placeholder="Search actor, target, action..."
            prefix={<Search size={16} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by action"
            value={actionFilter || undefined}
            onChange={(val) => setActionFilter(val || '')}
            allowClear
            style={{ width: 220 }}
          >
            {actions.map((a) => (
              <Option key={a} value={a}>{a}</Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        dataSource={filteredLogs}
        columns={columns}
        rowKey="_id"
        loading={isLoading}
        pagination={{ pageSize: 20, showTotal: (total) => `Total ${total} entries` }}
      />
    </div>
  )
}
