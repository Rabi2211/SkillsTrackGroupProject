
import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOlAjhagBeoZBJ-2GDlkL6c_AKpoy9m_s",
  authDomain: "skillstrack-bf2af.firebaseapp.com",
  projectId: "skillstrack-bf2af",
  storageBucket: "skillstrack-bf2af.firebasestorage.app",
  messagingSenderId: "1063942754746",
  appId: "1:1063942754746:web:e0984e90d57d47d3a78d83",
  measurementId: "G-FPNEK0CJP2"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

if (!globalThis.__SKILLSTRACK_FIREBASE__) {
  globalThis.__SKILLSTRACK_FIREBASE__ = { app, db, auth, storage };
}

globalThis.app = app;
globalThis.db = db;
globalThis.auth = auth;
globalThis.storage = storage;

export { app, db, auth, storage };
export default app;