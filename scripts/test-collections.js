import assert from 'node:assert/strict';

const sampleData = {
  users: [
    {
      uid: 'u_learner_1',
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      role: 'learner',
      programme: 'Web Development',
      gameHighScore: 12,
      createdAt: '2026-10-08T00:00:00.000Z',
    },
    {
      uid: 'u_lecturer_1',
      displayName: 'Mr. Smith',
      email: 'smith@example.com',
      role: 'lecturer',
      programme: 'Web Development',
      createdAt: '2026-10-08T00:00:00.000Z',
    },
  ],

  tasks: [
    {
      taskId: 'task_1',
      title: 'HTML Frames',
      description: 'Complete the frame activity',
      dueDate: '2026-10-10T00:00:00.000Z',
      priority: 'medium',
      status: 'pending',
      assignedTo: ['u_learner_1'],
      createdBy: 'u_lecturer_1',
      completionPercent: 0,
      resources: ['resource_1'],
      createdAt: '2026-10-08T00:00:00.000Z',
      updatedAt: '2026-10-08T00:00:00.000Z',
    },
    {
      taskId: 'task_2',
      title: 'JavaScript Functions',
      description: 'Complete functions practice',
      dueDate: '2026-10-12T00:00:00.000Z',
      priority: 'high',
      status: 'completed',
      assignedTo: ['u_learner_1'],
      createdBy: 'u_lecturer_1',
      completionPercent: 100,
      resources: ['resource_2'],
      createdAt: '2026-10-08T00:00:00.000Z',
      updatedAt: '2026-10-08T00:00:00.000Z',
    },
  ],

  resources: [
    {
      resourceId: 'resource_1',
      title: 'Frames Guide PDF',
      type: 'pdf',
      storagePath: 'guides/frames.pdf',
      uploadedBy: 'u_lecturer_1',
      tags: ['frames', 'html'],
      downloads: 3,
      createdAt: '2026-10-08T00:00:00.000Z',
    },
    {
      resourceId: 'resource_2',
      title: 'Functions Worksheet',
      type: 'pdf',
      storagePath: 'guides/functions.pdf',
      uploadedBy: 'u_lecturer_1',
      tags: ['javascript', 'functions'],
      downloads: 5,
      createdAt: '2026-10-08T00:00:00.000Z',
    },
  ],

  reports: [
    {
      reportId: 'report_1',
      reportType: 'lecturer',
      ownerId: 'u_lecturer_1',
      date: '2026-10-08T00:00:00.000Z',
      classSummary: {
        totalLearners: 20,
        avgCompletion: 72,
        avgScore: 68,
      },
      breakdown: [
        {
          learnerId: 'u_learner_1',
          learnerName: 'Jane Doe',
          completed: '✓',
          score: 78,
          notes: 'Strong improvement',
        },
      ],
      createdAt: '2026-10-08T00:00:00.000Z',
    },
  ],

  bookings: [
    {
      bookingId: 'booking_1',
      learnerId: 'u_learner_1',
      lecturerId: 'u_lecturer_1',
      taskId: 'task_1',
      startTime: '2026-10-09T10:00:00.000Z',
      endTime: '2026-10-09T11:00:00.000Z',
      status: 'requested',
      notes: 'Needs help with HTML frames',
      createdAt: '2026-10-08T00:00:00.000Z',
    },
  ],

  progressSnapshots: [
    {
      snapshotId: 'user_u_learner_1',
      totalTasks: 2,
      completed: 1,
      outstanding: 1,
      overdue: 0,
      taskAveragePercent: 50,
      gameAveragePercent: 60,
      capturedAt: '2026-10-08T00:00:00.000Z',
    },
  ],

  games: [
    {
      learnerId: 'u_learner_1',
      score: 12,
      playedAt: '2026-10-08T00:00:00.000Z',
    },
  ],

  phases: [
    {
      learnerId: 'u_learner_1',
      phaseName: 'Frame Design',
      completionPercent: 75,
      updatedAt: '2026-10-08T00:00:00.000Z',
    },
  ],
};

function validateUsers() {
  for (const doc of sampleData.users) {
    assert.ok(doc.displayName, 'User missing displayName');
    assert.ok(doc.email, 'User missing email');
    assert.ok(['learner', 'lecturer', 'admin'].includes(doc.role), `Invalid role: ${doc.role}`);
    assert.ok(doc.createdAt, 'User missing createdAt');
  }
}

