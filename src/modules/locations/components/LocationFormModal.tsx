import { useEffect } from 'react';
import { AppModal } from '@/components/primitives/AppModal';
import { LocationForm } from './LocationForm';
import { LocationFormValues } from '../types';

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: LocationFormValues) => void | Promise<void>;
  initialValues?: Partial<LocationFormValues>;
  loading?: boolean;
  title?: string;
}

export const LocationFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  loading,
  title = 'Location',
}: LocationFormModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
    }
  }, [isOpen]);

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
    >
      <LocationForm
        initialValues={initialValues}
        onSubmit={onSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </AppModal>
  );
};