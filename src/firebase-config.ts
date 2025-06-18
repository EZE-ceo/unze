// ✅ src/firebase-config.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ Firestore import 추가

const firebaseConfig = {
  apiKey: "AIzaSyCXlzTebvw7tiXo9lYACsss-6A2V5a64G0",
  authDomain: "unze-app.firebaseapp.com",
  projectId: "unze-app",
  storageBucket: "unze-app.appspot.com", // ✅ 올바른 도메인
  messagingSenderId: "371071179661",
  appId: "1:371071179661:web:f1e30957ac5ccff74f7bc4",
  measurementId: "G-X87DTJ8TJZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app); // ✅ Firestore db export 추가
