import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  loading?: boolean;
}

export const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  loading = false,
}: ConfirmationDialogProps) => {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error-100 flex items-center justify-center">
          <AlertTriangle className="text-error-600" size={20} />
        </div>
        <p className="text-sm text-gray-600 flex-1 pt-2">{message}</p>
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button onClick={onConfirm} className="btn-danger" disabled={loading}>
          {loading ? 'Deleting...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};
