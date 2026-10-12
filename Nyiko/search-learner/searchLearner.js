import '../../firebase.js';

const backButton = document.querySelector('.back-button');
const searchForm = document.querySelector('.search-row');

backButton.addEventListener('click', () => {
  window.history.back();
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
});
