import { useState } from 'react';
import { AppButton } from '@/components/primitives/AppButton';
import { AppModal } from '@/components/primitives/AppModal';
import { LocationTable } from './LocationTable';
import { LocationFormModal } from './LocationFormModal';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '../hooks/useLocations';
import { locationMapper } from '../mappers/location.mapper';
import { Location, LocationFormValues } from '../types';

export const LocationList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deletingLocationId, setDeletingLocationId] = useState<string | null>(null);

  const { locations, loading: listLoading, refetch } = useLocations(page, 10, search);
  const { createLocation, loading: createLoading } = useCreateLocation();
  const { updateLocation, loading: updateLoading } = useUpdateLocation();
  const { deleteLocation, loading: deleteLoading } = useDeleteLocation();

  const handleCreate = () => {
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingLocationId(id);
  };

  const confirmDelete = async () => {
    if (deletingLocationId) {
      await deleteLocation(deletingLocationId);
      setDeletingLocationId(null);
      refetch();
    }
  };

  const handleFormSubmit = async (values: LocationFormValues) => {
    if (editingLocation) {
      await updateLocation(editingLocation.id, locationMapper.toUpdateInput(values));
    } else {
      await createLocation(locationMapper.toCreateInput(values));
    }
    setIsModalOpen(false);
    refetch();
  };

  const initialValues = editingLocation
    ? {
        nama_gedung: editingLocation.nama_gedung,
        lantai: editingLocation.lantai || '',
        ruangan: editingLocation.ruangan || '',
        kode_lokasi: editingLocation.kode_lokasi || '',
        unit_id: editingLocation.unit_id || '',
      }
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Locations</h1>
        <AppButton onClick={handleCreate}>Add Location</AppButton>
      </div>

      <LocationTable
        data={locations}
        loading={listLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <LocationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        loading={createLoading || updateLoading}
        title={editingLocation ? 'Edit Location' : 'Create Location'}
      />

      <AppModal
        isOpen={!!deletingLocationId}
        onClose={() => setDeletingLocationId(null)}
        title="Delete Location"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this location?</p>
          <div className="flex justify-end space-x-2">
            <AppButton
              variant="outline"
              onClick={() => setDeletingLocationId(null)}
            >
              Cancel
            </AppButton>
            <AppButton
              variant="danger"
              onClick={confirmDelete}
              loading={deleteLoading}
            >
              Delete
            </AppButton>
          </div>
        </div>
      </AppModal>
    </div>
  );
};