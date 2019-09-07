// https://web-push-book.gauntface.com/demos/notification-examples/

var registeredServiceWorker = null;

function showSimpleMessage() {
    registeredServiceWorker.showNotification('H3ll0 W0r1d', {
        body: `var express = require('express'); var app = express();
        app.get('/', function (req, res) {
          res.send('Hello World!');
        });`
      });

}

window.addEventListener('load', function() {

    if (!('serviceWorker' in navigator)) {
      console.log(`Service Worker isn't supported on this browser, disable or hide UI.`);
      return;
    }

    navigator.serviceWorker.addEventListener('message', function(event) {
        console.log('Received a message from service worker: ', event.data);
    });

    navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
            console.log('Service worker successfully registered.');
            registeredServiceWorker = registration;
        })
        .catch(function(err) {
            console.error('Unable to register service worker.', err);
        });


    if (!('PushManager' in window)) {
      console.log(`Push isn't supported on this browser, disable or hide UI.`);
      return;
    }

    Notification.requestPermission((result) => {
        // chrome://settings/content/notifications
        if (result === 'granted') {
            console.log('notification allowed', result);
        } else {
            console.log('notification not allowed', result);
        }
    });

});
