import React from 'react';
import { Calendar } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { interviewData } from '../../types';
import dayjs from 'dayjs';
import Badge from '../ui/Badge';
import { makeCapitilized } from '../../utils/TextAlter';
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

  return (
    <Card
      title="Upcoming Interviews"
      className={className}
      footer={
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewAllClick}
          >
            View All
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div
              key={interview._id}
              className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <Calendar size={18} />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{interview?.candidate?.name}</h4>
                  <span className="text-xs text-gray-500">{dayjs(interview?.date).format('MMM DD, YYYY')}</span>
                </div>
                <Badge
                  variant={
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
                </Badge>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">With: {interview?.interviewer?.name}</span>
                  <span className="text-xs font-medium text-blue-600">{dayjs(interview?.time).format('hh:mm A')}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No upcoming interviews</p>
        )}
      </div>
    </Card>
  );
};

export default UpcomingInterviews;