import { useState } from 'react';
import { AppModal } from '@/components/primitives/AppModal';
import { AppButton } from '@/components/primitives/AppButton';
import { LocationTable } from './LocationTable';
import { LocationFormModal } from './LocationFormModal';
import { useLocations, useCreateLocation, useUpdateLocation, useDeleteLocation } from '../hooks/useLocations';
import { locationMapper } from '../mappers/location.mapper';
import { Location, LocationFormValues } from '../types';
import { PageShell } from '@/components/patterns';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { hasPermissionForUser } from '@/lib/permissions';

export const LocationList = () => {
  const currentUser = useAuthStore((state) => state.user)
  // Per ROLE_MATRIX: Location CRUD = ADMIN_SISTEM only; others are read-only
  const canCreate = hasPermissionForUser(currentUser, 'location:create')
  const canEdit   = hasPermissionForUser(currentUser, 'location:edit')
  const canDelete = hasPermissionForUser(currentUser, 'location:delete')

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
    if (!deletingLocationId) return;
    const success = await deleteLocation(deletingLocationId);
    if (success) {
      setDeletingLocationId(null);
      refetch();
    }
  };

  const handleFormSubmit = async (values: LocationFormValues) => {
    if (editingLocation) {
      const input = locationMapper.toUpdateInput(values);
      await updateLocation(editingLocation.id, input);
    } else {
      const input = locationMapper.toCreateInput(values);
      await createLocation(input);
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
        <LocationTable
          data={locations}
          loading={listLoading}
          onEdit={canEdit ? handleEdit : undefined}
          onDelete={canDelete ? handleDelete : undefined}
          onAdd={canCreate ? handleCreate : undefined}
        />

        <LocationFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialValues={initialValues}
          loading={createLoading || updateLoading}
          title={editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi'}
        />

        <AppModal
          isOpen={!!deletingLocationId}
          onClose={() => setDeletingLocationId(null)}
          title="Hapus Lokasi"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm">Apakah Anda yakin ingin menghapus lokasi ini?</p>
            <div className="flex justify-end gap-2 pt-2">
              <AppButton
                variant="outline"
                onClick={() => setDeletingLocationId(null)}
              >
                Batal
              </AppButton>
              <AppButton
                variant="danger"
                onClick={confirmDelete}
                loading={deleteLoading}
              >
                Hapus
              </AppButton>
            </div>
          </div>
        </AppModal>
      </div>
  );
};