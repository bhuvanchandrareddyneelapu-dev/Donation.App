import api from './api';
import { FestivalNotification, FestivalNotificationRequest } from '../types/notification';

export const notificationService = {
  // Public APIs
  getActiveNotifications: async (festivalId: number = 1): Promise<FestivalNotification[]> => {
    const res = await api.get<FestivalNotification[]>(`/notifications/active?festivalId=${festivalId}`);
    return res.data;
  },

  getTodayNotifications: async (festivalId: number = 1): Promise<FestivalNotification[]> => {
    const res = await api.get<FestivalNotification[]>(`/notifications/today?festivalId=${festivalId}`);
    return res.data;
  },

  getUpcomingNotifications: async (festivalId: number = 1): Promise<FestivalNotification[]> => {
    const res = await api.get<FestivalNotification[]>(`/notifications/upcoming?festivalId=${festivalId}`);
    return res.data;
  },

  // Admin APIs
  getAllNotificationsAdmin: async (festivalId: number = 1): Promise<FestivalNotification[]> => {
    const res = await api.get<FestivalNotification[]>(`/admin/notifications?festivalId=${festivalId}`);
    return res.data;
  },

  createNotification: async (payload: FestivalNotificationRequest): Promise<FestivalNotification> => {
    const res = await api.post<FestivalNotification>('/admin/notifications', payload);
    return res.data;
  },

  updateNotification: async (id: number, payload: FestivalNotificationRequest): Promise<FestivalNotification> => {
    const res = await api.put<FestivalNotification>(`/admin/notifications/${id}`, payload);
    return res.data;
  },

  updateStatus: async (id: number, enabled?: boolean, priority?: string): Promise<FestivalNotification> => {
    const params = new URLSearchParams();
    if (enabled !== undefined) params.append('enabled', String(enabled));
    if (priority !== undefined) params.append('priority', priority);
    const res = await api.patch<FestivalNotification>(`/admin/notifications/${id}/status?${params.toString()}`);
    return res.data;
  },

  deleteNotification: async (id: number): Promise<void> => {
    await api.delete(`/admin/notifications/${id}`);
  },
};
