
import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOlAjhagBeoZBJ-2GDlkL6c_AKpoy9m_s",
  authDomain: "skillstrack-bf2af.firebaseapp.com",
  databaseURL: "https://skillstrack-bf2af-default-rtdb.firebaseio.com/",
  projectId: "skillstrack-bf2af",
  storageBucket: "skillstrack-bf2af.appspot.com",
  messagingSenderId: "1063942754746",
  appId: "1:1063942754746:web:e0984e90d57d47d3a78d83",
  measurementId: "G-FPNEK0CJP2"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const rtdb = getDatabase(app);
const auth = getAuth(app);
const storage = getStorage(app);

if (!globalThis.__SKILLSTRACK_FIREBASE__) {
  globalThis.__SKILLSTRACK_FIREBASE__ = { app, db, rtdb, auth, storage };
}

globalThis.app = app;
globalThis.db = db;
globalThis.rtdb = rtdb;
globalThis.auth = auth;
globalThis.storage = storage;

export { app, db, rtdb, auth, storage };
export default app;