function validateTasks() {
  for (const doc of sampleData.tasks) {
    assert.ok(doc.title, 'Task missing title');
    assert.ok(doc.dueDate, 'Task missing dueDate');
    assert.ok(Array.isArray(doc.assignedTo), 'Task assignedTo must be an array');
    assert.ok(doc.createdBy, 'Task missing createdBy');
    assert.ok(['pending', 'in_progress', 'completed', 'overdue'].includes(doc.status), `Invalid task status: ${doc.status}`);
    assert.ok(typeof doc.completionPercent === 'number', 'Task completionPercent must be a number');
  }
}

function validateResources() {
  for (const doc of sampleData.resources) {
    assert.ok(doc.title, 'Resource missing title');
    assert.ok(doc.storagePath, 'Resource missing storagePath');
    assert.ok(doc.uploadedBy, 'Resource missing uploadedBy');
    assert.ok(['pdf', 'guide', 'video', 'other'].includes(doc.type) || typeof doc.type === 'string', 'Resource type invalid');
  }
}

function validateReports() {
  for (const doc of sampleData.reports) {
    assert.ok(['lecturer', 'learner', 'class'].includes(doc.reportType), `Invalid reportType: ${doc.reportType}`);
    assert.ok(doc.ownerId, 'Report missing ownerId');
    assert.ok(doc.classSummary, 'Report missing classSummary');
    assert.ok(Array.isArray(doc.breakdown), 'Report breakdown must be an array');
  }
}

function validateBookings() {
  for (const doc of sampleData.bookings) {
    assert.ok(doc.learnerId, 'Booking missing learnerId');
    assert.ok(doc.lecturerId, 'Booking missing lecturerId');
    assert.ok(['requested', 'confirmed', 'cancelled', 'completed'].includes(doc.status), `Invalid booking status: ${doc.status}`);
  }
}

function validateProgressSnapshots() {
  for (const doc of sampleData.progressSnapshots) {
    assert.ok(typeof doc.totalTasks === 'number', 'Progress snapshot totalTasks must be a number');
    assert.ok(typeof doc.completed === 'number', 'Progress snapshot completed must be a number');
    assert.ok(typeof doc.outstanding === 'number', 'Progress snapshot outstanding must be a number');
    assert.ok(typeof doc.overdue === 'number', 'Progress snapshot overdue must be a number');
  }
}

function validateGames() {
  for (const doc of sampleData.games) {
    assert.ok(doc.learnerId, 'Game record missing learnerId');
    assert.ok(typeof doc.score === 'number', 'Game score must be a number');
  }
}

function validatePhases() {
  for (const doc of sampleData.phases) {
    assert.ok(doc.learnerId, 'Phase missing learnerId');
    assert.ok(doc.phaseName, 'Phase missing phaseName');
    assert.ok(typeof doc.completionPercent === 'number', 'Phase completionPercent must be a number');
  }
}

function validatePageQueries() {
  const learnerId = 'u_learner_1';
  const lecturerId = 'u_lecturer_1';

  const learnerTasks = sampleData.tasks.filter((task) => task.assignedTo.includes(learnerId));
  assert.ok(learnerTasks.length > 0, 'Learner should have assigned tasks');

  const lecturerTasks = sampleData.tasks.filter((task) => task.createdBy === lecturerId);
  assert.ok(lecturerTasks.length > 0, 'Lecturer should have created tasks');

  const learnerReport = sampleData.reports.find((report) => report.ownerId === lecturerId);
  assert.ok(learnerReport, 'Lecturer report should exist for lecturer');

  const learnerBooking = sampleData.bookings.find((booking) => booking.learnerId === learnerId);
  assert.ok(learnerBooking, 'Learner should have a booking');

  const resourceList = sampleData.resources;
  assert.ok(resourceList.length >= 1, 'Resources page needs at least one resource');

  const learnerSnapshot = sampleData.progressSnapshots.find((snapshot) => snapshot.snapshotId === 'user_u_learner_1');
  assert.ok(learnerSnapshot, 'Learner progress snapshot should exist');

  const totalTasks = learnerTasks.length;
  const completedTasks = learnerTasks.filter((task) => task.status === 'completed').length;
  assert.ok(totalTasks >= completedTasks, 'Completed count cannot exceed total tasks');
}

function runTests() {
  validateUsers();
  validateTasks();
  validateResources();
  validateReports();
  validateBookings();
  validateProgressSnapshots();
  validateGames();
  validatePhases();
  validatePageQueries();

  console.log('✅ Firestore collection structure passed all validation checks.');
  console.log(`Validated collections: ${Object.keys(sampleData).join(', ')}`);
}

runTests();
