
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOlAjhagBeoZBJ-2GDlkL6c_AKpoy9m_s",
  authDomain: "skillstrack-bf2af.firebaseapp.com",
  projectId: "skillstrack-bf2af",
  storageBucket: "skillstrack-bf2af.firebasestorage.app",
  messagingSenderId: "1063942754746",
  appId: "1:1063942754746:web:e0984e90d57d47d3a78d83",
  measurementId: "G-FPNEK0CJP2"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);