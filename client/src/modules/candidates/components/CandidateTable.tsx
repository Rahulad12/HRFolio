import { useMemo, useState } from 'react'
import { Button, Space, Tag, Tooltip, Popconfirm, notification, Card, Typography, Input, Select, Table, type TableColumnsType } from 'antd'
import { Plus, Trash2, Pencil, Search, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useCandidateList, useDeleteCandidate } from '../lib/queries/candidate.queries'
import { useSearchStore } from '@/shared/store/search.store'
import { makeCapitilized } from '@/shared/utils/string'
import type { Candidate, CandidateStatus } from '../types/candidate.types'
import { useCandidateStatuses } from '@/modules/lookup'
import { getLookupLabel, getLookupColor } from '@/shared/utils/lookup'

export function CandidateTable() {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const { data: statusList = [] } = useCandidateStatuses()
  const statusOptions = statusList
    .filter(s => s.isActive)
    .map(s => ({ value: s.systemName, label: s.displayName }))

  const { candidateSearch } = useSearchStore()
  const { data, isLoading } = useCandidateList({
    searchText: candidateSearch?.text || '',
    status: candidateSearch?.status || '',
  })
  const { mutateAsync: deleteCandidate } = useDeleteCandidate()

  const [api, contextHolder] = notification.useNotification()

  const sortedCandidates = useMemo(() => {
    if (!data?.data) return []
    return [...data.data].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [data])

  const filteredCandidates = useMemo(() => {
    const query = searchText.toLowerCase()
    return sortedCandidates.filter(
      (c) =>
        (c.name.toLowerCase().includes(query) ||
          c.technology.toLowerCase().includes(query) ||
          c.level.toLowerCase().includes(query)) &&
        (selectedStatus ? c.status === selectedStatus : true)
    )
  }, [sortedCandidates, searchText, selectedStatus])

  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      api.warning({ message: 'No candidates selected', placement: 'topRight', duration: 2 })
      return
    }
    try {
      const res = await deleteCandidate(selectedRowKeys as unknown as string)
      api.success({ message: res.message || 'Candidates deleted', placement: 'topRight', duration: 3 })
      setSelectedRowKeys([])
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error deleting candidates', placement: 'topRight', duration: 3 })
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCandidates)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
    saveAs(blob, 'Candidates.xlsx')
  }

  const columns: TableColumnsType<Candidate> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Candidate) => (
        <div
          className="flex cursor-pointer items-center"
          onClick={() => navigate(`/dashboard/candidates/${record._id}`)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-950 text-lg font-medium text-white mr-3">
            <span>{makeCapitilized(text.charAt(0))}</span>
          </div>
          <div>
            <div className="font-medium capitalize">{text}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Technology',
      dataIndex: 'technology',
      key: 'technology',
      render: (tech: string) => (
        <span className="text-sm text-gray-500">{makeCapitilized(tech)}</span>
      ),
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <span className="text-sm text-gray-500">{makeCapitilized(level)}</span>
      ),
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      sorter: (a: Candidate, b: Candidate) => a.experience - b.experience,
      render: (exp: number) => (
        <span className="text-sm text-gray-500">{`${exp} ${exp === 1 ? 'year' : 'years'}`}</span>
      ),
    },
    {
      title: 'Expected Salary',
      dataIndex: 'expectedsalary',
      key: 'expectedsalary',
      sorter: (a: Candidate, b: Candidate) => a.expectedsalary - b.expectedsalary,
      render: (salary: number) => (
        <span className="text-sm text-gray-500">
          ${salary?.toLocaleString('en-US') || '0'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_status: CandidateStatus, record: Candidate) => (
        <Tag color={getLookupColor(statusList, record.status)}>
          {getLookupLabel(statusList, record.status)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: unknown, record: Candidate) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Pencil className="h-4 w-4" />}
              onClick={() => navigate(`/dashboard/candidates/edit/${record._id}`)}
              className="text-green-500 hover:bg-green-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <>
      {contextHolder}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={2}>Candidates</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-gray-500">
            Manage and track all candidates in your recruitment pipeline
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<Plus className="h-4 w-4" />}
          onClick={() => navigate('/dashboard/candidates/new')}
          className="flex items-center gap-2"
        >
          Add Candidate
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Input
              placeholder="Search by name, level, technology"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<Search size={16} className="text-gray-500" />}
            />
          </div>

          <Select
            allowClear
            value={selectedStatus || undefined}
            onChange={(val) => setSelectedStatus(val || '')}
            placeholder="Filter by status"
            options={statusOptions}
            className="w-40"
            showSearch
          />

          <Button
            type="default"
            icon={<Download size={16} />}
            onClick={exportToExcel}
          >
            Export
          </Button>

          {selectedRowKeys.length > 0 && (
            <Popconfirm
              title="Are you sure to delete selected candidates?"
              description="This action cannot be undone and will permanently delete the selected candidates."
              onConfirm={handleBulkDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<Trash2 className="h-4 w-4" />}>
                Delete Selected
              </Button>
            </Popconfirm>
          )}
        </div>

        <Table
          dataSource={filteredCandidates}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          size="large"
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '50'] }}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
        />
      </Card>
    </>
  )
}
