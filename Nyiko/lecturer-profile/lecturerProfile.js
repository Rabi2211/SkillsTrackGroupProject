import '../../firebase.js';

const closeButton = document.querySelector('.close-button');
const settingsButton = document.getElementById('settingsButton');
const settingsPopup = document.getElementById('settingsPopup');
const closePopupButton = document.getElementById('closePopupButton');

if (settingsButton && settingsPopup) {
  settingsButton.addEventListener('click', () => {
    settingsPopup.hidden = !settingsPopup.hidden;
  });
}

if (closePopupButton && settingsPopup) {
  closePopupButton.addEventListener('click', () => {
    settingsPopup.hidden = true;
  });
}

if (closeButton) {
  closeButton.addEventListener('click', () => {
    window.history.back();
  });
}
