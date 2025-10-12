// Service Worker for Sleep Tracker
const CACHE_NAME = 'sleep-tracker-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for sleep reminders
self.addEventListener('sync', (event) => {
  if (event.tag === 'sleep-reminder') {
    event.waitUntil(sendSleepReminder());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Time for your sleep reminder!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'log-sleep',
        title: 'Log Sleep',
        icon: '/favicon.ico'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/favicon.ico'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Sleep Tracker', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'log-sleep') {
    // Open the app to log sleep
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

async function sendSleepReminder() {
  // This would typically check user preferences and send appropriate reminders
  const title = 'Sleep Reminder';
  const options = {
    body: 'Time to start winding down for bed!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'sleep-reminder'
  };

  return self.registration.showNotification(title, options);
}