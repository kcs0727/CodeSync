import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCEzvOQUTdbmA9GSUuWZLBTa0R4r4EHp6o",
  authDomain: "codesync-3b178.firebaseapp.com",
  projectId: "codesync-3b178",
  storageBucket: "codesync-3b178.firebasestorage.app",
  messagingSenderId: "177986510738",
  appId: "1:177986510738:web:851783d4575712fcea6b4b",
  measurementId: "G-GVCH2HXZHD"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider= new GoogleAuthProvider();