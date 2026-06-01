import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Card, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip, Modal, Form, InputNumber, Typography } from 'antd'
import { Search, Trash2, Star, Plus } from 'lucide-react'
import { useAssignmentList, useSubmitScore, useDeleteAssignment } from '../lib/queries/assessment.queries'
import dayjs from 'dayjs'
import type { Assignment } from '../types/assessment.types'

const { Option } = Select

export function AssignmentTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [scoreModalOpen, setScoreModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [form] = Form.useForm()
  const [api, contextHolder] = notification.useNotification()
  const navigate = useNavigate()

  const { data, isLoading } = useAssignmentList()
  const { mutateAsync: submitScore, isPending: isSubmitting } = useSubmitScore()
  const { mutateAsync: deleteAss } = useDeleteAssignment()

  const filteredData = useMemo(() => {
    const list = data?.data || []
    return list.filter((item) => {
      const candidateName = item.candidate?.name || ''
      const matchesSearch = !searchTerm || candidateName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data, searchTerm, statusFilter])

  const handleScoreSubmit = async (values: { score: number; note: string }) => {
    if (!selectedAssignment) return
    try {
      const res = await submitScore({
        candidate: selectedAssignment.candidate?._id,
        assessment: selectedAssignment.assessment._id,
        score: values.score,
        note: values.note,
      })
      if (res.success) {
        api.success({ message: res.message, placement: 'topRight', duration: 3 })
        setScoreModalOpen(false)
        setSelectedAssignment(null)
        form.resetFields()
      }
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error submitting score', placement: 'topRight', duration: 3 })
    }
  }

  const openScoreModal = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    form.setFieldsValue({ score: assignment.score, note: '' })
    setScoreModalOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange'
      case 'completed': return 'green'
      case 'evaluated': return 'blue'
      default: return 'default'
    }
  }

  const columns = [
    {
      title: 'Candidate',
      dataIndex: ['candidate', 'name'],
      key: 'candidate',
    },
    {
      title: 'Assessment',
      dataIndex: ['assessment', 'title'],
      key: 'assessment',
    },
    {
      title: 'Assigned Date',
      dataIndex: 'assignedDate',
      key: 'assignedDate',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY') : '-',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => date ? dayjs(date).format('MMM D, YYYY') : '-',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score ? `${score}/100` : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Assignment) => (
        <Space>
          <Tooltip title="Evaluate">
            <Button type="link" icon={<Star size={16} />} onClick={() => openScoreModal(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this assignment?"
            onConfirm={async () => {
              try {
                const res = await deleteAss(record._id)
                if (res.success) message.success(res.message)
              } catch {
                message.error('Error deleting assignment')
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="link" icon={<Trash2 size={16} />} danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      {contextHolder}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={2}>Assessment Assignments</Typography.Title>
            <Typography.Text className="mt-1 text-sm text-gray-500">
              Manage and track candidate assessment assignments
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate('/dashboard/assessments/assign')}
          >
            Assign Assessment
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by candidate..."
              prefix={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="Filter by status"
              value={statusFilter || undefined}
              onChange={(val) => setStatusFilter(val || '')}
              allowClear
              style={{ width: 160 }}
            >
              <Option value="pending">Pending</Option>
              <Option value="completed">Completed</Option>
              <Option value="evaluated">Evaluated</Option>
            </Select>
          </div>

          <Table
            dataSource={filteredData}
            columns={columns}
            rowKey="_id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </motion.div>

      <Modal
        title="Evaluate Assessment"
        open={scoreModalOpen}
        onCancel={() => { setScoreModalOpen(false); setSelectedAssignment(null); form.resetFields() }}
        onOk={() => form.submit()}
        confirmLoading={isSubmitting}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleScoreSubmit}>
          <Form.Item name="score" label="Score (0-100)" rules={[{ required: true, message: 'Score is required' }]}>
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea rows={3} placeholder="Optional notes about this assessment" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
