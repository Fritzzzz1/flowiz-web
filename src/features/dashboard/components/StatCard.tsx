import { ReactNode } from 'react';
import { Card } from '@components/ui/Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: string;
}

export function StatCard({ label, value, icon, trend, color = 'text-primary-600' }: StatCardProps) {
  return (
    <Card hoverable>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span
                className={
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                }
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && <div className="text-4xl opacity-20">{icon}</div>}
      </div>
    </Card>
  );
}
