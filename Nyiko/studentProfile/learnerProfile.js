import '../../firebase.js';
import { get, ref } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js';
import { db, snapshotToList } from '../../firebase.js';

const closeButton = document.querySelector('.close-button');
const scheduledButton = document.querySelector('.scheduled-sessions-button');
const scheduledModal = document.querySelector('#scheduledSessionsModal');
const scheduledList = document.querySelector('#scheduledSessionsList');
const modalClose = document.querySelector('.scheduled-modal-close');
const signOutButton = document.querySelector('.menu-card button:last-of-type');

if (closeButton) {
  closeButton.addEventListener('click', () => {
    window.history.back();
  });
}

if (signOutButton) {
  signOutButton.addEventListener('click', () => {
    window.location.href = '../../src/pages/landing.html';
  });
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('skillsTrackCurrentUser') || '{}');
  } catch (error) {
    return {};
  }
}

async function loadScheduledSessions() {
  if (!scheduledList || !scheduledModal) return;

  const storedUser = getStoredUser();
  const learnerEmail = storedUser.email || '';
  const learnerFullName = storedUser.fullName || '';

  const snapshot = await get(ref(db, 'bookings'));

  const matchingSessions = snapshotToList(snapshot)
    .filter((booking) => booking.status === 'scheduled')
    .filter((booking) => {
      if (learnerEmail && booking.learnerEmail === learnerEmail) return true;
      const bookingFullName = `${booking.learnerName || ''} ${booking.learnerSurname || ''}`.trim();
      return bookingFullName && learnerFullName && bookingFullName.toLowerCase() === learnerFullName.toLowerCase();
    });

  if (!matchingSessions.length) {
    scheduledList.innerHTML = '<li>No scheduled sessions found.</li>';
    return;
  }

  scheduledList.innerHTML = matchingSessions.map((booking) => `
    <li>
      <strong>${booking.topic || 'Support session'}</strong><br />
      Date: ${booking.scheduledDate || booking.preferredDate || 'Not set'}<br />
      Time: ${booking.scheduledTime || 'Not set'}<br />
      Learner: ${booking.learnerName || ''} ${booking.learnerSurname || ''}
    </li>
  `).join('');
}

if (scheduledButton) {
  scheduledButton.addEventListener('click', async () => {
    if (!scheduledModal) return;
    await loadScheduledSessions();
    scheduledModal.hidden = false;
  });
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    if (scheduledModal) {
      scheduledModal.hidden = true;
    }
  });
}

