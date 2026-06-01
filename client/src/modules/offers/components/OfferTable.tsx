import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Table, Button, Card, Input, Select, Space, Tag, Popconfirm, message, notification, Tooltip, Typography } from 'antd'
import { Plus, Search, Trash2, Edit3, Send, Eye, FileDown } from 'lucide-react'
import { useOfferList, useSendOffer, useDeleteOffer } from '../lib/queries/offer.queries'
import { OfferFormModal } from './OfferFormModal'
import { OfferDetailModal } from './OfferDetailModal'
import type { Offer, OfferStatus } from '../types/offer.types'

const { Option } = Select

const statusColors: Record<OfferStatus, string> = {
  draft: 'default',
  sent: 'blue',
  accepted: 'green',
  rejected: 'red',
}

export function OfferTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [detailOffer, setDetailOffer] = useState<Offer | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [api, contextHolder] = notification.useNotification()

  const { data, isLoading } = useOfferList()
  const { mutateAsync: sendOffer } = useSendOffer()
  const { mutateAsync: deleteOffer } = useDeleteOffer()

  const filteredData = useMemo(() => {
    const list = data?.data || []
    return list.filter((item) => {
      const candidateName = item.candidate?.name || ''
      const matchesSearch = !searchTerm || candidateName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = !statusFilter || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data, searchTerm, statusFilter])

  const handleSend = async (id: string) => {
    try {
      const res = await sendOffer(id)
      if (res.success) api.success({ message: res.message, placement: 'topRight', duration: 3 })
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      api.error({ message: e?.data?.message || 'Error sending offer', placement: 'topRight', duration: 3 })
    }
  }

  const handleExport = () => {
    const rows = filteredData.map((item) => ({
      Candidate: item.candidate?.name || '',
      Position: item.position,
      Salary: item.salary,
      Status: item.status,
      'Start Date': item.startDate,
      Deadline: item.responseDeadline,
    }))
    if (rows.length === 0) return
    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(',')),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'offers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    {
      title: 'Candidate',
      key: 'candidate',
      render: (_: unknown, record: Offer) => record.candidate?.name || '-',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OfferStatus) => (
        <Tag color={statusColors[status]} className="capitalize">{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Offer) => (
        <Space>
          <Tooltip title="View Details">
            <Button type="link" icon={<Eye size={16} />} onClick={() => { setDetailOffer(record); setDetailOpen(true) }} />
          </Tooltip>
          {record.status === 'draft' && (
            <>
              <Tooltip title="Edit">
                <Button type="link" icon={<Edit3 size={16} />} onClick={() => { setEditingOffer(record); setFormOpen(true) }} />
              </Tooltip>
              <Tooltip title="Send Offer">
                <Popconfirm title="Send this offer?" onConfirm={() => handleSend(record._id)} okText="Yes" cancelText="No">
                  <Button type="link" icon={<Send size={16} />} />
                </Popconfirm>
              </Tooltip>
              <Popconfirm
                title="Delete this offer?"
                onConfirm={async () => {
                  try {
                    const res = await deleteOffer(record._id)
                    if (res.success) message.success(res.message)
                  } catch {
                    message.error('Error deleting offer')
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete">
                  <Button type="link" icon={<Trash2 size={16} />} danger />
                </Tooltip>
              </Popconfirm>
            </>
          )}
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
            <Typography.Title level={2}>Offer Letters</Typography.Title>
            <Typography.Text className="mt-1 text-sm text-gray-500">
              Create and manage offer letters for candidates
            </Typography.Text>
          </div>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => { setEditingOffer(null); setFormOpen(true) }}
          >
            New Offer
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
            <div className="flex gap-2">
              <Select
                placeholder="Filter by status"
                value={statusFilter || undefined}
                onChange={(val) => setStatusFilter(val || '')}
                allowClear
                style={{ width: 160 }}
              >
                <Option value="draft">Draft</Option>
                <Option value="sent">Sent</Option>
                <Option value="accepted">Accepted</Option>
                <Option value="rejected">Rejected</Option>
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

      <OfferFormModal
        open={formOpen}
        offer={editingOffer}
        onClose={() => { setFormOpen(false); setEditingOffer(null) }}
      />

      <OfferDetailModal
        offer={detailOffer}
        open={detailOpen}
        onClose={() => { setDetailOpen(false); setDetailOffer(null) }}
      />
    </>
  )
}
