import '../../firebase.js';

const closeButton = document.querySelector('.close-button');

closeButton.addEventListener('click', () => {
  window.history.back();
});
