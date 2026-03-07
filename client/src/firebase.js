import { initializeApp } from 'firebase/app';
import {getAuth} from "firebase/auth";
// TODO: Replace the following with your app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXooNiOe-LORENzoRzi3Au4e95HvgCVhc",
  authDomain: "clinicauth-24e1f.firebaseapp.com",
  projectId: "clinicauth-24e1f",
  storageBucket: "clinicauth-24e1f.firebasestorage.app",
  messagingSenderId: "283884278256",
  appId: "1:283884278256:web:179078e1d9738214058d35"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);