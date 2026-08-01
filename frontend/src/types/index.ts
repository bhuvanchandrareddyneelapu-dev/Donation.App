export type Role = 'SUPER_ADMIN' | 'FESTIVAL_ADMIN' | 'TREASURER' | 'VOLUNTEER' | 'DONOR';

export type FestivalType = 'GANESH_CHATURTHI' | 'DASARA';

export type PaymentType = 'ONLINE' | 'CASH';

export type PaymentStatus = 'PENDING' | 'VERIFIED' | 'COMPLETED' | 'FAILED';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  token?: string;
}

export interface Festival {
  id: number;
  name: string;
  festivalType: FestivalType;
  bannerUrl?: string;
  idolImageUrl?: string;
  description: string;
  venue: string;
  organizer?: string;
  targetAmount: number;
  currentCollection: number;
  installationDate?: string;
  immersionDate?: string;
  qrCodeUrl?: string;
  active: boolean;
}

export interface Donation {
  id: number;
  festivalId: number;
  festivalName: string;
  donorName: string;
  donorPhone: string;
  donorAddress?: string;
  amount: number;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  transactionId: string;
  receiptNumber?: string;
  qrCodeHash?: string;
  isAnonymous: boolean;
  volunteerName?: string;
  createdAt: string;
}

export interface Expense {
  id: number;
  festivalId?: number;
  category: 'DECORATION' | 'LIGHTING' | 'SOUND' | 'FOOD' | 'STAGE' | 'GENERATOR' | 'MISCELLANEOUS';
  title: string;
  amount: number;
  vendorName: string;
  paidBy: string;
  approvedBy?: string;
  paymentDate: string;
  remarks?: string;
  proofUrl?: string;
}

export interface GalleryImage {
  id: number;
  festivalId: number;
  albumName: string;
  imageUrl: string;
  caption?: string;
  uploadedAt?: string;
}

export interface CommunityPost {
  id: number;
  festivalId: number;
  author: { id: number; name: string };
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  likesCount: number;
  commentsCount: number;
  announcement: boolean;
  createdAt: string;
}

export interface OfflineCashRecord {
  tempId: string;
  festivalId: number;
  donorName: string;
  donorPhone: string;
  donorAddress?: string;
  amount: number;
  remarks?: string;
  recordedAt: string;
  synced: boolean;
}
