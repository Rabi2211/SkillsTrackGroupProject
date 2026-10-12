import '../../firebase.js';

const bookingForm = document.querySelector('#bookingForm');
const bookingMessage = document.querySelector('#bookingMessage');

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const topic = formData.get('topic') || 'your support session';
  bookingMessage.textContent = `Your support session for ${topic} has been requested.`;
  bookingForm.reset();
});
