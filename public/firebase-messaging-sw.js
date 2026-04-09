importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Replace with your project's configuration
const firebaseConfig = {
  apiKey: "AIzaSyCd0KagQr7AjTbxx7itLwsJZOHepEuGCCU",
  authDomain: "easyscan-46657.firebaseapp.com",
  projectId: "easyscan-46657",
  storageBucket: "easyscan-46657.firebasestorage.app",
  messagingSenderId: "919709446321",
  appId: "1:919709446321:web:6079f0a1391bd3f50ab290"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const title = payload.notification?.title || payload.data?.title || 'New Notification';
  const options = {
    body: payload.notification?.body || payload.data?.body || 'You have a new message',
    icon: '/images/logo.jpg',
    data: payload.data,
  };

  self.registration.showNotification(title, options);
});
