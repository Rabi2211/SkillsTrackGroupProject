import { get, limitToFirst, query, ref } from 'firebase/database';
import { connectToLiveDatabase, databasePaths } from './live-database.js';

async function testPathAccess(db, pathName) {
  try {
    const snapshot = await get(query(ref(db, pathName), limitToFirst(1)));
    return {
      name: pathName,
      status: 'OK',
      hasData: snapshot.exists(),
    };
  } catch (error) {
    return {
      name: pathName,
      status: 'ERROR',
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const { db } = await connectToLiveDatabase();

  const results = [];
  for (const pathName of databasePaths) {
    results.push(await testPathAccess(db, pathName));
  }

  console.log('Firebase Realtime Database test results:');
  console.log(JSON.stringify(results, null, 2));

  const failed = results.filter((item) => item.status === 'ERROR');
  if (failed.length) {
    console.error(`Live Realtime Database test failed for ${failed.length} path(s).`);
    process.exit(1);
  }

  console.log('✅ All Realtime Database paths are reachable and readable.');
  process.exit(0);
}

main().catch((error) => {
  console.error('Live Realtime Database test crashed:', error);
  process.exit(1);
});
