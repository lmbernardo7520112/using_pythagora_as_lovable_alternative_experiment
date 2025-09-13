import api from './api';
import { Property, SearchFilters } from '../types';

// Description: Get all published properties with optional filters
// Endpoint: GET /api/properties
// Request: { filters?: SearchFilters }
// Response: { properties: Property[] }
export const getProperties = (filters?: SearchFilters) => {
  console.log('Fetching properties with filters:', filters);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        properties: [
          {
            _id: '1',
            title: 'Modern Downtown Apartment',
            description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views. Perfect for business travelers and digital nomads.',
            address: {
              street: 'Main Street',
              number: '123',
              neighborhood: 'Downtown',
              city: 'San Francisco',
              zipCode: '94102'
            },
            nightlyRate: 150,
            photos: [
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
              'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
              'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
            ],
            amenities: ['WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'Gym'],
            ownerId: '2',
            owner: {
              _id: '2',
              email: 'owner@example.com',
              fullName: 'John Smith',
              profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
              createdAt: '2024-01-01T00:00:00Z'
            },
            status: 'published',
            blockedDates: ['2024-12-25', '2024-12-26'],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          },
          {
            _id: '2',
            title: 'Cozy Studio Near Beach',
            description: 'Charming studio apartment just 2 blocks from the beach. Fully furnished with everything you need for a comfortable stay.',
            address: {
              street: 'Ocean Avenue',
              number: '456',
              neighborhood: 'Sunset District',
              city: 'San Francisco',
              zipCode: '94122'
            },
            nightlyRate: 95,
            photos: [
              'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
              'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
            ],
            amenities: ['WiFi', 'Kitchen', 'Beach Access', 'Pet Friendly'],
            ownerId: '3',
            owner: {
              _id: '3',
              email: 'sarah@example.com',
              fullName: 'Sarah Johnson',
              profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
              createdAt: '2024-01-01T00:00:00Z'
            },
            status: 'published',
            blockedDates: [],
            createdAt: '2024-01-20T00:00:00Z',
            updatedAt: '2024-01-20T00:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/properties', { params: filters });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get a single property by ID
// Endpoint: GET /api/properties/:id
// Request: {}
// Response: { property: Property }
export const getProperty = (id: string) => {
  console.log('Fetching property:', id);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        property: {
          _id: id,
          title: 'Modern Downtown Apartment',
          description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views. Perfect for business travelers and digital nomads. The space features high-end finishes, floor-to-ceiling windows, and access to building amenities including a rooftop terrace and fitness center.',
          address: {
            street: 'Main Street',
            number: '123',
            neighborhood: 'Downtown',
            city: 'San Francisco',
            zipCode: '94102'
          },
          nightlyRate: 150,
          photos: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
            'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
          ],
          amenities: ['WiFi', 'Kitchen', 'Parking', 'Air Conditioning', 'Gym', 'Pool', 'Laundry'],
          ownerId: '2',
          owner: {
            _id: '2',
            email: 'owner@example.com',
            fullName: 'John Smith',
            profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            createdAt: '2024-01-01T00:00:00Z'
          },
          status: 'published',
          blockedDates: ['2024-12-25', '2024-12-26', '2024-12-31', '2025-01-01'],
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/properties/${id}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Create a new property listing
// Endpoint: POST /api/properties
// Request: { property: Partial<Property> }
// Response: { property: Property }
export const createProperty = (propertyData: Partial<Property>) => {
  console.log('Creating property:', propertyData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        property: {
          _id: Date.now().toString(),
          ...propertyData,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/properties', propertyData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update an existing property
// Endpoint: PUT /api/properties/:id
// Request: { property: Partial<Property> }
// Response: { property: Property }
export const updateProperty = (id: string, propertyData: Partial<Property>) => {
  console.log('Updating property:', id, propertyData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        property: {
          _id: id,
          ...propertyData,
          updatedAt: new Date().toISOString()
        }
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/properties/${id}`, propertyData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get properties owned by current user
// Endpoint: GET /api/properties/my-properties
// Request: {}
// Response: { properties: Property[] }
export const getMyProperties = () => {
  console.log('Fetching my properties');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        properties: [
          {
            _id: '1',
            title: 'Modern Downtown Apartment',
            description: 'Beautiful 2-bedroom apartment in the heart of downtown',
            address: {
              street: 'Main Street',
              number: '123',
              neighborhood: 'Downtown',
              city: 'San Francisco',
              zipCode: '94102'
            },
            nightlyRate: 150,
            photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
            amenities: ['WiFi', 'Kitchen', 'Parking'],
            ownerId: 'current-user',
            owner: {
              _id: 'current-user',
              email: 'user@example.com',
              fullName: 'Current User',
              createdAt: '2024-01-01T00:00:00Z'
            },
            status: 'published',
            blockedDates: [],
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/properties/my-properties');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};