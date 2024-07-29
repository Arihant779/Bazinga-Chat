
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import{ getFirestore} from "firebase/firestore";
import{ getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "bazinga-3b7f9.firebaseapp.com",
  projectId: "bazinga-3b7f9",
  storageBucket: "bazinga-3b7f9.appspot.com",
  messagingSenderId: "353444575718",
  appId: "1:353444575718:web:46d2b1a3f31883bbe67e27"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;