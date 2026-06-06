import { Card, Row, Col, Typography, Descriptions } from 'antd'
import { ExternalLink } from 'lucide-react'
import type { Candidate } from '../types/candidate.types'

const { Text } = Typography

interface CandidateInfoProps {
  candidate: Candidate | null
  loading?: boolean
}

export function CandidateInfo({ candidate }: CandidateInfoProps) {
  if (!candidate) return null

  return (
    <Card className="rounded-2xl shadow-sm">
      <Row gutter={24}>
        <Col md={16} xs={24}>
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-950 text-3xl capitalize text-white">
              {candidate.name?.charAt(0)}
            </div>
            <div>
              <Typography.Title level={4} className="capitalize">
                {candidate.name}
              </Typography.Title>
              <Typography.Text type="secondary" className="capitalize">
                {candidate.technology}
              </Typography.Text>
            </div>
          </div>

          <Row gutter={16} className="mt-6">
            <Col span={12}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Email">
                  <a href={`mailto:${candidate.email}`}>
                    <Text>{candidate.email}</Text>
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  <a href={`tel:${candidate.phone}`}>
                    <Text>{candidate.phone}</Text>
                  </a>
                </Descriptions.Item>
                <Descriptions.Item label="Experience">
                  {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Resume">
                  {candidate.resume ? (
                    <a
                      href={candidate.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1"
                    >
                      <Text className="flex items-center gap-0.5">
                        View Resume <ExternalLink size={14} />
                      </Text>
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="References">
                  {candidate.references?.length
                    ? candidate.references.map((r, i) => (
                        <div key={i}>
                          {r.name} - {r.contact} - {r.relation}
                        </div>
                      ))
                    : 'No references'}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}
