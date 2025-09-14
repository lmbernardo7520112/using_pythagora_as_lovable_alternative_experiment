import api from './api';
import { Property, SearchFilters } from '../types';

// Get all published properties with optional filters
export const getProperties = async (filters?: SearchFilters) => {
  try {
    const response = await api.get('/api/properties', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error((error as any)?.response?.data?.message || (error as Error).message);
  }
};

// Get a single property by ID
export const getProperty = async (id: string) => {
  try {
    const response = await api.get(`/api/properties/${id}`);
    return response.data;
  } catch (error) {
    throw new Error((error as any)?.response?.data?.message || (error as Error).message);
  }
};

// Create a new property listing
export const createProperty = async (propertyData: Partial<Property>) => {
  try {
    const response = await api.post('/api/properties', propertyData);
    return response.data;
  } catch (error) {
    throw new Error((error as any)?.response?.data?.message || (error as Error).message);
  }
};

// Update an existing property
export const updateProperty = async (id: string, propertyData: Partial<Property>) => {
  try {
    const response = await api.put(`/api/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    throw new Error((error as any)?.response?.data?.message || (error as Error).message);
  }
};

// Get properties owned by current user
export const getMyProperties = async () => {
  try {
    const response = await api.get('/api/properties/my-properties');
    return response.data;
  } catch (error) {
    throw new Error((error as any)?.response?.data?.message || (error as Error).message);
  }
};