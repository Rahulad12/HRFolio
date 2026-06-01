import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Table, Button, Card, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip, Typography } from 'antd'
import { Plus, Search, Trash2, Edit3, FileDown } from 'lucide-react'
import { useAssessmentList, useDeleteAssessment } from '../lib/queries/assessment.queries'
import { AssessmentFormModal } from './AssessmentFormModal'
import type { Assessment, AssessmentType } from '../types/assessment.types'

const { Option } = Select

const assessmentTypes: AssessmentType[] = ['mcq', 'coding', 'assignment', 'quiz']
const assessmentTypeColors: Record<AssessmentType, string> = {
  mcq: 'blue',
  coding: 'purple',
  assignment: 'orange',
  quiz: 'cyan',
}

export function AssessmentTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)
  const [api, contextHolder] = notification.useNotification()

  const { data, isLoading } = useAssessmentList()
  const { mutateAsync: deleteAssessment } = useDeleteAssessment()

  const filteredData = useMemo(() => {
    const list = data?.data || []
    return list.filter((item) => {
      const matchesSearch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !typeFilter || item.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [data, searchTerm, typeFilter])

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteAssessment(id)
      if (res.success) message.success(res.message)
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error deleting assessment', placement: 'topRight', duration: 3 })
    }
  }

  const sanitizeCsv = (v: string) => {
    const escaped = v.replace(/"/g, '""')
    return /^[=+\-@\t\r]/.test(escaped) ? `'${escaped}` : escaped
  }

  const handleExport = () => {
    const rows = filteredData.map((item) => ({
      Title: item.title,
      Type: item.type,
      Technology: item.technology,
      Level: item.level,
      Duration: `${item.duration} min`,
    }))
    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map((r) => Object.values(r).map((v) => `"${sanitizeCsv(String(v))}"`).join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'assessments.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: AssessmentType) => (
        <Tag color={assessmentTypeColors[type]} className="capitalize">{type}</Tag>
      ),
    },
    {
      title: 'Technology',
      dataIndex: 'technology',
      key: 'technology',
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => <Tag>{level}</Tag>,
    },
    {
      title: 'Duration (min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Link',
      dataIndex: 'assessmentLink',
      key: 'assessmentLink',
      render: (link: string) => {
        const safe = /^https?:\/\//i.test(link) ? link : '#'
        return <a href={safe} target="_blank" rel="noopener noreferrer">Open</a>
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Assessment) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<Edit3 size={16} />}
              onClick={() => {
                setEditingAssessment(record)
                setFormOpen(true)
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this assessment?"
            onConfirm={() => handleDelete(record._id)}
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
            <Typography.Title level={2}>Assessments</Typography.Title>
            <Typography.Text className="mt-1 text-sm text-gray-500">
              Manage assessment templates for candidate evaluation
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => { setEditingAssessment(null); setFormOpen(true) }}
          >
            New Assessment
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search assessments..."
              prefix={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <div className="flex gap-2">
              <Select
                placeholder="Filter by type"
                value={typeFilter || undefined}
                onChange={(val) => setTypeFilter(val || '')}
                allowClear
                style={{ width: 160 }}
              >
                {assessmentTypes.map((t) => (
                  <Option key={t} value={t} className="capitalize">{t}</Option>
                ))}
              </Select>
              <Tooltip title="Export CSV">
                <Button icon={<FileDown size={16} />} onClick={handleExport}>Export</Button>
              </Tooltip>
            </div>
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

      <AssessmentFormModal
        open={formOpen}
        assessment={editingAssessment}
        onClose={() => { setFormOpen(false); setEditingAssessment(null) }}
      />
    </>
  )
}
