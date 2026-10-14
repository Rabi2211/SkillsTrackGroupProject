import '../../firebase.js';
import { get, ref } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js';
import { db, snapshotToList } from '../../firebase.js';

const backButton = document.querySelector('.back-button');
const searchForm = document.querySelector('.search-row');
const searchInput = document.getElementById('learnerSearch');
const resultsBody = document.getElementById('learnerResults');

if (backButton) {
  backButton.addEventListener('click', () => {
    window.history.back();
  });
}

function getLearnerName(student) {
  const fullName = [
    student?.fullName,
    student?.name,
    student?.learnerName,
    student?.firstName && student?.lastName ? `${student.firstName} ${student.lastName}` : '',
    student?.firstName,
    student?.lastName,
  ].find((value) => typeof value === 'string' && value.trim());

  return fullName ? fullName.trim() : 'Unnamed learner';
}

function renderResults(learners) {
  if (!resultsBody) return;

  if (!learners.length) {
    resultsBody.innerHTML = '<tr><td colspan="5">No matching learners found.</td></tr>';
    return;
  }

  resultsBody.innerHTML = learners.map((learner) => `
    <tr>
      <td>${learner.name}</td>
      <td>${learner.tasks}</td>
      <td>${learner.progress}%</td>
      <td>${learner.bookings}</td>
      <td>${learner.completed}</td>
    </tr>
  `).join('');
}

async function search() {
  const searchTerm = (searchInput?.value || '').trim().toLowerCase();

  try {
    const [studentsSnapshot, tasksSnapshot, bookingsSnapshot] = await Promise.all([
      get(ref(db, 'students')),
      get(ref(db, 'tasks')),
      get(ref(db, 'bookings')),
    ]);

    const students = snapshotToList(studentsSnapshot);
    const tasks = snapshotToList(tasksSnapshot);
    const bookings = snapshotToList(bookingsSnapshot);

    const learners = students
      .map((student) => {
        const learnerId = student.uid || student.id || student.userId || student.studentId || student.email || '';
        const learnerName = getLearnerName(student);

        const learnerTasks = tasks.filter((task) => {
          const assignedTo = task.assignedTo;
          const learnerEmail = student.email || student.userEmail || '';

          if (Array.isArray(assignedTo)) {
            return assignedTo.some((value) => String(value).toLowerCase() === String(learnerId).toLowerCase() || String(value).toLowerCase() === learnerEmail.toLowerCase());
          }

          return (
            String(assignedTo || '').toLowerCase() === String(learnerId).toLowerCase() ||
            String(task.learnerId || '').toLowerCase() === String(learnerId).toLowerCase() ||
            String(task.assignedToEmail || '').toLowerCase() === learnerEmail.toLowerCase()
          );
        });

        const learnerBookings = bookings.filter((booking) => {
          const learnerEmail = student.email || student.userEmail || '';
          const bookingLearnerName = `${booking.learnerName || ''} ${booking.learnerSurname || ''}`.trim();
          return (
            booking.learnerId === learnerId ||
            booking.userId === learnerId ||
            booking.learnerEmail === learnerEmail ||
            (bookingLearnerName && bookingLearnerName.toLowerCase() === learnerName.toLowerCase())
          );
        });

        const completedTasks = learnerTasks.filter((task) => task.status === 'completed' || task.completed === true || task.done === true).length;
        const totalTasks = learnerTasks.length;
        const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          name: learnerName,
          tasks: totalTasks,
          progress,
          bookings: learnerBookings.length,
          completed: completedTasks,
        };
      })
      .filter((learner) => !searchTerm || learner.name.toLowerCase().includes(searchTerm));

    renderResults(learners);
  } catch (error) {
    console.error('Failed to load learner search results from Realtime Database:', error);
    if (resultsBody) {
      resultsBody.innerHTML = '<tr><td colspan="5">Unable to load learner data right now.</td></tr>';
    }
  }
}

if (searchForm) {
  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    search();
  });
}

if (searchInput) {
  searchInput.addEventListener('input', search);
}

search();
