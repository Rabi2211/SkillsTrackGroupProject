import '../firebase.js';

const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const identityParagraphs = document.querySelectorAll('.identity p');
const updateButton = document.querySelector('.update-button');

updateButton.addEventListener('click', () => {
  const nameValue = nameInput.value.trim();
  const emailValue = emailInput.value.trim();

  if (!nameValue || !emailValue) {
    alert('Please complete both fields.');
    return;
  }

  identityParagraphs[0].textContent = `[${nameValue}]`;
  identityParagraphs[1].textContent = `[${emailValue}]`;
});
