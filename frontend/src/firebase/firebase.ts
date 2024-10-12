// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { env } from "~/env";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIRESTORE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIRESTORE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIRESTORE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIRESTORE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIRESTORE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIRESTORE_APP_ID,
  measurementId: env.NEXT_PUBLIC_FIRESTORE_MEASUREMENT_ID,
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
