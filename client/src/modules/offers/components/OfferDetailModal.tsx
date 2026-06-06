import { Modal, Descriptions, Tag } from 'antd'
import type { Offer, OfferStatus } from '../types/offer.types'

const statusColors: Record<OfferStatus, string> = {
  draft: 'default',
  sent: 'blue',
  accepted: 'green',
  rejected: 'red',
}

interface Props {
  offer: Offer | null
  open: boolean
  onClose: () => void
}

export function OfferDetailModal({ offer, open, onClose }: Props) {
  if (!offer) return null

  return (
    <Modal
      title="Offer Details"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Descriptions column={2} bordered size="small">
        <Descriptions.Item label="Candidate" span={2}>
          {offer.candidate?.name || '-'} ({offer.candidate?.email || '-'})
        </Descriptions.Item>
        <Descriptions.Item label="Position" span={2}>
          {offer.position}
        </Descriptions.Item>
        <Descriptions.Item label="Salary">
          {offer.salary}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={statusColors[offer.status]} className="capitalize">{offer.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Start Date">
          {offer.startDate}
        </Descriptions.Item>
        <Descriptions.Item label="Response Deadline">
          {offer.responseDeadline}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
