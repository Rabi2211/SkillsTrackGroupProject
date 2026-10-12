
import '../firebase.js';

const scheduleButtons = document.querySelectorAll('.schedule-button');

scheduleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('.table-row');
    const dateInput = row.querySelector('.date-input');
    const timeInput = row.querySelector('.time-input');
    const nameInput = row.querySelector('.name-input');

    const name = nameInput.value.trim();
    if (!/^\p{L}+(?:\s+\p{L}+)*$/u.test(name)) {
      nameInput.setCustomValidity('Enter a learner name using letters only.');
      nameInput.reportValidity();
      return;
    }

    nameInput.setCustomValidity('');
    const date = dateInput.value || 'Not set';
    const time = timeInput.value || 'Not set';

    button.classList.add('scheduled');
    button.innerHTML = '<span class="checkmark">✓</span>';
    button.title = `Scheduled: ${name} on ${date} at ${time}`;
    button.disabled = true;
    button.setAttribute('aria-label', `Scheduled support for ${name}`);
  });
});
