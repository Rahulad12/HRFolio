import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { interviewData } from '../../types';
import dayjs from 'dayjs';
import { makeCapitilized } from '../../utils/TextAlter';
import { Button, Card, Pagination, Row, Tag } from 'antd';

interface UpcomingInterviewsProps {
  interviews: interviewData[];
  onViewAllClick?: () => void;
  className?: string;
  loading?: boolean;
  error?: string;
}

export const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({
  interviews,
  onViewAllClick,
  className = '',
  loading = false,
  error = '',
}) => {

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3
  if (loading) {
    return (
      <Card title="Upcoming Interviews" className={className}>
        <div className="flex items-center justify-center h-32">
          <p className="text-gray-500">Loading...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Upcoming Interviews" className={className}>
        <div className="flex items-center justify-center h-32">
          <p className="text-red-500">{error}</p>
        </div>
      </Card>
    );
  }

  const todayDate = dayjs().startOf('day');

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }

  const paginatedInterviews = interviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const getInterviewBgClass = (date: string, status: string) => {
    const interviewDate = dayjs(date).startOf('day');
    if (status === 'scheduled' && interviewDate.isBefore(todayDate)) {
      return 'border border-red-200 bg-red-50';
    } else if (interviewDate.isSame(todayDate)) {
      return 'bg-blue-50';
    } else {
      return 'bg-green-50';
    }
  };

  return (
    <Card
      title="Upcoming Interviews"
      loading={loading}
      extra={
        <Button type="link" onClick={onViewAllClick} className="flex justify-end items-end">
          View All
        </Button>
      }
    >
      <div className="space-y-4">
        {paginatedInterviews.length > 0 ? (
          paginatedInterviews.map((interview) => (
            <div
              key={interview._id}
              className={`flex items-start p-3 rounded-lg transition-colors hover:bg-gray-50 ${getInterviewBgClass(interview.date, interview.status)}`}
            >
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <Calendar size={18} />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900 capitalize">{interview?.candidate?.name}</h4>
                  <span className="text-xs text-gray-500">{dayjs(interview?.date).format('MMM DD, YYYY')}</span>
                </div>
                <Tag
                  color={
                    interview.candidate?.level === 'mid'
                      ? 'success'
                      : interview.candidate?.level === 'senior'
                        ? 'primary'
                        : interview.candidate.level === 'junior'
                          ? 'error'
                          : 'info'
                  }
                  className="mt-1"
                >
                  {makeCapitilized(interview.candidate?.level)}
                </Tag>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500 capitalize">With: {interview?.interviewer?.name}</span>
                  <span className="text-xs font-medium text-blue-600">{interview?.time}</span>
                </div>
                <span className="text - xs font-medium">
                  {interview.status}
                </span>
              </div>
            </div >
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No any interviews scheduled</p>
        )}

      </div >
      {interviews.length > 1 && (
        <Row justify="center" className="mt-4">
          <Pagination
            current={currentPage}
            total={interviews.length}
            pageSize={PAGE_SIZE}
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </Row>
      )}
    </Card >
  );
};

export default UpcomingInterviews;