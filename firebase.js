
import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOlAjhagBeoZBJ-2GDlkL6c_AKpoy9m_s",
  authDomain: "skillstrack-bf2af.firebaseapp.com",
  databaseURL: "https://skillstrack-bf2af-default-rtdb.firebaseio.com",
  projectId: "skillstrack-bf2af",
  storageBucket: "skillstrack-bf2af.firebasestorage.app",
  messagingSenderId: "1063942754746",
  appId: "1:1063942754746:web:e0984e90d57d47d3a78d83",
  measurementId: "G-FPNEK0CJP2"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// db is the Realtime Database. Data lives under these top-level paths:
// students/{uid}, lecturers/{uid}, tasks/{id}, bookings/{id},
// resources/{id}, resourceFiles/{id}, gameResults/{id}
const db = getDatabase(app);
const auth = getAuth(app);

// Turns a snapshot of a list path (e.g. "tasks") into [{ id, ...fields }],
// in the order the records were pushed.
function snapshotToList(snapshot) {
  const list = [];
  snapshot.forEach((child) => {
    list.push({ id: child.key, ...child.val() });
  });
  return list;
}

export { app, db, auth, snapshotToList };
export default app;
