import '../../firebase.js';
import { addDoc, collection, serverTimestamp } from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import { auth, db } from '../../firebase.js';

const bookingForm = document.querySelector('#bookingForm');
const bookingMessage = document.querySelector('#bookingMessage');

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('skillsTrackCurrentUser') || '{}');
  } catch (error) {
    return {};
  }
};

const redirectToLogin = () => {
  window.location.href = '../../Patience/log-in-learner/learnerLogin.html';
};

if (bookingForm && bookingMessage) {
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const storedUser = getStoredUser();
    const currentUser = auth.currentUser || (storedUser.uid ? { uid: storedUser.uid, email: storedUser.email } : null);

    if (!currentUser) {
      bookingMessage.textContent = 'You must be logged in to book a support session.';
      setTimeout(redirectToLogin, 1200);
      return;
    }

    const learnerNameInput = document.getElementById('learnerName');
    const learnerSurnameInput = document.getElementById('learnerSurname');
    const bookingTopicInput = document.getElementById('bookingTopic');
    const preferredDateInput = document.getElementById('bookingDate');
    const preferredTimeInput = document.getElementById('bookingTime');
    const descriptionInput = document.getElementById('bookingDescription');

    const topic = (bookingTopicInput?.value || 'your support session').trim();
    const learnerName = (learnerNameInput?.value || '').trim();
    const learnerSurname = (learnerSurnameInput?.value || '').trim();
    const preferredDate = (preferredDateInput?.value || '').trim();
    const preferredTime = (preferredTimeInput?.value || '').trim();
    const description = (descriptionInput?.value || '').trim();

    if (!learnerName || !learnerSurname || !preferredDate || !preferredTime) {
      bookingMessage.textContent = 'Please fill in your name, surname, preferred date and preferred time.';
      return;
    }

    try {
      const fullName = `${learnerName} ${learnerSurname}`.trim();

      await addDoc(collection(db, 'bookings'), {
        topic,
        preferredDate,
        preferredTime,
        description,
        learnerName,
        learnerSurname,
        fullName,
        learnerFullName: fullName,
        learnerEmail: currentUser.email || storedUser.email || '',
        learnerUid: currentUser.uid || storedUser.uid || '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      bookingMessage.textContent = `Your support session for ${topic} has been requested.`;
      bookingForm.reset();
    } catch (error) {
      console.error('Error saving booking:', error);
      bookingMessage.textContent = 'Failed to save booking. Please try again.';
    }
  });
}
