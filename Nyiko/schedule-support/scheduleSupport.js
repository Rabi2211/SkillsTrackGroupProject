
import '../../firebase.js';
import { get, ref, serverTimestamp, update } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js';
import { db, snapshotToList } from '../../firebase.js';

const scheduleRows = document.querySelector('#scheduleRows');

function getBookingName(booking) {
  const learnerName = booking.learnerName || booking.firstName || booking.fullName || booking.studentName || 'Learner';
  const learnerSurname = booking.learnerSurname || booking.lastName || '';
  return `${learnerName} ${learnerSurname}`.trim();
}

function isPendingBooking(booking) {
  const status = (booking.status || '').toString().trim().toLowerCase();
  return status === '' || status === 'pending';
}

async function loadBookings() {
  if (!scheduleRows) return;

  try {
    const snapshot = await get(ref(db, 'bookings'));
    const pendingBookings = snapshotToList(snapshot).filter(isPendingBooking);

    if (!pendingBookings.length) {
      scheduleRows.innerHTML = '<div class="table-row row"><div class="cell">No pending sessions.</div></div>';
      return;
    }

    scheduleRows.innerHTML = pendingBookings.map((booking) => {
      const learnerDisplayName = getBookingName(booking);
      const dateValue = booking.preferredDate || booking.scheduledDate || 'Not set';
      const timeValue = booking.preferredTime || booking.bookingTime || booking.scheduledTime || 'Not set';
      const topicValue = booking.topic || 'Support session';

      return `
        <div class="table-row row">
          <div class="cell date-cell">${dateValue}</div>
          <div class="cell time-cell">${timeValue}</div>
          <div class="cell learner-input-cell">${learnerDisplayName}</div>
          <div class="cell action-cell">
            <div class="booking-topic">${topicValue}</div>
            <label>
              <input type="checkbox" class="schedule-checkbox" data-id="${booking.id}" />
            </label>
          </div>
        </div>
      `;
    }).join('');

    scheduleRows.querySelectorAll('.schedule-checkbox').forEach((checkbox) => {
      checkbox.addEventListener('change', async (event) => {
        if (!event.target.checked) return;

        const id = event.target.dataset.id;
        const booking = pendingBookings.find((item) => item.id === id);
        if (!booking) return;

        const bookingRef = ref(db, `bookings/${id}`);

        await update(bookingRef, {
          status: 'scheduled',
          scheduledDate: booking.preferredDate || booking.scheduledDate || '',
          scheduledTime: booking.preferredTime || booking.bookingTime || booking.scheduledTime || 'Not set',
          scheduledAt: serverTimestamp(),
          scheduledBy: 'lecturer',
        });

        event.target.disabled = true;
        event.target.closest('.table-row').querySelector('.booking-topic').textContent = 'Scheduled';
        loadBookings();
      });
    });
  } catch (error) {
    console.error('Failed to load bookings:', error);
    scheduleRows.innerHTML = '<div class="table-row row"><div class="cell">Unable to load sessions.</div></div>';
  }
}

loadBookings();
