import React from 'react';
import { useAppSelector } from '../../Hooks/hook';
import { Card, Progress, theme } from 'antd';

interface PipelineStage {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface CandidatePipelineProps {
  stages: PipelineStage[];
  className?: string;
  loading?: boolean;
}

export const CandidateByStatus: React.FC<CandidatePipelineProps> = ({
  stages,
  loading = false
}) => {
  const { candidate } = useAppSelector((state) => state.candidate);
  const total = candidate?.length || 0;
  const { token } = theme.useToken();

  return (
    <Card
      title="Candidate By Status"
      loading={loading}
      className="shadow-sm"
      extra={
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-300">Total</span>
          <span className="text-sm text-gray-500 dark:text-gray-300">{total}</span>
        </div>
      }
    >
      <div className="space-y-4">
        {stages.map((stage) => {
          const percent = total > 0 ? (stage.count / total) * 100 : 0;
          return (
            <div key={stage.id} className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span className="text-sm font-medium  ">{stage.name}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{stage.count}</span>
              </div>
              <Progress
                percent={Math.round(percent)}
                showInfo={false}
                strokeColor={stage.color}
                trailColor={token.colorBorderSecondary}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default CandidateByStatus;
