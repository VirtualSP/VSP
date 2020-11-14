var CACHE_NAME = 'VSPcache198';
var urlsToCache = [
    '/VirtualSPD/index.html',
    '/VirtualSPD/js/app86.js',
    '/VirtualSPD/js/three.min.js',
    '/VirtualSPD/js/musicmetadata.js',
 
    '/VirtualSPD/icon_192.png',
     '/VirtualSPD/icon_512.png'
];

self.addEventListener('install', (e) => {
	console.log('[Service Worker] Install');
	e.waitUntil(
	caches.open(CACHE_NAME).then((cache) => {
          		console.log('[Service Worker] Caching all: app shell and content');
      	return cache.addAll(urlsToCache)
	.then(() => {
          console.info('All files are cached');
          return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
        })
    })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches
        .match(event.request)
        .then(function(response) {
            return response ? response : fetch(event.request);
        })
    );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    (function() {
      caches.keys().then(function(oldCacheKeys) {
        oldCacheKeys
          .filter(function(key) {
            return key !== CACHE_NAME;
          })
          .map(function(key) {
            return caches.delete(key);
          });
      });
      clients.claim();
    })()
  );
});



self.addEventListener('activate', function(event) {
  event.waitUntil(
    (function() {
      caches.keys().then(function(oldCacheKeys) {
        oldCacheKeys
          .filter(function(key) {
            return key !== CACHE_NAME;
          })
          .map(function(key) {
            return caches.delete(key);
          });
      });
      clients.claim();
    })()
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    (function() {
      caches.keys().then(function(oldCacheKeys) {
        oldCacheKeys
          .filter(function(key) {
            return key !== CACHE_NAME;
          })
          .map(function(key) {
            return caches.delete(key);
          });
      });
      clients.claim();
    })()
  );
});