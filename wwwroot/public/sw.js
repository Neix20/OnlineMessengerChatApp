const cacheName = 'cache-v1';

const image_name = [
    'images/icon-192x192.png',
    'images/icon-256x256.png',
    'images/icon-384x384.png',
    'images/icon-512x512.png'
];

const html_name = [
    '/index.html',
    '/message.html'
];

const js_name = [
    'js/bootstrap.bundle.js',
    'js/jquery-3.5.1.min.js',
    '/socket.io/socket.io.js'
];

const css_name = [
    'css/bootstrap.css',
    'css/bootstrap.css.map'
];

var precacheResources = ['/audio/notification.mp3'];

precacheResources = precacheResources.concat(image_name);
precacheResources = precacheResources.concat(html_name);
precacheResources = precacheResources.concat(js_name);
precacheResources = precacheResources.concat(css_name);

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
});

// TODO 2.6 - Handle the notificationclose event
self.addEventListener('notificationclose', event => {
  const notification = event.notification;
  const primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});


// TODO 2.7 - Handle the notificationclick event
self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;
  var url = "http://localhost:3000/";

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow(url + "message.html");
    notification.close();
  }

});
