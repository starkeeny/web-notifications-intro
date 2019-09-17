// https://web-push-book.gauntface.com/demos/notification-examples/
// https://whatwebcando.today/local-notifications.html

var registeredServiceWorker = null;
var subscription = null;
const logContainer = document.getElementById('logContainer');
const messageContent = document.getElementById('messageContent');

function writeLog(message) {
    console.log(message);
    if(!logContainer.innerHTML) {
        logContainer.innerHTML = "";
    }
    logContainer.innerHTML = logContainer.innerHTML + '<br />\n' + message + '<br/><hr/>'; 
}

// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

function showSimpleMessage() {

    if(Notification.maxActions == 2) {
        // no arrrr
    }

    registeredServiceWorker.showNotification('Arrrrrrrrrr', { 
        body: `Is this alrrrrrrrrright?`,
        actions: [{
            action: 'yes',
            title: 'absolutely',
            icon: './yes.png'
        },{
            action: 'no',
            title: 'nope',
            icon: './no.png'
        }/*,{
            action: 'maybe',
            title: 'arrr',
            icon: './icon.png'
        }*/],
        requireInteraction: true,
        icon: './icon.png' 
    });
}

function sendNotification() {
    fetch('http://localhost:3000/sendNotification?message=' + messageContent.value, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    })
}

window.addEventListener('load', function() {

    if (!('serviceWorker' in navigator)) {
      writeLog(`Service Worker isn't supported on this browser, disable or hide UI.`);
      return;
    }
    
    if (!('PushManager' in window)) {
        writeLog(`Push isn't supported on this browser, disable or hide UI.`);
        return;
    }

    navigator.serviceWorker.addEventListener('message', function(event) {
        writeLog('Received a message from service worker: ' + JSON.stringify(event.data));
    });

    navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
            writeLog('Service worker successfully registered.');
            registeredServiceWorker = registration;

            const applicationServerKey = urlB64ToUint8Array(
                'BAxsqBoOvwZjcoFmdMybEr2MgwsyBkRMEWjylFB8XnhNeCuxPBWNe8XpY-KlhB0G2pheUz7mzJswz6riSr59X-Q'
            );
            
            (async () => {
                const options = { applicationServerKey, userVisibleOnly: true };
                subscription = await registeredServiceWorker.pushManager.subscribe(options);
                writeLog(JSON.stringify(subscription))
                await fetch('http://localhost:3000/register', {
                    method: 'post',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subscription),
                });
            }) ();
        })
        .catch(function(err) {
            writeLog('ERROR: Unable to register service worker. "' + err + '"');
        });

    Notification.requestPermission((result) => {
        writeLog('check <a href="chrome://settings/content/notifications">settings</a>');
        if (result === 'granted') {
            writeLog('notification allowed', result);
        } else {
            writeLog('notification not allowed', result);
        }
    });
});
