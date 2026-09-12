import { useState, useEffect, useCallback } from 'react';
import { pushNotificationService } from '../services/pushNotificationService';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export interface UsePushNotificationsResult {
  isSupported: boolean;
  permission: NotificationPermission | 'unsupported';
  isSubscribed: boolean;
  loading: boolean;
  error: string | null;
  subscribeUser: () => Promise<boolean>;
  unsubscribeUser: () => Promise<boolean>;
  checkSubscriptionState: () => Promise<void>;
}

export const usePushNotifications = (): UsePushNotificationsResult => {
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    isSupported ? Notification.permission : 'unsupported'
  );
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const checkSubscriptionState = useCallback(async () => {
    if (!isSupported) {
      setPermission('unsupported');
      return;
    }

    setPermission(Notification.permission);

    if (Notification.permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
          setIsSubscribed(true);
          // Sync with backend
          const p256dh = existingSub.getKey ? existingSub.getKey('p256dh') : null;
          const auth = existingSub.getKey ? existingSub.getKey('auth') : null;
          if (p256dh && auth) {
            const p256dhBase64 = btoa(String.fromCharCode(...new Uint8Array(p256dh)));
            const authBase64 = btoa(String.fromCharCode(...new Uint8Array(auth)));
            await pushNotificationService.subscribe({
              endpoint: existingSub.endpoint,
              keys: { p256dh: p256dhBase64, auth: authBase64 },
              festivalId: 1,
            }).catch(() => {});
          }
        } else {
          setIsSubscribed(false);
        }
      } catch (e) {
        console.warn('[PushHook] Error checking subscription:', e);
      }
    }
  }, [isSupported]);

  useEffect(() => {
    checkSubscriptionState();
  }, [checkSubscriptionState]);

  const subscribeUser = async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Web Push is not supported in this browser.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Explicitly trigger browser permission dialog on user action
      const permResult = await Notification.requestPermission();
      setPermission(permResult);

      if (permResult !== 'granted') {
        if (permResult === 'denied') {
          setError('Notifications are currently blocked in your browser settings.');
        }
        setLoading(false);
        return false;
      }

      // 2. Register Service Worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // 3. Fetch VAPID Public Key from backend
      const vapidPublicKey = await pushNotificationService.getVapidPublicKey();
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

      // 4. Create Push Subscription
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey as unknown as BufferSource,
        });
      }

      // 5. Send subscription to backend
      const p256dh = subscription.getKey('p256dh');
      const auth = subscription.getKey('auth');
      if (!p256dh || !auth) {
        throw new Error('Failed to retrieve push encryption keys');
      }

      const p256dhBase64 = btoa(String.fromCharCode(...new Uint8Array(p256dh)));
      const authBase64 = btoa(String.fromCharCode(...new Uint8Array(auth)));

      await pushNotificationService.subscribe({
        endpoint: subscription.endpoint,
        keys: { p256dh: p256dhBase64, auth: authBase64 },
        festivalId: 1,
      });

      setIsSubscribed(true);
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('[PushHook] Subscribe error:', err);
      setError(err.message || 'Failed to subscribe to push notifications.');
      setLoading(false);
      return false;
    }
  };

  const unsubscribeUser = async (): Promise<boolean> => {
    if (!isSupported) return false;
    setLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await pushNotificationService.unsubscribe(subscription.endpoint).catch(() => {});
        await subscription.unsubscribe();
      }

      setIsSubscribed(false);
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('[PushHook] Unsubscribe error:', err);
      setError('Failed to unsubscribe.');
      setLoading(false);
      return false;
    }
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    error,
    subscribeUser,
    unsubscribeUser,
    checkSubscriptionState,
  };
};
