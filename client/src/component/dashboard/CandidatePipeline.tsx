import React from 'react';
import Card from '../ui/Card';

interface PipelineStage {
  id: string;
  name: string;
  count: number;
  color: string;
}

interface CandidatePipelineProps {
  stages: PipelineStage[];
  className?: string;
}

export const CandidatePipeline: React.FC<CandidatePipelineProps> = ({
  stages,
  className = '',
}) => {
  const total = stages.reduce((sum, stage) => sum + stage.count, 0);
  
  return (
    <Card 
      title="Candidate Pipeline" 
      subtitle={`${total} total candidates`}
      className={className}
    >
      <div className="mt-2">
        <div className="flex h-4 mb-6">
          {stages.map((stage) => {
            const width = total > 0 ? `${(stage.count / total) * 100}%` : '0%';
            return (
              <div
                key={stage.id}
                className="first:rounded-l-full last:rounded-r-full"
                style={{ backgroundColor: stage.color, width }}
              />
            );
          })}
        </div>
        
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.id} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: stage.color }} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                  <span className="text-sm text-gray-500">{stage.count}</span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      backgroundColor: stage.color,
                      width: total > 0 ? `${(stage.count / total) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CandidatePipeline;