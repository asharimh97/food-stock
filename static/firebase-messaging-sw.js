importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

// REPLACE THE BELOW CONFIG WITH YOUR FIREBASE CONFIG ONCE CREATED
// This is required for background push notifications to work.
const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID"
};

try {
  if (firebaseConfig.apiKey) {
    firebase.initializeApp(firebaseConfig);
    const messaging = firebase.messaging();
    
    messaging.onBackgroundMessage((payload) => {
      console.log('[firebase-messaging-sw.js] Received background message ', payload);
      
      const notificationTitle = payload.notification?.title || 'Fridge Update';
      const notificationOptions = {
          body: payload.notification?.body || 'Check your fridge stock.',
          icon: '/favicon.png'
      };
      
      self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
} catch(e) {
  // Config completely missing or Firebase error
}
