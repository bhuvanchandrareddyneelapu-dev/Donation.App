// Donation.App Web Push Service Worker (sw.js)
// Production Web Push Notification Handler

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming Web Push notifications from server
self.addEventListener('push', (event) => {
  let data = {
    title: '🚩 Donation.App Festival Update',
    body: 'New festival update from Unicode Estates Ganesh Chaturthi 2026.',
    icon: '/assets/images/unicode-estates-ganesh-idol.png',
    badge: '/assets/images/unicode-estates-ganesh-idol.png',
    data: { actionUrl: '/' }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/assets/images/unicode-estates-ganesh-idol.png',
    badge: data.badge || '/assets/images/unicode-estates-ganesh-idol.png',
    vibrate: [200, 100, 200],
    data: data.data || { actionUrl: '/' },
    actions: [
      { action: 'open', title: 'View Details' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click: focus existing window or open actionUrl
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = (event.notification.data && event.notification.data.actionUrl)
    ? event.notification.data.actionUrl
    : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
