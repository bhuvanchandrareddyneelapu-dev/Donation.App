import api from './api';

export interface PushSubscribePayload {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  festivalId?: number;
}

export interface PushStatus {
  supported: boolean;
  permission: string;
  subscribed: boolean;
  vapidPublicKey?: string;
}

export const pushNotificationService = {
  getVapidPublicKey: async (): Promise<string> => {
    const res = await api.get<{ publicKey: string }>('/notifications/push/vapid-public-key');
    return res.data.publicKey;
  },

  subscribe: async (payload: PushSubscribePayload): Promise<{ success: boolean; subscribed: boolean }> => {
    const res = await api.post('/notifications/push/subscribe', payload);
    return res.data;
  },

  unsubscribe: async (endpoint: string): Promise<{ success: boolean; subscribed: boolean }> => {
    const res = await api.delete('/notifications/push/unsubscribe', {
      params: { endpoint },
    });
    return res.data;
  },

  getStatus: async (endpoint?: string, permission?: string): Promise<PushStatus> => {
    const res = await api.get<PushStatus>('/notifications/push/status', {
      params: { endpoint, permission },
    });
    return res.data;
  },

  getAdminSubscriberCount: async (festivalId: number = 1): Promise<{ festivalId: number; activeSubscribers: number }> => {
    const res = await api.get<{ festivalId: number; activeSubscribers: number }>('/admin/notifications/push/subscribers-count', {
      params: { festivalId },
    });
    return res.data;
  },

  triggerAdminManualPush: async (notificationId: number): Promise<{ success: boolean; deliveredCount: number }> => {
    const res = await api.post<{ success: boolean; deliveredCount: number }>(`/admin/notifications/${notificationId}/push`);
    return res.data;
  },
};
