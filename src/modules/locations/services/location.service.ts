import { apolloClient } from '@/lib/core/apollo';
import { CREATE_LOCATION, DELETE_LOCATION, GET_LOCATIONS, UPDATE_LOCATION } from '../graphql/location.graphql';
import { CreateLocationInput, Location, LocationListResponse, UpdateLocationInput } from '../types';

export const locationService = {
  async getLocations(page = 1, limit = 10, search?: string): Promise<LocationListResponse> {
    const { data } = await apolloClient.query({
      query: GET_LOCATIONS,
      variables: { page, limit, search },
      fetchPolicy: 'network-only',
    });
    return data.locations;
  },

  async createLocation(input: CreateLocationInput): Promise<Location> {
    const { data } = await apolloClient.mutate({
      mutation: CREATE_LOCATION,
      variables: { input },
    });
    return data.createLocation;
  },

  async updateLocation(id: string, input: UpdateLocationInput): Promise<Location> {
    const { data } = await apolloClient.mutate({
      mutation: UPDATE_LOCATION,
      variables: { id, input },
    });
    return data.updateLocation;
  },

  async deleteLocation(id: string): Promise<boolean> {
    const { data } = await apolloClient.mutate({
      mutation: DELETE_LOCATION,
      variables: { id },
    });
    return data.deleteLocation;
  },
};