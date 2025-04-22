import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';

interface MetricsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  icon,
  change,
  className = '',
}) => {
  const getTrendIcon = () => {
    if (!change) return null;
    
    if (change.trend === 'up') {
      return <TrendingUp size={16} className="text-green-500" />;
    } else if (change.trend === 'down') {
      return <TrendingDown size={16} className="text-red-500" />;
    }
    return null;
  };

  const getTrendClass = () => {
    if (!change) return '';
    
    if (change.trend === 'up') {
      return 'text-green-500';
    } else if (change.trend === 'down') {
      return 'text-red-500';
    }
    return 'text-gray-500';
  };

  return (
    <Card className={`${className} transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-start">
        <div className="mr-4 bg-blue-100 p-3 rounded-lg">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center ml-2 ${getTrendClass()}`}>
                {getTrendIcon()}
                <span className="text-xs ml-1">
                  {change.value}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MetricsCard;