import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, type Messaging } from "firebase/messaging";
import api from "../utils/axios";

// Your web app's Firebase configuration
// Replace these with your project's configuration from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCd0KagQr7AjTbxx7itLwsJZOHepEuGCCU",
  authDomain: "easyscan-46657.firebaseapp.com",
  projectId: "easyscan-46657",
  storageBucket: "easyscan-46657.firebasestorage.app",
  messagingSenderId: "919709446321",
  appId: "1:919709446321:web:6079f0a1391bd3f50ab290",
  measurementId: "G-80Y16977SJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

let messaging: Messaging | null = null;

if (typeof window !== 'undefined') {
  messaging = getMessaging(app);
}

export const requestForToken = async () => {
  if (!messaging) return;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const registration = await navigator.serviceWorker.ready;
      const currentToken = await getToken(messaging, { 
        vapidKey: 'BIMZEiMxSMgFCwzyH7RNQQtMQeo7pdwEiFJxHVzjxwqT0KxFD3MnAak9fgPI016rFqaC_2QbceIA8Z-UVNcRBQY',
        serviceWorkerRegistration: registration
      });
      
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // Save token to backend
        try {
          await api.post('/notifications/token', { 
            fcm_token: currentToken,
            device_type: 'web'
          });
          console.log('Token successfully saved to backend');
        } catch (postError) {
          console.error('Failed to save token to backend:', postError);
        }
        return currentToken;
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = (callback: (payload: any) => void) => {
  if (!messaging) return;
  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    callback(payload);
  });
};

export { messaging };
