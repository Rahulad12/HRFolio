import React from 'react';
import { Card } from 'antd';
interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
}) => {

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start">
        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricsCard;