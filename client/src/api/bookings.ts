import api from './api';
import { Booking } from '../types';

// Description: Create a booking request
// Endpoint: POST /api/bookings
// Request: { propertyId: string, checkIn: string, checkOut: string, message?: string }
// Response: { booking: Booking }
export const createBooking = (bookingData: { propertyId: string; checkIn: string; checkOut: string; message?: string }) => {
  console.log('Creating booking:', bookingData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        booking: {
          _id: Date.now().toString(),
          ...bookingData,
          guestId: 'current-user',
          ownerId: 'property-owner',
          totalPrice: 1500,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/bookings', bookingData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get bookings for current user (as guest)
// Endpoint: GET /api/bookings/my-bookings
// Request: {}
// Response: { bookings: Booking[] }
export const getMyBookings = () => {
  console.log('Fetching my bookings');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bookings: [
          {
            _id: '1',
            propertyId: '1',
            property: {
              _id: '1',
              title: 'Modern Downtown Apartment',
              photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
              address: {
                street: 'Main Street',
                number: '123',
                neighborhood: 'Downtown',
                city: 'San Francisco',
                zipCode: '94102'
              }
            },
            guestId: 'current-user',
            guest: {
              _id: 'current-user',
              email: 'user@example.com',
              fullName: 'Current User',
              createdAt: '2024-01-01T00:00:00Z'
            },
            ownerId: 'owner-1',
            owner: {
              _id: 'owner-1',
              email: 'owner@example.com',
              fullName: 'John Smith',
              profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
              createdAt: '2024-01-01T00:00:00Z'
            },
            checkIn: '2024-02-01',
            checkOut: '2024-02-15',
            totalPrice: 2100,
            status: 'approved',
            message: 'Looking forward to staying at your place!',
            createdAt: '2024-01-20T00:00:00Z',
            updatedAt: '2024-01-21T00:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/bookings/my-bookings');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get booking requests for properties owned by current user
// Endpoint: GET /api/bookings/requests
// Request: {}
// Response: { bookings: Booking[] }
export const getBookingRequests = () => {
  console.log('Fetching booking requests');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        bookings: [
          {
            _id: '2',
            propertyId: '1',
            property: {
              _id: '1',
              title: 'Modern Downtown Apartment',
              photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800']
            },
            guestId: 'guest-1',
            guest: {
              _id: 'guest-1',
              email: 'guest@example.com',
              fullName: 'Jane Doe',
              profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
              createdAt: '2024-01-01T00:00:00Z'
            },
            ownerId: 'current-user',
            owner: {
              _id: 'current-user',
              email: 'user@example.com',
              fullName: 'Current User',
              createdAt: '2024-01-01T00:00:00Z'
            },
            checkIn: '2024-03-01',
            checkOut: '2024-03-31',
            totalPrice: 4650,
            status: 'pending',
            message: 'Hi! I would love to stay at your property for a month. I am a digital nomad and work remotely.',
            createdAt: '2024-01-25T00:00:00Z',
            updatedAt: '2024-01-25T00:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/bookings/requests');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Update booking status (approve/decline)
// Endpoint: PUT /api/bookings/:id/status
// Request: { status: 'approved' | 'declined' }
// Response: { booking: Booking }
export const updateBookingStatus = (bookingId: string, status: 'approved' | 'declined') => {
  console.log('Updating booking status:', bookingId, status);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        booking: {
          _id: bookingId,
          status,
          updatedAt: new Date().toISOString()
        }
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/bookings/${bookingId}/status`, { status });
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};