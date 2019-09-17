// https://web-push-book.gauntface.com/demos/notification-examples/

function sendToWindow(data, event) {
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let clientIsFocused = false;
  
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.focused) {
          clientIsFocused = true;
          break;
        }

        windowClient.postMessage({
            message: 'Received a notification message.',
            time: new Date().toString(),
            data: data
          });
      }
  
      return clientIsFocused;
    });
  }

self.addEventListener('push', function (event) {
    console.log("service-worker:push", event, event.data, event.data.text());
    sendToWindow(event.data.text(), event);

    self.registration.showNotification('push from server', {
      body: event.data.text()
    });
});

self.addEventListener('notificationclick', function (event) {
    console.log("service-worker:notificationClick", event, event.action, event.notification, event.notification.tag);
    sendToWindow({tag:event.notification.tag, action: event.action}, event); // click if both empty
    event.notification.close();
});

self.addEventListener('notificationclose', function (event) {
    console.log("service-worker:notificationClose", event, event.notification);
    sendToWindow("notificationclose", event);
});

// self.addEventListener('message', function (event) {
//     console.log("service-worker:message", 'Received message from page.', event, event.data);
//     self.dispatchEvent(new PushEvent('push', {
//         data: event.data
//     }));
//     sendToWindow(event.data, event);
// });