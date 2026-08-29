import { getStockStatus } from '../utils/helpers';

interface StockBadgeProps {
  quantity: number;
  reorderThreshold: number;
  size?: 'sm' | 'md';
}

export const StockBadge = ({ quantity, reorderThreshold, size = 'md' }: StockBadgeProps) => {
  const status = getStockStatus(quantity, reorderThreshold);

  const styles = {
    in: 'bg-success-100 text-success-700',
    low: 'bg-warning-100 text-warning-700',
    out: 'bg-error-100 text-error-700',
  };

  const labels = { in: 'In Stock', low: 'Low Stock', out: 'Out of Stock' };
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return <span className={`badge ${styles[status]} ${sizeClass}`}>{labels[status]}</span>;
};
