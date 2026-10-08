const learners = [
  { name: 'A. Mokoena', tasks: 8, progress: 75, bookings: 1, completed: 6 },
  { name: 'B. Dlamini', tasks: 10, progress: 90, bookings: 0, completed: 9 },
  { name: 'C. Smith', tasks: 7, progress: 57, bookings: 2, completed: 4 },
  { name: 'D. Molefe', tasks: 9, progress: 78, bookings: 1, completed: 7 }
];

const searchInput = document.querySelector('#learnerSearch');
const learnerRows = document.querySelector('#learnerRows');
const emptyState = document.querySelector('#emptyState');

function renderLearners(value = '') {
  const query = value.trim().toLowerCase();
  const matches = learners.filter((learner) => learner.name.toLowerCase().includes(query));
  learnerRows.innerHTML = matches.map((learner) => `
    <tr>
      <td>${learner.name}</td>
      <td>${learner.tasks}</td>
      <td>${learner.progress}%</td>
      <td>${learner.bookings}</td>
      <td>${learner.completed}</td>
    </tr>`).join('');
  emptyState.hidden = matches.length > 0;
  emptyState.textContent = query && matches.length === 0
    ? 'No learner found.'
    : 'Search for a learner to view results.';
}

searchInput.addEventListener('input', (event) => renderLearners(event.target.value));
document.querySelector('#searchForm').addEventListener('submit', (event) => event.preventDefault());
document.querySelector('#backButton').addEventListener('click', () => {
  if (window.history.length > 1) window.history.back();
});

renderLearners();
