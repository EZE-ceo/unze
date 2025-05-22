import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ 추가
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCXlzTebvw7tiXo9lYACsss-6A2V5a64G0",
  authDomain: "unze-app.firebaseapp.com",
  projectId: "unze-app",
  storageBucket: "unze-app.firebasestorage.app",
  messagingSenderId: "371071179661",
  appId: "1:371071179661:web:f1e30957ac5ccff74f7bc4",
  measurementId: "G-X87DTJ8TJZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // ✅ 이 줄 추가
const analytics = getAnalytics(app);
