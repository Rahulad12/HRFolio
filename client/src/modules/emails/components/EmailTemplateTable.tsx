import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Table, Button, Card, Input, Select, Space, Tag, Popconfirm, message, Tooltip, Typography } from 'antd'
import { Plus, Search, Edit3, Trash2, Eye } from 'lucide-react'
import { useEmailTemplateList, useDeleteEmailTemplate } from '../lib/queries/email.queries'
import { EmailTemplateFormModal } from './EmailTemplateFormModal'
import { EmailTemplatePreviewModal } from './EmailTemplatePreviewModal'
import type { EmailTemplate, EmailTemplateType } from '../types/email.types'

const { Option } = Select

const typeColors: Record<EmailTemplateType, string> = {
  offer: 'green',
  interview: 'blue',
  assessment: 'purple',
  rejection: 'red',
  other: 'default',
}

export function EmailTemplateTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const { data, isLoading } = useEmailTemplateList()
  const { mutateAsync: deleteTemplate } = useDeleteEmailTemplate()

  const filteredData = useMemo(() => {
    const list = data?.data || []
    return list.filter((item) => {
      const matchesSearch = !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !typeFilter || item.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [data, searchTerm, typeFilter])

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteTemplate(id)
      if (res.success) message.success(res.message)
    } catch {
      message.error('Error deleting template')
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className="capitalize">{name}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: EmailTemplateType) => (
        <Tag color={typeColors[type]} className="capitalize">{type}</Tag>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      ellipsis: true,
    },
    {
      title: 'Variables',
      dataIndex: 'variables',
      key: 'variables',
      render: (variables: string[]) => (
        <Space size={4} wrap>
          {variables.map((v) => (
            <Tag key={v} className="font-mono text-xs">{`{{${v}}}`}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: EmailTemplate) => (
        <Space>
          <Tooltip title="Preview">
            <Button type="link" icon={<Eye size={16} />} onClick={() => { setPreviewTemplate(record); setPreviewOpen(true) }} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="link" icon={<Edit3 size={16} />} onClick={() => { setEditingTemplate(record); setFormOpen(true) }} />
          </Tooltip>
          <Popconfirm
            title="Delete this template?"
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Typography.Title level={2}>Email Templates</Typography.Title>
            <Typography.Text className="mt-1 text-sm text-gray-500">
              Manage email templates for various recruitment communications
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => { setEditingTemplate(null); setFormOpen(true) }}
          >
            New Template
          </Button>
        </div>

        <Card>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search templates..."
              prefix={<Search size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Select
              placeholder="Filter by type"
              value={typeFilter || undefined}
              onChange={(val) => setTypeFilter(val || '')}
              allowClear
              style={{ width: 160 }}
            >
              {(['offer', 'interview', 'assessment', 'rejection', 'other'] as EmailTemplateType[]).map((t) => (
                <Option key={t} value={t} className="capitalize">{t}</Option>
              ))}
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

      <EmailTemplateFormModal
        open={formOpen}
        template={editingTemplate}
        onClose={() => { setFormOpen(false); setEditingTemplate(null) }}
      />

      <EmailTemplatePreviewModal
        template={previewTemplate}
        open={previewOpen}
        onClose={() => { setPreviewOpen(false); setPreviewTemplate(null) }}
      />
    </>
  )
}
