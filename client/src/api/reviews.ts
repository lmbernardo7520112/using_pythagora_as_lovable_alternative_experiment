import api from './api';
import { Review } from '../types';

// Description: Create a review for a completed booking
// Endpoint: POST /api/reviews
// Request: { bookingId: string, revieweeId: string, rating: number, comment: string }
// Response: { review: Review }
export const createReview = (reviewData: { bookingId: string; revieweeId: string; rating: number; comment: string }) => {
  console.log('Creating review:', reviewData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        review: {
          _id: Date.now().toString(),
          ...reviewData,
          reviewerId: 'current-user',
          reviewer: {
            _id: 'current-user',
            email: 'user@example.com',
            fullName: 'Current User',
            createdAt: '2024-01-01T00:00:00Z'
          },
          reviewee: {
            _id: reviewData.revieweeId,
            email: 'reviewee@example.com',
            fullName: 'Reviewee Name',
            createdAt: '2024-01-01T00:00:00Z'
          },
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/reviews', reviewData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Get reviews for current user
// Endpoint: GET /api/reviews/my-reviews
// Request: {}
// Response: { reviews: Review[] }
export const getMyReviews = () => {
  console.log('Fetching my reviews');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        reviews: [
          {
            _id: '1',
            bookingId: '1',
            reviewerId: 'guest-1',
            reviewer: {
              _id: 'guest-1',
              email: 'guest@example.com',
              fullName: 'Jane Doe',
              profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
              createdAt: '2024-01-01T00:00:00Z'
            },
            revieweeId: 'current-user',
            reviewee: {
              _id: 'current-user',
              email: 'user@example.com',
              fullName: 'Current User',
              createdAt: '2024-01-01T00:00:00Z'
            },
            rating: 5,
            comment: 'Excellent host! The property was exactly as described and John was very responsive to all my questions.',
            status: 'approved',
            createdAt: '2024-02-16T00:00:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/reviews/my-reviews');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};