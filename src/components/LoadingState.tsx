import { type ReactNode } from 'react';

interface LoadingStateProps {
  text?: string;
  fullScreen?: boolean;
}

export const LoadingState = ({ text = 'Loading...', fullScreen = false }: LoadingStateProps) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );

  if (fullScreen) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">{content}</div>;
  }
  return <div className="flex items-center justify-center py-20">{content}</div>;
};

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-gray-300 mb-4">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
};
