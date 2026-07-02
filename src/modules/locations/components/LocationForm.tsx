import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@apollo/client';
import { AppButton } from '@/components/primitives/AppButton';
import { AppInput } from '@/components/primitives/AppInput';
import { AppSelect } from '@/components/primitives/AppSelect';
import { FormField } from '@/components/patterns/forms/FormField';
import { GET_UNITS_QUERY } from '@/modules/users/services/user.graphql';
import { locationSchema, LocationSchema } from '../schemas/location.schema';
import { LocationFormValues } from '../types';

interface LocationFormProps {
  initialValues?: Partial<LocationFormValues>;
  onSubmit: (values: LocationFormValues) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export const LocationForm = ({ initialValues, onSubmit, onCancel, loading }: LocationFormProps) => {
  const { data: unitsData, loading: unitsLoading } = useQuery(GET_UNITS_QUERY);
  const unitOptions =
    unitsData?.units?.map((unit: any) => ({
      value: unit.id,
      label: `${unit.nama_unit}${unit.kode_unit ? ` (${unit.kode_unit})` : ''}`,
    })) || [];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
  } = useForm<LocationSchema>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      nama_gedung: initialValues?.nama_gedung || '',
      lantai: initialValues?.lantai || '',
      ruangan: initialValues?.ruangan || '',
      kode_lokasi: initialValues?.kode_lokasi || '',
      unit_id: initialValues?.unit_id || '',
    },
  });

  const selectedUnitId = watch('unit_id');

  const handleFormSubmit = async (data: LocationSchema) => {
    await onSubmit(data as LocationFormValues);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* 2-Column Grid for Gedung and Lantai */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="nama_gedung"
          control={control}
          render={({ field }) => (
            <FormField name="nama_gedung" control={control} label="Nama Gedung">
              <AppInput {...field} placeholder="Masukkan nama gedung" />
            </FormField>
          )}
        />

        <Controller
          name="lantai"
          control={control}
          render={({ field }) => (
            <FormField name="lantai" control={control} label="Lantai">
              <AppInput {...field} placeholder="Masukkan lantai" />
            </FormField>
          )}
        />
      </div>

      {/* 2-Column Grid for Ruangan and Kode Lokasi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="ruangan"
          control={control}
          render={({ field }) => (
            <FormField name="ruangan" control={control} label="Ruangan">
              <AppInput {...field} placeholder="Masukkan ruangan" />
            </FormField>
          )}
        />

        <Controller
          name="kode_lokasi"
          control={control}
          render={({ field }) => (
            <FormField name="kode_lokasi" control={control} label="Kode Lokasi">
              <AppInput {...field} placeholder="Masukkan kode lokasi" />
            </FormField>
          )}
        />
      </div>

      {/* Unit Kerja select spanning full width */}
      <Controller
        name="unit_id"
        control={control}
        render={({ field }) => (
          <FormField name="unit_id" control={control} label="Unit Kerja">
            <AppSelect
              {...field}
              options={unitOptions}
              placeholder="Pilih unit kerja"
              disabled={unitsLoading}
            />
          </FormField>
        )}
      />

      {/* Border top separating actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
        {onCancel && (
          <AppButton type="button" variant="outline" onClick={onCancel}>
            Batal
          </AppButton>
        )}
        <AppButton type="submit" variant="primary" loading={loading}>
          Simpan
        </AppButton>
      </div>
    </form>
  );
};