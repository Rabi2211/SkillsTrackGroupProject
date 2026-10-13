import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Top-level paths the app reads and writes in the Realtime Database.
export const databasePaths = [
  'students',
  'lecturers',
  'tasks',
  'bookings',
  'resources',
  'gameResults',
];

function loadDotEnv(baseDir) {
  for (const fileName of ['.env.local', '.env']) {
    const filePath = path.join(baseDir, fileName);
    if (!existsSync(filePath)) {
      continue;
    }

    for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
        continue;
      }

      const separatorIndex = trimmed.indexOf('=');
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  }
}

function getConfigValue(name) {
  const value = process.env[`VITE_${name}`] || process.env[name] || '';
  return value.trim();
}

function buildFirebaseConfig() {
  const config = {
    apiKey: getConfigValue('FIREBASE_API_KEY'),
    authDomain: getConfigValue('FIREBASE_AUTH_DOMAIN'),
    projectId: getConfigValue('FIREBASE_PROJECT_ID'),
    appId: getConfigValue('FIREBASE_APP_ID'),
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing Firebase config values: ${missing.join(', ')}. ` +
      'Add VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_APP_ID to .env.local.',
    );
  }

  config.databaseURL = getConfigValue('FIREBASE_DATABASE_URL')
    || `https://${config.projectId}-default-rtdb.firebaseio.com`;

  return config;
}

// The database rules only allow signed-in users, so the scripts sign in with
// an existing SkillsTrack account taken from .env.local.
export async function connectToLiveDatabase() {
  loadDotEnv(process.cwd());

  const app = initializeApp(buildFirebaseConfig());
  const email = getConfigValue('FIREBASE_TEST_EMAIL');
  const password = getConfigValue('FIREBASE_TEST_PASSWORD');

  if (!email || !password) {
    throw new Error(
      'Add FIREBASE_TEST_EMAIL and FIREBASE_TEST_PASSWORD (an existing SkillsTrack account) to .env.local. ' +
      'The Realtime Database rules only allow signed-in users.',
    );
  }

  const { user } = await signInWithEmailAndPassword(getAuth(app), email, password);
  return { db: getDatabase(app), user };
}
