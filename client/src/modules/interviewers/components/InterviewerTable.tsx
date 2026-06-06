import { useMemo, useState } from 'react'
import { Button, Card, Input, message, Popconfirm, Select, Tooltip, Typography, Table, type TableColumnsType } from 'antd'
import { UserPlus, Search, Pencil, Trash2, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { useInterviewerList, useDeleteInterviewer } from '../lib/queries/interviewer.queries'
import type { Interviewer } from '../types/interviewer.types'

export function InterviewerTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState<string>('')
  const navigate = useNavigate()

  const { data, isLoading, refetch } = useInterviewerList()
  const { mutateAsync: deleteInterviewer } = useDeleteInterviewer()

  const departments = useMemo(() => {
    if (!data?.data) return []
    return [...new Set(data.data.map((i) => i.department))]
  }, [data])

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...departments.map((dept) => ({ value: dept, label: dept })),
  ]

  const filteredInterviewers = useMemo(() => {
    if (!data?.data) return []
    return data.data.filter((i) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.position.toLowerCase().includes(q)
      const matchesDept = !departmentFilter || i.department === departmentFilter
      return matchesSearch && matchesDept
    })
  }, [data, searchTerm, departmentFilter])

  const handleDelete = async (interviewer: Interviewer) => {
    try {
      const result = await deleteInterviewer(interviewer._id)
      if (result.success) {
        message.success(result.message)
        refetch()
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      message.error(e?.data?.message || 'Error deleting interviewer')
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredInterviewers)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    saveAs(blob, 'Interviewers.xlsx')
  }

  const columns: TableColumnsType<Interviewer> = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Interviewer) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: 'DEPARTMENT',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'POSITION',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'ACTIONS',
      key: 'actions',
      render: (_: unknown, record: Interviewer) => (
        <div className="flex space-x-2">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Pencil size={16} className="text-blue-600" />}
              onClick={() => navigate(`/dashboard/interviewers/edit/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete this interviewer?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" danger icon={<Trash2 size={16} className="text-red-600" />} />
            </Popconfirm>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={2}>Interviewers</Typography.Title>
          <Typography.Text className="mt-1 text-sm text-gray-500">
            Manage staff members who conduct interviews
          </Typography.Text>
        </div>
        <Button
          type="primary"
          icon={<UserPlus size={16} />}
          onClick={() => navigate('/dashboard/interviewers/new')}
        >
          Add Interviewer
        </Button>
      </div>

      <Card>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <Input
              placeholder="Search interviewers..."
              prefix={<Search size={18} className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select
              options={departmentOptions}
              value={departmentFilter || undefined}
              onChange={(val) => setDepartmentFilter(val || '')}
              className="w-40"
              showSearch
            />
            <Button type="default" icon={<Download size={16} />} onClick={exportToExcel}>
              Export
            </Button>
          </div>
        </div>

        <Table
          dataSource={filteredInterviewers}
          columns={columns}
          rowKey="_id"
          loading={isLoading}
          size="large"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  )
}
