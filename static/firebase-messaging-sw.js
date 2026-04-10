importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js');

// REPLACE THE BELOW CONFIG WITH YOUR FIREBASE CONFIG ONCE CREATED
// This is required for background push notifications to work.
const firebaseConfig = {
  apiKey: "AIzaSyA52nm0p05WoL0dYl3037RTD_981qCgOTk",
  authDomain: "fridge-stock-815da.firebaseapp.com",
  projectId: "fridge-stock-815da",
  storageBucket: "fridge-stock-815da.firebasestorage.app",
  messagingSenderId: "835026773296",
  appId: "1:835026773296:web:083cb55016940900b354f5",
  measurementId: "G-1T3760STCL"
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
