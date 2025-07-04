import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvSN5SAMYHHWVDfzaHg1WTqXw5V-1MkxA",
  authDomain: "aiinterviewer-85cf3.firebaseapp.com",
  projectId: "aiinterviewer-85cf3",
  storageBucket: "aiinterviewer-85cf3.firebasestorage.app",
  messagingSenderId: "1018003159051",
  appId: "1:1018003159051:web:97907ed78fa537fcc02f0e",
  measurementId: "G-RE1VP0GPVW"
};

// Initialize Firebase
export const app = getApps()?.length ? getApp() : initializeApp(firebaseConfig);
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
