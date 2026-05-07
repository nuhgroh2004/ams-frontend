import { CreateLocationInput, Location, UpdateLocationInput, LocationFormValues } from '../types';

export const locationMapper = {
  toCreateInput: (values: LocationFormValues): CreateLocationInput => ({
    nama_gedung: values.nama_gedung,
    lantai: values.lantai || undefined,
    ruangan: values.ruangan || undefined,
    kode_lokasi: values.kode_lokasi || undefined,
    unit_id: values.unit_id || undefined,
  }),

  toUpdateInput: (values: LocationFormValues): UpdateLocationInput => ({
    nama_gedung: values.nama_gedung,
    lantai: values.lantai || undefined,
    ruangan: values.ruangan || undefined,
    kode_lokasi: values.kode_lokasi || undefined,
    unit_id: values.unit_id || undefined,
  }),

  fromFormValues: (values: LocationFormValues): Omit<Location, 'id'> => ({
    nama_gedung: values.nama_gedung,
    lantai: values.lantai,
    ruangan: values.ruangan,
    kode_lokasi: values.kode_lokasi,
    unit_id: values.unit_id,
  }),
};