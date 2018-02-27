var cacheName = 'weather-c-v2';
var dataCacheName = 'weatherData-v1';

var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/inline.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];

self.addEventListener('install', function ($event) {
    console.log('Installed');

    $event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                console.log('cacheing service worker');
                cache.addAll(filesToCache);
            })
    )
});

self.addEventListener('activate', function ($event) {
    console.log('sw activated');

    $event.waitUntil(
        caches.keys()
            .then(function (keys) {
                return Promise.all(
                    keys.map(function (key) {
                        if (key !== cacheName && key != dataCacheName) {
                            return caches.delete(key)
                        }
                    })
                )
            })
    )

    return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
    console.log('[Service Worker] Fetch', e.request.url);
    var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
    if (e.request.url.indexOf(dataUrl) > -1) {
      
      e.respondWith(
        caches.open(dataCacheName).then(function(cache) {
          return fetch(e.request).then(function(response){
            cache.put(e.request.url, response.clone());
            return response;
          });
        })
      );
    } else {
      e.respondWith(
        caches.match(e.request).then(function(response) {
          return response || fetch(e.request);
        })
      );
    }
  });

  