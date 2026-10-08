const form = document.querySelector('#bookingForm');
const topic = document.querySelector('#topic');
const dueDate = document.querySelector('#dueDate');
const description = document.querySelector('#description');
const message = document.querySelector('#message');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!topic.value.trim() || !description.value.trim() || !dueDate.value) {
    message.textContent = 'Please complete all booking fields.';
    return;
  }
  message.textContent = 'Support session request submitted.';
  form.reset();
});

document.querySelector('#backButton').addEventListener('click', () => {
  if (window.history.length > 1) window.history.back();
});
