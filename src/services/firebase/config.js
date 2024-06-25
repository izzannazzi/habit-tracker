// Import the functions you need from the SDKs you need
import { initializeApp  } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_APIKEY,
  authDomain: import.meta.env.VITE_FB_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECTID,
  storageBucket: import.meta.env.VITE_FB_STORAGEBUCKET,
  messagingSenderId: import.meta.VITE_FB_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FB_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
