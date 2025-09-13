import api from './api';
import { Message } from '../types';

// Description: Get messages for a specific booking
// Endpoint: GET /api/messages/:bookingId
// Request: {}
// Response: { messages: Message[] }
export const getMessages = (bookingId: string) => {
  console.log('Fetching messages for booking:', bookingId);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        messages: [
          {
            _id: '1',
            bookingId,
            senderId: 'guest-1',
            sender: {
              _id: 'guest-1',
              email: 'guest@example.com',
              fullName: 'Jane Doe',
              profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
              createdAt: '2024-01-01T00:00:00Z'
            },
            content: 'Hi! Thank you for approving my booking. I have a few questions about the property.',
            createdAt: '2024-01-26T10:00:00Z',
            read: true
          },
          {
            _id: '2',
            bookingId,
            senderId: 'current-user',
            sender: {
              _id: 'current-user',
              email: 'user@example.com',
              fullName: 'Current User',
              createdAt: '2024-01-01T00:00:00Z'
            },
            content: 'Hello! Of course, feel free to ask any questions you have.',
            createdAt: '2024-01-26T10:30:00Z',
            read: true
          },
          {
            _id: '3',
            bookingId,
            senderId: 'guest-1',
            sender: {
              _id: 'guest-1',
              email: 'guest@example.com',
              fullName: 'Jane Doe',
              profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
              createdAt: '2024-01-01T00:00:00Z'
            },
            content: 'Is there parking available? And what time can I check in?',
            createdAt: '2024-01-26T11:00:00Z',
            read: false
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get(`/api/messages/${bookingId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};

// Description: Send a message for a booking
// Endpoint: POST /api/messages
// Request: { bookingId: string, content: string }
// Response: { message: Message }
export const sendMessage = (messageData: { bookingId: string; content: string }) => {
  console.log('Sending message:', messageData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: {
          _id: Date.now().toString(),
          ...messageData,
          senderId: 'current-user',
          sender: {
            _id: 'current-user',
            email: 'user@example.com',
            fullName: 'Current User',
            createdAt: '2024-01-01T00:00:00Z'
          },
          createdAt: new Date().toISOString(),
          read: false
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/messages', messageData);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.message || error.message);
  // }
};