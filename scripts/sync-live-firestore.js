import { existsSync, readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';

function loadEnv() {
  const envPath = '.env.local';
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
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

function toTimestamp(dateString) {
  return Timestamp.fromDate(new Date(dateString));
}

const canonicalCollections = {
  users: {
    user_001: {
      uid: 'u_learner_1',
      displayName: 'Reabetswe Mashigo',
      email: 'jane@example.com',
      role: 'learner',
      programme: 'Web Development',
      gameHighScore: 12,
      createdAt: toTimestamp('2026-10-08T00:00:00.000Z'),
    },
  },
  tasks: {
    tasks_001: {
      taskId: 'task_1',
      title: 'HTML Frames',
      description: 'Complete frame exercise',
      dueDate: toTimestamp('2026-10-10T00:00:00.000Z'),
      priority: 'medium',
      status: 'pending',
      assignedTo: ['u_learner_1'],
      createdBy: 'u_lecturer_1',
      completionPercent: 0,
      resources: ['resource_1'],
      createdAt: toTimestamp('2026-10-08T00:00:00.000Z'),
      updatedAt: toTimestamp('2026-10-08T00:00:00.000Z'),
    },
  },
  resources: {
    resources_001: {
      resourceId: 'resource_1',
      title: 'Frames Guide PDF',
      type: 'pdf',
      storagePath: 'guides/frames.pdf',
      uploadedBy: 'u_lecturer_1',
      tags: ['frames', 'html'],
      downloads: 3,
      createdAt: toTimestamp('2026-10-08T00:00:00.000Z'),
    },
  },
  reports: {
    reports_001: {
      reportId: 'report_1',
      reportType: 'lecturer',
      ownerId: 'u_lecturer_1',
      date: toTimestamp('2026-10-08T00:00:00.000Z'),
      classSummary: {
        totalLearners: 20,
        avgCompletion: 72,
        avgScore: 68,
      },
      breakdown: [
        {
          learnerId: 'u_learner_1',
          learnerName: 'Reabetswe Mashigo',
          completed: '✓',
          score: 78,
          notes: 'Strong improvement',
        },
      ],
      createdAt: toTimestamp('2026-10-08T00:00:00.000Z'),
    },
  },
  bookings: {
    bookings_001: {
      bookingId: 'booking_1',
      learnerId: 'u_learner_1',
      lecturerId: 'u_lecturer_1',
      taskId: 'task_1',
      startTime: toTimestamp('2026-10-09T10:00:00.000Z'),
      endTime: toTimestamp('2026-10-09T11:00:00.000Z'),
      status: 'requested',
      notes: 'Needs help with HTML frames',
      createdAt: toTimestamp('2026-10-08T00:00:00.000Z'),
    },
  },
  progressSnapshots: {
    user_u_learner_1: {
      snapshotId: 'user_u_learner_1',
      totalTasks: 2,
      completed: 1,
      outstanding: 1,
      overdue: 0,
      taskAveragePercent: 50,
      gameAveragePercent: 60,
      capturedAt: toTimestamp('2026-10-08T00:00:00.000Z'),
    },
  },
  games: {
    game_1: {
      learnerId: 'u_learner_1',
      score: 12,
      playedAt: toTimestamp('2026-10-08T00:00:00.000Z'),
    },
  },
  phases: {
    phase_1: {
      learnerId: 'u_learner_1',
      phaseName: 'Frame Design',
      completionPercent: 75,
      updatedAt: toTimestamp('2026-10-08T00:00:00.000Z'),
    },
  },
};

async function syncCollection(db, collectionName, docs) {
  for (const [docId, payload] of Object.entries(docs)) {
    await setDoc(doc(db, collectionName, docId), payload);
    console.log(`Updated ${collectionName}/${docId}`);
  }
}

async function main() {
  loadEnv();

  const config = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Missing Firebase config values: ${missing.join(', ')}`);
  }

  const app = initializeApp(config);
  const db = getFirestore(app);

  for (const [collectionName, docs] of Object.entries(canonicalCollections)) {
    await syncCollection(db, collectionName, docs);
  }

  console.log('✅ Live Firestore collections were checked and updated to the project schema without deleting existing documents.');
}

main().catch((error) => {
  console.error('Failed to sync live Firestore collections:', error);
  process.exit(1);
});
