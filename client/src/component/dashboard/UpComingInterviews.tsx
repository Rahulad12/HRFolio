import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { interviewData } from '../../types';
import dayjs from 'dayjs';
import { makeCapitilized } from '../../utils/TextAlter';
import { Button, Card, Pagination, Row, Tag, Typography } from 'antd';

interface UpcomingInterviewsProps {
  interviews: interviewData[];
  onViewAllClick?: () => void;
  className?: string;
  loading?: boolean;
}

export const UpcomingInterviews: React.FC<UpcomingInterviewsProps> = ({
  interviews,
  onViewAllClick,
  className = '',
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 3;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filterInterview = interviews.filter((interview) => {
    const afterDate = dayjs(interview.date).isAfter(dayjs());
    const scheduled = interview.status === 'scheduled';
    return afterDate && scheduled;
  })



  const paginatedInterviews = filterInterview?.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  console.log('All interviews:', interviews);
  console.log('Filtered interviews:', filterInterview);
  console.log('Paginated interviews:', paginatedInterviews);
  return (
    <Card
      title="Upcoming Interviews"
      className={className}
      extra={
        <Button type="link" onClick={onViewAllClick}>
          View All
        </Button>
      }
      loading={loading}
    >
      <div className="space-y-4 flex gap-2 flex-col">
        {paginatedInterviews.length > 0 ? (
          paginatedInterviews.map((interview) => (
            <Card
              key={interview._id}
              className="border border-gray-200"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-700 p-2 rounded-full flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <Typography.Text className="capitalize">
                      {interview?.candidate?.name}
                    </Typography.Text>
                    <span className="text-xs text-gray-500">
                      {dayjs(interview?.date).format('MMM DD, YYYY')}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <Tag
                      color={
                        interview.candidate?.level === 'mid'
                          ? 'success'
                          : interview.candidate?.level === 'senior'
                            ? 'blue'
                            : interview.candidate.level === 'junior'
                              ? 'warning'
                              : 'info'
                      }
                      className="capitalize"
                    >
                      {makeCapitilized(interview.candidate?.level)}
                    </Tag>
                    <span className="text-xs font-medium capitalize">
                      {makeCapitilized(interview.status)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500 capitalize">
                      With: {interview?.interviewer?.name}
                    </span>
                    <span className="text-xs font-medium text-blue-600">
                      {dayjs(interview?.time).format('hh:mm A')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No interviews scheduled</p>
        )}
      </div>

      {interviews.length > PAGE_SIZE && (
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
    </Card>
  );
};

export default UpcomingInterviews;
