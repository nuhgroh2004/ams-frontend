import { useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { toast } from '@/lib/toast';
import { CREATE_LOCATION, DELETE_LOCATION, GET_LOCATIONS, UPDATE_LOCATION } from '../graphql/location.graphql';
import { CreateLocationInput, Location, UpdateLocationInput } from '../types';

export const useLocations = (page = 1, limit = 10, search?: string) => {
  const { data, loading, error, refetch } = useQuery(GET_LOCATIONS, {
    variables: { page, limit, search },
    fetchPolicy: 'network-only',
  });

  return {
    locations: data?.locations?.data || [],
    total: data?.locations?.total || 0,
    page: data?.locations?.page || 1,
    limit: data?.locations?.limit || 10,
    totalPages: data?.locations?.totalPages || 0,
    loading,
    error,
    refetch,
  };
};

export const useCreateLocation = () => {
  const [mutate, { loading }] = useMutation(CREATE_LOCATION);

  const createLocation = useCallback(
    async (input: CreateLocationInput) => {
      try {
        const { data } = await mutate({ variables: { input } });
        toast.success('Location created successfully');
        return data.createLocation as Location;
      } catch (error) {
        toast.graphqlError(error);
        throw error;
      }
    },
    [mutate]
  );

  return { createLocation, loading };
};

export const useUpdateLocation = () => {
  const [mutate, { loading }] = useMutation(UPDATE_LOCATION);

  const updateLocation = useCallback(
    async (id: string, input: UpdateLocationInput) => {
      try {
        const { data } = await mutate({ variables: { id, input } });
        toast.success('Location updated successfully');
        return data.updateLocation as Location;
      } catch (error) {
        toast.graphqlError(error);
        throw error;
      }
    },
    [mutate]
  );

  return { updateLocation, loading };
};

export const useDeleteLocation = () => {
  const [mutate, { loading }] = useMutation(DELETE_LOCATION);

  const deleteLocation = useCallback(
    async (id: string) => {
      try {
        await mutate({ variables: { id } });
        toast.success('Location deleted successfully');
        return true;
      } catch (error) {
        toast.graphqlError(error);
        throw error;
      }
    },
    [mutate]
  );

  return { deleteLocation, loading };
};