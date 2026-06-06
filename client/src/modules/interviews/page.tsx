import { useState } from 'react'
import { Button, Card, Input, Select, Typography, Tabs } from 'antd'
import { Calendar, List, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { InterviewCalendar } from './components/InterviewCalendar'
import { InterviewList } from './components/InterviewList'
import { InterviewSchedule } from './components/InterviewSchedule'

const { Title, Text } = Typography

export function InterviewListPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredStatus, setFilteredStatus] = useState<string>('')

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Title level={2} className="m-0">Interviews</Title>
          <Text>Schedule and manage candidate interviews</Text>
        </div>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => navigate('/dashboard/interviews/schedule')}
          className="flex items-center"
        >
          Schedule Interview
        </Button>
      </div>

      <Card>
        <Tabs
          items={[
            {
              key: 'calendar',
              label: (
                <span className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  Calendar View
                </span>
              ),
              children: <InterviewCalendar />,
            },
            {
              key: 'list',
              label: (
                <span className="flex items-center">
                  <List size={16} className="mr-2" />
                  List View
                </span>
              ),
              children: (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="w-1/3">
                      <Input
                        allowClear
                        prefix={<Search size={16} className="text-gray-400" />}
                        placeholder="Search by candidate name or email"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select
                      allowClear
                      placeholder="Filter by status"
                      className="w-48"
                      value={filteredStatus || undefined}
                      onChange={(val) => setFilteredStatus(val || '')}
                      options={statusOptions}
                    />
                  </div>
                  <InterviewList searchTerm={searchTerm} interviewStatus={filteredStatus} />
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  )
}

export function InterviewSchedulePage() {
  return <InterviewSchedule />
}
