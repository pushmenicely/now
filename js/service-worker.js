'use strict';

/* eslint-env browser, serviceworker */

// importScripts('./scripts/analytics.js');

// self.analytics.trackingId = 'UA-77119321-2';

self.addEventListener('push', function (event) {
  console.log('Received push', event);
  var notificationTitle = 'Hello';
  var notificationOptions = {
    body: 'Thanks for sending this push msg.',
    icon: '/push/img/icon-192x192.png',
    //badge: './images/icon-72x72.png',
    tag: 'simple-push-demo-notification',
    data: {
      url: 'http://www.sexkiste.com'
    }
  };

  if (event.data) {
    var dataText = event.data.text();
    notificationTitle = 'Received Payload';
    notificationOptions.body = 'Push data: \'' + dataText + '\'';
  }

  event.waitUntil(Promise.all([self.registration.showNotification(notificationTitle, notificationOptions)/*, self.analytics.trackEvent('push-received')*/]));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  var clickResponsePromise = Promise.resolve();
  if (event.notification.data && event.notification.data.url) {
    clickResponsePromise = clients.openWindow(event.notification.data.url);
  }

  event.waitUntil(Promise.all([clickResponsePromise/*, self.analytics.trackEvent('notification-click')*/]));
});

self.addEventListener('notificationclose', function (event) {
  //event.waitUntil(Promise.all([self.analytics.trackEvent('notification-close')]));
});
