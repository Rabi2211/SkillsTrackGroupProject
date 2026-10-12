import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore, limit, query } from 'firebase/firestore';

const collectionNames = [
  'users',
  'tasks',
  'resources',
  'reports',
  'bookings',
  'progressSnapshots',
  'games',
  'phases',
];

function loadDotEnv(baseDir) {
  const candidates = ['.env.local', '.env'];

  for (const fileName of candidates) {
    const filePath = path.join(baseDir, fileName);

    if (!existsSync(filePath)) {
      continue;
    }

    const content = readFileSync(filePath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
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

function getConfigValue(name, fallbackNames = []) {
  const keys = [name, ...fallbackNames];
  for (const key of keys) {
    const value = process.env[key];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  return '';
}

function buildFirebaseConfig() {
  const config = {
    apiKey: getConfigValue('VITE_FIREBASE_API_KEY', ['FIREBASE_API_KEY']),
    authDomain: getConfigValue('VITE_FIREBASE_AUTH_DOMAIN', ['FIREBASE_AUTH_DOMAIN']),
    projectId: getConfigValue('VITE_FIREBASE_PROJECT_ID', ['FIREBASE_PROJECT_ID']),
    storageBucket: getConfigValue('VITE_FIREBASE_STORAGE_BUCKET', ['FIREBASE_STORAGE_BUCKET']),
    messagingSenderId: getConfigValue('VITE_FIREBASE_MESSAGING_SENDER_ID', ['FIREBASE_MESSAGING_SENDER_ID']),
    appId: getConfigValue('VITE_FIREBASE_APP_ID', ['FIREBASE_APP_ID']),
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    console.error('Missing Firebase config values:', missing.join(', '));
    console.error('Add them to .env.local or your environment, for example:');
    console.error('VITE_FIREBASE_API_KEY=...');
    console.error('VITE_FIREBASE_AUTH_DOMAIN=...');
    console.error('VITE_FIREBASE_PROJECT_ID=...');
    console.error('VITE_FIREBASE_STORAGE_BUCKET=...');
    console.error('VITE_FIREBASE_MESSAGING_SENDER_ID=...');
    console.error('VITE_FIREBASE_APP_ID=...');
    process.exit(1);
  }

  return config;
}

async function testCollectionAccess(db, collectionName) {
  const ref = collection(db, collectionName);

  try {
    const snapshot = await getDocs(query(ref, limit(1)));
    return {
      name: collectionName,
      status: 'OK',
      docs: snapshot.size,
    };
  } catch (error) {
    return {
      name: collectionName,
      status: 'ERROR',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  loadDotEnv(process.cwd());

  const config = buildFirebaseConfig();
  const app = initializeApp(config);
  const db = getFirestore(app);

  const results = [];
  for (const collectionName of collectionNames) {
    results.push(await testCollectionAccess(db, collectionName));
  }

  console.log('Firebase live collection test results:');
  console.log(JSON.stringify(results, null, 2));

  const failed = results.filter((item) => item.status === 'ERROR');
  if (failed.length) {
    console.error(`Live Firestore test failed for ${failed.length} collection(s).`);
    process.exit(1);
  }

  console.log('✅ All configured Firebase collections are reachable and readable.');
}

main().catch((error) => {
  console.error('Live Firestore test crashed:', error);
  process.exit(1);
});
