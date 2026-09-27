import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV8JT0UsoNqYmQZnLC_R8zU7xe7nkLXM",
  authDomain: "timehouse-26baa.firebaseapp.com",
  projectId: "timehouse-26baa",
  storageBucket: "timehouse-26baa.firebasestorage.app",
  messagingSenderId: "1037650422531",
  appId: "1:1037650422531:web:6ccc85e5f34b2e90b71736",
  measurementId: "G-3GS317T3CP"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;
