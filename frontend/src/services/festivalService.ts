import api from './api';

export interface CollectionSummary {
  festivalId: number;
  collectedAmount: number;
  targetAmount: number;
  remainingAmount: number;
  percentage: number;
  totalDonationsCount: number;
}

export interface ManualDonationInput {
  festivalId: number;
  donorName: string;
  donorPhone?: string;
  donorEmail?: string;
  donorAddress?: string;
  gotram?: string;
  familyDetails?: string;
  amount: number;
  paymentType: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  remarks?: string;
  publicVisibility: boolean;
  isAnonymous: boolean;
}

export interface DonationUpdateInput {
  donorName?: string;
  donorPhone?: string;
  donorEmail?: string;
  donorAddress?: string;
  gotram?: string;
  familyDetails?: string;
  amount?: number;
  paymentType?: 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'CHEQUE' | 'OTHER';
  remarks?: string;
  publicVisibility?: boolean;
  isAnonymous?: boolean;
  editReason: string;
}

export interface DonationAuditLogItem {
  id: number;
  donationId: number;
  action: string;
  oldAmount: number | null;
  newAmount: number | null;
  reason: string;
  performedBy: string;
  performedAt: string;
}

export const getCollectionSummary = async (festivalId: number = 1): Promise<CollectionSummary> => {
  try {
    const res = await api.get<CollectionSummary>(`/festivals/${festivalId}/collection-summary`);
    return res.data;
  } catch (err) {
    console.error('Failed to fetch collection summary:', err);
    return {
      festivalId,
      collectedAmount: 0,
      targetAmount: 0,
      remainingAmount: 0,
      percentage: 0,
      totalDonationsCount: 0,
    };
  }
};

export const recordManualDonation = async (data: ManualDonationInput) => {
  const res = await api.post('/donations/manual', data);
  return res.data;
};

export const updateDonationRecord = async (id: number, data: DonationUpdateInput) => {
  const res = await api.put(`/donations/${id}`, data);
  return res.data;
};

export const reverseDonationRecord = async (id: number, reason: string) => {
  const res = await api.post(`/donations/${id}/reverse`, { reason });
  return res.data;
};

export const getDonationAuditTrail = async (id: number): Promise<DonationAuditLogItem[]> => {
  const res = await api.get<DonationAuditLogItem[]>(`/donations/${id}/audit-trail`);
  return res.data;
};

export const getAllAuditLogs = async (): Promise<DonationAuditLogItem[]> => {
  const res = await api.get<DonationAuditLogItem[]>('/donations/audit-logs');
  return res.data;
};

export const updateFestivalDetails = async (festivalId: number, data: any) => {
  const res = await api.put(`/festivals/${festivalId}`, data);
  return res.data;
};

export const getFestivalDetails = async (festivalId: number = 1) => {
  const res = await api.get(`/festivals/${festivalId}`);
  return res.data;
};

export const getFestivalDonations = async (festivalId: number = 1) => {
  const res = await api.get(`/donations/festival/${festivalId}`);
  return res.data;
};
