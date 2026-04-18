export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  college?: string;
  isVerified: boolean;
  rating: number;
  photoURL?: string;
  createdAt: any;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deposit: number;
  images: string[];
  status: 'available' | 'rented' | 'removed';
  condition: string;
  location: string;
  createdAt: any;
  ownerName?: string;
  ownerPhoto?: string;
}

export interface Rental {
  id: string;
  listingId: string;
  renterId: string;
  ownerId: string;
  startDate: any;
  endDate: any;
  status: 'requested' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  deposit: number;
  createdAt: any;
  itemTitle?: string;
  itemImage?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  listingId: string;
  lastMessage: string;
  updatedAt: any;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: any;
}
