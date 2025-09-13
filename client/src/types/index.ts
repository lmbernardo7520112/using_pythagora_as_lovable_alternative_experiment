export interface User {
  _id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  createdAt: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    zipCode: string;
  };
  nightlyRate: number;
  photos: string[];
  amenities: string[];
  ownerId: string;
  owner: User;
  status: 'draft' | 'published';
  blockedDates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  propertyId: string;
  property: Property;
  guestId: string;
  guest: User;
  ownerId: string;
  owner: User;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'approved' | 'declined' | 'completed';
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  bookingId: string;
  senderId: string;
  sender: User;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Review {
  _id: string;
  bookingId: string;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  reviewee: User;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface SearchFilters {
  checkIn?: string;
  checkOut?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
}