import { ref, update } from 'firebase/database';
import { connectToLiveDatabase } from './live-database.js';

function toTimestamp(dateString) {
  return new Date(dateString).getTime();
}

// Sample records in the same shape the app pages write.
function buildSampleData(uid) {
  return {
    tasks: {
      sample_task_001: {
        title: 'HTML Frames',
        description: 'Complete frame exercise',
        dueDate: '2026-10-10',
        otherInfo: '',
        status: 'pending',
        createdBy: uid,
        createdAt: toTimestamp('2026-10-08T00:00:00.000Z'),
        updatedAt: toTimestamp('2026-10-08T00:00:00.000Z'),
      },
    },
    bookings: {
      sample_booking_001: {
        topic: 'HTML frames',
        preferredDate: '2026-10-09',
        preferredTime: '10:00',
        description: 'Needs help with HTML frames',
        learnerName: 'Sample',
        learnerSurname: 'Learner',
        fullName: 'Sample Learner',
        learnerFullName: 'Sample Learner',
        learnerEmail: 'sample.learner@example.com',
        learnerUid: uid,
        status: 'pending',
        createdAt: toTimestamp('2026-10-08T00:00:00.000Z'),
      },
    },
    gameResults: {
      sample_game_001: {
        learnerUid: uid,
        learnerEmail: 'sample.learner@example.com',
        learnerName: 'Sample Learner',
        score: 12,
        level: 13,
        bestScore: 12,
        completedAt: toTimestamp('2026-10-08T00:00:00.000Z'),
        source: 'memory-game',
      },
    },
  };
}

async function main() {
  const { db, user } = await connectToLiveDatabase();

  for (const [pathName, records] of Object.entries(buildSampleData(user.uid))) {
    for (const [recordId, payload] of Object.entries(records)) {
      await update(ref(db, `${pathName}/${recordId}`), payload);
      console.log(`Updated ${pathName}/${recordId}`);
    }
  }

  console.log('✅ Sample records were written to the Realtime Database without deleting existing data.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Failed to sync the live Realtime Database:', error);
  process.exit(1);
});
