import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, PackageX, Boxes, DollarSign } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: 'products' | 'value' | 'low' | 'out';
  trend?: string;
  trendUp?: boolean;
}

const iconMap = {
  products: { Icon: Boxes, bg: 'bg-primary-100', color: 'text-primary-600' },
  value: { Icon: DollarSign, bg: 'bg-accent-100', color: 'text-accent-600' },
  low: { Icon: AlertTriangle, bg: 'bg-warning-100', color: 'text-warning-600' },
  out: { Icon: PackageX, bg: 'bg-error-100', color: 'text-error-600' },
};

export const DashboardCard = ({ title, value, icon, trend, trendUp }: DashboardCardProps) => {
  const { Icon, bg, color } = iconMap[icon];
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trendUp !== undefined &&
                (trendUp ? <TrendingUp size={14} className="text-success-600" /> : <TrendingDown size={14} className="text-error-600" />)}
              <span className={`text-xs font-medium ${trendUp ? 'text-success-600' : 'text-error-600'}`}>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-lg ${bg} flex items-center justify-center`}>
          <Icon className={color} size={22} />
        </div>
      </div>
    </div>
  );
};

export type { DashboardCardProps };
export type IconType = 'products' | 'value' | 'low' | 'out';
